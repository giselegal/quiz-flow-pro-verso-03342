import { useContainerProperties } from '@/hooks/useContainerProperties';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { getOptimizedBlockComponent, normalizeBlockProps } from '@/utils/optimizedRegistry';
import React from 'react';
import { ProductionBlockBoundary, SimpleBlockFallback } from './ProductionBlockBoundary';

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  mode?: 'production' | 'preview' | 'editor';
}

/**
 * 🎯 UNIVERSAL BLOCK RENDERER - VERSÃO 2.0 OTIMIZADA
 * ✅ Usa Enhanced Registry com 150+ componentes
 * ✅ Sistema de fallback inteligente por categoria
 * ✅ Normalização automática de propriedades
 * ✅ Compatível com templates e editor
 * ✅ Performance otimizada com Suspense
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: number | string,
  type: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (!numValue || isNaN(numValue) || numValue === 0) return '';

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

const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = React.memo(({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  mode = 'production',
}) => {
  // ✅ Normalizar propriedades para compatibilidade template/editor
  const normalizedBlock = normalizeBlockProps(block);

  // ✅ Buscar componente otimizado com fallback inteligente
  const Component = React.useMemo(() =>
    getOptimizedBlockComponent(normalizedBlock.type),
    [normalizedBlock.type]
  );

  // Processar propriedades de container usando o hook
  const { containerClasses, inlineStyles, processedProperties } = useContainerProperties(
    normalizedBlock.properties
  );

  // 🎚️ Controle de escala universal (aplicado a TODOS os componentes via wrapper)
  const scaleTransform = React.useMemo(() => {
    const {
      scale: rawScale,
      scaleX: rawScaleX,
      scaleY: rawScaleY,
      scaleClass,
      scaleOrigin = 'center',
    } = (normalizedBlock.properties as any) || {};

    // Normalizar valores de escala
    let parsedScale = typeof rawScale === 'string' ? parseFloat(rawScale) : rawScale;
    const parsedScaleX = typeof rawScaleX === 'string' ? parseFloat(rawScaleX) : rawScaleX;
    const parsedScaleY = typeof rawScaleY === 'string' ? parseFloat(rawScaleY) : rawScaleY;

    // Compatibilidade: se vier em porcentagem (ex.: 100, 75), converter para fator
    if (typeof parsedScale === 'number' && parsedScale > 2) {
      parsedScale = parsedScale / 100;
    }

    const sx = parsedScaleX ?? parsedScale ?? 1;
    const sy = parsedScaleY ?? parsedScale ?? 1;

    // Mesclar transform existente com a escala
    const baseTransform = (inlineStyles as any)?.transform as string | undefined;
    const scaleTransformValue = sx === 1 && sy === 1 ? undefined : `scale(${sx}, ${sy})`;
    const mergedTransform = [baseTransform, scaleTransformValue].filter(Boolean).join(' ');

    return {
      scaleClass,
      scaleOrigin,
      mergedTransform,
      scaleTransformValue
    };
  }, [normalizedBlock.properties, inlineStyles]);

  // Otimizar classes de margem com useMemo
  const marginClasses = React.useMemo(() => {
    const props = normalizedBlock.properties || {};
    return [
      getMarginClass(props.marginTop ?? 0, 'top'),
      getMarginClass(props.marginBottom ?? 0, 'bottom'),
      getMarginClass(props.marginLeft ?? 0, 'left'),
      getMarginClass(props.marginRight ?? 0, 'right')
    ].filter(Boolean).join(' ');
  }, [normalizedBlock.properties]);

  // Log para debug das propriedades de container (apenas em desenvolvimento)
  if (
    import.meta.env.DEV &&
    (normalizedBlock.properties?.containerWidth || normalizedBlock.properties?.containerPosition)
  ) {
    console.log(`🎯 Container properties for ${normalizedBlock.id}:`, {
      blockType: normalizedBlock.type,
      originalProperties: block.properties,
      normalizedProperties: normalizedBlock.properties,
      processedProperties,
      generatedClasses: containerClasses,
    });
  }

  // Com o novo sistema, Component nunca será null devido ao fallback universal
  if (!Component) {
    console.error(`❌ Erro crítico: fallback universal falhou para ${normalizedBlock.type}`);
    return (
      <SimpleBlockFallback
        blockType={normalizedBlock.type}
        blockId={normalizedBlock.id}
        message={`Erro crítico: sistema de fallback falhou para '${normalizedBlock.type}'`}
      />
    );
  }

  try {
    return (
      <ProductionBlockBoundary blockType={normalizedBlock.type} blockId={normalizedBlock.id}>
        <div
          className={cn(
            'block-wrapper transition-all duration-200',
            containerClasses,
            // Classe de escala opcional (Tailwind), ex.: 'scale-95 md:scale-100'
            scaleTransform.scaleClass,
            // Margens universais otimizadas
            marginClasses,
            isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2'
          )}
          onClick={onClick}
          style={{
            ...inlineStyles,
            ...(scaleTransform.mergedTransform && { transform: scaleTransform.mergedTransform }),
            ...(scaleTransform.scaleTransformValue && { transformOrigin: scaleTransform.scaleOrigin, willChange: 'transform' }),
          }}
        >
          <React.Suspense fallback={<div className="animate-pulse bg-gray-200 h-16 rounded" />}>
            <Component
              block={normalizedBlock}
              properties={processedProperties}
              isSelected={isSelected}
              onClick={onClick}
              onPropertyChange={onPropertyChange}
              mode={mode}
              isPreviewMode={mode === 'preview'}
              {...processedProperties}
            />
          </React.Suspense>
        </div>
      </ProductionBlockBoundary>
    );
  } catch (error) {
    console.error(`❌ Erro crítico ao renderizar bloco ${normalizedBlock.type}:`, error);

    return (
      <SimpleBlockFallback
        blockType={normalizedBlock.type}
        blockId={normalizedBlock.id}
        message={error instanceof Error ? error.message : 'Erro de renderização crítico'}
      />
    );
  }
}, (prevProps, nextProps) => {
  // Comparação otimizada para evitar re-renders desnecessários
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.mode !== nextProps.mode) return false;
  if (prevProps.block.id !== nextProps.block.id) return false;
  if (prevProps.block.type !== nextProps.block.type) return false;

  // Comparação superficial das propriedades do bloco
  const prevProps_ = prevProps.block.properties || {};
  const nextProps_ = nextProps.block.properties || {};
  const prevKeys = Object.keys(prevProps_);
  const nextKeys = Object.keys(nextProps_);

  if (prevKeys.length !== nextKeys.length) return false;

  for (const key of prevKeys) {
    if (prevProps_[key] !== nextProps_[key]) return false;
  }

  return true;
});

export default UniversalBlockRenderer;
