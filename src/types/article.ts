export interface Article {
  id: string;
  title: string;
  summary: string | null;
  image_url: string | null;
  category: string | null;
  publish_at: string | null;
  status?: string | null;
  body?: string | null;
  author?: string | null;
  country?: string | null;
  source?: string | null;
  created_at?: string | null;
}

export interface CachedCategoryResponse {
  articles: Article[];
  count: number;
  category?: string;
}

export interface CachedSearchResponse {
  articles: Article[];
  count: number;
  query: string;
}

export interface CachedArticleResponse {
  article: Article | null;
  relatedArticles: Article[];
}
