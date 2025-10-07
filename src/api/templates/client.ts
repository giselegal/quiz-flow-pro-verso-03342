import { TemplateListItem, TemplateDraft, ValidationReport, BranchingRule, Outcome, ScoringConfig } from './types';

// Erro estruturado para permitir classificação no frontend (ex: redirect resiliente)
class ApiError extends Error {
    code: string;
    status?: number;
    snippet?: string;
    constructor(message: string, code: string, status?: number, snippet?: string) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.snippet = snippet;
    }
}

const BASE = '/api/templates';

async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
    let res: Response;
    try {
        res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });
    } catch (networkErr: any) {
        // Erro antes de chegar a uma resposta HTTP (queda de backend, CORS, DNS, abort, etc.)
        throw new ApiError(`Network error fetching ${url}: ${networkErr?.message || networkErr}`, 'NETWORK_ERROR');
    }

    const contentType = res.headers.get('content-type') || '';

    // Função auxiliar para construir erro rico com snippet de corpo
    const buildError = async (baseMsg: string, code: string) => {
        let bodySnippet = '';
        try {
            const text = await res.text();
            bodySnippet = text.slice(0, 300);
        } catch { /* ignore */ }
        return new ApiError(
            `${baseMsg} | status=${res.status} | ct=${contentType || 'n/a'} | body: ${bodySnippet}`,
            code,
            res.status,
            bodySnippet
        );
    };

    if (!res.ok) {
        if (contentType.includes('application/json')) {
            try {
                const detail = await res.json();
                throw new ApiError(detail?.error || `Request failed ${res.status}`, 'HTTP_ERROR_JSON', res.status);
            } catch (e: any) {
                if (e instanceof ApiError) throw e;
                throw new ApiError(`Malformed JSON error payload status=${res.status}`, 'HTTP_ERROR_BAD_JSON', res.status);
            }
        }
        throw await buildError('Request failed (non-JSON)', 'HTTP_ERROR_NON_JSON');
    }

    if (!contentType.includes('application/json')) {
        // Fallback HTML quase certo → backend offline ou proxy retornou index.html
        throw await buildError('Unexpected non-JSON response (possible SPA fallback or proxy issue)', 'FALLBACK_HTML');
    }

    try {
        return await res.json();
    } catch (e: any) {
        throw await buildError('Failed to parse JSON', 'PARSE_ERROR');
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
