/** Links chosen in the CMS: a page from the dropdown, a site document, or a custom URL. */
import site from './data/site.json';

export type CmsLink = { page?: string; url?: string } | string | undefined | null;

const documents: Record<string, () => string | undefined> = {
  statutes: () => site.statutesPdf,
  'agreement-corporate': () => site.membership?.agreementCorporate,
  'agreement-individual': () => site.membership?.agreementIndividual,
};

/** Resolve a CMS link to an href. Falls back to `fallback` (default "/") when empty. */
export const href = (link: CmsLink, fallback = '/'): string => {
  if (!link) return fallback;
  if (typeof link === 'string') return link || fallback;
  const page = link.page ?? '';
  if (page === 'custom' || !page) return link.url?.trim() || fallback;
  if (page in documents) return documents[page]() || fallback;
  return page;
};
