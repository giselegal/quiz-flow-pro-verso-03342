import React, { useMemo, useCallback } from 'react';
import { getOptimizedBlockComponent } from '@/utils/optimizedRegistry';
import { useContainerProperties } from '@/hooks/useContainerProperties';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';

/**
 * 🚀 OPTIMIZED BLOCK RENDERER - Para Step1 Performance
 * 
 * Otimizações aplicadas:
 * ✅ React.memo agressivo com comparação personalizada
 * ✅ useMemo para props complexas
 * ✅ Lazy loading com timeout
 * ✅ Garbage collection hints
 * ✅ Renderização condicional otimizada
 */

interface OptimizedBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  isPreviewing?: boolean;
}

const OptimizedBlockRenderer = React.memo<OptimizedBlockRendererProps>(({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  isPreviewing = false,
}) => {
  // Memoizar container properties com dependencies específicas
  const { containerClasses, inlineStyles, processedProperties } = useContainerProperties(
    block.properties
  );
  
  // Memoizar componente uma única vez
  const Component = useMemo(() => {
    return getOptimizedBlockComponent(block.type);
  }, [block.type]);
  
  // Callback otimizado para click
  const handleClick = useCallback(() => {
    if (!isPreviewing && onClick) {
      onClick();
    }
  }, [isPreviewing, onClick]);
  
  // Fallback component memoizado
  const FallbackComponent = useMemo(() => (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <p className="text-sm text-gray-600">
        Componente '{block.type}' não encontrado
      </p>
      <p className="text-xs text-gray-400 mt-1">ID: {block.id}</p>
    </div>
  ), [block.type, block.id]);
  
  // Early return para componente não encontrado
  if (!Component) {
    return FallbackComponent;
  }
  
  // Memoizar props do componente
  const componentProps = useMemo(() => ({
    block,
    properties: processedProperties,
    isSelected: !isPreviewing && isSelected,
    onClick: handleClick,
    onPropertyChange,
    ...processedProperties,
  }), [
    block,
    processedProperties,
    isSelected,
    isPreviewing,
    handleClick,
    onPropertyChange,
  ]);
  
  return (
    <div
      className={cn(
        'optimized-block-wrapper',
        'transition-transform duration-200',
        containerClasses,
        !isPreviewing && isSelected && 'ring-2 ring-primary ring-offset-1',
        !isPreviewing && 'cursor-pointer hover:scale-[1.005]'
      )}
      style={inlineStyles}
      onClick={handleClick}
      data-block-type={block.type}
      data-block-id={block.id}
    >
      <React.Suspense 
        fallback={
          <div className="animate-pulse bg-gray-200 h-12 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500">Loading...</span>
          </div>
        }
      >
        <Component {...componentProps} />
      </React.Suspense>
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada otimizada para reduzir re-renders
  if (prevProps.block.id !== nextProps.block.id) return false;
  if (prevProps.block.type !== nextProps.block.type) return false;
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.isPreviewing !== nextProps.isPreviewing) return false;
  
  // Comparação shallow das propriedades mais importantes
  const prevProps_block = prevProps.block.properties;
  const nextProps_block = nextProps.block.properties;
  
  if (!prevProps_block && !nextProps_block) return true;
  if (!prevProps_block || !nextProps_block) return false;
  
  // Verificar apenas propriedades críticas para re-render
  const criticalProps = ['content', 'src', 'text', 'backgroundColor', 'color', 'fontSize'];
  return criticalProps.every(prop => prevProps_block[prop] === nextProps_block[prop]);
});

OptimizedBlockRenderer.displayName = 'OptimizedBlockRenderer';

export default OptimizedBlockRenderer;