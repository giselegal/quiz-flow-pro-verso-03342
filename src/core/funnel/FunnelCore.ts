/**
 * 🏗️ FUNNEL CORE
 * 
 * Núcleo central do sistema de funis
 * Centraliza toda a lógica core de funis separada dos quizzes
 */

import {
    FunnelState,
    FunnelStep,
    FunnelComponent,
    FunnelEvent,
    FunnelEventType,
    FunnelProgress,
    NavigationState,
    ValidationState,
    ValidationError,
    StepCondition
} from './types';

// ============================================================================
// FUNNEL CORE CLASS
// ============================================================================

export class FunnelCore {
    private static instance: FunnelCore;
    private eventListeners: Map<FunnelEventType, Function[]> = new Map();

    public static getInstance(): FunnelCore {
        if (!FunnelCore.instance) {
            FunnelCore.instance = new FunnelCore();
        }
        return FunnelCore.instance;
    }

    // ============================================================================
    // STEP MANAGEMENT
    // ============================================================================

    /**
     * Calcula o progresso atual do funil
     */
    calculateProgress(state: FunnelState): FunnelProgress {
        const currentStepIndex = state.steps.findIndex(step => step.id === state.currentStep);
        const totalSteps = state.steps.filter(step => step.isVisible).length;
        const completedSteps = state.completedSteps.length;
        const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

        return {
            currentStepIndex: Math.max(0, currentStepIndex),
            totalSteps,
            completedSteps,
            percentage: Math.round(percentage)
        };
    }

    /**
     * Determina o próximo passo válido
     */
    getNextStep(state: FunnelState): string | null {
        const currentStepIndex = state.steps.findIndex(step => step.id === state.currentStep);
        if (currentStepIndex === -1) return null;

        for (let i = currentStepIndex + 1; i < state.steps.length; i++) {
            const step = state.steps[i];
            if (this.isStepVisible(step, state) && this.evaluateStepConditions(step, state)) {
                return step.id;
            }
        }

        return null;
    }

    /**
     * Determina o passo anterior válido
     */
    getPreviousStep(state: FunnelState): string | null {
        const currentStepIndex = state.steps.findIndex(step => step.id === state.currentStep);
        if (currentStepIndex <= 0) return null;

        for (let i = currentStepIndex - 1; i >= 0; i--) {
            const step = state.steps[i];
            if (this.isStepVisible(step, state) && this.evaluateStepConditions(step, state)) {
                return step.id;
            }
        }

        return null;
    }

    /**
     * Verifica se um passo está visível
     */
    isStepVisible(step: FunnelStep, state: FunnelState): boolean {
        if (!step.isVisible) return false;
        return this.evaluateStepConditions(step, state);
    }

    /**
     * Avalia as condições de um passo
     */
    evaluateStepConditions(step: FunnelStep, state: FunnelState): boolean {
        if (!step.conditions || step.conditions.length === 0) return true;

        return step.conditions.every(condition => {
            return this.evaluateCondition(condition, state.userData);
        });
    }

    /**
     * Avalia uma condição específica
     */
    private evaluateCondition(condition: StepCondition, userData: Record<string, any>): boolean {
        switch (condition.type) {
            case 'always':
                return true;

            case 'if':
                if (!condition.field) return true;
                return this.evaluateFieldCondition(
                    userData[condition.field],
                    condition.operator || 'equals',
                    condition.value
                );

            case 'unless':
                if (!condition.field) return false;
                return !this.evaluateFieldCondition(
                    userData[condition.field],
                    condition.operator || 'equals',
                    condition.value
                );

            default:
                return true;
        }
    }

    /**
     * Avalia condição de campo
     */
    private evaluateFieldCondition(fieldValue: any, operator: string, expectedValue: any): boolean {
        switch (operator) {
            case 'equals':
                return fieldValue === expectedValue;

            case 'contains':
                if (Array.isArray(fieldValue)) {
                    return fieldValue.includes(expectedValue);
                }
                return String(fieldValue).includes(String(expectedValue));

            case 'greater':
                return Number(fieldValue) > Number(expectedValue);

            case 'less':
                return Number(fieldValue) < Number(expectedValue);

            default:
                return false;
        }
    }

    // ============================================================================
    // NAVIGATION LOGIC
    // ============================================================================

    /**
     * Calcula o estado de navegação
     */
    calculateNavigationState(state: FunnelState): NavigationState {
        const canGoBackward = this.getPreviousStep(state) !== null &&
            state.settings.navigation.allowBackward;

        const canGoForward = this.getNextStep(state) !== null &&
            this.isCurrentStepValid(state);

        return {
            canGoForward,
            canGoBackward,
            nextStep: this.getNextStep(state) || undefined,
            previousStep: this.getPreviousStep(state) || undefined,
            history: [...state.navigation.history],
            direction: state.navigation.direction || undefined
        };
    }

    /**
     * Verifica se o passo atual é válido
     */
    isCurrentStepValid(state: FunnelState): boolean {
        const currentStep = state.steps.find(step => step.id === state.currentStep);
        if (!currentStep) return false;

        const validation = this.validateStep(currentStep, state);
        return validation.isValid;
    }

    // ============================================================================
    // VALIDATION LOGIC
    // ============================================================================

    /**
     * Valida um passo específico
     */
    validateStep(step: FunnelStep, state: FunnelState): ValidationState {
        const errors: ValidationError[] = [];

        // Validar se o passo é obrigatório
        if (step.isRequired && !state.completedSteps.includes(step.id)) {
            errors.push({
                stepId: step.id,
                field: 'step',
                message: `O passo "${step.name}" é obrigatório`,
                type: 'required'
            });
        }

        // Validar componentes do passo
        for (const component of step.components) {
            if (component.isVisible) {
                const componentErrors = this.validateComponent(component, step, state);
                errors.push(...componentErrors);
            }
        }

        // Validar configurações específicas do passo
        if (step.settings.validation) {
            const stepValidationErrors = this.validateStepSettings(step, state);
            errors.push(...stepValidationErrors);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings: [],
            currentStepValid: errors.length === 0
        };
    }

    /**
     * Valida um componente específico
     */
    private validateComponent(
        component: FunnelComponent,
        step: FunnelStep,
        state: FunnelState
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        // Verificar condições de visibilidade
        if (!this.evaluateComponentConditions(component, state)) {
            return errors; // Componente não visível, não precisa validar
        }

        // Validações específicas por tipo de componente
        switch (component.type) {
            case 'quiz-question':
            case 'options-grid':
                const questionErrors = this.validateQuestionComponent(component, step, state);
                errors.push(...questionErrors);
                break;

            case 'form-input':
            case 'text-input':
                const inputErrors = this.validateInputComponent(component, step, state);
                errors.push(...inputErrors);
                break;

            // Adicionar mais tipos conforme necessário
        }

        return errors;
    }

    /**
     * Valida componente de questão
     */
    private validateQuestionComponent(
        component: FunnelComponent,
        step: FunnelStep,
        state: FunnelState
    ): ValidationError[] {
        const errors: ValidationError[] = [];
        const questionId = component.properties?.questionId;

        if (!questionId) return errors;

        const userSelections = state.userData[questionId];
        const minSelections = step.settings.validation?.minSelections ||
            component.properties?.minSelections || 1;
        const maxSelections = step.settings.validation?.maxSelections ||
            component.properties?.maxSelections;

        // Verificar seleções mínimas
        if (!userSelections || (Array.isArray(userSelections) && userSelections.length < minSelections)) {
            errors.push({
                stepId: step.id,
                componentId: component.id,
                field: questionId,
                message: `Selecione pelo menos ${minSelections} opção(ões)`,
                type: 'minSelections'
            });
        }

        // Verificar seleções máximas
        if (maxSelections && Array.isArray(userSelections) && userSelections.length > maxSelections) {
            errors.push({
                stepId: step.id,
                componentId: component.id,
                field: questionId,
                message: `Selecione no máximo ${maxSelections} opção(ões)`,
                type: 'maxSelections'
            });
        }

        return errors;
    }

    /**
     * Valida componente de input
     */
    private validateInputComponent(
        component: FunnelComponent,
        step: FunnelStep,
        state: FunnelState
    ): ValidationError[] {
        const errors: ValidationError[] = [];
        const fieldName = component.properties?.name || component.id;
        const fieldValue = state.userData[fieldName];
        const isRequired = component.properties?.required;

        // Verificar campo obrigatório
        if (isRequired && (!fieldValue || String(fieldValue).trim() === '')) {
            errors.push({
                stepId: step.id,
                componentId: component.id,
                field: fieldName,
                message: `O campo "${component.properties?.label || fieldName}" é obrigatório`,
                type: 'required'
            });
        }

        return errors;
    }

    /**
     * Avalia condições de componente
     */
    private evaluateComponentConditions(component: FunnelComponent, state: FunnelState): boolean {
        if (!component.conditions || component.conditions.length === 0) return true;

        return component.conditions.every(condition => {
            switch (condition.type) {
                case 'show':
                    return this.evaluateCondition(condition as any, state.userData);
                case 'hide':
                    return !this.evaluateCondition(condition as any, state.userData);
                default:
                    return true;
            }
        });
    }

    /**
     * Valida configurações específicas do passo
     */
    private validateStepSettings(_step: FunnelStep, _state: FunnelState): ValidationError[] {
        const errors: ValidationError[] = [];

        // Implementar validações específicas das configurações do passo
        // conforme necessário

        return errors;
    }

    // ============================================================================
    // EVENT SYSTEM
    // ============================================================================

    /**
     * Emite um evento do funil
     */
    emitEvent(event: FunnelEvent): void {
        console.log(`[FunnelCore] Event: ${event.type}`, event);

        const listeners = this.eventListeners.get(event.type) || [];
        listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error(`[FunnelCore] Error in event listener for ${event.type}:`, error);
            }
        });
    }

    /**
     * Adiciona um listener para eventos
     */
    addEventListener(eventType: FunnelEventType, listener: Function): void {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType)!.push(listener);
    }

    /**
     * Remove um listener de eventos
     */
    removeEventListener(eventType: FunnelEventType, listener: Function): void {
        const listeners = this.eventListeners.get(eventType);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    /**
     * Clona um estado de funil de forma segura
     */
    cloneState(state: FunnelState): FunnelState {
        return JSON.parse(JSON.stringify(state));
    }

    /**
     * Mescla dados do usuário de forma segura
     */
    mergeUserData(currentData: Record<string, any>, newData: Record<string, any>): Record<string, any> {
        return {
            ...currentData,
            ...newData
        };
    }

    /**
     * Gera um ID único para funil
     */
    generateFunnelId(prefix = 'funnel'): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `${prefix}-${timestamp}-${random}`;
    }

    /**
     * Valida se um ID de funil é válido
     */
    isValidFunnelId(id: string): boolean {
        return typeof id === 'string' && id.length > 0 && /^[a-zA-Z0-9\-_]+$/.test(id);
    }
}

// ============================================================================
// FUNNEL UTILITIES
// ============================================================================

export const FunnelUtils = {
    /**
     * Mapeia tipo de passo para componentes padrão
     */
    getDefaultComponentsForStepType(stepType: string): string[] {
        switch (stepType) {
            case 'intro':
                return ['quiz-intro-header', 'text-block', 'button'];
            case 'question':
                return ['quiz-question-header', 'options-grid', 'quiz-navigation'];
            case 'form':
                return ['form-header', 'text-input', 'submit-button'];
            case 'result':
                return ['result-header', 'result-content', 'action-buttons'];
            case 'transition':
                return ['transition-text', 'loader', 'auto-advance'];
            default:
                return ['text-block'];
        }
    },

    /**
     * Extrai questionIds de um funil
     */
    extractQuestionIds(state: FunnelState): string[] {
        const questionIds: string[] = [];

        state.steps.forEach(step => {
            step.components.forEach(component => {
                if (component.type === 'options-grid' || component.type === 'quiz-question') {
                    const questionId = component.properties?.questionId;
                    if (questionId && !questionIds.includes(questionId)) {
                        questionIds.push(questionId);
                    }
                }
            });
        });

        return questionIds;
    },

    /**
     * Calcula estatísticas do funil
     */
    calculateFunnelStats(state: FunnelState): {
        totalSteps: number;
        questionSteps: number;
        formSteps: number;
        completedSteps: number;
        completionRate: number;
    } {
        const totalSteps = state.steps.length;
        const questionSteps = state.steps.filter(step => step.type === 'question').length;
        const formSteps = state.steps.filter(step => step.type === 'form').length;
        const completedSteps = state.completedSteps.length;
        const completionRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

        return {
            totalSteps,
            questionSteps,
            formSteps,
            completedSteps,
            completionRate: Math.round(completionRate)
        };
    }
};

// Exportar instância singleton
export const funnelCore = FunnelCore.getInstance();
