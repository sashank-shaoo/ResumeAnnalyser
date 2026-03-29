import 'dotenv/config';
import { setGlobalDispatcher, Agent } from 'undici';

// Workaround for Node.js 18+ fetch failed / IPv6 issues with Google APIs
setGlobalDispatcher(new Agent({ connect: { timeout: 60000 } }));

import app from './src/app.js';
import { connectWithRetry } from './src/lib/prisma.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n🚀 ResumeHub server running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}\n`);
  // Proactively connect — wakes Neon DB to avoid cold-start on first request
  await connectWithRetry();
});

