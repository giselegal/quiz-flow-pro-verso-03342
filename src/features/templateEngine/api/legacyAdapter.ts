import { useQuery } from '@tanstack/react-query';

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
