import { useEffect, useState } from 'react';

import ArticleCard from '@/components/ArticleCard';
import { Hero } from '@/components/Hero';
import { ArticleCardSkeleton } from '@/components/ui/ArticleCardSkeleton';
import { HeroSkeleton } from '@/components/ui/HeroSkeleton';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useToast } from '@/hooks/use-toast';
import { fetchHomeArticles } from '@/lib/api';
import type { Article } from '@/types/article';

const HomePage = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadHomeFeed = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchHomeArticles(controller.signal);
        if (!isMounted) {
          return;
        }

        setArticles(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        console.error('Error fetching home feed:', err);
        if (!isMounted) {
          return;
        }

        setError("Impossible de charger les articles pour le moment.");
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement',
          description: 'Nous n\'avons pas pu récupérer les derniers articles. Veuillez réessayer plus tard.',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadHomeFeed();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [toast]);

  const heroArticle = articles[0];
  const heroData = heroArticle
    ? {
        title: heroArticle.title,
        description: heroArticle.summary ?? '',
        imageUrl: heroArticle.image_url ?? '',
      }
    : null;

  const trendingTopics = [
    "Presidential Elections",
    "Economic Growth",
    "Cultural Heritage",
    "National Team",
    "Regional Integration"
  ];

  const filterByCategory = (category: string) =>
    articles.filter(article => (article.category ?? '').toLowerCase() === category);

  // Show loading skeleton only if no cached data and no network data yet
  return (
    <main className="flex flex-1 justify-center px-10 py-8">
      <div className="flex w-full max-w-7xl flex-col gap-12">
        {loading && articles.length === 0 ? (
          <HeroSkeleton />
        ) : (
          heroData && (
            <Hero
              title={heroData.title}
              description={heroData.description}
              imageUrl={heroData.imageUrl}
            />
          )
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <section className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-black dark:text-white">Derniers Articles</h2>
          {loading && articles.length === 0 ? (
            <ArticleCardSkeleton count={3} />
          ) : articles.length === 0 ? (
            <p className="text-center text-black/60 dark:text-white/60">
              Aucun article disponible pour le moment. Revenez bientôt pour découvrir les dernières actualités.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(1).map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  description={article.summary ?? ''}
                  imageUrl={article.image_url ?? ''}
                />
              ))}
            </div>
          )}
        </section>

            {/* Politics + Trending Topics Grid */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
              {/* Politics Section - Placeholder for future filtering */}
              <section className="flex flex-col gap-6 lg:col-span-2">
                <h2 className="text-3xl font-bold text-black dark:text-white">Politique</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {filterByCategory('politique')
                    .slice(0, 4)
                    .map((article) => (
                      <ArticleCard
                        key={article.id}
                        id={article.id}
                        title={article.title}
                        description={article.summary ?? ''}
                        imageUrl={article.image_url ?? ''}
                      />
                    ))}
                  {filterByCategory('politique').length === 0 && (
                    <p className="col-span-2 text-center text-black/60 dark:text-white/60">
                      Aucun article politique disponible.
                    </p>
                  )}
                </div>
              </section>

              {/* Sidebar */}
              <aside className="flex flex-col gap-6">
                <h2 className="text-3xl font-bold text-black dark:text-white">Sujets Tendances</h2>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <a
                      key={index}
                      className="rounded-full bg-black/5 px-3 py-1 text-sm font-medium text-black/80 transition-colors hover:bg-primary/20 dark:bg-white/5 dark:text-white/80 dark:hover:bg-primary/30"
                      href="#"
                    >
                      {topic}
                    </a>
                  ))}
                </div>

                <h2 className="pt-6 text-3xl font-bold text-black dark:text-white">Opinion</h2>
                <div className="flex flex-col gap-6">
                  {filterByCategory('opinion')
                    .slice(0, 3)
                    .map((article) => (
                      <article key={article.id} className="group flex items-start gap-4">
                        <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg">
                          <OptimizedImage
                            src={article.image_url ?? '/placeholder.svg'}
                            alt={article.title ?? 'Article opinion'}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary">Opinion</p>
                          <h3 className="font-bold text-black group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                            {article.title}
                          </h3>
                          <p className="text-sm text-black/60 dark:text-white/60">{article.summary}</p>
                        </div>
                      </article>
                    ))}
                  {filterByCategory('opinion').length === 0 && (
                    <p className="text-center text-sm text-black/60 dark:text-white/60">
                      Aucun article d'opinion disponible.
                    </p>
                  )}
                </div>
              </aside>
            </div>

            {/* Economy Section */}
            <section className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-black dark:text-white">Économie</h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {filterByCategory('economie')
                  .slice(0, 4)
                  .map((article) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      description={article.summary ?? ''}
                      imageUrl={article.image_url ?? ''}
                    />
                  ))}
                {filterByCategory('economie').length === 0 && (
                  <p className="col-span-4 text-center text-black/60 dark:text-white/60">
                    Aucun article économique disponible.
                  </p>
                )}
              </div>
            </section>
      </div>
    </main>
  );
};

export default HomePage;
