import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { corsOrigins, features, logger, notFoundHandler, errorHandler } from '@zenemic/shared';
import { keyboardRouter } from './keyboard.routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(pinoHttp({ logger }));

  // Keyboard requests are short text prompts / ids — a small JSON limit is plenty.
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'keyboard', features });
  });

  // Standalone service: endpoints are POST /generate and POST /confirm.
  app.use('/', keyboardRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
