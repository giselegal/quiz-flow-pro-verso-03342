import React, { useCallback, useMemo, useState, useRef } from 'react';
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
import RegistryPropertiesPanel from '@/components/universal/RegistryPropertiesPanel';
import APIPropertiesPanel from '@/components/editor/properties/APIPropertiesPanel';

/**
 * Hook para controlar larguras redimensionáveis das colunas
 */
const useResizableColumns = () => {
  const [columnWidths, setColumnWidths] = useState(() => {
    // Verificar se há larguras salvas no localStorage
    const saved = localStorage.getItem('editor-column-widths');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          steps: Math.max(200, Math.min(400, parsed.steps || 256)),
          components: Math.max(280, Math.min(500, parsed.components || 320)),
          properties: Math.max(280, Math.min(500, parsed.properties || 320))
        };
      } catch {
        // Se não conseguir fazer parse, usar valores padrão
      }
    }
    return {
      steps: 256,      // 16rem padrão
      components: 320, // 20rem padrão
      properties: 320  // 20rem padrão
    };
  });

  const minWidths = {
    steps: 200,      // 12.5rem mínimo
    components: 280, // 17.5rem mínimo
    properties: 280  // 17.5rem mínimo
  };

  const maxWidths = {
    steps: 400,      // 25rem máximo
    components: 500, // 31.25rem máximo
    properties: 500  // 31.25rem máximo
  };

  const handleResize = useCallback((column: 'steps' | 'components' | 'properties', width: number) => {
    const clampedWidth = Math.max(minWidths[column], Math.min(maxWidths[column], width));
    setColumnWidths(prev => {
      const newWidths = {
        ...prev,
        [column]: clampedWidth
      };
      // Salvar no localStorage
      localStorage.setItem('editor-column-widths', JSON.stringify(newWidths));
      return newWidths;
    });
  }, [minWidths, maxWidths]);

  // Função para resetar larguras para valores padrão
  const resetWidths = useCallback(() => {
    const defaultWidths = {
      steps: 256,
      components: 320,
      properties: 320
    };
    setColumnWidths(defaultWidths);
    localStorage.setItem('editor-column-widths', JSON.stringify(defaultWidths));
  }, []);

  return { columnWidths, handleResize, minWidths, maxWidths, resetWidths };
};

/**
 * Componente divisor redimensionável
 */
const ResizeHandle: React.FC<{
  onResize: (width: number) => void;
  className?: string;
  label?: string;
}> = ({ onResize, className = "", label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const currentWidth = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setShowTooltip(true);
    startX.current = e.clientX;
    const parent = (e.currentTarget as HTMLElement).previousElementSibling as HTMLElement;
    if (parent) {
      startWidth.current = parent.getBoundingClientRect().width;
      currentWidth.current = startWidth.current;
    }
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    const newWidth = startWidth.current + deltaX;
    currentWidth.current = newWidth;
    onResize(newWidth);
  }, [isDragging, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setShowTooltip(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`relative w-1 bg-border hover:bg-blue-500 cursor-col-resize transition-colors duration-200 group ${className} ${isDragging ? 'bg-blue-500' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => !isDragging && setShowTooltip(false)}
      title={label ? `Redimensionar ${label}` : 'Redimensionar coluna'}
    >
      {/* Indicador visual quando hover */}
      <div className="absolute inset-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />

      {/* Tooltip com largura atual (opcional) */}
      {showTooltip && isDragging && label && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {Math.round(currentWidth.current)}px
        </div>
      )}
    </div>
  );
};

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
  const { columnWidths, handleResize } = useResizableColumns();

  // Estados locais para UI (removidos os não utilizados)
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [useAPIPanel, setUseAPIPanel] = useState(false); // Toggle para testar API Panel

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
    const block = currentStepBlocks.find(block => block.id === state.selectedBlockId) || null;

    // 🔍 DEBUG: Log do selectedBlock para investigar o problema  
    console.log('🔍 ModularEditorPro - selectedBlock calculado:', {
      selectedBlockId: state.selectedBlockId,
      currentStepBlocks: currentStepBlocks.length,
      foundBlock: !!block,
      blockId: block?.id,
      blockType: block?.type,
      properties: block?.properties,
      content: block?.content,
      fullBlock: block
    });

    return block;
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
    'Social Proof': [
      { type: 'mentor-section-inline', name: 'Seção da Mentora', icon: 'user', category: 'Social Proof', description: 'Seção com informações da Gisele Galvão' },
      { type: 'testimonial-card-inline', name: 'Depoimento', icon: 'quote', category: 'Social Proof', description: 'Depoimento individual de cliente' },
      { type: 'testimonials-carousel-inline', name: 'Carrossel de Depoimentos', icon: 'carousel', category: 'Social Proof', description: 'Carrossel com múltiplos depoimentos' },
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
    console.log('🔄 ModularEditorPro - handleUpdateSelectedBlock chamado:', {
      hasSelectedBlock: !!selectedBlock,
      selectedBlockId: selectedBlock?.id,
      updates,
      updateType: typeof updates
    });

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
      case 'mentor-section-inline':
        return {
          title: 'Conheça sua Mentora',
          subtitle: 'Especialista em Consultoria de Imagem'
        };
      case 'testimonial-card-inline':
        return {
          testimonialType: 'mariangela',
          cardStyle: 'elegant',
          showPhoto: true,
          showRating: true,
          showResult: true
        };
      case 'testimonials-carousel-inline':
        return {
          title: 'O que nossas clientes dizem',
          subtitle: 'Transformações reais de mulheres como você',
          itemsPerView: 1,
          showNavigationArrows: true,
          showDots: true,
          autoPlay: false,
          layout: 'cards'
        };
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
      case 'mentor-section-inline':
        return {
          backgroundColor: '#ffffff',
          accentColor: '#ec4899',
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0
        };
      case 'testimonial-card-inline':
        return {
          backgroundColor: '#ffffff',
          accentColor: '#ec4899',
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0
        };
      case 'testimonials-carousel-inline':
        return {
          backgroundColor: '#ffffff',
          accentColor: '#ec4899',
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0
        };
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

    // Verificar se é reordenação dentro do canvas (delegado para canvas interno)
    if (active.data.current.type === 'canvas-block') {
      console.log('🔄 Reordenação de bloco no canvas - delegado para EditorCanvas');
      // Não interferir - deixar o EditorCanvas lidar com isso
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

        {/* Layout principal de 4 colunas com controles de largura */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar de etapas */}
          <div
            className="border-r border-border bg-muted/30 flex-shrink-0"
            style={{ width: `${columnWidths.steps}px` }}
          >
            <StepSidebar
              currentStep={state.currentStep}
              stepHasBlocks={stepHasBlocksRecord}
              onSelectStep={actions.setCurrentStep}
              getStepAnalysis={() => ({ icon: 'note', label: 'Etapa', desc: 'Configurar' })}
              renderIcon={(icon: string) => <div>{icon}</div>}
            />
          </div>

          {/* Divisor redimensionável - Steps */}
          <ResizeHandle
            onResize={(width) => handleResize('steps', width)}
            className="hover:shadow-lg"
            label="Etapas"
          />

          {/* Sidebar de componentes */}
          <div
            className="border-r border-border bg-background flex-shrink-0"
            style={{ width: `${columnWidths.components}px` }}
          >
            <ComponentsSidebar
              groupedComponents={groupedComponents}
              renderIcon={(icon: string) => <div>{icon}</div>}
            />
          </div>

          {/* Divisor redimensionável - Components */}
          <ResizeHandle
            onResize={(width) => handleResize('components', width)}
            className="hover:shadow-lg"
            label="Componentes"
          />

          {/* Canvas principal com scroll vertical */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <EditorCanvas
                blocks={currentStepBlocks}
                selectedBlock={selectedBlock}
                currentStep={state.currentStep}
                onSelectBlock={handleSelectBlock}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
                isPreviewMode={isPreviewMode}
                onStepChange={actions.setCurrentStep} // Para navegação no preview
              />
            </div>
          </div>

          {/* Divisor redimensionável - Properties */}
          <ResizeHandle
            onResize={(width) => handleResize('properties', width)}
            className="hover:shadow-lg"
            label="Propriedades"
          />

          {/* Propriedades com Toggle API/Registry */}
          <div
            className="border-l border-border bg-muted/30 flex-shrink-0 flex flex-col"
            style={{ width: `${columnWidths.properties}px` }}
          >
            {/* Header com Toggle */}
            <div className="p-2 border-b bg-background">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Propriedades</span>
                <button
                  onClick={() => setUseAPIPanel(!useAPIPanel)}
                  className="px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                  title={`Alternar para ${useAPIPanel ? 'Registry' : 'API'} Panel`}
                >
                  {useAPIPanel ? '🚀 API' : '📋 Registry'}
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-auto">
              {useAPIPanel && selectedBlock ? (
                <APIPropertiesPanel
                  blockId={selectedBlock.id}
                  blockType={selectedBlock.type}
                  initialProperties={selectedBlock.properties || {}}
                  onPropertyChange={(key: string, value: any, isValid: boolean) => {
                    console.log('🚀 APIPropertiesPanel change:', { key, value, isValid });
                    if (selectedBlock && isValid) {
                      handleUpdateBlock(selectedBlock.id, {
                        properties: {
                          ...selectedBlock.properties,
                          [key]: value
                        }
                      });
                    }
                  }}
                  onClose={() => actions.setSelectedBlockId(null)}
                  onDelete={() => {
                    if (selectedBlock) {
                      handleDeleteSelectedBlock();
                    }
                  }}
                />
              ) : (
                <RegistryPropertiesPanel
                  selectedBlock={selectedBlock || null}
                  onUpdate={(blockId: string, updates: Record<string, any>) => {
                    console.log('� RegistryPropertiesPanel update:', { blockId, updates });
                    if (selectedBlock && blockId === selectedBlock.id) {
                      handleUpdateBlock(selectedBlock.id, updates);
                    }
                  }}
                  onClose={() => actions.setSelectedBlockId(null)}
                  onDelete={(blockId: string) => {
                    console.log('🗑️ RegistryPropertiesPanel delete:', blockId);
                    if (selectedBlock && blockId === selectedBlock.id) {
                      handleDeleteSelectedBlock();
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default ModularEditorPro;