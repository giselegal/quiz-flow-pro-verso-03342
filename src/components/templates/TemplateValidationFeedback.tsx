import React from 'react';
import '../../styles/validated-components.css';

interface TemplateValidationFeedbackProps {
  errors: Record<string, Record<string, Array<{ path: string; message: string }>>>;
  showAllErrors?: boolean;
}

export const TemplateValidationFeedback: React.FC<TemplateValidationFeedbackProps> = ({
  errors,
  showAllErrors = false,
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
                  {fieldErrors.map((error, index) =>
                    showAllErrors || index === 0 ? (
                      <li key={index} className="error-message">
                        {error.message}
                      </li>
                    ) : null
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
