import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 19 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-19.json que inclui o header otimizado.
 */
export const Step19Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-19"
      fallbackStep={19}
    />
  );
};

export default Step19Template;
