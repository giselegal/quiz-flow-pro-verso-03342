import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 01 - Quiz Template Component
 * 
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-01.json que inclui o header otimizado.
 */
export const Step01Template: React.FC = () => {
  return (
    <TemplateRenderer 
      stepNumber={1}
      sessionId="demo"
    />
  );
};

export default Step01Template;
