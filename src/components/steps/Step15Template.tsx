import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 15 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-15.json que inclui o header otimizado.
 */
export const Step15Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-15"
      fallbackStep={15}
    />
  );
};

export default Step15Template;
