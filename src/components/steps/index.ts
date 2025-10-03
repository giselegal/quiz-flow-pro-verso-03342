/**
 * 🚀 INICIALIZADOR DOS STEPS MODULARES
 * 
 * Carrega automaticamente todos os steps disponíveis.
 * Deve ser importado no início da aplicação.
 */

// Importar steps para registrá-los automaticamente
import './step-01';

// Pode importar outros steps aqui conforme forem criados
// import './step-02';
// import './step-03';
// ...

// Export do registry para uso externo
export { stepRegistry } from '../step-registry/StepRegistry';
export { StepRenderer } from '../step-registry/StepRenderer';

// Export de utilitários
export type { BaseStepProps, StepDefinition } from '../step-registry/StepTypes';

console.log('📱 Steps modulares carregados:', {
    total: stepRegistry.getAll().length,
    steps: stepRegistry.getAll().map(s => s.name)
});