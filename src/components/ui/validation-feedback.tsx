import { cn } from '@/lib/utils';
import { ValidationResult } from '@/types/quizCore';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface FeedbackProps {
  validation: ValidationResult;
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export const ValidationFeedback: React.FC<FeedbackProps> = ({
  validation,
  showIcon = true,
  showText = true,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, [validation]);

  if (!validation || (!validation.errors.length && !validation.warnings.length)) {
    return null;
  }

  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <div
      className={cn(
        'transition-all duration-200',
        isVisible ? 'opacity-100' : 'opacity-0',
        hasErrors ? 'text-destructive' : hasWarnings ? 'text-warning' : 'text-success',
        'flex items-center gap-2',
        className
      )}
    >
      {showIcon && (
        <div className="flex-shrink-0">
          {hasErrors ? (
            <AlertCircle className="h-4 w-4" />
          ) : hasWarnings ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
        </div>
      )}

      {showText && (
        <div className="text-sm">
          {hasErrors ? (
            <ul className="list-disc list-inside">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ) : hasWarnings ? (
            <ul className="list-disc list-inside">
              {validation.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Componente de feedback para campos individuais
interface FieldFeedbackProps {
  value: any;
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
  };
  showIcon?: boolean;
  className?: string;
}

export const FieldFeedback: React.FC<FieldFeedbackProps> = ({
  value,
  rules,
  showIcon = true,
  className,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateField();
  }, [value]);

  const validateField = () => {
    if (rules.required && (!value || value.toString().trim() === '')) {
      setError('Este campo é obrigatório');
      setIsValid(false);
      return;
    }

    if (rules.minLength && value.toString().length < rules.minLength) {
      setError(`Mínimo de ${rules.minLength} caracteres`);
      setIsValid(false);
      return;
    }

    if (rules.maxLength && value.toString().length > rules.maxLength) {
      setError(`Máximo de ${rules.maxLength} caracteres`);
      setIsValid(false);
      return;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      setError('Formato inválido');
      setIsValid(false);
      return;
    }

    if (rules.custom && !rules.custom(value)) {
      setError('Valor inválido');
      setIsValid(false);
      return;
    }

    setError(null);
    setIsValid(true);
  };

  if (!error && !isValid) return null;

  return (
    <div
      className={cn(
        'transition-all duration-200',
        error ? 'text-destructive' : 'text-success',
        'flex items-center gap-2',
        className
      )}
    >
      {showIcon && (
        <div className="flex-shrink-0">
          {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
        </div>
      )}

      {error && <span className="text-sm">{error}</span>}
    </div>
  );
};

// Componente de indicador de progresso
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  validSteps: number[];
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  validSteps,
  className,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500',
            validSteps.includes(currentStep) ? 'bg-success' : 'bg-primary'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{Math.round(progress)}%</span>
        <span>
          {validSteps.length} de {totalSteps} etapas válidas
        </span>
      </div>
    </div>
  );
};
