import { OptimizedImage } from '@/components/ui/OptimizedImage';

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
  const safeImageUrl = imageUrl || '/placeholder.svg';

  return (
    <div className="@container">
      <div className="group relative flex min-h-[520px] items-end justify-start overflow-hidden rounded-xl p-10">
        <OptimizedImage
          src={safeImageUrl}
          alt={title}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          priority
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
