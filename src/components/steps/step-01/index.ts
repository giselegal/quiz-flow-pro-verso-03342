/**
 * 📦 STEP 01 - EXPORTS PRINCIPAIS
 * 
 * Ponto de entrada central para o Step 1 modular.
 * Registra automaticamente o step no sistema.
 */

import { stepRegistry } from '../../step-registry/StepRegistry';
import Step01Container from './Step01Container';

// Registrar automaticamente o step no sistema
stepRegistry.register({
    id: 'step-01',
    name: 'Introdução',
    component: Step01Container,
    config: {
        allowNavigation: {
            next: true,
            previous: false // Primeira etapa não permite voltar
        },
        validation: {
            required: true,
            rules: [
                {
                    field: 'userName',
                    required: true,
                    minLength: 2,
                    message: 'Nome deve ter pelo menos 2 caracteres'
                }
            ]
        },
        metadata: {
            description: 'Etapa de apresentação e captura do nome do usuário',
            category: 'intro',
            estimatedTime: 30 // 30 segundos
        }
    }
});

// Exports principais
export { default as Step01Container } from './Step01Container';
export * from './components';
export * from './hooks/useStep01Logic';
export * from './types';

// Export default do container
export default Step01Container;
