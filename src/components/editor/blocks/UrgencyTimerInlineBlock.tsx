// @ts-nocheck
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import type { BlockComponentProps } from '@/types/blocks';
import { AlertTriangle, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';

/**
 * UrgencyTimerInlineBlock - Timer de urgência com design mais agressivo
 * Focado em criar senso de urgência visual
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const UrgencyTimerInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  // Validate and extract properties with default values
  const properties = block?.properties || {};

  const {
    initialMinutes = 15,
    title = '⚡ OFERTA EXPIRA EM:',
    urgencyMessage = 'Restam apenas alguns minutos!',
    backgroundColor = '#dc2626',
    textColor = '#ffffff',
    pulseColor = '#fbbf24',
    showAlert = true,
    spacing = 'md',
    // Sistema completo de margens com controles deslizantes
    marginTop = properties.marginTop ?? 8,
    marginBottom = properties.marginBottom ?? 8,
    marginLeft = properties.marginLeft ?? 0,
    marginRight = properties.marginRight ?? 0,
  } = properties;

  const [isLoaded, setIsLoaded] = useState(false);
  const [timer, setTimer] = useState({ minutes: initialMinutes, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Timer countdown with urgency detection
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        const totalSeconds = prev.minutes * 60 + prev.seconds;

        // Set urgency when less than 5 minutes
        setIsUrgent(totalSeconds <= 300);

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

  const spacingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        w-full
        ${spacingClasses[spacing as keyof typeof spacingClasses] || spacingClasses.md}
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-yellow-400 bg-stone-50/30' : 'hover:shadow-lg'}
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
      data-block-id={block?.id || 'urgency-timer-block'}
      data-block-type={block?.type || 'urgency-timer-inline'}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="text-center">
          {/* Alert Icon */}
          {showAlert && (
            <div className={`mb-4 ${isUrgent ? 'animate-bounce' : ''}`}>
              <AlertTriangle className="w-8 h-8 mx-auto" style={{ color: pulseColor }} />
            </div>
          )}

          {/* Title */}
          <h2
            className={`text-xl lg:text-2xl font-bold mb-4 ${isUrgent ? 'animate-pulse' : ''}`}
            style={{ color: textColor }}
          >
            {title}
          </h2>

          {/* Timer Display */}
          <div
            className={`
              inline-flex items-center gap-6 px-8 py-6 rounded-xl border-4 shadow-2xl
              ${isUrgent ? 'animate-pulse border-red-400' : 'border-yellow-400'}
            `}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Clock className="w-8 h-8" style={{ color: pulseColor }} />

            <div className="text-center">
              <div
                className="text-4xl lg:text-5xl font-black font-mono tracking-wider"
                style={{ color: textColor }}
              >
                {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
              </div>
              <div className="text-sm font-medium mt-1" style={{ color: pulseColor }}>
                MINUTOS : SEGUNDOS
              </div>
            </div>
          </div>

          {/* Urgency Message */}
          {isUrgent && (
            <div className="mt-4 animate-pulse">
              <p className="text-lg font-bold" style={{ color: pulseColor }}>
                {urgencyMessage}
              </p>
            </div>
          )}
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default UrgencyTimerInlineBlock;
