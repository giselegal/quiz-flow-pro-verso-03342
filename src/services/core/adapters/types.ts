import type { CanonicalQuiz } from '@/types/quizCanonical';

export interface Adapter<TSource = unknown> {
    canHandle(src: unknown): src is TSource;
    toCanonical(src: TSource): CanonicalQuiz;
}

export interface TemplateAdapterConfig {
    segmentByOptionId?: Record<string, string>;
    strategicQuestionIds?: Set<string>;
}
