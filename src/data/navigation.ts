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
      { label: 'Historie', href: '/skola/o-skole/' },
      { label: 'Vedení školy', href: '/kontakt/' },
      { label: 'Kontakty', href: '/kontakt/' },
      { label: 'Projekty', href: '/aktuality/' },
      { label: 'Spolupráce', href: '/kontakt/' },
      { label: 'Prostory školy', href: '/galerie/obrazovy-pruvodce-skolou/' }
    ]
  },
  {
    id: 'uchazeci',
    label: 'Uchazeči',
    href: '/uchazeci/',
    items: [
      { label: 'Přehled pro uchazeče', href: '/uchazeci/' },
      { label: 'Obory', href: '/obory/' },
      { label: 'Přijímací řízení', href: '/uchazeci/' },
      { label: 'Prohlídka školy', href: '/galerie/obrazovy-pruvodce-skolou/' },
      { label: 'Dny otevřených dveří', href: '/udalosti/den-otevrenych-dveri/' },
      { label: 'Informace pro uchazeče', href: '/uchazeci/' }
    ]
  },
  {
    id: 'studenti',
    label: 'Studenti a rodiče',
    href: '/studenti/',
    items: [
      { label: 'Přehled tříd', href: '/studenti/' },
      { label: 'Výchovné poradenství', href: '/studenti/' },
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
      { label: 'Školní řád', href: '/dokumenty/skolni-rad/' },
      { label: 'Výroční zprávy', href: '/dokumenty/vyrocni-zprava/' },
      { label: 'Inspekční zprávy', href: '/dokumenty/' },
      { label: 'Formuláře', href: '/dokumenty/' },
      { label: 'Úřední informace', href: '/dokumenty/' }
    ]
  }
];
