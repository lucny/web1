import type { CollectionEntry } from 'astro:content';

export type AlertVariant = 'text' | 'banner';
export type AlertTone = 'night' | 'brand' | 'mist' | 'accent';
export type AlertColumns = 4 | 6 | 8;

export type HomepageAlertDefinition = {
  id: string;
  articleId: string;
  enabled: boolean;
  variant: AlertVariant;
  tone: AlertTone;
  desktopColumns: AlertColumns;
  label?: string;
};

export type ResolvedHomepageAlert = HomepageAlertDefinition & {
  article: CollectionEntry<'articles'>;
};

/**
 * Alert stores only presentation and editorial placement. The article remains
 * the single source of truth for title, perex, date and public URL.
 */
export const homepageAlertDefinitions: HomepageAlertDefinition[] = [
  {
    id: 'school-year-start',
    articleId: 'zahajeni-skolniho-roku-2026',
    enabled: true,
    variant: 'banner',
    tone: 'night',
    desktopColumns: 6
  },
  {
    id: 'industrial-design-posters',
    articleId: 'plakaty-prumyslovy-design',
    enabled: true,
    variant: 'text',
    tone: 'mist',
    desktopColumns: 6,
    label: 'Z tvorby studentů'
  },
  {
    id: 'litomysl-field-trip',
    articleId: 'exkurze-do-litomysle',
    enabled: true,
    variant: 'banner',
    tone: 'brand',
    desktopColumns: 8,
    label: 'Škola v terénu'
  },
  {
    id: 'ai-olympiad-success',
    articleId: 'ceska-ai-olympiada',
    enabled: true,
    variant: 'text',
    tone: 'accent',
    desktopColumns: 4,
    label: 'Úspěch studentů'
  }
];

export function resolveHomepageAlerts(articles: CollectionEntry<'articles'>[]): ResolvedHomepageAlert[] {
  const articleById = new Map(articles.map((article) => [article.id, article]));
  return homepageAlertDefinitions
    .filter((definition) => definition.enabled)
    .map((definition) => {
      const article = articleById.get(definition.articleId);
      return article ? { ...definition, article } : undefined;
    })
    .filter((alert): alert is ResolvedHomepageAlert => Boolean(alert));
}
