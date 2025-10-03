import React from 'react';
import Badge from './Badge';

interface HeroCardProps {
  title: string;
  summary: string;
  imageUrl?: string;
  country?: string;
  theme?: string;
  author?: string;
  publishedAt: string;
  readTime?: string;
  isLead?: boolean;
  className?: string;
}

const HeroCard: React.FC<HeroCardProps> = ({
  title,
  summary,
  imageUrl,
  country,
  theme,
  author,
  publishedAt,
  readTime,
  isLead = false,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <article className={`group cursor-pointer transition-all duration-300 hover:translate-y-[-2px] ${className}`}>
      {/* Image with shimmer skeleton */}
      {imageUrl && (
        <div className={`relative overflow-hidden rounded-xl mb-4 ring-1 ring-[color:var(--fg)/0.06] group-hover:ring-[color:var(--fg)/0.08] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ${isLead ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[4/3] md:aspect-[16/9]'}`}>
          {/* Skeleton shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--muted)/0.1] via-[color:var(--muted)/0.2] to-[color:var(--muted)/0.1] animate-pulse" />
          )}
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            decoding="async"
            loading={isLead ? undefined : 'lazy'}
            fetchPriority={isLead ? 'high' : undefined}
          />
        </div>
      )}

      {/* Surtitre badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {country && (
          <Badge variant="country">{country}</Badge>
        )}
        {theme && (
          <Badge variant="theme">{theme}</Badge>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-serif text-fg mb-3 leading-tight group-hover:text-[color:var(--accent)] transition-colors ${isLead ? 'line-clamp-3' : 'line-clamp-2'}`} style={{ 
        fontSize: isLead ? 'clamp(1.8rem, 1.4rem + 1.2vw, 2.4rem)' : 'clamp(1.25rem, 1.1rem + 0.6vw, 1.6rem)', 
        fontWeight: isLead ? 900 : 800, 
        letterSpacing: isLead ? '-0.02em' : '-0.01em', 
        lineHeight: 1.2 
      }}>
        {title}
      </h3>

      {/* Summary */}
      <p className={`text-sm md:text-base leading-relaxed mb-4 text-[color:var(--muted)] ${isLead ? 'line-clamp-4' : 'line-clamp-3'}`}>
        {summary}
      </p>

      {/* Meta row with small caps */}
      <div className="flex items-center gap-2 text-xs text-[color:var(--muted)] uppercase tracking-wide font-semibold">
        {author && (
          <>
            <span>{author}</span>
            <span>•</span>
          </>
        )}
        <time dateTime={publishedAt}>{publishedAt}</time>
        {readTime && (
          <>
            <span>•</span>
            <span>{readTime}</span>
          </>
        )}
      </div>
    </article>
  );
};

export default HeroCard;
