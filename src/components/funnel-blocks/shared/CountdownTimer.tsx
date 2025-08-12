import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  hours?: number;
  minutes?: number;
  seconds?: number;
  endTime?: Date | string;
  onComplete?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'large';
  showLabels?: boolean;
  autoStart?: boolean;
}

/**
 * CountdownTimer - Componente de contagem regressiva para funis
 *
 * Pode ser iniciado com tempo específico (horas/minutos/segundos)
 * ou com uma data/hora final (endTime).
 */
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  hours = 0,
  minutes = 0,
  seconds = 0,
  endTime,
  onComplete,
  className = '',
  variant = 'default',
  showLabels = true,
  autoStart = true,
}) => {
  // Estado para tempo restante
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  });
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);

  // Calcular tempo inicial
  useEffect(() => {
    if (endTime) {
      const updateRemainingTime = () => {
        const now = new Date();
        const target = new Date(endTime);
        const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));

        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;

        setTimeRemaining({ hours: h, minutes: m, seconds: s });

        if (diff <= 0) {
          setIsComplete(true);
          setIsRunning(false);
          if (onComplete) onComplete();
        }
      };

      updateRemainingTime();
    }
  }, [endTime, onComplete]);

  // Efeito de contagem regressiva
  useEffect(() => {
    if (!isRunning || isComplete) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        // Se tudo é zero, a contagem terminou
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(interval);
          setIsComplete(true);
          setIsRunning(false);
          if (onComplete) onComplete();
          return prev;
        }

        // Calcular novo tempo
        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds - 1;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isComplete, onComplete]);

  // Formatar número para ter dois dígitos
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  // Classes com base na variante
  const containerClasses = cn(
    'flex items-center justify-center',
    {
      'gap-2': variant === 'default',
      'gap-1 text-sm': variant === 'compact',
      'gap-4': variant === 'large',
    },
    className
  );

  const digitClasses = cn(
    'bg-gray-800 text-white rounded font-mono font-bold flex items-center justify-center',
    {
      'w-12 h-12 text-xl': variant === 'default',
      'w-8 h-8 text-sm': variant === 'compact',
      'w-16 h-16 text-2xl': variant === 'large',
    }
  );

  const separatorClasses = cn('text-gray-800 font-bold', {
    'text-xl': variant === 'default',
    'text-sm': variant === 'compact',
    'text-2xl': variant === 'large',
  });

  const labelClasses = cn('text-gray-500 text-xs text-center mt-1', {
    'text-[10px]': variant === 'compact',
    'text-sm': variant === 'large',
  });

  return (
    <div className={containerClasses}>
      {/* Horas */}
      <div className="flex flex-col">
        <div className={digitClasses}>{formatNumber(timeRemaining.hours)}</div>
        {showLabels && <div className={labelClasses}>Horas</div>}
      </div>

      <div className={separatorClasses}>:</div>

      {/* Minutos */}
      <div className="flex flex-col">
        <div className={digitClasses}>{formatNumber(timeRemaining.minutes)}</div>
        {showLabels && <div className={labelClasses}>Min</div>}
      </div>

      <div className={separatorClasses}>:</div>

      {/* Segundos */}
      <div className="flex flex-col">
        <div className={digitClasses}>{formatNumber(timeRemaining.seconds)}</div>
        {showLabels && <div className={labelClasses}>Seg</div>}
      </div>
    </div>
  );
};

export default CountdownTimer;
