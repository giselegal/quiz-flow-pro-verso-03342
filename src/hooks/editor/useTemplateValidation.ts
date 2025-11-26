import { useState, useCallback, useRef } from 'react';
import type { TemplateValidationResult } from '@/lib/utils/templateValidation';
import { appLogger } from '@/lib/utils/appLogger';

export interface ValidationProgress {
    current: number;
    total: number;
    step: string;
    percentage: number;
}

export interface UseTemplateValidationResult {
    validate: (
        templateId: string,
        stepCount: number,
        stepsData: Record<string, any>
    ) => Promise<TemplateValidationResult>;
    cancel: () => void;
    isValidating: boolean;
    progress: ValidationProgress;
    result: TemplateValidationResult | null;
    error: Error | null;
}

/**
 * 🔥 HOTFIX 3: Hook para validação de template com Web Worker
 * 
 * PROBLEMA RESOLVIDO:
 * - Validação bloqueante de 2-5 segundos no main thread
 * - UI congelada durante validação
 * - Sem feedback de progresso
 * - Impossível cancelar
 * 
 * SOLUÇÃO:
 * - Validação em Web Worker (não-bloqueante)
 * - Progress reporting em tempo real (%)
 * - Cancelamento via terminate()
 * - UI permanece 100% responsiva
 * - Ganho: -100% de bloqueio da UI
 * 
 * @example
 * ```tsx
 * const { validate, isValidating, progress } = useTemplateValidation();
 * 
 * // Validar com progress
 * const result = await validate('quiz21', 21, stepsData);
 * 
 * // UI mostra: "Validando... 15/21 (71%)"
 * ```
 */
export function useTemplateValidation(): UseTemplateValidationResult {
    const [isValidating, setIsValidating] = useState(false);
    const [progress, setProgress] = useState<ValidationProgress>({
        current: 0,
        total: 0,
        step: '',
        percentage: 0,
    });
    const [result, setResult] = useState<TemplateValidationResult | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const workerRef = useRef<Worker | null>(null);

    const cancel = useCallback(() => {
        if (workerRef.current) {
            appLogger.info('[useTemplateValidation] Cancelando validação');
            workerRef.current.terminate();
            workerRef.current = null;
            setIsValidating(false);
            setProgress({ current: 0, total: 0, step: '', percentage: 0 });
        }
    }, []);

    const validate = useCallback(async (
        templateId: string,
        stepCount: number,
        stepsData: Record<string, any>
    ): Promise<TemplateValidationResult> => {
        // Cancel previous validation if any
        cancel();

        setIsValidating(true);
        setProgress({ current: 0, total: stepCount, step: '', percentage: 0 });
        setError(null);
        setResult(null);

        const startTime = performance.now();

        try {
            const worker = new Worker(
                new URL('../workers/templateValidation.worker.ts', import.meta.url),
                { type: 'module' }
            );

            workerRef.current = worker;

            return new Promise<TemplateValidationResult>((resolve, reject) => {
                worker.onmessage = (e) => {
                    const { type, payload } = e.data;

                    switch (type) {
                        case 'PROGRESS':
                            setProgress(payload);
                            appLogger.debug(
                                `[useTemplateValidation] Progresso: ${payload.current}/${payload.total} (${payload.percentage}%) - ${payload.step}`
                            );
                            break;

                        case 'RESULT':
                            const duration = performance.now() - startTime;
                            appLogger.info(
                                `✅ [useTemplateValidation] Validação concluída em ${duration.toFixed(0)}ms`
                            );
                            
                            setResult(payload);
                            setIsValidating(false);
                            worker.terminate();
                            workerRef.current = null;
                            resolve(payload);
                            break;

                        case 'ERROR':
                            const err = new Error(payload.message);
                            if (payload.stack) {
                                err.stack = payload.stack;
                            }
                            
                            appLogger.error('[useTemplateValidation] Erro na validação:', err);
                            
                            setError(err);
                            setIsValidating(false);
                            worker.terminate();
                            workerRef.current = null;
                            reject(err);
                            break;
                    }
                };

                worker.onerror = (err) => {
                    const error = new Error(`Worker error: ${err.message}`);
                    appLogger.error('[useTemplateValidation] Worker error:', err);
                    
                    setError(error);
                    setIsValidating(false);
                    worker.terminate();
                    workerRef.current = null;
                    reject(error);
                };

                // Send validation request
                worker.postMessage({
                    type: 'VALIDATE',
                    payload: { templateId, stepCount, stepsData },
                });
            });
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            appLogger.error('[useTemplateValidation] Erro ao criar worker:', err);
            
            setError(error);
            setIsValidating(false);
            workerRef.current = null;
            throw error;
        }
    }, [cancel]);

    return {
        validate,
        cancel,
        isValidating,
        progress,
        result,
        error,
    };
}
