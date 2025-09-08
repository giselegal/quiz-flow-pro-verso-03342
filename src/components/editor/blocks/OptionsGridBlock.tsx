import type { BlockComponentProps } from '@/types/blocks';
import React from 'react';
import useOptimizedScheduler from '@/hooks/useOptimizedScheduler';
import { computeSelectionValidity, getEffectiveRequiredSelections, isScoringPhase } from '@/lib/quiz/selectionRules';
import { useEditorOptional } from '../EditorProvider';
import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';
import { StorageService } from '@/services/core/StorageService';
import { safePlaceholder } from '@/utils/placeholder';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

interface Option {
  id: string;
  text: string;
  imageUrl?: string;
  value?: string;
  category?: string;
  styleCategory?: string;
  keyword?: string;
  points?: number;
}

interface OptionsGridBlockProps extends BlockComponentProps {
  // Preview mode props
  isPreviewMode?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigate?: (stepId: string) => void;
  onUpdateSessionData?: (key: string, value: any) => void;
  sessionData?: Record<string, any>;
  onStepComplete?: (data: any) => void;
  autoAdvanceOnComplete?: boolean;

  properties: {
    question?: string;
    questionId?: string;
    options?: Option[];
    columns?: number | string;
    selectedOption?: string;
    selectedOptions?: string[];
    // 🎯 CONTROLES DE IMAGEM
    showImages?: boolean;
    imageSize?: 'small' | 'medium' | 'large' | 'custom' | string; // Permite strings também
    imageWidth?: number;
    imageHeight?: number;
    imagePosition?: 'top' | 'left' | 'right' | 'bottom';
    imageLayout?: 'vertical' | 'horizontal';
    // 🎯 CONTROLES DE LAYOUT
    multipleSelection?: boolean;
    maxSelections?: number;
    minSelections?: number;
    requiredSelections?: number;
    gridGap?: number;
    responsiveColumns?: boolean;
    // 🎯 CONTROLES DE SELEÇÃO
    selectionStyle?: string;
    selectedColor?: string;
    hoverColor?: string;
    allowDeselection?: boolean;
    showSelectionCount?: boolean;
    // 🎯 CONTROLES DE VALIDAÇÃO
    validationMessage?: string;
    progressMessage?: string;
    enableButtonOnlyWhenValid?: boolean;
    showValidationFeedback?: boolean;
    // 🎯 CONTROLES DE COMPORTAMENTO
    autoAdvanceOnComplete?: boolean;
    autoAdvanceDelay?: number;
    instantActivation?: boolean;
    trackSelectionOrder?: boolean;
  };
}

// NOTE: getMarginClass function available if needed for margin calculations
/*
const getMarginClass = (value: string | number, type: 'top' | 'bottom' | 'left' | 'right'): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};
*/

const OptionsGridBlock: React.FC<OptionsGridBlockProps> = ({
  block,
  isSelected = false,
  // isEditing = false, // unused
  onClick,
  onPropertyChange,
  className = '',
  // Preview mode props
  isPreviewMode = false,
  onNext,
  onUpdateSessionData,
  sessionData = {},
  onStepComplete,
}) => {
  // Fallbacks: permitir injeção via block.properties (quando vem do QuizRenderer em preview)
  const injectedOnNext = (block?.properties as any)?.onNext as undefined | (() => void);
  const injectedOnUpdateSessionData = (block?.properties as any)?.onUpdateSessionData as
    | undefined
    | ((key: string, value: any) => void);
  const injectedSessionData = (block?.properties as any)?.sessionData as
    | Record<string, any>
    | undefined;

  const onNextCb = onNext || injectedOnNext;
  const onUpdateSessionDataCb = onUpdateSessionData || injectedOnUpdateSessionData;
  const sessionDataObj = Object.keys(sessionData || {}).length ? sessionData : injectedSessionData || {};
  // Acessa etapa atual no modo editor
  let currentStepFromEditor: number | null = null;
  try {
    const editor = useEditorOptional();
    currentStepFromEditor = editor?.state?.currentStep ?? null;
  } catch (e) {
    currentStepFromEditor = null;
  }

  // Evitar autoavanço duplicado
  const autoAdvanceScheduledRef = React.useRef(false);
  const { schedule, cancel } = useOptimizedScheduler();

  const {
    question: questionProp,
    // questionId, // unused
    options: optionsProp = [],
    columns = 2,
    // selectedOption, // unused for now
    selectedOptions = [],
    // 🎯 PROPRIEDADES DE IMAGEM
    showImages = true,
    imageSize = 'medium',
    imageWidth,
    imageHeight,
    imagePosition = 'top',
    imageLayout = 'vertical',
    layout = 'grid', // 'grid' | 'list'
    layoutOrientation, // compat: pode vir como alias de imageLayout
    // 🎯 PROPRIEDADES DE LAYOUT
    gridGap = 16,
    responsiveColumns = true,
    multipleSelection = false,
    maxSelections = 1,
    minSelections = 1,
    requiredSelections = 1,
    // 🎯 PROPRIEDADES DE ESTILO
    selectionStyle = 'border',
    selectedColor = '#B89B7A',
    hoverColor = '#D4C2A8',
    // 🎯 PROPRIEDADES DE COMPORTAMENTO
    allowDeselection = true,
    // showSelectionCount = true, // unused
    // validationMessage = 'Selecione uma opção', // unused
    // progressMessage = '{selected} de {maxSelections} selecionados', // unused
    // enableButtonOnlyWhenValid = true, // unused
    // showValidationFeedback = true, // unused
    // autoAdvanceOnComplete = false, // unificado via regras por etapa
    autoAdvanceDelay = 1500,
    // instantActivation = true, // unused
    // trackSelectionOrder = false, // unused
    // 🎯 PROPRIEDADES LEGADAS
    className: blockClassName,
    showQuestionTitle = true,
  } = (block?.properties as any) || {};

  // Callback externo (produção/quiz) para propagar seleção ao host
  const externalOnOptionSelect = (block?.properties as any)?.onOptionSelect as
    | ((optionId: string) => void)
    | undefined;

  // Fallbacks a partir de content (compatibilidade com template)
  const question = (questionProp ?? (block as any)?.content?.question) as string | undefined;
  // Resolver opções com fallback robusto: se properties.options existir porém vazio, usar content.options
  const propOptions = (block?.properties as any)?.options as Option[] | undefined;
  const contentOptions = (block as any)?.content?.options as Option[] | undefined;
  let options = (
    (Array.isArray(propOptions) && propOptions.length > 0)
      ? propOptions
      : (Array.isArray(contentOptions) && contentOptions.length > 0)
        ? contentOptions
        : optionsProp
  ) as Option[];

  // Logs de diagnóstico em desenvolvimento
  if (import.meta?.env?.DEV) {
    try {
      const stepNum = Number(currentStepFromEditor ?? NaN);
      // Logar apenas para as primeiras etapas para não poluir
      if (Number.isFinite(stepNum) && stepNum <= 3 && block?.type === 'options-grid') {
        console.log('🔎 OptionsGridBlock: resolução de opções', {
          stepNum,
          fromProperties: Array.isArray(propOptions) ? propOptions.length : 'n/a',
          fromContent: Array.isArray(contentOptions) ? contentOptions.length : 'n/a',
          finalCount: Array.isArray(options) ? options.length : 0,
          question: question || (block as any)?.content?.question,
          blockId: block?.id,
        });
      }
    } catch { }
  }

  // Fallback final: resolver opções canônicas do template para a etapa atual
  try {
    // 1) Editor: usar etapa do editor quando disponível
    const stepNum = Number(currentStepFromEditor ?? NaN);
    if (
      block?.type === 'options-grid' && (!options || options.length === 0) &&
      Number.isFinite(stepNum) && stepNum >= 1
    ) {
      const key = `step-${stepNum}`;
      const canonicalStep = (QUIZ_STYLE_21_STEPS_TEMPLATE as any)[key] || [];
      const canonicalGrid = canonicalStep.find((b: any) => (b?.type || '').toLowerCase() === 'options-grid');
      const canonicalOptions = canonicalGrid?.content?.options;
      if (Array.isArray(canonicalOptions) && canonicalOptions.length > 0) {
        options = canonicalOptions as Option[];
      }
    }

    // 2) Produção: se ainda vazio, usar etapa corrente do runtime (/quiz)
    if (block?.type === 'options-grid' && (!options || options.length === 0)) {
      let runtimeStep: number | null = null;
      try {
        const wStep = (window as any)?.__quizCurrentStep;
        if (typeof wStep === 'number' && Number.isFinite(wStep)) runtimeStep = wStep;
      } catch { /* noop */ }
      if (runtimeStep == null) {
        try {
          const data = unifiedQuizStorage.loadData();
          const s = Number(data?.metadata?.currentStep);
          if (Number.isFinite(s)) runtimeStep = s;
        } catch { /* noop */ }
      }

      if (runtimeStep != null && Number.isFinite(Number(runtimeStep)) && Number(runtimeStep) >= 1) {
        const key = `step-${runtimeStep}`;
        const canonicalStep = (QUIZ_STYLE_21_STEPS_TEMPLATE as any)[key] || [];
        const canonicalGrid = canonicalStep.find((b: any) => (b?.type || '').toLowerCase() === 'options-grid');
        const canonicalOptions = canonicalGrid?.content?.options;
        if (Array.isArray(canonicalOptions) && canonicalOptions.length > 0) {
          options = canonicalOptions as Option[];
        }
      }
    }
  } catch { /* noop */ }

  // State for preview mode selections
  const [previewSelections, setPreviewSelections] = React.useState<string[]>([]);
  const previewAutoAdvanceRef = React.useRef(false);

  // Persistência unificada das seleções (compatível com validação centralizada)
  const persistSelections = React.useCallback((selections: string[]) => {
    try {
      const questionId = (block?.properties as any)?.questionId || block?.id;
      if (!questionId) return;

      // 1) Fonte de verdade unificada
      unifiedQuizStorage.updateSelections(String(questionId), selections);

      // 2) Espelho legado (usado por validateStep)
      const current =
        (StorageService.safeGetJSON<Record<string, string[]>>('userSelections') || {});
      const next = { ...current, [String(questionId)]: selections };
      StorageService.safeSetJSON('userSelections', next);
    } catch {
      // silencioso
    }
  }, [block?.id, (block?.properties as any)?.questionId]);

  React.useEffect(() => {
    // Initialize from session data in preview mode
    if (isPreviewMode && sessionDataObj) {
      const sessionKey = `step_selections_${block?.id}`;
      const savedSelections = (sessionDataObj as any)[sessionKey];
      if (savedSelections && Array.isArray(savedSelections)) {
        setPreviewSelections(savedSelections);
      }
    }
  }, [isPreviewMode, sessionDataObj, block?.id]);

  // Helpers
  const toPxNumber = (val?: number | string): number | undefined => {
    if (val == null) return undefined;
    if (typeof val === 'number') return val;
    const n = parseInt(String(val), 10);
    return isNaN(n) ? undefined : n;
  };

  // 🎯 Normalizar tamanhos de imagem
  const getImageSize = () => {
    const presets = {
      small: 96,
      medium: 128,
      large: 256,
    } as const;

    // Se for uma string com "px", extrair o número
    if (typeof imageSize === 'string' && imageSize.includes('px')) {
      const size = parseInt(imageSize.replace('px', ''), 10);
      return { width: size, height: size };
    }

    // Se for um número como string
    if (typeof imageSize === 'string' && !isNaN(parseInt(imageSize, 10))) {
      const size = parseInt(imageSize, 10);
      return { width: size, height: size };
    }

    if (imageSize === 'custom') {
      const w = toPxNumber(imageWidth) ?? 150;
      const h = toPxNumber(imageHeight) ?? w;
      return { width: w, height: h };
    }

    const side = presets[imageSize as keyof typeof presets] ?? presets.medium;
    return { width: side, height: side };
  };

  const { width: imgW, height: imgH } = getImageSize();

  const effectiveImageLayout = (layoutOrientation as any) || imageLayout || 'vertical';
  const cardLayoutClass =
    effectiveImageLayout === 'horizontal' && (imagePosition === 'left' || imagePosition === 'right')
      ? 'flex items-center'
      : 'flex flex-col';

  const gridColsClass = (() => {
    const raw = typeof columns === 'string' ? parseInt(columns, 10) : columns;
    const colNum = isNaN(Number(raw)) ? 2 : Math.max(1, Math.min(Number(raw), 2));
    if (colNum === 1) return 'grid-cols-1';
    // colNum === 2 (máximo)
    return responsiveColumns ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2';
  })();

  const imageOrderClass = (() => {
    switch (imagePosition) {
      case 'bottom':
        return 'order-last mt-3';
      case 'left':
        return 'mr-3';
      case 'right':
        return 'ml-3';
      case 'top':
      default:
        return 'mb-3';
    }
  })();

  const handleOptionSelect = (optionId: string) => {
    if (isPreviewMode) {
      // Preview mode: Handle selection with real behavior
      let newSelections: string[];

      if (multipleSelection) {
        if (previewSelections.includes(optionId)) {
          // Deselect if already selected
          if (allowDeselection) {
            newSelections = previewSelections.filter(id => id !== optionId);
          } else {
            newSelections = previewSelections; // Don't change if deselection not allowed
          }
        } else {
          // Add selection if under max limit
          if (previewSelections.length < maxSelections) {
            newSelections = [...previewSelections, optionId];
          } else {
            newSelections = previewSelections; // Don't exceed max selections
          }
        }
      } else {
        // Single selection
        if (previewSelections.includes(optionId) && allowDeselection) {
          newSelections = [];
        } else {
          newSelections = [optionId];
        }
      }

      setPreviewSelections(newSelections);

      // Persistir seleções para validação centralizada e pontuação
      persistSelections(newSelections);

      // Propagar para host (produção/quiz) se disponível
      externalOnOptionSelect?.(optionId);

      // Disparar evento global para validação (coerente com /quiz)
      try {
        const questionId = (block?.properties as any)?.questionId || block?.id;
        const step = (window as any)?.__quizCurrentStep ?? null;
        const validity = computeSelectionValidity(step, newSelections.length, {
          requiredSelections,
          minSelections,
        });
        const effectiveRequiredSelections = getEffectiveRequiredSelections(step, { requiredSelections, minSelections });
        window.dispatchEvent(
          new CustomEvent('quiz-selection-change', {
            detail: {
              questionId,
              gridId: block?.id,
              selectionCount: newSelections.length,
              requiredSelections: effectiveRequiredSelections,
              valid: validity.isValid,
              isValid: validity.isValid,
              // Compat: fornecer arrays para consumidores externos
              selectedOptions: newSelections,
              selectedIds: newSelections,
            },
          })
        );
      } catch { }

      // Save to session data
      if (onUpdateSessionDataCb) {
        const sessionKey = `step_selections_${block?.id}`;
        onUpdateSessionDataCb(sessionKey, newSelections);

        // Save individual option details for analytics
        const selectedOptionDetails = newSelections.map(id => {
          const option = options.find((opt: any) => opt.id === id);
          return {
            id,
            text: option?.text,
            category: option?.category,
            styleCategory: option?.styleCategory,
            points: option?.points,
          };
        });
        onUpdateSessionDataCb(`${sessionKey}_details`, selectedOptionDetails);
      }

      // Check if we should auto-advance - REGRAS UNIFICADAS COM EDIÇÃO
      const step = (window as any)?.__quizCurrentStep ?? null;
      const effectiveRequiredSelections = getEffectiveRequiredSelections(step, {
        requiredSelections,
        minSelections,
      });
      const hasMinSelections = newSelections.length >= (minSelections || 1);
      const hasRequiredSelections = newSelections.length >= effectiveRequiredSelections;

      // Calculate option details for completion events
      const selectedOptionDetails = newSelections.map(id => {
        const option = options.find((opt: any) => opt.id === id);
        return {
          id,
          text: option?.text,
          category: option?.category,
          styleCategory: option?.styleCategory,
          points: option?.points,
        };
      });

      if (isScoringPhase(step) && hasRequiredSelections && onNextCb) {
        console.log('🚀 OptionsGrid (preview): Auto-advancing after selection', newSelections);

        if (onStepComplete) {
          onStepComplete({
            stepId: block?.id,
            selections: newSelections,
            selectedOptionDetails,
            autoAdvance: true,
          });
        }

        // Evitar múltiplos disparos
        if (!previewAutoAdvanceRef.current) {
          previewAutoAdvanceRef.current = true;
          const delayMs = Math.max(200, Math.min(1200, autoAdvanceDelay || 600));
          cancel('options-grid-preview-auto-advance');
          schedule(
            'options-grid-preview-auto-advance',
            () => {
              onNextCb?.();
              previewAutoAdvanceRef.current = false;
            },
            delayMs,
            'timeout'
          );
        }
      } else if (onStepComplete && hasMinSelections) {
        // Just trigger completion without auto-advance
        onStepComplete({
          stepId: block?.id,
          selections: newSelections,
          selectedOptionDetails,
          autoAdvance: false,
        });
      }

      if (!hasRequiredSelections) {
        previewAutoAdvanceRef.current = false;
        cancel('options-grid-preview-auto-advance');
      }
    } else {
      // Editor mode: Update properties and emit validation event for editor UX
      let newSelections: string[];
      if (multipleSelection) {
        const currentSelections = selectedOptions || [];
        if (currentSelections.includes(optionId)) {
          newSelections = allowDeselection
            ? currentSelections.filter((id: string) => id !== optionId)
            : currentSelections;
        } else {
          // Respeitar maxSelections também no editor
          if ((currentSelections?.length || 0) < (maxSelections || 1)) {
            newSelections = [...currentSelections, optionId];
          } else {
            newSelections = currentSelections;
          }
        }
        onPropertyChange?.('selectedOptions', newSelections);
      } else {
        newSelections = [optionId];
        onPropertyChange?.('selectedOption', optionId);
      }

      // Persistir seleções também fora do preview (produção/editor)
      persistSelections(newSelections);

      // Propagar para host (ex.: produção usando mesmo componente via registry)
      externalOnOptionSelect?.(optionId);
      // Calcula regras por etapa
      const step = Number(currentStepFromEditor ?? NaN);
      const validityEditor = computeSelectionValidity(step, newSelections.length, {
        requiredSelections,
        minSelections,
      });
      const hasRequiredSelections = validityEditor.isValid;
      const effectiveRequiredSelectionsEditor = getEffectiveRequiredSelections(step, {
        requiredSelections,
        minSelections,
      });

      // Emitir evento global para que o EditorStageManager possa refletir validação visual
      window.dispatchEvent(
        new CustomEvent('quiz-selection-change', {
          detail: {
            questionId: (block?.properties as any)?.questionId || block?.id,
            gridId: block?.id,
            selectionCount: newSelections.length,
            requiredSelections: effectiveRequiredSelectionsEditor,
            valid: hasRequiredSelections,
            isValid: hasRequiredSelections,
            // Compat: fornecer arrays para consumidores externos
            selectedOptions: newSelections,
            selectedIds: newSelections,
          },
        })
      );

      // Autoavanço somente nas etapas 2–11, ao atingir a última seleção obrigatória
      if (isScoringPhase(step)) {
        // Evitar múltiplos disparos se usuário clicar rapidamente
        if (hasRequiredSelections && !autoAdvanceScheduledRef.current) {
          autoAdvanceScheduledRef.current = true;

          // Ativa visualmente e funcionalmente o botão "Avançar" via evento acima,
          // e após um pequeno delay, navega automaticamente.
          const nextStep = Math.min(step + 1, 21);
          const delayMs = Math.max(
            200,
            Math.min(1200, (block?.properties as any)?.autoAdvanceDelay ?? 600)
          );

          cancel('options-grid-editor-auto-advance');
          schedule('options-grid-editor-auto-advance', () => {
            // Dispara ambos eventos para máxima compatibilidade
            window.dispatchEvent(
              new CustomEvent('navigate-to-step', {
                detail: { stepId: nextStep, source: 'options-grid-auto-advance' },
              })
            );
            window.dispatchEvent(
              new CustomEvent('quiz-navigate-to-step', {
                detail: { stepId: nextStep, source: 'options-grid-auto-advance' },
              })
            );

            // Libera para um próximo uso quando o usuário retornar/alterar
            autoAdvanceScheduledRef.current = false;
          }, delayMs, 'timeout');
        }

        // Se caiu abaixo do requisito, libera nova tentativa
        if (!hasRequiredSelections) {
          autoAdvanceScheduledRef.current = false;
          cancel('options-grid-editor-auto-advance');
        }
      } else {
        // Fases sem autoavanço (1 e 13–18): apenas ativação visual/funcional do botão "Avançar"
        autoAdvanceScheduledRef.current = false;
        cancel('options-grid-editor-auto-advance');
      }
    }
  };

  // NOTE: getCurrentSelections function available if needed
  /*
  const getCurrentSelections = () => {
    if (isPreviewMode) {
      return previewSelections;
    }
    return multipleSelection ? (selectedOptions || []) : (selectedOption ? [selectedOption] : []);
  };
  */

  // const currentSelections = getCurrentSelections(); // unused variable

  return (
    <div
      className={`${isSelected ? 'ring-2 ring-amber-500/60 ring-offset-1' : ''} ${className}`}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Aviso em dev quando não há opções resolvidas */}
      {import.meta?.env?.DEV && (!options || options.length === 0) && (
        <div className="mb-4 p-3 rounded border border-yellow-300 bg-yellow-50 text-yellow-800">
          Nenhuma opção encontrada para este bloco. Em dev, usamos fallback canônico por etapa, mas nada foi resolvido.
        </div>
      )}
      {/* Título interno opcional: só renderiza se existir e for permitido */}
      {question && showQuestionTitle && (
        <h2 className="text-2xl font-bold text-center mb-6">{question}</h2>
      )}

      <div
        className={`${layout === 'list' ? 'flex flex-col' : `grid ${gridColsClass}`} ${blockClassName || ''
          }`}
        style={{ gap: `${gridGap}px` }}
      >
        {(options || []).map((opt: any) => {
          // contentType suporta: 'text-and-image' | 'image-only' | 'text-only'
          const ct = (block?.properties as any)?.contentType as string | undefined;
          const showImageEffective =
            (ct === 'image-only' || ct === 'text-and-image' || ct == null) && showImages;
          const showTextEffective = ct === 'image-only' ? false : true;

          // Estado de seleção visual (editor usa selectedOptions, preview usa previewSelections)
          const isSelectedOption = isPreviewMode
            ? previewSelections.includes(opt.id)
            : (selectedOptions || []).includes(opt.id);

          // Estilos dinâmicos por seleção
          const selectedStyles: React.CSSProperties = (() => {
            switch (selectionStyle) {
              case 'background':
                return isSelectedOption
                  ? { backgroundColor: `${selectedColor}1A`, borderColor: selectedColor }
                  : { backgroundColor: 'white' };
              case 'shadow':
                return isSelectedOption
                  ? {
                    boxShadow: `0 0 0 2px ${selectedColor}55, 0 8px 20px ${selectedColor}33`,
                    borderColor: selectedColor,
                  }
                  : {};
              default:
                // border
                return isSelectedOption
                  ? { borderColor: selectedColor, boxShadow: `${selectedColor}55 0px 0px 0px 2px inset` }
                  : {};
            }
          })();

          const hoverStyles: React.CSSProperties = { boxShadow: `0 6px 14px ${hoverColor}33` };

          return (
            <div
              key={opt.id}
              role="button"
              aria-pressed={isSelectedOption}
              data-selected={isSelectedOption ? 'true' : 'false'}
              data-testid={`grid-option-${opt.id}`}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOptionSelect(opt.id);
                }
              }}
              className={`rounded-lg border p-4 transition-all duration-200 cursor-pointer ${isSelectedOption ? '' : 'border-neutral-200 bg-white'
                } ${cardLayoutClass}`}
              onClick={() => handleOptionSelect(opt.id)}
              onMouseEnter={e => {
                (e.currentTarget.style as any).boxShadow = hoverStyles.boxShadow as string;
              }}
              onMouseLeave={e => {
                (e.currentTarget.style as any).boxShadow = selectedStyles.boxShadow as any || '';
              }}
              style={{ ...selectedStyles }}
            >
              {opt.imageUrl && showImageEffective && (
                <img
                  src={opt.imageUrl}
                  alt={opt.text || 'opção'}
                  className={`object-cover rounded-md flex-shrink-0 ${imageOrderClass}`}
                  width={imgW}
                  height={imgH}
                  style={{ width: `${imgW}px`, height: `${imgH}px` }}
                  loading="lazy"
                  decoding="async"
                  onError={e => {
                    try {
                      (e.currentTarget as HTMLImageElement).src = safePlaceholder(imgW, imgH, opt.text || 'Imagem');
                    } catch { }
                  }}
                />
              )}
              {showTextEffective && (
                <p
                  className={`${effectiveImageLayout === 'horizontal' ? 'flex-1' : 'text-center'
                    } font-medium`}
                >
                  {opt.text}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OptionsGridBlock;
