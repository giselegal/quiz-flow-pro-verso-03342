import React, { useEffect } from 'react';
import { useEditorFieldValidation } from '../../hooks/useEditorFieldValidation';
import { ValidationProps } from '../../types/editor';
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
  className = '',
}) => {
  const { validateField, getFieldErrors, isFieldTouched } = useEditorFieldValidation();
  const errors = getFieldErrors(id);
  const hasError = isFieldTouched(id) && errors.length > 0;

  useEffect(() => {
    if (isFieldTouched(id)) {
      validateField(id, value, validations);
    }
  }, [id, value, validations, isFieldTouched, validateField]);

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];

    onChange(newValue);
    validateField(id, newValue, validations);
  };

  const handleBlur = () => {
    validateField(id, value, validations);
    onBlur?.();
  };

  return (
    <div className="validated-multiselect-container">
      {label && <label className="validated-multiselect-label">{label}</label>}

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
            errors: errors,
          }}
        />
      )}
    </div>
  );
};
