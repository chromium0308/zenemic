import { createApp } from './app';
import { env } from '@zenemic/shared';
import { logger } from '@zenemic/shared';
import { prisma } from '@zenemic/shared';

const app = createApp();

const port = env.MAIN_APP_PORT;
const server = app.listen(port, () => {
  logger.info(`Zenemic main-app listening on http://localhost:${port}`);
});

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  // Force-exit if cleanup hangs.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
