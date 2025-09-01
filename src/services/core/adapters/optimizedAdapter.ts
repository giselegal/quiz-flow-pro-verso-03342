import type { Adapter } from './types';
import type { CanonicalQuiz, CanonicalQuestion, CanonicalOption } from '@/types/quizCanonical';

type OptimizedOption = {
    id?: string;
    text?: string;
    label?: string;
    imageUrl?: string;
    score?: Record<string, number>;
    segment?: string;
};
type OptimizedQuestion = {
    id?: string;
    title?: string;
    question?: string;
    text?: string;
    options?: OptimizedOption[];
    selectionMode?: 'single' | 'multiple';
    requiredSelections?: number;
    minSelections?: number;
    maxSelections?: number;
};
type OptimizedRoot = {
    id?: string;
    title?: string;
    steps?: any[];
    questionData?: OptimizedQuestion[]; // usado por algumas etapas
};

function asText(opt?: { text?: string; label?: string } | undefined): string {
    return (opt?.text ?? opt?.label ?? '').toString();
}

function normalizeKind(q: OptimizedQuestion): 'scored' | 'strategic' {
    const hasScore = (q.options ?? []).some(o => o.score && Object.keys(o.score!).length > 0);
    if (hasScore) return 'scored';
    const hasSegment = (q.options ?? []).some(o => typeof o.segment === 'string' && o.segment.length > 0);
    return hasSegment ? 'strategic' : 'scored';
}

function selectionConstraints(q: OptimizedQuestion) {
    const { requiredSelections, minSelections, maxSelections, selectionMode } = q;
    if (typeof requiredSelections === 'number') return { requiredSelections } as const;
    if (selectionMode === 'single') return { requiredSelections: 1 } as const;
    return {
        minSelections: typeof minSelections === 'number' ? minSelections : undefined,
        maxSelections: typeof maxSelections === 'number' ? maxSelections : undefined,
    } as const;
}

export const optimizedAdapter: Adapter<OptimizedRoot> = {
    canHandle(src: unknown): src is OptimizedRoot {
        const r = src as any;
        return !!r && (Array.isArray(r?.questionData) || Array.isArray(r?.steps));
    },

    toCanonical(src: OptimizedRoot): CanonicalQuiz {
        // questionData direto (quando presente)
        const qData: OptimizedQuestion[] = Array.isArray(src.questionData)
            ? src.questionData!
            : Array.isArray(src.steps)
                ? src.steps
                    .map((s: any) => s?.questionData)
                    .filter(Boolean)
                    .flat()
                : [];

        const questions: CanonicalQuestion[] = (qData ?? []).map((q, idx) => {
            const kind = normalizeKind(q);
            const options: CanonicalOption[] = (q.options ?? []).map((o, i) => ({
                id: o.id ?? `opt_${i + 1}`,
                text: asText(o),
                imageUrl: o.imageUrl,
                score: kind === 'scored' ? (o.score ?? undefined) : undefined,
                segment: kind === 'strategic' ? (o.segment ?? undefined) : undefined,
            }));

            const constraints = selectionConstraints(q);

            return {
                id: q.id ?? `q${idx + 1}`,
                title: q.title,
                text: q.text ?? q.question ?? '',
                kind,
                options,
                ...constraints,
            };
        });

        return {
            id: src.id ?? 'optimized_quiz',
            title: src.title,
            questions,
        };
    },
};
