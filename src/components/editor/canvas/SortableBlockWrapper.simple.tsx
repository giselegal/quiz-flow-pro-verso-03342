import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { getOptimizedBlockComponent, normalizeBlockProps } from '@/utils/optimizedRegistry';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React from 'react';
import { generateUniqueId } from '@/utils/generateUniqueId';
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
  onUpdate: _onUpdate,
  onDelete,
  scopeId,
}) => {
  // Normalizar bloco para unificar content/properties (mesma lógica do UniversalBlockRenderer)
  const normalizedBlock = normalizeBlockProps(block);

  // Hook para aplicar estilos dinâmicos
  useCanvasContainerStyles();

  // 🔍 DEBUG: Log block details to identify the issue
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 SortableBlockWrapper block details:', {
        blockId: block?.id,
        originalBlockType: block?.type,
        normalizedBlockType: normalizedBlock?.type,
        hasOriginalType: !!block?.type,
        hasNormalizedType: !!normalizedBlock?.type,
        blockProperties: block?.properties,
        normalizedProperties: normalizedBlock?.properties,
        scopeId
      });

      // DEBUG EXTRA: Teste manual do registry
      if (normalizedBlock?.type) {
        console.log('🧪 Teste manual do registry para:', normalizedBlock.type);
        try {
          const testComponent = getOptimizedBlockComponent(normalizedBlock.type);
          console.log('🎯 Resultado do teste:', testComponent ? 'SUCESSO' : 'FALHOU');

          // Teste adicional: verificar se o componente tem as propriedades esperadas
          if (testComponent) {
            console.log('📋 Propriedades do componente:', {
              name: testComponent.name || testComponent.displayName || 'Anônimo',
              type: typeof testComponent,
              isReactComponent: typeof testComponent === 'function'
            });
          }
        } catch (error) {
          console.error('❌ Erro no teste manual:', error);
        }
      }
    }
  }, [block, normalizedBlock, scopeId]);

  // Buscar componente no registry simplificado
  const Component = React.useMemo(() => {
    try {
      return getOptimizedBlockComponent(normalizedBlock.type);
    } catch (error) {
      console.error('❌ Erro fatal ao buscar componente, usando fallback direto:', error);

      // Fallback direto baseado no tipo
      const type = normalizedBlock.type;
      if (type === 'quiz-intro-header') {
        const QuizIntroHeaderBlock = require('@/components/editor/blocks/QuizIntroHeaderBlock').default;
        return QuizIntroHeaderBlock;
      }
      if (type === 'text') {
        const TextInlineBlock = require('@/components/editor/blocks/TextInlineBlock').default;
        return TextInlineBlock;
      }
      if (type === 'image') {
        const ImageInlineBlock = require('@/components/editor/blocks/ImageInlineBlock').default;
        return ImageInlineBlock;
      }

      // Fallback visual final
      return ({ block }: { block?: any }) => (
        <div className="border border-red-200 bg-red-50 p-4 rounded">
          <p className="text-red-600 font-medium">Erro: Componente não encontrado</p>
          <p className="text-red-500 text-sm">Tipo: {type}</p>
          <p className="text-red-500 text-sm">ID: {block?.id}</p>
        </div>
      );
    }
  }, [normalizedBlock.type]);

  // Make block draggable for reordering
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: generateUniqueId({
      stepNumber: scopeId ?? 'default',
      blockId: String(block.id),
      type: 'block'
    }),
    data: {
      type: 'canvas-block',
      blockId: String(block.id), // Required by validateDrop
      block: block,
      scopeId: scopeId ?? 'default',
    },
  });

  // Combine refs (somente sortable; useSortable já registra droppable internamente na SortableContext)
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
  };

  // Style configuration for draggable element
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
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

  // Mantido para futura detecção de elementos interativos (não utilizado atualmente)
  // Seleção centralizada com debounce por etapa
  const numericStep = typeof scopeId === 'number' ? scopeId : Number(scopeId) || 0;
  const { handleBlockSelection } = useStepSelection({
    stepNumber: numericStep,
    onSelectBlock: () => onSelect(),
    debounceMs: 50,
  });

  // Um único handler no capture para garantir seleção estável
  const handlePointerDownCapture = (e: React.PointerEvent) => {
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
        // eslint-disable-next-line no-console
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
  };

  // Fallback adicional: garantir seleção também em onClick (debounce do hook evita duplicidade)
  const handleClick = (e: React.MouseEvent) => {
    // Ignorar cliques com modificadores ou se um drag explícito prevenir o default
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.defaultPrevented) return;
    try {
      const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
      if (g?.__DND_DEBUG) {
        // eslint-disable-next-line no-console
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

        {/* Component content (canvas é somente visual; edição ocorre no painel de propriedades) */}
        <div className="pointer-events-none select-none" aria-disabled>
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
              onPropertyChange={() => { /* edição via painel de propriedades */ }}
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

const SortableBlockWrapper = React.memo(SortableBlockWrapperBase);

export default SortableBlockWrapper;
export { SortableBlockWrapper };
