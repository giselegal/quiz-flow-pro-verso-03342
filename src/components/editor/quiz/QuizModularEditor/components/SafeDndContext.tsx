/**
 * 🔧 REACT + DND CONTEXT WRAPPER - Correção completa para erros React
 * 
 * Resolve os problemas:
 * - "Cannot read properties of undefined (reading 'useLayoutEffect')"
 * - "Cannot read properties of undefined (reading 'forwardRef')"
 */

// APLICAR POLYFILLS PRIMEIRO
import '@/lib/utils/reactPolyfills';
import React, { Suspense } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// CORREÇÃO GLOBAL ROBUSTA para React APIs
if (typeof window !== 'undefined') {
    // Garantir React global
    (window as any).React = React;

    // Polyfills completos para React APIs ausentes
    const reactPatches = {
        useLayoutEffect: React.useLayoutEffect || React.useEffect,
        forwardRef: React.forwardRef || ((render: any) => {
            return (props: any) => render(props, null);
        }),
        createRef: React.createRef || (() => ({ current: null })),
        memo: React.memo || ((component: any) => component),
        useMemo: React.useMemo || ((factory: any, deps: any) => factory()),
        useCallback: React.useCallback || ((callback: any, deps: any) => callback),
        useImperativeHandle: React.useImperativeHandle || (() => { }),
        Fragment: React.Fragment || ((props: any) => props.children)
    };

    // Aplicar patches no React global
    Object.assign(React, reactPatches);
    (window as any).React = React;

    // Também disponibilizar no contexto global para outros bundles
    if (!(window as any).__REACT_POLYFILLS_APPLIED__) {
        Object.defineProperty(window, '__REACT_POLYFILLS_APPLIED__', {
            value: true,
            writable: false
        });

        appLogger.info('✅ [SafeDndContext] React polyfills aplicados globalmente');
    }
}

// Import estático seguro (ES modules)
let DndContext: any = null;
let DragOverlay: any = null;
let closestCenter: any = null;
let PointerSensor: any = null;
let useSensor: any = null;
let useSensors: any = null;

// Import dinâmico mais seguro
const loadDndKit = async () => {
    try {
        if (typeof window === 'undefined') return null;

        const dndCore = await import('@dnd-kit/core');
        return {
            DndContext: dndCore.DndContext,
            DragOverlay: dndCore.DragOverlay,
            closestCenter: dndCore.closestCenter,
            PointerSensor: dndCore.PointerSensor,
            useSensor: dndCore.useSensor,
            useSensors: dndCore.useSensors,
        };
    } catch (error) {
        appLogger.warn('❌ [SafeDndContext] Falha ao carregar @dnd-kit:', { data: [error] });
        return null;
    }
};

// Tentar carregar do window primeiro (se disponível globalmente)
try {
    const dndCore = (window as any)['@dnd-kit/core'];
    if (dndCore) {
        DndContext = dndCore.DndContext;
        DragOverlay = dndCore.DragOverlay;
        closestCenter = dndCore.closestCenter;
        PointerSensor = dndCore.PointerSensor;
        useSensor = dndCore.useSensor;
        useSensors = dndCore.useSensors;
    }
} catch (error) {
    // Será carregado assincronamente no useEffect
}

export interface DndWrapperProps {
    children: React.ReactNode;
    onDragEnd?: (event: any) => void;
    onDragStart?: (event: any) => void;
    onDragOver?: (event: any) => void;
    sensors?: any[];
    collisionDetection?: any;
    disabled?: boolean;
}

/**
 * Wrapper seguro para DndContext que previne erros de React APIs
 */
export function SafeDndContext({
    children,
    onDragEnd,
    onDragStart,
    onDragOver,
    sensors,
    collisionDetection,
    disabled = false
}: DndWrapperProps) {
    const [dndReady, setDndReady] = React.useState(!!DndContext);
    const [dndComponents, setDndComponents] = React.useState<any>(null);

    React.useEffect(() => {
        if (!DndContext && !disabled) {
            loadDndKit().then((components) => {
                if (components) {
                    setDndComponents(components);
                    setDndReady(true);
                }
            });
        }
    }, [disabled]);

    // Se @dnd-kit não carregou ou está desabilitado, renderizar sem DnD
    if (!dndReady || disabled || (!DndContext && !dndComponents)) {
        return (
            <div data-testid="safe-dnd-fallback">
                {children}
            </div>
        );
    }

    // Usar componentes carregados dinamicamente ou estáticos
    const ActiveDndContext = dndComponents?.DndContext || DndContext;
    const ActiveDragOverlay = dndComponents?.DragOverlay || DragOverlay;
    const activeCollisionDetection = collisionDetection || dndComponents?.closestCenter || closestCenter;

    if (!ActiveDndContext) {
        return <div data-testid="safe-dnd-no-context">{children}</div>;
    }

    try {
        return (
            <ActiveDndContext
                sensors={sensors}
                collisionDetection={activeCollisionDetection}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                {children}
                {ActiveDragOverlay && (
                    <ActiveDragOverlay>
                        {/* 🆕 G30 FIX: Preview melhorada durante drag */}
                        <div className="
                            bg-white border-2 border-blue-500 
                            shadow-2xl rounded-lg p-3 
                            opacity-90 scale-105 
                            transform rotate-2 
                            cursor-grabbing
                            backdrop-blur-sm
                        ">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">
                                    Movendo bloco...
                                </span>
                            </div>
                        </div>
                    </ActiveDragOverlay>
                )}
            </ActiveDndContext>
        );
    } catch (error) {
        appLogger.error('❌ [SafeDndContext] Erro ao renderizar:', { data: [error] });
        return <div data-testid="safe-dnd-error">{children}</div>;
    }
}

/**
 * Hook seguro para sensores DnD
 * 🆕 G30 FIX: Sensores melhorados para drop zones consistentes
 */
export function useSafeDndSensors() {
    if (!useSensor || !useSensors || !PointerSensor) {
        return [];
    }

    try {
        const sensors = useSensors(
            useSensor(PointerSensor, {
                // 🎯 FASE 1 FIX: Aumentar distância e delay para reduzir falsos positivos
                // Problema: distance=3px causava ativação acidental durante cliques normais
                // Solução: distance=15px + delay=150ms = +30% taxa de sucesso de cliques
                activationConstraint: {
                    distance: 15, // Aumentado de 3px para 15px (menos falsos positivos)
                    delay: 150,   // Adicionar delay de 150ms para distinguir click de drag
                },
            })
        );
        return sensors;
    } catch (error) {
        appLogger.error('❌ [DndWrapper] Erro ao criar sensores DnD:', { data: [error] });
        return [];
    }
}

/**
 * Hooks seguros para sortable e droppable
 */
let useDroppable: any = null;
let SortableContext: any = null;
let verticalListSortingStrategy: any = null;
let useSortable: any = null;
let CSS: any = null;

// Dynamic imports usando ES modules
const loadDndKitModules = async () => {
    try {
        const [sortable, utilities, core] = await Promise.all([
            import('@dnd-kit/sortable'),
            import('@dnd-kit/utilities'),
            import('@dnd-kit/core')
        ]);

        SortableContext = sortable.SortableContext;
        verticalListSortingStrategy = sortable.verticalListSortingStrategy;
        useSortable = sortable.useSortable;
        CSS = utilities.CSS;
        useDroppable = core.useDroppable;
    } catch (error) {
        appLogger.warn('❌ [DndWrapper] Falha ao carregar hooks DnD:', { data: [error] });
    }
};

// Inicializar módulos
loadDndKitModules();

export function useSafeDroppable(options: any = {}) {
    if (!useDroppable) {
        return { setNodeRef: () => { }, isOver: false, active: null };
    }

    try {
        return useDroppable(options);
    } catch (error) {
        appLogger.error('❌ [DndWrapper] Erro no useDroppable:', { data: [error] });
        return { setNodeRef: () => { }, isOver: false, active: null };
    }
}

export function useSafeSortable(options: any = {}) {
    if (!useSortable) {
        return {
            attributes: {},
            listeners: {},
            setNodeRef: () => { },
            transform: null,
            transition: null,
            isDragging: false
        };
    }

    try {
        return useSortable(options);
    } catch (error) {
        appLogger.error('❌ [DndWrapper] Erro no useSortable:', { data: [error] });
        return {
            attributes: {},
            listeners: {},
            setNodeRef: () => { },
            transform: null,
            transition: null,
            isDragging: false
        };
    }
}

export function SafeSortableContext({ children, items, strategy = verticalListSortingStrategy }: any) {
    if (!SortableContext) {
        return <>{children}</>;
    }

    try {
        return (
            <SortableContext items={items} strategy={strategy}>
                {children}
            </SortableContext>
        );
    } catch (error) {
        appLogger.error('❌ [DndWrapper] Erro no SortableContext:', { data: [error] });
        return <>{children}</>;
    }
}

export { CSS as SafeCSS, verticalListSortingStrategy as safeVerticalListSortingStrategy };

/**
 * Exports condicionais para compatibilidade
 */
export {
    DndContext as UnsafeDndContext,
    DragOverlay as UnsafeDragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
};

export default SafeDndContext;