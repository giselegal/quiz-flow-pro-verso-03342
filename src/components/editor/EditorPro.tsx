import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { getBlocksForStep } from '../../config/quizStepsComplete';
import { cn } from '../../lib/utils';
import { Block } from '../../types/editor';
import {
  extractDragData,
  getDragFeedback,
  logDragEvent,
  validateDrop,
} from '../../utils/dragDropUtils';
import {
  copyToClipboard,
  createBlockFromComponent,
  devLog,
  duplicateBlock,
  validateEditorJSON,
} from '../../utils/editorUtils';
import { QuizRenderer } from '../core/QuizRenderer';
import { useNotification } from '../ui/Notification';
import CanvasDropZone from './canvas/CanvasDropZone';
import { DraggableComponentItem } from './dnd/DraggableComponentItem';
import { useEditor } from './EditorProvider';
import { SortableBlock } from './SortableBlock';

/**
 * EditorPro - versão modularizada / otimizada do QuizEditorPro
 *
 * Principais mudanças:
 * - Modularização das colunas (facilita testes e lazy-loading)
 * - Lazy-load do painel de propriedades (reduz TTI/hidratação)
 * - Preserva DnD e lógica existente (reaproveite handlers)
 *
 * Observações de otimização sugeridas:
 * - Virtualizar a lista de etapas se houver muitas etapas
 * - Adiar carregamento de scripts externos (analytics/chat) se possível
 * - Extrair availableComponents para um arquivo de config
 */

// lazy-load do painel de propriedades (reduz custo de bundle inicial)
const EnhancedUniversalPropertiesPanelFixed = React.lazy(
  () => import('@/components/universal/EnhancedUniversalPropertiesPanelFixed')
);

interface EditorProProps {
  className?: string;
}

export const EditorPro: React.FC<EditorProProps> = ({ className = '' }) => {
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
            O EditorPro deve ser usado dentro de um EditorProvider.
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState('Quiz Quest - Editor Principal');
  const notification = useNotification();
  const NotificationContainer = (notification as any)?.NotificationContainer ?? null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const safeCurrentStep = state.currentStep || 1;
  const currentStepKey = `step-${safeCurrentStep}`;

  const currentStepData = useMemo(
    () => getBlocksForStep(safeCurrentStep, state.stepBlocks) || [],
    [safeCurrentStep, state.stepBlocks]
  );

  const stepHasBlocks = useMemo(() => {
    const map: Record<number, boolean> = {};
    for (let i = 1; i <= 21; i++) {
      map[i] = (getBlocksForStep(i, state.stepBlocks) || []).length > 0;
    }
    return map;
  }, [state.stepBlocks]);

  const selectedBlock = currentStepData.find((block: Block) => block.id === state.selectedBlockId);

  if (process.env.NODE_ENV === 'development') {
    devLog('EditorPro render:', {
      currentStep: state.currentStep,
      safeCurrentStep,
      currentStepKey,
      totalBlocks: currentStepData.length,
    });
  }

  // DnD sensors - configuração mais permissiva para debug
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 }, // Reduzido de 8 para 3
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Collision detection strategy com assinatura correta
  const collisionDetectionStrategy = useCallback((args: any) => {
    try {
      const { active } = args;
      const activeType = extractDragData(active)?.type;
      if (activeType === 'sidebar-component') {
        return rectIntersection(args);
      }
    } catch (err) {
      // fallback silencioso para evitar quebrar o DnD
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.debug('collisionDetectionStrategy error, fallback to closestCenter:', err);
      }
    }
    return closestCenter(args);
  }, []);

  // componentes disponíveis - ideal extrair para config
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
        (acc, c) => {
          if (!acc[c.category]) acc[c.category] = [];
          acc[c.category].push(c);
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

  // Handlers básicos
  const handleStepSelect = useCallback((step: number) => actions.setCurrentStep(step), [actions]);
  const handleBlockSelect = useCallback(
    (blockId: string) => actions.setSelectedBlockId(blockId),
    [actions]
  );
  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Record<string, any>) =>
      actions.updateBlock(currentStepKey, blockId, updates),
    [currentStepKey, actions]
  );
  const handleBlockDelete = useCallback(
    (blockId: string) => actions.removeBlock(currentStepKey, blockId),
    [currentStepKey, actions]
  );

  const handleBlockDuplicate = useCallback(
    (blockId: string) => {
      const blockToDuplicate = currentStepData.find(b => b.id === blockId);
      if (!blockToDuplicate) return;
      const newBlock = duplicateBlock(blockToDuplicate, currentStepData);
      actions.addBlock(currentStepKey, newBlock);
      actions.setSelectedBlockId(newBlock.id);
    },
    [currentStepData, currentStepKey, actions]
  );

  // Drag handlers (reutilizam utilitários)
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const dragData = extractDragData(active);
    console.log('🚀 DRAG START CAPTURADO!', {
      activeId: active.id,
      dragData,
      activeDataCurrent: active.data.current,
    });
    logDragEvent('start', active);
    if (process.env.NODE_ENV === 'development') devLog('Drag start', dragData);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      console.log('🎯 DRAG END CAPTURADO!', {
        activeId: active.id,
        overId: over?.id,
        overData: over?.data?.current,
      });

      if (!over) {
        console.log('❌ Drop cancelado - sem alvo');
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
            if (dragData.type === 'canvas-block') {
              const activeIndex = currentStepData.findIndex(
                block => block.id === String(active.id)
              );
              // Se soltar no canvas/canvas-drop-zone, mover para o fim
              if (over.id === 'canvas' || over.id === 'canvas-drop-zone') {
                const targetIndex = currentStepData.length - 1;
                if (activeIndex !== -1 && targetIndex !== -1 && activeIndex !== targetIndex) {
                  actions.reorderBlocks(currentStepKey, activeIndex, targetIndex);
                  notification?.info?.('Bloco movido para o final');
                }
              } else if (typeof over.id === 'string') {
                const overIndex = currentStepData.findIndex(block => block.id === over.id);
                if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
                  actions.reorderBlocks(currentStepKey, activeIndex, overIndex);
                  notification?.info?.('Blocos reordenados');
                }
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
    [actions, currentStepData, currentStepKey, notification]
  );

  /* -------------------------
     Sub-componentes locais
     ------------------------- */

  const StepSidebar: React.FC = () => (
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
                  {hasBlocks && <span className="w-2 h-2 bg-green-500 rounded-full" />}
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
  );

  const ComponentsSidebar: React.FC = () => (
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
  );

  const CanvasArea: React.FC = () => (
    <div className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            {isEditingTitle ? (
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={e => {
                  if (e.key === 'Enter') setIsEditingTitle(false);
                }}
                className="font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none text-lg"
                autoFocus
              />
            ) : (
              <h3
                className="font-semibold text-gray-900 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => setIsEditingTitle(true)}
                title="Clique para editar o título"
              >
                🎯 {customTitle} - Etapa {safeCurrentStep}
              </h3>
            )}
            <p className="text-sm text-gray-600">
              {getStepAnalysis(safeCurrentStep).label}: {getStepAnalysis(safeCurrentStep).desc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={actions.undo}
                disabled={!actions.canUndo}
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
                  } catch {
                    notification?.error?.('Erro ao exportar JSON');
                  }
                }}
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
                        notification?.error?.('Erro ao importar JSON: ' + (error as Error).message);
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

            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
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
        {/* Em modo edição, impedir que o conteúdo real capture eventos de ponteiro */}
        <div className={mode === 'edit' ? 'pointer-events-none select-none' : ''}>
          <QuizRenderer
            mode={mode === 'preview' ? 'preview' : 'editor'}
            onStepChange={handleStepSelect}
            initialStep={safeCurrentStep}
            blocksOverride={currentStepData}
            currentStepOverride={safeCurrentStep}
          />
        </div>

        {mode === 'edit' && (
          <SortableContext
            items={currentStepData.map((b, i) => b.id || `block-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="relative min-h-[600px] w-full">
              {currentStepData.map((block: Block, index: number) => {
                const blockId = block.id || `block-${index}`;
                const isSelected = state.selectedBlockId === blockId;

                // topOffset/height heurístico (pode ser substituído por medidas reais)
                let topOffset = 60 + index * 100;
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
                }

                return (
                  <SortableBlock
                    key={blockId}
                    id={blockId}
                    block={block}
                    isSelected={isSelected}
                    topOffset={topOffset}
                    height={height}
                    sourceStepKey={currentStepKey}
                    onSelect={handleBlockSelect}
                    onMoveUp={() => {
                      const currentIndex = currentStepData.findIndex(b => b.id === blockId);
                      if (currentIndex > 0)
                        actions.reorderBlocks(currentStepKey, currentIndex, currentIndex - 1);
                    }}
                    onMoveDown={() => {
                      const currentIndex = currentStepData.findIndex(b => b.id === blockId);
                      if (currentIndex < currentStepData.length - 1)
                        actions.reorderBlocks(currentStepKey, currentIndex, currentIndex + 1);
                    }}
                    onDuplicate={() => handleBlockDuplicate(blockId)}
                    onDelete={() => handleBlockDelete(blockId)}
                    data-testid={`editor-block-${blockId}`}
                  />
                );
              })}
            </div>
          </SortableContext>
        )}
      </CanvasDropZone>
    </div>
  );

  const PropertiesColumn: React.FC = () => (
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
          <Suspense fallback={<div className="p-6">Carregando painel de propriedades...</div>}>
            <EnhancedUniversalPropertiesPanelFixed
              selectedBlock={selectedBlock}
              onUpdate={handleBlockUpdate}
              onClose={() => actions.setSelectedBlockId(null)}
              onDelete={handleBlockDelete}
            />
          </Suspense>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <div className="text-2xl mb-3">⚙️</div>
            <div className="text-sm font-medium mb-2">Nenhum bloco selecionado</div>
            <div className="text-xs">Clique em um bloco no canvas para ver suas propriedades</div>

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
                  <span className="font-medium">{getStepAnalysis(safeCurrentStep).label}</span>
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
  );

  /* -------------------------
     Render principal
     ------------------------- */
  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={`editor-pro h-screen bg-gray-50 flex ${className}`}>
          <StepSidebar />
          <ComponentsSidebar />
          <CanvasArea />
          <PropertiesColumn />
        </div>
      </DndContext>

      {NotificationContainer ? <NotificationContainer /> : null}
    </>
  );
};

export default EditorPro;
