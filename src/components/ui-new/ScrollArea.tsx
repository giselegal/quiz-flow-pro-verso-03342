import React from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxHeight?: string | number;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({ 
  children, 
  className = '', 
  style = {},
  maxHeight = '100%'
}) => {
  const scrollAreaStyle = {
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    maxHeight,
    ...style
  };

  return (
    <div 
      className={`scroll-area ${className}`.trim()} 
      style={scrollAreaStyle}
    >
      {children}
    </div>
  );
};

export default ScrollArea;
export { ScrollArea };
