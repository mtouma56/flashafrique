import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ArticleHero from '@/components/ArticleHero';
import ArticleMeta from '@/components/ArticleMeta';
import ArticleCard from '@/components/ArticleCard';
import ShareButtons from '@/components/ShareButtons';
import { ArticleStructuredData } from '@/components/SEO/ArticleStructuredData';
import { SEOHead } from '@/components/SEO/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { fetchArticleDetail } from '@/lib/api';
import { trackArticleView } from '@/lib/analytics';
import type { Article } from '@/types/article';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    const loadArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const { article: articleData, relatedArticles: related } = await fetchArticleDetail(id, controller.signal);

        if (!isMounted) {
          return;
        }

        if (!articleData) {
          setArticle(null);
          setError("L'article que vous recherchez n'est plus disponible.");
          toast({
            variant: 'destructive',
            title: 'Article introuvable',
            description: 'Cet article n\'est plus accessible ou a été supprimé.',
          });
          return;
        }

        setArticle(articleData);
        setRelatedArticles(related);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        console.error('Erreur lors de la récupération de l\'article:', err);
        if (!isMounted) {
          return;
        }

        setError("Impossible de charger l'article. Veuillez réessayer plus tard.");
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement',
          description: 'La récupération de cet article a échoué. Vérifiez votre connexion et réessayez.',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadArticle();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, toast]);

  if (loading) {
    return (
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <div className="overflow-hidden rounded-xl">
            <Skeleton className="aspect-[16/9] w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Article non trouvé</h1>
          <p className="mb-6 text-subtle-light dark:text-subtle-dark">
            {error || "L'article que vous recherchez n'existe pas ou a été supprimé."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            Retour
          </button>
        </div>
      </main>
    );
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const summary = article.summary ?? '';
  const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ?? 'https://flashafrique.vercel.app';
  const heroImage = article.image_url && article.image_url.trim() !== '' ? article.image_url : '/placeholder.svg';
  const heroImageUrl = heroImage.startsWith('http')
    ? heroImage
    : `${siteUrl}${heroImage.startsWith('/') ? '' : '/'}${heroImage}`;
  const normalisedSummary = summary.replace(/\s+/g, ' ').trim();
  const fallbackDescription =
    "Suivez l'actualité et les analyses de FlashAfrique pour rester informé sur les tendances du continent.";
  const metaDescriptionBase = normalisedSummary || fallbackDescription;
  const metaDescription = metaDescriptionBase.length > 160
    ? `${metaDescriptionBase.slice(0, 157)}…`
    : metaDescriptionBase;
  const canonicalUrl = `${siteUrl}/articles/${article.id}`;
  const toIsoString = (value: string | null | undefined) => {
    if (!value) {
      return undefined;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  };
  const nowIso = new Date().toISOString();
  const isoPublishedAt = toIsoString(article.publish_at ?? article.created_at ?? null) ?? nowIso;
  const isoUpdatedAt = toIsoString(article.updated_at ?? article.publish_at ?? article.created_at ?? null) ?? isoPublishedAt;
  const categories = article.category ? [article.category] : [];

  useEffect(() => {
    if (!article) {
      return;
    }

    if (import.meta.env.MODE === 'production' && (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim()) {
      trackArticleView(article.id, article.title, article.category ?? 'non catégorisé');
    }
  }, [article]);

  return (
    <>
      <SEOHead
        title={article.title ?? 'Article'}
        description={metaDescription}
        image={heroImageUrl}
        type="article"
        publishedTime={isoPublishedAt}
        modifiedTime={isoUpdatedAt}
        author={article.author || 'FlashAfrique'}
        tags={categories}
        canonicalUrl={canonicalUrl}
      />
      <ArticleStructuredData
        title={article.title ?? 'Article'}
        description={metaDescription}
        image={heroImageUrl}
        publishedTime={isoPublishedAt}
        modifiedTime={isoUpdatedAt}
        author={article.author || 'FlashAfrique'}
        category={categories[0] ?? 'Actualités'}
        url={canonicalUrl}
      />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <ArticleMeta
              categories={categories}
              author={article.author || 'FlashAfrique'}
              publishedAt={formatDate(article.publish_at)}
            />

            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
              {article.title}
            </h1>

            <ArticleHero imageUrl={heroImage} alt={article.title ?? 'Article'} />

            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-text-light dark:prose-p:text-text-dark prose-headings:text-text-light dark:prose-headings:text-text-dark prose-p:leading-relaxed prose-p:text-lg my-8">
              <p className="text-xl font-medium text-text-light dark:text-text-dark mb-6">
                {summary}
              </p>
              <div className="whitespace-pre-wrap">
                {article.body ?? ''}
              </div>
            </div>

            <ShareButtons
              articleId={article.id}
              title={article.title}
              summary={summary}
              url={canonicalUrl}
            />

            {relatedArticles.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">Articles similaires</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {relatedArticles.map((related) => (
                    <ArticleCard
                      key={related.id}
                      id={related.id}
                      title={related.title}
                      description={related.summary ?? ''}
                      imageUrl={related.image_url ?? ''}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
      </main>
    </>
  );
};

export default ArticleDetailPage;
