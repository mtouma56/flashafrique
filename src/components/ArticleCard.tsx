import { Link } from 'react-router-dom';

import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ArticleCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
}

const ArticleCard = ({ id, title, description, imageUrl, onClick }: ArticleCardProps) => {
  const safeImageUrl = imageUrl || '/placeholder.svg';

  return (
    <Link to={`/articles/${id}`} onClick={onClick}>
      <article className="group flex flex-col gap-3">
        <div className="overflow-hidden rounded-lg">
          <OptimizedImage
            src={safeImageUrl}
            alt={title}
            className="aspect-video w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div>
          <h3 className="font-bold text-black dark:text-white">{title}</h3>
          <p className="text-sm text-black/60 dark:text-white/60">{description}</p>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
