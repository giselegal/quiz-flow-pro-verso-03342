/**
 * 🎨 SPACER BLOCK - Atomic Component
 * 
 * Espaçador vertical customizável
 */

import { memo } from 'react';

export interface SpacerBlockProps {
  height?: number;
  className?: string;
  mode?: 'edit' | 'preview';
}

export const SpacerBlock = memo(({
  height = 20,
  className = '',
  mode = 'preview'
}: SpacerBlockProps) => {
  return (
    <div
      className={className}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    />
  );
});

SpacerBlock.displayName = 'SpacerBlock';
