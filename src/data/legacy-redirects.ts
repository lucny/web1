/**
 * Výchozí mapa pro budoucí 301 redirecty na hostingu.
 * Úplný export vznikne při migraci obsahu ze starého CMS.
 */
export const legacyRedirects: Record<string, string> = {
  '/cs/': '/',
  '/cs/zpravy/': '/aktuality/',
  '/cs/aktuality/galerie/': '/galerie/',
  '/cs/kalendar/': '/udalosti/',
  '/cs/kontakty/': '/kontakt/',
  '/cs/dokumenty/': '/dokumenty/',
  '/cs/strojirenstvi/': '/obory/strojirenstvi/',
  '/cs/informacni-technologie/': '/obory/informacni-technologie/',
  '/cs/prumyslovy-design/': '/obory/prumyslovy-design/',
  '/cs/graficky-design/': '/obory/graficky-design/',
  '/cs/design-hracek/': '/obory/tvorba-hracek-a-hernich-predmetu/'
};
