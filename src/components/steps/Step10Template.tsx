import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 10 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-10.json que inclui o header otimizado.
 */
export const Step10Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-10"
      fallbackStep={10}
    />
  );
};

export default Step10Template;
