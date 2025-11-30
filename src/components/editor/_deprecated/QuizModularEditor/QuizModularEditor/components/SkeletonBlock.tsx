/**
 * 💀 SKELETON BLOCK - FASE 4.2
 * 
 * Componente de skeleton loading para blocos durante carregamento
 * Melhora UX com feedback visual suave
 */

import React from 'react';

export const SkeletonBlock: React.FC = () => (
  <div className="animate-pulse space-y-3 p-4 border rounded bg-card">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <div className="h-3 bg-muted rounded w-24" />
      <div className="flex gap-2">
        <div className="h-6 w-6 bg-muted rounded" />
        <div className="h-6 w-6 bg-muted rounded" />
      </div>
    </div>
    
    {/* Content skeleton */}
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-4 bg-muted rounded w-5/6" />
    </div>
    
    {/* Footer skeleton */}
    <div className="flex gap-2 pt-2">
      <div className="h-8 bg-muted rounded w-20" />
      <div className="h-8 bg-muted rounded w-20" />
    </div>
  </div>
);

export default SkeletonBlock;
