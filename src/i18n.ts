/**
 * Languages: English (default, no prefix) and Portuguese from Portugal (/pt/…).
 *
 * - Fixed texts of the templates live in `dict` below.
 * - Home page, menus and page headers: separate files in src/data/pt/.
 * - Text pages: separate files in src/content/pages-pt/.
 * - People, governance sections, events and site settings: the same entry has extra
 *   "…_pt" fields. When a Portuguese field is empty, the English text is shown.
 */
import homeEn from './data/home.json';
import homePt from './data/pt/home.json';
import navEn from './data/navigation.json';
import navPt from './data/pt/navigation.json';
import headersEn from './data/headers.json';
import headersPt from './data/pt/headers.json';
import { marked } from 'marked';

export type Lang = 'en' | 'pt';
export const langs: Lang[] = ['en', 'pt'];

/** Route parameter for the `[...lang]` folder: undefined = English, "pt" = Portuguese. */
export const langPaths = () => [{ params: { lang: undefined } }, { params: { lang: 'pt' } }];

/** Language of the page being built, from its address. */
export const langOf = (url: URL): Lang => (url.pathname === '/pt' || url.pathname.startsWith('/pt/') ? 'pt' : 'en');

/** Address of `path` in a language: "/about/" → "/pt/about/". External links and files are left alone. */
export const localize = (path: string, lang: Lang): string => {
  if (lang === 'en' || !path.startsWith('/') || path.startsWith('//')) return path;
  if (/^\/(uploads|images|pt)(\/|$)/.test(path) || /\.[a-z0-9]{2,5}([?#].*)?$/i.test(path)) return path;
  return `/pt${path}`;
};

/** The same page in the other language. */
export const switchPath = (url: URL, to: Lang): string => {
  const base = url.pathname.replace(/^\/pt(?=\/|$)/, '') || '/';
  return to === 'pt' ? localize(base, 'pt') : base;
};

/** Portuguese text of a field (`key_pt`), falling back to English. */
export const tr = <T extends Record<string, any>>(obj: T | undefined | null, key: string, lang: Lang): any => {
  if (!obj) return undefined;
  if (lang === 'pt') {
    const v = obj[`${key}_pt`];
    if (v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === '')) return v;
  }
  return obj[key];
};

/** Rich text stored in a field (HTML or Markdown) → HTML. */
export const richText = (v: unknown): string => {
  const s = typeof v === 'string' ? v.trim() : '';
  return s ? (marked.parse(s, { async: false }) as string) : '';
};

export const homeData = (lang: Lang): any => (lang === 'pt' ? homePt : homeEn);
export const navData = (lang: Lang): any => (lang === 'pt' ? navPt : navEn);
export const headersData = (lang: Lang): any => (lang === 'pt' ? headersPt : headersEn);

export const locale = (lang: Lang) => (lang === 'pt' ? 'pt-PT' : 'en-GB');

const en = {
  skip: 'Skip to content',
  home: 'Home',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  mainMenu: 'Main',
  langLabel: 'Language',
  biography: 'Biography',
  readMore: 'Read more →',
  upcoming: 'Upcoming',
  pastEditions: 'Past editions',
  noUpcoming: 'The next annual meeting will be announced soon.',
  contactUs: 'Contact us',
  keptInformed: 'to be kept informed.',
  details: 'Details →',
  viewEdition: 'View edition →',
  events: 'Events',
  news: 'News',
  eventSections: 'Event sections',
  overview: 'Overview',
  programme: 'Programme',
  conference: 'Conference',
  speakers: 'Speakers',
  presentations: 'Presentations',
  photos: 'Photos',
  video: 'Video',
  press: 'Press',
  dates: 'Dates',
  location: 'Location',
  edition: 'Edition',
  register: 'Register',
  eventWebsite: 'Event website ↗',
  partners: 'Partners',
  conferenceAgenda: 'Conference agenda',
  moderator: 'Moderator:',
  panel: 'Panel:',
  photosSoon: 'Photo selection coming soon.',
  fullAlbum: 'See the full album ↗',
  videoSoon: 'Video coming soon.',
  inThePress: 'In the press',
  source: 'Source:',
  inPortuguese: ' (in Portuguese)',
  inEnglish: ' (in English)',
  documents: 'Documents',
  linksTitle: 'Read more',
  externalLink: 'External link',
  relatedEvent: 'Related event:',
  allNews: '← All news',
  backHome: 'Back to home',
  latestNews: 'Latest news',
  lastUpdated: 'Last updated',
  allEvents: 'All events',
  explore: 'Explore',
  nextEvent: 'Next event',
  latestEdition: 'Latest edition',
  conferenceProgramme: 'Conference programme',
  speakersWord: 'speakers',
  presentationsAvailable: 'Presentations available for download',
  more: 'more',
  timeline: 'Timeline of annual meetings',
  memberLogo: 'Member logo',
  memberOf: 'Member of',
  playVideo: 'Play video:',
  externalVideo: 'Loads from an external video service',
  aboutTitle: 'Who we are',
  aboutDescription: 'EISAP – the Shipping Association of Portugal – represents the majority of owners of ships under the Portuguese flag.',
  membershipTitle: 'Become a member',
  membershipDescription: 'Join EISAP – the Shipping Association of Portugal.',
  apply: 'Apply for membership',
  partnerRoles: {} as Record<string, string>,
};

const pt: typeof en = {
  skip: 'Saltar para o conteúdo',
  home: 'Início',
  openMenu: 'Abrir menu',
  closeMenu: 'Fechar menu',
  mainMenu: 'Principal',
  langLabel: 'Idioma',
  biography: 'Biografia',
  readMore: 'Ler mais →',
  upcoming: 'Próximos eventos',
  pastEditions: 'Edições anteriores',
  noUpcoming: 'A próxima reunião anual será anunciada em breve.',
  contactUs: 'Contacte-nos',
  keptInformed: 'para se manter informado.',
  details: 'Detalhes →',
  viewEdition: 'Ver edição →',
  events: 'Eventos',
  news: 'Notícias',
  eventSections: 'Secções do evento',
  overview: 'Apresentação',
  programme: 'Programa',
  conference: 'Conferência',
  speakers: 'Oradores',
  presentations: 'Apresentações',
  photos: 'Fotografias',
  video: 'Vídeo',
  press: 'Imprensa',
  dates: 'Datas',
  location: 'Local',
  edition: 'Edição',
  register: 'Inscrição',
  eventWebsite: 'Site do evento ↗',
  partners: 'Parceiros',
  conferenceAgenda: 'Programa da conferência',
  moderator: 'Moderador:',
  panel: 'Painel:',
  photosSoon: 'Seleção de fotografias brevemente disponível.',
  fullAlbum: 'Ver o álbum completo ↗',
  videoSoon: 'Vídeo brevemente disponível.',
  inThePress: 'Na imprensa',
  source: 'Fonte:',
  inPortuguese: ' (em português)',
  inEnglish: ' (em inglês)',
  documents: 'Documentos',
  linksTitle: 'Saiba mais',
  externalLink: 'Ligação externa',
  relatedEvent: 'Evento relacionado:',
  allNews: '← Todas as notícias',
  backHome: 'Voltar ao início',
  latestNews: 'Últimas notícias',
  lastUpdated: 'Última atualização:',
  allEvents: 'Todos os eventos',
  explore: 'Explorar',
  nextEvent: 'Próximo evento',
  latestEdition: 'Última edição',
  conferenceProgramme: 'Programa da conferência',
  speakersWord: 'oradores',
  presentationsAvailable: 'Apresentações disponíveis para download',
  more: 'mais',
  timeline: 'Cronologia das reuniões anuais',
  memberLogo: 'Logótipo do associado',
  memberOf: 'Membro da',
  playVideo: 'Reproduzir vídeo:',
  externalVideo: 'Carregado a partir de um serviço de vídeo externo',
  aboutTitle: 'Quem somos',
  aboutDescription: 'A EISAP – Associação Europeia e Internacional de Shipping de Portugal – representa a maioria dos armadores com navios sob bandeira portuguesa.',
  membershipTitle: 'Tornar-se associado',
  membershipDescription: 'Junte-se à EISAP – Associação Europeia e Internacional de Shipping de Portugal.',
  apply: 'Candidatar-se a associado',
  partnerRoles: {
    'Hosted by': 'Anfitrião',
    'Organised by': 'Organização',
    'Supported by': 'Com o apoio de',
    'Managed by': 'Gestão',
    'Assisted by': 'Com a colaboração de',
    Partners: 'Parceiros',
  },
};

export const dict = { en, pt };
export const t = (lang: Lang) => dict[lang];
