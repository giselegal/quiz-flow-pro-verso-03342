import { useEffect, useState, useRef } from 'react';
import type { QuizStep as BaseQuizStep } from '@/data/quizSteps';

// BlockComponent typing simplificado local (ajustar se existir tipo centralizado)
export interface BlockComponent {
    id: string;
    type: string;
    content: Record<string, any>;
    properties: Record<string, any>;
    parentId?: string | null;
    order: number;
}

export interface QuizStep extends BaseQuizStep {
    id: string; // garantir obrigatório
    blocks: BlockComponent[];
}

export interface ValidationError {
    id: string;               // unique
    scope: 'step' | 'block';
    targetId: string;         // step id or block id
    stepId: string;           // owning step
    message: string;
    severity: 'error' | 'warning';
    field?: string;
    blockType?: string;
}

interface ValidationResult {
    errors: ValidationError[];
    byStep: Record<string, ValidationError[]>;
    byBlock: Record<string, ValidationError[]>;
    validateNow: () => void;
}

// Basic rule helpers (placeholder until full quizValidationUtils integration)
function validateBlock(step: QuizStep, block: BlockComponent): ValidationError[] {
    const errs: ValidationError[] = [];
    // Example generic rules
    if (block.type === 'heading' && !block.content?.text) {
        errs.push({
            id: `${block.id}-missing-text`,
            scope: 'block',
            targetId: block.id,
            stepId: step.id,
            message: 'Heading sem texto',
            severity: 'error',
            field: 'text',
            blockType: block.type
        });
    }
    if (block.type === 'button' && !block.content?.label) {
        errs.push({
            id: `${block.id}-missing-label`,
            scope: 'block',
            targetId: block.id,
            stepId: step.id,
            message: 'Botão sem label',
            severity: 'warning',
            field: 'label',
            blockType: block.type
        });
    }
    // Option question example: must have >=2 options
    if (block.type === 'options' && Array.isArray(block.content?.options)) {
        if (block.content.options.length < 2) {
            errs.push({
                id: `${block.id}-min-options`,
                scope: 'block',
                targetId: block.id,
                stepId: step.id,
                message: 'Mínimo de 2 opções',
                severity: 'error',
                field: 'options',
                blockType: block.type
            });
        }
    }
    return errs;
}

function validateStep(step: QuizStep): ValidationError[] {
    const errs: ValidationError[] = [];
    if (step.blocks.length === 0) {
        errs.push({
            id: `${step.id}-empty`,
            scope: 'step',
            targetId: step.id,
            stepId: step.id,
            message: 'Etapa sem blocos',
            severity: 'warning'
        });
    }
    return errs;
}

export function useValidation(steps: QuizStep[], debounceMs = 300): ValidationResult {
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const stepsRef = useRef<QuizStep[]>(steps);
    const timeoutRef = useRef<any>();

    stepsRef.current = steps;

    const run = () => {
        const all: ValidationError[] = [];
        for (const step of stepsRef.current) {
            all.push(...validateStep(step));
            for (const block of step.blocks) {
                all.push(...validateBlock(step, block));
            }
        }
        setErrors(all);
    };

    const schedule = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(run, debounceMs);
    };

    useEffect(() => {
        schedule();
        return () => clearTimeout(timeoutRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(steps.map(s => ({ id: s.id, blocks: (s as any).blocks?.map((b: any) => ({ id: b.id, t: b.type, c: b.content, p: b.properties })) })))]);

    const byStep: Record<string, ValidationError[]> = {};
    const byBlock: Record<string, ValidationError[]> = {};
    for (const e of errors) {
        (byStep[e.stepId] ||= []).push(e);
        if (e.scope === 'block') (byBlock[e.targetId] ||= []).push(e);
    }

    return { errors, byStep, byBlock, validateNow: run };
}
