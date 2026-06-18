import type Stripe from 'stripe';
import { prisma } from '@zenemic/shared';
import { notFound, forbidden, badRequest } from '@zenemic/shared';
import { toMinor } from '@zenemic/shared';
import { logger } from '@zenemic/shared';
import { serializeSplit } from '@zenemic/shared';
import { push } from '@zenemic/shared';
import {
  createOrUpdateSplit,
  sendSplitRequests,
  setSplitShares,
  getSplit as getSplitRecord,
} from '@zenemic/shared';

async function assertOwner(userId: string, eventId: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw notFound('Event not found');
  if (event.userId !== userId) throw forbidden('Not your event');
  return event;
}

export async function getSplit(userId: string, eventId: string) {
  await assertOwner(userId, eventId);
  return serializeSplit(await getSplitRecord(eventId));
}

/** Recompute the split from an explicit total or the event's budget. */
export async function recomputeSplit(
  userId: string,
  eventId: string,
  input: { totalMajor?: number; mode?: 'EVEN' | 'BY_SHARE' | 'BY_ITEM' },
) {
  const event = await assertOwner(userId, eventId);
  const totalMinor =
    input.totalMajor != null ? toMinor(input.totalMajor, event.currency) : event.budgetMinor;
  if (totalMinor == null) throw badRequest('No total to split — pass totalMajor or set a budget');
  const split = await createOrUpdateSplit(eventId, { totalMinor, mode: input.mode });
  return serializeSplit(split);
}

/** Set explicit per-person amounts (PaymentDetail steppers / "By share" mode). */
export async function updateShares(
  userId: string,
  eventId: string,
  input: { shares: { shareId: string; amountMajor: number }[]; mode?: 'EVEN' | 'BY_SHARE' | 'BY_ITEM' },
) {
  const event = await assertOwner(userId, eventId);
  const shares = input.shares.map((s) => ({
    shareId: s.shareId,
    amountMinor: toMinor(s.amountMajor, event.currency),
  }));
  return serializeSplit(await setSplitShares(eventId, { shares, mode: input.mode }));
}

/** Issue Stripe payment links to outstanding attendees. */
export async function sendRequests(userId: string, eventId: string) {
  await assertOwner(userId, eventId);
  const split = await sendSplitRequests(eventId);
  return serializeSplit(split);
}

/**
 * Handle a verified Stripe webhook event. We mark a share PAID when its payment
 * link / intent completes. Links carry our shareId in metadata.
 */
export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  if (event.type !== 'checkout.session.completed') return;
  const session = event.data.object as Stripe.Checkout.Session;
  const paymentIntentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : null;

  // Prefer our shareId metadata; fall back to matching the originating payment
  // link (Payment Link metadata doesn't always copy onto the Checkout Session).
  let shareId = session.metadata?.shareId ?? null;
  if (!shareId && typeof session.payment_link === 'string') {
    const share = await prisma.splitShare.findFirst({
      where: { stripePaymentLinkId: session.payment_link },
    });
    shareId = share?.id ?? null;
  }
  if (!shareId) {
    logger.warn({ sessionId: session.id }, 'webhook: could not map session to a split share');
    return;
  }

  try {
    await prisma.splitShare.update({
      where: { id: shareId },
      data: { status: 'PAID', paidAt: new Date(), stripePaymentIntentId: paymentIntentId },
    });
  } catch (err) {
    logger.warn({ err, shareId }, 'webhook: share update failed');
    return;
  }

  // Notify the event host that a guest paid (best-effort; no-op without a token).
  try {
    const share = await prisma.splitShare.findUnique({
      where: { id: shareId },
      include: { attendee: true, split: { include: { event: { include: { user: true } } } } },
    });
    const host = share?.split.event.user;
    if (host?.notificationsEnabled && host.expoPushToken) {
      await push.sendPush({
        to: host.expoPushToken,
        title: 'Payment received',
        body: `${share?.attendee?.name ?? 'A guest'} paid their share of ${share?.split.event.title}.`,
        data: { eventId: share?.split.eventId },
      });
    }
  } catch (err) {
    logger.warn({ err, shareId }, 'webhook: host push notification failed');
  }
}
