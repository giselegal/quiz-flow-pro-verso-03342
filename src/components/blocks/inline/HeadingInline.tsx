import React from 'react';

interface HeadingInlineProps {
  content: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  fontWeight?: string;
  className?: string;
}

export const HeadingInline: React.FC<HeadingInlineProps> = ({
  content,
  level = 'h2',
  textAlign = 'left',
  color = '#000000',
  fontWeight = 'normal',
  className = '',
}) => {
  const Tag = level;

  const styles = {
    textAlign,
    color,
    fontWeight,
    margin: 0,
    padding: 0,
  };

  return <Tag style={styles} className={className} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default HeadingInline;
