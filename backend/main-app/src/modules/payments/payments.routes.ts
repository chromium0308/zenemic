import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '@zenemic/shared';
import { authenticate } from '@zenemic/shared';
import { validate } from '@zenemic/shared';
import * as ctrl from './payments.controller';

const recomputeSchema = z.object({
  totalMajor: z.number().positive().optional(),
  mode: z.enum(['EVEN', 'BY_SHARE', 'BY_ITEM']).optional(),
});

const updateSharesSchema = z.object({
  shares: z
    .array(z.object({ shareId: z.string().min(1), amountMajor: z.number().min(0) }))
    .min(1),
  mode: z.enum(['EVEN', 'BY_SHARE', 'BY_ITEM']).optional(),
});

// Mounted at /events/:id/split — mergeParams to read the event id.
export const splitRouter = Router({ mergeParams: true });

splitRouter.use(authenticate);
splitRouter.get('/', asyncHandler(ctrl.getSplit));
splitRouter.post('/', validate({ body: recomputeSchema }), asyncHandler(ctrl.recompute));
splitRouter.patch('/shares', validate({ body: updateSharesSchema }), asyncHandler(ctrl.updateShares));
splitRouter.post('/send', asyncHandler(ctrl.sendRequests));
