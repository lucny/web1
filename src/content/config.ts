import { defineCollection, z } from 'astro:content';

const status = z.enum(['published', 'draft']).default('published');
const slugList = z.array(z.string()).default([]);

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string(),
    categories: slugList,
    tags: slugList,
    programs: slugList,
    cover: z.string().optional(),
    gallery: z.string().optional(),
    attachments: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    related: slugList,
    status
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
    status
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
    article: z.string().optional(),
    programs: slugList,
    categories: slugList,
    tags: slugList,
    status
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
    validUntil: z.coerce.date().optional(),
    programs: slugList,
    tags: slugList,
    pages: slugList,
    status
  })
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    location: z.string(),
    url: z.string().optional(),
    type: z.string(),
    programs: slugList,
    article: z.string().optional(),
    gallery: z.string().optional(),
    status
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
    profile: z.string(),
    programs: slugList,
    status
  })
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    highlight: z.string().optional(),
    blocks: z.array(z.discriminatedUnion('type', [
      z.object({ type: z.literal('notice'), title: z.string(), text: z.string() }),
      z.object({ type: z.literal('cta'), title: z.string(), text: z.string(), label: z.string(), href: z.string() }),
      z.object({ type: z.literal('columns'), items: z.array(z.object({ title: z.string(), text: z.string() })).min(2).max(4) }),
      z.object({ type: z.literal('faq'), items: z.array(z.object({ question: z.string(), answer: z.string() })) })
    ])).default([]),
    status
  })
});

export const collections = { articles, programs, galleries, documents, events, people, pages };
