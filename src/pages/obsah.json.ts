import type { APIRoute } from 'astro';
import { entries, routeFor, withBase } from '../lib/content';

const labels = {
  pages: 'Stránka',
  articles: 'Aktualita',
  programs: 'Obor',
  galleries: 'Galerie',
  documents: 'Dokument',
  projects: 'Projekt',
  events: 'Událost',
  people: 'Osoba'
} as const;

export const GET: APIRoute = async () => {
  const collections = ['pages', 'articles', 'programs', 'galleries', 'documents', 'projects', 'events', 'people'] as const;
  const all = await Promise.all(collections.map(async (collection) => (await entries(collection)).map((item) => {
    const data = item.data as Record<string, unknown>;
    const studyFields = Array.isArray(data.studyFields) && data.studyFields.length > 0 ? data.studyFields : data.programs;
    const metadata = [data.categories, data.tags, studyFields, data.category, data.type, data.workplace ?? data.department, data.position ?? data.role, data.code]
      .flat()
      .filter((value): value is string => typeof value === 'string')
      .join(' ');
    return {
      type: labels[collection],
      title: data.title ?? data.name,
      url: withBase(routeFor(collection, item.id)),
      description: data.description ?? data.excerpt ?? data.profile,
      text: item.body,
      metadata,
      updated: data.updatedAt ?? data.publishedAt ?? data.date ?? data.startDate ?? data.start ?? null
    };
  })));
  return new Response(JSON.stringify({ name: 'SŠPU Opava', generatedAt: new Date().toISOString(), content: all.flat() }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
