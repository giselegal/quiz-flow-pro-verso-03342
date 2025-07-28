import React from 'react';

interface SpacerBlockProps {
  height?: number;
  backgroundColor?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  className?: string;
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({
  height = 20,
  backgroundColor = 'transparent',
  borderStyle = 'none',
  borderColor = '#facc15',
  className = ''
}) => {
  const style = {
    height: `${height}px`,
    backgroundColor,
    borderTop: borderStyle !== 'none' ? `1px ${borderStyle} ${borderColor}` : 'none',
    width: '100%'
  };

  return (
    <div
      className={className}
      style={style}
    />
  );
};
