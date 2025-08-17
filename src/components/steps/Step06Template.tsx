import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 06 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-06.json que inclui o header otimizado.
 */
export const Step06Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-6"
      fallbackStep={6}
    />
  );
};

export default Step06Template;
