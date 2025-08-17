import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 21 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-21.json que inclui o header otimizado.
 */
export const Step21Template: React.FC = () => {
  return (
    <TemplateRenderer 
      stepNumber={21}
      sessionId="demo"
    />
  );
};

export default Step21Template;
