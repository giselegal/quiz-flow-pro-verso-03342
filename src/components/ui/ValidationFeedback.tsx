import React from 'react';
import { ValidationResult } from '../../types/editor';

interface ValidationFeedbackProps {
  result?: ValidationResult;
  showSuccess?: boolean;
  customSuccess?: string;
  customError?: string;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  result,
  showSuccess = false,
  customSuccess = 'Validação bem sucedida!',
  customError,
}) => {
  if (!result) return null;

  const style = {
    success: {
      color: '#10B981',
      marginTop: '4px',
      fontSize: '14px',
    },
    error: {
      color: '#EF4444',
      marginTop: '4px',
      fontSize: '14px',
    },
  };

  if (result.success && showSuccess) {
    return <div style={style.success}>{customSuccess}</div>;
  }

  if (!result.success && result.errors && result.errors.length > 0) {
    return <div style={style.error}>{customError || result.errors[0].message}</div>;
  }

  return null;
};
