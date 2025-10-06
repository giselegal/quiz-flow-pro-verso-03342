/**
 * 🔢 Utilitário central para determinar o número efetivo de seleções obrigatórias.
 * Prioridade (mais alta → mais baixa):
 * 1. Configuração específica da etapa vinda da API (currentStepConfig.requiredSelections)
 * 2. Definição estática original da etapa (currentStepData.requiredSelections)
 * 3. Regras agregadas globais (ex: steps2to11 / steps13to18)
 * 4. Fallback por tipo (question=3, strategic-question=1, demais=1)
 */
export interface RequiredSelectionsInputs {
    step: any;
    mergedConfig?: any;
    currentStepConfig?: any;
}

export function getEffectiveRequiredSelections({ step, mergedConfig, currentStepConfig }: RequiredSelectionsInputs): number {
    if (typeof currentStepConfig?.requiredSelections === 'number') return currentStepConfig.requiredSelections;
    if (typeof step?.requiredSelections === 'number') return step.requiredSelections;
    if (step?.type === 'question' && mergedConfig?.steps2to11?.requiredSelections)
        return mergedConfig.steps2to11.requiredSelections;
    if (step?.type === 'strategic-question' && mergedConfig?.steps13to18?.requiredSelections)
        return mergedConfig.steps13to18.requiredSelections;
    if (step?.type === 'question') return 3;
    if (step?.type === 'strategic-question') return 1;
    return 1;
}

export function shouldAutoAdvance({ answersLength, required, enabled }: { answersLength: number; required: number; enabled: boolean; }): boolean {
    return enabled && answersLength === required;
}
