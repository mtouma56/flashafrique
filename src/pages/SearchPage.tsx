import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PaginationNav } from '@/components/PaginationNav';
import { SearchResultCard } from '@/components/SearchResultCard';
import type { SearchResult } from '@/components/SearchResultCard';
import { SearchSkeleton } from '@/components/ui/SearchSkeleton';
import { useToast } from '@/hooks/use-toast';
import { fetchSearchResults } from '@/lib/api';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [sortBy, setSortBy] = useState('relevance');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { toast } = useToast();
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const pageSize = 10;

  useEffect(() => {
    if (!query.trim()) {
      setAllResults([]);
      setTotalResults(0);
      setTotalPages(0);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    const loadResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const { articles } = await fetchSearchResults(query, controller.signal);

        if (!isMounted) {
          return;
        }

        const formattedResults: SearchResult[] = articles.map(article => ({
          id: article.id,
          title: article.title,
          summary: article.summary ?? '',
          imageUrl: article.image_url ?? '',
          category: article.category ?? '',
          date: article.publish_at ? new Date(article.publish_at).toISOString().split('T')[0] : '',
        }));

        setAllResults(formattedResults);
        const availableCount = formattedResults.length;
        setTotalResults(availableCount);
        setTotalPages(availableCount > 0 ? Math.ceil(availableCount / pageSize) : 0);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        console.error('Erreur lors de la récupération des résultats:', err);
        if (!isMounted) {
          return;
        }

        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
        setAllResults([]);
        setTotalResults(0);
        setTotalPages(0);
        toast({
          variant: 'destructive',
          title: 'Erreur de recherche',
          description: 'Impossible de récupérer les résultats. Vérifiez votre connexion et réessayez.',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadResults();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [query, toast]);

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return allResults.slice(startIndex, startIndex + pageSize);
  }, [allResults, currentPage, pageSize]);

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
          {loading && <SearchSkeleton />}

          {/* Empty State */}
          {!loading && !error && query.trim() && allResults.length === 0 && (
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
          {!loading && !error && paginatedResults.length > 0 && (
            <>
              <div className="space-y-8">
                {paginatedResults.map((result, index) => (
                  <React.Fragment key={result.id}>
                    <SearchResultCard result={result} />
                    {index < paginatedResults.length - 1 && (
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
