import React, { memo, useCallback, useMemo } from 'react';
import { Block } from '@/types/editor';
import TestimonialCardInlineBlock from './TestimonialCardInlineBlock';
import TestimonialsCarouselInlineBlock from './TestimonialsCarouselInlineBlock';
import MentorSectionInlineBlock from './MentorSectionInlineBlock';
import QuizIntroHeaderBlock from './QuizIntroHeaderBlock';
import OptionsGridBlock from './OptionsGridBlock';
import TextInlineBlock from './TextInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import { cn } from '@/lib/utils';

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isPreviewing?: boolean;
  mode?: string; // Legacy compatibility
  onUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onDelete?: (blockId: string) => void;
  onSelect?: (blockId: string) => void;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🚀 UNIVERSAL BLOCK RENDERER v3.0
 * 
 * Sistema unificado para renderizar qualquer tipo de bloco
 * ✅ Zero Coupling com contextos específicos
 * ✅ Suporte universal a todos os tipos de bloco
 * ✅ Props padronizadas e flexíveis
 * ✅ Feature flags para versionamento
 */

// 🎮 Feature Flags - Sistema de versionamento controlado
const featureFlags = {
  useCleanArchitecture: process.env.NODE_ENV === 'development',
  enableAdvancedLogging: process.env.NODE_ENV === 'development',
  useModernComponents: true,
};

// 🗂️ REGISTRY DE COMPONENTES - Mapeamento Universal
const BlockComponentRegistry = {
  // Quiz Components
  'quiz-intro-header': QuizIntroHeaderBlock,
  'options-grid': OptionsGridBlock,

  // Basic Components
  'text-inline': TextInlineBlock,
  'button-inline': ButtonInlineBlock,

  // Business Components
  'mentor-section-inline': MentorSectionInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  'testimonials-carousel-inline': TestimonialsCarouselInlineBlock,

  // Fallbacks
  headline: (props: any) => {
    const { isSelected, isPreviewing, onUpdate, block, ...domProps } = props;
    return <div {...domProps}>Headline</div>;
  },
  text: (props: any) => {
    const { isSelected, isPreviewing, onUpdate, block, ...domProps } = props;
    return <div {...domProps}>Text</div>;
  },
  image: (props: any) => {
    const { isSelected, isPreviewing, onUpdate, block, ...domProps } = props;
    return <div {...domProps}>Image</div>;
  },
  button: (props: any) => {
    const { isSelected, isPreviewing, onUpdate, block, ...domProps } = props;
    return <div {...domProps}>Button</div>;
  },
  form: (props: any) => {
    const { isSelected, isPreviewing, onUpdate, block, ...domProps } = props;
    return <div {...domProps}>Form</div>;
  },
  spacer: (props: any) => {
    const { isSelected, isPreviewing, onUpdate, block, ...domProps } = props;
    return <div {...domProps}>Spacer</div>;
  },
  container: (props: any) => {
    const { isSelected, isPreviewing, onUpdate, block, ...domProps } = props;
    return <div {...domProps}>Container</div>;
  },
};

const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = memo(({
  block,
  isSelected = false,
  isPreviewing = false,
  onUpdate,
  onDelete,
  onSelect,
  // Fallback para tipos desconhecidos
  console.warn(`⚠️ Tipo de bloco desconhecido: ${block.type}. Usando fallback.`);
  return({ children, isSelected, isPreviewing, onUpdate, block: blockProp, className, style, ...domProps }: any) => (
    <div
      className={cn("p-4 border-2 border-dashed border-orange-300 bg-orange-50 rounded", className)}
      style={style}
    >
      <div className="text-sm text-orange-700 font-medium">
        Tipo desconhecido: {block.type}
      </div>
      <div className="text-xs text-orange-600 mt-1">
        ID: {block.id}
      </div>
      {children}
    </div>
  );
// 🧠 RESOLUÇÃO DE COMPONENTE - Smart component resolution
const BlockComponent = useMemo(() => {
  const Component = BlockComponentRegistry[block.type as keyof typeof BlockComponentRegistry];

  if (!Component) {
    // Fallback para tipos desconhecidos
    console.warn(`⚠️ Tipo de bloco desconhecido: ${block.type}. Usando fallback.`);
    return ({ children, isSelected, isPreviewing, onUpdate, className, style }: any) => (
      <div
        className={cn("p-4 border-2 border-dashed border-orange-300 bg-orange-50 rounded", className)}
        style={style}
      >
        <div className="text-sm text-orange-700 font-medium">
          Tipo desconhecido: {block.type}
        </div>
        <div className="text-xs text-orange-600 mt-1">
          ID: {block.id}
        </div>
        {children}
      </div>
    );
  }

  return Component;
}, [block.type]);

// 🎛️ HANDLERS UNIFICADOS - Event handling padronizado
const handleUpdate = useCallback((updates: Partial<Block>) => {
  if (featureFlags.enableAdvancedLogging) {
    console.log('🔄 UniversalBlockRenderer: Update solicitado:', {
      blockId: block.id,
      updates,
      hasOnUpdate: !!onUpdate,
    });
  }
  onUpdate?.(block.id, updates);
}, [block.id, onUpdate]);

const handleClick = useCallback(() => {
  // Priority: onSelect > onClick (legacy)
  if (onSelect) {
    onSelect(block.id);
  } else if (onClick) {
    onClick();
  }
}, [block.id, onSelect, onClick]);

// 🎨 RENDER - Sistema de renderização unificado
return (
  <div
    className={cn(
      'universal-block-renderer',
      'relative group transition-all duration-200',
      isSelected && 'ring-2 ring-primary ring-offset-2',
      !isPreviewing && 'hover:shadow-sm',
      className
    )}
    style={style}
    onClick={!isPreviewing ? handleClick : undefined}
    data-block-id={block.id}
    data-block-type={block.type}
  >
    {/* 🗑️ DELETE BUTTON - Apenas no modo editor */}
    {!isPreviewing && (
      <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1">
          {featureFlags.useCleanArchitecture && (
            <span className="px-1 py-0.5 bg-blue-500 text-white text-xs rounded">
              v3.0
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(block.id);
            }}
            className="w-6 h-6 bg-destructive text-destructive-foreground rounded text-xs hover:bg-destructive/90"
          >
            ×
          </button>
        </div>
      </div>
    )}

    {/* Componente do bloco */}
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

export default UniversalBlockRenderer;