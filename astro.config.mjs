// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import clerk from '@clerk/astro';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://abc-company-site.vercel.app/',
  output: 'server',
  integrations: [mdx(), sitemap(), react(), clerk()],

  adapter: vercel(),
});
