import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { mark } from '@/utils/perf';
import React from 'react';
import { useRenderCount } from '@/hooks/useRenderCount';
import { CANVAS_ROOT_ID } from '../dnd/constants';
import { generateUniqueId } from '@/utils/generateUniqueId';
import { SortableBlockWrapper } from './SortableBlockWrapper.simple';
import { globalBlockElementCache } from '@/utils/BlockElementCache';
import { isEditorCoreV2Enabled } from '@/utils/editorFeatureFlags';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCanvasContainerStyles } from '@/hooks/useCanvasContainerStyles';
import { HookOrderDebugger } from '@/components/debug/HookOrderDebugger';
import { usePureBuilder } from '@/components/editor/PureBuilderProvider';
import EmptyCanvasInterface from '@/components/editor/EmptyCanvasInterface';

// Componente simplificado de navegação (placeholder) – versão anterior foi corrompida durante patch
const EditorNavigationControls: React.FC<{ scopeId?: string | number }> = () => {
  return (
    <div className="flex justify-center py-4">
      <div className="text-xs text-stone-400 select-none">
        Navegação de etapas (placeholder)
      </div>
    </div>
  );
};
// --- Fim placeholder navegação ---

// Componente para drop zone entre blocos (sempre presente para maximizar detecção)
const InterBlockDropZoneBase: React.FC<{
  position: number;
  isActive?: boolean;
  scopeId?: string | number;
}> = ({ position, isActive = true, scopeId }) => {
  // Evitar recriar arrays/objetos a cada render (impede re-registro contínuo no dnd-kit)
  const accepts = React.useMemo(() => ['sidebar-component', 'canvas-block'], []);
  const data = React.useMemo(() => ({ type: 'dropzone', accepts, position }), [accepts, position]);

  const { setNodeRef, isOver } = useDroppable({
    id: generateUniqueId({
      stepNumber: scopeId ?? 'default',
      position,
      type: 'slot'
    }),
    data: { ...data, scopeId: scopeId ?? 'default' },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-all duration-150 relative flex items-center justify-center w-full',
        'z-10',
        // Sempre renderizado: manter hit area perceptível
        'min-h-[16px]',
        // Ao arrastar sobre: ampliar e dar feedback visual
        isOver && 'min-h-[56px] bg-brand/10 border-2 border-dashed border-brand/40 rounded-lg',
        // Quando ativo (há drag em andamento) mas não está over: indicar posição sutil
        isActive && !isOver && 'min-h-[40px] bg-brand/5 rounded-full',
        // Só permitir eventos quando há drag ativo
        isActive ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      data-dnd-dropzone-type="slot"
      data-position={position}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-brand font-medium text-xs sm:text-sm bg-white/90 px-2 sm:px-3 py-1.5 rounded shadow-sm">
            Inserir aqui (posição {position})
          </p>
        </div>
      )}
    </div>
  );
};

// 🚀 OTIMIZAÇÃO: Componente memoizado para drop zone entre blocos
const InterBlockDropZone = React.memo(InterBlockDropZoneBase, (prevProps, nextProps) => {
  return (
    prevProps.position === nextProps.position &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.scopeId === nextProps.scopeId
  );
});

InterBlockDropZone.displayName = 'InterBlockDropZone';

interface CanvasDropZoneProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  className?: string;
  isPreviewing?: boolean;
  // Identificador de escopo (ex.: número da etapa) para garantir unicidade dos IDs do dnd-kit
  scopeId?: string | number;
  // Callback para desselecionar blocos quando clica no canvas vazio
  onDeselectBlocks?: () => void;
}

const CanvasDropZoneBase: React.FC<CanvasDropZoneProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  className,
  isPreviewing: isPreviewingProp = false,
  scopeId,
  onDeselectBlocks,
}) => {
  // 🆕 CANVAS VAZIO: Acesso ao estado do PureBuilder para verificar totalSteps
  const { state } = usePureBuilder();

  // Calcular totalSteps com base nas stepBlocks disponíveis
  const totalSteps = React.useMemo(() => {
    const stepKeys = Object.keys(state?.stepBlocks || {});
    const stepNumbers = stepKeys
      .map(key => {
        const match = key.match(/step-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);

    return stepNumbers.length > 0 ? Math.max(...stepNumbers) : 0;
  }, [state?.stepBlocks]);

  // 🚀 OTIMIZAÇÃO: Condicionar useRenderCount apenas no desenvolvimento e quando debug estiver ativo
  if (process.env.NODE_ENV === 'development' && (window as any).__DND_DEBUG === true) {
    useRenderCount('CanvasDropZone');
  }

  // 🔧 CORREÇÃO: Mover useMemo para fora da renderização condicional
  // Sempre calcular items do SortableContext para manter hook order consistente
  const sortableItems = React.useMemo(() => {
    return blocks.map(block => generateUniqueId({
      stepNumber: scopeId ?? 'default',
      blockId: String(block.id),
      type: 'block'
    }));
  }, [blocks, scopeId]);

  // 🚀 OTIMIZAÇÃO: Hook para aplicar estilos dinâmicos - condicionar para evitar re-render
  const canvasStylesEnabled = React.useMemo(() =>
    process.env.NODE_ENV === 'development' && (window as any).__CANVAS_STYLES_DEBUG === true,
    []
  );

  if (canvasStylesEnabled) {
    useCanvasContainerStyles();
  }

  // 🔍 DEBUG: Hook order debugger
  const hookCalls = React.useMemo(() => [
    'useRenderCount',
    'sortableItems-useMemo',
    'useCanvasContainerStyles',
    'hookCalls-useMemo'
  ], []);

  React.useEffect(() => {
    mark('CanvasDropZone:mounted');
  }, []);

  // 🚀 OTIMIZAÇÃO: Evitar recriar arrays/objetos a cada render (impede re-registro contínuo no dnd-kit)
  const rootAccepts = React.useMemo(() => ['sidebar-component', 'canvas-block'], []);

  // 🚀 OTIMIZAÇÃO: Memoizar o ID do droppable para evitar recriação
  const droppableId = React.useMemo(() =>
    generateUniqueId({
      stepNumber: scopeId ?? 'default',
      type: 'dropzone'
    }),
    [scopeId]
  );

  // 🚀 OTIMIZAÇÃO: Memoizar dados do droppable
  const droppableData = React.useMemo(() => ({
    type: 'dropzone',
    accepts: rootAccepts,
    position: blocks.length,
    debug: 'main-canvas-zone',
    scopeId: scopeId ?? 'default'
  }), [rootAccepts, blocks.length, scopeId]);

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: droppableData,
  });

  // Usa useDndContext para obter active do contexto DnD
  const { active } = useDndContext();

  // Verifica se qualquer item arrastável válido está ativo
  const isDraggingAnyValidComponent = React.useMemo(() => {
    if (!active) return false;
    const t = active?.data.current?.type;
    const overId = active?.id ? String(active?.id) : '';
    return t === 'sidebar-component' || t === 'canvas-block' || overId.startsWith('sidebar-item-');
  }, [active]);

  // 🚀 OTIMIZAÇÃO: Debug do drop zone - memoizar callback e somente quando explicitamente habilitado
  const isDebugEnabled = React.useMemo(() => {
    try {
      return (
        ((import.meta as any)?.env?.DEV ?? false) ||
        (process.env.NODE_ENV === 'development') ||
        ((window as any)?.__DND_DEBUG === true)
      );
    } catch {
      return false;
    }
  }, []);

  const debugLog = React.useCallback((message: string, data?: any) => {
    if (isDebugEnabled) {
      console.log(`🎯 ${message}`, data);
    }
  }, [isDebugEnabled]);

  const activeId = active?.id;
  const activeType = active?.data.current?.type;
  const activeBlockType = active?.data.current?.blockType;

  // 🚀 OTIMIZAÇÃO: Debug effect condicional e memoizado
  React.useEffect(() => {
    if (!isDebugEnabled) return;

    debugLog('CanvasDropZone: isOver =', { isOver, activeId });

    if (activeType === 'sidebar-component') {
      debugLog('📦 Arrastando componente da sidebar:', activeBlockType);
    } else if (activeType === 'canvas-block') {
      debugLog('🔄 Reordenando bloco do canvas:', activeId);
    }
  }, [isOver, activeId, activeType, activeBlockType, isDebugEnabled, debugLog]);

  // Modo preview controlado por prop (default: false)
  const isPreviewing = !!isPreviewingProp;

  // 🚀 OTIMIZAÇÃO: Constantes de virtualização
  const VIRTUALIZE_THRESHOLD = React.useMemo(() => 120, []);
  const AVG_ITEM_HEIGHT = React.useMemo(() => 120, []); // px (estimativa)
  const OVERSCAN = React.useMemo(() => 8, []); // itens

  // 🚀 OTIMIZAÇÃO: Flag dinâmica para permitir alternância em tempo real (memoizada)
  const [virtDisabledDynamic, setVirtDisabledDynamic] = React.useState<boolean>(() => {
    try {
      const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
      return g?.__NO_CANVAS_VIRT__ === true;
    } catch {
      return false;
    }
  });

  // 🚀 OTIMIZAÇÃO: UseEffect para events otimizado com debounce
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handler = (e: Event) => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        try {
          const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
          const detail: any = (e as any)?.detail;
          const next = typeof detail?.disabled === 'boolean' ? detail.disabled : g?.__NO_CANVAS_VIRT__ === true;
          setVirtDisabledDynamic(Boolean(next));
        } catch {
          // noop
        }
      }, 50); // Debounce de 50ms
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('canvas-virt-flag-changed', handler as EventListener);
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        window.removeEventListener('canvas-virt-flag-changed', handler as EventListener);
      };
    }
    return;
  }, []);
  // 🚀 OTIMIZAÇÃO: Memoizar enableVirtualization para evitar recálculos
  const enableVirtualization = React.useMemo(() =>
    isPreviewing &&
    !isDraggingAnyValidComponent &&
    !virtDisabledDynamic &&
    blocks.length > VIRTUALIZE_THRESHOLD,
    [isPreviewing, isDraggingAnyValidComponent, virtDisabledDynamic, blocks.length, VIRTUALIZE_THRESHOLD]
  );

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState<number>(600);

  // 🚀 OTIMIZAÇÃO: Observa altura do container com debounce
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const ro = new ResizeObserver(() => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setContainerHeight(el.clientHeight || 600);
      }, 100); // Debounce de 100ms
    });

    ro.observe(el);
    setContainerHeight(el.clientHeight || 600);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      ro.disconnect();
    };
  }, []); // Empty dependency array - only runs once on mount

  // 🚀 OTIMIZAÇÃO: Scroll handler com debounce para evitar re-renders excessivos
  const onScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el || !enableVirtualization) return;

    requestAnimationFrame(() => {
      setScrollTop(el.scrollTop || 0);
    });
  }, [enableVirtualization]);

  const visibleMeta = React.useMemo(() => {
    const visibleCount = Math.max(1, Math.ceil(containerHeight / AVG_ITEM_HEIGHT));
    let startIndex = Math.max(0, Math.floor(scrollTop / AVG_ITEM_HEIGHT) - OVERSCAN);
    let endIndex = Math.min(blocks.length, startIndex + visibleCount + OVERSCAN * 2);
    // Ajuste final caso end alcance o fim
    if (endIndex - startIndex < visibleCount && endIndex === blocks.length) {
      startIndex = Math.max(0, blocks.length - (visibleCount + OVERSCAN * 2));
    }
    const topPad = startIndex * AVG_ITEM_HEIGHT;
    const bottomPad = Math.max(0, (blocks.length - endIndex) * AVG_ITEM_HEIGHT);
    return { startIndex, endIndex, topPad, bottomPad };
  }, [scrollTop, containerHeight, blocks.length]);

  // Renderização progressiva no modo edição para listas enormes (reduz pico de render)
  const EDIT_PROGRESSIVE_THRESHOLD = 200;
  const EDIT_BATCH_SIZE = 100;
  const enableProgressiveEdit =
    !isPreviewing &&
    !isDraggingAnyValidComponent &&
    !virtDisabledDynamic &&
    blocks.length > EDIT_PROGRESSIVE_THRESHOLD;

  const [editRenderCount, setEditRenderCount] = React.useState<number>(
    enableProgressiveEdit ? Math.min(EDIT_BATCH_SIZE, blocks.length) : blocks.length
  );

  // Ajusta quando o tamanho muda ou quando entramos/saímos do modo progressivo
  React.useEffect(() => {
    if (enableProgressiveEdit) {
      setEditRenderCount(prev => Math.min(Math.max(prev, EDIT_BATCH_SIZE), blocks.length));
    } else {
      setEditRenderCount(blocks.length);
    }
  }, [enableProgressiveEdit, blocks.length]);

  // Se houver drag, garantir lista completa
  React.useEffect(() => {
    if (isDraggingAnyValidComponent) {
      setEditRenderCount(blocks.length);
    }
  }, [isDraggingAnyValidComponent, blocks.length]);

  // Loop de incremento em idle/rAF
  React.useEffect(() => {
    if (!enableProgressiveEdit) return;
    if (editRenderCount >= blocks.length) return;

    let cancelled = false;
    let rafId: number | null = null;
    let timeoutId: number | null = null;
    let idleId: number | null = null;
    const step = () => {
      if (cancelled) return;
      setEditRenderCount(prev => {
        if (prev >= blocks.length) return prev;
        const next = Math.min(blocks.length, prev + EDIT_BATCH_SIZE);
        return next;
      });
      if (!cancelled) schedule();
    };
    const schedule = () => {
      const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
      if (g?.requestIdleCallback) {
        idleId = g.requestIdleCallback(() => step()) as unknown as number;
      } else if (g?.requestAnimationFrame) {
        rafId = g.requestAnimationFrame(() => step()) as unknown as number;
      } else {
        timeoutId = setTimeout(step, 16) as unknown as number;
      }
    };
    schedule();
    return () => {
      cancelled = true;
      try {
        const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
        if (rafId != null && g?.cancelAnimationFrame) g.cancelAnimationFrame(rafId as unknown as number);
        if (timeoutId != null) clearTimeout(timeoutId as unknown as number);
        if (idleId != null && g?.cancelIdleCallback) g.cancelIdleCallback(idleId as unknown as number);
      } catch { /* noop */ }
    };
  }, [enableProgressiveEdit, editRenderCount, blocks.length]);

  // Handler para cliques no canvas vazio (desselecionar blocos)
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Só desseleciona se o clique foi diretamente no canvas (não em blocos)
    if (e.target === e.currentTarget && onDeselectBlocks && !isPreviewing) {
      onDeselectBlocks();
    }
  };

  return (
    <div
      id={CANVAS_ROOT_ID}
      ref={setNodeRef}
      onClick={handleCanvasClick}
      className={cn(
        'min-h-[300px] transition-all duration-200 p-2 overflow-visible',
        'z-0',
        isOver && !isPreviewing && 'bg-brand/5 ring-2 ring-brand/20 ring-dashed',
        'border border-dashed border-gray-200 rounded-lg',
        'dnd-droppable-zone',
        'customizable-width',
        className
      )}
      data-over={isOver}
      data-preview={isPreviewing}
      data-id="canvas-drop-zone"
      data-canvas-optimized="true"
      data-dnd-dropzone-type="raiz-da-tela"
    >
      {/* 🔍 Hook Order Debugger */}
      <HookOrderDebugger
        componentName="CanvasDropZone"
        hookCalls={hookCalls}
      />

      {blocks.length === 0 ? (
        <div className="text-center py-12">
          {enableProgressiveEdit && editRenderCount < blocks.length ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <LoadingSpinner size="lg" color="#B89B7A" />
              <p className="text-stone-500 text-sm">
                Carregando componentes ({editRenderCount} de {blocks.length})...
              </p>
            </div>
          ) : totalSteps === 0 ? (
            // 🆕 CANVAS COMPLETAMENTE VAZIO: Mostrar interface especial para criar primeira etapa
            <EmptyCanvasInterface
              onCreateFirstStep={() => {
                // Callback para após criar primeira etapa
                console.log('✅ Primeira etapa criada via EmptyCanvasInterface');
              }}
            />
          ) : (
            // Canvas vazio para uma etapa específica (etapas existem, mas esta está vazia)
            <>
              <p className="text-stone-500 text-lg mb-2">
                {isPreviewing
                  ? 'Modo Preview - Nenhum componente nesta etapa'
                  : 'Canvas vazio - Arraste componentes da sidebar para começar'}
              </p>
              {(isOver || isDraggingAnyValidComponent) && !isPreviewing && (
                <div className="mt-4 p-4 border-2 border-dashed border-brand/30 rounded-lg bg-brand/5">
                  <p className="text-brand font-medium">Solte o componente aqui</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : enableVirtualization ? (
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="w-full"
          style={{ maxWidth: 800, margin: '0 auto', height: 'auto' }}
        >
          {blocks.length > 0 ? (
            <div className="space-y-3">
              <div style={{ height: visibleMeta.topPad }} />
              {visibleMeta.startIndex === 0 && (
                <InterBlockDropZone position={0} isActive={false} scopeId={scopeId} />
              )}
              {blocks.slice(visibleMeta.startIndex, visibleMeta.endIndex).map((block, i) => {
                const realIndex = visibleMeta.startIndex + i;
                return (
                  <React.Fragment key={String(block.id)}>
                    <SortableBlockWrapper
                      block={block}
                      isSelected={false}
                      onSelect={() => { }}
                      onUpdate={() => { }}
                      onDelete={() => { }}
                      scopeId={scopeId}
                    />
                    <InterBlockDropZone position={realIndex + 1} isActive={false} scopeId={scopeId} />
                  </React.Fragment>
                );
              })}
              <div style={{ height: visibleMeta.bottomPad }} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" color="#B89B7A" />
              <p className="text-stone-500 text-sm mt-4">
                Carregando visualização...
              </p>
            </div>
          )}
        </div>
      ) : (
        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          <div className="w-full" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="space-y-3">
              <InterBlockDropZone position={0} isActive={isDraggingAnyValidComponent} scopeId={scopeId} />
              {/**
               * Reutilização de JSX por bloco
               * - Cache global somente ativo quando Core V2 está ligado (feature flag)
               * - Clonamos o elemento para injetar seleções/handlers atuais sem invalidar cache base
               */}
              {(enableProgressiveEdit ? blocks.slice(0, editRenderCount) : blocks).map((block, index) => {
                const coreV2 = isEditorCoreV2Enabled();
                const baseCacheId = `block:${block.id}`; // id estável por bloco
                let cached = coreV2 ? globalBlockElementCache.get(baseCacheId) : null;

                if (!cached) {
                  // Criar versão base sem handlers dinâmicos (serão aplicados via clone)
                  cached = (
                    <SortableBlockWrapper
                      block={block}
                      isSelected={false /* atualizado no clone */}
                      onSelect={() => { /* placeholder */ }}
                      onUpdate={() => { /* placeholder */ }}
                      onDelete={() => { /* placeholder */ }}
                      scopeId={scopeId}
                    />
                  );
                  if (coreV2) {
                    globalBlockElementCache.set(baseCacheId, cached);
                  }
                }

                // Clonar com props dinâmicas atuais (seleção e handlers reais)
                const element = React.cloneElement(cached as React.ReactElement<any>, {
                  isSelected: !isPreviewing && selectedBlockId === block.id,
                  onSelect: () => { if (!isPreviewing) onSelectBlock(block.id); },
                  onUpdate: (updates: any) => { if (!isPreviewing) onUpdateBlock(block.id, updates); },
                  onDelete: () => { if (!isPreviewing) onDeleteBlock(block.id); },
                });

                return (
                  <React.Fragment key={String(block.id)}>
                    {element}
                    <InterBlockDropZone position={index + 1} isActive={isDraggingAnyValidComponent} scopeId={scopeId} />
                  </React.Fragment>
                );
              })}

              {!isPreviewing && blocks.length > 0 && (
                <EditorNavigationControls scopeId={scopeId} />
              )}
            </div>
          </div>
        </SortableContext>
      )}
    </div>
  );
};

// 🚀 OTIMIZAÇÃO: React.memo com comparação customizada para evitar re-renders desnecessários
const CanvasDropZoneMemoized = React.memo(CanvasDropZoneBase, (prevProps, nextProps) => {
  // Comparação otimizada para evitar re-renders desnecessários
  return (
    prevProps.blocks.length === nextProps.blocks.length &&
    prevProps.selectedBlockId === nextProps.selectedBlockId &&
    prevProps.isPreviewing === nextProps.isPreviewing &&
    prevProps.scopeId === nextProps.scopeId &&
    prevProps.className === nextProps.className &&
    // Comparação profunda apenas se necessário - verificar se blocks mudaram realmente
    prevProps.blocks.every((block, index) => {
      const nextBlock = nextProps.blocks[index];
      return nextBlock && block.id === nextBlock.id && block.type === nextBlock.type;
    })
  );
});

CanvasDropZoneMemoized.displayName = 'CanvasDropZone';

export const CanvasDropZone = CanvasDropZoneMemoized;

export default CanvasDropZone;
