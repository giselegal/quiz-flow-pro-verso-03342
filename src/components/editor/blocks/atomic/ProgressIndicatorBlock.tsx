import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressIndicatorBlockProps {
  id?: string;
  current: number;
  total: number;
  showLabel?: boolean;
  format?: string;
  fontSize?: string;
  color?: string;
  className?: string;
  mode?: 'editor' | 'preview';
}

export const ProgressIndicatorBlock: React.FC<ProgressIndicatorBlockProps> = ({
  current,
  total,
  showLabel = true,
  format = 'Q{current}/{total}',
  fontSize = 'text-sm',
  color = 'text-gray-600',
  className
}) => {
  if (!showLabel) return null;

  const formattedText = format
    .replace('{current}', current.toString())
    .replace('{total}', total.toString());

  return (
    <div className={cn('text-center', className)}>
      <span className={cn(fontSize, color, 'font-medium')}>
        {formattedText}
      </span>
    </div>
  );
};

ProgressIndicatorBlock.displayName = 'ProgressIndicatorBlock';
