import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { BlockComponentProps, CountdownTimerBlock } from '@/types/blocks';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Flame, Timer } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useOptimizedScheduler from '@/hooks/useOptimizedScheduler';
import { InlineEditableText } from './InlineEditableText';

interface CountdownTimerBlockProps extends BlockComponentProps {
  block: CountdownTimerBlock;
}

interface TimeUnit {
  value: number;
  label: string;
  shortLabel: string;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: number | string | undefined,
  type: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (!numValue || isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr'; // Margens negativas
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

const CountdownTimerBlock: React.FC<CountdownTimerBlockProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const properties = block?.properties as any; // Type assertion para propriedades dinâmicas
  const {
    title = 'Oferta por Tempo Limitado',
    subtitle = 'Aproveite antes que expire!',
    endDate,
    durationMinutes = 15,
    urgencyText = 'Restam apenas:',
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
    layout = 'cards',
    theme = 'urgent',
    autoStart = true,
    showUrgencyMessages = true,
    urgencyThreshold = 5,
    backgroundColor = '#ffffff',
    textColor: _textColor = '#432818',
    accentColor = '#dc2626',
    pulseAnimation = true,
    showProgress = false,
    // Sistema completo de margens com controles deslizantes
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
  } = properties || {};

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  const [isExpired, setIsExpired] = useState(false);
  const [initialTotal, setInitialTotal] = useState(0);
  const { schedule, cancelAll } = useOptimizedScheduler();

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Calculate target date
  const getTargetDate = () => {
    if (endDate) {
      return new Date(endDate);
    } else {
      // Use duration from now
      const now = new Date();
      return new Date(now.getTime() + durationMinutes * 60 * 1000);
    }
  };

  // Update countdown com agendador otimizado (elimina setInterval)
  useEffect(() => {
    if (!autoStart || isEditing) return;

    const targetDate = getTargetDate();

    // Set initial total para cálculo do progresso (uma vez por ciclo)
    if (initialTotal === 0) {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      setInitialTotal(Math.max(0, Math.floor(diff / 1000)));
    }

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        setIsExpired(true);
        return false; // parar
      }

      const total = Math.floor(difference / 1000);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, total });
      setIsExpired(false);
      return true; // continuar
    };

    // Tick inicial e loop agendado
    updateCountdown();
    const loop = () => {
      schedule(`countdown:${block.id}`, () => {
        const cont = updateCountdown();
        if (cont) loop();
      }, 1000);
    };
    loop();

    return () => {
      cancelAll();
    };
  }, [autoStart, isEditing, endDate, durationMinutes, initialTotal, schedule, cancelAll, block.id]);

  const getThemeClasses = () => {
    switch (theme) {
      case 'elegant':
        return {
          container:
            'bg-gradient-to-br from-[#B89B7A] via-[#D4C2A8] to-[#E8D5C4] text-[#432818] shadow-xl',
          card: 'bg-white/90 backdrop-blur-sm border border-[#B89B7A]/30 shadow-lg hover:shadow-xl transition-all duration-300',
          text: 'text-[#432818]',
          accent: 'text-[#B89B7A]',
          glow: 'shadow-[#B89B7A]/25',
        };
      case 'minimal':
        return {
          container:
            'bg-gradient-to-br from-[#E8D5C4] to-white text-[#432818] border border-[#B89B7A]/20',
          card: 'bg-white border border-[#B89B7A]/20 shadow-sm hover:shadow-md transition-all duration-300',
          text: 'text-[#432818]',
          accent: 'text-[#B89B7A]',
          glow: 'shadow-[#B89B7A]/10',
        };
      case 'neon':
        return {
          container: 'bg-gradient-to-br from-[#432818] to-black text-[#B89B7A]',
          card: 'bg-[#432818]/80 border border-[#B89B7A] shadow-lg shadow-[#B89B7A]/20 hover:shadow-[#B89B7A]/40 transition-all duration-300',
          text: 'text-[#B89B7A]',
          accent: 'text-[#E8D5C4]',
          glow: 'shadow-[#B89B7A]/30',
        };
      case 'urgent':
      default:
        return {
          container:
            'bg-gradient-to-br from-red-600 via-red-500 to-orange-600 text-white shadow-xl',
          card: 'bg-white/15 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-300',
          text: 'text-white',
          accent: 'text-orange-200',
          glow: 'shadow-red-500/25',
        };
    }
  };

  const themeClasses = getThemeClasses();
  const isUrgent = timeLeft.total <= urgencyThreshold * 60 && !isExpired;
  const progressPercentage =
    initialTotal > 0 ? ((initialTotal - timeLeft.total) / initialTotal) * 100 : 0;

  const renderTimeUnit = (unit: TimeUnit, index: number) => {
    const shouldShow =
      (unit.label === 'dias' && showDays) ||
      (unit.label === 'horas' && showHours) ||
      (unit.label === 'minutos' && showMinutes) ||
      (unit.label === 'segundos' && showSeconds);

    if (!shouldShow) return null;

    switch (layout) {
      case 'compact':
        return (
          <span key={unit.label} className="inline-flex items-baseline gap-1">
            <span
              className={cn(
                'text-xl sm:text-2xl md:text-3xl font-bold tabular-nums px-2 py-1 rounded-lg transition-all duration-300',
                pulseAnimation && isUrgent && 'animate-pulse',
                theme === 'elegant'
                  ? 'bg-white/20 text-[#432818] shadow-lg'
                  : theme === 'minimal'
                    ? 'bg-[#E8D5C4]/30 text-[#432818]'
                    : theme === 'neon'
                      ? 'bg-[#B89B7A]/20 text-[#B89B7A] shadow-lg shadow-[#B89B7A]/25'
                      : 'bg-white/20 text-white',
                themeClasses.text,
                // Margens universais com controles deslizantes
                getMarginClass(marginTop, 'top'),
                getMarginClass(marginBottom, 'bottom'),
                getMarginClass(marginLeft, 'left'),
                getMarginClass(marginRight, 'right')
              )}
            >
              {unit.value.toString().padStart(2, '0')}
            </span>
            <span
              className={cn(
                'text-xs sm:text-sm font-medium uppercase tracking-wider',
                themeClasses.accent
              )}
            >
              {unit.shortLabel}
            </span>
            {index < 3 && (
              <span className={cn('mx-0.5 sm:mx-1 text-lg font-bold', themeClasses.accent)}>:</span>
            )}
          </span>
        );

      case 'digital':
        return (
          <div key={unit.label} className="flex flex-col items-center">
            <div
              className={cn(
                'px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-mono text-xl sm:text-2xl md:text-3xl font-bold border shadow-lg transition-all duration-300 hover:scale-105',
                theme === 'elegant'
                  ? 'bg-[#432818] text-[#B89B7A] border-[#B89B7A]/30 shadow-[#B89B7A]/20'
                  : theme === 'minimal'
                    ? 'bg-white text-[#432818] border-[#B89B7A]/30 shadow-[#B89B7A]/10'
                    : theme === 'neon'
                      ? 'bg-black text-[#B89B7A] border-[#B89B7A] shadow-[#B89B7A]/30'
                      : 'bg-black/90 text-white border-white/30 shadow-white/10',
                pulseAnimation && isUrgent && 'animate-pulse'
              )}
            >
              {unit.value.toString().padStart(2, '0')}
            </div>
            <span
              className={cn(
                'text-xs mt-1 font-medium uppercase tracking-wider',
                themeClasses.accent
              )}
            >
              {unit.label}
            </span>
          </div>
        );

      case 'circular':
        const circumference = 2 * Math.PI * 40;
        const strokeDasharray = circumference;
        const strokeDashoffset =
          circumference - (unit.value / (unit.label === 'segundos' ? 60 : 24)) * circumference;

        return (
          <div key={unit.label} className="flex flex-col items-center group">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20">
              <svg
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 transform -rotate-90 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={
                    theme === 'elegant'
                      ? '#B89B7A'
                      : theme === 'minimal'
                        ? '#B89B7A'
                        : theme === 'neon'
                          ? '#B89B7A'
                          : accentColor
                  }
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 drop-shadow-sm"
                  style={{
                    filter: theme === 'neon' ? `drop-shadow(0 0 4px #B89B7A)` : undefined,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={cn(
                    'text-base sm:text-lg md:text-xl font-bold tabular-nums transition-all duration-300',
                    pulseAnimation && isUrgent && 'animate-pulse',
                    themeClasses.text
                  )}
                >
                  {unit.value}
                </span>
              </div>
            </div>
            <span
              className={cn(
                'text-xs mt-1 font-medium uppercase tracking-wider',
                themeClasses.accent
              )}
            >
              {unit.label}
            </span>
          </div>
        );

      case 'cards':
      default:
        return (
          <motion.div
            key={unit.label}
            initial={{ scale: 1 }}
            animate={{
              scale: pulseAnimation && isUrgent && unit.label === 'segundos' ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 1, repeat: Infinity }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <Card className={cn(themeClasses.card, 'relative overflow-hidden group')}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#B89B7A]/5 to-[#E8D5C4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-3 sm:p-4 text-center relative z-10">
                <div
                  className={cn(
                    'text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums mb-1 transition-all duration-300',
                    themeClasses.text,
                    pulseAnimation && isUrgent && 'animate-pulse drop-shadow-lg'
                  )}
                >
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div
                  className={cn(
                    'text-xs sm:text-sm font-medium opacity-80 uppercase tracking-wider',
                    themeClasses.accent
                  )}
                >
                  {unit.label}
                </div>
                {/* Decorative accent */}
                <div
                  className={cn(
                    'w-8 h-0.5 mx-auto mt-2 rounded-full bg-gradient-to-r transition-all duration-300',
                    theme === 'elegant'
                      ? 'from-[#B89B7A] to-[#E8D5C4]'
                      : theme === 'minimal'
                        ? 'from-[#B89B7A]/50 to-[#E8D5C4]/50'
                        : theme === 'neon'
                          ? 'from-[#B89B7A] to-[#E8D5C4]'
                          : 'from-orange-200 to-yellow-200'
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  const units: TimeUnit[] = [
    { value: timeLeft.days, label: 'dias', shortLabel: 'd' },
    { value: timeLeft.hours, label: 'horas', shortLabel: 'h' },
    { value: timeLeft.minutes, label: 'minutos', shortLabel: 'm' },
    { value: timeLeft.seconds, label: 'segundos', shortLabel: 's' },
  ];

  const getUrgencyMessage = () => {
    if (!showUrgencyMessages) return null;

    if (isExpired) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ color: '#432818' }}
        >
          <AlertTriangle className="w-5 h-5" />
          Oferta Expirada!
        </motion.div>
      );
    }

    if (isUrgent) {
      return (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className={cn(
            'flex items-center justify-center gap-2 font-bold px-4 py-2 rounded-lg border',
            theme === 'elegant'
              ? 'text-[#432818] bg-orange-100 border-orange-200'
              : theme === 'minimal'
                ? 'text-[#432818] bg-[#E8D5C4] border-[#B89B7A]/30'
                : theme === 'neon'
                  ? 'text-orange-400 bg-orange-900/20 border-orange-400/30'
                  : 'text-orange-200 bg-orange-900/20 border-orange-400/30'
          )}
        >
          <Flame className="w-5 h-5" />
          Últimos minutos!
        </motion.div>
      );
    }

    return null;
  };

  if (!autoStart && isEditing) {
    // Show static preview in editing mode
    return (
      <div
        className={cn(
          'bg-gradient-to-br from-[#E8D5C4] to-white p-4 sm:p-6 md:p-8 rounded-xl text-[#432818] flex flex-col items-center justify-center min-h-[150px] sm:min-h-[180px] md:min-h-[200px] cursor-pointer transition-all duration-300 border border-[#B89B7A]/20',
          isSelected && 'ring-2 ring-[#B89B7A]/40 shadow-lg shadow-[#B89B7A]/10',
          !isSelected && 'hover:shadow-lg hover:shadow-[#B89B7A]/5 hover:border-[#B89B7A]/30',
          className
        )}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <div className="relative">
          <Timer className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 text-[#B89B7A]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#B89B7A] rounded-full animate-ping" />
        </div>
        <p className="text-center text-sm sm:text-base font-medium mb-2">
          Countdown Timer (Preview)
        </p>
        <p className="text-xs sm:text-sm text-center text-[#432818]/70">
          Configure o timer no painel de propriedades
        </p>
        <div className="mt-4 flex gap-2">
          <div className="w-12 h-8 bg-[#B89B7A]/20 rounded border border-[#B89B7A]/30 flex items-center justify-center text-xs font-mono">
            00
          </div>
          <div className="w-12 h-8 bg-[#B89B7A]/20 rounded border border-[#B89B7A]/30 flex items-center justify-center text-xs font-mono">
            00
          </div>
          <div className="w-12 h-8 bg-[#B89B7A]/20 rounded border border-[#B89B7A]/30 flex items-center justify-center text-xs font-mono">
            00
          </div>
          <div className="w-12 h-8 bg-[#B89B7A]/20 rounded border border-[#B89B7A]/30 flex items-center justify-center text-xs font-mono">
            00
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'py-4 sm:py-6 md:py-8 px-4 cursor-pointer transition-all duration-300 w-full rounded-xl relative overflow-hidden',
        isSelected && 'ring-2 ring-[#B89B7A]/40 shadow-lg',
        !isSelected && 'hover:shadow-lg hover:scale-[1.01]',
        themeClasses.container,
        themeClasses.glow && `shadow-lg ${themeClasses.glow}`,
        className
      )}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
      style={{
        backgroundColor: backgroundColor !== '#ffffff' ? backgroundColor : undefined,
      }}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full" />
      </div>
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 relative z-10">
        {title && (
          <h2
            className={cn(
              'text-xl sm:text-2xl md:text-3xl font-bold mb-2 drop-shadow-sm',
              themeClasses.text
            )}
          >
            <InlineEditableText
              value={title}
              onChange={(value: string) => handlePropertyChange('title', value)}
              className="inline-block"
              placeholder="Título do countdown"
            />
          </h2>
        )}
        {subtitle && (
          <p className={cn('text-base sm:text-lg mb-3 sm:mb-4 font-medium', themeClasses.accent)}>
            <InlineEditableText
              value={subtitle}
              onChange={(value: string) => handlePropertyChange('subtitle', value)}
              className="inline-block"
              placeholder="Subtítulo do countdown"
            />
          </p>
        )}

        {urgencyText && !isExpired && (
          <div
            className={cn(
              'flex items-center justify-center gap-2 mb-3 sm:mb-4 px-4 py-2 rounded-lg',
              theme === 'elegant'
                ? 'bg-white/20 backdrop-blur-sm'
                : theme === 'minimal'
                  ? 'bg-[#B89B7A]/10'
                  : theme === 'neon'
                    ? 'bg-[#B89B7A]/20'
                    : 'bg-white/20 backdrop-blur-sm'
            )}
          >
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">{urgencyText}</span>
          </div>
        )}

        {getUrgencyMessage()}
      </div>

      {/* Timer Display */}
      <div className="max-w-4xl mx-auto">
        {layout === 'compact' ? (
          <div className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold font-mono">
            {units.map((unit, index) => renderTimeUnit(unit, index))}
          </div>
        ) : (
          <div
            className={cn(
              'grid gap-3 sm:gap-4 justify-center',
              layout === 'circular' ? 'grid-cols-2' : 'grid-cols-2'
            )}
          >
            {units.map((unit, index) => renderTimeUnit(unit, index))}
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && initialTotal > 0 && !isExpired && (
          <div className="mt-6 sm:mt-8">
            <div
              className={cn(
                'w-full rounded-full h-2 overflow-hidden shadow-inner',
                theme === 'elegant'
                  ? 'bg-white/30'
                  : theme === 'minimal'
                    ? 'bg-[#B89B7A]/20'
                    : theme === 'neon'
                      ? 'bg-[#432818]/50'
                      : 'bg-white/20'
              )}
            >
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  theme === 'elegant'
                    ? 'bg-gradient-to-r from-[#B89B7A] to-[#E8D5C4]'
                    : theme === 'minimal'
                      ? 'bg-gradient-to-r from-[#B89B7A] to-[#432818]'
                      : theme === 'neon'
                        ? 'bg-gradient-to-r from-[#B89B7A] to-[#E8D5C4] shadow-[#B89B7A]/50 shadow-lg'
                        : 'bg-gradient-to-r from-white to-orange-200'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className={cn('text-center text-xs sm:text-sm mt-2', themeClasses.accent)}>
              {Math.round(progressPercentage)}% da oferta já expirou
            </p>
          </div>
        )}
      </div>

      {/* Editor Info */}
      {isEditing && (
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-black/20 rounded-md">
          <p className="text-xs sm:text-sm opacity-80">
            Modo de edição: Layout {layout} • Tema {theme} •
            {isExpired ? 'Expirado' : `${timeLeft.total}s restantes`}
          </p>
        </div>
      )}
    </div>
  );
};

export default CountdownTimerBlock;
