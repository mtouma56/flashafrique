import React from 'react';

interface ShareButtonsProps {
  likes?: number;
  comments?: number;
  bookmarks?: number;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  likes = 0,
  comments = 0,
  bookmarks = 0,
}) => {
  return (
    <div className="flex flex-wrap gap-4 py-8 border-t border-b border-subtle-light/20 dark:border-subtle-dark/20 mt-12">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-light dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
        <svg
          className="w-6 h-6 text-subtle-light dark:text-subtle-dark"
          fill="currentColor"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z" />
        </svg>
        <p className="text-sm font-bold">{likes}</p>
      </button>

      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-light dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
        <svg
          className="w-6 h-6 text-subtle-light dark:text-subtle-dark"
          fill="currentColor"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" />
        </svg>
        <p className="text-sm font-bold">{comments}</p>
      </button>

      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-light dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
        <svg
          className="w-6 h-6 text-subtle-light dark:text-subtle-dark"
          fill="currentColor"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z" />
        </svg>
        <p className="text-sm font-bold">{bookmarks}</p>
      </button>
    </div>
  );
};

export default ShareButtons;
