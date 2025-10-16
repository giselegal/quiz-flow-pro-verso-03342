import React from 'react';
import { cn } from '@/lib/utils';

export interface SubtitleBlockProps {
  id?: string;
  text: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: string;
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
  className?: string;
  mode?: 'editor' | 'preview';
}

export const SubtitleBlock: React.FC<SubtitleBlockProps> = ({
  text,
  fontSize = 'text-lg',
  fontWeight = 'font-normal',
  color = 'text-gray-600',
  align = 'center',
  maxWidth,
  marginTop = 0,
  marginBottom = 16,
  paddingTop = 0,
  paddingBottom = 0,
  className
}) => {
  return (
    <p
      className={cn(
        fontSize,
        fontWeight,
        color,
        `text-${align}`,
        'leading-relaxed',
        className
      )}
      style={{
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        maxWidth: maxWidth || 'none'
      }}
    >
      {text}
    </p>
  );
};

SubtitleBlock.displayName = 'SubtitleBlock';
