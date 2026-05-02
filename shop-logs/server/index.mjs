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

app.get('/api/logs/:name', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.name);
    const tail = parseInt(req.query.tail) || 500;
    const stream = await container.logs({ stdout: true, stderr: true, tail, timestamps: true, follow: false });
    let data = '';
    stream.on('data', chunk => { data += chunk.toString('utf8'); });
    stream.on('end', () => {
      const lines = data.split('\n').filter(Boolean).map(line => {
        let level = 'UNKNOWN';
        if (/ERR/i.test(line)) level = 'ERROR';
        else if (/WRN|WARN/i.test(line)) level = 'WARN';
        else if (/INF|INFO/i.test(line)) level = 'INFO';
        else if (/DBG|DEBUG|TRCE|TRACE/i.test(line)) level = 'DEBUG';
        else if (/HTTP|Executed|Executing|Request (start|finish)/i.test(line)) level = 'HTTP';
        else if (/SQL|Command|DbCommand|Executed DbCommand/i.test(line)) level = 'SQL';
        return { level, message: line };
      });
      res.json(lines);
    });
    stream.on('error', () => res.status(500).json({ error: 'Stream error' }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const service = url.searchParams.get('service');
  const levelFilter = url.searchParams.get('level') || '';
  if (!service) { ws.close(); return; }

  const streamLogs = async () => {
    try {
      const container = docker.getContainer(service);
      const stream = await container.logs({ stdout: true, stderr: true, tail: 200, timestamps: true, follow: true });
      stream.on('data', (chunk) => {
        let text = chunk.toString('utf8').replace(/^[\x00-\x08\x0B\x0C\x0E-\x1F]+/, '').trim();
        if (!text) return;

        let level = 'UNKNOWN';
        if (/ERR/i.test(text)) level = 'ERROR';
        else if (/WRN|WARN/i.test(text)) level = 'WARN';
        else if (/INF|INFO/i.test(text)) level = 'INFO';
        else if (/DBG|DEBUG|TRCE|TRACE/i.test(text)) level = 'DEBUG';
        else if (/HTTP|Executed|Executing|Request (start|finish)/i.test(text)) level = 'HTTP';
        else if (/SQL|Command|DbCommand/i.test(text)) level = 'SQL';

        if (levelFilter && levelFilter !== 'ALL' && level !== levelFilter) return;

        ws.send(JSON.stringify({ service, level, message: text }));
      });
      stream.on('error', () => {});
      ws.on('close', () => stream.destroy());
    } catch (e) { ws.send(JSON.stringify({ error: e.message })); }
  };

  streamLogs();
});

const PORT = 7000;
server.listen(PORT, () => console.log(`Logs portal on http://localhost:${PORT}`));
