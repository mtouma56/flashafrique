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
    const query = url.searchParams.get('q');

    if (!query) {
      return new Response(JSON.stringify({ error: 'Search query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Searching for: ${query}`);

    // Search in title, summary, and body
    const { data: articles, error, count } = await supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .lte('publish_at', new Date().toISOString())
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,body.ilike.%${query}%`)
      .order('publish_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log(`Found ${articles?.length || 0} articles for query: ${query}`);

    return new Response(
      JSON.stringify({ 
        articles: articles || [], 
        count: count || 0,
        query 
      }), 
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('Error in cache-search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});