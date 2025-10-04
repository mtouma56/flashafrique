import { Skeleton } from '@/components/ui/skeleton';

export const SearchSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Search header */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-6 w-48" />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="w-32 h-32 flex-shrink-0 rounded-md" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex items-center gap-4 pt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};