import React from 'react';
import { ValidationResult } from '../../types/editor';

interface TemplateValidationFeedbackProps {
  errors: Record<string, Record<string, Array<{path: string; message: string}>>>;
  showAllErrors?: boolean;
}

export const TemplateValidationFeedback: React.FC<TemplateValidationFeedbackProps> = ({
  errors,
  showAllErrors = false
}) => {
  // Se não houver erros, não renderiza nada
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div className="template-validation-feedback">
      {Object.entries(errors).map(([blockId, blockErrors]) => (
        <div key={blockId} className="template-validation-block">
          <h4>Bloco: {blockId}</h4>
          <ul>
            {Object.entries(blockErrors).map(([field, fieldErrors]) => (
              <li key={field}>
                <span className="field-name">{field}:</span>
                <ul className="error-list">
                  {fieldErrors.map((error, index) => (
                    showAllErrors || index === 0 ? (
                      <li key={index} className="error-message">
                        {error.message}
                      </li>
                    ) : null
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <style jsx>{`
        .template-validation-feedback {
          margin-top: 16px;
          padding: 16px;
          border: 1px solid #FEE2E2;
          border-radius: 8px;
          background-color: #FEF2F2;
        }

        .template-validation-block {
          margin-bottom: 16px;
        }

        .template-validation-block:last-child {
          margin-bottom: 0;
        }

        .template-validation-block h4 {
          margin: 0 0 8px;
          color: #991B1B;
          font-size: 14px;
          font-weight: 600;
        }

        .template-validation-block ul {
          margin: 0;
          padding-left: 20px;
        }

        .field-name {
          font-weight: 500;
          color: #991B1B;
        }

        .error-list {
          margin-top: 4px !important;
        }

        .error-message {
          color: #B91C1C;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};
