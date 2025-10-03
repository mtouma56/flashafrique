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
      <div 
        className="group relative flex min-h-[520px] items-end justify-start overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat p-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%), url("${imageUrl}")`
        }}
      >
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
