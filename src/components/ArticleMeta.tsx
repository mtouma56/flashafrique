import React from 'react';

interface ArticleMetaProps {
  categories: string[];
  author: string;
  publishedAt: string;
  readTime?: string;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({
  categories,
  author,
  publishedAt,
  readTime,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center text-sm font-medium text-subtle-light dark:text-subtle-dark mb-4">
        {categories.map((category, index) => (
          <React.Fragment key={category}>
            {index > 0 && <span className="mx-2">/</span>}
            {index === categories.length - 1 ? (
              <span className="text-text-light dark:text-text-dark">{category}</span>
            ) : (
              <a className="hover:text-primary transition-colors" href="#">
                {category}
              </a>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-subtle-light dark:text-subtle-dark">
        By {author} · Published on {publishedAt}
        {readTime && ` · ${readTime} read`}
      </p>
    </div>
  );
};

export default ArticleMeta;
