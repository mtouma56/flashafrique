interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className = "",
  priority = false 
}: OptimizedImageProps) => {
  // Generate srcset for responsive images
  const generateSrcSet = (url: string) => {
    const sizes = [400, 800, 1200];
    return sizes
      .map(size => `${url}?w=${size}&q=80 ${size}w`)
      .join(', ');
  };

  return (
    <img
      src={`${src}?w=800&q=80`}
      srcSet={generateSrcSet(src)}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
};
