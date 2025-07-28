import React from 'react';
import { DroppableCanvas } from '@/components/editor/dnd/DroppableCanvas';
import { FormElementsPanel } from '@/components/editor/FormElementsPanel';

export default function SchemaDrivenEditorPage() {
  return (
    <div className="flex h-screen">
      <FormElementsPanel />
      <div className="flex-1">
        <DroppableCanvas />
      </div>
    </div>
  );
}
      </div>
    </DndProvider>
  );
}
