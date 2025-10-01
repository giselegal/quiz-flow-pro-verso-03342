import { useCallback, useMemo, useState } from 'react';
import type { QuizStep } from '@/data/quizSteps';

interface UseInjectedQuizRuntimeOptions {
    autoAdvance?: boolean;
    questionDelay?: number;
    strategicDelay?: number;
}

export interface InjectedQuizRuntimeAPI {
    steps: QuizStep[];
    currentIndex: number;
    currentStep: QuizStep | null;
    progress: number; // 0..100
    userName: string;
    answers: Record<number, string[]>; // index -> respostas
    strategicAnswers: Record<string, string>; // questionText -> resposta
    setUserName(name: string): void;
    answerQuestion(values: string[]): void;
    answerStrategic(value: string): void;
    next(): void;
    reset(): void;
}

export function useInjectedQuizRuntime(
    rawSteps: QuizStep[],
    { autoAdvance = true, questionDelay = 1000, strategicDelay = 500 }: UseInjectedQuizRuntimeOptions
): InjectedQuizRuntimeAPI {
    const steps = useMemo(() => rawSteps.filter(Boolean), [rawSteps]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userName, setUserName] = useState('');
    const [answers, setAnswers] = useState<Record<number, string[]>>({});
    const [strategicAnswers, setStrategicAnswers] = useState<Record<string, string>>({});
    const [pendingTimeout, setPendingTimeout] = useState<number | null>(null);

    const currentStep = steps[currentIndex] || null;
    const progress = useMemo(() => {
        if (!steps.length) return 0;
        // Excluir intro / transition do cálculo similar ao QuizApp original
        const countable = steps.filter(s => !['intro', 'transition', 'transition-result'].includes(s.type));
        const idxCountable = steps.slice(0, currentIndex + 1)
            .filter(s => !['intro', 'transition', 'transition-result'].includes(s.type)).length;
        return Math.min(100, Math.round((idxCountable / countable.length) * 100));
    }, [steps, currentIndex]);

    const clearPending = () => {
        if (pendingTimeout) {
            clearTimeout(pendingTimeout);
        }
    };

    const scheduleAdvance = useCallback((delay: number) => {
        clearPending();
        const id = window.setTimeout(() => {
            setCurrentIndex(i => Math.min(i + 1, steps.length - 1));
            setPendingTimeout(null);
        }, delay);
        setPendingTimeout(id);
    }, [steps]);

    const next = useCallback(() => {
        clearPending();
        setCurrentIndex(i => Math.min(i + 1, steps.length - 1));
    }, [steps, pendingTimeout]);

    const answerQuestion = useCallback((values: string[]) => {
        if (!currentStep) return;
        setAnswers(prev => ({ ...prev, [currentIndex]: values }));
        const required = currentStep.requiredSelections || 1;
        if (autoAdvance && values.length === required) {
            scheduleAdvance(questionDelay);
        }
    }, [currentStep, currentIndex, autoAdvance, questionDelay, scheduleAdvance]);

    const answerStrategic = useCallback((value: string) => {
        if (!currentStep) return;
        if (currentStep.questionText) {
            setStrategicAnswers(prev => ({ ...prev, [currentStep.questionText!]: value }));
        }
        if (autoAdvance) scheduleAdvance(strategicDelay);
    }, [currentStep, autoAdvance, strategicDelay, scheduleAdvance]);

    const reset = useCallback(() => {
        clearPending();
        setCurrentIndex(0);
        setAnswers({});
        setStrategicAnswers({});
        setUserName('');
    }, []);

    return {
        steps,
        currentIndex,
        currentStep,
        progress,
        userName,
        answers,
        strategicAnswers,
        setUserName,
        answerQuestion,
        answerStrategic,
        next,
        reset
    };
}
