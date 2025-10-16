/**
 * 🎯 UNIFIED STEP RENDERER - MODULARIZAÇÃO FASE 2
 * 
 * Renderiza steps usando os componentes reais de produção:
 * - IntroStep, QuestionStep, StrategicQuestionStep, TransitionStep, ResultStep, OfferStep
 * 
 * WYSIWYG 100% Real: Edit e Preview renderizam EXATAMENTE os mesmos componentes
 */

import React, { memo } from 'react';
import { EditableQuizStep } from '../types';

// Componentes reais de produção
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import TransitionStep from '@/components/quiz/TransitionStep';
import ResultStep from '@/components/quiz/ResultStep';
import OfferStep from '@/components/quiz/OfferStep';

// Ícones para overlay de edição
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface UnifiedStepRendererProps {
  step: EditableQuizStep;
  mode: 'edit' | 'preview';
  
  // Props para modo edição
  isSelected?: boolean;
  onStepClick?: (e: React.MouseEvent, step: EditableQuizStep) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  
  // Props para modo preview (interatividade)
  sessionData?: Record<string, any>;
  onUpdateSessionData?: (key: string, value: any) => void;
}

/**
 * Extrai dados necessários para cada tipo de step a partir do EditableQuizStep
 */
const extractStepData = (step: EditableQuizStep) => {
  // Tentar extrair dos metadata primeiro, depois fallback para step direto
  const metadata = (step as any).metadata || {};
  
  return {
    type: step.type,
    title: metadata.title || step.title,
    questionNumber: metadata.questionNumber,
    questionText: metadata.questionText || metadata.question,
    formQuestion: metadata.formQuestion,
    placeholder: metadata.placeholder,
    buttonText: metadata.buttonText,
    text: metadata.text || metadata.description,
    image: metadata.image || metadata.imageUrl,
    requiredSelections: metadata.requiredSelections || 1,
    options: metadata.options || [],
    nextStep: step.nextStep,
    offerMap: (step as any).offerMap,
    showContinueButton: metadata.showContinueButton,
    continueButtonText: metadata.continueButtonText,
    duration: metadata.duration,
  };
};

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

  const stepData = extractStepData(step);

  // Renderizar o componente correto baseado no tipo
  const renderStepComponent = () => {
    switch (step.type) {
      case 'intro':
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

      case 'question':
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

      case 'strategic-question':
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

      case 'transition':
      case 'transition-result':
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

      case 'result':
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

      case 'offer':
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
        className={`relative group transition-all ${
          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
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

        {/* Componente real */}
        <div className="pointer-events-none">
          {renderStepComponent()}
        </div>
      </div>
    );
  }

  // PREVIEW MODE: Step totalmente interativo
  return (
    <div data-step-id={step.id}>
      {renderStepComponent()}
    </div>
  );
};

export const UnifiedStepRenderer = memo(UnifiedStepRendererComponent);

export default UnifiedStepRenderer;
