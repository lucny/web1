export type HeroAction = {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'text';
  external?: boolean;
};

export type HeroTab = {
  id: string;
  label: string;
  color: string;
  textColor: string;
  image: string;
  eyebrow?: string;
  title: string;
  motto?: string;
  description?: string;
  actions: HeroAction[];
};

const technicalImage = 'https://www.sspu-opava.cz/media/filer_public_thumbnails/filer_public/8f/37/8f370c1d-8cc3-4d32-a898-d7acb536fb45/technicke-obory.jpg__800x450_q85_subject_location-400%2C225_subsampling-2.jpg';
const artImage = 'https://www.sspu-opava.cz/media/filer_public_thumbnails/filer_public/34/72/3472e38f-edaa-49e3-9fed-99dd126f36d5/umelecke-obory.jpg__800x450_q85_subject_location-400%2C225_subsampling-2.jpg';
const graphicImage = 'https://www.sspu-opava.cz/media/filer_public_thumbnails/filer_public/0e/02/0e025e71-03dd-45f1-ba31-35781e0494e4/vystavy.jpg__800x450_q85_subject_location-400%2C225_subsampling-2.jpg';
const schoolImage = 'https://www.sspu-opava.cz/media/filer_public_thumbnails/filer_public/31/c3/31c3e069-9a95-46ef-a414-b8f0304833df/obrazovy-pruvodce-skolou.jpg__800x450_q85_subject_location-400%2C225_subsampling-2.jpg';

export const heroTabs: HeroTab[] = [
  {
    id: 'strojirenstvi',
    label: 'Strojírenství',
    color: '#1A4053',
    textColor: '#FFFFFF',
    image: technicalImage,
    eyebrow: 'Technický obor',
    title: 'Strojírenství',
    motto: 'Od nápadu k přesnému řešení.',
    description: 'Konstrukce, výroba a digitální technologie v jednom praktickém studiu.',
    actions: [
      { label: 'Poznejte obor', href: '/obory/strojirenstvi/', variant: 'primary' },
      { label: 'Podmínky přijetí', href: '/uchazeci/', variant: 'secondary' }
    ]
  },
  {
    id: 'informacni-technologie',
    label: 'Informační technologie',
    color: '#59BDDC',
    textColor: '#102A43',
    image: technicalImage,
    eyebrow: 'Technický obor',
    title: 'Informační technologie',
    motto: 'Kód, který má smysl.',
    description: 'Programování, sítě a digitální tvorba pro svět, který se mění.',
    actions: [
      { label: 'Poznejte obor', href: '/obory/informacni-technologie/', variant: 'primary' },
      { label: 'Podmínky přijetí', href: '/uchazeci/', variant: 'secondary' }
    ]
  },
  {
    id: 'tvorba-hracek-a-hernich-predmetu',
    label: 'Design hraček',
    color: '#ECAFAC',
    textColor: '#102A43',
    image: artImage,
    eyebrow: 'Umělecký obor',
    title: 'Design hraček',
    motto: 'Tvořit znamená probouzet zvědavost.',
    description: 'Nápad, materiál a příběh se potkávají v originálním produktu.',
    actions: [
      { label: 'Poznejte obor', href: '/obory/tvorba-hracek-a-hernich-predmetu/', variant: 'primary' },
      { label: 'Podmínky přijetí', href: '/uchazeci/', variant: 'secondary' }
    ]
  },
  {
    id: 'prumyslovy-design',
    label: 'Průmyslový design',
    color: '#D0D543',
    textColor: '#102A43',
    image: artImage,
    eyebrow: 'Umělecký obor',
    title: 'Průmyslový design',
    motto: 'Forma, která slouží člověku.',
    description: 'Navrhujte předměty, které fungují, komunikují a zůstávají.',
    actions: [
      { label: 'Poznejte obor', href: '/obory/prumyslovy-design/', variant: 'primary' },
      { label: 'Podmínky přijetí', href: '/uchazeci/', variant: 'secondary' }
    ]
  },
  {
    id: 'graficky-design',
    label: 'Grafický design',
    color: '#C42079',
    textColor: '#FFFFFF',
    image: graphicImage,
    eyebrow: 'Umělecký obor',
    title: 'Grafický design',
    motto: 'Myšlenka, která je vidět.',
    description: 'Typografie, obraz a digitální média pro přesvědčivou komunikaci.',
    actions: [
      { label: 'Poznejte obor', href: '/obory/graficky-design/', variant: 'primary' },
      { label: 'Podmínky přijetí', href: '/uchazeci/', variant: 'secondary' }
    ]
  },
  {
    id: 'skola',
    label: 'Škola',
    color: '#08243A',
    textColor: '#FFFFFF',
    image: schoolImage,
    eyebrow: 'Střední škola průmyslová a umělecká · Opava',
    title: 'Kde se z nápadů stává dovednost.',
    motto: 'Technika, digitální svět a tvorba pod jednou střechou.',
    actions: [
      { label: 'O škole', href: '/skola/o-skole/', variant: 'primary' },
      { label: 'Kontakty', href: '/kontakt/', variant: 'secondary' }
    ]
  }
];
