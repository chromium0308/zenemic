import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '@zenemic/shared';
import { authenticate, requireUserId } from '@zenemic/shared';
import { validate } from '@zenemic/shared';
import { stripe } from '@zenemic/shared';
import { features } from '@zenemic/shared';
import * as service from './integrations.service';

export const integrationsRouter = Router();

/** Lets the client discover which integrations are live + the Stripe pk. */
integrationsRouter.get('/status', (_req, res) => {
  res.json({ features, stripePublishableKey: stripe.stripePublishableKey });
});

// Google Calendar OAuth.
integrationsRouter.get(
  '/google/connect',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ url: await service.getGoogleConnectUrl(requireUserId(req)) });
  }),
);

integrationsRouter.get(
  '/google/callback',
  validate({ query: z.object({ code: z.string(), state: z.string() }) }),
  asyncHandler(async (req: Request, res: Response) => {
    await service.handleGoogleCallback(String(req.query.code), String(req.query.state));
    // The mobile app deep-links back in; here we just confirm.
    res.send('<html><body><p>Calendar connected. You can close this window.</p></body></html>');
  }),
);

integrationsRouter.post(
  '/google/disconnect',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    await service.disconnectGoogle(requireUserId(req));
    res.status(204).end();
  }),
);
