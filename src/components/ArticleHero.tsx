import React from 'react';

interface ArticleHeroProps {
  imageUrl: string;
  alt: string;
}

const ArticleHero: React.FC<ArticleHeroProps> = ({ imageUrl, alt }) => {
  return (
    <div className="mb-8 rounded-xl overflow-hidden">
      <div className="w-full aspect-[16/9] relative">
        <img
          src={imageUrl}
          alt={alt}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ArticleHero;
