/**
 * Conversores e validação entre JSON modular e o modelo do editor.
 * - valida/normaliza input usando os schemas Zod (modular-schema.ts)
 * - converte modular JSON -> editor model (blockJsonToEditor, stepJsonToEditor)
 * - converte editor model -> modular JSON (editorBlockToModularJSON, editorStepToModularJSON)
 *
 * Exporta funções seguras e um assert que lança quando inválido (assertValidModularJson).
 *
 * Observação: tipos do editor (EditableQuizStep, EditorBlockComponent) são representados como `any`
 * para evitar dependências circulares e refactors amplos neste PR.
 */

import { ZodError } from 'zod';
import {
    ModularQuizSchema,
    ModularQuiz,
    ModularStep,
    ModularBlock
} from './modular-schema';

/* -------------------------
   Validation helpers
   ------------------------- */
export function validateModularJson(raw: unknown): { ok: true; data: ModularQuiz } | { ok: false; errors: string[] } {
    try {
        const parsed = ModularQuizSchema.parse(raw);
        return { ok: true, data: parsed };
    } catch (err) {
        if (err instanceof ZodError) {
            const errors = err.errors.map(e => {
                const path = e.path.length ? e.path.join('.') : 'root';
                return `${path}: ${e.message}`;
            });
            return { ok: false, errors };
        }
        return { ok: false, errors: [String(err)] };
    }
}

export function assertValidModularJson(raw: unknown): ModularQuiz {
    const result = validateModularJson(raw);
    if (!result.ok) {
        const msg = `Modular JSON inválido:\n${result.errors.join('\n')}`;
        throw new Error(msg);
    }
    return result.data;
}

export function isModularQuiz(raw: unknown): raw is ModularQuiz {
    return validateModularJson(raw).ok;
}

/* -------------------------
   Conversion: Modular JSON -> Editor model
   ------------------------- */

/**
 * Converte um bloco modular JSON para o formato do editor.
 * Ajuste o mapeamento para o formato esperado pelo editor se necessário.
 */
export function blockJsonToEditor(block: ModularBlock): any {
    return {
        id: block.id,
        type: block.type,
        component: (block as any).component || null,
        properties: { ...(block.props || {}) },
        content: { ...(block.content || {}) },
        order: typeof block.order === 'number' ? block.order : 0,
        parentId: null,
        // children convertidos recursivamente
        children: (block.children || []).map((c: any, idx: number) => {
            const child = blockJsonToEditor(c);
            if (typeof child.order !== 'number') child.order = idx;
            return child;
        })
    };
}

/**
 * Converte um step modular JSON para o formato do editor (EditableQuizStep).
 */
export function stepJsonToEditor(step: ModularStep): any {
    const blocks = (step.blocks || []).map((b, idx) => {
        const eb = blockJsonToEditor(b);
        if (typeof eb.order !== 'number') eb.order = idx;
        return eb;
    });
    return {
        id: step.id,
        type: step.type,
        order: typeof step.order === 'number' ? step.order : 0,
        title: step.title || '',
        blocks,
        nextStep: (step as any).nextStep,
        meta: (() => {
            const copy = { ...step } as any;
            delete copy.id; delete copy.type; delete copy.order; delete copy.title; delete copy.blocks; delete copy.nextStep;
            return copy;
        })()
    };
}

/**
 * Converte e valida estritamente — lança erro se inválido.
 */
export function modularJsonToEditorStepsStrict(raw: unknown): any[] {
    const valid = assertValidModularJson(raw);
    const steps = valid.steps.slice().sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)));
    return steps.map(s => stepJsonToEditor(s));
}

/**
 * Versão segura: retorna {ok: true, steps} ou {ok: false, errors}
 */
export function modularJsonToEditorStepsSafe(raw: unknown): { ok: true; steps: any[] } | { ok: false; errors: string[] } {
    const validated = validateModularJson(raw);
    if (!validated.ok) return { ok: false, errors: validated.errors };
    try {
        const steps = validated.data.steps
            .slice()
            .sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)))
            .map(s => stepJsonToEditor(s));
        return { ok: true, steps };
    } catch (err) {
        return { ok: false, errors: [String(err)] };
    }
}

/* -------------------------
   Conversion: Editor model -> Modular JSON
   ------------------------- */

/**
 * Converte um bloco do editor para o formato modular JSON.
 */
export function editorBlockToModularJSON(block: any): ModularBlock {
    return {
        id: block.id,
        type: block.type,
        component: block.component || undefined,
        props: block.properties || block.props || {},
        content: block.content || {},
        order: typeof block.order === 'number' ? block.order : 0,
        children: (block.children || []).map((c: any) => editorBlockToModularJSON(c))
    };
}

/**
 * Converte um step do editor para o formato modular JSON.
 */
export function editorStepToModularJSON(step: any): ModularStep {
    return {
        id: step.id,
        type: step.type,
        order: typeof step.order === 'number' ? step.order : 0,
        title: step.title || undefined,
        blocks: (step.blocks || []).map((b: any) => editorBlockToModularJSON(b)),
        nextStep: step.nextStep
    } as any;
}

/**
 * Serializa um array de steps do editor em ModularQuiz JSON
 */
export function editorStepsToModularJson(steps: any[], meta?: any): ModularQuiz {
    const s = (steps || [])
        .slice()
        .sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)))
        .map((st: any, idx: number) => ({
            ...editorStepToModularJSON(st),
            order: typeof st.order === 'number' ? st.order : idx,
        }));
    return {
        meta: meta || {},
        steps: s
    };
}

/* -------------------------
   Error pretty printer
   ------------------------- */
export function formatZodErrors(errors: string[]): string {
    return errors.map(e => `- ${e}`).join('\n');
}
