import { useEditor } from '@/context/EditorContext';
import { BlockType } from '@/types/editor';
import { CanvasDropZone } from './canvas/CanvasDropZone';
import ComponentsSidebar from './components/ComponentsSidebar';
import FunnelStagesPanel from './funnel/FunnelStagesPanelUnified';
import { FourColumnLayout } from './layout/FourColumnLayout';
import { PropertiesPanel } from './properties/PropertiesPanel';
import { EditorToolbar } from './toolbar/EditorToolbar';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId: _funnelId,
  className = '',
}) => {
  const {
    computed: { currentBlocks, selectedBlock },
    selectedBlockId,
    blockActions: { setSelectedBlockId, addBlock, updateBlock, deleteBlock },
  } = useEditor();

  const handleComponentSelect = async (type: string) => {
    try {
      const blockId = await addBlock(type as BlockType);
      if (blockId) {
        setSelectedBlockId(blockId);
        console.log(`➕ Bloco ${type} adicionado via editor responsivo`);
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar bloco:', error);
    }
  };

  const handleUpdateSelectedBlock = async (blockId: string, updates: any) => {
    if (blockId) {
      try {
        await updateBlock(blockId, updates);
        console.log('✅ Bloco atualizado via editor responsivo:', blockId);
      } catch (error) {
        console.error('❌ Erro ao atualizar bloco:', error);
      }
    }
  };

  return (
    <div className={`h-full w-full bg-background ${className}`}>
      {/* 🎨 TOOLBAR SUPERIOR */}
      <EditorToolbar />

      {/* 📐 LAYOUT DE 4 COLUNAS */}
      <div className="h-[calc(100%-56px)]">
        <FourColumnLayout
          stagesPanel={<FunnelStagesPanel />}
          componentsPanel={<ComponentsSidebar onComponentSelect={handleComponentSelect} />}
          canvas={
            <CanvasDropZone
              blocks={currentBlocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={updateBlock}
              onDeleteBlock={deleteBlock}
            />
          }
          propertiesPanel={
            <PropertiesPanel
              selectedBlock={selectedBlock || null}
              onUpdate={handleUpdateSelectedBlock}
              onClose={() => setSelectedBlockId(null)}
              onDelete={blockId => deleteBlock(blockId)}
              isPreviewMode={false}
            />
          }
        />
      </div>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
