
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';
import { Move, Minus } from 'lucide-react';

interface SpacerBlockProps {
  content?: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({
  content = {},
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  
  // Safely get height with fallback
  const spacerHeight = content?.height || '40px';
  const numericHeight = parseInt(spacerHeight);
  
  const [currentHeight, setCurrentHeight] = useState(numericHeight);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onUpdate) return;
    
    setIsDragging(true);
    setStartY(e.clientY);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(10, currentHeight + deltaY);
      setCurrentHeight(newHeight);
      
      onUpdate({ height: `${newHeight}px` });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isSelected && "ring-2 ring-blue-400 ring-offset-2",
        "hover:bg-gray-50 cursor-pointer",
        className
      )}
      onClick={onSelect}
      style={{ height: spacerHeight }}
    >
      {/* Visual indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Minus className="h-4 w-4" />
          <span>{numericHeight}px</span>
          <Minus className="h-4 w-4" />
        </div>
      </div>
      
      {/* Resize handle */}
      {isSelected && onUpdate && (
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-blue-500 rounded-full cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleMouseDown}
        >
          <Move className="h-3 w-3 text-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}
      
      {/* Grid lines for better visual feedback */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: Math.floor(numericHeight / 10) }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-dashed border-gray-300"
            style={{ top: `${(i + 1) * 10}px` }}
          />
        ))}
      </div>
    </div>
  );
};

export default SpacerBlock;
