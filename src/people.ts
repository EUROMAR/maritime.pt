/** People (board & governance) in display order. */
import { getCollection } from 'astro:content';
import order from './data/people-order.json';

// Position in the drag-and-drop "People order" list (CMS stores e.g. "src/content/board/jane-doe.md").
const rank = new Map((order.people ?? []).map((p: unknown, i: number) => [String(p ?? '').split('/').pop()?.replace(/\.md$/, ''), i]));

export const getPeople = async (group?: string) =>
  (await getCollection('board', (b) => b.data.active && (!group || b.data.group === group)))
    .sort((a, b) => (rank.get(a.id) ?? 1e6) - (rank.get(b.id) ?? 1e6) || a.data.order - b.data.order);
