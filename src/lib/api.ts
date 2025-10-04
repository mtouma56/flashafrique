import { supabase } from './supabaseClient';
import type {
  Article,
  CachedArticleResponse,
  CachedCategoryResponse,
  CachedSearchResponse,
} from '@/types/article';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const functionHeaders: HeadersInit | undefined = supabaseAnonKey
  ? {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    }
  : undefined;

const buildFunctionUrl = (path: string) => {
  if (!supabaseUrl) {
    return null;
  }

  const trimmedBase = supabaseUrl.replace(/\/$/, '');
  const trimmedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}/functions/v1${trimmedPath}`;
};

async function fetchFromEdgeFunction<T>(path: string, signal?: AbortSignal): Promise<T | null> {
  const url = buildFunctionUrl(path);
  if (!url) {
    return null;
  }

  try {
    const response = await fetch(url, {
      headers: functionHeaders,
      signal,
    });

    if (!response.ok) {
      console.warn(`Edge function ${path} responded with status ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return null;
    }

    console.error(`Failed to call edge function ${path}:`, error);
    return null;
  }
}

const mapArticle = (article: Article): Article => ({
  ...article,
  summary: article.summary ?? '',
  image_url: article.image_url ?? '',
  category: article.category ?? '',
  publish_at: article.publish_at ?? '',
  country: article.country ?? '',
  source: article.source ?? '',
  created_at: article.created_at ?? null,
  updated_at: article.updated_at ?? article.publish_at ?? article.created_at ?? null,
});

export const fetchHomeArticles = async (signal?: AbortSignal): Promise<Article[]> => {
  const homeApiUrl = import.meta.env.VITE_HOME_API_URL || '/api/home';

  try {
    const response = await fetch(homeApiUrl, { signal });

    if (!response.ok) {
      throw new Error(`Home API responded with status ${response.status}`);
    }

    const payload = (await response.json()) as Article[];
    return payload.map(mapArticle);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    console.warn('Falling back to Supabase for home articles:', error);

    const { data, error: supabaseError } = await supabase
      .from('articles')
      .select('id, title, summary, image_url, category, publish_at, status')
      .eq('status', 'approved')
      .lte('publish_at', new Date().toISOString())
      .order('publish_at', { ascending: false })
      .limit(6);

    if (supabaseError) {
      throw supabaseError;
    }

    return (data ?? []).map(mapArticle);
  }
};

export const fetchCategoryArticles = async (
  category: string,
  signal?: AbortSignal,
): Promise<CachedCategoryResponse> => {
  const cached = await fetchFromEdgeFunction<CachedCategoryResponse>(`/cache-category/${encodeURIComponent(category)}`, signal);
  if (cached) {
    return {
      ...cached,
      articles: cached.articles.map(mapArticle),
    };
  }

  const { data, error, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('category', category)
    .eq('status', 'approved')
    .lte('publish_at', new Date().toISOString())
    .order('publish_at', { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return {
    articles: (data ?? []).map(mapArticle),
    count: count ?? data?.length ?? 0,
    category,
  };
};

export const fetchSearchResults = async (
  query: string,
  signal?: AbortSignal,
): Promise<CachedSearchResponse> => {
  const cached = await fetchFromEdgeFunction<CachedSearchResponse>(`/cache-search?q=${encodeURIComponent(query)}`, signal);
  if (cached) {
    return {
      ...cached,
      articles: cached.articles.map(mapArticle),
    };
  }

  const { data, error, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .lte('publish_at', new Date().toISOString())
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .order('publish_at', { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return {
    articles: (data ?? []).map(mapArticle),
    count: count ?? data?.length ?? 0,
    query,
  };
};

export const fetchArticleDetail = async (
  id: string,
  signal?: AbortSignal,
): Promise<CachedArticleResponse> => {
  const cached = await fetchFromEdgeFunction<CachedArticleResponse>(`/cache-article/${encodeURIComponent(id)}`, signal);
  if (cached) {
    return {
      article: cached.article ? mapArticle(cached.article) : null,
      relatedArticles: cached.relatedArticles.map(mapArticle),
    };
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .lte('publish_at', new Date().toISOString())
    .single();

  if (error) {
    throw error;
  }

  return {
    article: data ? mapArticle(data) : null,
    relatedArticles: [],
  };
};
