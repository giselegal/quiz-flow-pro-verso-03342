import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

/**
 * QuizTransitionStep - Etapa 15: Transição entre quiz e resultado
 * 
 * Este componente exibe uma tela de transição entre o quiz e o resultado,
 * com uma mensagem e animação de carregamento.
 */
export const QuizTransitionStep: React.FC<FunnelStepProps> = ({
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
    title = 'Analisando suas respostas...',
    messages = [
      'Processando suas escolhas...',
      'Identificando padrões...',
      'Gerando seu resultado personalizado...',
      'Quase pronto...'
    ],
    autoAdvanceDelay = 5, // segundos
    backgroundColor = 'bg-gradient-to-b from-indigo-50 to-indigo-200'
  } = data;
  
  // Estado para mensagens de carregamento
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Efeito para avançar mensagens e progress bar
  useEffect(() => {
    if (isEditable) return;
    
    // Intervalo para trocar mensagens
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        if (prev >= messages.length - 1) {
          clearInterval(messageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, (autoAdvanceDelay * 1000) / (messages.length + 1));
    
    // Intervalo para atualizar a barra de progresso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 1;
      });
    }, (autoAdvanceDelay * 1000) / 100);
    
    // Avançar automaticamente após o tempo definido
    const timer = setTimeout(() => {
      if (onNext) onNext();
    }, autoAdvanceDelay * 1000);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [isEditable, messages, autoAdvanceDelay, onNext]);

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
          
          {/* Área de animação/loading */}
          <div className="py-6">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-[#B89B7A]" />
            </div>
          </div>
          
          {/* Mensagens de carregamento */}
          <div className="h-12">
            <p className="text-gray-600 animate-pulse transition-opacity duration-500">
              {messages[currentMessage]}
            </p>
          </div>
          
          {/* Barra de progresso */}
          <div className="space-y-2">
            <Progress 
              percent={progress} 
              className="w-full"
              showInfo={false}
            />
            <p className="text-sm text-gray-500">{progress}% completo</p>
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

export default QuizTransitionStep;
