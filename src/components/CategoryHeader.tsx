import React from 'react';

interface CategoryHeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ 
  title, 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
        {title}
      </h2>
      <div className="flex w-full md:w-auto items-center rounded-lg bg-neutral-100 dark:bg-neutral-800/50 px-3">
        <span className="material-symbols-outlined text-neutral-500 dark:text-neutral-400">
          search
        </span>
        <input
          className="h-11 flex-1 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-0 border-0 text-sm"
          placeholder={`Rechercher dans ${title}...`}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={`Rechercher des articles dans la catégorie ${title}`}
        />
      </div>
    </div>
  );
};

export default CategoryHeader;
