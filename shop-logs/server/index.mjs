import Docker from 'dockerode';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.static(join(__dirname, '..', 'public')));

const SERVICES = ['shop-api', 'auth-api', 'shop-postgres', 'auth-postgres'];

app.get('/', (_req, res) => res.sendFile(join(__dirname, '..', 'public', 'index.html')));

app.get('/api/containers', async (_req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json(containers.filter(c => SERVICES.some(s => c.Names.some(n => n.includes(s)))));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const TS_RE = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)/;

function classifyLine(text) {
  if (/ERR/i.test(text)) return 'ERROR';
  if (/WRN|WARN/i.test(text)) return 'WARN';
  if (/INF|INFO/i.test(text)) return 'INFO';
  if (/DBG|DEBUG|TRCE|TRACE/i.test(text)) return 'DEBUG';
  if (/HTTP|Executed|Executing|Request (start|finish)/i.test(text)) return 'HTTP';
  if (/SQL|Command|DbCommand|Executed DbCommand/i.test(text)) return 'SQL';
  return 'UNKNOWN';
}

function cleanLine(line) {
  let text = line;
  for (let i = 0; i < 5; i++) {
    text = text.replace(/^[\x00-\x08\x0B\x0C\x0E-\x1F]+/g, '').trimStart();
  }
  return text;
}

function stripTs(line) {
  const text = cleanLine(line);
  const m = text.match(TS_RE);
  if (!m) return { ts: null, text };
  const ts = new Date(m[1]);
  const clean = cleanLine(text.slice(m.index + m[0].length));
  return { ts, text: clean || text.slice(m.index + m[0].length).trim() };
}

function parseLogs(data, service) {
  return data.split('\n').filter(Boolean).map(line => {
    const { ts, text } = stripTs(line);
    const level = classifyLine(text);
    return { service, level, message: text, time: ts ? ts.toISOString() : null, ts: ts ? ts.getTime() : null };
  });
}

app.get('/api/logs/:name', async (req, res) => {
  try {
    const service = req.params.name;
    const container = docker.getContainer(service);
    const tail = parseInt(req.query.tail) || 500;
    const since = req.query.since ? parseInt(req.query.since) : undefined;
    const until = req.query.until ? parseInt(req.query.until) : undefined;
    const sinceMs = req.query.sinceMin ? parseInt(req.query.sinceMin) : null;
    const untilMs = req.query.untilMax ? parseInt(req.query.untilMax) : null;

    const opts = { stdout: true, stderr: true, tail, timestamps: true, follow: false };
    if (since) opts.since = since;
    if (until) opts.until = until;

    const logs = await container.logs(opts);
    const data = Buffer.isBuffer(logs) ? logs.toString('utf8') : logs;
    const parsed = parseLogs(data, service);

    let result = parsed;
    if (sinceMs || untilMs) {
      result = parsed.filter(p => {
        if (p.ts === null) return false;
        if (sinceMs && p.ts < sinceMs) return false;
        if (untilMs && p.ts > untilMs) return false;
        return true;
      });
    }

    result.sort((a, b) => {
      if (a.ts === null && b.ts === null) return 0;
      if (a.ts === null) return 1;
      if (b.ts === null) return -1;
      return b.ts - a.ts;
    });

    res.json(result.map(({ ts: _ts, ...rest }) => rest));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const service = url.searchParams.get('service');
  const levelFilter = url.searchParams.get('level') || '';
  const since = url.searchParams.get('since');
  if (!service) { ws.close(); return; }

  const streamLogs = async () => {
    try {
      const container = docker.getContainer(service);
      const opts = { stdout: true, stderr: true, tail: 200, timestamps: true, follow: true };
      if (since) opts.since = parseInt(since);

      const stream = await container.logs(opts);
      stream.on('data', (chunk) => {
        let text = chunk.toString('utf8').replace(/^[\x00-\x08\x0B\x0C\x0E-\x1F]+/, '').trim();
        if (!text) return;

        const { ts, text: clean } = stripTs(text);
        const level = classifyLine(clean);

        if (levelFilter && levelFilter !== 'ALL' && level !== levelFilter) return;

        ws.send(JSON.stringify({ service, level, message: clean, time: ts ? ts.toISOString() : null, ts: ts ? ts.getTime() : null }));
      });
      stream.on('error', () => {});
      ws.on('close', () => stream.destroy());
    } catch (e) { ws.send(JSON.stringify({ error: e.message })); }
  };

  streamLogs();
});

const PORT = 7000;
server.listen(PORT, () => console.log('Logs portal on http://localhost:' + PORT));
