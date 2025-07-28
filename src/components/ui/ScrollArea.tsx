
import React from 'react';

const StyledScrollArea = ({ children, className = '', style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const scrollAreaStyles = {
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    ...style
  };

  return (
    <div className={`scroll-area ${className}`} style={scrollAreaStyles}>
      {children}
      <style jsx>{`
        .scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        
        .scroll-area::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .scroll-area::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .scroll-area::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export const ScrollArea: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style }) => {
  return (
    <StyledScrollArea className={className} style={style}>
      {children}
    </StyledScrollArea>
  );
};

export default ScrollArea;
