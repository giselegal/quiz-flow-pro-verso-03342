/**
 * 📊 UTILS: Cálculo Automático de Progresso
 * Calcula progressValue dinamicamente baseado na posição do step
 */

import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Calcula o valor de progresso para um step baseado em sua posição
 * @param currentStepIndex - Índice do step atual (1-based)
 * @param totalSteps - Total de steps no quiz
 * @returns Valor de progresso entre 0-100
 */
export function calculateProgressValue(currentStepIndex: number, totalSteps: number): number {
    if (totalSteps <= 0) return 0;
    if (currentStepIndex <= 0) return 0;
    if (currentStepIndex > totalSteps) return 100;
    
    return Math.round((currentStepIndex / totalSteps) * 100);
}

/**
 * Atualiza automaticamente o progressValue em blocos quiz-intro-header
 * @param blocks - Array de blocos do step
 * @param currentStepIndex - Índice do step atual (1-based)
 * @param totalSteps - Total de steps no quiz
 * @returns Array de blocos com progressValue atualizado
 */
export function updateProgressInBlocks(
    blocks: Block[],
    currentStepIndex: number,
    totalSteps: number
): Block[] {
    const progressValue = calculateProgressValue(currentStepIndex, totalSteps);
    
    return blocks.map(block => {
        // Atualizar apenas blocos quiz-intro-header
        if (block.type === 'quiz-intro-header') {
            return {
                ...block,
                properties: {
                    ...block.properties,
                    progressValue,
                    progressMax: 100,
                    showProgress: true
                }
            };
        }
        return block;
    });
}

/**
 * Detecta automaticamente o número total de steps no quiz
 * @param stepsData - Objeto com todos os steps do quiz
 * @returns Número total de steps
 */
export function getTotalSteps(stepsData: Record<string, any>): number {
    return Object.keys(stepsData).length;
}

/**
 * Extrai o índice numérico de uma chave de step (ex: "step-01" → 1)
 * @param stepKey - Chave do step (formato: "step-XX")
 * @returns Índice numérico (1-based)
 */
export function getStepIndex(stepKey: string): number {
    const match = stepKey.match(/step-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

/**
 * Formata um índice de step para chave (ex: 1 → "step-01")
 * @param index - Índice numérico (1-based)
 * @returns Chave formatada
 */
export function formatStepKey(index: number): string {
    return `step-${String(index).padStart(2, '0')}`;
}

/**
 * Hook auxiliar: Calcula progresso considerando steps dinâmicos
 * Útil quando steps podem ser adicionados/removidos/reordenados
 */
export interface ProgressConfig {
    currentStepKey: string;
    allSteps: string[];
}

export function calculateDynamicProgress(config: ProgressConfig): number {
    const { currentStepKey, allSteps } = config;
    
    // Encontrar posição do step atual no array de steps
    const currentIndex = allSteps.indexOf(currentStepKey);
    if (currentIndex === -1) return 0;
    
    // Calcular progresso baseado na posição (1-based)
    const stepPosition = currentIndex + 1;
    const totalSteps = allSteps.length;
    
    return calculateProgressValue(stepPosition, totalSteps);
}

/**
 * Atualiza progressValue em um step específico
 * Útil para reordenamento de steps
 */
export function updateStepProgress(
    stepData: any,
    currentStepIndex: number,
    totalSteps: number
): any {
    if (!stepData.blocks || !Array.isArray(stepData.blocks)) {
        return stepData;
    }
    
    return {
        ...stepData,
        blocks: updateProgressInBlocks(stepData.blocks, currentStepIndex, totalSteps)
    };
}

/**
 * Recalcula progresso para todos os steps após reordenamento
 * @param stepsData - Objeto com todos os steps
 * @returns Objeto de steps com progresso atualizado
 */
export function recalculateAllProgress(stepsData: Record<string, any>): Record<string, any> {
    const stepKeys = Object.keys(stepsData).sort(); // Ordenar alfabeticamente
    const totalSteps = stepKeys.length;
    
    const updatedSteps: Record<string, any> = {};
    
    stepKeys.forEach((stepKey, index) => {
        const stepIndex = index + 1; // 1-based
        updatedSteps[stepKey] = updateStepProgress(
            stepsData[stepKey],
            stepIndex,
            totalSteps
        );
    });
    
    return updatedSteps;
}

/**
 * Valida se um bloco quiz-intro-header tem progressValue correto
 */
export function validateProgress(
    block: Block,
    currentStepIndex: number,
    totalSteps: number
): { valid: boolean; expected: number; actual: number } {
    if (block.type !== 'quiz-intro-header') {
        return { valid: true, expected: 0, actual: 0 };
    }
    
    const expected = calculateProgressValue(currentStepIndex, totalSteps);
    const actual = (block.properties as any)?.progressValue ?? 0;
    
    return {
        valid: expected === actual,
        expected,
        actual
    };
}

/**
 * Debug: Mostra progresso de todos os steps
 */
export function logProgressDebug(stepsData: Record<string, any>): void {
    const stepKeys = Object.keys(stepsData).sort();
    const totalSteps = stepKeys.length;
    
    appLogger.info('\n📊 DEBUG: Progresso dos Steps\n');
    appLogger.info('═'.repeat(60));
    
    stepKeys.forEach((stepKey, index) => {
        const stepIndex = index + 1;
        const expected = calculateProgressValue(stepIndex, totalSteps);
        
        const headerBlock = stepsData[stepKey].blocks?.find(
            (b: Block) => b.type === 'quiz-intro-header'
        );
        
        const actual = headerBlock?.properties?.progressValue ?? 'N/A';
        const status = actual === expected ? '✅' : '⚠️';
        
        appLogger.info(`${status} ${stepKey}: ${actual}% (esperado: ${expected}%)`);
    });
    
    appLogger.info('═'.repeat(60));
    appLogger.info('\n');
}
