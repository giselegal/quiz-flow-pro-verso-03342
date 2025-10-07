import { TemplateListItem, TemplateDraft, ValidationReport, BranchingRule, Outcome, ScoringConfig } from './types';

const BASE = '/api/templates';

async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const contentType = res.headers.get('content-type') || '';

    // Função auxiliar para construir erro rico
    const buildError = async (baseMsg: string) => {
        let bodySnippet = '';
        try {
            const text = await res.text();
            bodySnippet = text.slice(0, 300);
        } catch { /* ignore */ }
        return new Error(`${baseMsg} | status=${res.status} | ct=${contentType || 'n/a'} | body: ${bodySnippet}`);
    };

    if (!res.ok) {
        // Tenta JSON estruturado primeiro
        if (contentType.includes('application/json')) {
            try {
                const detail = await res.json();
                throw new Error(detail?.error || `Request failed ${res.status}`);
            } catch (e) {
                throw e;
            }
        }
        throw await buildError('Request failed (non-JSON)');
    }

    if (!contentType.includes('application/json')) {
        // Provavelmente recebeu index.html (fallback SPA) — backend não estava ativo ou proxy incorreto
        throw await buildError('Unexpected non-JSON response (possible SPA fallback or proxy issue)');
    }

    try {
        return await res.json();
    } catch (e: any) {
        throw await buildError('Failed to parse JSON');
    }
}

export const templatesApi = {
    async list(): Promise<TemplateListItem[]> { return http(`${BASE}`); },
    async create(name: string, slug: string) { return http<{ id: string; slug: string }>(`${BASE}`, { method: 'POST', body: JSON.stringify({ name, slug }) }); },
    async get(id: string): Promise<TemplateDraft> { return http(`${BASE}/${id}`); },
    async updateMeta(id: string, patch: Partial<TemplateDraft['meta']>) { return http(`${BASE}/${id}/meta`, { method: 'PATCH', body: JSON.stringify(patch) }); },
    async addStage(id: string, params: { type: string; afterStageId?: string; label?: string }) { return http(`${BASE}/${id}/stages`, { method: 'POST', body: JSON.stringify(params) }); },
    async reorderStages(id: string, orderedIds: string[]) { return http(`${BASE}/${id}/stages/reorder`, { method: 'POST', body: JSON.stringify({ orderedIds }) }); },
    async updateStage(id: string, stageId: string, patch: any) { return http(`${BASE}/${id}/stages/${stageId}`, { method: 'PATCH', body: JSON.stringify(patch) }); },
    async removeStage(id: string, stageId: string) { return http(`${BASE}/${id}/stages/${stageId}`, { method: 'DELETE' }); },
    // Operações de componentes dentro de uma stage
    async addStageComponent(id: string, stageId: string, payload: { componentId?: string; component?: { type: string; props?: any; styleTokens?: any }; position?: number }) {
        return http(`${BASE}/${id}/stages/${stageId}/components`, { method: 'POST', body: JSON.stringify(payload) });
    },
    async reorderStageComponents(id: string, stageId: string, orderedIds: string[]) {
        return http(`${BASE}/${id}/stages/${stageId}/components/reorder`, { method: 'POST', body: JSON.stringify({ orderedIds }) });
    },
    async removeStageComponent(id: string, stageId: string, componentId: string) {
        return http(`${BASE}/${id}/stages/${stageId}/components/${componentId}`, { method: 'DELETE' });
    },
    async setOutcomes(id: string, outcomes: Outcome[]) { return http(`${BASE}/${id}/outcomes`, { method: 'PUT', body: JSON.stringify({ outcomes }) }); },
    async setScoring(id: string, scoring: Partial<ScoringConfig>) { return http(`${BASE}/${id}/scoring`, { method: 'PATCH', body: JSON.stringify(scoring) }); },
    async setBranching(id: string, rules: BranchingRule[]) { return http(`${BASE}/${id}/branching`, { method: 'PUT', body: JSON.stringify({ rules }) }); },
    async validate(id: string): Promise<ValidationReport> { return http(`${BASE}/${id}/validate`, { method: 'POST' }); },
    async publish(id: string) { return http(`${BASE}/${id}/publish`, { method: 'POST' }); },
    async startPreview(id: string) { return http(`${BASE}/${id}/runtime/preview/start`, { method: 'POST' }); },
    async answerPreview(id: string, payload: { sessionId: string; stageId: string; optionIds: string[] }) {
        return http(`${BASE}/${id}/runtime/preview/answer`, { method: 'POST', body: JSON.stringify(payload) });
    },
    async history(id: string) { return http(`${BASE}/${id}/history`); }
};

// Client específico para componentes (painel de propriedades)
export const componentsApi = {
    async get(id: string) { return http(`/api/components/${id}`); },
    async patch(id: string, propsPatch: Record<string, any>) { return http(`/api/components/${id}`, { method: 'PATCH', body: JSON.stringify({ props: propsPatch }) }); }
};
