import { defineCollection, z } from "astro:content";

export const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string(),
  }),
});

export const news = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string(),
  }),
});

export const collections = { articles, news };
