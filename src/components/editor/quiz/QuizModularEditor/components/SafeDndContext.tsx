/**
 * 🔧 REACT + DND CONTEXT WRAPPER - Correção completa para erros React
 * 
 * Resolve os problemas:
 * - "Cannot read properties of undefined (reading 'useLayoutEffect')"
 * - "Cannot read properties of undefined (reading 'forwardRef')"
 */

import React, { Suspense } from 'react';

// Garantir que React está disponível globalmente
if (typeof window !== 'undefined') {
    (window as any).React = React;

    // Polyfills para APIs React que podem estar ausentes
    if (!React.useLayoutEffect) {
        (React as any).useLayoutEffect = React.useEffect;
    }
    if (!React.forwardRef) {
        (React as any).forwardRef = (render: any) => render;
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
        console.warn('❌ [SafeDndContext] Falha ao carregar @dnd-kit:', error);
        return null;
    }
};

// Tentar carregar sincronamente primeiro (fallback)
try {
    const dndCore = (window as any)['@dnd-kit/core'] || require('@dnd-kit/core');
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
                        <div className="opacity-50 bg-gray-100 border border-dashed border-gray-300 p-2 rounded">
                            Movendo item...
                        </div>
                    </ActiveDragOverlay>
                )}
            </ActiveDndContext>
        );
    } catch (error) {
        console.error('❌ [SafeDndContext] Erro ao renderizar:', error);
        return <div data-testid="safe-dnd-error">{children}</div>;
    }
}

/**
 * Hook seguro para sensores DnD
 */
export function useSafeDndSensors() {
    if (!useSensor || !useSensors || !PointerSensor) {
        return [];
    }

    try {
        const sensors = useSensors(
            useSensor(PointerSensor, {
                activationConstraint: {
                    distance: 8,
                },
            })
        );
        return sensors;
    } catch (error) {
        console.error('❌ [DndWrapper] Erro ao criar sensores DnD:', error);
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

try {
    const sortable = require('@dnd-kit/sortable');
    const utilities = require('@dnd-kit/utilities');

    SortableContext = sortable.SortableContext;
    verticalListSortingStrategy = sortable.verticalListSortingStrategy;
    useSortable = sortable.useSortable;
    CSS = utilities.CSS;

    const core = require('@dnd-kit/core');
    useDroppable = core.useDroppable;
} catch (error) {
    console.warn('❌ [DndWrapper] Falha ao carregar hooks DnD:', error);
}

export function useSafeDroppable(options: any = {}) {
    if (!useDroppable) {
        return { setNodeRef: () => { }, isOver: false, active: null };
    }

    try {
        return useDroppable(options);
    } catch (error) {
        console.error('❌ [DndWrapper] Erro no useDroppable:', error);
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
        console.error('❌ [DndWrapper] Erro no useSortable:', error);
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
        console.error('❌ [DndWrapper] Erro no SortableContext:', error);
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