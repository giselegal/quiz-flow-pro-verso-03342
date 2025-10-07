import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface LegacyTemplateDraft {
    id: string;
    meta: { name: string; slug: string; description?: string; tags?: string[] };
    stages: { id: string; type: string; order: number; enabled: boolean; componentIds: string[]; meta?: any }[];
    components: Record<string, { id: string; type: string; props: any }>;
    logic: any;
    outcomes: any[];
    status: 'draft';
    draftVersion?: number;
}

async function fetchLegacyDraft(slug: string): Promise<LegacyTemplateDraft> {
    const res = await fetch(`/api/quiz-style/${slug}/as-draft`);
    if (!res.ok) {
        throw new Error(`Falha ao carregar legacy draft (${slug}): ${res.status}`);
    }
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error('Resposta não é JSON válido');
    return res.json();
}

export function useLegacyQuizDraft(slug: string | null) {
    return useQuery({
        queryKey: ['legacy-quiz-draft', slug],
        queryFn: () => fetchLegacyDraft(slug!),
        enabled: !!slug
    });
}

interface ApplyDeltaInput {
    slug: string;
    meta?: { name?: string; description?: string };
    stagesReorder?: string[];
}

async function postLegacyDelta({ slug, ...payload }: ApplyDeltaInput) {
    const res = await fetch(`/api/quiz-style/${slug}/apply-delta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        throw new Error(`Falha ao aplicar delta (${res.status})`);
    }
    return res.json();
}

export function useApplyLegacyDelta() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: postLegacyDelta,
        onSuccess: (_data, vars) => {
            qc.invalidateQueries({ queryKey: ['legacy-quiz-draft', vars.slug] });
        }
    });
}
