# Moderní prototyp webu SŠPU Opava

Statický, rychlý a přístupný prototyp veřejného webu Střední školy průmyslové a umělecké Opava. Zachovává informační identitu současného webu, ale staví ji na Astro, Tailwind CSS, obsahu v Gitu, Decap CMS a fulltextu Pagefind.

## Rychlé spuštění

```bash
npm install
npm run dev
```

Web bude dostupný na adrese, kterou vypíše Astro (běžně `http://localhost:4321`).

V druhém terminálu spusťte lokální rozhraní redakce:

```bash
npm run cms
```

Potom otevřete `http://localhost:4321/admin/`. Lokální backend Decap CMS zapisuje změny do pracovního stromu. Pro produkci nastavte Git Gateway (například Netlify) nebo odpovídající Git autentizaci hostingu.

## Příkazy

| Účel | Příkaz |
| --- | --- |
| Lokální vývoj | `npm run dev` |
| Produkční build + Pagefind | `npm run build` |
| Náhled buildu | `npm run preview` |
| Lokální Decap CMS | `npm run cms` |
| Kontrola typů a obsahu | `npm run check` |
| Kompletní ověření | `npm test` |
| Kontrola interních odkazů po buildu | `npm run check:links` |
| Vytvoření galerie | `npm run gallery:create -- <složka> <slug> "Název"` |

Například `npm run gallery:create -- C:\fotky\den-otevrenych-dveri den-otevrenych-dveri "Den otevřených dveří"` vytvoří optimalizované WebP kopie v `public/uploads/galleries/`, založí koncept galerie a záměrně označí ALT texty k redakčnímu doplnění.

## Architektura

- `src/content/` — Gitový obsah a jeho validované entity: články, obory, galerie, dokumenty, události, lidé a informační stránky.
- `src/content/config.ts` — schéma obsahu pro Astro; zde se mění datový model.
- `src/components/` — malé opakovaně použitelné komponenty: navigace, karty, filtry, lightbox a obsahové bloky.
- `src/pages/` — statické trasy, RSS, `robots.txt`, strojově čitelný `/obsah.json` a `llms.txt`.
- `public/admin/` — Decap CMS, jehož formuláře odpovídají datovým entitám.
- `src/data/legacy-redirects.ts` — začátek mapy stará URL → nová URL pro budoucí 301 redirecty.
- `scripts/` — kontrola obsahu, interních odkazů a příprava galerie.

Vizuální tokeny jsou soustředěny v `tailwind.config.mjs` a `src/styles/global.css`. Změna barev, písma nebo zaoblení proto nemění obsahový model ani routy.

## Obsahový model a redakce

Kategorie jsou řízené rubriky článků a galerií; tagy jsou volnější štítky. Vztahy používají stabilní slugy. Aktualita může patřit k více oborům, nést přílohy, vazbu na galerii a ručně vybrané doporučené články. Pokud doporučení chybí, detail článku vybírá tematicky související obsah.

Informační stránky mají vedle Markdownu připravené bloky upozornění, CTA a FAQ. Další blok přidávejte současně do `src/content/config.ts`, `public/admin/config.yml` a `ContentBlocks.astro`.

## Vyhledávání, SEO a přístupnost

`npm run build` nejdříve vygeneruje HTML a pak Pagefind index. Vyhledávání na `/vyhledavani/` funguje bez samostatného serveru a nabízí filtr typu obsahu. Všechny důležité entity mají samostatné URL, takže je indexují vyhledávače i Pagefind.

Součástí prototypu jsou sitemap, `robots.txt`, RSS, canonical URL, Open Graph metadata, JSON-LD pro školu, breadcrumb, článek, událost a osobu. Komponenty obsahují skip link, viditelné focus stavy, sémantické landmarky, responzivní navigaci a klávesnicově ovladatelný lightbox. Respektují také `prefers-reduced-motion`.

## Nasazení a omezení Git CMS varianty

Nasazujte obsah adresáře `dist/` z `npm run build` na statický hosting. Na hostingu převeďte `legacyRedirects` do pravidel 301 a nastavte skutečnou produkční adresu v `astro.config.mjs`.

Git-based CMS je pro 2–3 proškolené administrátory rychlé, levné, dobře verzované a snadno zálohovatelné. Jeho slabinou jsou konflikty při souběžné editaci, nutnost Git autentizace a méně pohodlná práce s velkým objemem médií. Před porovnáním s druhým prototypem sledujte zejména komfort redakce, rychlost publikace, řešení náhledů, práci s PDF a správu fotografií.

## Audit a zdroje

Pracovní audit současného veřejného webu je v [CURRENT-SITE-AUDIT.md](CURRENT-SITE-AUDIT.md). Prototyp používá reprezentativní názvy, vztahy a krátké veřejné texty; před ostrým spuštěním musí redakce ověřit úplnost údajů, licence médií a všechny přesměrovací URL.
