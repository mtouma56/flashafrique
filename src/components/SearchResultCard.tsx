import React from 'react';
import { Link } from 'react-router-dom';

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: string;
}

interface SearchResultCardProps {
  result: SearchResult;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ result }) => {
  return (
    <article className="flex flex-col sm:flex-row gap-6 group">
      <div className="sm:w-1/3">
        <img
          src={result.imageUrl}
          alt={result.title}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full rounded-lg object-cover"
        />
      </div>
      <div className="sm:w-2/3">
        <p className="text-sm font-medium text-primary">{result.category}</p>
        <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary">
          <Link to={`/articles/${result.id}`}>{result.title}</Link>
        </h3>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          {result.summary}
        </p>
      </div>
    </article>
  );
};
