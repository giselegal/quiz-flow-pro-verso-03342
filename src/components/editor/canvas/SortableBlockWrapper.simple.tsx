
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { getOptimizedBlockComponent, normalizeBlockProps } from '@/utils/optimizedRegistry';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React from 'react';
import { BLOCK_ID_PREFIX } from '../dnd/constants';

interface SortableBlockWrapperProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

const SortableBlockWrapper: React.FC<SortableBlockWrapperProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  // Normalizar bloco para unificar content/properties (mesma lógica do UniversalBlockRenderer)
  const normalizedBlock = normalizeBlockProps(block);
  // Buscar componente no registry simplificado
  const Component = getOptimizedBlockComponent(normalizedBlock.type);

  // Make block draggable for reordering
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${BLOCK_ID_PREFIX}${String(block.id)}`,
    data: {
      type: 'canvas-block',
      blockId: String(block.id), // Required by validateDrop
      block: block,
    },
  });

  // Combine refs (somente sortable; useSortable já registra droppable internamente na SortableContext)
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const handlePropertyChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  // Fallback se componente não for encontrado
  if (!Component) {
    return (
      <div className="my-1">
        <div
          ref={setNodeRef}
          style={style}
          className="border border-dashed border-gray-300 rounded"
        >
          <div className="p-4 text-center text-gray-600">
            <p className="font-medium">Componente não encontrado: {block.type}</p>
            <p className="text-xs mt-1">Verifique se o tipo está registrado</p>
            <pre className="text-xs mt-2 text-left bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(block, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  const isInteractive = (el: EventTarget | null) => {
    if (!(el instanceof HTMLElement)) return false;
    const tag = el.tagName.toLowerCase();
    if (['input', 'textarea', 'select', 'button'].includes(tag)) return true;
    if (el.getAttribute('contenteditable') === 'true') return true;
    return false;
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isInteractive(e.target)) {
      e.stopPropagation();
      return;
    }
    onSelect();
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (isInteractive(e.target)) {
      // Não roubar o foco de elementos interativos
      e.stopPropagation();
    }
  };

  return (
    <div className="my-0">
      <div
        id={`${BLOCK_ID_PREFIX}${String(block.id)}`}
        ref={setNodeRef}
        style={style}
        className={cn(
          'relative group transition-all duration-200',
          isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
        )}
        data-dnd-dropzone-type="bloco"
        onClick={handleContainerClick}
        onMouseDown={handleContainerMouseDown}
      >
        {/* Drag handle and controls */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing touch-none"
            style={{ touchAction: 'none' }}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Component content */}
        <div>
          <React.Suspense
            fallback={
              <div className="animate-pulse bg-gray-200 h-16 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">Carregando...</span>
              </div>
            }
          >
            <Component
              block={normalizedBlock}
              isSelected={false} // Evita bordas duplas
              onPropertyChange={handlePropertyChange}
              isPreviewMode={false}
              isPreviewing={false}
              previewMode="editor"
              properties={(normalizedBlock as any)?.properties}
            />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default SortableBlockWrapper;
export { SortableBlockWrapper };
