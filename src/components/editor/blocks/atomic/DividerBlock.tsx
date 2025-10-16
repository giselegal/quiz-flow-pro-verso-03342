import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerBlockProps {
  id?: string;
  height?: number;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  width?: string;
  marginTop?: number;
  marginBottom?: number;
  className?: string;
  mode?: 'editor' | 'preview';
}

export const DividerBlock: React.FC<DividerBlockProps> = ({
  height = 1,
  color = '#E5E7EB',
  style = 'solid',
  width = '100%',
  marginTop = 16,
  marginBottom = 16,
  className
}) => {
  return (
    <hr
      className={cn('border-0', className)}
      style={{
        height: `${height}px`,
        backgroundColor: color,
        borderStyle: style,
        width,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`
      }}
    />
  );
};

DividerBlock.displayName = 'DividerBlock';
