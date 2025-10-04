import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ArticleList from '@/components/ArticleList';
import CategoryHeader from '@/components/CategoryHeader';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import { CategorySkeleton } from '@/components/ui/CategorySkeleton';
import { useToast } from '@/hooks/use-toast';
import { fetchCategoryArticles } from '@/lib/api';
import type { Article } from '@/types/article';


// Fonction pour mapper le slug de la route vers la catégorie DB (FR)
const mapSlug = (s: string): string => {
  const k = s.toLowerCase();
  if (['politics', 'politique'].includes(k)) return 'politique';
  if (['economy', 'économie', 'economie'].includes(k)) return 'economie';
  if (['culture'].includes(k)) return 'culture';
  if (['sport', 'sports'].includes(k)) return 'sport';
  if (['society', 'société', 'societe'].includes(k)) return 'societe';
  return k;
};

// Fonction pour capitaliser et formater le nom de la catégorie
const formatCategoryName = (slug: string): string => {
  const categoryMap: { [key: string]: string } = {
    'politics': 'Politique',
    'economy': 'Économie',
    'society': 'Société',
    'culture': 'Culture',
    'sports': 'Sports',
    'economie': 'Économie',
    'politique': 'Politique',
    'societe': 'Société'
  };
  
  return categoryMap[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1);
};

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

  const categoryName = formatCategoryName(slug || 'all');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCountry, selectedSource, selectedDate]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    const loadArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const dbCategory = mapSlug(slug);
        const { articles: categoryArticles, count } = await fetchCategoryArticles(dbCategory, controller.signal);

        if (!isMounted) {
          return;
        }

        setArticles(categoryArticles);
        setTotalCount(count);
        setCurrentPage(1);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        console.error('Error fetching category articles:', err);
        if (!isMounted) {
          return;
        }

        setError('Impossible de charger les articles de cette catégorie.');
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement',
          description: 'La récupération des articles a échoué. Veuillez vérifier votre connexion ou réessayer plus tard.',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadArticles();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug, toast]);

  // Filtrage des articles côté client
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const title = (article.title ?? '').toLowerCase();
      const summary = (article.summary ?? '').toLowerCase();
      const matchesSearch =
        !searchQuery ||
        title.includes(searchQuery.toLowerCase()) ||
        summary.includes(searchQuery.toLowerCase());
      const matchesCountry = !selectedCountry || article.country === selectedCountry;
      const matchesSource = !selectedSource || article.source === selectedSource;
      const matchesDate = !selectedDate || (article.publish_at ?? '').startsWith(selectedDate);

      return matchesSearch && matchesCountry && matchesSource && matchesDate;
    });
  }, [articles, searchQuery, selectedCountry, selectedSource, selectedDate]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / pageSize);
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredArticles.slice(startIndex, startIndex + pageSize);
  }, [filteredArticles, currentPage, pageSize]);

  // Extraire les valeurs uniques pour les filtres
  const countries = useMemo(() => 
    Array.from(new Set(articles.map(a => a.country))).filter(Boolean),
    [articles]
  );
  const sources = useMemo(() => 
    Array.from(new Set(articles.map(a => a.source))).filter(Boolean),
    [articles]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <main className="w-full flex-1">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col gap-8">
              <CategoryHeader 
                title={categoryName}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              <FilterBar
                countries={countries}
                sources={sources}
                selectedCountry={selectedCountry}
                selectedSource={selectedSource}
                selectedDate={selectedDate}
                onCountryChange={setSelectedCountry}
                onSourceChange={setSelectedSource}
                onDateChange={setSelectedDate}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
              />

              {loading ? (
                <CategorySkeleton />
              ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
                  <div className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-red-900 dark:text-red-200">Erreur de chargement</h3>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                      >
                        Réessayer
                      </button>
                    </div>
                  </div>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Aucun article trouvé</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {totalCount === 0 
                        ? `Aucun article trouvé pour la catégorie "${slug ? mapSlug(slug) : 'unknown'}".`
                        : 'Aucun article ne correspond à vos critères de recherche.'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <ArticleList articles={paginatedArticles} />

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
    </main>
  );
};

export default CategoryPage;
