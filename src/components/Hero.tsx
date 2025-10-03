interface HeroProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const Hero = ({ 
  title, 
  description, 
  imageUrl, 
  buttonText = "Read More",
  onButtonClick 
}: HeroProps) => {
  return (
    <div className="@container">
      <div className="group relative flex min-h-[520px] items-end justify-start overflow-hidden rounded-xl p-10">
        <img
          src={`${imageUrl}?w=1200&q=80`}
          srcSet={`${imageUrl}?w=600&q=70 600w, ${imageUrl}?w=900&q=70 900w, ${imageUrl}?w=1200&q=80 1200w`}
          sizes="100vw"
          alt={title}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/10 to-black/60" />
        
        <div className="flex max-w-3xl flex-col gap-4 text-left">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-extrabold text-white">{title}</h1>
            <h2 className="text-lg font-normal text-white/80">
              {description}
            </h2>
          </div>
          {buttonText && (
            <button 
              onClick={onButtonClick}
              className="mt-2 h-12 w-fit rounded-full bg-primary px-6 text-base font-bold text-white transition-transform group-hover:scale-105"
            >
              <span className="truncate">{buttonText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
