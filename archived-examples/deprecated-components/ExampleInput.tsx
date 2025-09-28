import React, { useState } from 'react';
import { useValidation } from '../../hooks/useValidation';
import { ValidationProps, ValidationResult } from '../../types/editor';
import { ValidationFeedback } from '../ui/ValidationFeedback';

interface ExampleInputProps {
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
}

export const ExampleInput: React.FC<ExampleInputProps> = ({
  label,
  required,
  minLength,
  maxLength,
  pattern,
  patternMessage,
}) => {
  const [value, setValue] = useState('');
  const { validate } = useValidation();
  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);

  const handleValidate = () => {
    const validations: ValidationProps[] = [];

    if (required) {
      validations.push({
        type: 'required',
        properties: {},
      });
    }

    if (minLength) {
      validations.push({
        type: 'minLength',
        properties: { min: minLength },
      });
    }

    if (maxLength) {
      validations.push({
        type: 'maxLength',
        properties: { max: maxLength },
      });
    }

    if (pattern) {
      validations.push({
        type: 'pattern',
        properties: {
          regex: pattern,
          message: patternMessage,
        },
      });
    }

    const initialResult: ValidationResult = { success: true, errors: [] };

    const result = validations.reduce((acc: ValidationResult, validation) => {
      const validationResult = validate(value, validation);
      return {
        success: acc.success && validationResult.success,
        errors: [...(acc.errors || []), ...(validationResult.errors || [])],
      };
    }, initialResult);

    setValidationResult(result);
  };

  return (
    <div>
      <label>{label}</label>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={handleValidate}
        style={{
          borderColor: validationResult?.success === false ? '#EF4444' : '#E5E7EB',
        }}
      />
      <ValidationFeedback result={validationResult} />
    </div>
  );
};
