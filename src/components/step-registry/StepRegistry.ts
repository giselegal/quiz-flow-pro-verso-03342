/**
 * 🏭 REGISTRO CENTRAL DE STEPS
 * 
 * Sistema centralizado para registrar, descobrir e gerenciar
 * todos os steps modulares do quiz.
 */

import { StepComponent } from './StepTypes';
import { appLogger } from '@/lib/utils/appLogger';

class StepRegistry {
    private steps = new Map<string, StepComponent>();
    private initialized = false;

    /**
     * Normaliza IDs de step para o formato canônico step-XX (com zero à esquerda)
     * Aceita aliases como step-1 e converte para step-01.
     */
    private normalizeId(stepId: string): string {
        try {
            const match = String(stepId).match(/^step-(\d{1,2})$/i);
            if (match) {
                const n = parseInt(match[1], 10);
                if (!isNaN(n)) {
                    return `step-${String(n).padStart(2, '0')}`;
                }
            }
        } catch {}
        return stepId;
    }

    /**
     * Registrar um novo step no sistema
     */
    register(step: StepComponent): void {
        const id = this.normalizeId(step.id);
        if (this.steps.has(id)) {
            appLogger.warn(`⚠️  Step '${step.id}' já está registrado. Sobrescrevendo...`);
        }

        this.steps.set(id, { ...step, id });

        if (process.env.NODE_ENV === 'development') {
            appLogger.info(`✅ Step registrado: ${step.id} - ${step.name}`);
        }
    }

    /**
     * Obter um step específico
     */
    get(stepId: string): StepComponent | undefined {
        const id = this.normalizeId(stepId);
        const step = this.steps.get(id);

        if (!step && process.env.NODE_ENV === 'development') {
            appLogger.warn(`⚠️  Step '${stepId}' não encontrado no registro`);
            appLogger.info('📋 Steps disponíveis:', { data: [Array.from(this.steps.keys())] });
        }

        return step;
    }

    /**
     * Obter todos os steps registrados
     */
    getAll(): StepComponent[] {
        return Array.from(this.steps.values()).sort((a, b) => {
            // Ordenar por número do step (step-01, step-02, etc.)
            const numA = parseInt(a.id.replace('step-', ''));
            const numB = parseInt(b.id.replace('step-', ''));
            return numA - numB;
        });
    }

    /**
     * Obter step por número
     */
    getByNumber(stepNumber: number): StepComponent | undefined {
        const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;
        return this.get(stepId);
    }

    /**
     * Verificar se um step existe
     */
    exists(stepId: string): boolean {
        return this.steps.has(this.normalizeId(stepId));
    }

    /**
     * Obter total de steps registrados
     */
    count(): number {
        return this.steps.size;
    }

    /**
     * Obter próximo step na sequência
     */
    getNext(currentStepId: string): StepComponent | undefined {
        const currentNumber = parseInt(this.normalizeId(currentStepId).replace('step-', ''));
        return this.getByNumber(currentNumber + 1);
    }

    /**
     * Obter step anterior na sequência
     */
    getPrevious(currentStepId: string): StepComponent | undefined {
        const currentNumber = parseInt(this.normalizeId(currentStepId).replace('step-', ''));
        if (currentNumber <= 1) return undefined;
        return this.getByNumber(currentNumber - 1);
    }

    /**
     * Limpar todos os steps (usado em testes)
     */
    clear(): void {
        this.steps.clear();
        this.initialized = false;
    }

    /**
     * Debug: Listar todos os steps registrados
     */
    debug(): void {
        appLogger.info('🔍 DEBUG: Steps Registrados:');
        console.table(
            this.getAll().map(step => ({
                ID: step.id,
                Nome: step.name,
                Categoria: step.config.metadata?.category || 'N/A',
                'Permite Próximo': step.config.allowNavigation.next ? '✅' : '❌',
                'Permite Anterior': step.config.allowNavigation.previous ? '✅' : '❌',
                'Validação Obrigatória': step.config.validation.required ? '✅' : '❌',
            })),
        );
    }
}

// Instância singleton do registro
export const stepRegistry = new StepRegistry();

// Export da classe para testes
export { StepRegistry };
