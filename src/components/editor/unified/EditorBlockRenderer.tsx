/**
 * 🎯 EDITOR BLOCK RENDERER - Sistema de renderização específico para o editor
 * 
 * Este componente é responsável por renderizar blocos no contexto do editor,
 * fornecendo funcionalidades específicas como seleção, edição inline e preview.
 */

import React, { Suspense } from 'react';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/EnhancedBlockRegistry';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export interface EditorBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isPreview?: boolean;
  mockData?: any;
  funnelId?: string;
  currentStep?: number;
  onSelect?: () => void;
  onUpdate?: (updates: any) => void;
  className?: string;
}

/**
 * Wrapper para adicionar funcionalidades de edição aos blocos
 */
const EditorBlockWrapper: React.FC<{
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
}> = ({ block, isSelected, isPreview, onSelect, children }) => {
  const [isHovering, setIsHovering] = React.useState(false);

  if (isPreview) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        'relative transition-all duration-200 cursor-pointer group',
        'hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 rounded-lg',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isHovering && !isSelected && 'ring-1 ring-primary/20'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Toolbar do bloco (aparece no hover ou seleção) */}
      {(isSelected || isHovering) && (
        <div className="absolute -top-8 left-0 z-10 flex items-center gap-2">
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md shadow-lg">
            {block.type}
          </div>
          <div className="bg-stone-800 text-white text-xs px-2 py-1 rounded-md shadow-lg">
            {block.id}
          </div>
        </div>
      )}

      {/* Overlay de hover */}
      <div className={cn(
        'absolute inset-0 bg-primary/5 rounded-lg pointer-events-none transition-opacity',
        (isHovering || isSelected) ? 'opacity-100' : 'opacity-0'
      )} />

      {children}
    </div>
  );
};

/**
 * Renderer principal para blocos do editor
 */
export const EditorBlockRenderer: React.FC<EditorBlockRendererProps> = ({
  block,
  isSelected = false,
  isPreview = false,
  mockData,
  funnelId,
  currentStep,
  onSelect,
  onUpdate,
  className = '',
}) => {
  const Component = getEnhancedBlockComponent(block.type);

  if (!Component) {
    return (
      <div className={cn(
        'min-h-[60px] border border-red-200 bg-red-50 rounded-lg p-4 text-center',
        className
      )}>
        <div className="text-red-600 text-sm">
          ⚠️ Componente não encontrado: <code>{block.type}</code>
        </div>
        <div className="text-red-500 text-xs mt-1">
          ID: {block.id}
        </div>
      </div>
    );
  }

  // Preparar props para o componente
  const componentProps = {
    block,
    properties: block.properties || {},
    content: block.content || {},
    isSelected: isSelected && !isPreview,
    isPreviewing: isPreview,
    isEditor: !isPreview,
    mockData,
    funnelId,
    currentStep,
    onSave: (updates: any) => {
      onUpdate?.(updates);
    },
    onClick: () => {
      if (!isPreview) {
        onSelect?.();
      }
    },
    // Passar todas as propriedades do bloco como props
    ...block.properties,
  };

  return (
    <EditorBlockWrapper
      block={block}
      isSelected={isSelected}
      isPreview={isPreview}
      onSelect={onSelect}
    >
      <Suspense
        fallback={
          <div className={cn(
            'min-h-[80px] bg-stone-50 border border-stone-200 rounded-lg animate-pulse',
            'flex items-center justify-center',
            className
          )}>
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-sm text-stone-500">
              Carregando {block.type}...
            </span>
          </div>
        }
      >
        <Component {...componentProps} />
      </Suspense>
    </EditorBlockWrapper>
  );
};

export default EditorBlockRenderer;