import { getCollection, type CollectionEntry } from 'astro:content';

type Name = 'articles' | 'programs' | 'galleries' | 'documents' | 'events' | 'people' | 'pages' | 'categories';
type Entry<T extends Name> = CollectionEntry<T>;

export async function entries<T extends Name>(collection: T) {
  const collectionEntries = await getCollection(collection);
  return collectionEntries
    .filter((entry) => entry.data.status === 'published')
    .sort((a, b) => {
      const aData = a.data as { publishedAt?: Date; date?: Date; start?: Date };
      const bData = b.data as { publishedAt?: Date; date?: Date; start?: Date };
      return Number(bData.publishedAt ?? bData.date ?? bData.start ?? 0) - Number(aData.publishedAt ?? aData.date ?? aData.start ?? 0);
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

/** Prefixes a repository-relative public URL when Astro runs below a GitHub Pages base path. */
export function withBase(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${import.meta.env.BASE_URL}${path.slice(1)}`;
}
