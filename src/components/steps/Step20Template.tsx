import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 20 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-20.json que inclui o header otimizado.
 */
export const Step20Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-20"
      fallbackStep={20}
    />
  );
};

export default Step20Template;
