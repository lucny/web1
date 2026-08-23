# Pages CMS – experimentální administrační varianta

Tento projekt zachovává původní [Decap konfiguraci](public/admin/config.yml) a přidává samostatnou konkurenční vrstvu [Pages CMS](https://app.pagescms.org). Obě administrace zapisují přímo do stejných Markdown souborů v Gitu; nevzniká databáze ani druhá kopie obsahu.

## První spuštění

1. Pushněte větev `main` do GitHub repozitáře.
2. V repozitáři otevřete **Settings → Pages** a jako zdroj nastavte **GitHub Actions**.
3. Otevřete [app.pagescms.org](https://app.pagescms.org), přihlaste se GitHub účtem a vyberte tento repozitář.
4. Při prvním otevření nainstalujte oficiální Pages CMS GitHub App jen pro tento repozitář a potvrďte požadovaná oprávnění k obsahu a Actions.
5. Pages CMS načte `.pages.yml`; Decap dál zůstává k dispozici na `/admin/` (pro lokální test `npm run cms`).

Hosted Pages CMS je pro tento experiment doporučený. Self-hosting není potřeba; vyžadoval by vlastní GitHub App, callback URL a tajné proměnné mimo repozitář.

## Obsah a vztahy

| Oblast | Markdown umístění | Praktický model v Pages CMS |
| --- | --- | --- |
| Stránky | `src/content/pages/` | Metadata stránky, `contentBlocks`, SEO a vztahy |
| Aktuality | `src/content/articles/` | Metadata článku, `contentBlocks`; autor → lidé; obory, kategorie, galerie a doporučené články → reference |
| Obory | `src/content/programs/` | Metadata oboru, `contentBlocks`; pět stávajících oborů; kontakty → lidé |
| Galerie | `src/content/galleries/` | Seřaditelný seznam snímků s povinným ALT textem |
| Dokumenty | `src/content/documents/` | Soubor, platnost, kategorie, štítky, obory a stránky |
| Události | `src/content/events/` | Začátek/konec, obory, článek a galerie → reference |
| Lidé | `src/content/people/` | Kontaktní údaje, foto, profil a obory |
| Kategorie | `src/content/categories/` | Řízená klasifikace použitá v článcích, galeriích a dokumentech |

Kategorie jsou samostatné entity. Štítky zůstávají záměrně volným opakovatelným seznamem: pro redakci je rychlejší je přidat bez zakládání nové entity, zatímco řízené kategorie se nerozpadnou na podobné varianty. Slug je název souboru Markdownu; Pages CMS jej při vytvoření automaticky vytvoří z hlavního názvu včetně přípony `.md`, takže redaktor název souboru nevyplňuje ručně. Reference mezi kolekcemi mohou mít tento přirozený tvar s `.md`; web i validátor jej bezpečně převedou na interní slug.

## Obsahové bloky a editor

Stránky, články a obory používají stejný blokový obsah v poli `contentBlocks`. Renderer je v `src/components/content/ContentRenderer.astro` a routy mu předávají například `<ContentRenderer blocks={entry.data.contentBlocks} />`. Podporuje nadpis, text, obrázek, YouTube, audio, tabulku, 2/3 sloupce, informační box, CTA, galerii, seznam dokumentů, seznam aktualit, kontaktní osoby a FAQ. Vztahové bloky volí existující položky místo ručního zadávání slugů. [Block field](https://pagescms.org/docs/configuration/fields/block/) ukládá čitelný YAML frontmatter s klíčem `type`.

Starší Markdownové tělo zůstává dočasně jako fallback pro již existující články, obory a stránky. Jakmile položka dostane neprázdné `contentBlocks`, zobrazí se pouze blokový obsah; nová tvorba přes Pages CMS proto používá `contentBlocks` jako jediný zdroj obsahové kompozice. Kompatibilní wrapper `ContentBlocks.astro` zůstává kvůli starším importům, vlastní logika je pouze v `ContentRenderer.astro`.

Přepínač **Editor / Source** zůstává zapnutý u staršího Markdownového fallbacku, takže dosavadní obsah lze kontrolovat a ručně upravovat ve VS Code či přes Git. Nový obsah se skládá z bloků v čistém YAML frontmatteru.

## Média

Nová média patří do těchto Git-tracked adresářů:

| Zdroj | Uložení | Veřejná URL |
| --- | --- | --- |
| Obrázky obsahu | `public/uploads/images/` | `/uploads/images/` |
| Galerie | `public/uploads/galleries/` | `/uploads/galleries/` |
| Fotografie osob | `public/uploads/people/` | `/uploads/people/` |
| Dokumenty | `public/uploads/documents/` | `/uploads/documents/` |
| Přílohy článků | `public/uploads/attachments/` | `/uploads/attachments/` |

Pages CMS bezpečně normalizuje názvy nahrávaných souborů. Staré soubory v `public/uploads/` zůstávají funkční, ale nové do kořene této složky neukládejte.

Tlačítko **Optimalizovat obrázky** spouští `optimize-images.yml`. Vytváří vedle nových JPG/PNG nedestruktivní WebP a AVIF varianty, originál nemění a v případě změn vytvoří samostatný commit. Lokálně lze stejný krok spustit příkazem `npm run media:optimize`. Workflow zatím automaticky nepřepisuje odkazy v obsahu na variantu – je to vědomé bezpečné omezení pro experiment.

## Publikování a automatizace

```text
Pages CMS / Decap / VS Code
            ↓ commit do GitHubu
      Validate content + Astro check
            ↓ Astro build + Pagefind
            ↓ kontrola interních odkazů
            ↓ GitHub Pages
```

Push do `main` spouští `.github/workflows/deploy-pages.yml`. Pages CMS navíc ukazuje dvě užitečné repository actions:

- **Znovu sestavit a publikovat web** – ruční build/deploy aktuální větve;
- **Zkontrolovat obsah** – pouze kontrola, bez zápisu do repozitáře.
- **Zkontrolovat interní odkazy** – dočasný produkční build a kontrola odkazů v HTML.

Workflow předává Astro `base_path` z `actions/configure-pages`, proto fungují interní odkazy, média i Pagefind i na project URL typu `https://<owner>.github.io/<repo>/`. Pro vlastní doménu nastavte v deploymentu `ASTRO_SITE` na finální HTTPS doménu.

## Kontroly před publikací

```powershell
npm run check          # Astro typy, vztahy obsahu a .pages.yml
npm run build          # Astro + Pagefind
npm run check:links    # interní odkazy ve výsledném dist/
```

`check:content` kontroluje mimo jiné existenci reference, povinné ALT texty galerie a publikovatelný stav. `check:pages-cms` ověřuje YAML, zdroje médií, všechny cílové kolekce reference fields a existenci jejich adresářů.

## Doporučený redakční test

Po instalaci GitHub App vyzkoušejte v Pages CMS postupně vytvořit článek (dva obory, kategorie, štítky, autor, galerie a doporučený článek), galerii s několika snímky a ALT texty, PDF dokument, budoucí událost a úpravu osoby. Po změně slugu/názvu souboru vždy spusťte **Zkontrolovat obsah**: soubory ukládají reference jako čitelné hodnoty a přejmenování položky může vyžadovat opravu odkazů.
