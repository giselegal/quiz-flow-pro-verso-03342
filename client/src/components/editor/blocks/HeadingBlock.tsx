import React from 'react';

interface HeadingBlockProps {
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  content?: string;
  fontSize?: number;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({
  level = 'h1',
  content = 'Seu Título Aqui',
  fontSize = 32,
  textColor = '#1a202c',
  textAlign = 'center',
  className = ''
}) => {
  const Tag = level;
  
  const style = {
    fontSize: `${fontSize}px`,
    color: textColor,
    textAlign: textAlign as 'left' | 'center' | 'right',
    margin: 0,
    fontWeight: level === 'h1' ? 700 : level === 'h2' ? 600 : 500,
    lineHeight: 1.2
  };

  return (
    <Tag 
      className={`font-playfair ${className}`}
      style={style}
    >
      {content}
    </Tag>
  );
};
