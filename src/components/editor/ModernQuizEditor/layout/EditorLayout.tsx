/**
 * 📐 Editor Layout - Layout de 4 colunas, Split Preview ou JSON Editor
 * 
 * Estrutura Visual:
 * [StepPanel | BlockLibrary | Canvas | PropertiesPanel]
 *    200px       250px        flex-1      300px
 * 
 * Estrutura Split Preview:
 * [StepPanel | BlockLibrary | Canvas <-> Preview | PropertiesPanel]
 * 
 * Estrutura JSON:
 * [Full-width Monaco Editor]
 * 
 * ✅ AUDIT: Optimized with stable references and memoization
 */

import React, { memo, lazy, Suspense } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { StepPanel } from './StepPanel';
import { BlockLibrary } from './BlockLibrary';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { useDndHandlers } from '../hooks/useDndHandlers';
import { useEditorStore } from '../store/editorStore';

// Lazy load heavy components
const JsonCodeEditor = lazy(() => 
  import('../components/JsonCodeEditor').then(m => ({ default: m.JsonCodeEditor }))
);
const SplitPreviewLayout = lazy(() => import('./SplitPreviewLayout'));

export const EditorLayout = memo(() => {
    const editorMode = useEditorStore((s) => s.editorMode);
    const splitPreviewEnabled = useEditorStore((s) => s.splitPreviewEnabled);

    // ✅ AUDIT: Memoize sensor configuration to prevent recreation
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px de movimento antes de ativar drag
            },
        }),
    );

    // Handlers de Drag & Drop
    const { handleDragStart, handleDragEnd } = useDndHandlers();

    // JSON Mode - Full width Monaco editor
    if (editorMode === 'json') {
        return (
            <Suspense fallback={
                <div className="h-full w-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                        <div className="animate-spin text-4xl mb-2">⏳</div>
                        <p className="text-sm text-muted-foreground">Carregando editor JSON...</p>
                    </div>
                </div>
            }>
                <JsonCodeEditor />
            </Suspense>
        );
    }

    // Split Preview Mode
    if (splitPreviewEnabled) {
        return (
            <Suspense fallback={
                <div className="h-full w-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                        <div className="animate-spin text-4xl mb-2">⏳</div>
                        <p className="text-sm text-muted-foreground">Carregando split preview...</p>
                    </div>
                </div>
            }>
                <SplitPreviewLayout />
            </Suspense>
        );
    }

    // Visual Mode - 4 column layout
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full w-full bg-muted/30 overflow-hidden">
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
});
