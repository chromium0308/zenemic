import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { corsOrigins, features } from '@zenemic/shared';
import { logger } from '@zenemic/shared';
import { notFoundHandler, errorHandler } from '@zenemic/shared';

import { authRouter } from './modules/auth/auth.routes';
import { eventsRouter } from './modules/events/events.routes';
import { chatRouter } from './modules/chat/chat.routes';
import { splitRouter } from './modules/payments/payments.routes';
import { albumRouter } from './modules/album/album.routes';
import { webhooksRouter } from './modules/payments/webhooks.routes';
import { integrationsRouter } from './modules/integrations/integrations.routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(pinoHttp({ logger }));

  // Webhooks must see the RAW body for signature verification, so mount them
  // BEFORE the JSON body parser.
  app.use('/api/webhooks', webhooksRouter);

  // Receipt photos arrive as base64 in chat — allow a generous JSON limit.
  app.use(express.json({ limit: '12mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', features });
  });

  app.use('/api/auth', authRouter);
  // Nested event sub-resources first so they take precedence over /:id.
  app.use('/api/events/:id/chat', chatRouter);
  app.use('/api/events/:id/split', splitRouter);
  app.use('/api/events/:id/album', albumRouter);
  app.use('/api/events', eventsRouter);
  // The keyboard's generate/confirm endpoints now live in the standalone
  // @zenemic/keyboard service (see ../keyboard), not here.
  app.use('/api/integrations', integrationsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
