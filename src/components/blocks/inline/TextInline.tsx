import React from 'react';

interface TextInlineProps {
  text: string;
  fontSize?: string;
  alignment?: 'left' | 'center' | 'right';
  color?: string;
  fontWeight?: string;
  className?: string;
}

export const TextInline: React.FC<TextInlineProps> = ({
  text,
  fontSize = '1rem',
  alignment = 'left',
  color = '#000000',
  fontWeight = 'normal',
  className = ''
}) => {
  const styles = {
    fontSize,
    textAlign: alignment,
    color,
    fontWeight,
    margin: 0,
    padding: 0,
    whiteSpace: 'pre-wrap' as const
  };
  
  return (
    <p 
      style={styles} 
      className={className}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default TextInline;