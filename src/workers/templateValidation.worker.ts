/// <reference lib="webworker" />

import { validateTemplateIntegrity } from '@/lib/utils/templateValidation';

export interface ValidationMessage {
    type: 'VALIDATE';
    payload: {
        templateId: string;
        stepCount: number;
        stepsData: Record<string, any>;
    };
}

export interface ValidationProgress {
    type: 'PROGRESS';
    payload: {
        current: number;
        total: number;
        step: string;
        percentage: number;
    };
}

export interface ValidationResult {
    type: 'RESULT';
    payload: any;
}

export interface ValidationError {
    type: 'ERROR';
    payload: {
        message: string;
        stack?: string;
    };
}

/**
 * 🔥 HOTFIX 3: Web Worker para validação de template não-bloqueante
 * 
 * PROBLEMA RESOLVIDO:
 * - Validação de 21 steps bloqueava thread principal por 2-5 segundos
 * - UI congelada durante validação
 * - Impossível cancelar validação
 * 
 * SOLUÇÃO:
 * - Validação em background worker
 * - Progress reporting em tempo real
 * - UI permanece responsiva
 * - Ganho: -100% de bloqueio da UI
 */

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (e: MessageEvent<ValidationMessage>) => {
    const { templateId, stepCount, stepsData } = e.data.payload;

    try {
        const result = await validateTemplateIntegrity(
            templateId,
            stepCount,
            async (stepId: string) => {
                // Reportar progresso
                const stepKeys = Object.keys(stepsData);
                const current = stepKeys.indexOf(stepId) + 1;
                const percentage = Math.round((current / stepCount) * 100);

                self.postMessage({
                    type: 'PROGRESS',
                    payload: {
                        current,
                        total: stepCount,
                        step: stepId,
                        percentage,
                    },
                } as ValidationProgress);

                return stepsData[stepId] || null;
            },
            {
                validateSchemas: true,
                validateDependencies: true,
            }
        );

        self.postMessage({
            type: 'RESULT',
            payload: result,
        } as ValidationResult);
    } catch (error) {
        self.postMessage({
            type: 'ERROR',
            payload: {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            },
        } as ValidationError);
    }
};
