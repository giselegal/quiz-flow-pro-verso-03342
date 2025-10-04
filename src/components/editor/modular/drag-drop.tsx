/**
 * 🖱️ SISTEMA DRAG & DROP MODULAR
 * 
 * Implementação completa de drag & drop usando @dnd-kit
 * para reordenação de etapas e componentes.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    Active,
    Over,
    closestCenter,
    CollisionDetection
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove
} from '@dnd-kit/sortable';
import {
    CSS
} from '@dnd-kit/utilities';
import { ModularStep, ModularComponent } from './types';

// 🎯 Tipos para o drag & drop
interface DragData {
    type: 'step' | 'component';
    id: string;
    stepId?: string; // Para componentes, ID da etapa pai
    index: number;
}

interface ModularDragDropContextType {
    activeId: string | null;
    activeDragData: DragData | null;
    isDragging: boolean;
    onDragStart: (data: DragData) => void;
    onDragEnd: (fromData: DragData, overData: DragData | null) => void;
}

const ModularDragDropContext = createContext<ModularDragDropContextType | null>(null);

export const useModularDragDrop = () => {
    const context = useContext(ModularDragDropContext);
    if (!context) {
        throw new Error('useModularDragDrop deve ser usado dentro de ModularDragDropProvider');
    }
    return context;
};

// 🚀 Provider principal
interface ModularDragDropProviderProps {
    children: ReactNode;
    onStepReorder: (fromIndex: number, toIndex: number) => void;
    onComponentReorder: (stepId: string, fromIndex: number, toIndex: number) => void;
    onComponentMove: (componentId: string, fromStepId: string, toStepId: string, toIndex: number) => void;
}

export const ModularDragDropProvider: React.FC<ModularDragDropProviderProps> = ({
    children,
    onStepReorder,
    onComponentReorder,
    onComponentMove
}) => {
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [activeDragData, setActiveDragData] = React.useState<DragData | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    );

    // 🎭 Parsear dados do drag
    const parseDragData = (active: Active | null): DragData | null => {
        if (!active?.data?.current) return null;
        return active.data.current as DragData;
    };

    const parseDropData = (over: Over | null): DragData | null => {
        if (!over?.data?.current) return null;
        return over.data.current as DragData;
    };

    // 🎬 Handlers de drag
    const handleDragStart = (event: DragStartEvent) => {
        const dragData = parseDragData(event.active);

        setActiveId(event.active.id as string);
        setActiveDragData(dragData);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            setActiveId(null);
            setActiveDragData(null);
            return;
        }

        const fromData = parseDragData(active);
        const overData = parseDropData(over);

        if (!fromData || !overData) {
            setActiveId(null);
            setActiveDragData(null);
            return;
        }

        // 📝 Reordenar etapas
        if (fromData.type === 'step' && overData.type === 'step') {
            onStepReorder(fromData.index, overData.index);
        }

        // 🧩 Reordenar componentes na mesma etapa
        else if (
            fromData.type === 'component' &&
            overData.type === 'component' &&
            fromData.stepId === overData.stepId
        ) {
            onComponentReorder(fromData.stepId!, fromData.index, overData.index);
        }

        // 🔄 Mover componente entre etapas
        else if (
            fromData.type === 'component' &&
            overData.type === 'component' &&
            fromData.stepId !== overData.stepId
        ) {
            onComponentMove(fromData.id, fromData.stepId!, overData.stepId!, overData.index);
        }

        setActiveId(null);
        setActiveDragData(null);
    };

    // 🤝 Collision detection customizada
    const collisionDetection: CollisionDetection = (args) => {
        // Usar closestCenter como fallback
        return closestCenter(args);
    };

    const contextValue: ModularDragDropContextType = {
        activeId,
        activeDragData,
        isDragging: !!activeId,
        onDragStart: (data: DragData) => setActiveDragData(data),
        onDragEnd: handleDragEnd
    };

    return (
        <ModularDragDropContext.Provider value={contextValue}>
            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {children}
                <DragOverlay>
                    {activeId && activeDragData && (
                        <DragPreview data={activeDragData} />
                    )}
                </DragOverlay>
            </DndContext>
        </ModularDragDropContext.Provider>
    );
};

// 👻 Preview durante o arraste
interface DragPreviewProps {
    data: DragData;
}

const DragPreview: React.FC<DragPreviewProps> = ({ data }) => {
    return (
        <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 opacity-90 transform rotate-3">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">
                    {data.type === 'step' ? '📄 Etapa' : '🧩 Componente'}
                </span>
            </div>
        </div>
    );
};

// 📄 Container sortável para etapas
interface SortableStepContainerProps {
    steps: ModularStep[];
    children: (step: ModularStep, index: number) => ReactNode;
}

export const SortableStepContainer: React.FC<SortableStepContainerProps> = ({
    steps,
    children
}) => {
    const stepIds = steps.map(step => step.id);

    return (
        <SortableContext items={stepIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
                {steps.map((step, index) => (
                    <SortableStepItem
                        key={step.id}
                        step={step}
                        index={index}
                    >
                        {children(step, index)}
                    </SortableStepItem>
                ))}
            </div>
        </SortableContext>
    );
};

// 📋 Item de etapa sortável
interface SortableStepItemProps {
    step: ModularStep;
    index: number;
    children: ReactNode;
}

const SortableStepItem: React.FC<SortableStepItemProps> = ({
    step,
    index,
    children
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: step.id,
        data: {
            type: 'step',
            id: step.id,
            index
        } as DragData
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative ${isDragging ? 'z-50' : ''}`}
        >
            {/* Handle de drag */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-0 w-6 h-full bg-gray-200 hover:bg-gray-300 cursor-grab active:cursor-grabbing rounded-l-lg flex items-center justify-center transition-colors z-10"
            >
                <div className="flex flex-col space-y-0.5">
                    <div className="w-1 h-1 bg-gray-500 rounded-full" />
                    <div className="w-1 h-1 bg-gray-500 rounded-full" />
                    <div className="w-1 h-1 bg-gray-500 rounded-full" />
                </div>
            </div>

            {/* Conteúdo da etapa */}
            <div className="ml-6">
                {children}
            </div>
        </div>
    );
};

// 🧩 Container sortável para componentes
interface SortableComponentContainerProps {
    components: ModularComponent[];
    stepId: string;
    children: (component: ModularComponent, index: number) => ReactNode;
}

export const SortableComponentContainer: React.FC<SortableComponentContainerProps> = ({
    components,
    stepId,
    children
}) => {
    const componentIds = components.map(component => component.id);

    return (
        <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
                {components.map((component, index) => (
                    <SortableComponentItem
                        key={component.id}
                        component={component}
                        stepId={stepId}
                        index={index}
                    >
                        {children(component, index)}
                    </SortableComponentItem>
                ))}
            </div>
        </SortableContext>
    );
};

// 🔧 Item de componente sortável
interface SortableComponentItemProps {
    component: ModularComponent;
    stepId: string;
    index: number;
    children: ReactNode;
}

const SortableComponentItem: React.FC<SortableComponentItemProps> = ({
    component,
    stepId,
    index,
    children
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: component.id,
        data: {
            type: 'component',
            id: component.id,
            stepId,
            index
        } as DragData
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group ${isDragging ? 'z-50' : ''}`}
        >
            {/* Handle de drag */}
            <div
                {...attributes}
                {...listeners}
                className="absolute right-0 top-0 w-8 h-8 bg-gray-100 hover:bg-gray-200 cursor-grab active:cursor-grabbing rounded border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
            >
                <div className="flex space-x-0.5">
                    <div className="w-0.5 h-0.5 bg-gray-500 rounded-full" />
                    <div className="w-0.5 h-0.5 bg-gray-500 rounded-full" />
                    <div className="w-0.5 h-0.5 bg-gray-500 rounded-full" />
                    <div className="w-0.5 h-0.5 bg-gray-500 rounded-full" />
                </div>
            </div>

            {/* Conteúdo do componente */}
            {children}
        </div>
    );
};

// 🎨 Drop zone para componentes
interface ComponentDropZoneProps {
    stepId: string;
    index: number;
    onDrop: (componentId: string, fromStepId: string, toStepId: string, toIndex: number) => void;
    children?: ReactNode;
}

export const ComponentDropZone: React.FC<ComponentDropZoneProps> = ({
    stepId,
    index,
    onDrop,
    children
}) => {
    const { activeDragData } = useModularDragDrop();

    const isValidDropTarget =
        activeDragData?.type === 'component' &&
        activeDragData.stepId !== stepId;

    return (
        <div
            className={`relative min-h-12 transition-colors ${isValidDropTarget
                    ? 'border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg'
                    : 'border-2 border-transparent'
                }`}
            data-drop-zone="component"
            data-step-id={stepId}
            data-index={index}
        >
            {children || (
                <div className="flex items-center justify-center h-12 text-gray-400 text-sm">
                    {isValidDropTarget ? 'Solte o componente aqui' : 'Zona de componentes'}
                </div>
            )}
        </div>
    );
};