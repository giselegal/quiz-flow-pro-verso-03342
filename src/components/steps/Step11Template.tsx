import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 11 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-11.json que inclui o header otimizado.
 */
export const Step11Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-11"
      fallbackStep={11}
    />
  );
};

export default Step11Template;
