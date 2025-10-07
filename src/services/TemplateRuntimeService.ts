// Serviço de integração com o backend de Template Runtime
// Endpoints esperados:
// GET /api/runtime/quiz/:slug            -> snapshot publicado
// POST /api/runtime/quiz/:slug/start     -> { sessionId, currentStageId }
// POST /api/runtime/quiz/:slug/answer    -> { nextStageId, score, branched }
// POST /api/runtime/quiz/:slug/complete  -> { outcome }

export interface PublishedStage {
    id: string;
    type: string;
    order: number;
    enabled?: boolean;
    componentIds: string[];
}

export interface PublishedComponent {
    id: string;
    type: string;
    props: Record<string, any>;
}

export interface PublishedSnapshot {
    id: string;
    slug: string;
    stages: PublishedStage[];
    components: Record<string, PublishedComponent>;
    logic: any;
    outcomes: any[];
    publishedAt: string;
}

export interface StartResponse { sessionId: string; currentStageId: string }
export interface AnswerResponse { nextStageId: string; score: number; branched: boolean }
export interface CompleteResponse { outcome?: { id: string; template: string; score: number } }

async function jsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText} -> ${text}`);
    }
    return res.json();
}

export class TemplateRuntimeService {
    constructor(private base = '/api/runtime/quiz') { }

    async getSnapshot(slug: string): Promise<PublishedSnapshot> {
        return jsonFetch<PublishedSnapshot>(`${this.base}/${slug}`);
    }

    async start(slug: string): Promise<StartResponse> {
        return jsonFetch<StartResponse>(`${this.base}/${slug}/start`, { method: 'POST', body: '{}' });
    }

    async answer(slug: string, sessionId: string, stageId: string, answers: string[]): Promise<AnswerResponse> {
        return jsonFetch<AnswerResponse>(`${this.base}/${slug}/answer`, {
            method: 'POST',
            body: JSON.stringify({ sessionId, stageId, answers })
        });
    }

    async complete(slug: string, sessionId: string): Promise<CompleteResponse> {
        return jsonFetch<CompleteResponse>(`${this.base}/${slug}/complete`, {
            method: 'POST',
            body: JSON.stringify({ sessionId })
        });
    }
}

export const templateRuntimeService = new TemplateRuntimeService();
