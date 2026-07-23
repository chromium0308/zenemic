import type { SplitMode } from '../types/api';

export function currencySymbol(currency: string): string {
  const c = (currency || '').toLowerCase();
  return c === 'gbp' ? '£' : c === 'usd' ? '$' : c === 'eur' ? '€' : '';
}

export function formatBudget(major: number | null, currency: string): string {
  if (major == null) return '';
  const sym = currencySymbol(currency);
  return Number.isInteger(major) ? `${sym}${major}` : `${sym}${major.toFixed(2)}`;
}

const SPLIT_LABELS: Record<SplitMode, string> = {
  EVEN: 'Even split',
  BY_SHARE: 'By share',
  BY_ITEM: 'By item',
};

export function splitModeLabel(mode: SplitMode): string {
  return SPLIT_LABELS[mode] ?? 'Even split';
}

export function splitModeEnum(label: string): SplitMode {
  const l = (label || '').toLowerCase();
  if (l.includes('share')) return 'BY_SHARE';
  if (l.includes('item')) return 'BY_ITEM';
  return 'EVEN';
}

// Built by hand (not toLocaleDateString) so Hermes/Intl variance can't drift
// from the AI extraction's label house format.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "07 Jun 2026" — the dateLabel house format (matches the extraction prompt). */
export function formatDateLabel(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "7:30 PM" — the timeLabel house format (matches the extraction prompt). */
export function formatTimeLabel(d: Date): string {
  const h24 = d.getHours();
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`;
}

const MONTH_INDEX: Record<string, number> = MONTHS.reduce(
  (acc, m, i) => ({ ...acc, [m.toLowerCase()]: i }),
  {},
);

/**
 * Best-effort parse of the house-format labels back into a local-time Date, so
 * a date/time picker can open at the value currently shown on screen. Returns
 * null when the date label isn't a plain "07 Jun 2026" (e.g. a "14-16 Jun"
 * range) so callers can fall back; an unparseable time defaults to 7:00 PM.
 */
export function parseLabelsToDate(dateLabel: string, timeLabel: string): Date | null {
  const dm = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec(dateLabel.trim());
  if (!dm) return null;
  const month = MONTH_INDEX[dm[2].toLowerCase()];
  if (month === undefined) return null;

  let hours = 19;
  let minutes = 0;
  const tm = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(timeLabel.trim());
  if (tm) {
    hours = (Number(tm[1]) % 12) + (/pm/i.test(tm[3]) ? 12 : 0);
    minutes = Number(tm[2]);
  }
  return new Date(Number(dm[3]), month, Number(dm[1]), hours, minutes, 0, 0);
}
