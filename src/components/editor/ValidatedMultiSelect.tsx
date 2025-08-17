import React, { useState, useEffect } from 'react';
import { ValidationProps } from '../../types/editor';
import { useValidationContext } from '../../context/ValidationContext';
import { ValidationFeedback } from '../ui/ValidationFeedback';

interface Option {
  value: string;
  label: string;
}

interface ValidatedMultiSelectProps {
  id: string;
  label?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  validations?: ValidationProps[];
  className?: string;
}

export const ValidatedMultiSelect: React.FC<ValidatedMultiSelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  onBlur,
  validations = [],
  className = ''
}) => {
  const { validateField, getFieldErrors } = useValidationContext();
  const [touched, setTouched] = useState(false);
  const errors = getFieldErrors(id);
  const hasError = touched && errors.length > 0;

  useEffect(() => {
    if (touched) {
      validateField(id, value, validations);
    }
  }, [id, value, validations, touched, validateField]);

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onChange(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    validateField(id, value, validations);
    onBlur?.();
  };

  return (
    <div className="validated-multiselect-container">
      {label && (
        <label className="validated-multiselect-label">
          {label}
        </label>
      )}
      
      <div 
        className={`validated-multiselect-options ${hasError ? 'validated-multiselect-error' : ''} ${className}`}
        onBlur={handleBlur}
      >
        {options.map(option => (
          <div
            key={option.value}
            className={`validated-multiselect-option ${value.includes(option.value) ? 'selected' : ''}`}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>

      {hasError && (
        <ValidationFeedback 
          result={{
            success: false,
            errors: errors
          }}
        />
      )}

      <style jsx>{`
        .validated-multiselect-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .validated-multiselect-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .validated-multiselect-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 8px;
          padding: 8px;
          border: 1px solid #E5E7EB;
          border-radius: 4px;
        }

        .validated-multiselect-error {
          border-color: #EF4444;
        }

        .validated-multiselect-option {
          padding: 8px 12px;
          border: 1px solid #E5E7EB;
          border-radius: 4px;
          cursor: pointer;
          user-select: none;
          transition: all 0.2s;
        }

        .validated-multiselect-option:hover {
          background-color: #F3F4F6;
        }

        .validated-multiselect-option.selected {
          background-color: #EBF5FF;
          border-color: #3B82F6;
        }
      `}</style>
    </div>
  );
};
