import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { useNotification } from '@/components/ui/Notification';
import { getBlocksForStep } from '@/config/quizStepsComplete';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { extractDragData, getDragFeedback, logDragEvent, validateDrop } from '@/utils/dragDropUtils';
import { copyToClipboard, createBlockFromComponent, devLog, validateEditorJSON } from '@/utils/editorUtils';
import { closestCenter, DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React, { Suspense, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { useEditor } from './EditorProvider';
import { useTheme } from '@/components/theme-provider';
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import ComponentsSidebar from '@/components/editor/sidebars/ComponentsSidebar';
import { useRenderCount } from '@/hooks/useRenderCount';
import { mark } from '@/utils/perf';

// Removidos estilos de animação/transição globais do editor

// Tipos de ícones padronizados
type IconName =
  | 'note'
  | 'flash'
  | 'doc'
  | 'button'
  | 'target'
  | 'palette'
  | 'chart'
  | 'chat'
  | 'shield'
  | 'rocket'
  | 'sparkle'
  | 'money'
  | 'refresh'
  | 'hourglass'
  | 'confetti'
  | 'question'
  | 'info';

interface ComponentDef {
  type: string;
  name: string;
  icon: IconName;
  category: string;
  description: string;
}

interface StepAnalysis {
  icon: IconName;
  label: string;
  desc: string;
}

// Helper central para renderizar ícones SVG minimalistas e consistentes
function renderIcon(name: IconName, className = 'w-4 h-4') {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
  } as const;

  switch (name) {
    case 'note':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h9l5 5v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6v5h5" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13h6M7 17h10" />
        </svg>
      );
    case 'flash':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'doc':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" strokeWidth={2} />
          <path strokeWidth={2} d="M8 9h8M8 13h8M8 17h8" />
        </svg>
      );
    case 'button':
      return (
        <svg {...common}>
          <rect x="5" y="8" width="14" height="8" rx="4" strokeWidth={2} />
          <circle cx="12" cy="12" r="2" strokeWidth={2} />
        </svg>
      );
    case 'target':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <circle cx="12" cy="12" r="3" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
        </svg>
      );
    case 'palette':
      return (
        <svg {...common}>
          <path strokeWidth={2} d="M12 4a8 8 0 100 16h1a3 3 0 003-3 2 2 0 00-2-2h-2a2 2 0 01-2-2 3 3 0 013-3h1a3 3 0 000-6h-2z" />
          <circle cx="8" cy="9" r="1" strokeWidth={2} />
          <circle cx="9" cy="13" r="1" strokeWidth={2} />
          <circle cx="12" cy="9" r="1" strokeWidth={2} />
          <circle cx="15" cy="11" r="1" strokeWidth={2} />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path strokeWidth={2} d="M4 19h16M7 17V9M12 17V5M17 17v-7" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...common}>
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5" />
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M7 20l3-3h7a3 3 0 003-3V7a3 3 0 00-3-3H7a3 3 0 00-3 3v7a3 3 0 003 3z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z" />
        </svg>
      );
    case 'rocket':
      return (
        <svg {...common}>
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M14 3l7 7-5 1-1 5-7-7 5-1 1-5z" />
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 19l3-3M4 16l4 4" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common}>
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" />
        </svg>
      );
    case 'money':
      return (
        <svg {...common}>
          <rect x="4" y="7" width="16" height="10" rx="2" strokeWidth={2} />
          <circle cx="12" cy="12" r="2.5" strokeWidth={2} />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...common}>
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 1019 5" />
        </svg>
      );
    case 'hourglass':
      return (
        <svg {...common}>
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 4h12M6 20h12M8 6h8l-3 4 3 4H8l3-4-3-4z" />
        </svg>
      );
    case 'confetti':
      return (
        <svg {...common}>
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 20l5-14 6 6-14 8z" />
          <path strokeWidth={2} d="M14 4l1 3M18 6l-2 2M20 10l-3 1" />
        </svg>
      );
    case 'question':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9.5 9a2.5 2.5 0 115 0c0 2-2.5 2-2.5 4" />
          <circle cx="12" cy="17" r=".75" fill="currentColor" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0-8h.01" />
        </svg>
      );
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
  useRenderCount('EditorPro');
  mark('EditorPro:render:start');
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
          <div className="text-red-500 mb-4 flex items-center justify-center">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro de Contexto do Editor</h2>
          <p className="text-gray-600 mb-4">
            O EditorPro deve ser usado dentro de um EditorProvider.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 1019 5"/>
              </svg>
              Recarregar
            </span>
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
  const { schedule } = useOptimizedScheduler();

  useEffect(() => {
    if (state.selectedBlockId) {
      setSelectionPulse(true);
      return schedule('selection-pulse', () => setSelectionPulse(false), 700);
    }
  }, [schedule, state.selectedBlockId]);

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
  const availableComponents = useMemo<ComponentDef[]>(
    () => [
      {
        type: 'quiz-intro-header',
        name: 'Header Quiz',
        icon: 'note',
        category: 'Estrutura',
        description: 'Cabeçalho com título e descrição',
      },
      {
        type: 'options-grid',
        name: 'Grade Opções',
        icon: 'flash',
        category: 'Interação',
        description: 'Grid de opções para questões',
      },
      {
        type: 'form-container',
        name: 'Formulário',
        icon: 'note',
        category: 'Captura',
        description: 'Campo de entrada de dados',
      },
      {
        type: 'text',
        name: 'Texto',
        icon: 'doc',
        category: 'Conteúdo',
        description: 'Bloco de texto simples',
      },
      {
        type: 'button',
        name: 'Botão',
        icon: 'button',
        category: 'Interação',
        description: 'Botão de ação',
      },
      {
        type: 'result-header-inline',
        name: 'Header Resultado',
        icon: 'target',
        category: 'Resultado',
        description: 'Cabeçalho personalizado de resultado',
      },
      {
        type: 'style-card-inline',
        name: 'Card Estilo',
        icon: 'palette',
        category: 'Resultado',
        description: 'Card com características do estilo',
      },
      {
        type: 'secondary-styles',
        name: 'Estilos Secundários',
        icon: 'chart',
        category: 'Resultado',
        description: 'Lista de estilos complementares',
      },
      {
        type: 'testimonials',
        name: 'Depoimentos',
        icon: 'chat',
        category: 'Social Proof',
        description: 'Lista de depoimentos',
      },
      {
        type: 'guarantee',
        name: 'Garantia',
        icon: 'shield',
        category: 'Confiança',
        description: 'Selo de garantia',
      },
      {
        type: 'hero',
        name: 'Hero Section',
        icon: 'rocket',
        category: 'Layout',
        description: 'Seção hero para transições e ofertas',
      },
      {
        type: 'benefits',
        name: 'Benefícios',
        icon: 'sparkle',
        category: 'Vendas',
        description: 'Lista de benefícios do produto',
      },
      {
        type: 'quiz-offer-cta-inline',
        name: 'CTA Oferta',
        icon: 'money',
        category: 'Conversão',
        description: 'Call-to-action para ofertas especiais',
      },
    ],
    []
  );

  const groupedComponents = useMemo(
    () =>
      availableComponents.reduce((acc, c) => {
        if (!acc[c.category]) acc[c.category] = [] as ComponentDef[];
        acc[c.category].push(c);
        return acc;
      }, {} as Record<string, ComponentDef[]>),
    [availableComponents]
  );

  const getStepAnalysis = (step: number): StepAnalysis => {
    if (step === 1) return { icon: 'note', label: 'Captura', desc: 'Nome do usuário' };
    if (step >= 2 && step <= 11)
      return { icon: 'target', label: 'Questão', desc: 'Pontuação de estilo' };
    if (step === 12) return { icon: 'refresh', label: 'Transição', desc: 'Para estratégicas' };
    if (step >= 13 && step <= 18)
      return { icon: 'chart', label: 'Estratégica', desc: 'Tracking sem pontuação' };
    if (step === 19) return { icon: 'hourglass', label: 'Calculando', desc: 'Processamento' };
    if (step === 20) return { icon: 'confetti', label: 'Resultado', desc: 'Estilo personalizado' };
    if (step === 21) return { icon: 'money', label: 'Oferta', desc: 'CTA de conversão' };
    return { icon: 'question', label: 'Indefinida', desc: 'Não mapeada' };
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
     Sub-componentes locais (somente Canvas/Propriedades)
     ------------------------- */

  const CanvasAreaBase: React.FC = () => (
  <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200/60">
        {/* Header Principal */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Seção do Título */}
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                    {renderIcon('target', 'w-5 h-5 text-white')}
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                    {renderIcon('target', 'w-5 h-5 text-white')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1
                      className="font-bold text-xl text-gray-900 cursor-pointer hover:text-blue-600 truncate"
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
              <div className="flex items-center gap-2">
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
              <div className="flex items-center bg-white rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={actions.undo}
                  disabled={!actions.canUndo}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-l-lg',
                    actions.canUndo
                      ? 'text-gray-700'
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
                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-r-lg',
                    actions.canRedo
                      ? 'text-gray-700'
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
              <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
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
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-l-lg"
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
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-r-lg"
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
        <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg"
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
      <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium',
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
                    'flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium',
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
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg"
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
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
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
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
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
                <span className="inline-flex items-center gap-2">
                  {renderIcon('rocket', 'w-4 h-4')}
                  Publicar tudo
                </span>
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
    <div className={cn('flex-1 min-w-0 p-2 overflow-x-hidden', isDragging && 'editor-drop-zone-active')} data-canvas-container>
        <div
      className="customizable-width mx-auto px-2 sm:px-3 md:px-4 w-full max-w-[39rem]"
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
  const CanvasArea = React.memo(CanvasAreaBase);

  const PropertiesColumnBase: React.FC = () => (
  <div className="w-[24rem] min-w-[24rem] max-w-[24rem] flex-shrink-0 h-screen sticky top-0 overflow-y-auto
                    bg-white border-l border-gray-200 flex flex-col">
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
  <div className="h-full p-6 text-sm text-gray-600">
          Selecione um bloco no canvas para editar suas propriedades.
        </div>
      )}
    </div>
  );
  const PropertiesColumn = React.memo(PropertiesColumnBase);

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
          <StepSidebar
            currentStep={safeCurrentStep}
            totalSteps={21}
            stepHasBlocks={stepHasBlocks}
            onSelectStep={handleStepSelect}
            getStepAnalysis={getStepAnalysis as any}
            renderIcon={renderIcon as any}
          />
          <ComponentsSidebar
            groupedComponents={groupedComponents as any}
            renderIcon={renderIcon as any}
          />
          <div className="flex-1 min-w-0 flex">
            <CanvasArea />
            <PropertiesColumn />
          </div>
        </div>
      </DndContext>

      {NotificationContainer ? <NotificationContainer /> : null}
  {mark('EditorPro:render:end')}
    </>
  );
};

export default EditorPro;
