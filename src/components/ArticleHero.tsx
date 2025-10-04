import React from 'react';

import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ArticleHeroProps {
  imageUrl: string;
  alt: string;
}

const ArticleHero: React.FC<ArticleHeroProps> = ({ imageUrl, alt }) => {
  const safeImageUrl = imageUrl || '/placeholder.svg';

  return (
    <div className="mb-8 overflow-hidden rounded-xl">
      <div className="relative aspect-[16/9] w-full">
        <OptimizedImage
          src={safeImageUrl}
          alt={alt}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default ArticleHero;
