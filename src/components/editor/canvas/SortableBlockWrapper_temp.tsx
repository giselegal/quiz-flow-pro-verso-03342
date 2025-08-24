// @ts-nocheck
import { getEnhancedBlockComponent as getBlockComponent } from '@/components/editor/blocks/enhancedBlockRegistry';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useContainerProperties } from '@/hooks/useContainerProperties';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

interface SortableBlockWrapperProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
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
  // 🔧 Integrar propriedades de container diretamente
  const { containerClasses, inlineStyles, processedProperties } = useContainerProperties(
    block.properties
  );

  // Buscar componente no registry (eliminando UniversalBlockRenderer)
  const Component = getBlockComponent(block.type);

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
  };

  const handlePropertyChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  // Fallback se componente não for encontrado
  if (!Component) {
    return (
      <div ref={setNodeRef} style={style} className="my-2">
        {' '}
        {/* 🎯 Espaçamento FIXO de 8px */}
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
    <div ref={setNodeRef} style={style} className="my-2">
      {' '}
      {/* 🎯 Espaçamento FIXO de 8px - SEMPRE IGUAL independente da escala */}
      <Card
        className={cn(
          'relative group transition-all duration-200 border-transparent', // 🎯 Borda transparente por padrão
          // 🎯 Aplicar classes de container diretamente no Card
          containerClasses,
          // 🎯 Apenas borda tracejada discreta quando selecionado
          isSelected && 'border-dashed border-[#B89B7A]/60 border-2',
          // Margens universais com controles deslizantes
          getMarginClass(marginTop, 'top'),
          getMarginClass(marginBottom, 'bottom'),
          getMarginClass(marginLeft, 'left'),
          getMarginClass(marginRight, 'right')
        )}
        style={inlineStyles} // 🎯 Aplicar estilos inline (scale) diretamente
      >
        {/* Drag handle and controls - only show on hover */}
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

        {/* 🎯 Container 2: Componente Individual sem bordas - apenas padding mínimo */}
        <div
          className="p-1" // 🎯 Apenas padding, sem bordas
          onClick={onSelect}
        >
          <Component
            block={block}
            isSelected={false} // 🎯 Forçar isSelected=false para remover bordas do componente
            onClick={onSelect}
            onPropertyChange={handlePropertyChange}
          />
        </div>
      </Card>
    </div>
  );
};
