import React, { useCallback, useMemo, useRef, useState, useEffect, Suspense } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
// import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useNotification } from '@/components/ui/Notification';
import { Block } from '@/types/editor';
import { extractDragData, getDragFeedback, logDragEvent, validateDrop } from '@/utils/dragDropUtils';
import { createBlockFromComponent, devLog } from '@/utils/editorUtils';
import { getBlocksForStep } from '@/config/quizStepsComplete';
// import { cn } from '@/lib/utils';
import { useEditor } from './EditorProvider';
import { useRenderCount } from '@/hooks/useRenderCount';
import { mark } from '@/utils/perf';
// import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { StepDndProvider } from '@/components/editor/dnd/StepDndProvider';
import CanvasAreaLayout from '@/components/editor/layouts/CanvasArea';
import { run21StepDiagnostic } from '@/diagnostic/21StepEditorDiagnostic';
import { runCompleteDiagnostics } from '@/utils/editorDiagnostics';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';
import { useCentralizedStepValidation } from '@/hooks/useCentralizedStepValidation';
import { validateStep } from '@/utils/stepValidationRegistry';
import { calculateAndSaveQuizResult } from '@/utils/quizResultCalculator';

// Lazy modules para reduzir TTI do editor (Canvas usa o LazyQuizRenderer internamente)
// const LazyQuizRenderer = React.lazy(() =>
//   import('@/components/core/QuizRenderer').then(mod => ({ default: mod.QuizRenderer }))
// );
const StepSidebar = React.lazy(() => import('@/components/editor/sidebars/StepSidebar'));
const ComponentsSidebar = React.lazy(() => import('@/components/editor/sidebars/ComponentsSidebar'));
const PropertiesColumn = React.lazy(() => import('@/components/editor/properties/PropertiesColumn'));

// Lazy loading dos componentes pesados (mantidos em arquivo modular index.tsx)

// Removidos estilos de animação/transição globais do editor

// Tipos de ícones padronizados
import { availableComponents as AVAILABLE_COMPONENTS_CONFIG, type IconName, type ComponentDef } from '@/components/editor/config/availableComponents';

// Tipos de componentes disponíveis vêm da config

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

// PropertiesPanel lazy está encapsulado em PropertiesColumn

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

  // Tema manipulado dentro do CanvasAreaLayout quando necessário
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Desativa qualquer auto-scroll dentro do /editor (edição e preview)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location?.pathname || '';
    if (!path.includes('/editor')) return;

    const g: any = window as any;
    g.__DISABLE_AUTO_SCROLL = true;
    // Também desabilita sincronização de scroll entre colunas para evitar "puxões" no canvas
    g.__DISABLE_SCROLL_SYNC = true;

    const originalScrollTo = window.scrollTo?.bind(window);
    const originalScrollIntoView = (Element.prototype as any).scrollIntoView?.bind(Element.prototype);

    try {
      // No-op para qualquer tentativa de scroll programático
      window.scrollTo = ((..._args: any[]) => { }) as any;
      (Element.prototype as any).scrollIntoView = ((..._args: any[]) => { }) as any;
    } catch { }

    return () => {
      try {
        g.__DISABLE_AUTO_SCROLL = false;
        g.__DISABLE_SCROLL_SYNC = false;
        if (originalScrollTo) window.scrollTo = originalScrollTo as any;
        if (originalScrollIntoView) (Element.prototype as any).scrollIntoView = originalScrollIntoView as any;
      } catch { }
    };
  }, []);

  // Atalhos de teclado: Undo/Redo (Ctrl/Cmd + Z/Y)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isUndo = (e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z');
      const isRedo = (e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y');
      if (isUndo) {
        e.preventDefault();
        try { (editorContext as any)?.actions?.undo?.(); } catch { }
        return;
      }
      if (isRedo) {
        e.preventDefault();
        try { (editorContext as any)?.actions?.redo?.(); } catch { }
      }
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true } as any);
  }, [editorContext]);

  // Auto-scroll: desativado no Editor (edição e preview). Mantido apenas fora do editor (produção).
  useEffect(() => {
    const selId = (editorContext as any)?.state?.selectedBlockId as string | null;
    if (!selId) return;
    if (typeof window !== 'undefined') {
      const p = window.location?.pathname || '';
      if (p.includes('/editor') || p.includes('/preview')) return; // não autoscroll no editor
    }
    const root = containerRef.current || document.querySelector('[data-canvas-container]');
    if (!root) return;
    const target =
      (root as HTMLElement).querySelector(`[data-block-id="${selId}"]`) ||
      (root as HTMLElement).querySelector(`#dnd-block-${selId}`) ||
      (root as HTMLElement).querySelector(`#${selId}`);
    if (target && typeof (target as any).scrollIntoView === 'function') {
      try {
        (target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch { }
    }
  }, [(editorContext as any)?.state?.selectedBlockId]);

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 1019 5" />
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
  const notification = useNotification();
  const NotificationContainer = (notification as any)?.NotificationContainer ?? null;

  const safeCurrentStep = state.currentStep || 1;
  const currentStepKey = `step-${safeCurrentStep}`;

  // Estados de animação/UX
  const [isDragging, setIsDragging] = useState(false);
  // const { schedule } = useOptimizedScheduler(); // desativado com a remoção do efeito de pulse

  // Centralized state management via useOptimizedScheduler
  // Removido: efeito de "pulse" na seleção que causava flicker visual
  // useEffect(() => {
  //   if (state.selectedBlockId) {
  //     return schedule('selection-pulse', () => {
  //       // Selection pulse effect handled internally
  //     }, 700);
  //   }
  // }, [schedule, state.selectedBlockId]);

  const currentStepData = useMemo(
    () => getBlocksForStep(safeCurrentStep, state.stepBlocks) || [],
    [safeCurrentStep, state.stepBlocks]
  );

  const stepHasBlocks = useMemo(() => {
    // 🔍 INVESTIGAÇÃO #4: Enhanced step calculation validation
    const map: Record<number, boolean> = {};
    const diagnosticInfo = {
      timestamp: new Date().toISOString(),
      totalStepBlocksKeys: state.stepBlocks ? Object.keys(state.stepBlocks).length : 0,
      stepBlocksKeys: state.stepBlocks ? Object.keys(state.stepBlocks).slice(0, 10) : [], // Limit for logging
      stepsWithBlocks: [] as number[],
      stepsWithoutBlocks: [] as number[]
    };

    for (let i = 1; i <= 21; i++) {
      const blocks = getBlocksForStep(i, state.stepBlocks) || [];
      const hasBlocks = blocks.length > 0;
      map[i] = hasBlocks;

      if (hasBlocks) {
        diagnosticInfo.stepsWithBlocks.push(i);
      } else {
        diagnosticInfo.stepsWithoutBlocks.push(i);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 stepHasBlocks calculation:', {
        ...diagnosticInfo,
        totalStepsWithBlocks: diagnosticInfo.stepsWithBlocks.length,
        totalStepsWithoutBlocks: diagnosticInfo.stepsWithoutBlocks.length,
        mandatoryStepsEmpty: diagnosticInfo.stepsWithoutBlocks.filter(step => step <= 10), // First 10 should typically have content
        finalStepsEmpty: diagnosticInfo.stepsWithoutBlocks.filter(step => step >= 19) // Final steps (19-21)
      });

      // Add to window for debugging
      window.__EDITOR_STEP_ANALYSIS__ = {
        ...diagnosticInfo,
        stepHasBlocksMap: map
      };
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

  // Centralizar a validação por etapa (em paralelo às heurísticas existentes)
  useCentralizedStepValidation({
    currentStep: safeCurrentStep,
    stepBlocks: state.stepBlocks as any,
    setStepValid: actions.setStepValid,
  });

  // Calcular resultado automaticamente ao entrar nas etapas 19/20
  const lastComputedStepRef = useRef<number | null>(null);
  useEffect(() => {
    const shouldCompute = safeCurrentStep === 19 || safeCurrentStep === 20;
    if (!shouldCompute) return;
    if (lastComputedStepRef.current === safeCurrentStep) return;

    lastComputedStepRef.current = safeCurrentStep;

    (async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('🧮 Calculando resultado do quiz (auto) para etapa', safeCurrentStep);
        }
        await calculateAndSaveQuizResult();
        // Forçar refresh de consumidores que escutam diferentes eventos
        try { window.dispatchEvent(new Event('quiz-result-refresh')); } catch { }
      } catch (err) {
        console.error('Falha ao calcular resultado automaticamente:', err);
      }
    })();
  }, [safeCurrentStep]);

  // DnD Context é fornecido pelo StepDndProvider com sensores e colisão otimizados por etapa
  // Helper centralizado: calcula índice alvo com base no alvo de drop
  // Comentado temporariamente pois não está sendo usado
  // function getTargetIndexFromOver(
  //   overIdStrLocal: string | null,
  //   overDataLocal: any,
  //   mode: 'add' | 'reorder'

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
      // 🔍 INVESTIGAÇÃO #6: Enhanced event logging for race conditions
      const e = ev as CustomEvent<{ step?: string | number; stepId?: string | number; stepKey?: string; source?: string }>;
      const raw = e.detail?.stepId ?? e.detail?.step;
      const target = parseStepNumber(raw);

      const eventInfo = {
        timestamp: new Date().toISOString(),
        eventType: ev.type,
        rawStepId: raw,
        stepKey: e.detail?.stepKey,
        parsedTarget: target,
        currentStep: state.currentStep,
        source: e.detail?.source,
        isValidTarget: target !== null && target >= 1 && target <= 21,
        hasPayload: !!e.detail,
        payloadKeys: e.detail ? Object.keys(e.detail) : []
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Navigation event received:', eventInfo);
      }

      if (!target || target < 1 || target > 21) {
        console.warn('❌ INVESTIGAÇÃO #6: Invalid navigation target:', eventInfo);

        // Add to window for debugging
        window.__EDITOR_INVALID_NAVIGATION__ = window.__EDITOR_INVALID_NAVIGATION__ || [];
        window.__EDITOR_INVALID_NAVIGATION__.push(eventInfo);
        return;
      }

      // Check for potential race condition
      if (Math.abs(target - state.currentStep) > 1) {
        console.log('⚠️  INVESTIGAÇÃO #6: Potential rapid navigation:', {
          ...eventInfo,
          stepJump: target - state.currentStep,
          isRapidNavigation: true
        });
      }

      // Antes de alterar etapa, cancelar timers de curto prazo que não devem atravessar navegação
      try { PerformanceOptimizer.cancelOnNavigation(); } catch { }
      actions.setCurrentStep(target);

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          '➡️ EditorPro: navegação por evento',
          raw,
          '→',
          target,
          'origem:',
          e.detail?.source,
          'stepKey:',
          e.detail?.stepKey
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
    } catch { }
  }, [safeCurrentStep]);

  // 🔍 INVESTIGAÇÃO #6: Enhanced escutar eventos globais com logging detalhado e race condition detection
  useEffect(() => {
    const handleInputChange = (ev: Event) => {
      const e = ev as CustomEvent<{
        value?: any;
        valid?: boolean;
        questionId?: string;
        stepId?: number;
        source?: string;
      } | undefined>;

      const eventData = {
        value: (e.detail as any)?.value,
        valid: (e.detail as any)?.valid,
        questionId: (e.detail as any)?.questionId,
        stepId: (e.detail as any)?.stepId,
        source: (e.detail as any)?.source,
        currentStep: state.currentStep,
        timestamp: new Date().toISOString()
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🔊 INVESTIGAÇÃO #6: Input change event received:', eventData);
      }

      // Detectar race conditions
      if (eventData.stepId && eventData.stepId !== state.currentStep) {
        console.warn('⚠️ RACE CONDITION DETECTED: Input event stepId differs from currentStep', {
          eventStepId: eventData.stepId,
          currentStep: state.currentStep,
          questionId: eventData.questionId,
          source: eventData.source
        });

        // Track para debugging
        if (typeof window !== 'undefined') {
          window.__EDITOR_RACE_CONDITIONS__ = window.__EDITOR_RACE_CONDITIONS__ || [];
          window.__EDITOR_RACE_CONDITIONS__.push({
            type: 'input-change',
            ...eventData,
            raceCondition: true
          });
        }
      }

      // Validação centralizada após evento
      try {
        const res = validateStep(state.currentStep, state.stepBlocks as any);
        actions.setStepValid?.(state.currentStep, !!res.valid);
        if (process.env.NODE_ENV === 'development' && !res.valid) {
          console.warn('🔎 Centralized validation failed (input):', res);
        }
      } catch (err) {
        console.error('Validation error (input):', err);
      }
    };

    const handleSelectionChange = (ev: Event) => {
      const e = ev as CustomEvent<{
        valid?: boolean;
        selectionCount?: number;
        questionId?: string;
        stepId?: number;
        selectedIds?: string[];
        source?: string;
      } | undefined>;

      const eventData = {
        valid: (e.detail as any)?.valid,
        selectionCount: (e.detail as any)?.selectionCount,
        questionId: (e.detail as any)?.questionId,
        stepId: (e.detail as any)?.stepId,
        selectedIds: (e.detail as any)?.selectedIds,
        source: (e.detail as any)?.source,
        currentStep: state.currentStep,
        timestamp: new Date().toISOString()
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🔊 INVESTIGAÇÃO #6: Selection change event received:', eventData);
      }

      // Detectar race conditions
      if (eventData.stepId && eventData.stepId !== state.currentStep) {
        console.warn('⚠️ RACE CONDITION DETECTED: Selection event stepId differs from currentStep', {
          eventStepId: eventData.stepId,
          currentStep: state.currentStep,
          questionId: eventData.questionId,
          source: eventData.source
        });

        // Track para debugging
        if (typeof window !== 'undefined') {
          window.__EDITOR_RACE_CONDITIONS__ = window.__EDITOR_RACE_CONDITIONS__ || [];
          window.__EDITOR_RACE_CONDITIONS__.push({
            type: 'selection-change',
            ...eventData,
            raceCondition: true
          });
        }
      }

      // Validação centralizada após evento
      try {
        const res = validateStep(state.currentStep, state.stepBlocks as any);
        actions.setStepValid?.(state.currentStep, !!res.valid);
        if (process.env.NODE_ENV === 'development' && !res.valid) {
          console.warn('🔎 Centralized validation failed (selection):', res);
        }
      } catch (err) {
        console.error('Validation error (selection):', err);
      }
    };

    window.addEventListener('quiz-input-change', handleInputChange as EventListener);
    window.addEventListener('quiz-selection-change', handleSelectionChange as EventListener);
    // Compatibilidade: alguns blocos disparam evento alternativo
    window.addEventListener('selection-change', handleSelectionChange as EventListener);
    return () => {
      window.removeEventListener('quiz-input-change', handleInputChange as EventListener);
      window.removeEventListener('quiz-selection-change', handleSelectionChange as EventListener);
      window.removeEventListener('selection-change', handleSelectionChange as EventListener);
    };
  }, [actions, state.currentStep]);

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
    } catch { }

    return () => {
      try {
        (window as any).__DISABLE_AUTO_SCROLL = false;
        (window as any).__DISABLE_SCROLL_SYNC = false;
      } catch { }
    };
  }, []);

  // 🔍 INVESTIGAÇÃO: Initialize 21-step diagnostic system
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Run initial diagnostic after component mount
      const timeout = setTimeout(() => {
        try {
          const diagnosticResults = run21StepDiagnostic();
          console.log('🎯 21-Step Editor Diagnostic Results:', {
            status: diagnosticResults.overallStatus,
            issues: diagnosticResults.issues,
            timestamp: diagnosticResults.timestamp
          });

          // Add diagnostic keyboard shortcut for manual testing
          const handleKeyboardShortcut = async (e: KeyboardEvent) => {
            // Ctrl+Shift+D to run diagnostic
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
              e.preventDefault();
              const results = run21StepDiagnostic();
              console.log('🔍 Manual Diagnostic Run:', results);

              // Run enhanced diagnostics
              try {
                const enhancedResults = await runCompleteDiagnostics();
                console.log('🎯 Enhanced Diagnostics:', enhancedResults);

                // Show results in browser alert for quick inspection
                const summary = `21-Step Editor Diagnostic
Status: ${results.overallStatus.toUpperCase()}
Issues: ${results.issues.length}
Enhanced: ${enhancedResults.summary.success ? 'PASS' : 'FAIL'} (${enhancedResults.summary.data?.successRate?.toFixed(1)}%)
${results.issues.length > 0 ? '\nIssues:\n' + results.issues.join('\n') : '\nAll systems healthy!'}`;

                alert(summary);
              } catch (error) {
                console.error('❌ Enhanced diagnostics failed:', error);
              }
            }

            // Ctrl+Shift+R to reset diagnostics
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
              e.preventDefault();
              // Clear diagnostic globals
              delete (window as any).__EDITOR_CONTEXT_ERROR__;
              delete (window as any).__EDITOR_INVALID_STEPS__;
              delete (window as any).__EDITOR_FAILED_BLOCK_LOOKUPS__;
              delete (window as any).__EDITOR_STEP_ANALYSIS__;
              delete (window as any).__EDITOR_INVALID_NAVIGATION__;
              delete (window as any).__EDITOR_DIAGNOSTICS__;
              console.log('🔄 Diagnostic data cleared');
            }
          };

          window.addEventListener('keydown', handleKeyboardShortcut);

          // Store cleanup function
          return () => {
            window.removeEventListener('keydown', handleKeyboardShortcut);
          };
        } catch (error) {
          console.error('🚨 Failed to initialize 21-step diagnostic:', error);
        }
      }, 1000); // Wait 1 second after mount for full initialization

      return () => {
        clearTimeout(timeout);
      };
    }
  }, []); // Run once on mount

  // componentes disponíveis - extraídos para config
  const availableComponents = useMemo<ComponentDef[]>(() => AVAILABLE_COMPONENTS_CONFIG, []);

  const groupedComponents = useMemo(
    () =>
      availableComponents.reduce<Record<string, ComponentDef[]>>((acc, c) => {
        const cat = (c as ComponentDef).category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(c as ComponentDef);
        return acc;
      }, {}),
    [availableComponents]
  );

  const getStepAnalysis = useCallback((step: number): StepAnalysis => {
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
  }, []);

  // Handlers básicos
  const handleStepSelect = useCallback((step: number) => actions.setCurrentStep(step), [actions]);
  // Handlers específicos de bloco são delegados ao CanvasDropZone via actions

  // Drag handlers (reutilizam utilitários)
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const dragData = extractDragData(active);
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('🚀 DRAG START CAPTURADO!', {
        activeId: active.id,
        dragData,
        activeDataCurrent: active.data.current,
      });
    }
    setIsDragging(true);
    logDragEvent('start', active);
    if (process.env.NODE_ENV === 'development') devLog('Drag start', dragData);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('🎯 DRAG END CAPTURADO!', {
          activeId: active.id,
          overId: over?.id,
          overData: over?.data?.current,
        });
      }

      setIsDragging(false);

      if (!over) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('❌ Drop cancelado - sem alvo');
        }
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

  /* fim CanvasAreaBase (removido — migrado para layouts/CanvasArea) */
  // Estado de modo de dispositivo para preview (reflete nos controles do PropertiesPanel)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Ações utilitárias do painel de propriedades
  const handleDuplicateSelected = useCallback(() => {
    if (!selectedBlock) return;
    const clone: Block = {
      ...selectedBlock,
      id: `${selectedBlock.id}-copy-${Math.random().toString(36).slice(2, 7)}`,
    };
    // Insere logo após o original
    const idx = currentStepData.findIndex(b => b.id === selectedBlock.id);
    actions.addBlockAtIndex(currentStepKey, clone, idx + 1);
  }, [selectedBlock, actions, currentStepKey, currentStepData]);

  const handleResetSelected = useCallback(() => {
    if (!selectedBlock) return;
    // Reseta somente propriedades (mantém content/id/order/type)
    actions.updateBlock(currentStepKey, selectedBlock.id, { properties: {} });
  }, [selectedBlock, actions, currentStepKey]);

  const MemoPropertiesColumn = React.memo(() => (
    <PropertiesColumn
      selectedBlock={selectedBlock as any}
      onUpdate={(updates: Record<string, any>) =>
        selectedBlock ? actions.updateBlock(currentStepKey, selectedBlock.id, updates) : undefined
      }
      onClose={() => actions.setSelectedBlockId(null)}
      onDelete={() => selectedBlock ? actions.removeBlock(currentStepKey, selectedBlock.id) : undefined}
      onDuplicate={handleDuplicateSelected}
      onReset={handleResetSelected}
      previewMode={previewDevice}
      onPreviewModeChange={setPreviewDevice}
      className="!w-[20%] !min-w-0 !max-w-none"
    />
  ));

  /* -------------------------
     Render principal
     ------------------------- */
  return (
    <>
      <StepDndProvider
        stepNumber={safeCurrentStep}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={`editor-pro h-screen bg-gray-50 flex overflow-x-hidden max-w-screen ${className}`}>
          {/* 1) Etapas - 10% */}
          <Suspense fallback={<div className="w-[10%] min-w-0 max-w-none p-4">Carregando etapas…</div>}>
            <StepSidebar
              currentStep={safeCurrentStep}
              totalSteps={21}
              stepHasBlocks={stepHasBlocks}
              stepValidation={(state as any)?.stepValidation || {}}
              onSelectStep={handleStepSelect}
              getStepAnalysis={getStepAnalysis as any}
              renderIcon={renderIcon as any}
              className="!w-[10%] !min-w-0 !max-w-none"
            />
          </Suspense>
          {/* 2) Componentes - 15% */}
          <Suspense fallback={<div className="w-[15%] min-w-0 max-w-none p-4">Carregando biblioteca…</div>}>
            <ComponentsSidebar
              groupedComponents={groupedComponents as any}
              renderIcon={renderIcon as any}
              className="!w-[15%] !min-w-0 !max-w-none"
            />
          </Suspense>
          {/* 3) Canvas - 55% (conteúdo centralizado internamente) */}
          <CanvasAreaLayout
            className=""
            containerRef={containerRef}
            mode={mode}
            setMode={setMode}
            previewDevice={previewDevice}
            setPreviewDevice={setPreviewDevice}
            safeCurrentStep={safeCurrentStep}
            currentStepKey={currentStepKey}
            currentStepData={currentStepData as any}
            selectedBlockId={state.selectedBlockId}
            actions={actions as any}
            state={state as any}
            notification={notification as any}
            renderIcon={renderIcon as any}
            getStepAnalysis={getStepAnalysis as any}
            isDragging={isDragging}
          />
          {/* 4) Propriedades - 20% */}
          <Suspense fallback={<div className="w-[20%] min-w-0 max-w-none p-4">Propriedades…</div>}>
            <MemoPropertiesColumn />
          </Suspense>
        </div>
      </StepDndProvider>

      {NotificationContainer ? <NotificationContainer /> : null}
      {mark('EditorPro:render:end')}
    </>
  );
};

export default EditorPro;
