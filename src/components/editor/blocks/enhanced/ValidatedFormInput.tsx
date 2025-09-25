/**
 * 🎯 FASE 2 - VALIDATED FORM INPUT
 * 
 * Componente de input com validação visual integrada
 * Replica o comportamento da versão de produção
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useFieldValidation } from '@/hooks/useStepValidation';
import { ValidationIndicator, ValidationState } from '../../unified/ValidationIndicator';

interface ValidatedFormInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  stepNumber: number;
  fieldName?: string;
  className?: string;
  isPreview?: boolean;
  showValidation?: boolean;
  autoFocus?: boolean;
}

/**
 * Input com validação em tempo real
 */
export const ValidatedFormInput: React.FC<ValidatedFormInputProps> = ({
  value,
  onChange,
  placeholder = 'Digite aqui...',
  required = true,
  stepNumber,
  fieldName = 'name',
  className = '',
  isPreview = false,
  showValidation = true,
  autoFocus = false,
}) => {
  const { isValid, error } = useFieldValidation(fieldName, value, stepNumber);
  
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasBlurred, setHasBlurred] = React.useState(false);
  
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus se necessário
  React.useEffect(() => {
    if (autoFocus && inputRef.current && !isPreview) {
      inputRef.current.focus();
    }
  }, [autoFocus, isPreview]);

  // Determinar estado visual de validação
  const getValidationState = (): ValidationState => {
    if (!showValidation) return 'none';
    if (!hasBlurred && !value) return 'none';
    
    if (value && value.length < 2) return 'warning';
    if (isValid) return 'valid';
    if (error) return 'invalid';
    
    return 'none';
  };

  const validationState = getValidationState();

  const handleBlur = () => {
    setIsFocused(false);
    setHasBlurred(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Input principal */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={isPreview}
          className={cn(
            'w-full px-4 py-3 text-lg border-2 rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'placeholder:text-stone-400',
            
            // Estados de validação
            validationState === 'valid' && 'border-green-500 bg-green-50/50 focus:ring-green-500',
            validationState === 'invalid' && 'border-red-500 bg-red-50/50 focus:ring-red-500',
            validationState === 'warning' && 'border-yellow-500 bg-yellow-50/50 focus:ring-yellow-500',
            validationState === 'none' && 'border-stone-300 bg-white focus:ring-primary focus:border-primary',
            
            // Estados interativos
            isFocused && 'ring-2 ring-offset-2',
            isPreview && 'cursor-default opacity-75',
            
            // Hover states
            !isPreview && 'hover:border-stone-400'
          )}
        />
        
        {/* Indicador de validação no canto do input */}
        {validationState !== 'none' && showValidation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ValidationIndicator 
              state={validationState}
              showIcon={true}
              showMessage={false}
              size="sm"
            />
          </div>
        )}
      </div>
      
      {/* Mensagem de feedback */}
      {showValidation && (error || (value && value.length < 2)) && hasBlurred && (
        <div className={cn(
          'text-sm px-1 transition-all duration-200',
          validationState === 'invalid' && 'text-red-600',
          validationState === 'warning' && 'text-yellow-600'
        )}>
          {error || (value && value.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : '')}
        </div>
      )}
      
      {/* Feedback positivo */}
      {showValidation && validationState === 'valid' && hasBlurred && (
        <div className="text-sm text-green-600 px-1 transition-all duration-200">
          ✓ Nome válido
        </div>
      )}
      
      {/* Contador de caracteres */}
      {value && (
        <div className="text-xs text-stone-500 text-right px-1">
          {value.length}/100 caracteres
        </div>
      )}
    </div>
  );
};

export default ValidatedFormInput;