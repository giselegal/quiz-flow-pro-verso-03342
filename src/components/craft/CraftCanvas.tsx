
import React from 'react';
import { useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';

interface CraftCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export const CraftCanvas: React.FC<CraftCanvasProps> = ({ 
  children, 
  className 
}) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  return (
    <div className={cn(
      "flex-1 bg-gray-100 p-4 overflow-auto",
      className
    )}>
      <div className="mx-auto max-w-4xl">
        <div className={cn(
          "bg-white min-h-screen shadow-lg transition-all duration-200",
          enabled ? "cursor-auto" : "cursor-default"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};
