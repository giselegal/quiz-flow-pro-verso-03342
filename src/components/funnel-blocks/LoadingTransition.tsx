/* @ts-nocheck */
// @ts-nocheck
import { getOptimizedContainerClasses } from '@/config/containerConfig';
import React, { useEffect, useState } from 'react';
import { BlockComponentProps, LoadingType, Alignment, InteractionCallbacks } from './types';

/**
 * LoadingTransition - Componente de transição com animação de carregamento
 *
 * Renderiza uma tela de loading com diferentes tipos de animação, mensagens
 * personalizáveis e transição automática após um tempo determinado.
 *
 * @example
 * <LoadingTransition
 *   message="Analisando suas respostas..."
 *   submessage="Isso pode levar alguns segundos"
 *   duration={3000}
 *   animationType="elegant"
 *   onComplete={() => console.log('Loading completo')}
 * />
 */

export interface LoadingTransitionProps extends BlockComponentProps, InteractionCallbacks {
  // Conteúdo
  message: string;
  submessage?: string;
  loadingTexts?: string[]; // Textos rotativos durante o loading

  // Configuração da animação
  animationType?: LoadingType;
  duration?: number; // Duração em ms
  autoAdvance?: boolean;

  // Layout e estilos
  alignment?: Alignment;
  showProgress?: boolean;
  progressColor?: string;
  backgroundColor?: string;
  textColor?: string;

  // Callbacks
  onComplete?: () => void;
  onProgress?: (progress: number) => void; // 0-100
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({
  // Conteúdo
  message,
  submessage,
  loadingTexts = [],

  // Configuração
  animationType = 'elegant',
  duration = 4000,
  autoAdvance = true,

  // Layout
  alignment = 'center',
  showProgress = true,
  progressColor = '#B89B7A',
  backgroundColor = '#ffffff',
  textColor = '#432818',

  // Callbacks
  onComplete,
  onProgress,

  // Props base
  deviceView = 'desktop',
  className = '',
  style = {},
  testId = 'loading-transition',
  ..._rest
}) => {
  const [progress, setProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Classes de alinhamento
  const _alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  // Efeito para progresso e texto rotativo
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 100 / (duration / 100), 100);
        onProgress?.(newProgress);

        if (newProgress >= 100) {
          setIsComplete(true);
          if (autoAdvance) {
            setTimeout(() => onComplete?.(), 500);
          }
        }

        return newProgress;
      });
    }, 100);

    // Rotação de textos
    let textInterval: NodeJS.Timeout;
    if (loadingTexts.length > 0) {
      textInterval = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % loadingTexts.length);
      }, 2000);
    }

    return () => {
      clearInterval(interval);
      if (textInterval) clearInterval(textInterval);
    };
  }, [duration, autoAdvance, onComplete, onProgress, loadingTexts.length, isComplete]);

  // Renderizar animação baseada no tipo
  const renderAnimation = () => {
    const baseClasses = 'mx-auto mb-8';

    switch (animationType) {
      case 'spinning':
        return (
          <div className={`${baseClasses} w-16 h-16`}>
            <div style={{ borderColor: '#E5DDD5', borderTopColor: progressColor }} />
          </div>
        );

      case 'elegant':
        return (
          <div className={`${baseClasses} w-20 h-20`}>
            <div className="relative w-full h-full">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border-2 rounded-full opacity-20"
                  style={{
                    borderColor: progressColor,
                    animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
              <div
                className="absolute inset-2 rounded-full"
                style={{ backgroundColor: progressColor }}
              />
            </div>
          </div>
        );

      case 'dots':
        return (
          <div className={`${baseClasses} flex space-x-2`}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: progressColor,
                  animation: `bounce 1.4s ease-in-out infinite both`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className={`${baseClasses} flex space-x-1 h-8`}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  backgroundColor: progressColor,
                  animation: `pulse 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        );

      default:
        return renderAnimation();
    }
  };

  const containerClasses = getOptimizedContainerClasses(
    deviceView || 'desktop',
    'tight',
    'full',
    className
  );

  const currentLoadingText = loadingTexts.length > 0 ? loadingTexts[currentTextIndex] : null;

  return (
    <div
      className={containerClasses}
      style={{ backgroundColor, color: textColor, ...style }}
      data-testid={testId}
    >
      {/* Animação de Loading */}
      {renderAnimation()}

      {/* Mensagem Principal */}
      <h2 className="text-2xl md:text-3xl font-bold mb-4 max-w-2xl">{message}</h2>

      {/* Submensagem */}
      {submessage && <p style={{ color: '#6B4F43' }}>{submessage}</p>}

      {/* Texto Rotativo */}
      {currentLoadingText && <p style={{ color: '#8B7355' }}>{currentLoadingText}</p>}

      {/* Barra de Progresso */}
      {showProgress && (
        <div className="w-full max-w-md">
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <div
              className="h-full transition-all duration-300 ease-out rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
          <p style={{ color: '#8B7355' }}>{Math.round(progress)}%</p>
        </div>
      )}

      {/* Botão de Continuar (quando completo e não auto-advance) */}
      {isComplete && !autoAdvance && (
        <button
          onClick={onComplete}
          className="mt-8 px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: progressColor,
            color: backgroundColor === '#ffffff' ? '#ffffff' : textColor,
          }}
          data-testid="continue-button"
        >
          Continuar
        </button>
      )}

      {/* Estilos CSS para animações */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scaleY(0.4);
            }
            50% {
              transform: scaleY(1);
            }
          }
          
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default LoadingTransition;
