import React from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

/**
 * QuizIntroStep - Etapa 3: Introdução às perguntas do quiz
 * 
 * Esta etapa apresenta uma introdução às perguntas que virão a seguir,
 * explicando o propósito do quiz e o que o usuário pode esperar.
 */
export const QuizIntroStep: React.FC<FunnelStepProps> = ({
  id,
  className = '',
  isEditable = false,
  onNext,
  stepNumber,
  totalSteps,
  data = {},
  onEdit
}) => {
  const {
    title = 'Descubra seu estilo ideal',
    description = 'Responda as próximas perguntas com sinceridade para obtermos um resultado preciso e personalizado para você.',
    buttonText = 'Iniciar questionário',
    imageUrl,
    bullets = [
      'São apenas 10 perguntas rápidas',
      'Leva menos de 3 minutos',
      'Resultado personalizado imediato'
    ]
  } = data;

  return (
    <div 
      className={cn(
        "min-h-screen flex items-center justify-center p-6",
        className
      )}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center space-y-2">
          <Badge variant="secondary" className="w-fit mx-auto">
            Etapa {stepNumber} de {totalSteps}
          </Badge>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Lado esquerdo - Texto */}
            <div className="flex-1 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h2>
              
              <p className="text-gray-600 text-lg">
                {description}
              </p>
              
              {/* Lista de bullets */}
              <ul className="space-y-3">
                {bullets.map((item: string, index: number) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1.5 flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={isEditable ? undefined : onNext}
                size="lg"
                className="w-full md:w-auto bg-[#B89B7A] hover:bg-[#A38967]"
                disabled={isEditable}
              >
                {buttonText}
              </Button>
            </div>
            
            {/* Lado direito - Imagem */}
            {imageUrl && (
              <div className="flex-1 flex justify-center">
                <div className="relative w-64 h-64">
                  <img
                    src={imageUrl}
                    alt="Quiz intro"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Indicador de edição */}
      {isEditable && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
          Modo de Edição
        </div>
      )}
    </div>
  );
};

export default QuizIntroStep;
