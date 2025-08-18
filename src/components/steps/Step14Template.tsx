import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 14 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-14.json que inclui o header otimizado.
 */
export const Step14Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-14"
      fallbackStep={14}
    />
  );
};

export default Step14Template;
