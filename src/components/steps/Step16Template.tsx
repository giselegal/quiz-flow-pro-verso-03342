import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 16 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-16.json que inclui o header otimizado.
 */
export const Step16Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-16"
      fallbackStep={16}
    />
  );
};

export default Step16Template;
