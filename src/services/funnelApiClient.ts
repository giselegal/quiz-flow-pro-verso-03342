// 🚀 Funnel API Client
// Fornece acesso desacoplado ao funil via HTTP.
// Evolutivo: hoje usa fetch simples; depois pode integrar cache, ETag e chunking.

export interface FunnelBlockDto {
    id: string;
    type: string;
    content?: any;
    properties?: Record<string, any>;
    [k: string]: any;
}

export interface FunnelStepDto {
    id: string;
    order: number;
    kind: string;
    blockRefs: string[];
    meta?: Record<string, any>;
}

export interface FunnelDto {
    id: string | null; // null para canvas novo
    version?: number;
    status: 'draft' | 'published' | 'archived' | 'new';
    name?: string;
    templateType?: string;
    steps: FunnelStepDto[];
    blocks: Record<string, FunnelBlockDto>;
    settings?: {
        theme?: { primary?: string;[k: string]: any };
        [k: string]: any;
    };
    featureFlags?: Record<string, boolean>;
    hash?: string;
    isEmptyCanvas?: boolean;
}

export interface NormalizedFunnel {
    id: string | null;
    totalSteps: number;
    stepBlocks: Record<string, any[]>; // mapeado para formato já esperado pelo editor (arrays de Blocks por stepKey)
    funnelConfig: {
        templateId: string;
        totalSteps: number;
        theme?: string;
        allowBackward: boolean;
        saveProgress: boolean;
        showProgress: boolean;
    };
    raw: FunnelDto;
    isEmpty: boolean;
}

export interface FunnelApiError extends Error {
    status?: number;
    code?: string;
    cause?: any;
}

const DEFAULT_EMPTY: NormalizedFunnel = {
    id: null,
    totalSteps: 0,
    stepBlocks: {},
    funnelConfig: {
        templateId: 'empty-canvas',
        totalSteps: 0,
        theme: 'modern-elegant',
        allowBackward: true,
        saveProgress: true,
        showProgress: false
    },
    raw: {
        id: null,
        status: 'new',
        steps: [],
        blocks: {},
        isEmptyCanvas: true
    },
    isEmpty: true
};

function normalize(dto: FunnelDto): NormalizedFunnel {
    if (!dto || dto.isEmptyCanvas || !dto.steps || dto.steps.length === 0) {
        return DEFAULT_EMPTY;
    }

    const ordered = [...dto.steps].sort((a, b) => a.order - b.order);
    const stepBlocks: Record<string, any[]> = {};

    ordered.forEach((step, idx) => {
        const stepKey = `step-${idx + 1}`; // reindexa contíguo
        step.blockRefs?.forEach(ref => {
            const b = dto.blocks[ref];
            if (!b) return;
            if (!stepBlocks[stepKey]) stepBlocks[stepKey] = [];
            stepBlocks[stepKey].push({
                id: b.id,
                type: b.type,
                content: b.content || {},
                properties: b.properties || {}
            });
        });
        if (!stepBlocks[stepKey]) stepBlocks[stepKey] = []; // garante chave
    });

    return {
        id: dto.id,
        totalSteps: ordered.length,
        stepBlocks,
        funnelConfig: {
            templateId: dto.templateType || dto.id || 'funnel-runtime',
            totalSteps: ordered.length,
            theme: dto.settings?.theme?.primary || 'modern-elegant',
            allowBackward: true,
            saveProgress: true,
            showProgress: ordered.length > 1
        },
        raw: dto,
        isEmpty: ordered.length === 0
    };
}

export class FunnelApiClient {
    constructor(private baseUrl: string = '/api') { }

    async getFunnel(id: string, opts: { signal?: AbortSignal } = {}): Promise<NormalizedFunnel> {
        if (!id) {
            return DEFAULT_EMPTY;
        }

        const url = `${this.baseUrl}/funnels/${encodeURIComponent(id)}?mode=editor`;
        const started = performance.now();
        let res: Response;
        try {
            res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: opts.signal });
        } catch (err) {
            const e: FunnelApiError = new Error('Network error fetching funnel');
            e.cause = err;
            throw e;
        }

        const elapsed = performance.now() - started;

        if (res.status === 404) {
            // Trata como canvas vazio novo
            return DEFAULT_EMPTY;
        }

        let body: any;
        try {
            body = await res.json();
        } catch (err) {
            const e: FunnelApiError = new Error('Invalid JSON in funnel response');
            e.status = res.status;
            e.cause = err;
            throw e;
        }

        if (!res.ok) {
            const e: FunnelApiError = new Error(body?.error?.message || 'Funnel API error');
            e.status = res.status;
            e.code = body?.error?.code;
            e.cause = body;
            throw e;
        }

        // Caso a API já retorne estrutura normalized (feature futura)
        if (body && body.normalized === true && body.data) {
            return body.data as NormalizedFunnel;
        }

        const dto: FunnelDto = body as FunnelDto;
        const normalized = normalize(dto);

        if (typeof window !== 'undefined') {
            (window as any).__FUNNEL_API_METRICS__ = {
                lastFetchMs: Math.round(elapsed),
                lastId: id,
                ts: Date.now()
            };
        }

        return normalized;
    }
}

export const funnelApiClient = new FunnelApiClient();
