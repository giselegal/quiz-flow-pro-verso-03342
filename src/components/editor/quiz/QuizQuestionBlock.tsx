// src/components/editor/quiz/QuizQuestionBlock.tsx
// Bloco específico para renderizar questões baseadas na configuração JSON

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QUIZ_CONFIGURATION } from '@/config/quizConfiguration';
import { useEditor } from '@/context/EditorContext';
import { ArrowRight, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface QuizQuestionBlockProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  properties?: {
    stepIndex?: number;
    selectedOptions?: string[];
    showProgress?: boolean;
    columns?: number;
    quizConfig?: any;
  };
  isEditing?: boolean;
  onUpdate?: (id: string, updates: any) => void;
}

const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({
  id,
  className = '',
  style = {},
  properties = {},
  isEditing = false,
  onUpdate,
}: QuizQuestionBlockProps) => {
  const { activeStageId } = useEditor();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    properties.selectedOptions || []
  );
  const [currentStep, setCurrentStep] = useState<any>(null);

  // Determinar o step atual baseado no activeStageId ou propriedades
  useEffect(() => {
    const stepIndex =
      properties.stepIndex !== undefined ? properties.stepIndex : Number(activeStageId) - 1;

    if (stepIndex >= 0 && stepIndex < QUIZ_CONFIGURATION.steps.length) {
      setCurrentStep(QUIZ_CONFIGURATION.steps[stepIndex]);
    }
  }, [activeStageId, properties.stepIndex]);

  // Função para lidar com seleção de opções
  const handleOptionSelect = (optionId: string) => {
    if (isEditing) return;

    let newSelection: string[] = [];

    if (currentStep?.type === 'questions' && currentStep.rules?.multiSelect > 1) {
      // Multi-seleção
      const maxSelections = currentStep.rules.multiSelect;
      if (selectedOptions.includes(optionId)) {
        newSelection = selectedOptions.filter(id => id !== optionId);
      } else if (selectedOptions.length < maxSelections) {
        newSelection = [...selectedOptions, optionId];
      } else {
        // Substituir a primeira seleção
        newSelection = [optionId, ...selectedOptions.slice(1)];
      }
    } else {
      // Seleção única
      newSelection = selectedOptions.includes(optionId) ? [] : [optionId];
    }

    setSelectedOptions(newSelection);

    if (onUpdate) {
      onUpdate(id, {
        ...properties,
        selectedOptions: newSelection,
      });
    }
  };

  // Função para resetar seleções
  const handleReset = () => {
    setSelectedOptions([]);
    if (onUpdate) {
      onUpdate(id, {
        ...properties,
        selectedOptions: [],
      });
    }
  };

  // Calcular progresso baseado no step atual
  const calculateProgress = () => {
    if (!currentStep) return 0;
    const totalSteps = QUIZ_CONFIGURATION.steps.filter(
      s => s.type !== 'intro' && s.type !== 'result'
    ).length;
    const currentStepNumber = Number(activeStageId) || 1;
    return Math.min((currentStepNumber / totalSteps) * 100, 100);
  };

  // Renderizar baseado no tipo de step
  const renderStepContent = () => {
    if (!currentStep) {
      return (
        <div className="text-center p-6" style={{ color: '#6B4F43' }}>
          <div className="text-sm">Carregando questão...</div>
        </div>
      );
    }

    switch (currentStep.type) {
      case 'intro':
        return renderIntroStep();
      case 'questions':
      case 'strategicQuestions':
        return renderQuestionStep();
      case 'result':
        return renderResultStep();
      default:
        return renderDefaultStep();
    }
  };

  // Renderizar step de introdução
  const renderIntroStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2" style={{ color: '#432818' }}>
          {currentStep.title}
        </h2>
        {currentStep.descriptionTop && (
          <p className="text-sm mb-4" style={{ color: '#6B4F43' }}>
            {currentStep.descriptionTop}
          </p>
        )}
        {currentStep.imageIntro && (
          <div className="mb-4">
            <img
              src={currentStep.imageIntro}
              alt="Introdução"
              className="mx-auto rounded-lg max-h-48 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar step de questões
  const renderQuestionStep = () => {
    const questions = currentStep.questions || [];
    const isMultiSelect = currentStep.rules?.multiSelect > 1;
    const maxSelections = currentStep.rules?.multiSelect || 1;
    const columns = properties.columns || currentStep.rules?.colunas || 1;

    return (
      <div className="space-y-6">
        {/* Header da questão */}
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#432818' }}>
            {currentStep.title}
          </h2>
          {currentStep.description && (
            <p className="text-sm" style={{ color: '#6B4F43' }}>
              {currentStep.description}
            </p>
          )}
          {isMultiSelect && (
            <div className="mt-2">
              <Badge variant="outline" style={{ borderColor: '#B89B7A', color: '#B89B7A' }}>
                Selecione até {maxSelections} opções
              </Badge>
            </div>
          )}
        </div>

        {/* Barra de progresso */}
        {properties.showProgress !== false && currentStep.progressBar?.show && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs" style={{ color: '#6B4F43' }}>
              <span>Progresso</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress
              value={calculateProgress()}
              className="h-2"
              style={{
                backgroundColor: '#E5DDD5',
                ['--progress-foreground' as any]: '#B89B7A',
              }}
            />
          </div>
        )}

        {/* Grid de opções */}
        <div className={`grid gap-3 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {questions.flatMap(
            (question: any) =>
              question.options?.map((option: any) => {
                const isSelected = selectedOptions.includes(option.id);
                return (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-sm ${
                      isSelected ? 'border-2 shadow-sm' : 'border'
                    } ${isEditing ? 'pointer-events-none' : ''}`}
                    style={{
                      borderColor: isSelected ? '#B89B7A' : '#E5DDD5',
                      backgroundColor: isSelected ? '#FAF9F7' : '#FEFEFE',
                    }}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                          {isSelected ? (
                            <CheckCircle2 className="h-4 w-4" style={{ color: '#B89B7A' }} />
                          ) : (
                            <Circle className="h-4 w-4" style={{ color: '#E5DDD5' }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium" style={{ color: '#432818' }}>
                            {option.text}
                          </div>
                          {option.description && (
                            <div className="text-xs mt-1" style={{ color: '#6B4F43' }}>
                              {option.description}
                            </div>
                          )}
                          {option.styleCategory && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {option.styleCategory}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }) || []
          )}
        </div>

        {/* Controles de ação */}
        {selectedOptions.length > 0 && !isEditing && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              style={{ borderColor: '#E5DDD5', color: '#6B4F43' }}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Limpar
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#6B4F43' }}>
                {selectedOptions.length} selecionada{selectedOptions.length !== 1 ? 's' : ''}
              </span>
              <Button size="sm" style={{ backgroundColor: '#B89B7A', color: '#FEFEFE' }}>
                Continuar
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizar step de resultado
  const renderResultStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#432818' }}>
          Seu Estilo Pessoal
        </h2>

        {currentStep.styles && (
          <div className="grid gap-4 mb-6">
            {currentStep.styles.slice(0, 2).map((style: any) => (
              <Card key={style.name} className="border" style={{ borderColor: '#E5DDD5' }}>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-2" style={{ color: '#432818' }}>
                    {style.name}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B4F43' }}>
                    {style.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentStep.cta && (
          <Button
            size="lg"
            className="w-full"
            style={{ backgroundColor: '#B89B7A', color: '#FEFEFE' }}
          >
            {currentStep.cta.text}
          </Button>
        )}
      </div>
    </div>
  );

  // Renderizar step padrão
  const renderDefaultStep = () => (
    <div className="text-center p-6">
      <h2 className="text-lg font-semibold mb-2" style={{ color: '#432818' }}>
        {currentStep.title}
      </h2>
      {currentStep.description && (
        <p className="text-sm" style={{ color: '#6B4F43' }}>
          {currentStep.description}
        </p>
      )}
    </div>
  );

  return (
    <div
      id={id}
      className={`quiz-question-block ${className}`}
      style={{
        backgroundColor: '#FEFEFE',
        borderRadius: '8px',
        padding: '24px',
        border: isEditing ? '2px dashed #B89B7A' : 'none',
        minHeight: '400px',
        ...style,
      }}
    >
      {renderStepContent()}

      {/* Modo de edição */}
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-5 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-medium" style={{ color: '#432818' }}>
              Bloco de Questão do Quiz
            </div>
            <div className="text-xs" style={{ color: '#6B4F43' }}>
              {currentStep?.type || 'Carregando...'} • Etapa {activeStageId}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionBlock;
