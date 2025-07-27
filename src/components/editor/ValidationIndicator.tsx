import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Loader } from 'lucide-react';
import { ValidationResult, ValidationError } from '../hooks/useNavigationValidation';

interface ValidationIndicatorProps {
  validation: ValidationResult;
  isLoading?: boolean;
  showDetails?: boolean;
  className?: string;
}

const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({
  validation,
  isLoading = false,
  showDetails = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader className="w-4 h-4 text-blue-500 animate-spin" />
        <span className="text-sm text-blue-600">Validando...</span>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (validation.isValid) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    const hasRequired = validation.errors.some(e => e.type === 'required');
    if (hasRequired) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (validation.isValid) {
      return 'Válido';
    }
    
    const requiredErrors = validation.errors.filter(e => e.type === 'required').length;
    const incompleteErrors = validation.errors.filter(e => e.type === 'incomplete').length;
    const invalidErrors = validation.errors.filter(e => e.type === 'invalid').length;
    
    if (requiredErrors > 0) {
      return `${requiredErrors} campo${requiredErrors > 1 ? 's' : ''} obrigatório${requiredErrors > 1 ? 's' : ''}`;
    }
    
    if (incompleteErrors > 0) {
      return `${incompleteErrors} item${incompleteErrors > 1 ? 's' : ''} incompleto${incompleteErrors > 1 ? 's' : ''}`;
    }
    
    if (invalidErrors > 0) {
      return `${invalidErrors} erro${invalidErrors > 1 ? 's' : ''}`;
    }
    
    return `${validation.errors.length} problema${validation.errors.length > 1 ? 's' : ''}`;
  };

  const getStatusColor = () => {
    if (validation.isValid) {
      return 'text-green-600';
    }
    
    const hasRequired = validation.errors.some(e => e.type === 'required');
    return hasRequired ? 'text-red-600' : 'text-yellow-600';
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {showDetails && validation.errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {validation.errors.map((error, index) => (
            <ValidationErrorItem key={index} error={error} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ValidationErrorItemProps {
  error: ValidationError;
}

const ValidationErrorItem: React.FC<ValidationErrorItemProps> = ({ error }) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'required':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'incomplete':
        return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'invalid':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <AlertTriangle className="w-3 h-3 text-gray-500" />;
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'required':
        return 'text-red-600';
      case 'incomplete':
        return 'text-yellow-600';
      case 'invalid':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      {getErrorIcon()}
      <span className={getErrorColor()}>
        {error.message}
      </span>
    </div>
  );
};

// Componente para mostrar progresso geral de validação
interface ValidationProgressProps {
  completed: number;
  total: number;
  percentage: number;
  className?: string;
}

export const ValidationProgress: React.FC<ValidationProgressProps> = ({
  completed,
  total,
  percentage,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Progresso de Validação</span>
        <span className="font-medium text-gray-900">
          {completed}/{total} ({percentage}%)
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage === 100 && (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Todas as páginas validadas!</span>
        </div>
      )}
    </div>
  );
};

// Hook para usar com componentes
export const useValidationDisplay = (validation: ValidationResult) => {
  const getSummary = () => {
    if (validation.isValid) {
      return { status: 'success', message: 'Tudo OK' };
    }
    
    const requiredCount = validation.errors.filter(e => e.type === 'required').length;
    const incompleteCount = validation.errors.filter(e => e.type === 'incomplete').length;
    
    if (requiredCount > 0) {
      return { 
        status: 'error', 
        message: `${requiredCount} campo${requiredCount > 1 ? 's' : ''} obrigatório${requiredCount > 1 ? 's' : ''}` 
      };
    }
    
    if (incompleteCount > 0) {
      return { 
        status: 'warning', 
        message: `${incompleteCount} item${incompleteCount > 1 ? 's' : ''} incompleto${incompleteCount > 1 ? 's' : ''}` 
      };
    }
    
    return { 
      status: 'warning', 
      message: `${validation.errors.length} problema${validation.errors.length > 1 ? 's' : ''}` 
    };
  };

  const getErrorsByType = () => {
    const grouped = validation.errors.reduce((acc, error) => {
      if (!acc[error.type]) {
        acc[error.type] = [];
      }
      acc[error.type].push(error);
      return acc;
    }, {} as Record<string, ValidationError[]>);
    
    return grouped;
  };

  return {
    summary: getSummary(),
    errorsByType: getErrorsByType(),
    hasErrors: validation.errors.length > 0,
    canProceed: validation.canProceed
  };
};

export default ValidationIndicator;
