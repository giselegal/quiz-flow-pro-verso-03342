
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface PreviewBlockProps {
  block: EditorBlock;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'desktop' | 'mobile';
  isPreview: boolean;
}

export function PreviewBlock({
  block,
  isSelected,
  onSelect,
  viewMode,
  isPreview
}: PreviewBlockProps) {
  const renderContent = () => {
    switch (block.type) {
      case 'headline':
        return (
          <div className="space-y-3">
            {block.content.title && (
              <h2 
                className={cn(
                  "text-3xl font-playfair",
                  block.content.textColor ? `text-[${block.content.textColor}]` : 'text-[#432818]',
                  block.content.alignment === 'center' && 'text-center',
                  block.content.alignment === 'right' && 'text-right'
                )}
              >
                {block.content.title}
              </h2>
            )}
            {block.content.subtitle && (
              <p 
                className={cn(
                  "text-xl text-[#8F7A6A]",
                  block.content.alignment === 'center' && 'text-center',
                  block.content.alignment === 'right' && 'text-right'
                )}
              >
                {block.content.subtitle}
              </p>
            )}
          </div>
        );
      case 'text':
        return (
          <div 
            className={cn(
              "prose max-w-none",
              block.content.alignment === 'center' && 'text-center',
              block.content.alignment === 'right' && 'text-right'
            )}
          >
            {block.content.text}
          </div>
        );
      case 'benefits':
        return (
          <div className="space-y-4">
            {block.content.title && (
              <h3 className="text-xl font-playfair text-[#432818]">{block.content.title}</h3>
            )}
            <ul className="space-y-2">
              {block.content.items?.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#B89B7A]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'pricing':
        return (
          <div className="text-center space-y-4">
            {block.content.regularPrice && (
              <p className="text-lg line-through text-[#8F7A6A]">
                R$ {block.content.regularPrice}
              </p>
            )}
            {block.content.salePrice && (
              <p className="text-3xl font-bold text-[#B89B7A]">
                R$ {block.content.salePrice}
              </p>
            )}
            {block.content.buttonText && (
              <Button className="bg-[#B89B7A] hover:bg-[#8F7A6A]">
                {block.content.buttonText}
              </Button>
            )}
          </div>
        );
      default:
        return (
          <p className="text-[#8F7A6A]">
            Bloco do tipo: {block.type}
          </p>
        );
    }
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative p-4 rounded-lg transition-all duration-200",
        !isPreview && "cursor-pointer hover:bg-[#FAF9F7]",
        !isPreview && isSelected && "ring-2 ring-[#B89B7A] bg-[#FAF9F7]",
        !isPreview && "border-2 border-dashed border-[#B89B7A]/40"
      )}
    >
      {!isPreview && (
        <div className={cn(
          "absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
          isSelected && "opacity-100"
        )}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <GripVertical className="w-4 h-4 text-[#8F7A6A]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Arrastar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Excluir</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      {renderContent()}
    </div>
  );
}
