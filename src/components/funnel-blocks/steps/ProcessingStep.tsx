import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';

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
        "relative min-h-[50vh] flex flex-col items-center justify-center p-6",
        backgroundColor,
        className
      )}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      <div className="max-w-lg mx-auto text-center space-y-8">
        {/* Título */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        
        {/* Animação de processamento */}
        <div className="py-8">
          {showAnimatedIcons ? (
            <div className="relative h-24 w-24 mx-auto">
              {/* Círculos concêntricos pulsando */}
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping-slow"></div>
              <div className="absolute inset-2 rounded-full bg-indigo-500/40 animate-ping-medium"></div>
              <div className="absolute inset-4 rounded-full bg-indigo-500/60 animate-ping-fast"></div>
              
              {/* Ícone central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>
        
        {/* Texto de processamento */}
        <p className="text-gray-600">
          {processingText}
        </p>
      </div>
      
      {/* Indicador de edição */}
      {isEditable && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Editar
        </div>
      )}
      
      <style jsx>{`
        @keyframes pingSlowly {
          0% { transform: scale(0.95); opacity: 1; }
          50% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 1; }
        }
        @keyframes pingMedium {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
        @keyframes pingQuickly {
          0% { transform: scale(0.8); opacity: 0.9; }
          50% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(0.8); opacity: 0.9; }
        }
        .animate-ping-slow {
          animation: pingSlowly 3s infinite ease-in-out;
        }
        .animate-ping-medium {
          animation: pingMedium 2.5s infinite ease-in-out;
        }
        .animate-ping-fast {
          animation: pingQuickly 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProcessingStep;
