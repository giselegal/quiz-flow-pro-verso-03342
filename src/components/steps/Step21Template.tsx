import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 21 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-21.json que inclui o header otimizado.
 */
export const Step21Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-21"
      fallbackStep={21}
    />
  );
};

export default Step21Template;
