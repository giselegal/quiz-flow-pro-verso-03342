import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 04 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-04.json que inclui o header otimizado.
 */
export const Step04Template: React.FC = () => {
  return (
    <TemplateRenderer 
      templateId="step-4"
      fallbackStep={4}
    />
  );
};

export default Step04Template;
