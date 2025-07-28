
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { ModularBlockRenderer } from '../blocks/ModularBlockSystem';

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
    // Use ModularBlockRenderer for all blocks
    return (
      <ModularBlockRenderer
        block={{
          id: block.id,
          type: block.type,
          content: block.content,
          properties: block.content
        }}
        isSelected={isSelected}
        isEditing={!isPreview}
        className="w-full"
      />
    );
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
