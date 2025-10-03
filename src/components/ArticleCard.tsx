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
          <div 
            className="aspect-video w-full rounded-lg bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: `url("${imageUrl}")` }}
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
