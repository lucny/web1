import { getCollection, type CollectionEntry } from 'astro:content';

type Name = 'articles' | 'programs' | 'galleries' | 'documents' | 'events' | 'people' | 'pages' | 'categories';
type Entry<T extends Name> = CollectionEntry<T>;

export async function entries<T extends Name>(collection: T) {
  const collectionEntries = await getCollection(collection);
  return collectionEntries
    .filter((entry) => entry.data.status === 'published')
    .sort((a, b) => {
      const value = (data: { publishedAt?: Date; date?: Date; start?: Date; startDate?: string; startTime?: string }) => {
        if (data.publishedAt || data.date || data.start) return Number(data.publishedAt ?? data.date ?? data.start);
        if (data.startDate) return Number(new Date(`${data.startDate}T${data.startTime ?? '00:00'}:00`));
        return 0;
      };
      return value(b.data as { publishedAt?: Date; date?: Date; start?: Date; startDate?: string; startTime?: string }) - value(a.data as { publishedAt?: Date; date?: Date; start?: Date; startDate?: string; startTime?: string });
    })
    // Legacy Astro content collections retain `.md` in `id`; public relations and URLs use the stable slug.
    .map((entry) => ({ ...entry, id: entry.slug })) as CollectionEntry<T>[];
}

export async function byId<T extends Name>(collection: T, id: string) {
  return (await entries(collection)).find((entry) => entry.id === id.replace(/\.md$/i, ''));
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('cs-CZ', options).format(date);
}

export function routeFor(collection: Name, id: string) {
  const routes: Record<Exclude<Name, 'categories'>, string> = {
    articles: '/aktuality/', programs: '/obory/', galleries: '/galerie/', documents: '/dokumenty/', events: '/udalosti/', people: '/kontakt/', pages: '/skola/'
  };
  if (collection === 'categories') throw new Error('Kategorie nemají veřejnou detailní trasu.');
  return `${routes[collection]}${id}/`;
}

export function relatedByProgram<T extends Name>(items: Entry<T>[], programs: string[]) {
  return items.filter((item) => 'programs' in item.data && item.data.programs.some((program) => programs.includes(program)));
}

export function relatedArticles(article: Entry<'articles'>, articles: Entry<'articles'>[], limit = 3) {
  const candidates = articles.filter((item) => item.id !== article.id);
  const explicit = article.data.related
    .map((id) => candidates.find((item) => item.id === id))
    .filter((item): item is Entry<'articles'> => Boolean(item));
  const selected = new Set(explicit.map((item) => item.id));
  const semantic = candidates
    .filter((item) => !selected.has(item.id))
    .map((item) => {
      const sameProgram = item.data.programs.filter((program) => article.data.programs.includes(program)).length;
      const sameCategory = item.data.categories.filter((category) => article.data.categories.includes(category)).length;
      const sameTag = item.data.tags.filter((tag) => article.data.tags.includes(tag)).length;
      return { item, score: sameProgram * 5 + sameCategory * 3 + sameTag * 2 };
    })
    .sort((a, b) => b.score - a.score || Number(b.item.data.publishedAt) - Number(a.item.data.publishedAt))
    .map(({ item }) => item);

  return [...explicit, ...semantic].slice(0, limit);
}

/** Prefixes a repository-relative public URL when Astro runs below a GitHub Pages base path. */
export function withBase(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${import.meta.env.BASE_URL}${path.slice(1)}`;
}
