import { useEffect } from 'react';
import { validateStep } from '@/utils/stepValidationRegistry';

type Ctx = {
    currentStep: number;
    stepBlocks?: Record<string, any> | null;
    setStepValid?: (step: number, valid: boolean) => void;
};

export function useCentralizedStepValidation(ctx: Ctx) {
    const { currentStep, stepBlocks, setStepValid } = ctx;

    useEffect(() => {
        if (!currentStep) return;
        const res = validateStep(currentStep, stepBlocks as any);
        try { setStepValid?.(currentStep, !!res.valid); } catch { }
    }, [currentStep, stepBlocks, setStepValid]);
}

export default useCentralizedStepValidation;
