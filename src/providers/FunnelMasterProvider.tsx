/**
 * FunnelMasterProvider Stub - Legacy compatibility
 */
import React, { ReactNode, createContext, useContext } from 'react';

interface FunnelMasterContextType {
    currentFunnel: any;
    funnels: any[];
    loading: boolean;
}

const FunnelMasterContext = createContext<FunnelMasterContextType | null>(null);

export function FunnelMasterProvider({ children, funnelId, debugMode, enableCache }: { 
    children: ReactNode;
    funnelId?: string;
    debugMode?: boolean;
    enableCache?: boolean;
}) {
    const value: FunnelMasterContextType = {
        currentFunnel: null,
        funnels: [],
        loading: false
    };

    return (
        <FunnelMasterContext.Provider value={value}>
            {children}
        </FunnelMasterContext.Provider>
    );
}

export function useFunnelMaster() {
    const context = useContext(FunnelMasterContext);
    if (!context) {
        return { currentFunnel: null, funnels: [], loading: false };
    }
    return context;
}

export function useFunnels() {
    return { funnels: [], loading: false, currentFunnel: null };
}

export function useUnifiedFunnel() {
    return useFunnelMaster();
}

export function useFunnelConfig() {
    return { config: {}, loading: false };
}

export function useQuizFlow() {
    return { flow: null, loading: false };
}

export function useQuiz21Steps() {
    return { 
        steps: [], 
        currentStep: null, 
        loading: false,
        totalSteps: 0,
        canGoNext: false,
        canGoPrevious: false,
        isCurrentStepComplete: false,
        autoAdvanceEnabled: false,
        goToNextStep: () => {},
        goToPreviousStep: () => {},
        resetQuiz: () => {},
        getProgress: () => ({ current: 0, total: 0, percentage: 0 }),
        getStepRequirements: () => ({}),
        userName: '',
        answers: {},
        currentStepSelections: []
    };
}
