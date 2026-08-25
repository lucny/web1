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
  '/cs/zaci/': '/zaci/',
  '/cs/historie-soucasnost/': '/skola/historie-soucasnost/',
  '/cs/umelecka-rada/': '/skola/umelecka-rada/',
  '/cs/studentsky-parlament/': '/skola/studentsky-parlament/',
  '/cs/spoluprace/': '/skola/spoluprace/',
  '/cs/nabidka-pronajmu/': '/skola/nabidka-pronajmu/',
  '/cs/dokumenty/': '/dokumenty/',
  '/cs/strojirenstvi/': '/obory/strojirenstvi/',
  '/cs/informacni-technologie/': '/obory/informacni-technologie/',
  '/cs/prumyslovy-design/': '/obory/prumyslovy-design/',
  '/cs/graficky-design/': '/obory/graficky-design/',
  '/cs/design-hracek/': '/obory/tvorba-hracek-a-hernich-predmetu/'
};
