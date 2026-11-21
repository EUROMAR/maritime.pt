/** Links chosen in the CMS: a page from the dropdown, a site document, or a custom URL. */
import site from './data/site.json';
import { localize, type Lang } from './i18n';

export type CmsLink = { page?: string; url?: string } | string | undefined | null;

const documents: Record<string, () => string | undefined> = {
  statutes: () => site.statutesPdf,
};

/** Resolve a CMS link to an href (in the page's language). Falls back to `fallback` (default "/") when empty. */
export const href = (link: CmsLink, fallback = '/', lang: Lang = 'en'): string => localize(raw(link, fallback), lang);

const raw = (link: CmsLink, fallback: string): string => {
  if (!link) return fallback;
  if (typeof link === 'string') return link || fallback;
  const page = link.page ?? '';
  if (page === 'custom' || !page) return link.url?.trim() || fallback;
  if (page in documents) return documents[page]() || fallback;
  return page;
};
