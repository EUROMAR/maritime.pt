/** Small helpers shared by pages. */
import { locale, type Lang } from './i18n';

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }, lang: Lang = 'en') =>
  d.toLocaleDateString(locale(lang), { ...opts, timeZone: 'UTC' });

const LONG: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
export const fmtLong = (d: Date, lang: Lang = 'en') => fmtDate(d, LONG, lang);

export const dateRange = (start: Date, end?: Date, lang: Lang = 'en') => {
  if (!end) return fmtDate(start, LONG, lang);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear();
  return sameMonth
    ? `${start.getUTCDate()}–${fmtDate(end, LONG, lang)}`
    : `${fmtDate(start, { day: 'numeric', month: 'long' }, lang)} – ${fmtDate(end, LONG, lang)}`;
};

export const initials = (name: string) => {
  const parts = name.replace(/^(Dr\.|Vice-Admiral)\s+/, '').split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export const fileExt = (file: string) => (file.split('?')[0].split('.').pop() || 'file').slice(0, 4);

export const isExternal = (url: string) => /^https?:\/\//.test(url);
