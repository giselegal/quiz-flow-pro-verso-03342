import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { StepConfiguration, calculateProgress } from './StepConfigurations';

interface DynamicStepTemplateProps {
  stepNumber: number;
  questionData: StepConfiguration;
  progressValue?: number;
  onNext?: (answers: Record<string, any>) => void;
  onPrevious?: () => void;
  onAnswer?: (questionId: string, answer: any) => void;
  currentAnswers?: Record<string, any>;
  className?: string;
}

export const DynamicStepTemplate: React.FC<DynamicStepTemplateProps> = ({
  stepNumber,
  questionData,
  progressValue,
  onNext,
  onPrevious,
  onAnswer,
  currentAnswers = {},
  className = '',
}) => {
  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>(currentAnswers);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const calculatedProgress = progressValue ?? calculateProgress(stepNumber);

  const handleOptionSelect = useCallback(
    (optionId: string, optionValue: any) => {
      setSelectedOption(optionId);
      const newAnswers = { ...localAnswers, [questionData.stepId]: optionValue };
      setLocalAnswers(newAnswers);
      onAnswer?.(questionData.stepId, optionValue);
    },
    [localAnswers, questionData.stepId, onAnswer]
  );

  const handleNext = useCallback(() => {
    onNext?.(localAnswers);
  }, [localAnswers, onNext]);

  const renderContent = () => {
    switch (questionData.type) {
      case 'intro':
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-brand">{questionData.title}</h1>
              <p className="text-xl text-brand/80 max-w-2xl mx-auto">{questionData.subtitle}</p>
            </div>
            <Button onClick={handleNext} size="lg" className="px-8 py-3 text-lg">
              Começar Quiz
            </Button>
          </div>
        );

      case 'question':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-brand">{questionData.title}</h2>
              {questionData.subtitle && (
                <p className="text-lg text-brand/70 max-w-2xl mx-auto">{questionData.subtitle}</p>
              )}
            </div>

            <div className="grid gap-4 max-w-2xl mx-auto">
              {questionData.options?.map(option => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedOption === option.id
                      ? 'ring-2 ring-brand bg-brand/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleOptionSelect(option.id, option.value)}
                >
                  <CardContent className="p-6">
                    <p className="text-lg font-medium text-center">{option.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'capture':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-brand">{questionData.title}</h2>
              {questionData.subtitle && (
                <p className="text-lg text-brand/70 max-w-2xl mx-auto">{questionData.subtitle}</p>
              )}
            </div>

            <Card className="max-w-md mx-auto">
              <CardHeader>
                <h3 className="text-xl font-semibold text-center">Suas informações</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {questionData.fields?.map(field => (
                  <div key={field.name}>
                    <label className="text-sm font-medium text-brand">
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={localAnswers[field.name] || ''}
                      onChange={e => {
                        const newAnswers = { ...localAnswers, [field.name]: e.target.value };
                        setLocalAnswers(newAnswers);
                        onAnswer?.(field.name, e.target.value);
                      }}
                      className="mt-1"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 'result':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-brand">{questionData.title}</h1>
              <p className="text-xl text-brand/80 max-w-2xl mx-auto">{questionData.subtitle}</p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-2xl font-bold">Parabéns! Quiz concluído</h3>
                  <p className="text-lg text-muted-foreground">
                    Seus resultados foram processados com sucesso.
                  </p>
                  <Button size="lg" className="px-8">
                    Ver Resultados Detalhados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Tipo de step não reconhecido: {questionData.type}
            </p>
          </div>
        );
    }
  };

  const canProceed = () => {
    if (questionData.type === 'question') {
      return selectedOption !== null;
    }
    if (questionData.type === 'capture') {
      return questionData.fields?.every(field => {
        return !field.required || localAnswers[field.name];
      });
    }
    return true;
  };

  return (
    <div
      className={`min-h-screen p-8 ${className}`}
      style={{
        background: questionData.theme.backgroundColor,
        color: questionData.theme.textColor,
      }}
    >
      {/* Progress Bar */}
      {questionData.showProgress && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Etapa {stepNumber} de 21</span>
            <span className="text-sm">{calculatedProgress}%</span>
          </div>
          <Progress value={calculatedProgress} className="h-2" />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">{renderContent()}</div>

      {/* Navigation */}
      {questionData.showNavigation && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-4">
            {stepNumber > 1 && onPrevious && (
              <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
            )}

            {stepNumber < 21 && onNext && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
