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
