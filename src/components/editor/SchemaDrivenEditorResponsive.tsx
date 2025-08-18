import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditor } from '@/context/EditorContext';
import { useFunnelNavigation } from '@/hooks/useFunnelNavigation';
import { BlockType } from '@/types/editor';
import { Eye, Redo, Save, Undo } from 'lucide-react';
import { CanvasDropZone } from './canvas/CanvasDropZone';
import FunnelStagesPanel from './funnel/FunnelStagesPanel.simple';
import { PropertiesPanel } from './properties/PropertiesPanel';
import ComponentsSidebar from './sidebar/ComponentsSidebar';

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

  const funnelNavigation = useFunnelNavigation();

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
    <div className={`h-full w-full bg-gray-50 ${className}`}>
      {/* 🎨 TOOLBAR SUPERIOR */}
      <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Editor Quiz Quest</h1>
          <Badge variant="outline">Schema-Driven</Badge>
          <Badge variant="secondary">
            {funnelNavigation.currentStepNumber} de {funnelNavigation.totalSteps}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={funnelNavigation.handlePreview}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={funnelNavigation.handleSave}
            disabled={funnelNavigation.isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {funnelNavigation.isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* 📐 LAYOUT DE 4 COLUNAS */}
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100%-56px)]">
        {/* 📝 COLUNA 1: ETAPAS DO FUNIL (21) */}
        <ResizablePanel defaultSize={18} minSize={15} maxSize={25}>
          <FunnelStagesPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* 🧩 COLUNA 2: BIBLIOTECA DE COMPONENTES */}
        <ResizablePanel defaultSize={22} minSize={18} maxSize={30}>
          <ComponentsSidebar onComponentSelect={handleComponentSelect} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* 🎨 COLUNA 3: CANVAS PRINCIPAL */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <CanvasDropZone
            blocks={currentBlocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={updateBlock}
            onDeleteBlock={deleteBlock}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* ⚙️ COLUNA 4: PAINEL DE PROPRIEDADES AVANÇADO */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <PropertiesPanel
            selectedBlock={selectedBlock || null}
            onUpdate={handleUpdateSelectedBlock}
            onClose={() => setSelectedBlockId(null)}
            onDelete={blockId => deleteBlock(blockId)}
            isPreviewMode={false}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
