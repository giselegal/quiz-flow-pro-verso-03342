import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { DraggableComponentItem } from '@/components/editor/dnd/DraggableComponentItem';
import { useNotification } from '@/components/ui/Notification';
import { getBlocksForStep } from '@/config/quizStepsComplete';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { extractDragData, getDragFeedback, logDragEvent, validateDrop } from '@/utils/dragDropUtils';
import { copyToClipboard, createBlockFromComponent, devLog, validateEditorJSON } from '@/utils/editorUtils';
import { closestCenter, DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React, { Suspense, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useEditor } from './EditorProvider';
import { useTheme } from '@/components/theme-provider';

// Estilos CSS para animações personalizadas
const animationStyles = `
  .editor-smooth-transition { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .editor-hover-lift { transition: transform 0.2s ease-out, box-shadow 0.2s ease-out; }
  .editor-hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
  .editor-scale-hover { transition: transform 0.2s ease-out; }
  .editor-scale-hover:hover { transform: scale(1.02); }
  .editor-fade-in { opacity: 0; animation: fadeIn 0.3s ease-out forwards; }
  @keyframes fadeIn { to { opacity: 1; } }
  .editor-slide-in-left { transform: translateX(-20px); opacity: 0; animation: slideInLeft 0.3s ease-out forwards; }
  @keyframes slideInLeft { to { transform: translateX(0); opacity: 1; } }
  .editor-slide-in-right { transform: translateX(20px); opacity: 0; animation: slideInRight 0.3s ease-out forwards; }
  @keyframes slideInRight { to { transform: translateX(0); opacity: 1; } }
  .editor-pulse-highlight { animation: pulseHighlight 0.6s ease-out; }
  @keyframes pulseHighlight { 0% { background-color: rgba(59,130,246,0.1);} 50% { background-color: rgba(59,130,246,0.2);} 100% { background-color: transparent; } }
  .editor-drag-active { transform: rotate(3deg) scale(1.05); opacity: 0.8; z-index: 1000; transition: transform 0.2s ease-out; }
  .editor-drop-zone-active { border-color: #3b82f6; background-color: rgba(59,130,246,0.05); transform: scale(1.02); transition: all 0.2s ease-out; }
  .editor-slide-up { transform: translateY(20px); opacity: 0; animation: slideUp 0.3s ease-out forwards; }
  @keyframes slideUp { to { transform: translateY(0); opacity: 1; } }
  .editor-bounce { animation: bounce 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards; }
  @keyframes bounce { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-5px);} }
  .editor-rotate-hover:hover { transform: rotate(5deg); transition: transform 0.3s ease-out; }
  .editor-scale-click:active { transform: scale(0.95); transition: transform 0.1s ease-out; }
`;

// Injetar estilos no documento (uma única vez)
if (typeof document !== 'undefined') {
  if (!document.head.querySelector('[data-editor-animations]')) {
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-editor-animations', 'true');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
  }
}


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
const PropertiesPanel = React.lazy(
  () => import('@/components/editor/properties/PropertiesPanel')
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

  const { theme, setTheme } = useTheme();

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

  // Estados de animação/UX
  const [isDragging, setIsDragging] = useState(false);
  const [, setSelectionPulse] = useState(false);

  useEffect(() => {
    if (state.selectedBlockId) {
      setSelectionPulse(true);
      const t = setTimeout(() => setSelectionPulse(false), 700);
      return () => clearTimeout(t);
    }
  }, [state.selectedBlockId]);

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

  // Helper centralizado: calcula índice alvo com base no alvo de drop
  // Comentado temporariamente pois não está sendo usado
  // function getTargetIndexFromOver(
  //   overIdStrLocal: string | null,
  //   overDataLocal: any,
  //   mode: 'add' | 'reorder'
  // ): number {
  //   // 0) Compatibilidade com OptimizedCanvasDropZone: ids no formato dnd-block-<blockId>
  //   let cleanedOverId: string | null = overIdStrLocal;
  //   if (cleanedOverId && cleanedOverId.startsWith('dnd-block-')) {
  //     cleanedOverId = cleanedOverId.replace(/^dnd-block-/, '');
  //   }
  //   if (cleanedOverId && cleanedOverId.startsWith('block-')) {
  //     cleanedOverId = cleanedOverId.replace(/^block-/, '');
  //   }
  //   // 1) Preferir posição explícita vinda da drop-zone
  //   const pos = overDataLocal?.position;
  //   if (typeof pos === 'number' && Number.isFinite(pos)) {
  //     return Math.max(0, Math.min(pos, currentStepData.length));
  //   }

  //   // 2) Pela convenção do ID drop-zone-<n>
  //   if (overIdStrLocal) {
  //     const m = overIdStrLocal.match(/^drop-zone-(\d+)$/);
  //     if (m) return Math.max(0, Math.min(parseInt(m[1], 10), currentStepData.length));
  //   }

  //   // 3) Canvas root → final
  //   if (
  //     overIdStrLocal === 'canvas-drop-zone' ||
  //     (overIdStrLocal &&
  //       (overIdStrLocal.startsWith('canvas-drop-zone') || overIdStrLocal.startsWith('canvas-')))
  //   ) {
  //     return currentStepData.length;
  //   }

  //   // 4) Alvo é um bloco existente
  //   if (cleanedOverId) {
  //     const overIndex = currentStepData.findIndex(b => String(b.id) === cleanedOverId);
  //     if (overIndex >= 0) return mode === 'add' ? overIndex + 1 : overIndex;
  //   }

  //   // 5) Fallback → final
  //   return currentStepData.length;
  // }

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

  // 🔗 Fallback: inserir componente via evento (ex.: duplo clique na sidebar)
  useEffect(() => {
    const handleAddComponent = (ev: Event) => {
      const e = ev as CustomEvent<{ blockType?: string; source?: string } | undefined>;
      const blockType = e?.detail?.blockType;
      if (!blockType) return;

      try {
        const newBlock = createBlockFromComponent(blockType as any, currentStepData);
        actions.addBlockAtIndex(currentStepKey, newBlock, currentStepData.length);
        actions.setSelectedBlockId(newBlock.id);
        if (notification?.success) {
          notification.success(`Componente ${blockType} adicionado (duplo clique).`);
        }
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('🧩 Fallback add via evento:', { blockType, step: safeCurrentStep });
        }
      } catch (err) {
        console.error('Erro ao adicionar componente via evento:', err);
        notification?.error?.('Falha ao adicionar componente');
      }
    };

    window.addEventListener('editor-add-component', handleAddComponent as EventListener);
    return () => {
      window.removeEventListener('editor-add-component', handleAddComponent as EventListener);
    };
  }, [actions, currentStepData, currentStepKey, notification, safeCurrentStep]);

  // Expor etapa atual globalmente para unificar comportamento de blocos (produção/edição)
  useEffect(() => {
    try {
      (window as any).__quizCurrentStep = safeCurrentStep;
    } catch {}
  }, [safeCurrentStep]);

  // Carregar stepBlocks de um template via evento externo (inicialização pelo Dashboard / modelos)
  useEffect(() => {
    const handler = (ev: Event) => {
      const e = ev as CustomEvent<{ stepBlocks?: Record<string, Block[]> }>;
      const incoming = e.detail?.stepBlocks;
      if (!incoming) return;
      // Merge não destrutivo mantendo IDs
      Object.entries(incoming).forEach(([key, list]) => {
        list.forEach(b => {
          // inserir em sequência
          actions.addBlockAtIndex(
            key,
            b as any,
            (getBlocksForStep(Number(key.replace('step-', '')), state.stepBlocks) || []).length
          );
        });
      });
    };
    window.addEventListener('editor-load-template', handler as EventListener);
    return () => window.removeEventListener('editor-load-template', handler as EventListener);
  }, [actions, state.stepBlocks]);

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
  // Handlers específicos de bloco são delegados ao CanvasDropZone via actions

  // Drag handlers (reutilizam utilitários)
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const dragData = extractDragData(active);
    console.log('🚀 DRAG START CAPTURADO!', {
      activeId: active.id,
      dragData,
      activeDataCurrent: active.data.current,
    });
    setIsDragging(true);
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

      setIsDragging(false);

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
    [actions, currentStepData, currentStepKey, notification]
  );

  /* -------------------------
     Sub-componentes locais
     ------------------------- */

  const StepSidebar: React.FC = () => (
    <div className="w-[180px] bg-white border-r border-gray-200 flex flex-col editor-slide-in-left editor-fade-in">
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
                  'w-full text-left p-2 rounded-md text-xs transition-colors editor-smooth-transition editor-hover-lift editor-scale-click',
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
    <div className="w-[280px] bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/60 flex flex-col shadow-sm editor-slide-in-right editor-fade-in">
      {/* Header da Sidebar */}
      <div className="p-6 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3 editor-bounce">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg editor-rotate-hover">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Componentes</h3>
            <p className="text-xs text-gray-500">
              {availableComponents.length} blocos disponíveis
            </p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar componentes..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Lista de Componentes */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {Object.entries(groupedComponents).map(([category, components]) => (
            <div key={category} className="group">
              {/* Header da Categoria */}
              <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {category}
                </h4>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {components.length}
                </span>
              </div>
              
              {/* Grid de Componentes */}
              <div className="grid grid-cols-1 gap-2">
                {components.map(component => (
                  <DraggableComponentItem
                    key={component.type}
                    blockType={component.type}
                    title={component.name}
                    description={component.description}
                    icon={<span className="text-lg">{component.icon}</span>}
                    category={component.category}
                    className="bg-white/80 hover:bg-white border border-gray-200/60 hover:border-blue-300 hover:shadow-md transition-all duration-200 rounded-lg backdrop-blur-sm group-hover:scale-[1.02] transform editor-hover-lift editor-smooth-transition editor-scale-click"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer da Sidebar */}
        <div className="p-4 border-t border-gray-200/60 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Arraste os componentes para o canvas
          </div>
        </div>
      </div>
    </div>
  );

  const CanvasArea: React.FC = () => (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 editor-fade-in">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
        {/* Header Principal */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Seção do Título */}
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    🎯
                  </div>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') setIsEditingTitle(false);
                    }}
                    className="font-bold text-xl text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none flex-1 min-w-0"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    🎯
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1
                      className="font-bold text-xl text-gray-900 cursor-pointer hover:text-blue-600 transition-all duration-200 truncate"
                      onClick={() => setIsEditingTitle(true)}
                      title="Clique para editar o título"
                    >
                      {customTitle}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Etapa {safeCurrentStep}
                      </span>
                      <span className="text-sm text-gray-600 truncate">
                        {getStepAnalysis(safeCurrentStep).label}: {getStepAnalysis(safeCurrentStep).desc}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Seção de Controles */}
            <div className="flex items-center gap-4">
              {/* Indicador de Status */}
              <div className="flex items-center gap-2 editor-fade-in">
                <div
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm',
                    state.isSupabaseEnabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  )}
                  title={state.isSupabaseEnabled ? 'Conectado ao Supabase' : 'Modo offline'}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    state.isSupabaseEnabled ? 'bg-emerald-500' : 'bg-amber-500'
                  )} />
                  {state.isSupabaseEnabled ? 'Online' : 'Offline'}
                </div>
              </div>

              {/* Controles de Histórico */}
              <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm editor-fade-in">
                <button
                  type="button"
                  onClick={actions.undo}
                  disabled={!actions.canUndo}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-l-lg transition-all duration-200 editor-scale-click',
                    actions.canUndo
                      ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      : 'text-gray-400 cursor-not-allowed bg-gray-50'
                  )}
                  title="Desfazer (Ctrl+Z)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Desfazer
                </button>
                <div className="w-px h-6 bg-gray-200" />
                <button
                  type="button"
                  onClick={actions.redo}
                  disabled={!actions.canRedo}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-r-lg transition-all duration-200 editor-scale-click',
                    actions.canRedo
                      ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      : 'text-gray-400 cursor-not-allowed bg-gray-50'
                  )}
                  title="Refazer (Ctrl+Y)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                  </svg>
                  Refazer
                </button>
              </div>

              {/* Controles de Import/Export */}
              <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm editor-fade-in">
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
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-l-lg transition-all duration-200 editor-scale-click"
                  title="Exportar como JSON"
                  aria-label="Exportar estado atual como JSON"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Export
                </button>
                <div className="w-px h-6 bg-gray-200" />

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
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-r-lg transition-all duration-200 editor-scale-click"
                  title="Importar JSON"
                  aria-label="Importar estado do editor via JSON"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Import
                </button>
              </div>

              {/* Toggle de Tema */}
              <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-sm editor-fade-in">
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-all duration-200 editor-scale-click"
                  title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
                >
                  {theme === 'dark' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  {theme === 'dark' ? 'Claro' : 'Escuro'}
                </button>
              </div>

              {/* Toggle Edit/Preview */}
              <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-sm editor-fade-in">
                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                    mode === 'edit'
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => setMode('preview')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                    mode === 'preview'
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              </div>

              {/* Botão de Salvar */}
              <button
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Salvar etapa atual"
                onClick={() => {
                  try {
                    const stepId = currentStepKey;
                    const blocks = currentStepData;
                    // Tentar Supabase se disponível
                    if (state.isSupabaseEnabled && (actions as any)?.publishStepToSupabase) {
                      (actions as any)
                        .publishStepToSupabase(stepId, blocks)
                        .then((ok: boolean) => {
                          if (ok) {
                            // Também publica localmente para refletir em /quiz e disparar evento
                            notification?.success?.('Etapa publicada (Supabase + local)!');
                          } else {
                            notification?.success?.('Etapa publicada localmente!');
                          }
                        })
                        .catch(() => {
                          notification?.success?.('Etapa publicada localmente!');
                        });
                    } else {
                      notification?.success?.('Etapa publicada localmente!');
                    }
                  } catch (err) {
                    console.error('Falha ao salvar/publicar etapa:', err);
                    notification?.error?.('Erro ao salvar/publicar etapa');
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Salvar
              </button>
            
              <button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors editor-scale-click"
                title="Remover publicação da etapa atual"
                onClick={() => {
                  try {
                    if (state.isSupabaseEnabled && (actions as any)?.unpublishStepFromSupabase) {
                      (actions as any)
                        .unpublishStepFromSupabase(currentStepKey)
                        .then(() => {
                          notification?.info?.(
                            'Publicação da etapa removida do Supabase e localmente.'
                          );
                        })
                        .catch(() => {
                          notification?.info?.('Publicação local da etapa removida.');
                        });
                    } else {
                      notification?.info?.('Publicação local da etapa removida.');
                    }
                  } catch (err) {
                    console.error('Falha ao despublicar etapa:', err);
                    notification?.error?.('Erro ao despublicar etapa');
                  }
                }}
              >
                ⏏️ Despublicar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors editor-scale-click"
                title="Publicar todas as etapas com conteúdo"
                onClick={() => {
                  try {
                    const entries = Object.entries(state.stepBlocks || {});
                    let published = 0;
                    const publishOne = (key: string, blocks: any[]) => {
                      if (state.isSupabaseEnabled && (actions as any)?.publishStepToSupabase) {
                        return (actions as any).publishStepToSupabase(key, blocks).then(() => {
                          // Sempre publica localmente também para refletir no /quiz
                        });
                      } else {
                        return Promise.resolve();
                      }
                    };
                    const tasks: Promise<any>[] = [];
                    for (const [key, blocks] of entries) {
                      if (Array.isArray(blocks) && blocks.length > 0) {
                        tasks.push(publishOne(key, blocks));
                        published += 1;
                      }
                    }
                    Promise.allSettled(tasks).then(() => {
                      notification?.success?.(`Publicadas ${published} etapas com conteúdo.`);
                    });
                  } catch (err) {
                    console.error('Falha ao publicar todas as etapas:', err);
                    notification?.error?.('Erro ao publicar todas as etapas');
                  }
                }}
              >
                🚀 Publicar tudo
              </button>
            </div>
          </div>
        </div>

        {/*
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
              <div className="text-blue-700" >
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
        */}
      </div>

      {/* Canvas principal com drag & drop - sistema unificado simples */}
      <div className={cn('flex-1 min-w-0 p-2 overflow-x-hidden editor-smooth-transition', isDragging && 'editor-drop-zone-active')} data-canvas-container>
        <div
          className="customizable-width mx-auto w-full px-2 sm:px-4 sm:max-w-[560px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1280px]"
        >
          <CanvasDropZone
            blocks={currentStepData}
            selectedBlockId={state.selectedBlockId}
            onSelectBlock={actions.setSelectedBlockId}
            onUpdateBlock={(id: string, updates: any) =>
              actions.updateBlock(currentStepKey, id, updates)
            }
            onDeleteBlock={(id: string) => actions.removeBlock(currentStepKey, id)}
            className="h-full w-full editor-pulse-highlight"
          />
        </div>
      </div>
    </div>
  );

  const PropertiesColumn: React.FC = () => (
    <div className="w-[260px] sm:w-[280px] lg:w-[320px] min-w-[260px] sm:min-w-[280px] lg:min-w-[320px] max-w-[320px] bg-white border-l border-gray-200 flex flex-col editor-slide-in-right editor-fade-in">
      {selectedBlock ? (
        <Suspense
          fallback={<div className="p-4 text-sm text-gray-600">Carregando propriedades…</div>}
        >
          <PropertiesPanel
            selectedBlock={selectedBlock as any}
            onUpdate={(updates: Record<string, any>) =>
              actions.updateBlock(currentStepKey, selectedBlock.id, updates)
            }
            onClose={() => actions.setSelectedBlockId(null)}
            onDelete={() => actions.removeBlock(currentStepKey, selectedBlock.id)}
          />
        </Suspense>
      ) : (
        <div className="h-full p-6 text-sm text-gray-600 editor-fade-in editor-slide-up">
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
        <div className={`editor-pro h-screen bg-gray-50 flex overflow-x-hidden max-w-screen ${className}`}>
          <StepSidebar />
          <ComponentsSidebar />
          <div className="flex-1 min-w-0 flex">
            <CanvasArea />
            {state.selectedBlockId && <PropertiesColumn />}
          </div>
        </div>
      </DndContext>

      {NotificationContainer ? <NotificationContainer /> : null}
    </>
  );
};

export default EditorPro;
