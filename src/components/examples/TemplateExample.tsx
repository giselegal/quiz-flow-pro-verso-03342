import React, { useState } from 'react';
import { useTemplateValidation } from '../../hooks/useTemplateValidation';
import '../../styles/validated-components.css';
import { ValidatedPropertyPanel } from '../editor/ValidatedPropertyPanel';
import { TemplateValidationFeedback } from '../templates/TemplateValidationFeedback';

const initialBlocks = [
  {
    id: 'text-1',
    type: 'text-block',
    values: {
      content: '',
      fontSize: '16px',
    },
  },
  {
    id: 'question-1',
    type: 'question-block',
    values: {
      question: '',
      options: [],
    },
  },
  {
    id: 'button-1',
    type: 'button-block',
    values: {
      text: '',
      action: '',
    },
  },
];

export const TemplateExample: React.FC = () => {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [stepId] = useState('step-1');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, Record<string, Array<{ path: string; message: string }>>>
  >({});
  const { validateStep, validateTemplateField } = useTemplateValidation();

  const handleBlockChange = (blockId: string, values: Record<string, unknown>) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block => (block.id === blockId ? { ...block, values } : block))
    );

    // Validar o bloco quando seus valores mudam
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      Object.entries(values).forEach(([fieldId, value]) => {
        validateTemplateField(blockId, fieldId, value, block.type);
      });
    }
  };

  const handleValidateStep = () => {
    const result = validateStep(stepId, blocks);
    setValidationErrors(result.errors);
  };

  return (
    <div className="template-example">
      <h2>Template - Etapa 1</h2>

      {blocks.map(block => (
        <div key={block.id} className="template-example-block">
          <h3>{block.type}</h3>
          <ValidatedPropertyPanel
            blockId={block.id}
            type={block.type}
            values={block.values}
            onChange={values => handleBlockChange(block.id, values)}
            validations={{}}
          />
        </div>
      ))}

      <button onClick={handleValidateStep} className="validate-button">
        Validar Etapa
      </button>

      <TemplateValidationFeedback errors={validationErrors} showAllErrors />

      <style>{`
        .template-example {
          padding: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .template-example h2 {
          margin: 0 0 24px;
          color: #1f2937;
        }

        .template-example-block {
          margin-bottom: 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .template-example-block h3 {
          margin: 0 0 16px;
          color: #374151;
          font-size: 16px;
        }

        .validate-button {
          margin-top: 24px;
          padding: 8px 16px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .validate-button:hover {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
};
