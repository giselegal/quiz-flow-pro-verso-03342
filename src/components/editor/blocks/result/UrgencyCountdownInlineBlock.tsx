import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Clock, Zap } from 'lucide-react';

/**
 * UrgencyCountdownInlineBlock - Urgency countdown timer
 * Creates urgency with countdown timer and messaging
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const UrgencyCountdownInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  // Destructure properties with defaults
  const {
    title = '⏰ Oferta por Tempo Limitado!',
    subtitle = 'Esta página expira em:',
    urgencyMessage = 'Não perca esta oportunidade única de transformar sua imagem',
    countdownMinutes = 30,
    showIcon = true,
    backgroundColor = '#fff3cd',
    borderColor = '#ffc107',
    textColor = '#856404',
    accentColor = '#dc3545',
    containerWidth = 'large',
    spacing = 'normal',
    marginTop = 0,
    marginBottom = 16,
    textAlign = 'center',
    animated = true,
  } = block?.properties ?? {};

  // State for countdown
  const [timeLeft, setTimeLeft] = useState(countdownMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Container classes
  const containerClasses = cn(
    'w-full',
    {
      'max-w-sm mx-auto': containerWidth === 'small',
      'max-w-md mx-auto': containerWidth === 'medium', 
      'max-w-lg mx-auto': containerWidth === 'large',
      'max-w-2xl mx-auto': containerWidth === 'xlarge',
      'max-w-full': containerWidth === 'full',
    },
    {
      'p-4': spacing === 'small',
      'p-6': spacing === 'normal',
      'p-8': spacing === 'large',
    },
    {
      'mt-0': marginTop === 0,
      'mt-4': marginTop <= 16,
      'mt-6': marginTop <= 24,
      'mt-8': marginTop <= 32,
    },
    {
      'mb-0': marginBottom === 0,
      'mb-4': marginBottom <= 16,
      'mb-6': marginBottom <= 24,
      'mb-8': marginBottom <= 32,
    },
    {
      'text-left': textAlign === 'left',
      'text-center': textAlign === 'center',
      'text-right': textAlign === 'right',
    },
    'rounded-lg border-2',
    animated && !isExpired && 'animate-pulse',
    isSelected && 'ring-2 ring-blue-500 ring-opacity-50',
    className
  );

  const containerStyle = {
    backgroundColor,
    borderColor,
    color: textColor,
  };

  if (isExpired) {
    return (
      <div className={cn(containerClasses, 'opacity-50')} onClick={onClick} style={containerStyle}>
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Oferta Expirada</span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} onClick={onClick} style={containerStyle}>
      <div className="space-y-4">
        {/* Title with Icon */}
        <div className="flex items-center justify-center gap-2">
          {showIcon && <Zap className="w-5 h-5" style={{ color: accentColor }} />}
          <h3 className="text-lg font-bold">{title}</h3>
        </div>

        {/* Subtitle */}
        <p className="text-sm font-medium">{subtitle}</p>

        {/* Countdown Display */}
        <div className="space-y-2">
          <div 
            className="text-3xl md:text-4xl font-bold font-mono"
            style={{ color: accentColor }}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs uppercase tracking-wide opacity-75">
            MM:SS
          </div>
        </div>

        {/* Urgency Message */}
        {urgencyMessage && (
          <p className="text-sm font-medium opacity-90">
            {urgencyMessage}
          </p>
        )}

        {/* Warning Text */}
        <div className="flex items-center justify-center gap-1 text-xs opacity-75">
          <Clock className="w-3 h-3" />
          <span>Esta página expira automaticamente</span>
        </div>
      </div>
    </div>
  );
};

export default UrgencyCountdownInlineBlock;