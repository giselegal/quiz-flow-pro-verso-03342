import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 07 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-07.json que inclui o header otimizado.
 */
export const Step07Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-7"
      fallbackStep={7}
    />
  );
};

export default Step07Template;
