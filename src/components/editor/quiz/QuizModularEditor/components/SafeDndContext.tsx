/**
 * 🔧 DND CONTEXT WRAPPER - Correção para erro useLayoutEffect
 * 
 * Resolve o problema "Cannot read properties of undefined (reading 'useLayoutEffect')"
 * que ocorre quando @dnd-kit tenta acessar hooks do React em contexto inválido
 */

import React, { Suspense } from 'react';

// Import condicional do DndContext
let DndContext: any = null;
let DragOverlay: any = null;
let closestCenter: any = null;
let PointerSensor: any = null;
let useSensor: any = null;
let useSensors: any = null;

try {
    const dndKit = require('@dnd-kit/core');
    DndContext = dndKit.DndContext;
    DragOverlay = dndKit.DragOverlay;
    closestCenter = dndKit.closestCenter;
    PointerSensor = dndKit.PointerSensor;
    useSensor = dndKit.useSensor;
    useSensors = dndKit.useSensors;
} catch (error) {
    console.warn('❌ [DndWrapper] Falha ao carregar @dnd-kit/core:', error);
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
 * Wrapper seguro para DndContext que previne erros de useLayoutEffect
 */
export function SafeDndContext({
    children,
    onDragEnd,
    onDragStart,
    onDragOver,
    sensors,
    collisionDetection = closestCenter,
    disabled = false
}: DndWrapperProps) {
    // Se @dnd-kit não carregou ou está desabilitado, renderizar sem DnD
    if (!DndContext || disabled) {
        console.log('🔄 [DndWrapper] Renderizando sem drag-and-drop (desabilitado ou não disponível)');
        return <>{children}</>;
    }

    // Se não há React disponível, fallback
    if (typeof React.useLayoutEffect === 'undefined') {
        console.warn('⚠️ [DndWrapper] React.useLayoutEffect não disponível, desabilitando DnD');
        return <>{children}</>;
    }

    try {
        return (
            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                {children}
                <DragOverlay>
                    <div className="opacity-50 bg-gray-100 border border-dashed border-gray-300 p-2 rounded">
                        Movendo item...
                    </div>
                </DragOverlay>
            </DndContext>
        );
    } catch (error) {
        console.error('❌ [DndWrapper] Erro ao renderizar DndContext:', error);
        // Fallback: renderizar sem DnD
        return <>{children}</>;
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