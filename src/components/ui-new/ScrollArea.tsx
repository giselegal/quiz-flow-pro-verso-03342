import React from 'react';
import { styled } from 'styled-components';

const StyledScrollArea = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(184, 155, 122, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(184, 155, 122, 0.4);
    border-radius: 3px;
    
    &:hover {
      background: rgba(184, 155, 122, 0.6);
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
