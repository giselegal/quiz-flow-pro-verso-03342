// 🧩 QuizEditorSyncService - Skeleton
// Responsável por sincronizar estado entre o modelo de Quiz (/quiz-estilo)
// e o formato de edição (EditorProvider). Implementação inicial focada em contratos.

import { toStepKey, toStepNumber } from '../navigation/stepMapping';
import { nanoid } from 'nanoid';

export interface RawQuizAnswerMap {
    [stepKey: string]: string[];
}

export interface QuizScores {
    [style: string]: number;
}

export interface QuizStateLike {
    currentStep: string; // step-1
    answers: RawQuizAnswerMap;
    scores: QuizScores;
    userProfile?: Record<string, any>;
}

export interface EditorLikeAPI {
    getStepBlocks(stepKey: string): any[];
    updateBlock(stepKey: string, blockId: string, updates: Record<string, any>): Promise<void>;
    listAllSteps(): string[]; // step-1..step-N
    markDirty?: () => void;
}

export interface QuizEditorSyncServiceOptions {
    maxSteps?: number;
    enableScoreRecompute?: boolean;
}

export class QuizEditorSyncService {
    private quizState: QuizStateLike | null = null;
    private editor: EditorLikeAPI | null = null;
    private subscribers: Array<() => void> = [];
    private options: Required<QuizEditorSyncServiceOptions> = {
        maxSteps: 100,
        enableScoreRecompute: true,
    };

    constructor(opts?: QuizEditorSyncServiceOptions) {
        this.options = { ...this.options, ...(opts || {}) };
    }

    attachEditor(editor: EditorLikeAPI) {
        this.editor = editor;
    }

    loadQuizState(state: QuizStateLike) {
        // Normalizar estrutura mínima
        this.quizState = {
            currentStep: state.currentStep || 'step-1',
            answers: state.answers || {},
            scores: state.scores || {},
            userProfile: state.userProfile || {}
        };
        this.emit();
    }

    exportQuizState(): QuizStateLike | null {
        return this.quizState ? { ...this.quizState } : null;
    }

    syncAnswersToEditor() {
        if (!this.quizState || !this.editor) return;
        const steps = this.editor.listAllSteps();
        for (const stepKey of steps) {
            const answerIds = this.quizState.answers[stepKey] || [];
            const blocks = this.editor.getStepBlocks(stepKey) || [];
            for (const b of blocks) {
                if (b.type === 'quiz-option') {
                    const isSelected = answerIds.includes(b.id);
                    if (b.selected !== isSelected) {
                        // Atualiza bloco para refletir seleção
                        this.editor.updateBlock(stepKey, b.id, { selected: isSelected }).catch(() => { });
                    }
                }
            }
        }
    }

    applyAnswer(step: number | string, answerIds: string[]) {
        if (!this.quizState) return;
        const numeric = typeof step === 'string' ? toStepNumber(step) : step;
        const key = toStepKey(numeric);
        this.quizState.answers[key] = [...answerIds];
        if (this.options.enableScoreRecompute) this.recomputeScores();
        this.syncAnswersToEditor();
        this.emit();
    }

    setCurrentStep(step: number | string) {
        if (!this.quizState) return;
        const numeric = typeof step === 'string' ? toStepNumber(step) : step;
        const key = toStepKey(numeric);
        if (this.quizState.currentStep === key) return; // idempotente
        this.quizState.currentStep = key;
        this.emit();
    }

    recomputeScores() {
        if (!this.quizState) return;
        const styleKeys = Object.keys(this.quizState.scores || {});
        if (styleKeys.length === 0) return;
        // Exemplo simples: cada resposta adiciona 1 ponto para todos os estilos marcados em metadados do bloco
        const aggregated: Record<string, number> = {};
        for (const style of styleKeys) aggregated[style] = 0;
        // Percorrer respostas
        for (const stepKey of Object.keys(this.quizState.answers)) {
            const answerIds = this.quizState.answers[stepKey];
            if (!this.editor) continue;
            const blocks = this.editor.getStepBlocks(stepKey) || [];
            for (const ansId of answerIds) {
                const block = blocks.find((b: any) => b.id === ansId);
                if (block && block.styleTags) {
                    for (const tag of block.styleTags) {
                        if (aggregated[tag] === undefined) aggregated[tag] = 0;
                        aggregated[tag] += 1;
                    }
                }
            }
        }
        // Normalizar em scores existentes
        for (const style of styleKeys) {
            this.quizState.scores[style] = aggregated[style] ?? 0;
        }
        this.emit();
    }

    // Assinaturas (observer simples)
    subscribe(cb: () => void) {
        this.subscribers.push(cb);
        return () => {
            const idx = this.subscribers.indexOf(cb);
            if (idx >= 0) this.subscribers.splice(idx, 1);
        };
    }

    private emit() {
        for (const s of this.subscribers) {
            try { s(); } catch { /* noop */ }
        }
    }
}
