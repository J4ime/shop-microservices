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

const SERVICES = ['shop-api', 'auth-api', 'shop-postgres', 'auth-postgres'];

app.get('/', (_req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'index.html'));
});

app.get('/api/containers', async (_req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json(containers.filter(c => SERVICES.some(s => c.Names.some(n => n.includes(s)))));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/logs/:name', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.name);
    const stream = await container.logs({
      stdout: true, stderr: true, tail: 500, timestamps: true, follow: false
    });
    let data = '';
    stream.on('data', chunk => { data += chunk.toString('utf8'); });
    stream.on('end', () => res.json(data.split('\n').filter(Boolean)));
    stream.on('error', () => res.status(500).json({ error: 'Stream error' }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const service = url.searchParams.get('service');
  if (!service) { ws.close(); return; }

  const streamLogs = async () => {
    try {
      const container = docker.getContainer(service);
      const stream = await container.logs({
        stdout: true, stderr: true, tail: 200, timestamps: true, follow: true
      });
      stream.on('data', (chunk) => {
        const text = chunk.toString('utf8');
        ws.send(JSON.stringify({ service, message: text.replace(/^\x01?\x00?\x02?/, '') }));
      });
      stream.on('error', () => {});
      ws.on('close', () => stream.destroy());
    } catch (e) {
      ws.send(JSON.stringify({ error: e.message }));
    }
  };

  streamLogs();
});

const PORT = 7000;
server.listen(PORT, () => console.log(`Logs portal on http://localhost:${PORT}`));
