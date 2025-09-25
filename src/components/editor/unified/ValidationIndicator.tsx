/**
 * 🎯 VALIDATION INDICATOR - Indicadores visuais de validação
 * 
 * Mostra estados de validação dos blocos de forma visual
 * consistente com a versão de produção
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, AlertCircle, Clock } from 'lucide-react';

export type ValidationState = 'valid' | 'invalid' | 'warning' | 'pending' | 'none';

export interface ValidationIndicatorProps {
  state: ValidationState;
  message?: string;
  showIcon?: boolean;
  showMessage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Indicador visual de validação
 */
export const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({
  state,
  message,
  showIcon = true,
  showMessage = true,
  size = 'md',
  className = '',
}) => {
  if (state === 'none') return null;

  const getStateConfig = (state: ValidationState) => {
    switch (state) {
      case 'valid':
        return {
          icon: Check,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Válido'
        };
      case 'invalid':
        return {
          icon: X,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Inválido'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Atenção'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'Aguardando'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-stone-600',
          bgColor: 'bg-stone-50',
          borderColor: 'border-stone-200',
          label: 'Desconhecido'
        };
    }
  };

  const config = getStateConfig(state);
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: {
      icon: 'w-3 h-3',
      text: 'text-xs',
      padding: 'px-2 py-1',
    },
    md: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      padding: 'px-3 py-1.5',
    },
    lg: {
      icon: 'w-5 h-5',
      text: 'text-base',
      padding: 'px-4 py-2',
    }
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-md border',
      config.bgColor,
      config.borderColor,
      sizeClasses[size].padding,
      className
    )}>
      {showIcon && (
        <IconComponent className={cn(
          sizeClasses[size].icon,
          config.color
        )} />
      )}
      
      {showMessage && (
        <span className={cn(
          'font-medium',
          sizeClasses[size].text,
          config.color
        )}>
          {message || config.label}
        </span>
      )}
    </div>
  );
};

/**
 * Badge de validação para canto de blocos
 */
export const ValidationBadge: React.FC<{
  state: ValidationState;
  className?: string;
}> = ({ state, className = '' }) => {
  if (state === 'none') return null;

  const config = {
    valid: 'bg-green-500 text-white',
    invalid: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    pending: 'bg-blue-500 text-white',
  }[state] || 'bg-stone-500 text-white';

  const icons = {
    valid: Check,
    invalid: X,
    warning: AlertCircle,
    pending: Clock,
  };

  const IconComponent = icons[state];

  return (
    <div className={cn(
      'absolute -top-2 -right-2 z-20 rounded-full p-1.5',
      config,
      className
    )}>
      {IconComponent && <IconComponent className="w-3 h-3" />}
    </div>
  );
};

/**
 * Hook para gerenciar estados de validação
 */
export const useValidation = () => {
  const [validationStates, setValidationStates] = React.useState<Record<string, ValidationState>>({});
  const [validationMessages, setValidationMessages] = React.useState<Record<string, string>>({});

  const setValidation = React.useCallback((id: string, state: ValidationState, message?: string) => {
    setValidationStates(prev => ({
      ...prev,
      [id]: state
    }));
    
    if (message) {
      setValidationMessages(prev => ({
        ...prev,
        [id]: message
      }));
    }
  }, []);

  const getValidation = React.useCallback((id: string) => ({
    state: validationStates[id] || 'none',
    message: validationMessages[id]
  }), [validationStates, validationMessages]);

  const clearValidation = React.useCallback((id: string) => {
    setValidationStates(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setValidationMessages(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clearAllValidations = React.useCallback(() => {
    setValidationStates({});
    setValidationMessages({});
  }, []);

  return {
    validationStates,
    validationMessages,
    setValidation,
    getValidation,
    clearValidation,
    clearAllValidations
  };
};

export default ValidationIndicator;