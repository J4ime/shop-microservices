const SEQ_URL = 'http://localhost:5341';

type LogLevel = 'Information' | 'Warning' | 'Error';

interface LogEntry {
  Timestamp: string;
  Level: LogLevel;
  MessageTemplate: string;
  Properties?: Record<string, unknown>;
}

let batch: LogEntry[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 2000;
const MAX_BATCH = 20;

function flush() {
  if (batch.length === 0) return;
  const events = [...batch];
  batch = [];
  fetch(`${SEQ_URL}/api/events/raw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Events: events }),
  }).catch((err) => { console.warn('[SeqLogger] Failed to send logs', err); });
}

function enqueue(level: LogLevel, messageTemplate: string, properties?: Record<string, unknown>) {
  const entry: LogEntry = {
    Timestamp: new Date().toISOString(),
    Level: level,
    MessageTemplate: messageTemplate,
    Properties: { ...properties, source: 'backoffice' },
  };
  batch.push(entry);
  if (timer) clearTimeout(timer);
  if (batch.length >= MAX_BATCH) {
    flush();
  } else {
    timer = setTimeout(flush, FLUSH_INTERVAL);
  }
}

export const logger = {
  info: (message: string, properties?: Record<string, unknown>) => {
    console.info(`[INFO] ${message}`, properties ?? '');
    enqueue('Information', message, properties);
  },
  warn: (message: string, properties?: Record<string, unknown>) => {
    console.warn(`[WARN] ${message}`, properties ?? '');
    enqueue('Warning', message, properties);
  },
  error: (message: string, properties?: Record<string, unknown>) => {
    console.error(`[ERROR] ${message}`, properties ?? '');
    enqueue('Error', message, properties);
  },
};
