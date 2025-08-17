import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 02 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-02.json que inclui o header otimizado.
 */
export const Step02Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-2"
      fallbackStep={2}
    />
  );
};

export default Step02Template;
