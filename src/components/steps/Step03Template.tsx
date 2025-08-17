import React from 'react';
import { TemplateRenderer } from '../template/TemplateRenderer';

/**
 * 📋 STEP 03 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-03.json que inclui o header otimizado.
 */
export const Step03Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-3"
      fallbackStep={3}
    />
  );
};

export default Step03Template;
