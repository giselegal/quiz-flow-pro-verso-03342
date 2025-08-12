/* @ts-nocheck */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Zap, AlertCircle, TrendingUp } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps } from './types';

interface CountdownTimerProps extends StyleProps {
  /** Título do timer */
  title?: string;
  /** Subtítulo/descrição */
  subtitle?: string;
  /** Data limite (ISO string ou timestamp) */
  targetDate?: string | number;
  /** Duração em minutos (alternativa à targetDate) */
  durationMinutes?: number;
  /** Estilo do timer */
  timerStyle?: 'classic' | 'modern' | 'urgent';
  /** Cor do tema */
  theme?: 'primary' | 'urgent' | 'success';
  /** Mostrar labels dos valores */
  showLabels?: boolean;
  /** Formato do timer */
  format?: 'full' | 'minimal' | 'hours-minutes';
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback quando o timer expira */
  onExpire?: () => void;
  /** Callback para ação */
  onAction?: () => void;
  /** Texto do botão de ação */
  actionText?: string;
  /** Mostrar botão de ação */
  showAction?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

/**
 * CountdownTimer - Timer de contagem regressiva
 * Cria urgência e escassez para aumentar conversões
 */
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  title = 'Oferta Por Tempo Limitado',
  subtitle = 'Aproveite esta oportunidade especial antes que expire',
  targetDate,
  durationMinutes = 30,
  timerStyle = 'modern',
  theme = 'urgent',
  showLabels = true,
  format = 'full',
  deviceView = 'desktop',
  onExpire,
  onAction,
  actionText = 'Aproveitar Agora',
  showAction = true,
  className,
  style,
  customStyles,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  // Calculate target timestamp
  const getTargetTimestamp = () => {
    if (targetDate) {
      return typeof targetDate === 'string' ? new Date(targetDate).getTime() : targetDate;
    }
    return Date.now() + durationMinutes * 60 * 1000;
  };

  // Update timer
  useEffect(() => {
    const target = getTargetTimestamp();

    const updateTimer = () => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        setIsExpired(true);
        onExpire?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, total: difference });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate, durationMinutes, onExpire]);

  const getThemeColors = () => {
    switch (theme) {
      case 'urgent':
        return {
          background: 'bg-gradient-to-r from-red-500 to-red-600',
          text: 'text-red-600',
          border: 'border-red-500',
          accent: 'bg-red-500',
        };
      case 'success':
        return {
          background: 'bg-gradient-to-r from-green-500 to-green-600',
          text: 'text-green-600',
          border: 'border-green-500',
          accent: 'bg-green-500',
        };
      default:
        return {
          background: 'bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]',
          text: 'text-[#aa6b5d]',
          border: 'border-[#B89B7A]',
          accent: 'bg-[#B89B7A]',
        };
    }
  };

  const colors = getThemeColors();

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const getVisibleUnits = () => {
    switch (format) {
      case 'minimal':
        return timeLeft.hours > 0
          ? [
              { value: timeLeft.hours, label: 'h' },
              { value: timeLeft.minutes, label: 'm' },
            ]
          : [
              { value: timeLeft.minutes, label: 'm' },
              { value: timeLeft.seconds, label: 's' },
            ];
      case 'hours-minutes':
        return [
          { value: timeLeft.hours, label: 'horas' },
          { value: timeLeft.minutes, label: 'minutos' },
        ];
      default:
        const units = [];
        if (timeLeft.days > 0) units.push({ value: timeLeft.days, label: 'dias' });
        if (timeLeft.hours > 0 || timeLeft.days > 0)
          units.push({ value: timeLeft.hours, label: 'horas' });
        units.push({ value: timeLeft.minutes, label: 'minutos' });
        if (format === 'full') units.push({ value: timeLeft.seconds, label: 'segundos' });
        return units;
    }
  };

  const renderTimerUnit = (value: number, label: string, index: number) => {
    const isLast = index === getVisibleUnits().length - 1;

    return (
      <div key={label} className="flex items-center">
        <div
          className={`text-center ${timerStyle === 'classic' ? 'bg-white rounded-lg shadow-md p-3' : ''}`}
        >
          <div
            className={`text-2xl md:text-3xl font-bold ${colors.text} ${timerStyle === 'modern' ? 'bg-white rounded-lg px-3 py-2 shadow-sm' : ''}`}
          >
            {formatNumber(value)}
          </div>
          {showLabels && <div style={{ color: '#6B4F43' }}>{label}</div>}
        </div>
        {!isLast && <div className={`mx-2 text-xl font-bold ${colors.text}`}>:</div>}
      </div>
    );
  };

  if (isExpired) {
    return (
      <div className={`py-8 ${className || ''}`} style={style}>
        {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}
        <Card style={{ borderColor: '#E5DDD5' }}>
          <AlertCircle style={{ color: '#8B7355' }} />
          <h3 style={{ color: '#6B4F43' }}>Tempo Esgotado</h3>
          <p style={{ color: '#6B4F43' }}>
            Esta oferta especial expirou. Entre em contato para verificar novas oportunidades.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className={`py-8 ${className || ''}`} style={style}>
      {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

      <AnimatedWrapper animation="fade" show={true} duration={400}>
        <Card
          className={`p-6 ${timerStyle === 'urgent' ? colors.background + ' text-white' : 'bg-white'} shadow-lg border-0`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              {theme === 'urgent' ? (
                <Zap
                  className={`w-5 h-5 ${timerStyle === 'urgent' ? 'text-white' : colors.text}`}
                />
              ) : (
                <Clock
                  className={`w-5 h-5 ${timerStyle === 'urgent' ? 'text-white' : colors.text}`}
                />
              )}
              <h3
                className={`text-lg md:text-xl font-semibold ${timerStyle === 'urgent' ? 'text-white' : colors.text}`}
              >
                {title}
              </h3>
            </div>
            {subtitle && (
              <p
                className={`text-sm ${timerStyle === 'urgent' ? 'text-white/90' : 'text-gray-600'}`}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Timer */}
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center gap-1 md:gap-2">
              {getVisibleUnits().map((unit, index) =>
                renderTimerUnit(unit.value, unit.label, index)
              )}
            </div>
          </div>

          {/* Progress bar for urgency */}
          {timeLeft.total > 0 && timeLeft.total < 30 * 60 * 1000 && (
            <div className="mb-6">
              <div
                className={`w-full bg-gray-200 rounded-full h-2 ${timerStyle === 'urgent' ? 'bg-white/20' : ''}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${colors.accent}`}
                  style={{
                    width: `${Math.max(5, (timeLeft.total / (30 * 60 * 1000)) * 100)}%`,
                  }}
                />
              </div>
              <p
                className={`text-xs text-center mt-2 ${timerStyle === 'urgent' ? 'text-white/80' : 'text-gray-500'}`}
              >
                Tempo restante para esta oferta
              </p>
            </div>
          )}

          {/* Action */}
          {showAction && onAction && (
            <div className="text-center">
              <Button
                onClick={onAction}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                  timerStyle === 'urgent'
                    ? 'bg-white text-red-600 hover:bg-gray-100'
                    : colors.background + ' text-white hover:opacity-90'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {actionText}
              </Button>
            </div>
          )}
        </Card>
      </AnimatedWrapper>
    </div>
  );
};

export default CountdownTimer;
