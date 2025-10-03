import { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import ArticleCard from '../components/ArticleCard';

interface Article {
  id: string;
  title: string;
  summary: string;
  image_url: string;
  category: string;
  publish_at: string;
}

interface CachedData {
  t: number;
  data: Article[];
}

const CACHE_KEY = 'homeFeed_v1';
const FETCH_TIMEOUT = 4000; // 4 seconds

const HomePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout>;

    const loadHomeFeed = async () => {
      // a) Try to read from localStorage first
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsedCache: CachedData = JSON.parse(cached);
          setArticles(parsedCache.data);
          setLoading(false); // No spinner if we have cached data
        }
      } catch (err) {
        console.error('Error reading cache:', err);
      }

      // b) Fetch fresh data from API with timeout
      try {
        const fetchPromise = fetch('/api/home', {
          signal: controller.signal,
        });

        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Request timeout'));
          }, FETCH_TIMEOUT);
        });

        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newData: Article[] = await response.json();
        
        // Update state with fresh data
        setArticles(newData);
        setLoading(false);
        setError(null);

        // Update localStorage cache
        const cacheData: CachedData = {
          t: Date.now(),
          data: newData,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            console.log('Fetch aborted');
          } else {
            console.error('Error fetching home feed:', err);
            // Only show error if we don't have cached data
            if (articles.length === 0) {
              setError('Impossible de charger les articles. Veuillez réessayer plus tard.');
            }
          }
        }
        setLoading(false);
      }
    };

    loadHomeFeed();

    // Cleanup function
    return () => {
      controller.abort();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Mock data pour le hero (sera remplacé par le premier article s'il existe)
  const heroData = articles[0] ? {
    title: articles[0].title,
    description: articles[0].summary,
    imageUrl: articles[0].image_url
  } : {
    title: "Chargement...",
    description: "Veuillez patienter...",
    imageUrl: ""
  };

  const trendingTopics = [
    "Presidential Elections",
    "Economic Growth",
    "Cultural Heritage",
    "National Team",
    "Regional Integration"
  ];

  // Show loading skeleton only if no cached data and no network data yet
  if (loading && articles.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-10 py-8">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-lg text-black dark:text-white">Chargement des articles...</p>
        </div>
      </main>
    );
  }

  if (error && articles.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-10 py-8">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center px-10 py-8">
          <div className="flex w-full max-w-7xl flex-col gap-12">
            {/* Hero Section */}
            {articles.length > 0 && (
              <Hero
                title={heroData.title}
                description={heroData.description}
                imageUrl={heroData.imageUrl}
              />
            )}

            {/* Articles Section */}
            <section className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-black dark:text-white">Derniers Articles</h2>
              {articles.length === 0 ? (
                <p className="text-center text-black/60 dark:text-white/60">
                  Aucun article disponible pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.slice(1).map((article) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      description={article.summary}
                      imageUrl={article.image_url}
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
                  {articles
                    .filter(a => a.category === 'politique')
                    .slice(0, 4)
                    .map((article) => (
                      <ArticleCard
                        key={article.id}
                        id={article.id}
                        title={article.title}
                        description={article.summary}
                        imageUrl={article.image_url}
                      />
                    ))}
                  {articles.filter(a => a.category === 'politique').length === 0 && (
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
                  {articles
                    .filter(a => a.category === 'opinion')
                    .slice(0, 3)
                    .map((article) => (
                      <article key={article.id} className="group flex items-start gap-4">
                        <div
                          className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url("${article.image_url}")` }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-primary">Opinion</p>
                          <h3 className="font-bold text-black group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                            {article.title}
                          </h3>
                          <p className="text-sm text-black/60 dark:text-white/60">{article.summary}</p>
                        </div>
                      </article>
                    ))}
                  {articles.filter(a => a.category === 'opinion').length === 0 && (
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
                {articles
                  .filter(a => a.category === 'economie')
                  .slice(0, 4)
                  .map((article) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      description={article.summary}
                      imageUrl={article.image_url}
                    />
                  ))}
                {articles.filter(a => a.category === 'economie').length === 0 && (
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
