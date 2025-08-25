import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  validateEditorJSON,
} from '../../utils/editorUtils';
import { useNotification } from '../ui/Notification';
import { CanvasDropZone } from './canvas/CanvasDropZone.simple';
import { DraggableComponentItem } from './dnd/DraggableComponentItem';
import { useEditor } from './EditorProvider';
// import { SortableBlock } from './SortableBlock';

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
  const [viewport, setViewport] = useState<'full' | 'sm' | 'md' | 'lg'>('full');
  const viewportWidth = useMemo(() => {
    switch (viewport) {
      case 'sm':
        return 375;
      case 'md':
        return 768;
      case 'lg':
        return 1024;
      default:
        return '100%';
    }
  }, [viewport]);
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
    // Para itens da sidebar, priorize pointerWithin para "enxergar" o canvas e zonas grandes
    try {
      const activeType = extractDragData(args?.active)?.type;
      if (activeType === 'sidebar-component') {
        const pointerCollisions = pointerWithin(args);
        if (pointerCollisions && pointerCollisions.length > 0) return pointerCollisions;
        // fallback seguro
        return closestCenter(args);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.debug('collisionDetection (sidebar) erro:', err);
      }
    }

    // Para reordenação de blocos do canvas, mantenha estratégia mais precisa
    try {
      const collisions = rectIntersection(args);
      if (collisions && collisions.length > 0) return collisions;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.debug('rectIntersection erro:', err);
      }
    }

    try {
      const pointerCollisions = pointerWithin(args);
      if (pointerCollisions && pointerCollisions.length > 0) return pointerCollisions;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.debug('pointerWithin erro:', err);
      }
    }

    return closestCenter(args);
  }, []);

  // 🔗 Escutar eventos de navegação disparados pelos blocos (ex.: botão da etapa 1)
  useEffect(() => {
    const parseStepNumber = (stepId: unknown): number | null => {
      if (typeof stepId === 'number') return stepId;
      if (typeof stepId !== 'string') return null;
      const digits = stepId.replace(/[^0-9]/g, '');
      const num = parseInt(digits || stepId, 10);
      return Number.isFinite(num) ? num : null;
    };

    const handleNavigate = (ev: Event) => {
      const e = ev as CustomEvent<{ stepId?: string | number; source?: string }>;
      const target = parseStepNumber(e.detail?.stepId);
      if (!target || target < 1 || target > 21) return;
      actions.setCurrentStep(target);
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          '➡️ EditorPro: navegação por evento',
          e.detail?.stepId,
          '→',
          target,
          'origem:',
          e.detail?.source
        );
      }
    };

    window.addEventListener('navigate-to-step', handleNavigate as EventListener);
    window.addEventListener('quiz-navigate-to-step', handleNavigate as EventListener);
    return () => {
      window.removeEventListener('navigate-to-step', handleNavigate as EventListener);
      window.removeEventListener('quiz-navigate-to-step', handleNavigate as EventListener);
    };
  }, [actions]);

  // Expor etapa atual globalmente para unificar comportamento de blocos (produção/edição)
  useEffect(() => {
    try {
      (window as any).__quizCurrentStep = safeCurrentStep;
    } catch {}
  }, [safeCurrentStep]);

  // Desabilitar auto-scroll e sincronização de scroll enquanto o editor estiver montado
  useEffect(() => {
    try {
      (window as any).__DISABLE_AUTO_SCROLL = true;
      (window as any).__DISABLE_SCROLL_SYNC = true;
    } catch {}

    return () => {
      try {
        (window as any).__DISABLE_AUTO_SCROLL = false;
        (window as any).__DISABLE_SCROLL_SYNC = false;
      } catch {}
    };
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

  // Duplicação inline é gerenciada no wrapper simples quando necessário

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
      const activeIdStr = active?.id != null ? String(active.id) : null;
      const overIdStr = over?.id != null ? String(over.id) : null;
  const activeData = (active as any)?.data?.current;
  const overData = (over as any)?.data?.current;
  console.groupCollapsed('🎯 DRAG END DEBUG');
  console.log('active.id:', activeIdStr);
  console.log('active.data.current:', activeData);
  console.log('over.id:', overIdStr);
  console.log('over.data.current:', overData);

      if (!over) {
        console.warn('❌ Drop cancelado - sem alvo');
        const dragData = extractDragData(active);
        const feedback = getDragFeedback(dragData, {
          isValid: false,
          message: 'Sem alvo de drop',
        } as any);
        notification?.warning?.(feedback.message);
        console.groupEnd();
        return;
      }

      const validation = validateDrop(active, over, currentStepData);
      console.log('validateDrop →', validation);
      logDragEvent('end', active, over, validation);

      if (!validation.isValid) {
        const feedback = getDragFeedback(extractDragData(active), validation);
        notification?.warning?.(feedback.message);
        console.groupEnd();
        return;
      }

      const dragData = extractDragData(active);
      if (!dragData) {
        notification?.error?.('Dados de drag corrompidos');
        console.groupEnd();
        return;
      }

      try {
        switch (validation.action) {
          case 'add':
            if (dragData.type === 'sidebar-component' && dragData.blockType) {
              const newBlock = createBlockFromComponent(dragData.blockType as any, currentStepData);
              // Inserção precisa por posição quando drop-zone-<n>
              let targetIndex = currentStepData.length;
              if (overIdStr) {
                const m = overIdStr.match(/^drop-zone-(\d+)$/);
                if (m)
                  targetIndex = Math.max(0, Math.min(parseInt(m[1], 10), currentStepData.length));
                else if (overIdStr === 'canvas-drop-zone') targetIndex = currentStepData.length;
                else {
                  // Se soltou sobre um bloco, inserir antes dele
                  const overIndex = currentStepData.findIndex(b => String(b.id) === overIdStr);
                  if (overIndex >= 0) targetIndex = overIndex;
                }
              } else if (currentStepData.length === 0) {
                // Canvas vazio: inserir no índice 0
                targetIndex = 0;
              }
              actions.addBlockAtIndex(currentStepKey, newBlock, targetIndex);
              actions.setSelectedBlockId(newBlock.id);
              notification?.success?.(
                `Componente ${dragData.blockType} adicionado na posição ${targetIndex}!`
              );
            }
            break;
          case 'reorder':
            if (dragData.type === 'canvas-block') {
              const activeIndex = currentStepData.findIndex(
                block => String(block.id) === activeIdStr
              );
              if (activeIndex === -1) break;

              let targetIndex = activeIndex;
              if (overIdStr === 'canvas-drop-zone') {
                targetIndex = currentStepData.length - 1;
              } else if (overIdStr) {
                const m = overIdStr.match(/^drop-zone-(\d+)$/);
                if (m) {
                  targetIndex = Math.max(
                    0,
                    Math.min(parseInt(m[1], 10), currentStepData.length - 1)
                  );
                } else {
                  const overIndex = currentStepData.findIndex(
                    block => String(block.id) === overIdStr
                  );
                  if (overIndex !== -1) targetIndex = overIndex;
                }
              }

              if (activeIndex !== targetIndex) {
                actions.reorderBlocks(currentStepKey, activeIndex, targetIndex);
                notification?.info?.(`Bloco movido para a posição ${targetIndex}`);
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
      } finally {
        console.groupEnd();
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
    <div className="flex-1 flex flex-col bg-gray-100 min-h-0">
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

            {/* Alternância de modo removida: somente preview */}

            {/* Seletor de viewport responsivo */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewport('sm')}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                  viewport === 'sm'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
                title="Mobile (375px)"
              >
                📱 375
              </button>
              <button
                type="button"
                onClick={() => setViewport('md')}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                  viewport === 'md'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
                title="Tablet (768px)"
              >
                📟 768
              </button>
              <button
                type="button"
                onClick={() => setViewport('lg')}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                  viewport === 'lg'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
                title="Desktop (1024px)"
              >
                🖥️ 1024
              </button>
              <button
                type="button"
                onClick={() => setViewport('full')}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                  viewport === 'full'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
                title="Largura total"
              >
                🧭 Full
              </button>
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
              💾 Salvar
            </button>
          </div>
        </div>

        {/* Banner de modo removido */}
      </div>

      {/* Área scrollável do canvas */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full">
          <div
            className="mx-auto transition-all editor-pro-canvas"
            style={{ width: viewportWidth as number | string, maxWidth: '100%' }}
          >
            <div
              className={cn('rounded-xl shadow-sm', viewport !== 'full' && 'border bg-white p-4')}
            >
              <CanvasDropZone
                blocks={currentStepData}
                selectedBlockId={state.selectedBlockId}
                onSelectBlock={(id: string) => actions.setSelectedBlockId(id)}
                onUpdateBlock={(id: string, updates: any) =>
                  actions.updateBlock(currentStepKey, id, updates)
                }
                onDeleteBlock={(id: string) => actions.removeBlock(currentStepKey, id)}
              />
            </div>
            <div className="text-xs mt-2 px-2">
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
                  <span className="font-medium">{getStepAnalysis(safeCurrentStep).label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Função:</span>
                  <span className="font-medium">{getStepAnalysis(safeCurrentStep).desc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Coluna de propriedades (direita)
  const PropertiesColumn: React.FC = () => (
    <div className="w-[360px] min-w-[300px] bg-white border-l border-gray-200 flex flex-col">
      {selectedBlock ? (
        <Suspense
          fallback={<div className="p-4 text-sm text-gray-600">Carregando propriedades…</div>}
        >
          <EnhancedUniversalPropertiesPanelFixed
            selectedBlock={selectedBlock as any}
            onUpdate={(blockId: string, updates: Record<string, any>) =>
              actions.updateBlock(currentStepKey, blockId, updates)
            }
            onClose={() => actions.setSelectedBlockId(null)}
            onDelete={(blockId: string) => actions.removeBlock(currentStepKey, blockId)}
          />
        </Suspense>
      ) : (
        <div className="h-full p-6 text-sm text-gray-600">
          Selecione um bloco no canvas para editar suas propriedades.
        </div>
      )}
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
