// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';

/**
 * ProcessingStep - Etapa de processamento
 *
 * Simula o processamento de dados, exibindo mensagens
 * e uma barra de progresso opcional.
 */
export const ProcessingStep: React.FC<FunnelStepProps> = ({
  id,
  className = '',
  isEditable = false,
  onNext,
  stepNumber,
  totalSteps,
  data = {},
  onEdit,
}) => {
  const {
    title = 'Processando seu resultado...',
    messages = [
      'Analisando suas preferências...',
      'Calculando compatibilidade...',
      'Preparando resultado personalizado...',
    ],
    showProgress = true,
    duration = 5000,
    loadingType = 'spinning',
  } = data;

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isEditable) {
      let messageInterval: NodeJS.Timeout;
      let progressInterval: NodeJS.Timeout;

      // Intervalo para mudar as mensagens
      messageInterval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % messages.length);
      }, duration / messages.length);

      // Intervalo para atualizar a barra de progresso
      if (showProgress) {
        progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + 100 / (duration / 100);
            return newProgress > 100 ? 100 : newProgress;
          });
        }, 100);
      }

      // Timeout para avançar para a próxima etapa
      const nextStepTimeout = setTimeout(() => {
        if (onNext) {
          onNext();
        }
      }, duration);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
        clearTimeout(nextStepTimeout);
      };
    }
  }, [isEditable, onNext, messages, duration, showProgress]);

  // Estilos para diferentes tipos de loading
  const loadingStyleClasses = {
    spinning: 'animate-spin text-primary',
    elegant: 'processing-spinner text-primary',
    dots: 'processing-dots text-primary',
    bars: 'processing-bars text-primary',
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center p-6 rounded-xl shadow-md',
        className
      )}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      <h2 style={{ color: '#432818' }}>{title}</h2>

      <div style={{ color: '#6B4F43' }}>{messages[currentMessageIndex]}</div>

      {/* Tipos de loading */}
      <div className="text-4xl mb-6">
        {loadingType === 'spinning' && (
          <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {loadingType === 'elegant' && (
          <svg className="processing-spinner h-10 w-10 text-primary" viewBox="0 0 66 66">
            <circle
              className="path"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              cx="33"
              cy="33"
              r="30"
            ></circle>
          </svg>
        )}

        {loadingType === 'dots' && (
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full processing-dots"></div>
            <div
              className="w-3 h-3 bg-primary rounded-full processing-dots"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-3 h-3 bg-primary rounded-full processing-dots"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        )}

        {loadingType === 'bars' && (
          <div className="flex space-x-2">
            <div
              className="w-2 h-6 bg-primary processing-bars"
              style={{ animationDelay: '0s' }}
            ></div>
            <div
              className="w-2 h-5 bg-primary processing-bars"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-4 bg-primary processing-bars"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        )}
      </div>

      {showProgress && (
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {isEditable && (
        <div className="absolute top-2 right-2 bg-[#B89B7A]/100 text-white text-xs px-2 py-1 rounded">
          Editar
        </div>
      )}

      {/* Estilos inline para animações */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .processing-spinner {
            animation: spin 2s linear infinite;
          }
          
          @keyframes fade-in-out {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          
          .processing-dots {
            animation: fade-in-out 1.5s ease-in-out infinite;
          }
        `,
        }}
      />
    </div>
  );
};

export default ProcessingStep;
