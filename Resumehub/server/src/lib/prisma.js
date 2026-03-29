import { PrismaClient } from '@prisma/client';

// ── Prisma singleton — prevents multiple instances during hot reload ──
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ── Keep-alive ping for Neon auto-suspend ──────────────────────────────
// Neon free tier suspends after ~5 min inactivity. Ping every 4 min to
// keep the connection warm and avoid cold-start timeouts.
const PING_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes

async function pingDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.warn('[Prisma] Keep-alive ping failed — DB may be waking up:', err?.message);
  }
}

// Start pinging after initial boot (don't block startup)
setTimeout(() => {
  pingDatabase(); // immediate first ping to wake DB on startup
  setInterval(pingDatabase, PING_INTERVAL_MS);
}, 2000);

// ── $connect with retry (handles Neon cold-start) ─────────────────────
export async function connectWithRetry(retries = 5, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected');
      return;
    } catch (err) {
      console.warn(`⚠️  DB connect attempt ${attempt}/${retries} failed: ${err?.message}`);
      if (attempt === retries) {
        console.error('❌ Could not connect to database after all retries. Requests will fail until DB is reachable.');
        return; // Don't crash the server — let individual requests handle errors
      }
      await new Promise(res => setTimeout(res, delayMs * attempt)); // exponential backoff
    }
  }
}

export default prisma;

