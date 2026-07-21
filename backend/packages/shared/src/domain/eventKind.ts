/**
 * Live Planned / Ongoing / Previous status, derived from an event's machine
 * timestamps at read time (see events.serializer). Kept in one place so the
 * serializer and createEvent agree on exactly one rule.
 */
export type EventKindValue = 'PLANNED' | 'ONGOING' | 'PREVIOUS';

/** Last instant (23:59:59.999) of the local-server calendar day that `d` falls on. */
function endOfLocalDay(d: Date): Date {
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Decide an event's time bucket from its start/end instants.
 *
 * - no `startsAt`: PLANNED — unless a known `endsAt` has already passed, in
 *   which case PREVIOUS (we can't place the start, but a finished end is over).
 * - `now` before the start                          → PLANNED.
 * - `now` within [start, effectiveEnd]              → ONGOING.
 * - after `effectiveEnd`                            → PREVIOUS.
 *
 * `effectiveEnd` is `endsAt` when it's known and after the start; otherwise it
 * falls back to the end of the start day, so a start-only event stays Ongoing
 * until midnight and then flips to Previous. Multi-day events with both
 * timestamps set stay Ongoing across their whole range.
 *
 * Pure: pass `now` to make it deterministic in tests.
 */
export function deriveEventKind(
  startsAt: Date | null,
  endsAt: Date | null,
  now: Date = new Date(),
): EventKindValue {
  if (!startsAt) return endsAt && now > endsAt ? 'PREVIOUS' : 'PLANNED';
  if (now < startsAt) return 'PLANNED';
  const effectiveEnd = endsAt && endsAt > startsAt ? endsAt : endOfLocalDay(startsAt);
  if (now <= effectiveEnd) return 'ONGOING';
  return 'PREVIOUS';
}
