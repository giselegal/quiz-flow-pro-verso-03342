import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 18 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-18.json que inclui o header otimizado.
 */
export const Step18Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-18"
      fallbackStep={18}
    />
  );
};

export default Step18Template;
