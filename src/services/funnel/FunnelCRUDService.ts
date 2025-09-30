import { quizEstiloLoaderGateway } from '@/domain/quiz/gateway';
import { mapStepsToStepBlocks } from '@/domain/quiz/gateway';
import type { CanonicalQuizDefinition, CanonicalStep } from '@/domain/quiz/gateway/QuizEstiloLoaderGateway';
import { DraftPersistence } from '@/services/editor/DraftPersistence';
import type { Block } from '@/types/editor';

export interface FunnelDocument {
    funnelId: string;
    definition: CanonicalQuizDefinition;
    stepBlocks: Record<string, Block[]>;
    lastLoadedAt: number;
    dirtySteps: Set<string>;
}

export interface SaveResult {
    success: boolean;
    updatedAt: number;
    persistedSteps: string[];
}

/**
 * FunnelCRUDService
 * Responsável por carregar, mesclar rascunhos locais, aplicar diffs e salvar (futuro: Supabase/API).
 */
export class FunnelCRUDService {
    private documents = new Map<string, FunnelDocument>();
    private draftNamespace = 'funnel-drafts-v1';

    async loadFunnel(funnelId: string): Promise<FunnelDocument> {
        // Hoje suportamos apenas quiz-estilo canônico; futura extensão pode discriminar outros IDs
        const definition = await quizEstiloLoaderGateway.load();
        const stepBlocks = mapStepsToStepBlocks(definition.steps as CanonicalStep[]);

        // Merge de drafts locais (se existirem)
        const merged = { ...stepBlocks } as Record<string, Block[]>;
        const draftKey = funnelId || definition.templateId;
        for (const stepId of Object.keys(stepBlocks)) {
            const draft = DraftPersistence.loadStepDraft(draftKey, stepId);
            if (draft && Array.isArray(draft.blocks) && draft.blocks.length > 0) {
                // Estratégia simples: substituir completamente por enquanto
                merged[stepId] = draft.blocks as Block[];
            }
        }

        const doc: FunnelDocument = {
            funnelId: funnelId || definition.templateId,
            definition,
            stepBlocks: merged,
            lastLoadedAt: Date.now(),
            dirtySteps: new Set(),
        };
        this.documents.set(doc.funnelId, doc);
        return doc;
    }

    getDocument(funnelId: string): FunnelDocument | undefined {
        return this.documents.get(funnelId);
    }

    listOpenDocuments(): FunnelDocument[] {
        return Array.from(this.documents.values());
    }

    markStepDirty(funnelId: string, stepId: string) {
        const doc = this.documents.get(funnelId);
        if (!doc) return;
        doc.dirtySteps.add(stepId);
    }

    updateStepBlocks(funnelId: string, stepId: string, blocks: Block[]) {
        const doc = this.documents.get(funnelId);
        if (!doc) return;
        doc.stepBlocks[stepId] = blocks;
        doc.dirtySteps.add(stepId);
    }

    /**
     * Persistência local (futuro: enviar apenas diffs para backend)
     */
    saveLocal(funnelId: string): SaveResult {
        const doc = this.documents.get(funnelId);
        if (!doc) return { success: false, updatedAt: Date.now(), persistedSteps: [] };

        const draftKey = funnelId;
        const persisted: string[] = [];
        doc.dirtySteps.forEach(stepId => {
            const blocks = doc.stepBlocks[stepId] || [];
            DraftPersistence.saveStepDraft(draftKey, stepId, blocks as any);
            persisted.push(stepId);
        });
        doc.dirtySteps.clear();

        return { success: true, updatedAt: Date.now(), persistedSteps: persisted };
    }

    /**
     * Placeholder para futura publicação
     */
    async publish(funnelId: string) {
        const doc = this.documents.get(funnelId);
        if (!doc) throw new Error('Documento não carregado');
        // TODO: implementar pipeline de validação + serialização
        return { success: true, steps: Object.keys(doc.stepBlocks) };
    }
}

export const funnelCRUDService = new FunnelCRUDService();
