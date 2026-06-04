import express from 'express';
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { createServer } from 'http';
import QR from 'qrcode';
import pino from 'pino';

const PORT = parseInt(process.env.PORT || '3002');
const SESSIONS_DIR = process.env.SESSIONS_DIR || './sessions';
const BACKEND_WEBHOOK = process.env.BACKEND_WEBHOOK_URL || 'http://host.docker.internal:3001/whatsapp/webhook';

if (!existsSync(SESSIONS_DIR)) mkdirSync(SESSIONS_DIR, { recursive: true });

const app = express();
app.use(express.json({ limit: '5mb' }));

const sessions = new Map();
const pendingMessages = [];
const reconnectCount = new Map();

function getDir(sessionId) {
  const d = `${SESSIONS_DIR}/${sessionId}`;
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
  return d;
}

async function forwardToBackend(data) {
  try {
    const resp = await fetch(BACKEND_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!resp.ok) console.error(`Webhook failed: ${resp.status}`);
  } catch (e) {
    console.error(`Webhook error: ${e.message}`);
  }
}

async function createSession(sessionId) {
  const existing = sessions.get(sessionId);
  if (existing?.user) return existing;
  if (existing && existing._creating) return existing;

  const dir = getDir(sessionId);
  const credsFile = `${dir}/creds.json`;

  // If already registered, check creds for me (user) field
  if (existsSync(credsFile)) {
    try {
      const creds = JSON.parse(readFileSync(credsFile, 'utf-8'));
      if (creds?.me?.id) {
        // Already authenticated, just create a new socket with existing creds
        console.log(`[${sessionId}] Restoring authenticated session for ${creds.me.id}`);
      }
    } catch {}
  }

  const { state, saveCreds } = await useMultiFileAuthState(dir);

  // After loading state, check if already registered
  if (state.creds?.me?.id) {
    console.log(`[${sessionId}] Auth state has me=${state.creds.me.id}`);
  }

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '22.04'],
    connectTimeoutMs: 30000,
    keepAliveIntervalMs: 15000,
    defaultQueryTimeoutMs: 60000,
  });
  sock._sessionId = sessionId;
  sock._creating = true;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log(`[${sessionId}] QR code generated`);
      writeFileSync(`${getDir(sessionId)}/qr.txt`, qr);
    } else {
      const qrFile = `${getDir(sessionId)}/qr.txt`;
      if (existsSync(qrFile)) try { writeFileSync(qrFile, ''); } catch {}
    }

    if (connection === 'close') {
      sock._creating = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode || 500;
      const errorMsg = lastDisconnect?.error?.message || lastDisconnect?.error?.toString() || 'unknown';
      const isLoggedOut = statusCode === DisconnectReason.loggedOut;
      const isConflict = statusCode === DisconnectReason.connectionReplaced;
      const wasConnected = !!sock.user;
      sessions.delete(sessionId);
      console.log(`[${sessionId}] Closed: reason=${statusCode} isLoggedOut=${isLoggedOut} wasConnected=${wasConnected} error=${errorMsg}`);

      if (isLoggedOut || isConflict) {
        console.log(`[${sessionId}] ${isLoggedOut ? 'Logged out' : 'Conflict — session invalid'}`);
        const dir = getDir(sessionId);
        try { writeFileSync(`${dir}/creds.json`, ''); } catch {}
        reconnectCount.delete(sessionId);
        return;
      }

      if (!wasConnected) {
        console.log(`[${sessionId}] Not authenticated yet, won't auto-reconnect`);
        return;
      }

      const count = (reconnectCount.get(sessionId) || 0) + 1;
      reconnectCount.set(sessionId, count);
      if (count > 10) {
        console.log(`[${sessionId}] Max reconnects reached, giving up`);
        return;
      }
      console.log(`[${sessionId}] Reconnecting in 2s... (attempt ${count})`);
      setTimeout(() => createSession(sessionId), 2000);
    }

    if (connection === 'open') {
      sock._creating = false;
      console.log(`[${sessionId}] Connected as ${sock.user?.id}`);
      reconnectCount.delete(sessionId);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (msg.key?.fromMe) continue;
      if (!msg.message?.conversation && !msg.message?.extendedTextMessage?.text) continue;

      const text = msg.message.conversation || msg.message.extendedTextMessage.text;
      const remoteJid = msg.key.remoteJidAlt || msg.key.remoteJid || '';
      const from = remoteJid.replace('@s.whatsapp.net', '').replace('@c.us', '').replace(/@lid$/, '') || '';
      const pushName = msg.pushName || from;

      console.log(`[${sessionId}] Incoming from ${from}: "${text?.slice(0, 50)}"`);
      pendingMessages.push({ session: sessionId, from, body: text, id: msg.key.id, name: pushName });

      await forwardToBackend({
        session: sessionId,
        from,
        body: text,
        id: msg.key.id,
        name: pushName,
        businessId: sessionId.startsWith('business-') ? sessionId.replace('business-', '') : null,
      });
    }
  });

  sessions.set(sessionId, sock);
  sock._sessionId = sessionId;
  return sock;
}

app.get('/sessions/:sessionId/qr', async (req, res) => {
  const { sessionId } = req.params;
  const dir = getDir(sessionId);
  let sock = sessions.get(sessionId);

  const credsFile = `${dir}/creds.json`;
  let creds = null;
  if (existsSync(credsFile)) {
    try { creds = JSON.parse(readFileSync(credsFile, 'utf-8')); } catch {}
  }

  if (sock?.user) {
    return res.json({ status: 'authenticated', sessionId, user: sock.user.id });
  }

  if (creds?.me?.id) {
    if (!sock) await createSession(sessionId);
    sock = sessions.get(sessionId);
    for (let i = 0; i < 15; i++) {
      if (sock?.user) return res.json({ status: 'authenticated', sessionId, user: sock.user.id });
      await new Promise(r => setTimeout(r, 1000));
    }
    return res.json({ status: 'connecting', sessionId });
  }

  // Not registered yet — wait for existing socket to generate QR
  if (sock?._creating) {
    const qrFile = `${dir}/qr.txt`;
    for (let i = 0; i < 15; i++) {
      if (existsSync(qrFile)) {
        const qrText = readFileSync(qrFile, 'utf-8');
        if (qrText) {
          const qrBase64 = await QR.toDataURL(qrText).catch(() => null);
          return res.json({ status: 'scan_required', sessionId, qr: qrText, qrBase64 });
        }
      }
      if (sock?.user) return res.json({ status: 'authenticated', sessionId, user: sock.user.id });
      await new Promise(r => setTimeout(r, 1000));
    }
    return res.json({ status: 'connecting', sessionId });
  }

  // New session — create it
  await createSession(sessionId);
  sock = sessions.get(sessionId);

  const qrFile = `${dir}/qr.txt`;
  for (let i = 0; i < 15; i++) {
    if (existsSync(qrFile)) {
      const qrText = readFileSync(qrFile, 'utf-8');
      if (qrText) {
        const qrBase64 = await QR.toDataURL(qrText).catch(() => null);
        return res.json({ status: 'scan_required', sessionId, qr: qrText, qrBase64 });
      }
    }
    if (sock?.user) return res.json({ status: 'authenticated', sessionId, user: sock.user.id });
    await new Promise(r => setTimeout(r, 1000));
  }

  return res.json({ status: 'connecting', sessionId });
});

app.post('/sendText', async (req, res) => {
  const { session: sessionId, to, text } = req.body;
  if (!to || !text) return res.status(400).json({ error: 'to and text required' });

  try {
    let sock = sessions.get(sessionId);
    if (!sock) sock = await createSession(sessionId);

    const cleaned = to.replace(/[^0-9]/g, '');
    const jid = `${cleaned}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text });
    res.json({ success: true, sessionId, to: jid });
  } catch (err) {
    res.status(500).json({ error: err.message, sessionId });
  }
});

app.get('/pending-messages', (_req, res) => {
  const msgs = [...pendingMessages];
  pendingMessages.length = 0;
  res.json(msgs);
});

app.get('/sessions', (_req, res) => {
  const list = [];
  for (const [id, sock] of sessions) {
    list.push({ sessionId: id, connected: !!sock.user, user: sock.user?.id || null });
  }
  res.json(list);
});

app.get('/health', (_req, res) => res.json({ ok: true, sessions: sessions.size }));

const server = createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`CafeFlow WA Gateway running on 0.0.0.0:${PORT}`);
console.log(`Webhook URL: ${BACKEND_WEBHOOK}`);
});
