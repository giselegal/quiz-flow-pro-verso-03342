import React from 'react';
import { TemplateRenderer } from '../templates/TemplateRenderer';

/**
 * 📋 STEP 08 - Quiz Template Component
 *
 * Este componente usa o TemplateRenderer para carregar o template
 * consolidado da step-08.json que inclui o header otimizado.
 */
export const Step08Template: React.FC = () => {
  return <TemplateRenderer stepNumber={8} sessionId="demo" />;
};

export default Step08Template;
