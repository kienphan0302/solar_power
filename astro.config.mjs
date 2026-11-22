import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'PUBLIC_');
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL || 'https://solar.example.com',
  output: 'static',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] }
});
