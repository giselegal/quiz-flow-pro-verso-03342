import React, { useEffect, useState } from 'react';
import { ANIMATION_CONFIGS, QUIZ_THEMES, QuizStyleManager, QuizTheme } from '../styles/QuizThemes';

interface QuizAnimationWrapperProps {
  children: React.ReactNode;
  animation: 'pageTransition' | 'fadeIn' | 'slideUp';
  theme?: QuizTheme;
  className?: string;
}

/**
 * 🎭 WRAPPER DE ANIMAÇÃO REUTILIZÁVEL
 */
export const QuizAnimationWrapper: React.FC<QuizAnimationWrapperProps> = ({
  children,
  animation,
  theme = 'default',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const animConfig = ANIMATION_CONFIGS[animation];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        ${animConfig.enter}
        ${isVisible ? animConfig.enterTo : animConfig.enterFrom}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface QuizProgressBarProps {
  currentStep: number;
  totalSteps: number;
  theme?: QuizTheme;
  animated?: boolean;
  showPercentage?: boolean;
}

/**
 * 📊 BARRA DE PROGRESSO ESTILIZADA
 */
export const QuizProgressBar: React.FC<QuizProgressBarProps> = ({
  currentStep,
  totalSteps,
  theme = 'default',
  animated = true,
  showPercentage = true,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  const themeConfig = QUIZ_THEMES[theme];

  return (
    <div className={`w-full ${themeConfig.spacing.element}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm mb-2">
          <span className={themeConfig.colors.textSecondary}>Progresso</span>
          <span className={themeConfig.colors.text}>
            {percentage}% ({currentStep}/{totalSteps})
          </span>
        </div>
      )}

      <div className={`w-full bg-gray-200 ${themeConfig.borderRadius} h-3 overflow-hidden`}>
        <div
          className={`
            h-full ${themeConfig.colors.primary}
            ${animated ? 'transition-all duration-500 ease-out' : ''}
            ${percentage === 100 ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface QuizCardProps {
  children: React.ReactNode;
  theme?: QuizTheme;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  className?: string;
}

/**
 * 🎴 CARTÃO ESTILIZADO PARA QUIZ
 */
export const QuizCard: React.FC<QuizCardProps> = ({
  children,
  theme = 'default',
  variant = 'default',
  className = '',
}) => {
  const styleManager = new QuizStyleManager(theme);
  const themeConfig = QUIZ_THEMES[theme];

  const variantClasses = {
    default: styleManager.getCardClass(),
    elevated: `${styleManager.getCardClass()} transform hover:scale-105 ${themeConfig.animations}`,
    bordered: `${styleManager.getCardClass()} border-2 border-gray-200`,
    glass: `${themeConfig.colors.surface} backdrop-blur-md bg-opacity-80 ${themeConfig.borderRadius} ${themeConfig.shadows} p-6`,
  };

  return <div className={`${variantClasses[variant]} ${className}`}>{children}</div>;
};

interface QuizButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'small' | 'medium' | 'large';
  theme?: QuizTheme;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * 🔘 BOTÃO ESTILIZADO PARA QUIZ
 */
export const QuizButton: React.FC<QuizButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  theme = 'default',
  disabled = false,
  loading = false,
  icon,
  className = '',
}) => {
  const styleManager = new QuizStyleManager(theme);

  const sizeClasses = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-6 text-base',
    large: 'py-4 px-8 text-lg',
  };

  const buttonClass = [
    styleManager.getButtonClass(variant),
    sizeClasses[size],
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    loading ? 'relative' : '',
    'inline-flex items-center justify-center space-x-2',
    className,
  ].join(' ');

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
      )}

      <div className={loading ? 'opacity-0' : 'opacity-100 flex items-center space-x-2'}>
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
};

interface QuizAlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  theme?: QuizTheme;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

/**
 * 🚨 COMPONENTE DE ALERTA ESTILIZADO
 */
export const QuizAlert: React.FC<QuizAlertProps> = ({
  type,
  title,
  message,
  theme = 'default',
  dismissible = false,
  onDismiss,
  icon,
}) => {
  const themeConfig = QUIZ_THEMES[theme];

  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const defaultIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <QuizAnimationWrapper animation="slideUp" theme={theme}>
      <div
        className={`
        border-l-4 p-4 ${themeConfig.borderRadius} ${themeConfig.spacing.element}
        ${typeClasses[type]}
        ${themeConfig.animations}
      `}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icon || <span className="text-xl">{defaultIcons[type]}</span>}
          </div>

          <div className="ml-3 flex-1">
            {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
            <p className="text-sm">{message}</p>
          </div>

          {dismissible && (
            <div className="ml-auto pl-3">
              <button
                className="text-sm font-medium underline hover:no-underline focus:outline-none"
                onClick={onDismiss}
                aria-label="Fechar alerta"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </QuizAnimationWrapper>
  );
};

interface QuizBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  theme?: QuizTheme;
  className?: string;
}

/**
 * 🏷️ BADGE ESTILIZADO PARA QUIZ
 */
export const QuizBadge: React.FC<QuizBadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  theme = 'default',
  className = '',
}) => {
  const themeConfig = QUIZ_THEMES[theme];

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`
      inline-flex items-center font-medium
      ${themeConfig.borderRadius}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `}
    >
      {children}
    </span>
  );
};

interface QuizTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  theme?: QuizTheme;
}

/**
 * 💬 TOOLTIP ESTILIZADO PARA QUIZ
 */
export const QuizTooltip: React.FC<QuizTooltipProps> = ({
  children,
  content,
  position = 'top',
  theme = 'default',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const themeConfig = QUIZ_THEMES[theme];

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          className={`
          absolute z-50 px-3 py-2 text-sm text-white bg-gray-900
          ${themeConfig.borderRadius} ${themeConfig.shadows}
          ${positionClasses[position]}
          whitespace-nowrap
          ${themeConfig.animations}
          opacity-0 animate-fadeIn
        `}
        >
          {content}

          {/* Seta do tooltip */}
          <div
            className={`
            absolute w-2 h-2 bg-gray-900 transform rotate-45
            ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
            ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
            ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
            ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
          `}
          />
        </div>
      )}
    </div>
  );
};

/**
 * 🎨 HOOK PARA DETECÇÃO DE DISPOSITIVO
 */
export const useResponsiveDesign = () => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width < 768) setDevice('mobile');
      else if (width < 1024) setDevice('tablet');
      else setDevice('desktop');
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  return device;
};

/**
 * 🎯 HOOK PARA ACESSIBILIDADE
 */
export const useAccessibility = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detectar preferências do sistema
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setHighContrast(highContrastQuery.matches);
    setReducedMotion(reducedMotionQuery.matches);

    const handleHighContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);
    const handleReducedMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    highContrastQuery.addEventListener('change', handleHighContrastChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  return { highContrast, reducedMotion };
};
