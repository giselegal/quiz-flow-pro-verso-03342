import React, { useEffect } from 'react';
import { useEditorFieldValidation } from '../../hooks/useEditorFieldValidation';
import { ValidationProps } from '../../types/editor';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    validateField(id, value, validations);
    onBlur?.();
  };

  return (
    <div className="validated-input-container">
      {label && (
        <label htmlFor={id} className="validated-input-label">
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
            errors: errors,
          }}
        />
      )}
    </div>
  );
};
