import { cn } from '@/lib/utils';
import { EditorBlock } from '@/types/editor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronUp, Copy, GripVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import EditBlockContent from './EditBlockContent';

interface EditorBlockItemProps {
  block: EditorBlock;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: string | number,
  type: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const EditorBlockItem: React.FC<EditorBlockItemProps> = ({ block, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  };

  const getBlockTitle = () => {
    switch (block.type) {
      case 'headline':
        return 'Título';
      case 'text':
        return 'Texto';
      case 'image':
        return 'Imagem';
      case 'benefits':
        return 'Benefícios';
      case 'testimonials':
        return 'Depoimentos';
      case 'pricing':
        return 'Preço';
      case 'guarantee':
        return 'Garantia';
      case 'cta':
        return 'Botão CTA';
      default:
        return 'Bloco';
    }
  };

  const handleDuplicate = () => {
    // This would be handled by the parent component
    alert('Duplicar bloco não implementado ainda');
  };

  const handleUpdateBlock = (blockId: string, properties: any) => {
    onUpdate(properties);
  };

  // Ensure block has properties defined
  const blockWithProperties = {
    ...block,
    properties: block.properties || {},
  };

  // Extract margin values from block properties
  const {
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
  } = (blockWithProperties.properties as any) || {};

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'border-2 overflow-hidden',
        isDragging ? 'border-[#B89B7A]' : 'border-[#B89B7A]/20',
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      {/* Block Header */}
      <div className="bg-[#FAF9F7] border-b border-[#B89B7A]/20 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="cursor-grab" {...attributes} {...listeners}>
            <GripVertical className="w-4 h-4 text-[#8F7A6A]" />
          </Button>
          <span className="font-medium text-[#432818]">{getBlockTitle()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleDuplicate}>
            <Copy className="w-4 h-4 text-[#8F7A6A]" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#8F7A6A]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8F7A6A]" />
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} style={{ color: '#432818' }}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Block Content */}
      {isExpanded && (
        <div className="p-4 bg-white">
          <EditBlockContent block={blockWithProperties} onUpdateBlock={handleUpdateBlock} />
        </div>
      )}
    </Card>
  );
};
