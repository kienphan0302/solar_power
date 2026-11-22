import type { APIRoute } from 'astro';
import { site } from '../config/site';
export const GET: APIRoute = ({ site: base }) => new Response(site.readyToIndex
  ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', base).href}\n`
  : 'User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain' } });
