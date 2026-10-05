import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectTypes } from './data/site';

const companies = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/companies' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      /** One or two sentences for cards. The Markdown body is the full description. */
      summary: z.string(),
      logo: image().optional(),
      website: z.url().optional(),
      /** Sort order on the site (lowest first). */
      order: z.number().int(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      location: z.string(),
      year: z.number().int().min(1900).max(2100),
      /** Bygherre. Leave out until the name is cleared for publication. */
      client: z.string().optional(),
      companies: z.array(reference('companies')).min(1),
      type: z.enum(projectTypes),
      /** One or two sentences for cards. The Markdown body is the full description. */
      summary: z.string(),
      featured: z.boolean().default(false),
      /** First photo is the cover. */
      photos: z
        .array(
          z.object({
            src: image(),
            alt: z.string().min(1),
            /** Photographer / rights holder. Required: no photo without documented rights. */
            credit: z.string().min(1),
          }),
        )
        .min(1),
    }),
});

export const collections = { companies, projects };
