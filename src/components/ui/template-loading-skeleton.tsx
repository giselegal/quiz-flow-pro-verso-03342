import React from 'react';
import { cn } from '@/lib/utils';

interface TemplateLoadingSkeletonProps {
  className?: string;
  steps?: number;
}

export const TemplateLoadingSkeleton: React.FC<TemplateLoadingSkeletonProps> = ({ 
  className,
  steps = 10
}) => {
  return (
    <div className={cn("flex flex-col h-screen bg-background", className)}>
      {/* Header Skeleton */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-muted rounded animate-pulse" />
            <div className="w-32 h-5 bg-muted rounded animate-pulse" />
            <div className="w-16 h-4 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-8 bg-muted rounded animate-pulse" />
            <div className="w-20 h-8 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar Skeleton */}
        <div className="w-80 border-r border-border p-4">
          <div className="space-y-4">
            <div className="w-24 h-6 bg-muted rounded animate-pulse" />
            
            {/* Steps List */}
            <div className="space-y-2">
              {Array.from({ length: steps }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
                  <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas Skeleton */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm min-h-[600px] p-8">
              
              {/* Canvas Content Skeleton */}
              <div className="space-y-6">
                <div className="w-3/4 h-8 bg-muted rounded animate-pulse" />
                <div className="w-full h-4 bg-muted rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-muted rounded animate-pulse" />
                
                <div className="space-y-4 mt-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border border-muted rounded-lg p-4">
                      <div className="w-1/2 h-6 bg-muted rounded animate-pulse mb-3" />
                      <div className="w-full h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="w-3/4 h-4 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading Indicator */}
              <div className="flex items-center justify-center mt-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-muted-foreground">Carregando template...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateLoadingSkeleton;