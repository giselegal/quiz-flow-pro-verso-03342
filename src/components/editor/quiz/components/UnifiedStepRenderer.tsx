/**
 * 🎯 UNIFIED STEP RENDERER v2.1 - MODULARIZAÇÃO COMPLETA
 *
 * Uso: Em modo edição renderiza componentes modulares (blocos independentes).
 * Em modo preview renderiza os componentes de produção com interatividade real.
 */

import React, { lazy, Suspense, memo, useMemo, useCallback } from 'react';
import { EditableQuizStep } from '../types';
import { adaptStepData, extractStepNumber } from '@/utils/StepDataAdapter';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { computeResult } from '@/utils/result/computeResult';
import type { QuizScores } from '@/hooks/useQuizState';
import { UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';

// Produção (preview)
const IntroStep = lazy(() => import('@/components/quiz/IntroStep'));
const QuestionStep = lazy(() => import('@/components/quiz/QuestionStep'));
const StrategicQuestionStep = lazy(() => import('@/components/quiz/StrategicQuestionStep'));
const TransitionStep = lazy(() => import('@/components/quiz/TransitionStep'));
const ResultStep = lazy(() => import('@/components/quiz/ResultStep'));
const OfferStep = lazy(() => import('@/components/quiz/OfferStep'));

// Modulares (edição)
const ModularIntroStep = lazy(() => import('@/components/editor/quiz-estilo/ModularIntroStep'));
const ModularQuestionStep = lazy(() => import('@/components/editor/quiz-estilo/ModularQuestionStep'));
const ModularStrategicQuestionStep = lazy(() => import('@/components/editor/quiz-estilo/ModularStrategicQuestionStep'));
const ModularTransitionStep = lazy(() => import('@/components/editor/quiz-estilo/ModularTransitionStep'));
const ModularResultStep = lazy(() => import('@/components/editor/quiz-estilo/ModularResultStep'));
const ModularOfferStep = lazy(() => import('@/components/editor/quiz-estilo/ModularOfferStep'));

// UI do overlay de edição
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StepLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export interface UnifiedStepRendererProps {
  step: EditableQuizStep;
  mode: 'edit' | 'preview';

  // Edição
  isSelected?: boolean;
  onStepClick?: (e: React.MouseEvent, step: EditableQuizStep) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;

  // Preview (interatividade)
  sessionData?: Record<string, any>;
  onUpdateSessionData?: (key: string, value: any) => void;
}

const UnifiedStepRendererComponent: React.FC<UnifiedStepRendererProps> = ({
  step,
  mode,
  isSelected,
  onStepClick,
  onDelete,
  onDuplicate,
  sessionData = {},
  onUpdateSessionData,
}) => {
  const isEditMode = mode === 'edit';
  const isPreviewMode = mode === 'preview';

  // Adaptar dados do step para o formato esperado dos componentes
  // SEMPRE usar 'merge' no editor para preservar metadata de edição
  // O modo 'production-only' só deve ser usado no runtime final (fora do editor)
  const stepData = adaptStepData(step, { source: 'merge', editorMode: true });

  // Helper: extrair respostas salvas no preview (answers_<stepId> => string[])
  const getPreviewAnswers = useCallback((): Record<string, string[]> => {
    const map: Record<string, string[]> = {};
    try {
      Object.keys(sessionData || {}).forEach((k) => {
        if (k.startsWith('answers_')) {
          const stepId = k.replace(/^answers_/, '');
          const arr = sessionData[k];
          if (Array.isArray(arr) && arr.length > 0) {
            map[stepId] = arr.filter(Boolean);
          }
        }
      });
    } catch { }
    return map;
  }, [sessionData]);

  // Provider opcional do Editor para seleção/persistência de blocos reais
  const editor = useEditor({ optional: true } as any);
  const stepKey = useMemo(() => step?.id || '', [step?.id]);

  // 🎯 FASE 3: Buscar blocos modulares do EditorProvider
  const stepBlocks = useMemo(() => {
    try {
      const blocks: any[] = editor?.state?.stepBlocks?.[stepKey] || [];
      return blocks.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch {
      return [];
    }
  }, [editor?.state?.stepBlocks, stepKey]);

  // 🎯 FASE 3: Garantir que blocos sejam carregados no modo edição
  React.useEffect(() => {
    if (isEditMode && editor?.actions?.ensureStepLoaded && stepKey) {
      editor.actions.ensureStepLoaded(stepKey);
    }
  }, [stepKey, isEditMode, editor]);

  // Helper: procurar primeiro bloco do tipo desejado no provider
  const findBlockIdByTypes = useCallback((types: string[]): string | undefined => {
    try {
      const blocks: any[] = editor?.state?.stepBlocks?.[stepKey] || [];
      const lowerTypes = types.map(t => t.toLowerCase());
      const found = blocks.find(b => lowerTypes.includes(String(b.type || '').toLowerCase()));
      return found?.id;
    } catch {
      return undefined;
    }
  }, [editor?.state?.stepBlocks, stepKey]);

  // Helper: busca por predicado customizado
  const findBlockId = useCallback((predicate: (b: any) => boolean): string | undefined => {
    try {
      const blocks: any[] = editor?.state?.stepBlocks?.[stepKey] || [];
      const found = blocks.find(predicate);
      return found?.id;
    } catch {
      return undefined;
    }
  }, [editor?.state?.stepBlocks, stepKey]);

  // Mapear IDs lógicos dos blocos para tipos reais do registry
  const resolveRealBlockId = useCallback((logicalId: string): string | undefined => {
    // Normalização: aceitar IDs completos com prefixo do step (ex.: "step-20-congrats")
    const normalize = (id: string): string => {
      const lower = String(id || '').toLowerCase();
      // Mapeamentos por sufixo para RESULT
      if (/-congrats$/.test(lower)) return 'result-congrats';
      if (/(^|-)result$/.test(lower)) return 'result-main';
      if (/-image$/.test(lower)) return 'result-image';
      if (/-description$/.test(lower)) return 'result-description';
      if (/-characteristics$/.test(lower)) return 'result-characteristics';
      if (/-cta$/.test(lower)) return 'result-cta';
      return lower;
    };

    const key = normalize(logicalId);
    switch (key) {
      // INTRO (step-01)
      case 'intro-header': {
        return (
          findBlockIdByTypes(['quiz-intro-header'])
          || findBlockIdByTypes(['quiz-logo'])
          || findBlockIdByTypes(['decorative-bar-inline'])
        );
      }
      case 'intro-title': {
        // Título: text-inline com id contendo 'text-inline' (evitar 'text-description' e 'footer')
        return (
          findBlockId(b => String(b.type || '').toLowerCase() === 'text-inline' && /text-inline/i.test(String(b.id)))
        );
      }
      case 'intro-image': {
        return findBlockIdByTypes(['image-display-inline']);
      }
      case 'intro-description': {
        // Descrição: text-inline com id contendo 'text-description'
        return findBlockId(b => String(b.type || '').toLowerCase() === 'text-inline' && /text-description/i.test(String(b.id)));
      }
      case 'intro-form': {
        // Form principal: prioriza input; botão pode ficar próximo
        return (
          findBlockIdByTypes(['form-input'])
          || findBlockIdByTypes(['button-inline'])
        );
      }
      case 'intro-footer': {
        // Footer: text-inline com id contendo 'footer-text'
        return findBlockId(b => String(b.type || '').toLowerCase() === 'text-inline' && /footer-text/i.test(String(b.id)));
      }

      case 'question-number':
      case 'question-text': {
        // Cabeçalho de pergunta concentra campos de número/texto
        return findBlockIdByTypes(['quiz-question-header']);
      }
      case 'question-instructions': {
        // Tentativas comuns para instruções; fallback no header
        return (
          findBlockIdByTypes(['text-inline', 'paragraph', 'quiz-question-header'])
          || undefined
        );
      }
      case 'question-options': {
        // Preferir quiz-options; fallback options-grid
        return findBlockIdByTypes(['quiz-options', 'options-grid']);
      }
      case 'question-button': {
        // Navegação do quiz (botões próximo/anterior)
        return findBlockIdByTypes(['quiz-navigation', 'button']);
      }

      // RESULT (ex.: step-20)
      case 'result-congrats': {
        // Título/Parabéns: texto simples
        return (
          findBlockIdByTypes(['title', 'text-inline', 'paragraph'])
        );
      }
      case 'result-main': {
        // Bloco principal do resultado (hero/título grande)
        return (
          findBlockIdByTypes(['result-hero', 'title', 'text-inline'])
        );
      }
      case 'result-image': {
        return (
          findBlockIdByTypes(['image-display-inline', 'image'])
        );
      }
      case 'result-description': {
        return (
          // Preferir text-inline com id contendo 'result'/'description'
          findBlockId(b => String(b.type || '').toLowerCase() === 'text-inline' && /result|description/i.test(String(b.id)))
          || findBlockIdByTypes(['text-inline', 'paragraph'])
        );
      }
      case 'result-characteristics': {
        return (
          findBlockIdByTypes(['feature-list', 'list-inline', 'bullet-list'])
          || findBlockIdByTypes(['text-inline'])
        );
      }
      case 'result-cta': {
        return (
          findBlockIdByTypes(['button-inline', 'button', 'quiz-navigation'])
        );
      }
      default:
        return undefined;
    }
  }, [findBlockIdByTypes, findBlockId]);

  // Abrir painel de propriedades: selecionar bloco real via provider
  const handleOpenProperties = useCallback((logicalBlockId: string) => {
    const realId = resolveRealBlockId(logicalBlockId);
    if (realId && editor?.actions?.setSelectedBlockId) {
      editor.actions.setSelectedBlockId(realId);
    }
  }, [editor?.actions, resolveRealBlockId]);

  // Callbacks para persistência (no futuro: integrar com EditorProvider)
  const handleEdit = (field: string, value: any) => {
    // Patch dentro de metadata por padrão
    (stepData as any).metadata = {
      ...((stepData as any).metadata || {}),
      [field]: value,
    };
  };
  const handleBlocksReorder = (stepId: string, newOrder: string[]) => {
    // 1) Persistir preferência de ordem na camada de dados do step (para o UI modular)
    handleEdit('blockOrder', newOrder);

    // 2) Se houver provider do editor, reordenar os blocos reais conforme possível
    try {
      if (!editor?.actions?.reorderBlocks || !editor?.state?.stepBlocks) return;

      const blocks: any[] = editor.state.stepBlocks[stepKey] || [];
      if (!Array.isArray(blocks) || blocks.length === 0) return;

      // Mapear ordem lógica -> IDs reais (deduplicado, pois alguns lógicos mapeiam ao mesmo bloco real)
      const desiredRealOrder: string[] = [];
      for (const logicalId of newOrder) {
        const realId = resolveRealBlockId(logicalId);
        if (realId && !desiredRealOrder.includes(realId)) {
          desiredRealOrder.push(realId);
        }
      }

      // Construir array mutável com a ordem atual de IDs reais
      const currentIds: string[] = blocks.map(b => String(b.id));

      // Índice base: manter itens anteriores fixos (ex.: header/logo/progress)
      const currentIndices = desiredRealOrder
        .map(id => currentIds.indexOf(id))
        .filter(idx => idx >= 0);
      const baseIndex = currentIndices.length > 0 ? Math.min(...currentIndices) : 0;

      // Helper para simular movimentação local acompanhando as chamadas ao provider
      const moveLocal = (arr: string[], from: number, to: number) => {
        const item = arr.splice(from, 1)[0];
        arr.splice(to, 0, item);
      };

      // Reposicionar, na sequência, cada alvo na posição desejada
      (async () => {
        for (let i = 0; i < desiredRealOrder.length; i++) {
          const targetId = desiredRealOrder[i];
          const currentIndex = currentIds.indexOf(targetId);
          if (currentIndex === -1) continue; // bloco não existe no provider
          const targetIndex = baseIndex + i;
          if (currentIndex !== targetIndex) {
            await editor.actions.reorderBlocks(stepKey, currentIndex, targetIndex);
            moveLocal(currentIds, currentIndex, targetIndex);
          }
        }
      })();
    } catch (err) {
      console.warn('Falha ao aplicar reordenação no provider, seguirá apenas metadata:', err);
    }
  };

  // Renderizar componente correspondente ao tipo
  const renderStepComponent = () => {
    switch (step.type) {
      case 'intro': {
        if (isEditMode) {
          return (
            <ModularIntroStep
              data={stepData as any}
              isEditable={true}
              onEdit={handleEdit}
              onBlocksReorder={handleBlocksReorder}
              onOpenProperties={handleOpenProperties}
            />
          );
        }
        return (
          <IntroStep
            data={stepData as any}
            onNameSubmit={(name: string) => {
              if (isPreviewMode && onUpdateSessionData) {
                onUpdateSessionData('userName', name);
              }
            }}
          />
        );
      }

      case 'question': {
        if (isEditMode) {
          return (
            <ModularQuestionStep
              data={stepData as any}
              isEditable={true}
              currentAnswers={sessionData[`answers_${step.id}`] || []}
              onEdit={handleEdit}
              onBlocksReorder={handleBlocksReorder}
              onOpenProperties={handleOpenProperties}
            />
          );
        }
        return (
          <QuestionStep
            data={stepData as any}
            currentAnswers={sessionData[`answers_${step.id}`] || []}
            onAnswersChange={(answers: string[]) => {
              if (isPreviewMode && onUpdateSessionData) {
                onUpdateSessionData(`answers_${step.id}`, answers);
              }
            }}
          />
        );
      }

      case 'strategic-question': {
        if (isEditMode) {
          return (
            <ModularStrategicQuestionStep
              data={stepData as any}
              isEditable={true}
              currentAnswer={sessionData[`answer_${step.id}`] || ''}
              onEdit={handleEdit}
              onBlocksReorder={handleBlocksReorder}
              onOpenProperties={handleOpenProperties}
            />
          );
        }
        return (
          <StrategicQuestionStep
            data={stepData as any}
            currentAnswer={sessionData[`answer_${step.id}`] || ''}
            onAnswerChange={(answer: string) => {
              if (isPreviewMode && onUpdateSessionData) {
                onUpdateSessionData(`answer_${step.id}`, answer);
              }
            }}
          />
        );
      }

      case 'transition':
      case 'transition-result': {
        if (isEditMode) {
          // 🎯 RENDERIZAR BLOCOS ATÔMICOS INDIVIDUAIS
          if (stepBlocks.length > 0) {
            return (
              <div className="space-y-4 p-4">
                {stepBlocks.map(block => (
                  <UniversalBlockRenderer
                    key={block.id}
                    block={block}
                    isSelected={editor?.state?.selectedBlockId === block.id}
                    onUpdate={(id: string, updates: any) => editor?.actions?.updateBlock?.(stepKey, id, updates)}
                    onDelete={(id: string) => editor?.actions?.removeBlock?.(stepKey, id)}
                    onSelect={(id: string) => editor?.actions?.setSelectedBlockId?.(id)}
                  />
                ))}
              </div>
            );
          }
          // Fallback para componente modular se não houver blocos
          return (
            <ModularTransitionStep
              data={{ ...stepData, type: step.type } as any}
              isEditable={true}
            />
          );
        }
        return (
          <TransitionStep
            data={{ ...stepData, type: step.type } as any}
            onComplete={() => {
              if (isPreviewMode && onUpdateSessionData) {
                onUpdateSessionData('transitionComplete', true);
              }
            }}
          />
        );
      }

      case 'result': {
        if (isEditMode) {
          // 🎯 RENDERIZAR BLOCOS ATÔMICOS INDIVIDUAIS
          if (stepBlocks.length > 0) {
            return (
              <div className="space-y-4 p-4">
                {stepBlocks.map(block => (
                  <UniversalBlockRenderer
                    key={block.id}
                    block={block}
                    isSelected={editor?.state?.selectedBlockId === block.id}
                    onUpdate={(id: string, updates: any) => editor?.actions?.updateBlock?.(stepKey, id, updates)}
                    onDelete={(id: string) => editor?.actions?.removeBlock?.(stepKey, id)}
                    onSelect={(id: string) => editor?.actions?.setSelectedBlockId?.(id)}
                  />
                ))}
              </div>
            );
          }
          // Fallback para componente modular se não houver blocos
          return (
            <ModularResultStep
              data={stepData as any}
              isEditable={true}
              userProfile={{
                userName: sessionData.userName || 'Visitante',
                resultStyle: sessionData.resultStyle || 'natural',
                secondaryStyles: sessionData.secondaryStyles || [],
              }}
              onOpenProperties={handleOpenProperties}
            />
          );
        }
        // Preview: calcular resultado real a partir das respostas atuais
        const answers = getPreviewAnswers();
        const { primaryStyleId, secondaryStyleIds, scores } = computeResult({ answers });
        const typedScores: QuizScores = {
          natural: (scores as any).natural || 0,
          classico: (scores as any).classico || 0,
          contemporaneo: (scores as any).contemporaneo || 0,
          elegante: (scores as any).elegante || 0,
          romantico: (scores as any).romantico || 0,
          sexy: (scores as any).sexy || 0,
          dramatico: (scores as any).dramatico || 0,
          criativo: (scores as any).criativo || 0,
        };
        return (
          <ResultStep
            data={stepData as any}
            userProfile={{
              userName: sessionData.userName || 'Visitante',
              resultStyle: primaryStyleId || sessionData.resultStyle || 'natural',
              secondaryStyles: secondaryStyleIds?.length ? secondaryStyleIds : (sessionData.secondaryStyles || []),
            }}
            scores={typedScores}
          />
        );
      }

      case 'offer': {
        if (isEditMode) {
          return (
            <ModularOfferStep
              data={stepData as any}
              isEditable={true}
              userProfile={{
                userName: sessionData.userName || 'Visitante',
                resultStyle: sessionData.resultStyle || 'natural',
                secondaryStyles: sessionData.secondaryStyles || [],
              }}
              offerKey={sessionData.offerKey || 'default'}
            />
          );
        }
        // Preview: alinhar oferta ao resultado calculado atual
        const answers = getPreviewAnswers();
        const { primaryStyleId, secondaryStyleIds } = computeResult({ answers });
        return (
          <OfferStep
            data={stepData as any}
            userProfile={{
              userName: sessionData.userName || 'Visitante',
              resultStyle: primaryStyleId || sessionData.resultStyle || 'natural',
            }}
            offerKey={sessionData.offerKey || 'default'}
          />
        );
      }

      default:
        return (
          <div className="p-8 text-center bg-gray-100 rounded-lg">
            <p className="text-gray-600">
              Tipo de step desconhecido: <code>{step.type}</code>
            </p>
          </div>
        );
    }
  };

  // EDIT MODE: Step com overlay de edição
  if (isEditMode) {
    return (
      <div
        className={`relative group transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
        onClick={(e) => onStepClick?.(e, step)}
        data-step-id={step.id}
      >
        {/* Overlay de edição */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border p-1">
            {/* Drag handle */}
            <Button
              variant="ghost"
              size="sm"
              className="cursor-grab active:cursor-grabbing h-8 w-8 p-0"
            >
              <GripVertical className="w-4 h-4" />
            </Button>

            {/* Delete */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            {/* Duplicate */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.();
              }}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Badge de tipo */}
        <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          {step.type}
        </div>

        {/* Conteúdo real - eventos liberados no modo edição */}
        <div>
          <Suspense fallback={<StepLoadingFallback />}>
            {renderStepComponent()}
          </Suspense>
        </div>
      </div>
    );
  }

  // PREVIEW MODE: Step totalmente interativo
  return (
    <div data-step-id={step.id}>
      <Suspense fallback={<StepLoadingFallback />}>
        {renderStepComponent()}
      </Suspense>
    </div>
  );
};

export const UnifiedStepRenderer = memo(UnifiedStepRendererComponent);

export default UnifiedStepRenderer;
