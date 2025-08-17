import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 17 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-17.json que inclui o header otimizado.
 */
export const Step17Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-17"
      fallbackStep={17}
    />
  );
};

export default Step17Template;
