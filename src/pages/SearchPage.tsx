import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchResultCard } from '../components/SearchResultCard';
import type { SearchResult } from '../components/SearchResultCard';
import { PaginationNav } from '../components/PaginationNav';
import { supabase } from '../lib/supabaseClient';

interface Article {
  id: string;
  title: string;
  summary: string;
  image_url: string;
  category: string;
  publish_at: string;
}

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [sortBy, setSortBy] = useState('relevance');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const pageSize = 10;

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setTotalResults(0);
        setTotalPages(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError, count } = await supabase
          .from('articles')
          .select('*', { count: 'exact' })
          .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
          .eq('status', 'approved')
          .lte('publish_at', new Date().toISOString())
          .order('publish_at', { ascending: false })
          .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

        console.log({
          q: query,
          count,
          dataLen: data?.length,
          error: fetchError
        });

        if (fetchError) throw fetchError;

        const formattedResults: SearchResult[] = (data || []).map((article: Article) => ({
          id: article.id,
          title: article.title,
          summary: article.summary,
          imageUrl: article.image_url,
          category: article.category,
          date: new Date(article.publish_at).toISOString().split('T')[0]
        }));

        setResults(formattedResults);
        setTotalResults(count || 0);
        setTotalPages(Math.ceil((count || 0) / pageSize));
      } catch (err) {
        console.error('Erreur lors de la récupération des résultats:', err);
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
        setResults([]);
        setTotalResults(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    window.scrollTo(0, 0);
  }, [query, currentPage]);

  return (
    <main className="container mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            {!query.trim() ? (
              <>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  Recherche
                </h1>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                  Entrez un terme de recherche pour trouver des articles
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  Résultats pour "{query}"
                </h1>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                  {loading ? 'Recherche en cours...' : `${totalResults} résultat${totalResults !== 1 ? 's' : ''}`}
                </p>
              </>
            )}
          </div>

          {/* Filters Section */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            {/* Sort by filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Sort by:
              </span>
              <button
                onClick={() => setSortBy(sortBy === 'relevance' ? 'date' : 'relevance')}
                className="flex items-center gap-x-1.5 rounded-full bg-gray-200 dark:bg-gray-800 px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                {sortBy === 'relevance' ? 'Relevance' : 'Date'}
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Date:
              </span>
              <button
                onClick={() => setDateFilter(dateFilter === 'all' ? 'week' : 'all')}
                className="flex items-center gap-x-1.5 rounded-full bg-gray-200 dark:bg-gray-800 px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                {dateFilter === 'all' ? 'All Time' : 'This Week'}
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Category:
              </span>
              <button
                onClick={() => setCategoryFilter(categoryFilter === 'all' ? 'economy' : 'all')}
                className="flex items-center gap-x-1.5 rounded-full bg-gray-200 dark:bg-gray-800 px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                {categoryFilter === 'all' ? 'All' : 'Economy'}
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex gap-4">
                    <div className="h-32 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="flex gap-2">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && query.trim() && results.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                Aucun résultat
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Aucun article ne correspond à votre recherche.
              </p>
            </div>
          )}

          {/* Results Section */}
          {!loading && !error && results.length > 0 && (
            <>
              <div className="space-y-8">
                {results.map((result, index) => (
                  <React.Fragment key={result.id}>
                    <SearchResultCard result={result} />
                    {index < results.length - 1 && (
                      <hr className="border-gray-200 dark:border-gray-800" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationNav
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/search?q=${encodeURIComponent(query)}`}
                />
              )}
            </>
          )}
        </div>
      </main>
  );
};
