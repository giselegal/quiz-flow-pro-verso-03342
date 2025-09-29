/**
 * QuizOverridesStorage
 * Camada de persistência para overrides do quiz.
 * Prioridade: IndexedDB -> localStorage -> memória.
 */

import { IndexedDBStorageService } from '@/utils/storage/IndexedDBStorageService';

export interface QuizOverridesData {
    version: number;
    updatedAt: string | null;
    steps: Record<string, any>;
    blocks: Record<string, any>;
}

const DEFAULT_DATA: QuizOverridesData = { version: 1, updatedAt: null, steps: {}, blocks: {} };
const DB_COLLECTION = 'quiz_overrides';
const DB_KEY = 'current';
const LS_KEY = 'quiz-overrides-v1';

export type StorageMedium = 'indexeddb' | 'localStorage' | 'memory';

export class QuizOverridesStorage {
    private static instance: QuizOverridesStorage;
    private memory: QuizOverridesData = { ...DEFAULT_DATA };
    private medium: StorageMedium = 'memory';
    private idb: IndexedDBStorageService | null = null;
    private ready = false;

    static getInstance() {
        if (!QuizOverridesStorage.instance) QuizOverridesStorage.instance = new QuizOverridesStorage();
        return QuizOverridesStorage.instance;
    }

    async init(): Promise<void> {
        if (this.ready) return;
        // 1. Tentar IndexedDB se disponível
        try {
            // IndexedDBStorageService é singleton; se falhar, cai no catch
            this.idb = IndexedDBStorageService.getInstance();
            await this.idb.init?.();
            const existing = await this.idb.get(DB_COLLECTION, DB_KEY);
            if (existing) {
                this.memory = existing as QuizOverridesData;
            } else {
                await this.idb.set(DB_COLLECTION, DB_KEY, this.memory);
            }
            this.medium = 'indexeddb';
            this.ready = true;
            return;
        } catch {
            this.idb = null;
        }

        // 2. Fallback localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                const raw = window.localStorage.getItem(LS_KEY);
                if (raw) this.memory = JSON.parse(raw);
                this.medium = 'localStorage';
                this.ready = true;
                return;
            } catch {/* ignore */ }
        }

        // 3. Memória
        this.medium = 'memory';
        this.ready = true;
    }

    getMedium(): StorageMedium { return this.medium; }

    get(): QuizOverridesData { return this.memory; }

    async save(data: QuizOverridesData): Promise<void> {
        data.updatedAt = new Date().toISOString();
        this.memory = data;
        switch (this.medium) {
            case 'indexeddb':
                try { await this.idb!.set(DB_COLLECTION, DB_KEY, data); } catch {/* ignore */ }
                break;
            case 'localStorage':
                try { window.localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {/* ignore */ }
                break;
            case 'memory':
            default:
                break;
        }
    }
}

export const quizOverridesStorage = QuizOverridesStorage.getInstance();
