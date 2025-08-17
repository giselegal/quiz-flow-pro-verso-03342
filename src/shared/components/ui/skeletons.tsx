// Loading skeletons universais
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn('animate-pulse bg-muted rounded', className)} />
);

export const SkeletonCard: React.FC = () => (
  <div className="p-4 border rounded-lg space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-20 w-full" />
  </div>
);

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="space-y-3">
    <Skeleton className="h-8 w-full" />
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    ))}
  </div>
);

export const SkeletonEditor: React.FC = () => (
  <div className="flex h-screen">
    <div className="w-64 border-r p-4 space-y-4">
      <Skeleton className="h-8 w-full" />
      <SkeletonList items={6} />
    </div>
    <div className="flex-1 p-4 space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-8 space-y-4">
          <Skeleton className="h-full" />
        </div>
        <div className="col-span-4 space-y-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-40" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonFunnel: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);
