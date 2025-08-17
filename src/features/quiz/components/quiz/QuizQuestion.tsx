import React, { useState } from 'react';
import { useValidation } from '../../hooks/useValidation';
import { ValidationResult } from '../../types/editor';
import { ValidationFeedback } from '../ui/ValidationFeedback';

interface QuizQuestionProps {
  question: string;
  options: string[];
  required?: boolean;
  minSelected?: number;
  maxSelected?: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  required,
  minSelected,
  maxSelected,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { validate } = useValidation();
  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);

  const handleSelect = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];

    setSelected(newSelected);
    handleValidate(newSelected);
  };

  const handleValidate = (value: string[]) => {
    const validations = [];

    if (required) {
      validations.push({
        type: 'required',
        properties: {},
      });
    }

    if (minSelected) {
      validations.push({
        type: 'custom',
        properties: {
          validator: (val: string[]) => val.length >= minSelected,
          message: `Selecione pelo menos ${minSelected} opções`,
        },
      });
    }

    if (maxSelected) {
      validations.push({
        type: 'custom',
        properties: {
          validator: (val: string[]) => val.length <= maxSelected,
          message: `Selecione no máximo ${maxSelected} opções`,
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
      <h3>{question}</h3>

      <div style={{ marginTop: '12px' }}>
        {options.map(option => (
          <div
            key={option}
            onClick={() => handleSelect(option)}
            style={{
              padding: '8px 12px',
              marginBottom: '8px',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: selected.includes(option) ? '#EBF5FF' : 'white',
            }}
          >
            {option}
          </div>
        ))}
      </div>

      <ValidationFeedback
        result={validationResult}
        customError={validationResult?.errors?.[0]?.message}
      />
    </div>
  );
};
