import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * QuizRuntimeRegistry
 * Mantém um mapa de steps sobrescrevendo QUIZ_STEPS padrão quando em modo editor.
 */
export interface RuntimeStepOverride {
    id: string;
    // shape mínimo usado por useQuizState: type, nextStep, question metadata, options
    type: string;
    nextStep?: string;
    requiredSelections?: number;
    questionText?: string;
    questionNumber?: string;
    options?: Array<{ id: string; text: string; image?: string }>;
    formQuestion?: string;
    placeholder?: string;
    buttonText?: string;
    title?: string;
    text?: string;
    // Novo: blocos modulares (fase 2). Cada step pode carregar uma lista de BlockInstance serializada simples.
    blocks?: Array<{ id: string; type: string; config: Record<string, any> }>;
}

interface RegistryContextValue {
    steps: Record<string, RuntimeStepOverride>;
    version: number;
    setSteps: (map: Record<string, RuntimeStepOverride>) => void;
    upsertStep: (step: RuntimeStepOverride) => void;
    clear: () => void;
}

const QuizRuntimeRegistryContext = createContext<RegistryContextValue | null>(null);

export const QuizRuntimeRegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [steps, setStepsState] = useState<Record<string, RuntimeStepOverride>>({});
    const [version, setVersion] = useState(0);

    const setSteps = useCallback((map: Record<string, RuntimeStepOverride>) => {
        setStepsState(map);
        setVersion(v => v + 1);
    }, []);

    const upsertStep = useCallback((step: RuntimeStepOverride) => {
        setStepsState(prev => ({ ...prev, [step.id]: step }));
        setVersion(v => v + 1);
    }, []);

    const clear = useCallback(() => {
        setStepsState({});
        setVersion(v => v + 1);
    }, []);

    return (
        <QuizRuntimeRegistryContext.Provider value={{ steps, version, setSteps, upsertStep, clear }}>
            {children}
        </QuizRuntimeRegistryContext.Provider>
    );
};

export function useQuizRuntimeRegistry() {
    const ctx = useContext(QuizRuntimeRegistryContext);
    if (!ctx) throw new Error('useQuizRuntimeRegistry deve ser usado dentro de QuizRuntimeRegistryProvider');
    return ctx;
}
