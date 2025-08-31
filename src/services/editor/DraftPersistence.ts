import { StorageService } from '@/services/core/StorageService';
import type { Block } from '@/types/editor';

export interface DraftIndexEntry {
    stepKey: string;
    lastEditedAt: number; // epoch ms
    schemaVersion: string;
}

export interface DraftStepData {
    stepKey: string;
    blocks: Block[];
    lastEditedAt: number;
    schemaVersion: string;
}

type DraftIndex = Record<string, DraftIndexEntry>; // stepKey -> entry

const INDEX_KEY = (quizId: string) => `quiz-editor-draft:index:${quizId}`;
const STEP_KEY = (quizId: string, stepKey: string) => `quiz-editor-draft:${quizId}:${stepKey}`;

// Simple in-memory debounce per step
const pendingTimers = new Map<string, number>();

export const DraftPersistence = {
    getIndex(quizId: string): DraftIndex {
        const idx = StorageService.safeGetJSON<DraftIndex>(INDEX_KEY(quizId));
        return idx || {};
    },

    setIndex(quizId: string, index: DraftIndex) {
        StorageService.safeSetJSON(INDEX_KEY(quizId), index);
    },

    loadStepDraft(quizId: string, stepKey: string): DraftStepData | null {
        const data = StorageService.safeGetJSON<DraftStepData>(STEP_KEY(quizId, stepKey));
        return data || null;
    },

    clearStepDraft(quizId: string, stepKey: string) {
        try {
            localStorage.removeItem(STEP_KEY(quizId, stepKey));
        } catch { }
        const idx = this.getIndex(quizId);
        if (idx[stepKey]) {
            delete idx[stepKey];
            this.setIndex(quizId, idx);
        }
    },

    saveStepDraft(
        quizId: string,
        stepKey: string,
        blocks: Block[],
        schemaVersion: string = 'v1',
        debounceMs: number = 350
    ) {
        const timerKey = `${quizId}::${stepKey}`;
        if (pendingTimers.has(timerKey)) {
            const prev = pendingTimers.get(timerKey)!;
            window.clearTimeout(prev);
        }
        const fn = () => {
            const payload: DraftStepData = {
                stepKey,
                blocks,
                lastEditedAt: Date.now(),
                schemaVersion,
            };
            StorageService.safeSetJSON(STEP_KEY(quizId, stepKey), payload);
            const idx = this.getIndex(quizId);
            idx[stepKey] = {
                stepKey,
                lastEditedAt: payload.lastEditedAt,
                schemaVersion,
            };
            this.setIndex(quizId, idx);
        };
        const t = window.setTimeout(fn, Math.max(0, debounceMs));
        pendingTimers.set(timerKey, t);
    },
};
