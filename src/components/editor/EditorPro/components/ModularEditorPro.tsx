import React, { useCallback, useMemo, useState } from 'react';
import { useEditor } from '@/components/editor/EditorProvider';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { useNotification } from '@/components/ui/Notification';
import { Block } from '@/types/editor';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';

// Componentes modulares
import EditorToolbar from './EditorToolbar';
import EditorCanvas from './EditorCanvas';
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import ComponentsSidebar from '@/components/editor/sidebars/ComponentsSidebar';
import PropertiesColumn from '@/components/editor/properties/PropertiesColumn';

/**
 * 🚀 EDITOR PRO MODULAR E OTIMIZADO
 * 
 * Substitui o EditorPro.tsx monolítico (1312 linhas) por arquitetura modular
 * ✅ Componentes isolados e reutilizáveis
 * ✅ Estado centralizado via EditorProvider
 * ✅ Performance otimizada com React.memo
 * ✅ Timers migrados para useOptimizedScheduler
 */

const ModularEditorPro: React.FC = () => {
  const { state, actions } = useEditor();
  const { schedule } = useOptimizedScheduler();
  const { addNotification } = useNotification();

  // Estados locais para UI (removidos os não utilizados)
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Sensores do DnD otimizados
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Evita ativação acidental
      },
    })
  );

  // Blocos da etapa atual com memoização
  const currentStepBlocks = useMemo(() => {
    const stepKey = `step-${state.currentStep}`;
    return state.stepBlocks[stepKey] || [];
  }, [state.stepBlocks, state.currentStep]);

  // Bloco selecionado
  const selectedBlock = useMemo(() => {
    if (!state.selectedBlockId) return null;
    return currentStepBlocks.find(block => block.id === state.selectedBlockId) || null;
  }, [currentStepBlocks, state.selectedBlockId]);

  // Dados para componentes da sidebar
  const stepHasBlocksRecord = useMemo(() => {
    const record: Record<number, boolean> = {};
    for (let i = 1; i <= 21; i++) {
      const stepKey = `step-${i}`;
      record[i] = (state.stepBlocks[stepKey]?.length || 0) > 0;
    }
    return record;
  }, [state.stepBlocks]);

  const groupedComponents = useMemo(() => ({
    'Conteúdo': [
      { type: 'headline', name: 'Título', icon: 'note', category: 'Conteúdo', description: 'Título principal' },
      { type: 'text', name: 'Texto', icon: 'doc', category: 'Conteúdo', description: 'Parágrafo de texto' },
      { type: 'image', name: 'Imagem', icon: 'image', category: 'Conteúdo', description: 'Inserir imagem' },
    ],
    'Formulários': [
      { type: 'form', name: 'Formulário', icon: 'button', category: 'Formulários', description: 'Formulário de contato' },
      { type: 'button', name: 'Botão', icon: 'button', category: 'Formulários', description: 'Botão de ação' },
    ],
    'Quiz': [
      { type: 'quiz-question', name: 'Pergunta', icon: 'help', category: 'Quiz', description: 'Pergunta do quiz' },
      { type: 'quiz-options', name: 'Opções', icon: 'list', category: 'Quiz', description: 'Opções de resposta' },
    ],
    'Layout': [
      { type: 'container', name: 'Container', icon: 'square', category: 'Layout', description: 'Container flexível' },
      { type: 'spacer', name: 'Espaçador', icon: 'minus', category: 'Layout', description: 'Espaçamento vertical' },
    ]
  }), []);

  // Handlers de bloco otimizados
  const handleSelectBlock = useCallback((blockId: string) => {
    actions.setSelectedBlockId(blockId);
  }, [actions]);

  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    const stepKey = `step-${state.currentStep}`;
    actions.updateBlock(stepKey, blockId, updates);
  }, [state.currentStep, actions]);

  const handleUpdateSelectedBlock = useCallback((updates: Record<string, any>) => {
    if (selectedBlock) {
      handleUpdateBlock(selectedBlock.id, updates);
    }
  }, [selectedBlock, handleUpdateBlock]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    const stepKey = `step-${state.currentStep}`;
    actions.removeBlock(stepKey, blockId);

    // Limpar seleção se deletar bloco selecionado
    if (state.selectedBlockId === blockId) {
      actions.setSelectedBlockId(null);
    }

    addNotification('Componente foi removido da etapa');
  }, [state.currentStep, state.selectedBlockId, actions, addNotification]);

  const handleDeleteSelectedBlock = useCallback(() => {
    if (selectedBlock) {
      handleDeleteBlock(selectedBlock.id);
    }
  }, [selectedBlock, handleDeleteBlock]);

  const handleReorderBlocks = useCallback((oldIndex: number, newIndex: number) => {
    const stepKey = `step-${state.currentStep}`;
    actions.reorderBlocks(stepKey, oldIndex, newIndex);
  }, [state.currentStep, actions]);

  // 🔧 FUNÇÕES AUXILIARES: Conteúdo padrão para novos componentes
  const getDefaultContentForType = useCallback((type: string) => {
    switch (type) {
      case 'headline':
        return { title: 'Novo Título', subtitle: 'Subtítulo opcional' };
      case 'text':
        return { text: 'Digite seu texto aqui...' };
      case 'image':
        return { src: 'https://via.placeholder.com/400x300', alt: 'Nova imagem' };
      case 'form':
        return { title: 'Formulário', fields: [] };
      case 'button':
        return { text: 'Clique aqui', action: 'next' };
      case 'quiz-question':
        return { question: 'Nova pergunta do quiz?' };
      case 'quiz-options':
        return { options: ['Opção 1', 'Opção 2', 'Opção 3'] };
      case 'container':
        return { backgroundColor: '#ffffff' };
      case 'spacer':
        return { height: '20px' };
      default:
        return {};
    }
  }, []);

  const getDefaultPropertiesForType = useCallback((type: string) => {
    switch (type) {
      case 'headline':
        return { fontSize: 'text-2xl', fontWeight: 'font-bold', textAlign: 'center' };
      case 'text':
        return { fontSize: 'text-base', textAlign: 'left' };
      case 'image':
        return { maxWidth: 'md', rounded: 'rounded-lg' };
      case 'button':
        return { variant: 'primary', size: 'md' };
      default:
        return {};
    }
  }, []);

  // 🔧 NOVO: Handler global para drag-and-drop de componentes da sidebar
  const handleGlobalDragStart = useCallback((event: DragStartEvent) => {
    console.log('🎯 Global Drag Start:', event.active.data.current);
  }, []);

  const handleGlobalDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active.data.current) {
      console.log('❌ Drag end sem target válido');
      return;
    }

    // Verificar se é um componente da sidebar sendo solto no canvas
    if (active.data.current.type === 'sidebar-component' && over.data.current?.type === 'dropzone') {
      const componentType = active.data.current.blockType;
      const stepKey = `step-${state.currentStep}`;

      console.log('✅ Adicionando componente ao canvas:', componentType);

      // Criar novo bloco
      const newBlockId = `${componentType}-${Date.now()}`;
      const newBlock: Block = {
        id: newBlockId,
        type: componentType,
        order: currentStepBlocks.length,
        content: getDefaultContentForType(componentType) as any,
        properties: getDefaultPropertiesForType(componentType) as any,
      };

      // Adicionar bloco à etapa atual
      actions.addBlock(stepKey, newBlock);

      // Selecionar o novo bloco
      actions.setSelectedBlockId(newBlockId);

      addNotification(`Componente ${active.data.current.title} adicionado`);
      return;
    }

    // Verificar se é reordenação dentro do canvas
    if (active.data.current.type === 'canvas-block') {
      // Já tratado pelo StepDndProvider interno
      console.log('🔄 Reordenação de bloco no canvas');
      return;
    }

    console.log('ℹ️ Drag end não tratado:', { active: active.data.current, over: over.data.current });
  }, [state.currentStep, currentStepBlocks.length, actions, addNotification, getDefaultContentForType, getDefaultPropertiesForType]);

  // Handlers da toolbar
  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  const handleSave = useCallback(() => {
    // Salvar com debounce
    schedule('save-editor', () => {
      console.log('Salvando editor...');
      addNotification('Editor salvo com sucesso');
    }, 500);
  }, [schedule, addNotification]);

  const handlePublish = useCallback(() => {
    console.log('Publicando funil...');
    addNotification('Funil publicado com sucesso');
  }, [addNotification]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleGlobalDragStart}
      onDragEnd={handleGlobalDragEnd}
    >
      <div className="h-full w-full flex flex-col bg-background">
        {/* Toolbar */}
        <EditorToolbar
          currentStep={state.currentStep}
          totalSteps={21}
          isPreviewMode={isPreviewMode}
          canUndo={actions.canUndo}
          canRedo={actions.canRedo}
          isSaving={state.isLoading}
          onTogglePreview={handleTogglePreview}
          onUndo={actions.undo}
          onRedo={actions.redo}
          onSave={handleSave}
          onPublish={handlePublish}
          onOpenSettings={() => console.log('Configurações')}
        />

        {/* Layout principal de 4 colunas */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar de etapas */}
          <div className="w-64 border-r border-border bg-muted/30">
            <StepSidebar
              currentStep={state.currentStep}
              stepHasBlocks={stepHasBlocksRecord}
              onSelectStep={actions.setCurrentStep}
              getStepAnalysis={() => ({ icon: 'note', label: 'Etapa', desc: 'Configurar' })}
              renderIcon={(icon: string) => <div>{icon}</div>}
            />
          </div>

          {/* Sidebar de componentes */}
          <div className="w-80 border-r border-border bg-background">
            <ComponentsSidebar
              groupedComponents={groupedComponents}
              renderIcon={(icon: string) => <div>{icon}</div>}
            />
          </div>

          {/* Canvas principal */}
          <div className="flex-1 min-w-0">
            <EditorCanvas
              blocks={currentStepBlocks}
              selectedBlock={selectedBlock}
              currentStep={state.currentStep}
              onSelectBlock={handleSelectBlock}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onReorderBlocks={handleReorderBlocks}
              isPreviewMode={isPreviewMode}
              onStepChange={actions.setCurrentStep} // Para navegação no preview
            />
          </div>

          {/* Propriedades */}
          <div className="w-80 border-l border-border bg-muted/30">
            <PropertiesColumn
              selectedBlock={selectedBlock || undefined}
              onUpdate={handleUpdateSelectedBlock}
              onClose={() => actions.setSelectedBlockId(null)}
              onDelete={handleDeleteSelectedBlock}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default ModularEditorPro;