import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 12 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-12.json que inclui o header otimizado.
 */
export const Step12Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-12"
      fallbackStep={12}
    />
  );
};

export default Step12Template;
