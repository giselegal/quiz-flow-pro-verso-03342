import React, { useState, useEffect } from 'react';
import { ValidationProps } from '../../types/editor';
import { useValidationContext } from '../../context/ValidationContext';
import { ValidationFeedback } from '../ui/ValidationFeedback';

interface ValidatedInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validations?: ValidationProps[];
  placeholder?: string;
  className?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  validations = [],
  placeholder,
  className = ''
}) => {
  const { validateField, getFieldErrors, clearFieldErrors } = useValidationContext();
  const [touched, setTouched] = useState(false);
  const errors = getFieldErrors(id);
  const hasError = touched && errors.length > 0;

  useEffect(() => {
    if (touched) {
      validateField(id, value, validations);
    }
  }, [id, value, validations, touched, validateField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
    validateField(id, value, validations);
    onBlur?.();
  };

  return (
    <div className="validated-input-container">
      {label && (
        <label 
          htmlFor={id}
          className="validated-input-label"
        >
          {label}
        </label>
      )}
      
      <input
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`validated-input ${hasError ? 'validated-input-error' : ''} ${className}`}
      />

      {hasError && (
        <ValidationFeedback 
          result={{
            success: false,
            errors: errors
          }}
        />
      )}

      <style jsx>{`
        .validated-input-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .validated-input-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .validated-input {
          padding: 8px 12px;
          border: 1px solid #E5E7EB;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .validated-input:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .validated-input-error {
          border-color: #EF4444;
        }

        .validated-input-error:focus {
          border-color: #EF4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};
