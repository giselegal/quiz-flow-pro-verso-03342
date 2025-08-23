import { QuizRenderer } from '@/components/core/QuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone';
import { DraggableComponentItem } from '@/components/editor/dnd/DraggableComponentItem';
import { useNotification } from '@/components/ui/Notification';
import EnhancedUniversalPropertiesPanelFixed from '@/components/universal/EnhancedUniversalPropertiesPanelFixed';
import { getBlocksForStep } from '@/config/quizStepsComplete';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import {
  extractDragData,
  getDragFeedback,
  logDragEvent,
  validateDrop,
} from '@/utils/dragDropUtils';
import {
  copyToClipboard,
  createBlockFromComponent,
  devLog,
  duplicateBlock,
  validateEditorJSON,
} from '@/utils/editorUtils';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useEditor } from './EditorProvider';
import { SortableBlock } from './SortableBlock';

interface QuizEditorProProps {
  className?: string;
}

/**
 * 🎯 QUIZ EDITOR PROFISSIONAL - 4 COLUNAS
 */
export const QuizEditorPro: React.FC<QuizEditorProProps> = ({ className = '' }) => {
  // Segurança: useEditor pode lançar se não houver contexto — capturamos para renderizar fallback
  let editorContext;
  try {
    editorContext = useEditor();
  } catch (e) {
    editorContext = undefined;
  }

  if (!editorContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro de Contexto do Editor</h2>
          <p className="text-gray-600 mb-4">
            O QuizEditorPro deve ser usado dentro de um EditorProvider.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Recarregar
          </button>
        </div>
      </div>
    );
  }

  const { state, actions } = editorContext;
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const notification = useNotification();
  // extrair NotificationContainer para renderização correta
  const NotificationContainer = (notification as any).NotificationContainer;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Uso consistente de safeCurrentStep e memoização do step data
  const safeCurrentStep = state.currentStep || 1;
  const currentStepKey = `step-${safeCurrentStep}`;

  const currentStepData = useMemo(() => {
    const blocks = getBlocksForStep(safeCurrentStep, state.stepBlocks) || [];

    // 🚨 CORREÇÃO CRÍTICA: Se não há blocos, força reload do template
    if (blocks.length === 0) {
      console.log('🚨 QuizEditorPro: EMPTY STEP DETECTED', {
        step: safeCurrentStep,
        stepKey: currentStepKey,
        availableSteps: Object.keys(state.stepBlocks),
      });

      // Força reload do template usando actions se disponível
      if (actions.ensureStepLoaded) {
        actions.ensureStepLoaded(safeCurrentStep);
      }
    }

    return blocks;
  }, [safeCurrentStep, state.stepBlocks, currentStepKey, actions]);

  // Pré-calcular se cada etapa tem blocos para evitar múltiplas chamadas durante render
  const stepHasBlocks = useMemo(() => {
    const map: Record<number, boolean> = {};
    for (let i = 1; i <= 21; i++) {
      map[i] = (getBlocksForStep(i, state.stepBlocks) || []).length > 0;
    }
    return map;
  }, [state.stepBlocks]);

  const selectedBlock = currentStepData.find((block: Block) => block.id === state.selectedBlockId);

  // Logs apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    devLog('QuizEditorPro render:', {
      originalCurrentStep: state.currentStep,
      safeCurrentStep,
      currentStepKey,
      totalBlocks: currentStepData.length,
      availableSteps: Object.keys(state.stepBlocks),
      blockIds: currentStepData.map(b => b.id),
    });

    devLog('=== DIAGNÓSTICO DE ETAPAS ===');
    devLog('1. currentStep:', state.currentStep);
    devLog('2. stepBlocks keys:', Object.keys(state.stepBlocks));
    devLog('3. currentStepData (computed):', currentStepData);
    devLog(
      '4. Blocks found with resilient function:',
      currentStepData.length > 0 ? '✅ SUCCESS' : '❌ EMPTY'
    );
    devLog('===============================');
  }

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Memoizar lista de componentes (mantido)
  const availableComponents = useMemo(
    () => [
      {
        type: 'quiz-intro-header',
        name: 'Header Quiz',
        icon: '📝',
        category: 'Estrutura',
        description: 'Cabeçalho com título e descrição',
      },
      {
        type: 'options-grid',
        name: 'Grade Opções',
        icon: '⚡',
        category: 'Interação',
        description: 'Grid de opções para questões',
      },
      {
        type: 'form-container',
        name: 'Formulário',
        icon: '📝',
        category: 'Captura',
        description: 'Campo de entrada de dados',
      },
      {
        type: 'text',
        name: 'Texto',
        icon: '📄',
        category: 'Conteúdo',
        description: 'Bloco de texto simples',
      },
      {
        type: 'button',
        name: 'Botão',
        icon: '🔘',
        category: 'Interação',
        description: 'Botão de ação',
      },
      {
        type: 'result-header-inline',
        name: 'Header Resultado',
        icon: '🎯',
        category: 'Resultado',
        description: 'Cabeçalho personalizado de resultado',
      },
      {
        type: 'style-card-inline',
        name: 'Card Estilo',
        icon: '🎨',
        category: 'Resultado',
        description: 'Card com características do estilo',
      },
      {
        type: 'secondary-styles',
        name: 'Estilos Secundários',
        icon: '📊',
        category: 'Resultado',
        description: 'Lista de estilos complementares',
      },
      {
        type: 'testimonials',
        name: 'Depoimentos',
        icon: '💬',
        category: 'Social Proof',
        description: 'Lista de depoimentos',
      },
      {
        type: 'guarantee',
        name: 'Garantia',
        icon: '🛡️',
        category: 'Confiança',
        description: 'Selo de garantia',
      },
      {
        type: 'hero',
        name: 'Hero Section',
        icon: '🚀',
        category: 'Layout',
        description: 'Seção hero para transições e ofertas',
      },
      {
        type: 'benefits',
        name: 'Benefícios',
        icon: '✨',
        category: 'Vendas',
        description: 'Lista de benefícios do produto',
      },
      {
        type: 'quiz-offer-cta-inline',
        name: 'CTA Oferta',
        icon: '💰',
        category: 'Conversão',
        description: 'Call-to-action para ofertas especiais',
      },
    ],
    []
  );

  const groupedComponents = useMemo(
    () =>
      availableComponents.reduce(
        (acc, component) => {
          if (!acc[component.category]) acc[component.category] = [];
          acc[component.category].push(component);
          return acc;
        },
        {} as Record<string, typeof availableComponents>
      ),
    [availableComponents]
  );

  const getStepAnalysis = (step: number) => {
    if (step === 1) return { type: '📝', label: 'Captura', desc: 'Nome do usuário' };
    if (step >= 2 && step <= 11)
      return { type: '🎯', label: 'Questão', desc: 'Pontuação de estilo' };
    if (step === 12) return { type: '🔄', label: 'Transição', desc: 'Para estratégicas' };
    if (step >= 13 && step <= 18)
      return { type: '📊', label: 'Estratégica', desc: 'Tracking sem pontuação' };
    if (step === 19) return { type: '⏳', label: 'Calculando', desc: 'Processamento' };
    if (step === 20) return { type: '🎉', label: 'Resultado', desc: 'Estilo personalizado' };
    if (step === 21) return { type: '💰', label: 'Oferta', desc: 'CTA de conversão' };
    return { type: '❓', label: 'Indefinida', desc: 'Não mapeada' };
  };

  // Handlers
  const handleStepSelect = useCallback((step: number) => actions.setCurrentStep(step), [actions]);

  const handleBlockSelect = useCallback(
    (blockId: string) => actions.setSelectedBlockId(blockId),
    [actions]
  );

  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Record<string, any>) => {
      actions.updateBlock(currentStepKey, blockId, updates);
    },
    [currentStepKey, actions]
  );

  const handleBlockDelete = useCallback(
    (blockId: string) => {
      // optar por await+try/catch caso necessário
      actions.removeBlock(currentStepKey, blockId);
    },
    [currentStepKey, actions]
  );

  const handleBlockMoveUp = useCallback(
    (blockId: string) => {
      const currentIndex = currentStepData.findIndex(block => block.id === blockId);
      if (currentIndex > 0) {
        actions.reorderBlocks(currentStepKey, currentIndex, currentIndex - 1);
      }
    },
    [currentStepData, currentStepKey, actions]
  );

  const handleBlockMoveDown = useCallback(
    (blockId: string) => {
      const currentIndex = currentStepData.findIndex(block => block.id === blockId);
      if (currentIndex < currentStepData.length - 1) {
        actions.reorderBlocks(currentStepKey, currentIndex, currentIndex + 1);
      }
    },
    [currentStepData, currentStepKey, actions]
  );

  const handleClosePropertiesPanel = useCallback(() => actions.setSelectedBlockId(null), [actions]);

  const handleBlockDuplicate = useCallback(
    (blockId: string) => {
      const blockToDuplicate = currentStepData.find(block => block.id === blockId);
      if (blockToDuplicate) {
        const newBlock = duplicateBlock(blockToDuplicate, currentStepData);
        actions.addBlock(currentStepKey, newBlock);
        actions.setSelectedBlockId(newBlock.id);
      }
    },
    [currentStepData, currentStepKey, actions]
  );

  // Drag handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const dragData = extractDragData(active);
    logDragEvent('start', active);
    if (dragData?.type === 'canvas-block') {
      if (process.env.NODE_ENV === 'development')
        devLog('Iniciando drag de bloco do canvas:', dragData.blockId);
    } else if (dragData?.type === 'sidebar-component') {
      if (process.env.NODE_ENV === 'development')
        devLog('Iniciando drag de componente da sidebar:', dragData.blockType);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      // Guard: se não houve target de drop, cancelar
      if (!over) {
        const dragData = extractDragData(active);
        const feedback = getDragFeedback(dragData, {
          isValid: false,
          message: 'Sem alvo de drop',
        } as any);
        notification?.warning?.(feedback.message);
        return;
      }

      const validation = validateDrop(active, over, currentStepData);
      logDragEvent('end', active, over, validation);

      if (!validation.isValid) {
        const feedback = getDragFeedback(extractDragData(active), validation);
        notification?.warning?.(feedback.message);
        return;
      }

      const dragData = extractDragData(active);
      if (!dragData) {
        notification?.error?.('Dados de drag corrompidos');
        return;
      }

      try {
        switch (validation.action) {
          case 'add':
            if (dragData.type === 'sidebar-component' && dragData.blockType) {
              const newBlock = createBlockFromComponent(dragData.blockType as any, currentStepData);
              actions.addBlock(currentStepKey, newBlock);
              actions.setSelectedBlockId(newBlock.id);
              notification?.success?.(`Componente ${dragData.blockType} adicionado!`);
            }
            break;
          case 'reorder':
            if (dragData.type === 'canvas-block' && typeof over.id === 'string') {
              const activeIndex = currentStepData.findIndex(block => block.id === active.id);
              const overIndex = currentStepData.findIndex(block => block.id === over.id);
              if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
                actions.reorderBlocks(currentStepKey, activeIndex, overIndex);
                notification?.info?.('Blocos reordenados');
              }
            }
            break;
          default:
            if (process.env.NODE_ENV === 'development')
              devLog('Ação de drop não implementada:', validation.action);
        }
      } catch (error) {
        console.error('Erro durante drag & drop:', error);
        notification?.error?.('Erro ao processar drag & drop');
      }
    },
    [actions, currentStepKey, currentStepData, notification]
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={`quiz-editor-pro h-screen bg-gray-50 flex ${className}`}>
          {/* COLUNA 1: ETAPAS */}
          <div className="w-[200px] bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900">Etapas do Quiz</h3>
              <p className="text-xs text-gray-500 mt-1">21 etapas configuradas</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-1">
                {Array.from({ length: 21 }, (_, i) => i + 1).map(step => {
                  const analysis = getStepAnalysis(step);
                  const isActive = step === safeCurrentStep;
                  const hasBlocks = stepHasBlocks[step];

                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => handleStepSelect(step)}
                      className={cn(
                        'w-full text-left p-2 rounded-md text-xs transition-colors',
                        isActive
                          ? 'bg-blue-100 border-blue-300 text-blue-900'
                          : 'hover:bg-gray-50 text-gray-700'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{analysis.type}</span>
                          <span className="font-medium">Etapa {step}</span>
                        </div>
                        {hasBlocks && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                      </div>
                      <div className="text-gray-600 mt-1">
                        <div className="font-medium">{analysis.label}</div>
                        <div className="text-xs">{analysis.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>Etapa atual:</span>
                <span className="font-medium">{safeCurrentStep}/21</span>
              </div>
            </div>
          </div>

          {/* COLUNA 2: COMPONENTES */}
          <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900">Biblioteca de Componentes</h3>
              <p className="text-xs text-gray-500 mt-1">
                {availableComponents.length} componentes disponíveis
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-3">
                {Object.entries(groupedComponents).map(([category, components]) => (
                  <div key={category} className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {components.map(component => (
                        <DraggableComponentItem
                          key={component.type}
                          blockType={component.type}
                          title={component.name}
                          description={component.description}
                          icon={<span className="text-lg">{component.icon}</span>}
                          category={component.category}
                          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-blue-300"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA 3: CANVAS */}
          <div className="flex-1 flex flex-col bg-gray-100">
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {mode === 'edit' ? '✏️' : '👁️'}
                    {mode === 'edit' ? 'Editor' : 'Preview'} - Etapa {safeCurrentStep}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getStepAnalysis(safeCurrentStep).label}:{' '}
                    {getStepAnalysis(safeCurrentStep).desc}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={actions.undo}
                      disabled={!actions.canUndo}
                      data-testid="btn-undo"
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-all duration-200',
                        actions.canUndo
                          ? 'text-gray-700 hover:bg-white hover:shadow-sm'
                          : 'text-gray-400 cursor-not-allowed'
                      )}
                      title="Desfazer (Ctrl+Z)"
                    >
                      ↶ Undo
                    </button>
                    <button
                      type="button"
                      onClick={actions.redo}
                      disabled={!actions.canRedo}
                      data-testid="btn-redo"
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-all duration-200',
                        actions.canRedo
                          ? 'text-gray-700 hover:bg-white hover:shadow-sm'
                          : 'text-gray-400 cursor-not-allowed'
                      )}
                      title="Refazer (Ctrl+Y)"
                    >
                      ↷ Redo
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const json = actions.exportJSON();
                          const success = await copyToClipboard(json);
                          if (success)
                            notification?.success?.('JSON exportado para a área de transferência!');
                          else notification?.error?.('Erro ao copiar para área de transferência');
                        } catch (error) {
                          notification?.error?.('Erro ao exportar JSON');
                        }
                      }}
                      data-testid="btn-export-json"
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      title="Exportar como JSON"
                      aria-label="Exportar estado atual como JSON"
                    >
                      📤 Export
                    </button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = event => {
                            try {
                              const json = event.target?.result as string;
                              const validation = validateEditorJSON(json);
                              if (!validation.valid) {
                                notification?.error?.(`Erro de validação: ${validation.error}`);
                                return;
                              }
                              actions.importJSON(json);
                              notification?.success?.('JSON importado com sucesso!');
                            } catch (error) {
                              notification?.error?.(
                                'Erro ao importar JSON: ' + (error as Error).message
                              );
                            }
                          };
                          reader.readAsText(file);
                        }
                        e.currentTarget.value = '';
                      }}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      id="import-json"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="btn-import-json"
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      title="Importar JSON"
                      aria-label="Importar estado do editor via JSON"
                    >
                      📥 Import
                    </button>
                  </div>

                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setMode('edit')}
                      className={cn(
                        'px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                        mode === 'edit'
                          ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('preview')}
                      className={cn(
                        'px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                        mode === 'preview'
                          ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      👁️ Preview
                    </button>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    💾 Salvar
                  </button>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-lg border">
                {mode === 'edit' ? (
                  <div
                    className={cn(
                      'flex items-center justify-between text-sm',
                      'bg-blue-50 border-blue-200 text-blue-900'
                    )}
                  >
                    <div>
                      <strong>✏️ Modo Edição Visual:</strong> Conteúdo real com overlays de seleção
                      interativos
                    </div>
                    <div className="text-blue-700">
                      {state.selectedBlockId
                        ? `Editando: ${state.selectedBlockId}`
                        : `${currentStepData.length} blocos disponíveis - Clique para editar`}
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex items-center justify-between text-sm',
                      'bg-green-50 border-green-200 text-green-900'
                    )}
                  >
                    <div>
                      <strong>👁️ Modo Preview:</strong> Visualização idêntica à produção final
                    </div>
                    <div className="text-green-700">Navegação e interações funcionais</div>
                  </div>
                )}
              </div>
            </div>

            <CanvasDropZone
              isEmpty={currentStepData.length === 0 && mode === 'edit'}
              data-testid="canvas-dropzone"
            >
              <QuizRenderer
                mode={mode === 'preview' ? 'preview' : 'editor'}
                onStepChange={handleStepSelect}
                initialStep={safeCurrentStep}
              />

              {mode === 'edit' && (
                <SortableContext
                  items={currentStepData.map(
                    block => block.id || `block-${currentStepData.indexOf(block)}`
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="absolute inset-0 pointer-events-auto z-50">
                    {currentStepData.map((block: Block, index: number) => {
                      const blockId = block.id || `block-${index}`;
                      const isSelected = state.selectedBlockId === blockId;

                      let topOffset = 0;
                      let height = 80;
                      switch (block.type) {
                        case 'quiz-intro-header':
                          topOffset = 20;
                          height = 120;
                          break;
                        case 'options-grid':
                          topOffset = 150 + index * 200;
                          height = 300;
                          break;
                        case 'form-container':
                          topOffset = 200 + index * 150;
                          height = 120;
                          break;
                        case 'button':
                          topOffset = 400 + index * 100;
                          height = 60;
                          break;
                        default:
                          topOffset = 60 + index * 100;
                          height = 80;
                      }

                      return (
                        <SortableBlock
                          key={blockId}
                          id={blockId}
                          block={block}
                          isSelected={isSelected}
                          topOffset={topOffset}
                          height={height}
                          onSelect={handleBlockSelect}
                          onMoveUp={handleBlockMoveUp}
                          onMoveDown={handleBlockMoveDown}
                          onDuplicate={() => handleBlockDuplicate(blockId)}
                          onDelete={handleBlockDelete}
                          data-testid={`editor-block-${blockId}`}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              )}
            </CanvasDropZone>
          </div>

          {/* COLUNA 4: PROPRIEDADES */}
          <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900">Painel de Propriedades</h3>
              {selectedBlock ? (
                <p className="text-xs text-gray-500 mt-1">Editando: {selectedBlock.type}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Selecione um bloco para editar</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {selectedBlock ? (
                <EnhancedUniversalPropertiesPanelFixed
                  selectedBlock={selectedBlock}
                  onUpdate={handleBlockUpdate}
                  onClose={handleClosePropertiesPanel}
                  onDelete={handleBlockDelete}
                />
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <div className="text-2xl mb-3">⚙️</div>
                  <div className="text-sm font-medium mb-2">Nenhum bloco selecionado</div>
                  <div className="text-xs">
                    Clique em um bloco no canvas para ver suas propriedades
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Estatísticas da Etapa {safeCurrentStep}
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Blocos configurados:</span>
                        <span className="font-medium">{currentStepData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tipo da etapa:</span>
                        <span className="font-medium">
                          {getStepAnalysis(safeCurrentStep).label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Função:</span>
                        <span className="font-medium">{getStepAnalysis(safeCurrentStep).desc}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DndContext>

      {/* Notification container correto */}
      {NotificationContainer ? <NotificationContainer /> : null}
    </>
  );
};

export default QuizEditorPro;
