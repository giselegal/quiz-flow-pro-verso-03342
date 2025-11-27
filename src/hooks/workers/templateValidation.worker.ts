/**
 * 🔧 TEMPLATE VALIDATION WORKER
 * 
 * Web Worker para validação de templates em background
 * sem bloquear a thread principal.
 * 
 * @version 1.0.0
 */

import { validateFunnel, validateSteps } from '@/types/funnel.shared';

export interface ValidationMessage {
    type: 'validate-funnel' | 'validate-steps';
    data: unknown;
}

export interface ValidationResult {
    success: boolean;
    errors?: string[];
    data?: unknown;
}

// Listen for messages from main thread
self.addEventListener('message', (event: MessageEvent<ValidationMessage>) => {
    const { type, data } = event.data;
    
    try {
        let result: ValidationResult;
        
        switch (type) {
            case 'validate-funnel':
                const funnel = validateFunnel(data);
                result = { success: true, data: funnel };
                break;
                
            case 'validate-steps':
                const steps = validateSteps(data as unknown[]);
                result = { success: true, data: steps };
                break;
                
            default:
                result = { success: false, errors: ['Unknown validation type'] };
        }
        
        self.postMessage(result);
    } catch (error) {
        self.postMessage({
            success: false,
            errors: [error instanceof Error ? error.message : 'Validation failed'],
        });
    }
});

// Export empty object for TypeScript
export {};
