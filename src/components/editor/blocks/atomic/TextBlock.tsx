/**
 * 🎨 TEXT BLOCK - Atomic Component
 * 
 * Parágrafos de texto com highlights e estilos
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface TextHighlight {
  text: string;
  color?: string;
  weight?: string;
  italic?: boolean;
}

export interface TextBlockProps {
  text?: string;
  html?: string;
  size?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: string;
  highlights?: TextHighlight[];
  className?: string;
  mode?: 'edit' | 'preview';
}

export const TextBlock = memo(({
  text = '',
  html = '',
  size = 'text-sm sm:text-base',
  color = '',
  align = 'center',
  weight = '',
  highlights = [],
  className = '',
  mode = 'preview'
}: TextBlockProps) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  const classes = cn(
    size,
    weight,
    alignClass,
    color,
    className
  );

  // Processar highlights se houver
  let displayText = text;
  if (highlights.length > 0 && !html) {
    highlights.forEach(highlight => {
      const style = [
        highlight.color && `color: ${highlight.color}`,
        highlight.weight && `font-weight: ${highlight.weight}`,
        highlight.italic && 'font-style: italic'
      ].filter(Boolean).join('; ');
      
      displayText = displayText.replace(
        highlight.text,
        `<span style="${style}">${highlight.text}</span>`
      );
    });
  }

  if (html || highlights.length > 0) {
    return (
      <p
        className={classes}
        dangerouslySetInnerHTML={{ __html: html || displayText }}
      />
    );
  }

  return <p className={classes}>{text}</p>;
});

TextBlock.displayName = 'TextBlock';
