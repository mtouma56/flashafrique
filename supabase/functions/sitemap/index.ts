import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all approved articles
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, updated_at, category')
      .eq('status', 'approved')
      .lte('publish_at', new Date().toISOString())
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }

    // Build XML sitemap
    const baseUrl = 'https://flashafrique.vercel.app';
    
    type SitemapPage = {
      url: string;
      priority: string;
      changefreq: string;
      lastmod?: string;
    };
    
    const staticPages: SitemapPage[] = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/categories', priority: '0.8', changefreq: 'weekly' },
    ];

    const categories = [...new Set(articles?.map(a => a.category) || [])];
    const categoryPages: SitemapPage[] = categories.map(cat => ({
      url: `/category/${cat}`,
      priority: '0.7',
      changefreq: 'daily'
    }));

    const articlePages: SitemapPage[] = (articles || []).map(article => ({
      url: `/article/${article.id}`,
      lastmod: new Date(article.updated_at).toISOString(),
      priority: '0.6',
      changefreq: 'weekly'
    }));

    const allPages: SitemapPage[] = [...staticPages, ...categoryPages, ...articlePages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    console.log(`Generated sitemap with ${allPages.length} URLs`);

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});