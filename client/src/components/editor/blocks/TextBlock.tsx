import React from 'react';

interface TextBlockProps {
  content?: string;
  fontSize?: number;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  content = 'Parágrafo de texto editável.',
  fontSize = 16,
  textColor = '#333333',
  textAlign = 'left',
  className = ''
}) => {
  const style = {
    fontSize: `${fontSize}px`,
    color: textColor,
    textAlign: textAlign as 'left' | 'center' | 'right',
    margin: 0,
    lineHeight: 1.6
  };

  return (
    <p 
      className={className}
      style={style}
    >
      {content}
    </p>
  );
};
