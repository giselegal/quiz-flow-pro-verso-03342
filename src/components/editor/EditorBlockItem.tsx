import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditorBlock } from '@/types/editor';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2, GripVertical, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import EditBlockContent from './EditBlockContent';

interface EditorBlockItemProps {
  block: EditorBlock;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

export const EditorBlockItem: React.FC<EditorBlockItemProps> = ({
  block,
  onUpdate,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0
  };

  const getBlockTitle = () => {
    switch (block.type) {
      case 'headline': return 'Título';
      case 'text': return 'Texto';
      case 'image': return 'Imagem';
      case 'benefits': return 'Benefícios';
      case 'testimonials': return 'Depoimentos';
      case 'pricing': return 'Preço';
      case 'guarantee': return 'Garantia';
      case 'cta': return 'Botão CTA';
      default: return 'Bloco';
    }
  };

  const handleDuplicate = () => {
    // This would be handled by the parent component
    alert('Duplicar bloco não implementado ainda');
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-2 overflow-hidden",
        isDragging ? "border-[#B89B7A]" : "border-[#B89B7A]/20"
      )}
    >
      {/* Block Header */}
      <div className="bg-[#FAF9F7] border-b border-[#B89B7A]/20 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-grab"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-[#8F7A6A]" />
          </Button>
          <span className="font-medium text-[#432818]">{getBlockTitle()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDuplicate}
          >
            <Copy className="w-4 h-4 text-[#8F7A6A]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 
              <ChevronUp className="w-4 h-4 text-[#8F7A6A]" /> : 
              <ChevronDown className="w-4 h-4 text-[#8F7A6A]" />
            }
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Block Content */}
      {isExpanded && (
        <div className="p-4 bg-white">
          <EditBlockContent
            block={block}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </Card>
  );
};
