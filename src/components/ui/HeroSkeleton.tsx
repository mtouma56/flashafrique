import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg animate-pulse">
      <Skeleton className="w-full h-[400px] md:h-[500px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20 flex items-end">
        <div className="p-6 md:p-8 space-y-4 w-full">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-3/4 md:w-2/3" />
          <Skeleton className="h-6 w-full md:w-5/6" />
          <Skeleton className="h-10 w-32 mt-4" />
        </div>
      </div>
    </div>
  );
};
