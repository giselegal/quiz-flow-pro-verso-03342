/**
 * SAFE DND CONTEXT - versão segura e sem monkey-patch
 *
 * - Não altera o objeto React global
 * - Carrega @dnd-kit no client de forma controlada
 * - Hooks droppable/sortable usam stubs estáveis para manter regras de hooks
 */

import '@/lib/utils/reactPolyfills';
import React from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// Module-level holders — começam null e são preenchidos no carregamento
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

// sortable/droppable helpers
let useDroppable: any = null;
let SortableContext: any = null;
let verticalListSortingStrategy: any = null;
let useSortable: any = null;
let CSS: any = null;

// Central loader: carrega os três módulos (core, sortable, utilities)
async function loadDndKit(): Promise<null | Record<string, any>> {
    try {
        if (typeof window === 'undefined') return null;

        const [core, sortable, utils] = await Promise.all([
            import('@dnd-kit/core'),
            import('@dnd-kit/sortable'),
            import('@dnd-kit/utilities').catch(() => ({ CSS: undefined })),
        ]);

        return {
            DndContext: core.DndContext,
            DragOverlay: core.DragOverlay,
            closestCenter: core.closestCenter,
            closestCorners: core.closestCorners,
            pointerWithin: core.pointerWithin,
            PointerSensor: core.PointerSensor,
            KeyboardSensor: core.KeyboardSensor,
            TouchSensor: core.TouchSensor,
            useSensor: core.useSensor,
            useSensors: core.useSensors,
            sortableKeyboardCoordinates: sortable.sortableKeyboardCoordinates,
            SortableContext: sortable.SortableContext,
            verticalListSortingStrategy: sortable.verticalListSortingStrategy,
            useSortable: sortable.useSortable,
            CSS: utils.CSS,
            useDroppable: core.useDroppable,
        };
    } catch (err) {
        appLogger.warn('[SafeDndContext] Falha ao carregar @dnd-kit', { data: [err] });
        return null;
    }
}

// Se algum bundle deixou @dnd-kit no window global, reutilizamos
try {
    if (typeof window !== 'undefined') {
        const globalCore = (window as any)['@dnd-kit/core'];
        if (globalCore) {
            DndContext = globalCore.DndContext;
            DragOverlay = globalCore.DragOverlay;
            closestCenter = globalCore.closestCenter;
            PointerSensor = globalCore.PointerSensor;
            useSensor = globalCore.useSensor;
            useSensors = globalCore.useSensors;
        }
    }
} catch (e) {
    // ignore
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

export function SafeDndContext({
    children,
    onDragEnd,
    onDragStart,
    onDragOver,
    sensors,
    collisionDetection,
    disabled = false,
}: DndWrapperProps) {
    const [dndReady, setDndReady] = React.useState(!!DndContext);
    const [dndComponents, setDndComponents] = React.useState<any>(null);

    React.useEffect(() => {
        let mounted = true;
        if (!DndContext && !disabled) {
            loadDndKit().then((components) => {
                if (!mounted || !components) return;

                // preencher caches de módulos e hooks
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

                // sortable/droppable
                SortableContext = components.SortableContext;
                verticalListSortingStrategy = components.verticalListSortingStrategy;
                useSortable = components.useSortable;
                CSS = components.CSS;
                useDroppable = components.useDroppable;

                setDndComponents(components);
                setDndReady(true);
            }).catch((e) => appLogger.warn('[SafeDndContext] loadDndKit erro', { data: [e] }));
        }

        return () => { mounted = false; };
    }, [disabled]);

    const customCollisionDetection = React.useCallback((args: any) => {
        const cc = dndComponents?.closestCorners || closestCorners;
        const pw = dndComponents?.pointerWithin || pointerWithin;
        const cC = dndComponents?.closestCenter || closestCenter;

        if (cc) {
            try {
                const r = cc(args);
                if (r && r.length) return r;
            } catch { /* ignore */ }
        }

        if (pw) {
            try {
                const r = pw(args);
                if (r && r.length) return r;
            } catch { /* ignore */ }
        }

        if (cC) {
            try { return cC(args); } catch { /* ignore */ }
        }

        return [];
    }, [dndComponents]);

    if (!dndReady || disabled || (!DndContext && !dndComponents)) {
        return <div data-testid="safe-dnd-fallback">{children}</div>;
    }

    const ActiveDndContext = dndComponents?.DndContext || DndContext;
    const ActiveDragOverlay = dndComponents?.DragOverlay || DragOverlay;
    const activeCollisionDetection = collisionDetection || customCollisionDetection;

    if (!ActiveDndContext) return <div data-testid="safe-dnd-no-context">{children}</div>;

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
                        dropAnimation={{ duration: 300, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}
                    >
                        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-500 shadow-2xl rounded-lg p-4 opacity-95 scale-105 cursor-grabbing backdrop-blur-sm min-w-[280px]">
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} /></div>
                                    <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} /><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} /></div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-gray-800 mb-0.5">Movendo bloco</div>
                                    <div className="text-xs text-gray-500">Solte para reposicionar</div>
                                </div>
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                                </div>
                            </div>
                        </div>
                    </ActiveDragOverlay>
                )}
            </ActiveDndContext>
        );
    } catch (err) {
        appLogger.error('[SafeDndContext] erro renderizar', { data: [err] });
        return <div data-testid="safe-dnd-error">{children}</div>;
    }
}

// --- SENSORS (mantém regras de hooks) ---
export function useSafeDndSensors() {
    // garantia: sempre chamamos 3 vezes o hook useSensorHook e 1 vez useSensorsHook
    const useSensorHook = useSensor ?? ((Sensor: any, opts?: any) => React.useMemo(() => ({ __stub: true, Sensor, opts }), [Sensor, JSON.stringify(opts ?? {})]));
    const useSensorsHook = useSensors ?? ((...args: any[]) => React.useMemo(() => [], [args.length]));

    try {
        const s1 = useSensorHook(PointerSensor, { activationConstraint: { distance: 5, tolerance: 5 } });
        const s2 = useSensorHook(KeyboardSensor || PointerSensor, KeyboardSensor && sortableKeyboardCoordinates ? { coordinateGetter: sortableKeyboardCoordinates } : { activationConstraint: { distance: 5, tolerance: 5 } });
        const s3 = useSensorHook(TouchSensor || PointerSensor, TouchSensor ? { activationConstraint: { delay: 250, tolerance: 10 } } : { activationConstraint: { distance: 5, tolerance: 5 } });

        const sensors = useSensorsHook(s1, s2, s3);
        return sensors || [];
    } catch (err) {
        appLogger.error('[SafeDndContext] erro ao criar sensores', { data: [err] });
        return [];
    }
}

// --- DROPPABLE / SORTABLE safe hooks (stubs que chamam hooks para manter ordem) ---
export function useSafeDroppable(options: any = {}) {
    const droppableImpl = useDroppable ?? ((opts: any) => {
        // usamos useMemo para manter um hook chamado sempre
        React.useMemo(() => ({ __stub: true, opts }), [JSON.stringify(opts ?? {})]);
        return { setNodeRef: () => { }, isOver: false, active: null };
    });

    try {
        return droppableImpl(options);
    } catch (err) {
        appLogger.error('[SafeDndContext] useDroppable erro', { data: [err] });
        return { setNodeRef: () => { }, isOver: false, active: null };
    }
}

export function useSafeSortable(options: any = {}) {
    const sortableImpl = useSortable ?? ((opts: any) => {
        React.useMemo(() => ({ __stub: true, opts }), [JSON.stringify(opts ?? {})]);
        return { attributes: {}, listeners: {}, setNodeRef: () => { }, transform: null, transition: null, isDragging: false };
    });

    try {
        return sortableImpl(options);
    } catch (err) {
        appLogger.error('[SafeDndContext] useSortable erro', { data: [err] });
        return { attributes: {}, listeners: {}, setNodeRef: () => { }, transform: null, transition: null, isDragging: false };
    }
}

export function SafeSortableContext({ children, items, strategy = verticalListSortingStrategy }: any) {
    if (!SortableContext) return <>{children}</>;

    try {
        return <SortableContext items={items} strategy={strategy}>{children}</SortableContext>;
    } catch (err) {
        appLogger.error('[SafeDndContext] SafeSortableContext erro', { data: [err] });
        return <>{children}</>;
    }
}

export { CSS as SafeCSS, verticalListSortingStrategy as safeVerticalListSortingStrategy };

export { DndContext as UnsafeDndContext, DragOverlay as UnsafeDragOverlay, closestCenter, closestCorners, pointerWithin, PointerSensor, KeyboardSensor, TouchSensor, useSensor, useSensors, sortableKeyboardCoordinates };

export default SafeDndContext;

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

    // Hooks que precisam ser chamados em TODAS as renderizações do componente
    // (mantendo a ordem estável de hooks mesmo quando DnD ainda não carregou)
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
 * ⚠️ CORREÇÃO DEFINITIVA: SEMPRE chamar os mesmos 3 hooks na mesma ordem
 */
export function useSafeDndSensors() {
    // Garantir wrappers estáveis para hooks (mesma ordem e número sempre)
    // Se @dnd-kit não estiver disponível ainda, usamos stubs que também
    // chamam hooks internos (useMemo) para manter a ordem consistente.
    const useSensorHook = useSensor ?? ((Sensor: any, opts?: any) => {
        // stub que usa useMemo (hook) para manter a mesma assinatura de hooks
        return React.useMemo(() => ({ __stub: true, Sensor, opts }), [Sensor, opts]);
    });

    const useSensorsHook = useSensors ?? ((...sensorsArgs: any[]) => {
        // stub que também usa useMemo e depende do mesmo número de argumentos
        // (mantendo a ordem de hooks consistente)
        return React.useMemo(() => [], [
            // map to stable primitives to keep dependency array shape stable
            sensorsArgs.length,
        ]);
    });

    try {
        const s1 = useSensorHook(PointerSensor, {
            activationConstraint: { distance: 5, tolerance: 5 },
        });

        const s2 = useSensorHook(
            KeyboardSensor || PointerSensor,
            KeyboardSensor && sortableKeyboardCoordinates
                ? { coordinateGetter: sortableKeyboardCoordinates }
                : { activationConstraint: { distance: 5, tolerance: 5 } }
        );

        const s3 = useSensorHook(
            TouchSensor || PointerSensor,
            TouchSensor
                ? { activationConstraint: { delay: 250, tolerance: 10 } }
                : { activationConstraint: { distance: 5, tolerance: 5 } }
        );

        // Chamar o hook de agregação (real ou stub) sempre — mesma ordem
        const sensors = useSensorsHook(s1, s2, s3);
        return sensors || [];
    } catch (error) {
        appLogger.error('❌ [DndWrapper] Erro ao criar sensores DnD:', { data: [error] });
        return [];
    }
}/**
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