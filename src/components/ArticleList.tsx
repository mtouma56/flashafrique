import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../pages/CategoryPage';

interface ArticleListProps {
  articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Aucun article trouvé. Essayez de modifier vos filtres.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid gap-8">
      {articles.map((article, index) => (
        <React.Fragment key={article.id}>
          <article className="group grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="flex flex-col gap-3">
                <Link to={`/article/${article.id}`}>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {article.summary}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  {formatDate(article.publish_at)}
                </p>
              </div>
            </div>
            <Link to={`/article/${article.id}`} className="w-full overflow-hidden rounded-lg">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url("${article.image_url}")` }}
                role="img"
                aria-label={article.title}
              >
                <img
                  src={article.image_url}
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-0"
                />
              </div>
            </Link>
          </article>
          {index < articles.length - 1 && (
            <div className="border-b border-neutral-200 dark:border-neutral-800" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ArticleList;
