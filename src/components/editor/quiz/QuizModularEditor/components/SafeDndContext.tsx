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
let closestCorners: any = null;
let pointerWithin: any = null;
let PointerSensor: any = null;
let KeyboardSensor: any = null;
let TouchSensor: any = null;
let useSensor: any = null;
let useSensors: any = null;
let sortableKeyboardCoordinates: any = null;

// Import dinâmico mais seguro
const loadDndKit = async () => {
    try {
        if (typeof window === 'undefined') return null;

        const dndCore = await import('@dnd-kit/core');
        const dndSortable = await import('@dnd-kit/sortable');
        return {
            DndContext: dndCore.DndContext,
            DragOverlay: dndCore.DragOverlay,
            closestCenter: dndCore.closestCenter,
            closestCorners: dndCore.closestCorners,
            pointerWithin: dndCore.pointerWithin,
            PointerSensor: dndCore.PointerSensor,
            KeyboardSensor: dndCore.KeyboardSensor,
            TouchSensor: dndCore.TouchSensor,
            useSensor: dndCore.useSensor,
            useSensors: dndCore.useSensors,
            sortableKeyboardCoordinates: dndSortable.sortableKeyboardCoordinates,
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
                    // Atribuir globalmente para useSafeDndSensors
                    DndContext = components.DndContext;
                    DragOverlay = components.DragOverlay;
                    closestCenter = components.closestCenter;
                    closestCorners = components.closestCorners;
                    pointerWithin = components.pointerWithin;
                    PointerSensor = components.PointerSensor;
                    KeyboardSensor = components.KeyboardSensor;
                    TouchSensor = components.TouchSensor;
                    useSensor = components.useSensor;
                    useSensors = components.useSensors;
                    sortableKeyboardCoordinates = components.sortableKeyboardCoordinates;

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

    // ✨ FASE 2: Estratégia de colisão customizada híbrida para listas verticais
    const customCollisionDetection = React.useCallback((args: any) => {
        const activeClosestCorners = dndComponents?.closestCorners || closestCorners;
        const activePointerWithin = dndComponents?.pointerWithin || pointerWithin;
        const activeClosestCenter = dndComponents?.closestCenter || closestCenter;

        // 1. Tentar closestCorners (mais preciso para listas verticais)
        if (activeClosestCorners) {
            const cornersCollision = activeClosestCorners(args);
            if (cornersCollision && cornersCollision.length > 0) {
                return cornersCollision;
            }
        }

        // 2. Fallback para pointerWithin (cursor dentro do elemento)
        if (activePointerWithin) {
            const pointerCollision = activePointerWithin(args);
            if (pointerCollision && pointerCollision.length > 0) {
                return pointerCollision;
            }
        }

        // 3. Fallback final para closestCenter
        if (activeClosestCenter) {
            return activeClosestCenter(args);
        }

        return [];
    }, [dndComponents]);

    const activeCollisionDetection = collisionDetection || customCollisionDetection;

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
                    <ActiveDragOverlay
                        dropAnimation={{
                            duration: 300,
                            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                        }}
                    >
                        {/* ✨ FASE 2: Preview premium com design melhorado */}
                        <div className="
                            bg-gradient-to-br from-white to-blue-50
                            border-2 border-blue-500 
                            shadow-2xl rounded-lg p-4 
                            opacity-95 scale-105 
                            cursor-grabbing
                            backdrop-blur-sm
                            min-w-[280px]
                        ">
                            <div className="flex items-center gap-3">
                                {/* Ícone de drag animado 2x2 */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                </div>

                                {/* Conteúdo */}
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-gray-800 mb-0.5">
                                        Movendo bloco
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Solte para reposicionar
                                    </div>
                                </div>

                                {/* Badge de movimento com ícone */}
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
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
 * ✨ FASE 1 FIX: Sensores otimizados para DnD responsivo e acessível
 * ⚠️ IMPORTANTE: Hooks devem ser chamados incondicionalmente (Rules of Hooks)
 */
export function useSafeDndSensors() {
    if (!useSensor || !useSensors || !PointerSensor) {
        return [];
    }

    try {
        // ✅ Sempre chamar TODOS os hooks na mesma ordem
        // Não usar condicionais dentro do array de sensores
        const sensors = useSensors(
            // 🖱️ PointerSensor: Mouse e Pen (SEMPRE presente)
            useSensor(PointerSensor, {
                activationConstraint: {
                    distance: 5,
                    tolerance: 5,
                },
            }),
            // ⌨️ KeyboardSensor: SEMPRE chamado, mas apenas se disponível
            useSensor(KeyboardSensor || PointerSensor, {
                ...(KeyboardSensor && sortableKeyboardCoordinates
                    ? { coordinateGetter: sortableKeyboardCoordinates }
                    : {}
                ),
            }),
            // 📱 TouchSensor: SEMPRE chamado, mas apenas se disponível
            useSensor(TouchSensor || PointerSensor, {
                activationConstraint: {
                    delay: 250,
                    tolerance: 10,
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
    closestCorners,
    pointerWithin,
    PointerSensor,
    KeyboardSensor,
    TouchSensor,
    useSensor,
    useSensors,
    sortableKeyboardCoordinates
};

export default SafeDndContext;