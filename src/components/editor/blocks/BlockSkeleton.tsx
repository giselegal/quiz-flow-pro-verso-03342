/**
 * 💀 BLOCK SKELETON
 * 
 * Componente de loading para blocos lazy-loaded
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface BlockSkeletonProps {
  variant?: 'small' | 'medium' | 'large';
  className?: string;
}

export const BlockSkeleton: React.FC<BlockSkeletonProps> = ({
  variant = 'medium',
  className,
}) => {
  const heights = {
    small: 'h-16',
    medium: 'h-24',
    large: 'h-32',
  };

  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-muted/50 border border-muted',
        heights[variant],
        className
      )}
      aria-label="Loading block..."
    >
      <div className="p-3 space-y-2">
        {/* Header line */}
        <div className="h-3 bg-muted/70 rounded w-1/4" />
        
        {/* Content lines */}
        {variant !== 'small' && (
          <>
            <div className="h-4 bg-muted/70 rounded w-3/4" />
            {variant === 'large' && (
              <div className="h-4 bg-muted/70 rounded w-1/2" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlockSkeleton;
