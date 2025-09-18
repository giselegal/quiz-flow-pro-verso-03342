import { useEffect, useRef } from 'react';
import { validateStep } from '@/utils/stepValidationRegistry';

type Ctx = {
    currentStep: number;
    stepBlocks?: Record<string, any> | null;
    setStepValid?: (step: number, valid: boolean) => void;
};

export function useCentralizedStepValidation(ctx: Ctx) {
    const { currentStep, stepBlocks, setStepValid } = ctx;
    // Guarda validade anterior por etapa para evitar loops de atualização
    const lastValidityRef = useRef<Record<number, boolean>>({});

    useEffect(() => {
        if (!currentStep) return;
        const res = validateStep(currentStep, stepBlocks as any);
        const valid = !!res.valid;
        const prev = lastValidityRef.current[currentStep];
        if (prev !== valid) {
            lastValidityRef.current[currentStep] = valid;
            try { setStepValid?.(currentStep, valid); } catch { }
        }
    }, [currentStep, stepBlocks, setStepValid]);
}

export default useCentralizedStepValidation;
