/**
 * 🚀 FUNNEL ENGINE
 * 
 * Motor de processamento de funis
 * Separado da lógica de quiz, focado em fluxos de funis
 */

import {
    FunnelState,
    FunnelAction,
    FunnelActionType,
    FunnelError,
    FunnelStatus,
    NavigationDirection
} from './types';
import { funnelCore } from './FunnelCore';

// ============================================================================
// FUNNEL ENGINE CLASS
// ============================================================================

export class FunnelEngine {
    private static instance: FunnelEngine;

    public static getInstance(): FunnelEngine {
        if (!FunnelEngine.instance) {
            FunnelEngine.instance = new FunnelEngine();
        }
        return FunnelEngine.instance;
    }

    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================

    /**
     * Processa uma ação no funil
     */
    processAction(state: FunnelState, action: FunnelAction): FunnelState {
        try {
            const newState = this.applyAction(state, action);

            // Emitir evento de mudança de estado
            funnelCore.emitEvent({
                type: 'state-change',
                payload: {
                    previousState: state,
                    newState,
                    action
                },
                timestamp: Date.now(),
                funnelId: state.id
            });

            return newState;
        } catch (error) {
            console.error('[FunnelEngine] Error processing action:', error);

            // Emitir evento de erro
            funnelCore.emitEvent({
                type: 'error',
                payload: {
                    error: error as Error,
                    state,
                    action
                },
                timestamp: Date.now(),
                funnelId: state.id
            });

            return state; // Retorna estado anterior em caso de erro
        }
    }

    /**
     * Aplica uma ação específica ao estado
     */
    private applyAction(state: FunnelState, action: FunnelAction): FunnelState {
        const newState = funnelCore.cloneState(state);

        switch (action.type) {
            case 'navigate':
                return this.handleNavigation(newState, action);

            case 'update-user-data':
                return this.handleUserDataUpdate(newState, action);

            case 'complete-step':
                return this.handleStepCompletion(newState, action);

            case 'set-loading':
                return this.handleLoadingState(newState, action);

            case 'set-error':
                return this.handleErrorState(newState, action);

            case 'reset':
                return this.handleReset(newState, action);

            case 'update-settings':
                return this.handleSettingsUpdate(newState, action);

            default:
                console.warn(`[FunnelEngine] Unknown action type: ${action.type}`);
                return newState;
        }
    }

    // ============================================================================
    // ACTION HANDLERS
    // ============================================================================

    /**
     * Processa navegação no funil
     */
    private handleNavigation(state: FunnelState, action: FunnelAction): FunnelState {
        const { direction, targetStep } = action.payload;

        // Determinar próximo passo
        let nextStepId: string | null = null;

        if (targetStep) {
            nextStepId = targetStep;
        } else {
            switch (direction) {
                case 'forward':
                    nextStepId = funnelCore.getNextStep(state);
                    break;
                case 'backward':
                    nextStepId = funnelCore.getPreviousStep(state);
                    break;
                case 'first':
                    nextStepId = state.steps[0]?.id || null;
                    break;
                case 'last':
                    nextStepId = state.steps[state.steps.length - 1]?.id || null;
                    break;
            }
        }

        if (!nextStepId) {
            throw new Error(`Não foi possível determinar o próximo passo para direção: ${direction}`);
        }

        // Validar se pode navegar para o passo
        const targetStepObj = state.steps.find(step => step.id === nextStepId);
        if (!targetStepObj) {
            throw new Error(`Passo não encontrado: ${nextStepId}`);
        }

        if (!funnelCore.isStepVisible(targetStepObj, state)) {
            throw new Error(`Passo não está visível: ${nextStepId}`);
        }

        // Validar passo atual antes de avançar
        if (direction === 'forward' && !funnelCore.isCurrentStepValid(state)) {
            throw new Error('Passo atual contém erros de validação');
        }

        // Atualizar estado de navegação
        const newHistory = [...state.navigation.history];

        // Adicionar passo atual ao histórico se não estiver lá
        if (!newHistory.includes(state.currentStep)) {
            newHistory.push(state.currentStep);
        }

        state.currentStep = nextStepId;
        const computedNav = funnelCore.calculateNavigationState(state);
        state.navigation = {
            ...computedNav,
            history: newHistory,
            direction: direction || 'forward'
        };

        // Emitir evento de navegação
        funnelCore.emitEvent({
            type: 'step-change',
            payload: {
                from: state.currentStep,
                to: nextStepId,
                direction: direction || 'forward'
            },
            timestamp: Date.now(),
            funnelId: state.id
        });

        return state;
    }

    /**
     * Atualiza dados do usuário
     */
    private handleUserDataUpdate(state: FunnelState, action: FunnelAction): FunnelState {
        const { data, merge = true } = action.payload;

        if (merge) {
            state.userData = funnelCore.mergeUserData(state.userData, data);
        } else {
            state.userData = { ...data };
        }

        // Emitir evento de atualização de dados
        funnelCore.emitEvent({
            type: 'data-update',
            payload: {
                data,
                userData: state.userData
            },
            timestamp: Date.now(),
            funnelId: state.id
        });

        return state;
    }

    /**
     * Marca um passo como completo
     */
    private handleStepCompletion(state: FunnelState, action: FunnelAction): FunnelState {
        const { stepId } = action.payload;
        const targetStepId = stepId || state.currentStep;

        if (!state.completedSteps.includes(targetStepId)) {
            state.completedSteps.push(targetStepId);
        }

        // Emitir evento de conclusão
        funnelCore.emitEvent({
            type: 'step-complete',
            payload: {
                stepId: targetStepId,
                progress: funnelCore.calculateProgress(state)
            },
            timestamp: Date.now(),
            funnelId: state.id
        });

        return state;
    }

    /**
     * Define estado de carregamento
     */
    private handleLoadingState(state: FunnelState, action: FunnelAction): FunnelState {
        const { isLoading, message } = action.payload;

        state.isLoading = isLoading;
        if (message) {
            state.loadingMessage = message;
        }

        return state;
    }

    /**
     * Define estado de erro
     */
    private handleErrorState(state: FunnelState, action: FunnelAction): FunnelState {
        const { error } = action.payload;

        state.error = error;

        // Emitir evento de erro
        funnelCore.emitEvent({
            type: 'error',
            payload: { error },
            timestamp: Date.now(),
            funnelId: state.id
        });

        return state;
    }

    /**
     * Reseta o funil
     */
    private handleReset(state: FunnelState, action: FunnelAction): FunnelState {
        const { preserveUserData = false } = action.payload;

        // Resetar para o primeiro passo
        const firstStep = state.steps[0];
        if (firstStep) {
            state.currentStep = firstStep.id;
        }

        // Limpar progresso
        state.completedSteps = [];
        const computed = funnelCore.calculateNavigationState(state);
        state.navigation = {
            ...computed,
            history: [],
            direction: 'forward'
        };

        // Limpar dados do usuário se solicitado
        if (!preserveUserData) {
            state.userData = {};
        }

        // Limpar estados de erro e carregamento
        state.error = null;
        state.isLoading = false;
        state.loadingMessage = undefined;

        // Emitir evento de reset
        funnelCore.emitEvent({
            type: 'reset',
            payload: { preserveUserData },
            timestamp: Date.now(),
            funnelId: state.id
        });

        return state;
    }

    /**
     * Atualiza configurações do funil
     */
    private handleSettingsUpdate(state: FunnelState, action: FunnelAction): FunnelState {
        const { settings } = action.payload;

        state.settings = {
            ...state.settings,
            ...settings
        };

        return state;
    }

    // ============================================================================
    // FUNNEL LIFECYCLE
    // ============================================================================

    /**
     * Inicializa um funil
     */
    initializeFunnel(state: FunnelState): FunnelState {
        const initializedState = funnelCore.cloneState(state);

        // Garantir que há um passo inicial
        if (!initializedState.currentStep && initializedState.steps.length > 0) {
            initializedState.currentStep = initializedState.steps[0].id;
        }

        // Inicializar navegação
        if (!initializedState.navigation) {
            const nav = funnelCore.calculateNavigationState(initializedState);
            initializedState.navigation = {
                ...nav,
                history: [],
                direction: 'forward'
            };
        }

        // Garantir userData inicializado
        if (!initializedState.userData) {
            initializedState.userData = {};
        }

        // Garantir completedSteps inicializado
        if (!initializedState.completedSteps) {
            initializedState.completedSteps = [];
        }

        // Emitir evento de inicialização
        funnelCore.emitEvent({
            type: 'initialize',
            payload: { state: initializedState },
            timestamp: Date.now(),
            funnelId: initializedState.id
        });

        return initializedState;
    }

    /**
     * Finaliza um funil
     */
    finalizeFunnel(state: FunnelState): FunnelState {
        const finalizedState = funnelCore.cloneState(state);

        // Marcar como finalizado
        finalizedState.status = 'completed';
        finalizedState.completedAt = Date.now();

        // Garantir que todos os passos visíveis estão completos
        const visibleSteps = finalizedState.steps.filter(step =>
            funnelCore.isStepVisible(step, finalizedState)
        );

        visibleSteps.forEach(step => {
            if (!finalizedState.completedSteps.includes(step.id)) {
                finalizedState.completedSteps.push(step.id);
            }
        });

        // Emitir evento de finalização
        funnelCore.emitEvent({
            type: 'complete',
            payload: {
                state: finalizedState,
                results: finalizedState.userData
            },
            timestamp: Date.now(),
            funnelId: finalizedState.id
        });

        return finalizedState;
    }

    /**
     * Pausa um funil
     */
    pauseFunnel(state: FunnelState): FunnelState {
        const pausedState = funnelCore.cloneState(state);
        pausedState.status = 'paused';

        // Emitir evento de pausa
        funnelCore.emitEvent({
            type: 'pause',
            payload: { state: pausedState },
            timestamp: Date.now(),
            funnelId: pausedState.id
        });

        return pausedState;
    }

    /**
     * Resume um funil
     */
    resumeFunnel(state: FunnelState): FunnelState {
        const resumedState = funnelCore.cloneState(state);
        resumedState.status = 'active';

        // Emitir evento de retomada
        funnelCore.emitEvent({
            type: 'resume',
            payload: { state: resumedState },
            timestamp: Date.now(),
            funnelId: resumedState.id
        });

        return resumedState;
    }

    // ============================================================================
    // VALIDATION & UTILITIES
    // ============================================================================

    /**
     * Valida se o funil pode avançar
     */
    canAdvance(state: FunnelState): boolean {
        const navigationState = funnelCore.calculateNavigationState(state);
        return navigationState.canGoForward;
    }

    /**
     * Valida se o funil pode retroceder
     */
    canGoBack(state: FunnelState): boolean {
        const navigationState = funnelCore.calculateNavigationState(state);
        return navigationState.canGoBackward;
    }

    /**
     * Obtém o próximo passo válido
     */
    getNextValidStep(state: FunnelState): string | null {
        return funnelCore.getNextStep(state);
    }

    /**
     * Obtém o passo anterior válido
     */
    getPreviousValidStep(state: FunnelState): string | null {
        return funnelCore.getPreviousStep(state);
    }

    /**
     * Calcula estatísticas do funil
     */
    getFunnelStatistics(state: FunnelState) {
        const progress = funnelCore.calculateProgress(state);
        const navigation = funnelCore.calculateNavigationState(state);
        const validation = funnelCore.validateStep(
            state.steps.find(step => step.id === state.currentStep)!,
            state
        );

        return {
            progress,
            navigation,
            validation,
            currentStep: state.currentStep,
            totalSteps: state.steps.length,
            isComplete: progress.percentage === 100,
            hasErrors: !validation.isValid
        };
    }
}

// ============================================================================
// FUNNEL ACTION CREATORS
// ============================================================================

export const FunnelActions = {
    /**
     * Navegar no funil
     */
    navigate: (direction: NavigationDirection, targetStep?: string): FunnelAction => ({
        type: 'navigate',
        payload: { direction, targetStep }
    }),

    /**
     * Atualizar dados do usuário
     */
    updateUserData: (data: Record<string, any>, merge = true): FunnelAction => ({
        type: 'update-user-data',
        payload: { data, merge }
    }),

    /**
     * Completar passo
     */
    completeStep: (stepId?: string): FunnelAction => ({
        type: 'complete-step',
        payload: { stepId }
    }),

    /**
     * Definir carregamento
     */
    setLoading: (isLoading: boolean, message?: string): FunnelAction => ({
        type: 'set-loading',
        payload: { isLoading, message }
    }),

    /**
     * Definir erro
     */
    setError: (error: FunnelError | null): FunnelAction => ({
        type: 'set-error',
        payload: { error }
    }),

    /**
     * Resetar funil
     */
    reset: (preserveUserData = false): FunnelAction => ({
        type: 'reset',
        payload: { preserveUserData }
    }),

    /**
     * Atualizar configurações
     */
    updateSettings: (settings: Partial<FunnelState['settings']>): FunnelAction => ({
        type: 'update-settings',
        payload: { settings }
    })
};

// Exportar instância singleton
export const funnelEngine = FunnelEngine.getInstance();
