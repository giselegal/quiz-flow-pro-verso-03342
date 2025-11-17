import React from 'react';

interface EnhancedCanvasAreaProps {
  children: React.ReactNode;
  className?: string;
}

export const EnhancedCanvasArea: React.FC<EnhancedCanvasAreaProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`enhanced-canvas-area ${className}`}>
      {children}
    </div>
  );
};