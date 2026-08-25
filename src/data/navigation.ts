export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavGroup = {
  id: string;
  label: string;
  href: string;
  items: NavItem[];
};

export type UtilityLink = NavItem & {
  id: 'facebook' | 'moodle' | 'office' | 'skola-online';
  shortLabel: string;
};

export const utilityLinks: UtilityLink[] = [
  {
    id: 'facebook',
    label: 'SŠPU Opava na Facebooku',
    shortLabel: 'Facebook',
    href: 'https://www.facebook.com/sspuopava',
    external: true
  },
  {
    id: 'moodle',
    label: 'Moodle SŠPU Opava',
    shortLabel: 'Moodle',
    href: 'https://moodle.sspu-opava.cz',
    external: true
  },
  {
    id: 'office',
    label: 'Microsoft 365',
    shortLabel: 'Microsoft 365',
    href: 'https://portal.office.com',
    external: true
  },
  {
    id: 'skola-online',
    label: 'Škola Online',
    shortLabel: 'Škola Online',
    href: 'https://skolaonline.cz',
    external: true
  }
];

export const mainNavigation: NavGroup[] = [
  {
    id: 'skola',
    label: 'O škole',
    href: '/skola/o-skole/',
    items: [
      { label: 'Přehled školy', href: '/skola/o-skole/' },
      { label: 'Historie', href: '/skola/historie-soucasnost/' },
      { label: 'Vedení školy', href: '/kontakt/' },
      { label: 'Kontakty', href: '/kontakt/' },
      { label: 'Projekty', href: '/cs/projekty/' },
      { label: 'Spolupráce', href: '/skola/spoluprace/' },
      { label: 'Umělecká rada', href: '/skola/umelecka-rada/' },
      { label: 'Studentský parlament', href: '/skola/studentsky-parlament/' },
      { label: 'Nabídka pronájmu', href: '/skola/nabidka-pronajmu/' },
      { label: 'Prostory školy', href: '/galerie/' }
    ]
  },
  {
    id: 'uchazeci',
    label: 'Uchazeči',
    href: '/uchazeci/',
    items: [
      { label: 'Přehled pro uchazeče', href: '/uchazeci/' },
      { label: 'Obory', href: '/obory/' },
      { label: 'Přijímačky – technické obory', href: '/cs/studium/prijimaci-rizeni-technicke-obory/' },
      { label: 'Přijímačky – umělecké obory', href: '/cs/studium/prijimaci-rizeni-umelecke-obory/' },
      { label: 'Prohlídka školy', href: '/galerie/' },
      { label: 'Dny otevřených dveří', href: '/udalosti/den-otevrenych-dveri/' },
      { label: 'Informace pro uchazeče', href: '/uchazeci/' }
    ]
  },
  {
    id: 'studenti',
    label: 'Studenti a rodiče',
    href: '/studenti/',
    items: [
      { label: 'Žáci a třídy', href: '/zaci/' },
      { label: 'Školní poradenské pracoviště', href: '/cs/studium/spp/' },
      { label: 'Nabídky zaměstnání a brigád', href: '/cs/studium/nabidky-zamestnani/' },
      { label: 'Protidrogová prevence', href: '/studenti/' },
      { label: 'Výukové materiály', href: '/studenti/' },
      { label: 'Školní systémy', href: '/studenti/' },
      { label: 'Moodle', href: 'https://moodle.sspu-opava.cz', external: true },
      { label: 'Škola Online', href: 'https://skolaonline.cz', external: true },
      { label: 'Microsoft 365', href: 'https://portal.office.com', external: true }
    ]
  },
  {
    id: 'aktualne',
    label: 'Aktuálně',
    href: '/aktuality/',
    items: [
      { label: 'Školní zpravodaj', href: '/aktuality/' },
      { label: 'Kalendář akcí', href: '/udalosti/' },
      { label: 'Galerie', href: '/galerie/' },
      { label: 'Fotogalerie uměleckých oborů', href: '/cs/aktuality/fotogalerie-umeleckych-oboru/' },
      { label: 'Úspěchy', href: '/aktuality/' },
      { label: 'Projekty a soutěže', href: '/aktuality/' }
    ]
  },
  {
    id: 'dokumenty',
    label: 'Dokumenty',
    href: '/dokumenty/',
    items: [
      { label: 'Přehled dokumentů', href: '/dokumenty/' },
      { label: 'Školní řád', href: '/cs/dokumenty/skolni-rad/' },
      { label: 'Výroční zprávy', href: '/cs/dokumenty/vyrocni-zprava-skoly/' },
      { label: 'Inspekční zprávy', href: '/cs/dokumenty/inspekcni-zpravy/' },
      { label: 'Veřejné zakázky', href: '/cs/dokumenty/verejne-zakazky/' },
      { label: 'Rozpočet', href: '/cs/dokumenty/rozpocet/' },
      { label: 'Ochrana osobních údajů', href: '/cs/dokumenty/ochrana-osobnich-udaju/' },
      { label: 'Ochrana oznamovatelů', href: '/cs/dokumenty/ochrana-oznamovatelu/' },
      { label: 'Prohlášení o přístupnosti', href: '/cs/dokumenty/prohlaseni-o-pristupnosti-webu/' },
      { label: 'Rozvrhy', href: '/cs/dokumenty/rozvrhy/' }
    ]
  }
];
