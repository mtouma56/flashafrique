import { Skeleton } from '@/components/ui/skeleton';

export const CategorySkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4 border rounded-lg p-4">
            <Skeleton className="w-full h-48 rounded-md" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};