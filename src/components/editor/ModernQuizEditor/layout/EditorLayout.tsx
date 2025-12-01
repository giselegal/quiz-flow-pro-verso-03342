/**
 * 📐 Editor Layout - Layout de 4 colunas
 * 
 * Estrutura:
 * [StepPanel | BlockLibrary | Canvas | PropertiesPanel]
 *    200px       250px        flex-1      300px
 */

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { StepPanel } from './StepPanel';
import { BlockLibrary } from './BlockLibrary';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { useDndHandlers } from '../hooks/useDndHandlers';

export function EditorLayout() {
    // Configurar sensores do DnD
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px de movimento antes de ativar drag
            },
        })
    );

    // Handlers de Drag & Drop
    const { handleDragStart, handleDragEnd } = useDndHandlers();

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
                {/* Coluna 1: Steps (200px) */}
                <StepPanel />

                {/* Coluna 2: Block Library (250px) */}
                <BlockLibrary />

                {/* Coluna 3: Canvas (flex-1) */}
                <Canvas />

                {/* Coluna 4: Properties (300px) */}
                <PropertiesPanel />
            </div>
        </DndContext>
    );
}
