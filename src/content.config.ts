import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
    type: z.enum(['Press release', 'Media coverage', 'Opinion', 'Interview', 'Statement']),
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
    group: z.enum(['Board of Directors', 'General Assembly', 'Fiscal Council', 'Honorary']),
    role: z.string(),
    company: z.string().optional(),
    city: z.string().optional(),
    photo: z.string().optional(),
    order: z.number().default(99),
    active: z.boolean().default(true),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

/** Documents for the protected members area (/members/). */
const documents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/documents' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Minutes', 'Circular', 'Position paper', 'Presentation', 'Report', 'Other']),
    file: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { news, events, board, pages, documents };
