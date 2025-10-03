import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArticleHero from '../components/ArticleHero';
import ArticleMeta from '../components/ArticleMeta';
import ShareButtons from '../components/ShareButtons';
import { supabase } from '../lib/supabaseClient';

interface Article {
  id: string;
  title: string;
  summary: string;
  image_url: string;
  body: string;
  category: string;
  author: string;
  publish_at: string;
  created_at: string;
}

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      console.log(fetchError);

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw fetchError;
      }

      setArticle(data);
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'article:', err);
      setError('Impossible de charger l\'article. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-lg text-black dark:text-white">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-subtle-light dark:text-subtle-dark mb-4">
            {error || "L'article que vous recherchez n'existe pas ou a été supprimé."}
          </p>
          {error && (
            <button
              onClick={() => id && fetchArticle(id)}
              className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>{article.title} - FlashAfrique</title>
        <meta name="description" content={article.summary} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={article.image_url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.summary} />
        <meta name="twitter:image" content={article.image_url} />
      </Helmet>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <ArticleMeta
              categories={[article.category]}
              author={article.author || 'FlashAfrique'}
              publishedAt={formatDate(article.publish_at)}
            />

            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
              {article.title}
            </h1>

            <ArticleHero imageUrl={article.image_url} alt={article.title} />

            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-text-light dark:prose-p:text-text-dark prose-headings:text-text-light dark:prose-headings:text-text-dark prose-p:leading-relaxed prose-p:text-lg my-8">
              <p className="text-xl font-medium text-text-light dark:text-text-dark mb-6">
                {article.summary}
              </p>
              <div className="whitespace-pre-wrap">
                {article.body}
              </div>
            </div>

            <ShareButtons
              likes={0}
              comments={0}
              bookmarks={0}
            />
          </div>
      </main>
    </>
  );
};

export default ArticleDetailPage;
