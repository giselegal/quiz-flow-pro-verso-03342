import { supabase } from '@/integrations/supabase/client';
import { QuizEditorPersistenceService } from '@/services/QuizEditorPersistenceService';
import QuizToEditorAdapter, { EditorQuizState } from '@/adapters/QuizToEditorAdapter';

/**
 * 🛰️ TemplatePublishingService
 * Responsável por publicar o estado atual do editor (quiz) no Supabase, gerando versionamento simples.
 * 
 * Requisitos mínimos (tabelas esperadas):
 * - templates: id (uuid|text), name, description, payload_json (jsonb), scoring_matrix (jsonb), variants_json (jsonb), version (int), updated_at, created_at
 * - template_versions: id, template_id, version, snapshot_json (jsonb), diff_json (jsonb), created_at
 * (Se as tabelas diferirem, ajustar nomes de colunas aqui.)
 */
export interface PublishResult {
    success: boolean;
    templateId?: string;
    version?: number;
    error?: string;
    diff?: any;
}

interface ExistingTemplateRow {
    id: string; name?: string; description?: string; version?: number; payload_json?: any; scoring_matrix?: any; variants_json?: any;
}

function computeDiff(prev: any, next: any) {
    try {
        if (!prev) return { added: next, removed: {}, changed: {} };
        const diff: any = { added: {}, removed: {}, changed: {} };
        const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);
        for (const k of allKeys) {
            if (!(k in prev)) diff.added[k] = next[k];
            else if (!(k in next)) diff.removed[k] = prev[k];
            else if (JSON.stringify(prev[k]) !== JSON.stringify(next[k])) diff.changed[k] = { before: prev[k], after: next[k] };
        }
        return diff;
    } catch (e) {
        return { error: 'diff_failed' };
    }
}

export class TemplatePublishingService {
    async publish(editorState: EditorQuizState, options?: { templateId?: string; skipDiff?: boolean }): Promise<PublishResult> {
        try {
            // 1. Converter para payload canônico usando adapter
            const canonical = await new QuizToEditorAdapter().convertEditorToQuiz(editorState);

            const templateId = options?.templateId || editorState.id;

            // 2. Buscar template existente
            const { data: existing, error: fetchError } = await supabase
                .from('templates')
                .select('*')
                .eq('id', templateId)
                .maybeSingle<ExistingTemplateRow>();
            if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

            const prevPayload = existing?.payload_json;

            // 3. Calcular diff
            const diff = options?.skipDiff ? null : computeDiff(prevPayload, canonical);

            // 4. Definir versão
            const nextVersion = (existing?.version || 0) + 1;

            const upsertData: any = {
                id: templateId,
                name: editorState.name,
                description: editorState.description,
                payload_json: canonical,
                scoring_matrix: editorState.scoringMatrix || null,
                variants_json: this.extractVariants(editorState) || null,
                version: nextVersion
            };

            // 5. Upsert principal
            const { error: upsertError } = await supabase
                .from('templates')
                .upsert(upsertData, { onConflict: 'id' });
            if (upsertError) throw upsertError;

            // 6. Registrar versão
            const versionRow = {
                template_id: templateId,
                version: nextVersion,
                snapshot_json: canonical,
                diff_json: diff
            };
            const { error: versionError } = await supabase.from('template_versions').insert([versionRow]);
            if (versionError) console.warn('⚠️ Falha ao registrar versão (continuando):', versionError.message);

            // 7. Persistir metadados localmente
            await QuizEditorPersistenceService.save(editorState.id, {
                ...editorState,
                lastSaved: new Date().toISOString(),
                lastPublishedVersion: nextVersion,
                lastPublishedAt: new Date().toISOString(),
            } as any);

            return { success: true, templateId, version: nextVersion, diff };
        } catch (error: any) {
            console.error('❌ Erro na publicação:', error);
            return { success: false, error: error.message || 'Erro desconhecido' };
        }
    }

    extractVariants(editorState: EditorQuizState) {
        // Procurar por perguntas que contenham variants no modelo atual
        const variantQuestions: any[] = [];
        for (const q of editorState.questions) {
            if ((q as any).variants) {
                variantQuestions.push({ questionId: q.id, variants: (q as any).variants });
            }
        }
        return variantQuestions.length ? variantQuestions : null;
    }
}

export const templatePublishingService = new TemplatePublishingService();
export default templatePublishingService;
