import React from 'react';

interface HeadingInlineProps {
  content: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  fontWeight?: string;
  fontFamily?: string; // ✅ NEW: Support custom font family (e.g., 'playfair-display')
  className?: string;
}

export const HeadingInline: React.FC<HeadingInlineProps> = ({
  content,
  level = 'h2',
  textAlign = 'left',
  color = '#000000',
  fontWeight = 'normal',
  fontFamily, // ✅ NEW: Custom font family support
  className = '',
}) => {
  const Tag = level;

  const styles: React.CSSProperties = {
    textAlign,
    color,
    fontWeight,
    margin: 0,
    padding: 0,
    ...(fontFamily && { fontFamily }), // Apply custom font if provided
  };

  return <Tag style={styles} className={className} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default HeadingInline;
