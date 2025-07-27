
import React from 'react';
import { EditableContent } from '@/types/editor';
import { cn } from '@/lib/utils';

interface HeadlineBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  onSelect?: () => void;
  className?: string;
}

export const HeadlineBlock: React.FC<HeadlineBlockProps> = ({ 
  content, 
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  const handleClick = () => {
    if (onSelect && !isEditing) {
      onSelect();
    }
  };

  return (
    <div 
      className={cn(
        "space-y-3 p-4 rounded-lg cursor-pointer hover:bg-[#FAF9F7] transition-colors",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
        isEditing && "border-2 border-dashed border-[#B89B7A]/40",
        !isEditing && "border border-[#B89B7A]/20",
        className
      )} 
      onClick={handleClick}
    >
      {content.title && (
        <h2 className={cn(
          "text-3xl font-playfair",
          content.textColor ? `text-[${content.textColor}]` : 'text-[#432818]',
          content.alignment === 'center' && 'text-center',
          content.alignment === 'right' && 'text-right'
        )}>
          {content.title}
        </h2>
      )}
      {content.subtitle && (
        <p className={cn(
          "text-xl text-[#8F7A6A]",
          content.alignment === 'center' && 'text-center',
          content.alignment === 'right' && 'text-right'
        )}>
          {content.subtitle}
        </p>
      )}
      
      {isSelected && isEditing && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-bl">
          Editando Headline
        </div>
      )}
    </div>
  );
};

export default HeadlineBlock;
