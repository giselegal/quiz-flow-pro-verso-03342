import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/EnhancedBlockRegistry';
// Importações diretas para componentes críticos (performance)
import QuizIntroHeaderBlock from './QuizIntroHeaderBlock';
import OptionsGridBlock from './OptionsGridBlock';
import TextInlineBlock from './TextInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import TestimonialCardInlineBlock from './TestimonialCardInlineBlock';
import TestimonialsCarouselInlineBlock from './TestimonialsCarouselInlineBlock';
import MentorSectionInlineBlock from './MentorSectionInlineBlock';
import { FashionAIGeneratorBlock } from '@/components/blocks/ai';

// @ts-nocheck
export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isPreviewing?: boolean;
  mode?: 'editor' | 'preview' | 'production';
  onUpdate?: (blockId: string, updates: any) => void;
  onDelete?: (blockId: string) => void;
  onSelect?: (blockId: string) => void;
  onPropertyChange?: (key: any, value: any) => void;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const createFallbackComponent = (type: string) => {
  return (props: any) => {
    const { isSelected, isPreviewing, onUpdate, block, ...domProps } = props;

    return (
      <div
        {...domProps}
        className={cn("p-4 border border-gray-300 rounded", domProps.className)}
      >
        <div className="text-sm text-gray-600">
          {type === 'text' && (block?.content?.text || block?.content?.content || 'Texto')}
          {type === 'headline' && (block?.content?.text || 'Título')}
          {type === 'image' && 'Imagem'}
          {type === 'button' && (block?.content?.text || 'Botão')}
          {type === 'form' && 'Formulário'}
          {type === 'spacer' && ''}
          {type === 'container' && 'Container'}
        </div>
      </div>
    );
  };
};

const BlockComponentRegistry: Record<string, React.FC<any>> = {
  'quiz-intro-header': QuizIntroHeaderBlock,
  'options-grid': OptionsGridBlock,
  'text-inline': TextInlineBlock,
  'button-inline': ButtonInlineBlock,
  'mentor-section-inline': MentorSectionInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  'testimonials-carousel-inline': TestimonialsCarouselInlineBlock,
  'fashion-ai-generator': FashionAIGeneratorBlock,
  'text': createFallbackComponent('text'),
  'headline': createFallbackComponent('headline'),
  'image': createFallbackComponent('image'),
  'button': createFallbackComponent('button'),
  'form': createFallbackComponent('form'),
  'spacer': createFallbackComponent('spacer'),
  'container': createFallbackComponent('container'),
};

// ✅ SISTEMA HÍBRIDO: Cache crítico + EnhancedBlockRegistry completo
const getBlockComponent = (blockType: string) => {
  // 1. Cache de componentes críticos para performance máxima
  if (BlockComponentRegistry[blockType]) {
    return BlockComponentRegistry[blockType];
  }

  // 2. Buscar no EnhancedBlockRegistry (150+ componentes)
  const enhancedComponent = getEnhancedBlockComponent(blockType);
  if (enhancedComponent) {
    return enhancedComponent;
  }

  // 3. Fallback final
  return null;
};

// ✅ OTIMIZAÇÃO: Hook memoizado com sistema híbrido
const useBlockComponent = (blockType: string) => {
  return useMemo(() => getBlockComponent(blockType), [blockType]);
};

const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = memo(({
  block,
  isSelected = false,
  isPreviewing = false,
  onUpdate,
  onDelete,
  onSelect,
  className,
  style,
  onClick,
}) => {
  // ✅ OTIMIZAÇÃO: Usar hook cacheado ao invés de lookup direto
  const BlockComponent = useBlockComponent(block.type);

  // ✅ OTIMIZAÇÃO: Memoizar handlers com dependências estáveis
  const handleUpdate = useMemo(() =>
    onUpdate ? (updates: any) => onUpdate(block.id, updates) : undefined
    , [block.id, onUpdate]);

  const handleClick = useMemo(() => {
    if (onSelect) {
      return () => onSelect(block.id);
    } else if (onClick) {
      return onClick;
    }
    return undefined;
  }, [block.id, onSelect, onClick]);

  if (!BlockComponent) {
    return (
      <div
        className={cn(
          "p-4 border-2 border-dashed border-orange-300 bg-orange-50 rounded",
          className
        )}
        style={style}
        onClick={!isPreviewing ? handleClick : undefined}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <div className="text-sm text-orange-700 font-medium mb-2">
          Tipo desconhecido: {block.type}
        </div>
        <div className="text-xs text-orange-600">
          ID: {block.id}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'universal-block-renderer relative group transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        !isPreviewing && 'hover:shadow-sm cursor-pointer',
        className
      )}
      style={style}
      onClick={!isPreviewing ? handleClick : undefined}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {!isPreviewing && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          ×
        </button>
      )}

      {!isPreviewing && isSelected && (
        <div className="absolute top-0 left-0 -mt-6 text-xs bg-blue-500 text-white px-2 py-1 rounded z-10">
          {block.type}
        </div>
      )}

      <BlockComponent
        block={block}
        isSelected={isSelected}
        isPreviewing={isPreviewing}
        onUpdate={handleUpdate}
      />
    </div>
  );
});

UniversalBlockRenderer.displayName = 'UniversalBlockRenderer';

export { UniversalBlockRenderer };
export default UniversalBlockRenderer;
