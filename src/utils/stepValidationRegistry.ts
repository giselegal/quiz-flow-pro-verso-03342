import { StorageService } from '@/services/core/StorageService';
import { getBlocksForStep, type RawStepBlocks } from '@/config/quizStepsComplete';

export type ValidationResult = { valid: boolean; reason?: string; evidence?: Record<string, any> };

function getSelections(): Record<string, string[] | string> {
    try {
        return (StorageService.safeGetJSON<Record<string, any>>('userSelections') || {}) as Record<string, any>;
    } catch {
        return {} as Record<string, any>;
    }
}

function blockLooksInteractive(block: any): boolean {
    const t = String(block?.type || '').toLowerCase();
    if (t.includes('option') || t.includes('grid') || t.includes('select')) return true;
    // Heurística: presença de questionId indica bloco interativo
    if (block?.properties?.questionId || block?.content?.questionId) return true;
    return false;
}

export function validateStep(step: number, stepBlocks?: RawStepBlocks | null): ValidationResult {
    // Regra 1: Etapa 1 requer nome
    if (step === 1) {
        const answers = StorageService.safeGetJSON<Record<string, any>>('quizAnswers') || {};
        const storedName = (answers.userName || StorageService.safeGetString('userName') || StorageService.safeGetString('quizUserName') || '').trim();
        const ok = storedName.length >= 2;
        return ok ? { valid: true } : { valid: false, reason: 'Nome do usuário ausente (step 1)' };
    }

    // Obter blocos normalizados da etapa
    const blocks = getBlocksForStep(step, stepBlocks) || [];
    if (blocks.length === 0) {
        // Sem blocos => considerar válida (não bloqueia o fluxo)
        return { valid: true };
    }

    // Se não há blocos interativos, considerar válida
    const interactive = blocks.filter(blockLooksInteractive);
    if (interactive.length === 0) return { valid: true };

    // Regras por bloco usando selections/answers
    const selections = getSelections();
    const answers = StorageService.safeGetJSON<Record<string, any>>('quizAnswers') || {};

    const missing: string[] = [];
    const evidence: Record<string, any> = {};

    for (const block of interactive) {
        const t = String(block?.type || '').toLowerCase();
        const qid = String(block?.properties?.questionId || block?.content?.questionId || block?.id || '');
        const required = Boolean(block?.properties?.required ?? block?.content?.required ?? false);
        const requiredSelections = Number(block?.properties?.requiredSelections ?? block?.content?.requiredSelections ?? 0) || undefined;
        const minSelections = Number(block?.properties?.minSelections ?? block?.content?.minSelections ?? 0) || undefined;
        const maxSelections = Number(block?.properties?.maxSelections ?? block?.content?.maxSelections ?? 0) || undefined;

        if (t.includes('option') || t.includes('grid') || t.includes('select')) {
            const values = selections[qid] || selections[`question-${qid}`] || selections[`q-${qid}`] || [];
            const count = Array.isArray(values) ? values.length : (typeof values === 'string' && values ? 1 : 0);
            evidence[qid] = values;
            if (required || requiredSelections || minSelections) {
                const min = requiredSelections || minSelections || 1;
                if (count < min) missing.push(qid);
                if (typeof maxSelections === 'number' && maxSelections > 0 && count > maxSelections) missing.push(`${qid}:exceedsMax`);
            }
        } else {
            // Campos de formulário/texto: se required, precisa ter resposta
            if (required) {
                const ans = (answers[qid] ?? answers[block?.id] ?? '').toString().trim();
                if (!ans) missing.push(qid);
                else evidence[qid] = ans;
            }
        }
    }

    if (missing.length === 0) return { valid: true, evidence };
    return { valid: false, reason: `Respostas obrigatórias ausentes: ${missing.join(', ')}`, evidence };
}

export function validateAllSteps(totalSteps = 21, stepBlocks?: RawStepBlocks | null): Record<number, boolean> {
    const out: Record<number, boolean> = {};
    for (let i = 1; i <= totalSteps; i++) {
        out[i] = validateStep(i, stepBlocks).valid;
    }
    return out;
}

export default { validateStep, validateAllSteps };
