/** Text pages (Who we are, Membership, Privacy …) in the page's language, falling back to English. */
import { getEntry } from 'astro:content';
import type { Lang } from './i18n';

export const getPage = async (id: string, lang: Lang) =>
  ((lang === 'pt' && (await getEntry('pagesPt', id))) || (await getEntry('pages', id)))!;
