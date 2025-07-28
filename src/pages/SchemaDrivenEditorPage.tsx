import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DroppableCanvas } from '@/components/editor/dnd/DroppableCanvas';
import { FormElementsPanel } from '@/components/editor/FormElementsPanel';

export default function SchemaDrivenEditorPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <FormElementsPanel />
        <div className="flex-1">
          <DroppableCanvas />
        </div>
      </div>
    </DndProvider>
  );
}
