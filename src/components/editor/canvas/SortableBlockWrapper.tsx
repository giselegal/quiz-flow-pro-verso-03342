import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/enhancedBlockRegistry';
import { usePreview } from '@/contexts/PreviewContext';
import { useContainerProperties } from '@/hooks/useContainerProperties';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React from 'react';

interface SortableBlockWrapperProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: number | string,
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

const SortableBlockWrapper: React.FC<SortableBlockWrapperProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  // 🚀 Usar contexto de preview em vez de prop
  const { isPreviewing } = usePreview();

  // 🔧 Integrar propriedades de container diretamente
  const { containerClasses, inlineStyles, processedProperties } = useContainerProperties(
    block.properties
  );

  console.log('🔧 SortableBlockWrapper - processedProperties:', {
    blockId: block.id,
    blockType: block.type,
    originalProperties: block.properties,
    processedProperties,
    containerClasses,
  });

  // 🔧 Extrair propriedades de margem e cor de fundo do bloco
  const {
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
    containerBackgroundColor = 'transparent',
  } = block.properties || {};

  // Buscar componente no registry (eliminando UniversalBlockRenderer)
  const Component = getEnhancedBlockComponent(block.type);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: {
      type: 'canvas-block', // TIPO CRUCIAL que o DndProvider espera
      blockId: block.id,
      block: block,
    },
  });

  // Debug: verificar se o sortable está sendo configurado
  React.useEffect(() => {
    console.log('🔧 SortableBlockWrapper configurado:', {
      id: block.id,
      blockType: block.type,
      isDragging,
      containerClasses, // Agora integrado diretamente
      processedProperties,
      data: {
        type: 'canvas-block',
        blockId: block.id,
      },
    });
  }, [block.id, block.type, isDragging, containerClasses, processedProperties]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto', // Z-index maior durante drag
    // 🎯 NÃO aplicar scale aqui para não afetar margens
  };

  // 🎯 Separar estilos inline para aplicar apenas no Card (conteúdo)
  const contentStyles = {
    ...inlineStyles, // Aplicar scale apenas no conteúdo, não nas margens
  };

  const handlePropertyChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  // Fallback se componente não for encontrado
  if (!Component) {
    return (
      <div ref={setNodeRef} style={style} className="my-1">
        {/* 🎯 Espaçamento FIXO de 4px (my-1 = 0.25rem = 4px) */}
        <Card style={{ borderColor: '#B89B7A' }}>
          <div style={{ color: '#432818' }}>
            <p>Componente não encontrado: {block.type}</p>
            <p className="text-xs mt-1">Verifique se o tipo está registrado</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="my-1">
      {/* 🎯 Espaçamento FIXO de 4px (my-1 = 0.25rem = 4px) - SEMPRE IGUAL independente da escala */}
      <Card
        className={cn(
          'relative group transition-all duration-200', // 🎯 Transição suave
          // 🎯 Aplicar classes de container diretamente no Card
          containerClasses,
          // 🎯 Destaque visual quando selecionado
          isSelected &&
            'ring-2 ring-blue-500 ring-offset-1 border-blue-300 bg-blue-50/30 shadow-lg',
          !isSelected && 'border-stone-200 hover:border-stone-300',
          // Margens universais com controles deslizantes
          getMarginClass(marginTop, 'top'),
          getMarginClass(marginBottom, 'bottom'),
          getMarginClass(marginLeft, 'left'),
          getMarginClass(marginRight, 'right')
        )}
        style={{
          ...contentStyles, // 🎯 Aplicar estilos inline (scale) apenas no Card, não nas margens
          backgroundColor:
            containerBackgroundColor === 'transparent' ? 'transparent' : containerBackgroundColor,
          borderColor: isSelected ? '#3b82f6' : '#E5DDD5',
        }}
      >
        {/* Drag handle and controls - only show on hover and NOT in preview mode */}
        {!isPreviewing && (
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing touch-none"
              style={{ touchAction: 'none' }} // Importante para dispositivos touch
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-3 w-3" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              style={{ color: '#432818' }}
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* 🎯 Container 2: Componente Individual sem bordas - apenas padding mínimo */}
        <div
          className="p-1" // 🎯 Apenas padding, sem bordas
          onClick={!isPreviewing ? onSelect : undefined} // Não executar onClick no modo preview
        >
          {(() => {
            // Props base para o componente - usar props originais do bloco para evitar conflitos
            const componentProps = {
              block: block,
              isSelected: false,
              onClick: onSelect,
              onPropertyChange: handlePropertyChange,
              onValidate: (isValid: boolean) => {
                onUpdate({ properties: { __isValid: isValid } });
              },
            } as any; // Use any to avoid type conflicts temporarily

            // 🎯 MODO PREVIEW: Adicionar props funcionais para comportamento de produção
            if (isPreviewing) {
              return (
                <React.Suspense
                  fallback={<div className="animate-pulse bg-gray-200 h-16 rounded" />}
                >
                  <Component {...componentProps} />
                </React.Suspense>
              );
            }

            // Modo editor normal
            return (
              <React.Suspense fallback={<div className="animate-pulse bg-gray-200 h-16 rounded" />}>
                <Component {...componentProps} />
              </React.Suspense>
            );
          })()}
        </div>
      </Card>
    </div>
  );
};

export default SortableBlockWrapper;
export { SortableBlockWrapper };
