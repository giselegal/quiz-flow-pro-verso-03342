import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 05 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-05.json que inclui o header otimizado.
 */
export const Step05Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-5"
      fallbackStep={5}
    />
  );
};

export default Step05Template;
