import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
// 🚀 PURE BUILDER SYSTEM - Hook unificado otimizado
import { usePureBuilder } from '@/components/editor/PureBuilderProvider';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { useNotification } from '@/components/ui/Notification';
import { Block } from '@/types/editor';

// Componentes modulares
import EditorToolbar from './EditorToolbar';
import EditorCanvas from './EditorCanvas';
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import ComponentsSidebar from '@/components/editor/sidebars/ComponentsSidebar';
import RegistryPropertiesPanel from '@/components/universal/RegistryPropertiesPanel';
import APIPropertiesPanel from '@/components/editor/properties/APIPropertiesPanel';

// 🔗 Provider de dados reais do funil - MIGRADO para PureBuilderProvider
// import FunnelDataProviderWrapper from '@/providers/FunnelDataProvider';

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
      className={`relative w-1 bg-border hover:bg-brand-brightBlue cursor-col-resize transition-colors duration-200 group ${className} ${isDragging ? 'bg-brand-brightBlue' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => !isDragging && setShowTooltip(false)}
      title={label ? `Redimensionar ${label}` : 'Redimensionar coluna'}
    >
      {/* Indicador visual quando hover */}
      <div className="absolute inset-0 w-1 bg-brand-brightBlue opacity-0 group-hover:opacity-50 transition-opacity duration-200" />

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
/**
 * 🚀 MODULAR EDITOR PRO - Interface para props
 */
interface ModularEditorProProps {
  showProFeatures?: boolean;
  templatesIAOpen?: boolean;
  brandKitOpen?: boolean;
  analyticsOpen?: boolean;
}

/**
 * ✅ Performance otimizada com React.memo
 * ✅ Timers migrados para useOptimizedScheduler
 */

const ModularEditorPro: React.FC<ModularEditorProProps> = () => {
  // 🚀 PURE BUILDER SYSTEM - Hook unificado
  const { state, actions } = usePureBuilder();
  const { schedule } = useOptimizedScheduler();
  const { addNotification } = useNotification();
  const { columnWidths, handleResize } = useResizableColumns();

  // 🔍 DEBUG: Log completo do estado inicial
  useEffect(() => {
    console.log('🚀 ModularEditorPro - Estado inicial completo:', {
      stepBlocks: state.stepBlocks,
      currentStep: state.currentStep,
      stepKeys: Object.keys(state.stepBlocks),
      totalSteps: Object.keys(state.stepBlocks).length,
      stepCounts: Object.entries(state.stepBlocks).map(([key, blocks]) => ({ [key]: Array.isArray(blocks) ? blocks.length : 0 })),
      isLoading: state.isLoading,
      stepValidation: state.stepValidation
    });
  }, [state]);

  // Estados locais para UI (removidos os não utilizados)
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [useAPIPanel, setUseAPIPanel] = useState(false); // Toggle para testar API Panel
  // Bloco selecionado - usar um selectedBlockId simples local
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // DnD removido - usa contexto do PureBuilderProvider

  // Blocos da etapa atual com memoização otimizada  
  const currentStepBlocks = useMemo(() => {
    const stepKey = `step-${state.currentStep}`;
    const blocks = state.stepBlocks[stepKey] || [];

    // 🔍 DEBUG: Log detalhado do carregamento de blocos
    console.log('🔍 ModularEditorPro - currentStepBlocks calculado:', {
      currentStep: state.currentStep,
      stepKey,
      blocksFound: blocks.length,
      blockTypes: blocks.map(b => b.type),
      allStepKeys: Object.keys(state.stepBlocks),
      totalBlocks: Object.values(state.stepBlocks).reduce((acc, arr) => acc + arr.length, 0)
    });

    return blocks;
  }, [state.stepBlocks, state.currentStep]);

  // Bloco selecionado com memoização e debug melhorado
  const selectedBlock = useMemo(() => {
    if (!selectedBlockId) return null;
    const block = currentStepBlocks.find(block => block.id === selectedBlockId) || null;

    // 🔍 DEBUG: Log do selectedBlock para investigar o problema  
    console.log('🔍 ModularEditorPro - selectedBlock calculado:', {
      selectedBlockId,
      currentStepBlocks: currentStepBlocks.length,
      foundBlock: !!block,
      blockId: block?.id,
      blockType: block?.type,
      properties: block?.properties,
      content: block?.content
    });

    return block;
  }, [currentStepBlocks, selectedBlockId]);

  // Dados para componentes da sidebar - GENÉRICO para qualquer funil
  const stepHasBlocksRecord = useMemo(() => {
    const record: Record<number, boolean> = {};

    // 🌐 DINÂMICO: Detecta automaticamente quantas etapas o funil tem
    const stepKeys = Object.keys(state.stepBlocks);
    const maxStep = stepKeys.reduce((max, key) => {
      const stepNumber = parseInt(key.replace('step-', ''));
      return Math.max(max, stepNumber);
    }, 21); // Pure Builder System sempre tem 21 etapas

    for (let i = 1; i <= maxStep; i++) {
      const stepKey = `step-${i}`;
      record[i] = (state.stepBlocks[stepKey]?.length || 0) > 0;
    }

    // 🔍 DEBUG: Log do stepHasBlocksRecord para investigar problemas
    console.log('🔍 ModularEditorPro - stepHasBlocksRecord calculado:', {
      record,
      currentStep: state.currentStep,
      totalStepsWithBlocks: Object.values(record).filter(Boolean).length,
      stepBlocksKeys: Object.keys(state.stepBlocks),
      sampleStepBlocks: {
        'step-1': state.stepBlocks['step-1']?.length || 0,
        'step-2': state.stepBlocks['step-2']?.length || 0,
        'step-3': state.stepBlocks['step-3']?.length || 0
      }
    });

    return record;
  }, [state.stepBlocks, state.currentStep]);

  // Sistema de validação automática de etapas
  useEffect(() => {
    // Validar a etapa atual sempre que mudar de step ou os blocos mudarem
    const validateCurrentStep = () => {
      const isStepValid = currentStepBlocks.length > 0;
      actions.setStepValid(state.currentStep, isStepValid);

      // 🔍 DEBUG: Log da validação de etapa
      console.log('🔍 ModularEditorPro - Validação de etapa:', {
        step: state.currentStep,
        blocksCount: currentStepBlocks.length,
        isValid: isStepValid,
        blockIds: currentStepBlocks.map(b => b.id)
      });
    };

    validateCurrentStep();
  }, [state.currentStep, currentStepBlocks]); // ❌ Removido 'actions' para evitar loop infinito

  // Validação ao salvar draft
  useEffect(() => {
    // Salvar draft quando houver mudanças nos blocos (com debounce)
    const saveTimeout = setTimeout(() => {
      if (currentStepBlocks.length > 0) {
        try {
          const draftKey = 'local-funnel'; // Usar chave consistente
          const stepKey = `step-${state.currentStep}`;

          // Simular salvamento de draft (placeholder para implementação real)
          console.log('💾 Salvando draft automaticamente:', {
            draftKey,
            stepKey,
            blocksCount: currentStepBlocks.length
          });

          // Marcar etapa como válida se tem blocos
          if (actions.setStepValid) {
            actions.setStepValid(state.currentStep, true);
          }
        } catch (error) {
          console.error('❌ Erro ao salvar draft:', error);
        }
      }
    }, 2000); // Debounce de 2 segundos

    return () => clearTimeout(saveTimeout);
  }, [currentStepBlocks, state.currentStep, actions]);

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
      { type: 'options-grid', name: 'Grade de Opções', icon: 'flash', category: 'Quiz', description: 'Grade interativa de opções' },
    ],
    'Layout': [
      { type: 'container', name: 'Container', icon: 'square', category: 'Layout', description: 'Container flexível' },
      { type: 'spacer', name: 'Espaçador', icon: 'minus', category: 'Layout', description: 'Espaçamento vertical' },
    ]
  }), []);

  // Handlers de bloco otimizados
  const handleSelectBlock = useCallback((blockId: string) => {
    console.log('🔍 ModularEditorPro - handleSelectBlock chamado:', {
      blockId,
      currentStep: state.currentStep,
      currentBlocks: currentStepBlocks.length
    });
    setSelectedBlockId(blockId);
  }, [state.currentStep, currentStepBlocks.length]);

  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    const stepKey = `step-${state.currentStep}`;
    actions.updateBlock(stepKey, blockId, updates);
  }, [state.currentStep, actions]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    const stepKey = `step-${state.currentStep}`;
    actions.removeBlock(stepKey, blockId);

    // Limpar seleção se deletar bloco selecionado
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }

    addNotification('Componente foi removido da etapa');
  }, [state.currentStep, selectedBlockId, actions, addNotification]);

  const handleDeleteSelectedBlock = useCallback(() => {
    if (selectedBlock) {
      handleDeleteBlock(selectedBlock.id);
    }
  }, [selectedBlock, handleDeleteBlock]);

  // ✅ Funções auxiliares removidas - não utilizadas após migração para PureBuilderProvider
    switch (type) {
      case 'headline':
        return { fontSize: 'text-2xl', fontWeight: 'font-bold', textAlign: 'center' };
      case 'text':
        return { fontSize: 'text-base', textAlign: 'left' };
      case 'image':
        return { maxWidth: 'md', rounded: 'rounded-lg' };
      case 'button':
        return { variant: 'primary', size: 'md' };
      case 'options-grid':
        return {
          title: 'Escolha uma opção:',
          description: '',
          columns: 2,
          gridGap: 16,
          showImages: true,
          multipleSelection: false,
          options: [
            {
              id: 'option-1',
              text: 'Opção A',
              description: 'Descrição da opção A',
              value: 'a',
              category: 'Categoria A'
            },
            {
              id: 'option-2',
              text: 'Opção B',
              description: 'Descrição da opção B',
              value: 'b',
              category: 'Categoria B'
            }
          ]
        };
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

  // ✅ Handlers DnD removidos - usando apenas DndContext do PureBuilderProvider

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

  const handlePublish = useCallback(async () => {
    try {
      const funnelData = {
        stepBlocks: state.stepBlocks,
        currentStep: state.currentStep,
        settings: {
          seo: {
            title: 'Quiz Funil',
            description: 'Quiz interativo para captura de leads',
            keywords: []
          },
          branding: {
            colors: {
              primary: '#3B82F6',
              secondary: '#6B7280'
            },
            typography: {
              fontFamily: {
                primary: 'Inter'
              }
            }
          },
          analytics: {
            enabled: false
          }
        }
      };

      console.log('🚀 Iniciando publicação do funil...', funnelData);
      addNotification('Funil sendo preparado para publicação...');

      // Simular processo de publicação
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Funil publicado com sucesso!');
      addNotification('Funil publicado com sucesso!');

    } catch (error) {
      console.error('❌ Erro na publicação:', error);
      addNotification('Erro ao publicar funil', 'error');
    }
  }, [state, addNotification]);

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* 🔍 DEBUG: Loading State Check */}
      {state.isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Carregando dados do editor...</p>
          </div>
        </div>
      )}

      {/* 🔍 DEBUG: Empty State Check */}
      {!state.isLoading && Object.keys(state.stepBlocks).length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum template carregado</h3>
            <p className="text-muted-foreground mb-4">
              O editor está aguardando o carregamento dos dados do template.
              Verifique se o funnelId está correto na URL.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>🔍 Debug Info:</div>
              <div>Current Step: {state.currentStep}</div>
              <div>Step Blocks: {Object.keys(state.stepBlocks).length} keys</div>
              <div>Selected Block: {selectedBlockId || 'none'}</div>
            </div>
          </div>
        </div>
      )}

        {/* 🔍 DEBUG: Step without blocks */}
        {!state.isLoading && Object.keys(state.stepBlocks).length > 0 && currentStepBlocks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Etapa {state.currentStep} vazia</h3>
              <p className="text-muted-foreground mb-4">
                Esta etapa não possui componentes. Arraste componentes da sidebar para começar a construir.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>🔍 Debug Info:</div>
                <div>Available Steps: {Object.keys(state.stepBlocks).join(', ')}</div>
                <div>Current Step Key: step-{state.currentStep}</div>
                <div>Has Step Data: {`step-${state.currentStep}` in state.stepBlocks ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Renderização normal apenas se há dados */}
        {!state.isLoading && currentStepBlocks.length > 0 && (
          <>
            {/* Toolbar */}
            <EditorToolbar
              currentStep={state.currentStep}
              totalSteps={Math.max(...Object.keys(stepHasBlocksRecord).map(Number), 21)}
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
                  stepValidation={state.stepValidation}
                  onSelectStep={(step: number) => {
                    console.log('🔍 ModularEditorPro - StepSidebar onSelectStep chamado:', {
                      fromStep: state.currentStep,
                      toStep: step,
                      stepHasBlocks: stepHasBlocksRecord[step],
                      stepValidation: state.stepValidation[step]
                    });
                    actions.setCurrentStep(step);
                  }}
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
                    key={`editor-canvas-stable-${state.currentStep}`} // Chave estável - só muda no step
                    blocks={currentStepBlocks}
                    selectedBlock={selectedBlock}
                    currentStep={state.currentStep}
                    onSelectBlock={handleSelectBlock}
                    onUpdateBlock={handleUpdateBlock}
                    onDeleteBlock={handleDeleteBlock}
                    isPreviewMode={isPreviewMode}
                    onStepChange={(step: number) => {
                      console.log('🔍 ModularEditorPro - EditorCanvas onStepChange chamado:', {
                        fromStep: state.currentStep,
                        toStep: step
                      });
                      actions.setCurrentStep(step);
                    }}
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
                      onClose={() => setSelectedBlockId(null)}
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
                        console.log('🔄 RegistryPropertiesPanel update:', { blockId, updates });
                        if (selectedBlock && blockId === selectedBlock.id) {
                          handleUpdateBlock(selectedBlock.id, updates);
                        }
                      }}
                      onClose={() => setSelectedBlockId(null)}
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
          </>
        )}
      </div>
    );
};

export default ModularEditorPro;