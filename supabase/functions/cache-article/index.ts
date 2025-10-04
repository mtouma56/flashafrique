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
    const url = new URL(req.url);
    const articleId = url.pathname.split('/').pop();

    if (!articleId) {
      return new Response(JSON.stringify({ error: 'Article ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Fetching article: ${articleId}`);

    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .eq('status', 'approved')
      .lte('publish_at', new Date().toISOString())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Article not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.error('Supabase error:', error);
      throw error;
    }

    console.log(`Article found: ${article.title}`);

    // Fetch related articles from same category
    const { data: relatedArticles } = await supabase
      .from('articles')
      .select('id, title, summary, image_url, category, publish_at')
      .eq('category', article.category)
      .eq('status', 'approved')
      .lte('publish_at', new Date().toISOString())
      .neq('id', articleId)
      .order('publish_at', { ascending: false })
      .limit(3);

    return new Response(
      JSON.stringify({ 
        article,
        relatedArticles: relatedArticles || []
      }), 
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=600, s-maxage=1800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error in cache-article:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});