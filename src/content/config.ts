import { defineCollection, z } from 'astro:content';

const status = z.enum(['published', 'draft']).default('published');
// Pages CMS reference fields naturally store a collection entry name such as
// `informacni-technologie.md`. The public site uses Astro slugs without the
// Markdown extension, so accept both forms at the content boundary.
const contentReference = z.preprocess(
  (value) => typeof value === 'string' ? value.replace(/\.md$/i, '') : value,
  z.string()
);
const slugList = z.array(contentReference).default([]);
const optionalDate = z.preprocess((value) => value === '' ? undefined : value, z.coerce.date().optional());
const optionalUrl = z.preprocess((value) => value === '' ? undefined : value, z.string().url().optional());
const seo = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  canonical: optionalUrl,
  image: z.string().optional(),
  noindex: z.boolean().default(false)
}).optional();

const blocks = z.array(z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), title: z.string().optional(), text: z.string() }),
  z.object({ type: z.literal('image'), image: z.string(), alt: z.string(), caption: z.string().optional() }),
  z.object({ type: z.literal('notice'), title: z.string(), text: z.string() }),
  z.object({ type: z.literal('cta'), title: z.string(), text: z.string(), label: z.string(), href: z.string() }),
  // `columns` stays for the existing Decap content; Pages CMS offers the clearer 2/3-column variants below.
  z.object({ type: z.literal('columns'), items: z.array(z.object({ title: z.string(), text: z.string() })).min(2).max(4) }),
  z.object({ type: z.literal('twoColumns'), items: z.array(z.object({ title: z.string(), text: z.string() })).length(2) }),
  z.object({ type: z.literal('threeColumns'), items: z.array(z.object({ title: z.string(), text: z.string() })).length(3) }),
  z.object({ type: z.literal('gallery'), gallery: contentReference }),
  z.object({ type: z.literal('documents'), documents: slugList }),
  z.object({ type: z.literal('articles'), articles: slugList }),
  z.object({ type: z.literal('people'), people: slugList }),
  z.object({ type: z.literal('faq'), items: z.array(z.object({ question: z.string(), answer: z.string() })) })
])).default([]);

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: optionalDate,
    author: z.string(),
    categories: slugList,
    tags: slugList,
    programs: slugList,
    cover: z.string().optional(),
    gallery: contentReference.optional(),
    attachments: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    related: slugList,
    status,
    seo
  })
});

const programs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    code: z.string(),
    form: z.string(),
    capacity: z.number(),
    description: z.string(),
    heroImage: z.string().optional(),
    highlights: z.array(z.string()),
    careers: z.array(z.string()),
    relatedPeople: slugList,
    status,
    seo
  })
});

const galleries = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    cover: z.string(),
    photos: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })),
    article: contentReference.optional(),
    programs: slugList,
    categories: slugList,
    tags: slugList,
    status,
    seo
  })
});

const documents = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    file: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    validUntil: optionalDate,
    programs: slugList,
    tags: slugList,
    pages: slugList,
    status,
    seo
  })
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    start: z.coerce.date(),
    end: optionalDate,
    location: z.string(),
    url: z.string().optional(),
    type: z.string(),
    programs: slugList,
    article: contentReference.optional(),
    gallery: contentReference.optional(),
    status,
    seo
  })
});

const people = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    department: z.string(),
    phone: z.string().optional(),
    email: z.string().email(),
    photo: z.string().optional(),
    profile: z.string().default(''),
    programs: slugList,
    contactVisible: z.boolean().default(true),
    status,
    seo
  })
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    highlight: z.string().optional(),
    blocks,
    status,
    seo
  })
});

const categories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    status
  })
});

export const collections = { articles, programs, galleries, documents, events, people, pages, categories };
