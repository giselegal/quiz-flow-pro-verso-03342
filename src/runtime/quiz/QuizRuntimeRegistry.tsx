import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { NavigationService } from '@/services/NavigationService';

/**
 * QuizRuntimeRegistry - FASE 2.2 REFATORADO
 * 
 * ✅ Integrado com NavigationService
 * ✅ Validação automática de navegação
 * ✅ Conversões redundantes eliminadas
 */
export interface RuntimeStepOverride {
    id: string;
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
    blocks?: Array<{ id: string; type: string; config: Record<string, any> }>;
    offerMap?: Record<string, any>;
}

interface RegistryContextValue {
    steps: Record<string, RuntimeStepOverride>;
    version: number;
    navigationMap: Record<string, string | null>; // ✅ FASE 2.2: Expor mapa de navegação
    isValid: boolean; // ✅ FASE 2.2: Status de validação
    setSteps: (map: Record<string, RuntimeStepOverride>) => void;
    upsertStep: (step: RuntimeStepOverride) => void;
    clear: () => void;
}

const QuizRuntimeRegistryContext = createContext<RegistryContextValue | null>(null);

export const QuizRuntimeRegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [steps, setStepsState] = useState<Record<string, RuntimeStepOverride>>({});
    const [version, setVersion] = useState(0);

    // ✅ FASE 2.2: NavigationService integrado
    const navigationService = useMemo(() => new NavigationService(), []);

    // ✅ FASE 2.2: Calcular mapa de navegação e validação automaticamente
    const { navigationMap, isValid } = useMemo(() => {
        const stepArray = Object.values(steps);
        if (stepArray.length === 0) {
            return { navigationMap: {}, isValid: true };
        }

        const navMap = navigationService.buildNavigationMap(stepArray.map(s => ({
            id: s.id,
            nextStep: s.nextStep,
            type: s.type,
        })));

        const validation = navigationService.validateNavigation();

        return {
            navigationMap: navMap,
            isValid: validation.valid
        };
    }, [steps, navigationService]);

    const setSteps = useCallback((map: Record<string, RuntimeStepOverride>) => {
        // ✅ FASE 2.2: Preencher nextStep automaticamente se ausente
        const stepsArray = Object.values(map);
        const navSteps = stepsArray.map((s, index) => ({
            id: s.id,
            nextStep: s.nextStep,
            order: index,
            type: s.type,
        }));

        const navMap = navigationService.buildNavigationMap(navSteps);

        // Aplicar navegação preenchida de volta aos steps
        const enrichedMap = Object.entries(map).reduce((acc, [id, step]) => {
            acc[id] = {
                ...step,
                nextStep: navMap[id] ?? step.nextStep,
            };
            return acc;
        }, {} as Record<string, RuntimeStepOverride>);

        setStepsState(enrichedMap);
        setVersion(v => v + 1);
    }, [navigationService]);

    const upsertStep = useCallback((step: RuntimeStepOverride) => {
        setStepsState(prev => {
            const updated = { ...prev, [step.id]: step };

            // Recalcular navegação para o step atualizado
            const stepsArray = Object.values(updated);
            const navMap = navigationService.buildNavigationMap(stepsArray.map(s => ({
                id: s.id,
                nextStep: s.nextStep,
                type: s.type,
            })));

            // Aplicar nextStep recalculado
            return Object.entries(updated).reduce((acc, [id, s]) => {
                acc[id] = {
                    ...s,
                    nextStep: navMap[id] ?? s.nextStep,
                };
                return acc;
            }, {} as Record<string, RuntimeStepOverride>);
        });
        setVersion(v => v + 1);
    }, [navigationService]);

    const clear = useCallback(() => {
        setStepsState({});
        setVersion(v => v + 1);
    }, []);

    const contextValue = useMemo<RegistryContextValue>(() => ({
        steps,
        version,
        navigationMap,
        isValid,
        setSteps,
        upsertStep,
        clear,
    }), [steps, version, navigationMap, isValid, setSteps, upsertStep, clear]);

    return (
        <QuizRuntimeRegistryContext.Provider value={contextValue}>
            {children}
        </QuizRuntimeRegistryContext.Provider>
    );
};

export function useQuizRuntimeRegistry() {
    const ctx = useContext(QuizRuntimeRegistryContext);
    if (!ctx) throw new Error('useQuizRuntimeRegistry deve ser usado dentro de QuizRuntimeRegistryProvider');
    return ctx;
}

// Variante opcional: retorna null quando Provider não está presente (para uso em componentes que funcionam fora do editor)
export function useOptionalQuizRuntimeRegistry() {
    return useContext(QuizRuntimeRegistryContext);
}
