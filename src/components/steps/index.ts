/**
 * 📦 STEPS COMPONENTS - Auto-generated exports
 * 
 * Todos os componentes das steps que usam o TemplateRenderer
 * para carregar templates consolidados com headers otimizados.
 * 
 * Gerado automaticamente em: 2025-08-17T18:36:43.634Z
 */

export { default as Step01Template } from './Step01Template';
export { default as Step02Template } from './Step02Template';
export { default as Step03Template } from './Step03Template';
export { default as Step04Template } from './Step04Template';
export { default as Step05Template } from './Step05Template';
export { default as Step06Template } from './Step06Template';
export { default as Step07Template } from './Step07Template';
export { default as Step08Template } from './Step08Template';
export { default as Step09Template } from './Step09Template';
export { default as Step10Template } from './Step10Template';
export { default as Step11Template } from './Step11Template';
export { default as Step12Template } from './Step12Template';
export { default as Step13Template } from './Step13Template';
export { default as Step14Template } from './Step14Template';
export { default as Step15Template } from './Step15Template';
export { default as Step16Template } from './Step16Template';
export { default as Step17Template } from './Step17Template';
export { default as Step18Template } from './Step18Template';
export { default as Step19Template } from './Step19Template';
export { default as Step20Template } from './Step20Template';
export { default as Step21Template } from './Step21Template';

// Tipo para facilitar importação dinâmica
export type StepComponent = React.FC;

// Helper para importação dinâmica
export const getStepComponent = async (stepNumber: number) => {
  const stepId = stepNumber.toString().padStart(2, '0');
  const module = await import(`./Step${stepId}Template`);
  return module.default;
};
