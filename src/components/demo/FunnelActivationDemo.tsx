import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFunnelStageActivation } from '@/utils/FunnelStageActivator';
import { ArrowRight, CheckCircle, ShoppingBag, User } from 'lucide-react';

/**
 * Componente de Demonstração do Sistema de Ativação de Etapas
 */
export function FunnelActivationDemo() {
  const {
    activatedStages,
    progressStats,
    registerAnswer,
    registerFieldFilled,
    isStageActivated,
    reset,
  } = useFunnelStageActivation();

  const [userName, setUserName] = React.useState('');
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({});
  const [currentStep, setCurrentStep] = React.useState(1);

  const handleNameChange = (value: string) => {
    setUserName(value);
    if (value.trim().length >= 2) {
      registerFieldFilled('userName', value);
    }
  };

  const handleAnswerToggle = (stepNumber: number, option: string) => {
    const currentAnswers = answers[`step-${stepNumber}`] || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter(a => a !== option)
      : [...currentAnswers, option];

    setAnswers({
      ...answers,
      [`step-${stepNumber}`]: newAnswers,
    });

    if (newAnswers.length > 0) {
      registerAnswer(`q${stepNumber}`, newAnswers, stepNumber);
    }
  };

  const questionData = {
    2: {
      title: 'Q1: Que tipo de roupa você prefere?',
      options: ['Casual', 'Formal', 'Esportiva', 'Boho', 'Clássica', 'Moderna'],
    },
    3: {
      title: 'Q2: Qual seu estilo preferido?',
      options: ['Elegante', 'Confortável', 'Arrojado', 'Minimalista', 'Romântico', 'Urbano'],
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            Demo: Quiz de Estilo (21 Etapas)
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progressStats.completionRate}%</span>
              <span>Etapas: {activatedStages.length}/21</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Introdução
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Seu nome:</Label>
              <Input
                id="userName"
                value={userName}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>

            {userName.length >= 2 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Próxima etapa ativada!</span>
              </div>
            )}

            {isStageActivated(2) && (
              <Button onClick={() => setCurrentStep(2)}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep >= 2 && currentStep <= 3 && isStageActivated(currentStep) && (
        <Card>
          <CardHeader>
            <CardTitle>{questionData[currentStep as keyof typeof questionData]?.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {questionData[currentStep as keyof typeof questionData]?.options.map(option => {
                const isSelected = (answers[`step-${currentStep}`] || []).includes(option);

                return (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${currentStep}-${option}`}
                      checked={isSelected}
                      onCheckedChange={() => handleAnswerToggle(currentStep, option)}
                    />
                    <Label htmlFor={`${currentStep}-${option}`}>{option}</Label>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Debug:</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button size="sm" variant="outline" onClick={reset}>
            Reset
          </Button>
          <div className="text-xs text-gray-500 ml-auto">Ativas: {activatedStages.join(', ')}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FunnelActivationDemo;
