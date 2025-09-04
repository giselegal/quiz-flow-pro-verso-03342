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
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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

const InterBlockDropZone = React.memo(InterBlockDropZoneBase);

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
}) => {
  useRenderCount('CanvasDropZone');

  // 🔍 DEBUG: Log blocks data
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 CanvasDropZone received blocks:', {
        blocksCount: blocks?.length || 0,
        blocks: blocks?.slice(0, 3), // Log first 3 blocks
        scopeId,
        selectedBlockId
      });
    }
  }, [blocks, scopeId, selectedBlockId]);

  React.useEffect(() => {
    mark('CanvasDropZone:mounted');
  }, []);
  // Evitar recriar arrays/objetos a cada render (impede re-registro contínuo no dnd-kit)
  const rootAccepts = React.useMemo(() => ['sidebar-component', 'canvas-block'], []);
  const rootData = React.useMemo(
    () => ({
      type: 'dropzone',
      accepts: rootAccepts,
      position: blocks.length, // Posição no final
      debug: 'main-canvas-zone', // Para debug
    }),
    [rootAccepts, blocks.length]
  );

  const { setNodeRef, isOver } = useDroppable({
    // Escopar o id do droppable raiz por etapa para evitar colisões entre etapas 2–21
    id: generateUniqueId({
      stepNumber: scopeId ?? 'default',
      type: 'dropzone'
    }),
    data: { ...rootData, scopeId: scopeId ?? 'default' },
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

  // Debug do drop zone - somente quando explicitamente habilitado
  const isDebug = React.useCallback(() => {
    try {
      return (
        ((import.meta as any)?.env?.DEV ?? false) ||
        (typeof process !== 'undefined' && (process as any)?.env?.NODE_ENV === 'development') ||
        (typeof window !== 'undefined' && (window as any).__DND_DEBUG === true)
      );
    } catch {
      return false;
    }
  }, []);

  const activeId = active?.id;
  const activeType = active?.data.current?.type;
  const activeBlockType = active?.data.current?.blockType;
  React.useEffect(() => {
    if (!isDebug()) return;
    // eslint-disable-next-line no-console
    console.log('🎯 CanvasDropZone: isOver =', isOver, 'active =', activeId);
    if (activeType === 'sidebar-component') {
      // eslint-disable-next-line no-console
      console.log('📦 Arrastando componente da sidebar:', activeBlockType);
    } else if (activeType === 'canvas-block') {
      // eslint-disable-next-line no-console
      console.log('🔄 Reordenando bloco do canvas:', activeId);
    }
  }, [isOver, activeId, activeType, activeBlockType, isDebug]);

  // Modo preview controlado por prop (default: false)
  const isPreviewing = !!isPreviewingProp;

  // Virtualização condicional (somente preview e listas muito grandes; nunca durante drag)
  const VIRTUALIZE_THRESHOLD = 120;
  const AVG_ITEM_HEIGHT = 120; // px (estimativa)
  const OVERSCAN = 8; // itens
  // Flag dinâmica para permitir alternância em tempo real (via header)
  const [virtDisabledDynamic, setVirtDisabledDynamic] = React.useState<boolean>(() => {
    try {
      const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
      return g?.__NO_CANVAS_VIRT__ === true;
    } catch {
      return false;
    }
  });
  React.useEffect(() => {
    const handler = (e: Event) => {
      try {
        const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
        const detail: any = (e as any)?.detail;
        const next = typeof detail?.disabled === 'boolean' ? detail.disabled : g?.__NO_CANVAS_VIRT__ === true;
        setVirtDisabledDynamic(Boolean(next));
      } catch {
        // noop
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('canvas-virt-flag-changed', handler as EventListener);
      return () => window.removeEventListener('canvas-virt-flag-changed', handler as EventListener);
    }
    return;
  }, []);
  const enableVirtualization =
    isPreviewing &&
    !isDraggingAnyValidComponent &&
    !virtDisabledDynamic &&
    blocks.length > VIRTUALIZE_THRESHOLD;

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState<number>(600);

  // Observa altura do container
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerHeight(el.clientHeight || 600));
    ro.observe(el);
    setContainerHeight(el.clientHeight || 600);
    return () => ro.disconnect();
  }, []); // Empty dependency array - only runs once on mount

  const onScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollTop(el.scrollTop || 0);
  }, []);

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

  return (
    <div
      id={CANVAS_ROOT_ID}
      ref={setNodeRef}
      className={cn(
        'min-h-[300px] transition-all duration-200 p-4 overflow-visible',
        // Evitar qualquer bloqueio de eventos no canvas
        'z-0',
        isOver && !isPreviewing && 'bg-brand/5 ring-2 ring-brand/20 ring-dashed',
        'border border-dashed border-gray-200 rounded-lg',
        // ✅ CLASSE CSS DE FORÇA BRUTA
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
      {blocks.length === 0 ? (
        <div className="text-center py-12">
          {enableProgressiveEdit && editRenderCount < blocks.length ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <LoadingSpinner size="lg" color="#B89B7A" />
              <p className="text-stone-500 text-sm">
                Carregando componentes ({editRenderCount} de {blocks.length})...
              </p>
            </div>
          ) : (
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
        // Virtualização leve em preview
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="w-full max-w-[37rem] mx-auto overflow-y-auto"
          style={{ maxHeight: '70vh' }}
        >
          {blocks.length > 0 ? (
            <div className="space-y-6">
              <div style={{ height: visibleMeta.topPad }} />
              {/* Drop zone no início absoluto do canvas (posição 0) quando no topo */}
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
          items={React.useMemo(
            () => blocks.map(block => generateUniqueId({
              stepNumber: scopeId ?? 'default',
              blockId: String(block.id),
              type: 'block'
            })),
            [blocks, scopeId]
          )}
          strategy={verticalListSortingStrategy}
        >
          {/* Wrapper interno para limitar largura dos componentes no canvas (≈15% mais largo) */}
          <div className="w-full max-w-[37rem] mx-auto">
            <div className="space-y-6">
              {/* Drop zone no início - sempre presente (ativa durante drag) */}
              <InterBlockDropZone position={0} isActive={isDraggingAnyValidComponent} scopeId={scopeId} />

              {(enableProgressiveEdit ? blocks.slice(0, editRenderCount) : blocks).map((block, index) => (
                <React.Fragment key={String(block.id)}>
                  <SortableBlockWrapper
                    block={block}
                    isSelected={!isPreviewing && selectedBlockId === block.id}
                    onSelect={() => !isPreviewing && onSelectBlock(block.id)}
                    onUpdate={updates => {
                      if (!isPreviewing) {
                        onUpdateBlock(block.id, updates);
                      }
                    }}
                    onDelete={() => {
                      if (!isPreviewing) {
                        onDeleteBlock(block.id);
                      }
                    }}
                    scopeId={scopeId}
                  />

                  {/* Drop zone entre blocos - sempre presente (ativa durante drag) */}
                  <InterBlockDropZone position={index + 1} isActive={isDraggingAnyValidComponent} scopeId={scopeId} />
                </React.Fragment>
              ))}
            </div>
          </div>
        </SortableContext>
      )}
    </div>
  );
};

export const CanvasDropZone = React.memo(CanvasDropZoneBase);

export default CanvasDropZone;
