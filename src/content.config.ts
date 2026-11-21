import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Optional Portuguese text (empty = the English text is shown). */
const pt = z.string().nullish().transform((v) => v ?? undefined);

/** File/link reference used for PDFs, presentations and documents. */
const fileRef = z.object({
  title: z.string(),
  file: z.string(),               // /uploads/documents/x.pdf  or a full URL
  note: z.string().optional(),    // e.g. "EN", "PT", "1.2 MB"
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    source: z.string().optional(),
    language: z.enum(['EN', 'PT']).default('EN'),
    summary: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    documents: z.array(fileRef).default([]),
    // Related event: a slug (mmw-2025) or the CMS reference path (src/content/events/mmw-2025.md)
    event: z.string().optional().transform((v) => v ? v.split('/').pop()!.replace(/\.md$/, '') || undefined : undefined),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),             // "MMW 2025"
    series: z.enum(['Madeira Maritime Week', 'Portugal Shipping Week', 'Annual Meeting']),
    edition: z.string().optional(),     // "2nd edition · EISAP 6th Annual Meeting"
    title_pt: pt,
    edition_pt: pt,
    location_pt: pt,
    summary_pt: pt,
    body_pt: pt,                        // Portuguese description (rich text)
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    summary: z.string(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    registrationUrl: z.string().optional(),
    externalUrl: z.string().optional(),
    programme: z.array(z.object({
      day: z.string(),
      items: z.array(z.object({ time: z.string().optional(), title: z.string(), venue: z.string().optional() })),
    })).default([]),
    conference: z.array(z.object({
      day: z.string(),
      sessions: z.array(z.object({
        time: z.string().optional(),
        title: z.string(),
        keynotes: z.string().optional(),
        moderator: z.string().optional(),
        panel: z.string().optional(),
      })),
    })).default([]),
    speakers: z.array(z.object({
      name: z.string(), role: z.string().optional(), organisation: z.string().optional(), photo: z.string().optional(),
    })).default([]),
    presentations: z.array(fileRef.extend({ presenter: z.string().optional(), organisation: z.string().optional() })).default([]),
    documents: z.array(fileRef).default([]),
    gallery: z.array(z.object({ image: z.string(), caption: z.string().optional() })).default([]),
    fullAlbumUrl: z.string().optional(),
    videos: z.array(z.object({ title: z.string(), url: z.string() })).default([]),
    partners: z.array(z.object({ name: z.string(), role: z.string().optional(), logo: z.string().optional(), url: z.string().optional() })).default([]),
    draft: z.boolean().default(false),
  }),
});

const board = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/board' }),
  schema: z.object({
    name: z.string(),
    // Governance section: CMS reference path (src/content/governance/fiscal-council.md) → slug
    group: z.string().transform((v) => v.split('/').pop()!.replace(/\.md$/, '')),
    role: z.string(),
    role_pt: pt,
    city_pt: pt,
    bio_pt: pt,                         // Portuguese biography (rich text)
    company: z.string().optional(),
    city: z.string().optional(),
    photo: z.string().optional(),
    order: z.number().default(99),
    active: z.boolean().default(true),
  }),
});

/** Governance page sections (Board of Directors, General Assembly, …). Body = note shown below the members. */
const governance = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/governance' }),
  schema: z.object({
    title: z.string(),
    title_pt: pt,
    note_pt: pt,                        // Portuguese note (rich text); the English note is the body
    order: z.number().default(99),
    show: z.boolean().default(true),
  }),
});

const pageSchema = z.object({
  title: z.string(),
  eyebrow: z.string().optional(),
  intro: z.string().optional(),
  updated: z.coerce.date().optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: pageSchema,
});

/** Portuguese versions of the text pages (same file names as src/content/pages). */
const pagesPt = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages-pt' }),
  schema: pageSchema,
});

export const collections = { news, events, board, pages, pagesPt, governance };
