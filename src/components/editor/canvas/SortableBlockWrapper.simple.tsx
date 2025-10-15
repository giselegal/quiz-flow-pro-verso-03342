import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React, { useMemo } from 'react';
import { useStepSelection } from '@/hooks/useStepSelection';
import { useCanvasContainerStyles } from '@/hooks/useCanvasContainerStyles';

interface SortableBlockWrapperProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  // Escopo opcional para garantir unicidade de IDs entre etapas
  scopeId?: string | number;
}

const SortableBlockWrapperBase: React.FC<SortableBlockWrapperProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  scopeId,
}) => {
  // Hook para aplicar estilos dinâmicos
  useCanvasContainerStyles();

  // ✅ OTIMIZAÇÃO: Memoizar IDs estáveis para evitar recreação no useSortable
  const stableSortableId = useMemo(() => {
    return `sortable-${scopeId ?? 'default'}-${block.id}-block`;
  }, [scopeId, block.id]);

  // ✅ OTIMIZAÇÃO: Memoizar data structure para evitar recreação
  const sortableData = useMemo(() => ({
    type: 'canvas-block' as const,
    blockId: String(block.id),
    blockType: block.type, // Cached block type
    scopeId: scopeId ?? 'default',
    // ✅ Não passar objeto block inteiro - apenas propriedades essenciais
    position: block.position,
    properties: {
      // Apenas propriedades essenciais para drag
      visible: block.properties?.visible ?? true,
    }
  }), [block.id, block.type, block.position, block.properties?.visible, scopeId]);

  // Make block draggable for reordering - agora com IDs estáveis
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stableSortableId,
    data: sortableData,
  });

  // ✅ OTIMIZAÇÃO: Memoizar setNodeRef para evitar recreação
  const setNodeRef = useMemo(() => (node: HTMLElement | null) => {
    setSortableRef(node);
  }, [setSortableRef]);

  // ✅ OTIMIZAÇÃO: Memoizar style object para evitar recreação desnecessária
  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : ('auto' as const),
  }), [transform, transition, isDragging]);

  // ✅ OTIMIZAÇÃO: Memoizar cálculo de step numérico
  const numericStep = useMemo(() =>
    typeof scopeId === 'number' ? scopeId : Number(scopeId) || 0
    , [scopeId]);

  // ✅ OTIMIZAÇÃO: Memoizar onSelect callback para evitar recreação
  const onSelectCallback = useMemo(() => () => onSelect(), [onSelect]);

  const { handleBlockSelection } = useStepSelection({
    stepNumber: numericStep,
    onSelectBlock: onSelectCallback,
    debounceMs: 50,
  });

  // ✅ OTIMIZAÇÃO: Memoizar handler para evitar recreação constante
  const handlePointerDownCapture = useMemo(() => (e: React.PointerEvent) => {
    // Só botão principal e sem modificadores
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const target = e.target as HTMLElement | null;
    const isInteractive = !!target?.closest(
      'input, textarea, select, button, [contenteditable="true"], [role="textbox"], [role="button"], .allow-text-selection'
    );
    const onDragHandle = !!target?.closest('[data-drag-handle]');

    try {
      const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
      if (g?.__DND_DEBUG) {
        console.log('🖱️ onPointerDownCapture -> selecionar bloco', {
          step: numericStep,
          blockId: String(block.id),
          scopeId,
          isInteractive,
          onDragHandle,
        });
      }
    } catch { }
    // Evitar foco/caret em elementos não interativos ao apenas selecionar o bloco
    if (!isInteractive && !onDragHandle) {
      e.preventDefault();
    }
    // Selecionar sempre (inclusive quando clicar em áreas não interativas)
    handleBlockSelection(String(block.id));
  }, [numericStep, block.id, scopeId, handleBlockSelection]);

  // Fallback adicional: garantir seleção também em onClick (debounce do hook evita duplicidade)
  const handleClick = (e: React.MouseEvent) => {
    // Ignorar cliques com modificadores ou se um drag explícito prevenir o default
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.defaultPrevented) return;
    try {
      const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
      if (g?.__DND_DEBUG) {
        console.log('🖱️ onClick -> selecionar bloco (fallback)', {
          step: numericStep,
          blockId: String(block.id),
          scopeId,
        });
      }
    } catch { }
    handleBlockSelection(String(block.id));
  };

  return (
    <div className="my-0">
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'relative group transition-all duration-200',
          isSelected ? 'ring-2 ring-[#B89B7A] ring-offset-1' : '',
          // Em etapas com conteúdo altamente interativo, facilitar hover/target do wrapper
          'hover:ring-1 hover:ring-[#B89B7A]/40 hover:ring-offset-1',
          // Forçar ponteiro padrão no wrapper para evitar cursor de texto ao selecionar
          'cursor-default'
        )}
        data-dnd-dropzone-type="bloco"
        data-block-id={String(block.id)}
        data-scope-id={String(scopeId ?? 'default')}
        onPointerDownCapture={handlePointerDownCapture}
        onClick={handleClick}
      >
        {/* Drag handle and controls */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing touch-none"
            style={{ touchAction: 'none' }}
            data-drag-handle
            {...attributes}
            {...listeners}
            aria-label="Arrastar bloco"
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
            aria-label="Remover bloco"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* 🎯 RENDERIZAÇÃO UNIFICADA: Usando UniversalBlockRenderer como na produção */}
        <div className="pointer-events-auto select-none" aria-disabled={false}>
          <React.Suspense
            fallback={
              <div className="animate-pulse bg-gray-200 h-16 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">Carregando...</span>
              </div>
            }
          >
            <UniversalBlockRenderer
              block={block}
              isSelected={false} // Evita bordas duplas
              isPreviewing={false}
              mode="editor"
              onUpdate={(_, updates) => onUpdate(updates)}
              onDelete={(_) => onDelete()}
              onPropertyChange={(key, value) => {
                onUpdate({ properties: { ...block.properties, [key]: value } });
              }}
            />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

const SortableBlockWrapper = React.memo(SortableBlockWrapperBase);

export default SortableBlockWrapper;
export { SortableBlockWrapper };