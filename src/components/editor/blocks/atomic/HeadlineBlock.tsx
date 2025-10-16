/**
 * 🎨 HEADLINE BLOCK - Atomic Component
 * 
 * Títulos com suporte a HTML e estilos customizados
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface HeadlineBlockProps {
  text?: string;
  html?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  mode?: 'edit' | 'preview';
}

export const HeadlineBlock = memo(({
  text = '',
  html = '',
  level = 'h2',
  fontSize = 'text-2xl sm:text-3xl md:text-4xl',
  fontWeight = 'font-bold',
  fontFamily = '',
  color = '',
  align = 'center',
  className = '',
  mode = 'preview'
}: HeadlineBlockProps) => {
  const Tag = level;
  
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  const style: React.CSSProperties = {
    ...(fontFamily && { fontFamily }),
    ...(color && { color })
  };

  const classes = cn(
    fontSize,
    fontWeight,
    alignClass,
    className
  );

  if (html) {
    return (
      <Tag
        className={classes}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <Tag className={classes} style={style}>
      {text}
    </Tag>
  );
});

HeadlineBlock.displayName = 'HeadlineBlock';
