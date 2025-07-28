import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

/**
 * ProcessingStep - Etapa 16: Processamento do resultado
 * 
 * Este componente exibe uma tela de processamento com animações
 * e efeitos visuais para gerar expectativa sobre o resultado.
 */
export const ProcessingStep: React.FC<FunnelStepProps> = ({
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
    title = 'Preparando seu resultado...',
    processingText = 'Estamos gerando um resultado personalizado com base nas suas respostas.',
    autoAdvanceDelay = 3, // segundos
    showAnimatedIcons = true,
    backgroundColor = 'bg-white'
  } = data;
  
  // Avançar automaticamente após o tempo definido
  useEffect(() => {
    if (isEditable) return;
    
    const timer = setTimeout(() => {
      if (onNext) onNext();
    }, autoAdvanceDelay * 1000);
    
    return () => clearTimeout(timer);
  }, [isEditable, autoAdvanceDelay, onNext]);

  return (
    <div 
      className={cn(
        "min-h-screen flex items-center justify-center p-6",
        backgroundColor,
        className
      )}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="text-center space-y-8 py-12">
          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          
          {/* Animação de processamento */}
          <div className="py-8">
            {showAnimatedIcons ? (
              <div className="relative h-24 w-24 mx-auto">
                {/* Círculos concêntricos pulsando */}
                <div className="absolute inset-0 rounded-full bg-[#B89B7A]/20 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-[#B89B7A]/40 animate-pulse delay-75"></div>
                <div className="absolute inset-4 rounded-full bg-[#B89B7A]/60 animate-pulse delay-150"></div>
                
                {/* Ícone central */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="w-12 h-12 text-[#B89B7A] animate-spin" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#B89B7A]"></div>
              </div>
            )}
          </div>
          
          {/* Texto de processamento */}
          <p className="text-gray-600 text-lg">
            {processingText}
          </p>
          
          {/* Barra de progresso simulada */}
          <div className="space-y-2">
            <Progress 
              percent={100} 
              className="w-full"
              showInfo={false}
            />
            <p className="text-sm text-gray-500">Quase pronto...</p>
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

export default ProcessingStep;
