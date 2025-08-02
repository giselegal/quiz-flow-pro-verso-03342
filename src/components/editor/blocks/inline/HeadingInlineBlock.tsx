import React from 'react';
import { cn } from '../../../../lib/utils';

interface HeadingInlineBlockProps {
  content?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'text-left' | 'text-center' | 'text-right';
  color?: string;
  className?: string;
  [key: string]: any;
}

const HeadingInlineBlock: React.FC<HeadingInlineBlockProps> = ({
  content = 'Título da Seção',
  level = 'h2',
  fontSize = 'text-2xl',
  fontWeight = 'font-bold',
  textAlign = 'text-center',
  color = '#1a1a1a',
  className,
  ...props
}) => {
  const Tag = level as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={cn(
        fontSize,
        fontWeight,
        textAlign,
        "leading-tight",
        className
      )}
      style={{ color }}
      {...props}
    >
      {content}
    </Tag>
  );
};

export default HeadingInlineBlock;
