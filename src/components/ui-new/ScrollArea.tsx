import React from 'react';
import { styled } from 'styled-components';

const StyledScrollArea = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--accent);
    border-radius: calc(var(--radius) * 0.5);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--muted);
    border-radius: calc(var(--radius) * 0.5);
    
    &:hover {
      background: var(--muted-foreground);
    }
  }
`;

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ 
  children, 
  className = '',
  style 
}) => {
  return (
    <StyledScrollArea className={className} style={style}>
      {children}
    </StyledScrollArea>
  );
};

export default ScrollArea;
