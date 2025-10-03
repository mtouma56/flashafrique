import { Link } from 'react-router-dom';

interface ArticleCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
}

const ArticleCard = ({ id, title, description, imageUrl, onClick }: ArticleCardProps) => {
  return (
    <Link to={`/articles/${id}`} onClick={onClick}>
      <article className="group flex flex-col gap-3">
        <div className="overflow-hidden rounded-lg">
          <img
            src={`${imageUrl}?w=1200&q=80`}
            srcSet={`${imageUrl}?w=600&q=70 600w, ${imageUrl}?w=900&q=70 900w, ${imageUrl}?w=1200&q=80 1200w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={title}
            loading="lazy"
            decoding="async"
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
