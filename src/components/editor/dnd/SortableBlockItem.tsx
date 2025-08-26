// @ts-nocheck
import { getBlockComponent } from '@/config/enhancedBlockRegistry';
import { useContainerProperties } from '@/hooks/useContainerProperties';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBlockItemProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
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

const SortableBlockItem: React.FC<SortableBlockItemProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
}) => {
  // 🎯 Integrar propriedades de container diretamente
  const { containerClasses, inlineStyles } = useContainerProperties(block.properties);
  const Component = getBlockComponent(block.type);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...inlineStyles, // 🎯 Combinar estilos de sortable com container
  };

  // Fallback se componente não for encontrado
  if (!Component) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div style={{ borderColor: '#E5DDD5' }}>
          <p>Componente não encontrado: {block.type}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'transition-all duration-200 border-transparent rounded', // 🎯 Container 1: Borda transparente por padrão
        containerClasses,
        // 🎯 Apenas borda tracejada discreta quando selecionado
        isSelected && 'border-dashed border-[#B89B7A]/60 border-2',
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      {...attributes}
      {...listeners}
    >
      {/* 🎯 Container 2: Componente Individual com padding mínimo para máximo aproveitamento */}
      <div className="p-1">
        {' '}
        {/* 🎯 Padding mínimo (4px) em vez de p-2 (8px) */}
        <Component
          block={block}
          isSelected={isSelected}
          onClick={onClick}
          onPropertyChange={onPropertyChange}
        />
      </div>
    </div>
  );
};
