
import React, { useState, useEffect } from 'react';
import { Clock, Timer } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * CountdownInlineBlock - Bloco de countdown (modular)
 * Renderiza apenas o timer de contagem regressiva
 */
const CountdownInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // Validate and extract properties with default values
  const properties = block?.properties || {};
  
  const {
    initialMinutes = 15,
    title = 'Oferta por tempo limitado',
    urgencyText = 'Esta oferta expira em:',
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#B89B7A',
    // Propriedades de grid para responsividade
    gridColumns = 1,
    spacing = 'md'
  } = properties;

  const [isLoaded, setIsLoaded] = useState(false);
  const [timer, setTimer] = useState({ minutes: initialMinutes, seconds: 0 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(interval);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Classes de espaçamento
  const spacingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  // Classes de grid baseadas na propriedade gridColumns
  const gridClasses = {
    1: 'w-full',
    2: 'w-full md:w-1/2'
  };

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        ${gridClasses[gridColumns as keyof typeof gridClasses] || gridClasses[1]}
        ${spacingClasses[spacing as keyof typeof spacingClasses] || spacingClasses.md}
        transition-all duration-200
        ${isSelected 
          ? 'ring-1 ring-blue-500 bg-blue-50/30' 
          : 'hover:shadow-sm'
        }
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
      data-block-id={block?.id || 'countdown-block'}
      data-block-type={block?.type || 'countdown-inline'}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="text-center">
          {/* Título */}
          {title && (
            <h3 className="text-lg lg:text-xl font-semibold mb-4" style={{ color: textColor }}>
              {title}
            </h3>
          )}

          {/* Texto de Urgência */}
          <p className="text-sm text-gray-600 mb-4">
            {urgencyText}
          </p>

          {/* Timer Visual */}
          <div 
            className="inline-flex items-center gap-4 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 shadow-lg"
            style={{
              backgroundColor: `${accentColor}10`,
              borderColor: `${accentColor}30`
            }}
          >
            <div className="flex items-center justify-center">
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{
                  background: `linear-gradient(to right, ${accentColor}, #aa6b5d)`
                }}
              />
            </div>
            
            {/* Display do Timer */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: accentColor }} />
              <span 
                className="text-2xl lg:text-3xl font-bold font-mono"
                style={{ color: textColor }}
              >
                {String(timer.minutes).padStart(2, '0')}:
                {String(timer.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Indicador de Urgência */}
          <div className="mt-4 text-xs text-gray-500">
            <Timer className="w-4 h-4 inline mr-1" />
            Tempo restante para esta oferta especial
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default CountdownInlineBlock;
