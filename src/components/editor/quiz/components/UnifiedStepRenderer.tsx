/**
 * 🎯 UNIFIED STEP RENDERER v2.1 - MODULARIZAÇÃO COMPLETA
 *
 * Uso: Em modo edição renderiza componentes modulares (blocos independentes).
 * Em modo preview renderiza os componentes de produção com interatividade real.
 */

import React, { lazy, Suspense, memo } from 'react';
import { EditableQuizStep } from '../types';
import { adaptStepData } from '@/utils/StepDataAdapter';

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
  const stepData = adaptStepData(step);

  // Callbacks para persistência (no futuro: integrar com EditorProvider)
  const handleEdit = (field: string, value: any) => {
    // Patch dentro de metadata por padrão
    (stepData as any).metadata = {
      ...((stepData as any).metadata || {}),
      [field]: value,
    };
  };
  const handleBlocksReorder = (stepId: string, newOrder: string[]) => {
    handleEdit('blockOrder', newOrder);
  };

  // Renderizar componente correspondente ao tipo
  const renderStepComponent = () => {
    switch (step.type) {
      case 'intro': {
        if (isEditMode) {
          return (
            <ModularIntroStep data={stepData as any} isEditable={true} />
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
          return (
            <ModularResultStep
              data={stepData as any}
              isEditable={true}
              userProfile={{
                userName: sessionData.userName || 'Visitante',
                resultStyle: sessionData.resultStyle || 'natural',
                secondaryStyles: sessionData.secondaryStyles || [],
              }}
            />
          );
        }
        return (
          <ResultStep
            data={stepData as any}
            userProfile={{
              userName: sessionData.userName || 'Visitante',
              resultStyle: sessionData.resultStyle || 'natural',
              secondaryStyles: sessionData.secondaryStyles || [],
            }}
            scores={sessionData.scores}
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
        return (
          <OfferStep
            data={stepData as any}
            userProfile={{
              userName: sessionData.userName || 'Visitante',
              resultStyle: sessionData.resultStyle || 'natural',
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
