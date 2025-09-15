// @ts-nocheck
import React, { useCallback, useMemo, useRef, useState, useEffect, Suspense } from 'react';
// import types moved to hook
// import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useNotification } from '@/components/ui/Notification';
import { Block } from '@/types/editor';
// drag/drop utils usados dentro do hook dedicado
import { createBlockFromComponent, devLog } from '@/utils/editorUtils';
import { getBlocksForStep } from '@/config/quizStepsComplete';
// import { cn } from '@/lib/utils';
import { useEditor } from '@/components/editor/EditorProvider';
import { useRenderCount } from '@/hooks/useRenderCount';
import { mark } from '@/utils/perf';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useColumnWidths } from '@/hooks/useColumnWidths';
// import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { StepDndProvider } from '@/components/editor/dnd/StepDndProvider';
import CanvasAreaLayout from '@/components/editor/layouts/CanvasArea';
import { run21StepDiagnostic } from '@/diagnostic/21StepEditorDiagnostic';
import { runCompleteDiagnostics } from '@/utils/editorDiagnostics';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';
import { useCentralizedStepValidation } from '@/hooks/useCentralizedStepValidation';
import { validateStep } from '@/utils/stepValidationRegistry';
import { calculateAndSaveQuizResult } from '@/utils/quizResultCalculator';
import { FunnelHeader } from '@/components/editor/FunnelHeader';
import { useDisableAutoScroll } from '@/hooks/editor/useDisableAutoScroll';
import { useGlobalHotkeys } from '@/hooks/editor/useGlobalHotkeys';
import { logger } from '@/utils/debugLogger';
import { useEditorDragAndDrop } from '@/hooks/editor/useEditorDragAndDrop';

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
 * LEGACY: EditorPro
 * Este componente foi movido para src/legacy para reduzir ambiguidade.
 * Use SchemaDrivenEditorResponsive (cadeia MainEditor → SchemaDrivenEditorResponsive) como padrão.
 */
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
  useDisableAutoScroll(true);

  // Atalhos globais com cleanup: Undo/Redo (Ctrl/Cmd + Z/Y)
  useGlobalHotkeys((e) => {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-2xl border border-gray-800/50 p-6 text-center">
          <div className="text-red-400 mb-4 flex items-center justify-center">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">Erro de Contexto do Editor</h2>
          <p className="text-gray-400 mb-4">
            O EditorPro deve ser usado dentro de um EditorProvider.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-brand-brightBlue text-white py-2 px-4 rounded-lg hover:opacity-80 transition-opacity"
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 1019 5" />
              </svg>
              Reload
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

  const currentStepData = useMemo(
    () => {
      const blocks = getBlocksForStep(safeCurrentStep, state.stepBlocks) || [];
      logger.debug('🔍 EditorPro currentStepData:', {
        step: safeCurrentStep,
        stepKey: `step-${safeCurrentStep}`,
        blocksFound: blocks.length,
        blockTypes: blocks.map(b => b.type),
        stepBlocksKeys: state.stepBlocks ? Object.keys(state.stepBlocks) : 'undefined',
        stepBlocksTotal: state.stepBlocks ? Object.values(state.stepBlocks).reduce((acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0), 0) : 0
      });
      return blocks;
    },
    [safeCurrentStep, state.stepBlocks]
  );

  // Estados de animação/UX via hook de DnD
  const { isDragging, handleDragStart, handleDragEnd } = useEditorDragAndDrop({
    currentStepData: currentStepData as any,
    currentStepKey: currentStepKey,
    actions: actions as any,
    notification: notification as any,
  });

  const stepHasBlocks = useMemo(() => {
    const stepBlocksRef = state.stepBlocks;
    if (!stepBlocksRef) {
      return {};
    }

    const stepBlocksKeys = Object.keys(stepBlocksRef).sort().join(',');
    const stepBlocksLengths = Object.values(stepBlocksRef).map(blocks => Array.isArray(blocks) ? blocks.length : 0).join(',');
    const stableKey = `${stepBlocksKeys}:${stepBlocksLengths}`;

    const cache = (window as any).__stepHasBlocksCache = (window as any).__stepHasBlocksCache || {};
    if (cache.key === stableKey && cache.result) {
      return cache.result;
    }

    const map: Record<number, boolean> = {};
    const diagnosticInfo = {
      timestamp: new Date().toISOString(),
      totalStepBlocksKeys: Object.keys(stepBlocksRef).length,
      stepBlocksKeys: Object.keys(stepBlocksRef).slice(0, 10),
      stepsWithBlocks: [] as number[],
      stepsWithoutBlocks: [] as number[]
    };

    for (let i = 1; i <= 21; i++) {
      const blocks = getBlocksForStep(i, stepBlocksRef) || [];
      const hasBlocks = blocks.length > 0;
      map[i] = hasBlocks;

      if (hasBlocks) {
        diagnosticInfo.stepsWithBlocks.push(i);
      } else {
        diagnosticInfo.stepsWithoutBlocks.push(i);
      }
    }

    cache.key = stableKey;
    cache.result = map;

    if (process.env.NODE_ENV === 'development') {
      logger.debug('🔍 stepHasBlocks calculation:', {
        ...diagnosticInfo,
        totalStepsWithBlocks: diagnosticInfo.stepsWithBlocks.length,
        totalStepsWithoutBlocks: diagnosticInfo.stepsWithoutBlocks.length,
        mandatoryStepsEmpty: diagnosticInfo.stepsWithoutBlocks.filter(step => step <= 10),
        finalStepsEmpty: diagnosticInfo.stepsWithoutBlocks.filter(step => step >= 19),
        cacheKey: stableKey
      });

      (window as any).__EDITOR_STEP_ANALYSIS__ = {
        ...diagnosticInfo,
        stepHasBlocksMap: map
      };
    }

    return map;
  }, [state.stepBlocks]);

  // Nota: seleção é derivada sob demanda nas callbacks para reduzir renders

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
  const calcInflightRef = useRef<Promise<any> | null>(null);
  useEffect(() => {
    const shouldCompute = safeCurrentStep === 19 || safeCurrentStep === 20;
    if (!shouldCompute) return;
    if (lastComputedStepRef.current === safeCurrentStep) return;

    lastComputedStepRef.current = safeCurrentStep;

    (async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          logger.info('🧮 Calculando resultado do quiz (auto) para etapa', safeCurrentStep);
        }

        if (safeCurrentStep === 20) {
          logger.info('🎯 Etapa 20: garantindo cálculo de resultado');
          if (!calcInflightRef.current) {
            calcInflightRef.current = calculateAndSaveQuizResult().finally(() => {
              calcInflightRef.current = null;
            });
          }
          await calcInflightRef.current;

          try { window.dispatchEvent(new Event('quiz-result-refresh')); } catch { }

          setTimeout(async () => {
            try {
              logger.info('🎯 Etapa 20: segunda tentativa de cálculo');
              if (!calcInflightRef.current) {
                calcInflightRef.current = calculateAndSaveQuizResult().finally(() => {
                  calcInflightRef.current = null;
                });
              }
              await calcInflightRef.current;
              try { window.dispatchEvent(new Event('quiz-result-refresh')); } catch { }
            } catch (err) {
              logger.error('Falha na segunda tentativa de cálculo:', err);
            }
          }, 1000);
        } else {
          await calculateAndSaveQuizResult();
          try { window.dispatchEvent(new Event('quiz-result-refresh')); } catch { }
        }
      } catch (err) {
        logger.error('Falha ao calcular resultado automaticamente:', err);
      }
    })();
  }, [safeCurrentStep]);

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
        logger.debug('🔍 Navigation event received:', eventInfo);
      }

      if (!target || target < 1 || target > 21) {
        logger.warn('❌ INVESTIGAÇÃO #6: Invalid navigation target:', eventInfo);
        (window as any).__EDITOR_INVALID_NAVIGATION__ = (window as any).__EDITOR_INVALID_NAVIGATION__ || [];
        (window as any).__EDITOR_INVALID_NAVIGATION__.push(eventInfo);
        return;
      }

      if (Math.abs(target - state.currentStep) > 1) {
        logger.warn('⚠️  INVESTIGAÇÃO #6: Potential rapid navigation:', {
          ...eventInfo,
          stepJump: target - state.currentStep,
          isRapidNavigation: true
        });
      }

      try { PerformanceOptimizer.cancelOnNavigation(); } catch { }
      actions.setCurrentStep(target);

      if (process.env.NODE_ENV === 'development') {
        logger.debug(
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
          logger.debug('🧩 Fallback add via evento:', { blockType, step: safeCurrentStep });
        }
      } catch (err) {
        logger.error('Erro ao adicionar componente via evento:', err);
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

  // 🔍 INVESTIGAÇÃO #6: Escutar eventos globais com logging e race detection
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
        logger.debug('🔊 INVESTIGAÇÃO #6: Input change event received:', eventData);
      }

      if (eventData.stepId && eventData.stepId !== state.currentStep) {
        logger.warn('⚠️ RACE CONDITION DETECTED: Input event stepId differs from currentStep', {
          eventStepId: eventData.stepId,
          currentStep: state.currentStep,
          questionId: eventData.questionId,
          source: eventData.source
        });

        if (typeof window !== 'undefined') {
          (window as any).__EDITOR_RACE_CONDITIONS__ = (window as any).__EDITOR_RACE_CONDITIONS__ || [];
          (window as any).__EDITOR_RACE_CONDITIONS__.push({
            type: 'input-change',
            ...eventData,
            raceCondition: true
          });
        }
      }

      try {
        const res = validateStep(state.currentStep, state.stepBlocks as any);
        actions.setStepValid?.(state.currentStep, !!res.valid);
        if (process.env.NODE_ENV === 'development' && !res.valid) {
          logger.warn('🔎 Centralized validation failed (input):', res);
        }
      } catch (err) {
        logger.error('Validation error (input):', err);
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
        logger.debug('🔊 INVESTIGAÇÃO #6: Selection change event received:', eventData);
      }

      if (eventData.stepId && eventData.stepId !== state.currentStep) {
        logger.warn('⚠️ RACE CONDITION DETECTED: Selection event stepId differs from currentStep', {
          eventStepId: eventData.stepId,
          currentStep: state.currentStep,
          questionId: eventData.questionId,
          source: eventData.source
        });

        if (typeof window !== 'undefined') {
          (window as any).__EDITOR_RACE_CONDITIONS__ = (window as any).__EDITOR_RACE_CONDITIONS__ || [];
          (window as any).__EDITOR_RACE_CONDITIONS__.push({
            type: 'selection-change',
            ...eventData,
            raceCondition: true
          });
        }
      }

      try {
        const res = validateStep(state.currentStep, state.stepBlocks as any);
        actions.setStepValid?.(state.currentStep, !!res.valid);
        if (process.env.NODE_ENV === 'development' && !res.valid) {
          logger.warn('🔎 Centralized validation failed (selection):', res);
        }
      } catch (err) {
        logger.error('Validation error (selection):', err);
      }
    };

    window.addEventListener('quiz-input-change', handleInputChange as EventListener);
    window.addEventListener('quiz-selection-change', handleSelectionChange as EventListener);
    window.addEventListener('selection-change', handleSelectionChange as EventListener);
    return () => {
      window.removeEventListener('quiz-input-change', handleInputChange as EventListener);
      window.removeEventListener('quiz-selection-change', handleSelectionChange as EventListener);
      window.removeEventListener('selection-change', handleSelectionChange as EventListener);
    };
  }, [actions, state.currentStep]);

  // Carregar stepBlocks de um template via evento externo
  useEffect(() => {
    const handler = (ev: Event) => {
      const e = ev as CustomEvent<{ stepBlocks?: Record<string, Block[]> }>;
      const incoming = e.detail?.stepBlocks;
      if (!incoming) return;
      Object.entries(incoming).forEach(([key, list]) => {
        list.forEach(b => {
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

  // Removido: duplicado com useDisableAutoScroll

  // 🔍 INVESTIGAÇÃO: Initialize 21-step diagnostic system
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const timeout = setTimeout(() => {
        try {
          const diagnosticResults = run21StepDiagnostic();
          logger.info('🎯 21-Step Editor Diagnostic Results:', {
            status: diagnosticResults.overallStatus,
            issues: diagnosticResults.issues,
            timestamp: diagnosticResults.timestamp
          });

          const handleKeyboardShortcut = async (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
              e.preventDefault();
              const results = run21StepDiagnostic();
              logger.info('🔍 Manual Diagnostic Run:', results);

              try {
                const enhancedResults = await runCompleteDiagnostics();
                logger.info('🎯 Enhanced Diagnostics:', enhancedResults);

                const s: any = (enhancedResults as any)?.summary ?? {};
                const rate = typeof s.data?.successRate === 'number' ? s.data.successRate.toFixed(1) : 'n/a';
                const summary = `21-Step Editor Diagnostic\nStatus: ${results.overallStatus.toUpperCase()}\nIssues: ${results.issues.length}\nEnhanced: ${s.success ? 'PASS' : 'FAIL'} (${rate}%)\n${results.issues.length > 0 ? '\nIssues:\n' + results.issues.join('\n') : '\nAll systems healthy!'}`;

                alert(summary);
              } catch (error) {
                logger.error('❌ Enhanced diagnostics failed:', error);
              }
            }

            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
              e.preventDefault();
              delete (window as any).__EDITOR_CONTEXT_ERROR__;
              delete (window as any).__EDITOR_INVALID_STEPS__;
              delete (window as any).__EDITOR_FAILED_BLOCK_LOOKUPS__;
              delete (window as any).__EDITOR_STEP_ANALYSIS__;
              delete (window as any).__EDITOR_INVALID_NAVIGATION__;
              delete (window as any).__EDITOR_DIAGNOSTICS__;
              logger.info('🔄 Diagnostic data cleared');
            }
          };

          window.addEventListener('keydown', handleKeyboardShortcut);

          return () => {
            window.removeEventListener('keydown', handleKeyboardShortcut);
          };
        } catch (error) {
          logger.error('🚨 Failed to initialize 21-step diagnostic:', error);
        }
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

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

  const handleStepSelect = useCallback((step: number) => actions.setCurrentStep(step), [actions]);

  // sem ponte: hook já recebe currentStepData atualizado via dependências

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile' | 'xl'>('desktop');

  const handleDuplicateSelected = useCallback(() => {
    const selectedBlock = currentStepData.find((block: Block) => block.id === (editorContext as any).state.selectedBlockId);
    if (!selectedBlock) return;
    const clone: Block = {
      ...selectedBlock,
      id: `${selectedBlock.id}-copy-${Math.random().toString(36).slice(2, 7)}`,
    } as Block;
    const idx = currentStepData.findIndex(b => b.id === selectedBlock.id);
    actions.addBlockAtIndex(currentStepKey, clone, idx + 1);
  }, [actions, currentStepData, currentStepKey]);

  const handleResetSelected = useCallback(() => {
    const selectedBlock = currentStepData.find((block: Block) => block.id === (editorContext as any).state.selectedBlockId);
    if (!selectedBlock) return;
    actions.updateBlock(currentStepKey, selectedBlock.id, { properties: {} });
  }, [actions, currentStepData, currentStepKey]);

  const MemoPropertiesColumn = React.memo(() => {
    const selectedBlock = currentStepData.find((block: Block) => block.id === (editorContext as any).state.selectedBlockId);
    return (
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
      />
    );
  });

  return (
    <>
      {/* 🎯 Cabeçalho do Funil */}
      <FunnelHeader
        viewportMode={previewDevice}
        onViewportModeChange={setPreviewDevice}
      />

      <StepDndProvider
        stepNumber={safeCurrentStep}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={`editor-pro h-[calc(100vh-120px)] bg-gray-950 flex overflow-hidden max-w-screen ${className} relative`}>

          {/* 📱 MOBILE OVERLAYS - Navegação e Propriedades */}
          <div className="lg:hidden">
            {/* Mobile Navigation Overlay */}
            <div id="mobile-nav-overlay" className="mobile-overlay mobile-nav-overlay">
              <div className="mobile-overlay-header">
                <h3>Navegação</h3>
                <button
                  onClick={() => {
                    const overlay = document.getElementById('mobile-nav-overlay');
                    if (overlay) overlay.classList.remove('show');
                  }}
                  className="mobile-overlay-close"
                  aria-label="Fechar painel de navegação"
                >
                  ×
                </button>
              </div>
              <div className="mobile-overlay-content">
                <Suspense fallback={<div className="p-4">Loading steps…</div>}>
                  <StepSidebar
                    currentStep={safeCurrentStep}
                    totalSteps={21}
                    stepHasBlocks={stepHasBlocks}
                    stepValidation={(state as any)?.stepValidation || {}}
                    onSelectStep={(step) => {
                      handleStepSelect(step);
                      const overlay = document.getElementById('mobile-nav-overlay');
                      if (overlay) overlay.classList.remove('show');
                    }}
                    getStepAnalysis={getStepAnalysis as any}
                    renderIcon={renderIcon as any}
                    className="bg-gray-900"
                  />
                </Suspense>
                <Suspense fallback={<div className="p-4">Loading library…</div>}>
                  <ComponentsSidebar
                    groupedComponents={groupedComponents as any}
                    renderIcon={renderIcon as any}
                    className="bg-gray-900 mt-4"
                  />
                </Suspense>
              </div>
            </div>

            {/* Mobile Properties Overlay */}
            <div id="mobile-props-overlay" className="mobile-overlay mobile-props-overlay">
              <div className="mobile-overlay-header">
                <h3>Propriedades</h3>
                <button
                  onClick={() => {
                    const overlay = document.getElementById('mobile-props-overlay');
                    if (overlay) overlay.classList.remove('show');
                  }}
                  className="mobile-overlay-close"
                  aria-label="Fechar painel de propriedades"
                >
                  ×
                </button>
              </div>
              <div className="mobile-overlay-content">
                <Suspense fallback={<div className="p-4">Properties…</div>}>
                  <MemoPropertiesColumn />
                </Suspense>
              </div>
            </div>
          </div>

          {/* 📱 MOBILE ACTION BUTTONS */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 flex justify-between z-40">
            <button
              onClick={() => {
                const overlay = document.getElementById('mobile-nav-overlay');
                if (overlay) overlay.classList.add('show');
              }}
              className="mobile-action-btn bg-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs">Menu</span>
            </button>

            <button
              onClick={() => {
                const overlay = document.getElementById('mobile-props-overlay');
                if (overlay) overlay.classList.add('show');
              }}
              className="mobile-action-btn bg-green-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span className="text-xs">Props</span>
            </button>
          </div>

          {/* DESKTOP LAYOUT - Hidden on mobile */}
          <ResizablePanelGroup 
            direction="horizontal" 
            className="hidden lg:flex w-full h-full"
          >
            {/* 1) Etapas - Resizable width */}
            <ResizablePanel 
              defaultSize={18} 
              minSize={12} 
              maxSize={25}
              className="min-w-0"
            >
              <div className="h-full overflow-y-auto">
                <Suspense fallback={<div className="p-4 bg-gray-900 border-r border-gray-800/50">Loading steps…</div>}>
                  <StepSidebar
                    currentStep={safeCurrentStep}
                    totalSteps={21}
                    stepHasBlocks={stepHasBlocks}
                    stepValidation={(state as any)?.stepValidation || {}}
                    onSelectStep={handleStepSelect}
                    getStepAnalysis={getStepAnalysis as any}
                    renderIcon={renderIcon as any}
                    className="!w-full bg-gray-900 border-r border-gray-800/50 h-full"
                  />
                </Suspense>
              </div>
            </ResizablePanel>
            
            <ResizableHandle 
              withHandle 
              className="w-2 bg-border hover:bg-primary/50 transition-colors cursor-col-resize flex items-center justify-center group relative"
            />

            {/* 2) Componentes - Resizable width */}
            <ResizablePanel 
              defaultSize={22} 
              minSize={15} 
              maxSize={45}
              className="min-w-0"
            >
              <div className="h-full overflow-y-auto">
                <Suspense fallback={<div className="p-4 bg-gray-900 border-r border-gray-800/50">Loading library…</div>}>
                  <ComponentsSidebar
                    groupedComponents={groupedComponents as any}
                    renderIcon={renderIcon as any}
                    className="!w-full bg-gray-900 border-r border-gray-800/50 h-full"
                  />
                </Suspense>
              </div>
            </ResizablePanel>

            <ResizableHandle 
              withHandle 
              className="w-2 bg-border hover:bg-primary/50 transition-colors cursor-col-resize flex items-center justify-center group relative"
            />

            {/* 3) Canvas - Flexible main area */}
            <ResizablePanel 
              defaultSize={40} 
              minSize={25} 
              maxSize={65}
              className="min-w-0"
            >
              <div className="h-full overflow-y-auto">
                <CanvasAreaLayout
                  className="h-full"
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
              </div>
            </ResizablePanel>

            <ResizableHandle 
              withHandle 
              className="w-2 bg-border hover:bg-primary/50 transition-colors cursor-col-resize flex items-center justify-center group relative"
            />

            {/* 4) Propriedades - Resizable width */}
            <ResizablePanel 
              defaultSize={20} 
              minSize={15} 
              maxSize={35}
              className="min-w-0"
            >
              <div className="h-full overflow-y-auto">
                <Suspense fallback={<div className="p-4 bg-gray-900 border-l border-gray-800/50">Properties…</div>}>
                  <MemoPropertiesColumn />
                </Suspense>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </StepDndProvider>

      {NotificationContainer ? <NotificationContainer /> : null}
      {mark('EditorPro:render:end')}
    </>
  );
};

export default EditorPro;
