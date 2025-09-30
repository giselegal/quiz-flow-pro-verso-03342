import { QUIZ_EDITOR_VERSION, QuizEditorPersistence, QuizPersistenceResult, QuizTemplateData } from '@/types/quizEditor';

interface MemoryStoreEntry { data: QuizTemplateData; }

class InMemoryQuizStore {
    private store = new Map<string, MemoryStoreEntry>();
    get(id: string) { return this.store.get(id); }
    set(id: string, data: QuizTemplateData) { this.store.set(id, { data }); }
}

const memoryStore = new InMemoryQuizStore();

function safeNowISO() { return new Date().toISOString(); }

function getStorage(): Storage | null {
    try {
        if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    } catch { /* ignore */ }
    return null;
}

function buildKey(templateId: string) { return `quiz-editor:${templateId}`; }

export const QuizEditorPersistenceService: QuizEditorPersistence = {
    async load(templateId: string): Promise<QuizTemplateData | null> {
        const key = buildKey(templateId);
        const storage = getStorage();
        if (storage) {
            const raw = storage.getItem(key);
            if (raw) {
                try { return JSON.parse(raw) as QuizTemplateData; } catch { /* ignore */ }
            }
        }
        const mem = memoryStore.get(key);
        return mem ? mem.data : null;
    },
    async save(data: QuizTemplateData): Promise<QuizPersistenceResult> {
        try {
            const enriched: QuizTemplateData = { ...data, version: QUIZ_EDITOR_VERSION, updatedAt: safeNowISO() };
            const key = buildKey(data.templateId);
            const storage = getStorage();
            if (storage) {
                storage.setItem(key, JSON.stringify(enriched));
            } else {
                memoryStore.set(key, enriched);
            }
            return { success: true, version: enriched.version };
        } catch (e: any) {
            return { success: false, error: e?.message || 'Unknown error' };
        }
    }
};
