import { createApp } from './app';
import { env, logger, prisma } from '@zenemic/shared';

const app = createApp();

// Listens on KEYBOARD_PORT (4100) so it never collides with main-app (4000),
// even though both services read the same shared env file.
const port = env.KEYBOARD_PORT;

const server = app.listen(port, () => {
  logger.info(`Zenemic keyboard service listening on http://localhost:${port}`);
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
