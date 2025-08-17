import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 09 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-09.json que inclui o header otimizado.
 */
export const Step09Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-9"
      fallbackStep={9}
    />
  );
};

export default Step09Template;
