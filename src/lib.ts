/** Small helpers shared by pages. */
export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  d.toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });

export const dateRange = (start: Date, end?: Date) => {
  if (!end) return fmtDate(start, { day: 'numeric', month: 'long', year: 'numeric' });
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  return sameMonth
    ? `${start.getUTCDate()}–${fmtDate(end, { day: 'numeric', month: 'long', year: 'numeric' })}`
    : `${fmtDate(start, { day: 'numeric', month: 'long' })} – ${fmtDate(end, { day: 'numeric', month: 'long', year: 'numeric' })}`;
};

export const initials = (name: string) => {
  const parts = name.replace(/^(Dr\.|Vice-Admiral)\s+/, '').split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export const fileExt = (file: string) => (file.split('?')[0].split('.').pop() || 'file').slice(0, 4);

export const isExternal = (url: string) => /^https?:\/\//.test(url);
