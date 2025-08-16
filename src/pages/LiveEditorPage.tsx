import React from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
import EnhancedLiveEditor from '@/components/editor/EnhancedLiveEditor';
import { useEditor } from '@/context/EditorContext';

/**
 * Live Editor Page - Modern Professional Editor Interface
 * 
 * Features:
 * - Professional navbar with undo/redo, save/publish controls
 * - Tab navigation (Construtor, Fluxo, Design, Leads, Configurações)
 * - Responsive viewport preview
 * - Drag & drop components
 * - Real-time property editing
 * - Keyboard shortcuts
 * 
 * Based on the sophisticated editor interface provided in the HTML snippet.
 */
const LiveEditorPage: React.FC = () => {
  const {
    computed: { currentBlocks },
    activeStageId,
    selectedBlockId,
    blockActions: { 
      setSelectedBlockId, 
      addBlock, 
      addBlockAtPosition,
      updateBlock, 
      reorderBlocks 
    },
  } = useEditor();

  return (
    <ErrorBoundary>
      <DndProvider
        blocks={(currentBlocks || []).map(block => ({
          id: block.id,
          type: block.type,
          properties: block.properties || {},
        }))}
        onBlocksReorder={newBlocksData => {
          const newBlockIds = newBlocksData.map(b => b.id);
          const oldBlockIds = (currentBlocks || []).map(b => b.id);

          if (oldBlockIds.length !== newBlockIds.length) {
            console.warn('⚠️ Reordenação abortada: quantidade de blocos não confere');
            return;
          }

          reorderBlocks(newBlockIds, activeStageId || undefined);
        }}
        onBlockAdd={(blockType, position) => {
          if (position !== undefined && position >= 0) {
            addBlockAtPosition(blockType, position, activeStageId || undefined);
          } else {
            addBlock(blockType, activeStageId || undefined);
          }
        }}
        onBlockSelect={blockId => {
          setSelectedBlockId(blockId);
        }}
        selectedBlockId={selectedBlockId || undefined}
        onBlockUpdate={(blockId, updates) => {
          updateBlock(blockId, updates as any);
        }}
      >
        <div className="h-screen bg-gray-50">
          <EnhancedLiveEditor />
        </div>
      </DndProvider>
    </ErrorBoundary>
  );
};

export default LiveEditorPage;