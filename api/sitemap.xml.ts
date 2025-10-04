/// <reference types="node" />
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SITE_URL = process.env.SITE_URL ?? 'https://flashafrique.vercel.app';

const buildArticleUrl = (id: string) => {
  const trimmedBase = SITE_URL.replace(/\/$/, '');
  return `${trimmedBase}/articles/${id}`;
};

const toIsoString = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables for sitemap generation');
    return res.status(500).send('Server configuration error');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('articles')
    .select('id, updated_at, publish_at')
    .eq('status', 'approved')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch sitemap entries:', error);
    return res.status(500).send('Unable to generate sitemap');
  }

  const nowIso = new Date().toISOString();
  const urls = (data ?? []).map((article) => {
    const lastModified =
      toIsoString(article.updated_at) ?? toIsoString(article.publish_at) ?? nowIso;

    return `    <url>\n      <loc>${buildArticleUrl(article.id)}</loc>\n      <lastmod>${lastModified}</lastmod>\n    </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  return res.status(200).send(sitemap);
}
