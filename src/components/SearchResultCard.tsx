import React from 'react';
import { Link } from 'react-router-dom';

import { OptimizedImage } from '@/components/ui/OptimizedImage';

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
  const imageUrl = result.imageUrl || '/placeholder.svg';

  return (
    <article className="flex flex-col gap-6 sm:flex-row group">
      <div className="sm:w-1/3">
        <OptimizedImage
          src={imageUrl}
          alt={result.title}
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
