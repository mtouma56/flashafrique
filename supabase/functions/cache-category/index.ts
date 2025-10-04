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
    const category = url.pathname.split('/').pop();

    if (!category) {
      return new Response(JSON.stringify({ error: 'Category is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Fetching articles for category: ${category}`);

    const { data: articles, error, count } = await supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .eq('category', category)
      .eq('status', 'approved')
      .lte('publish_at', new Date().toISOString())
      .order('publish_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log(`Found ${articles?.length || 0} articles for category ${category}`);

    return new Response(
      JSON.stringify({ 
        articles: articles || [], 
        count: count || 0,
        category 
      }), 
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error in cache-category:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});