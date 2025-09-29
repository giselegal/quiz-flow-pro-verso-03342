// Contratos centrais derivados de QUIZ_ARCH_LAYERS.md
// Estes tipos são estáveis e devem mudar apenas via revisão arquitetural.

import type { ZodTypeAny } from 'zod';

export interface CanonicalQuizDefinition {
    version: string;
    hash: string;
    steps: CanonicalQuizStep[];
    offerMapping: { strategicFinalStepId: string };
    progress: { countedStepIds: string[] };
}

export type CanonicalQuizStep =
    | { id: string; type: 'intro'; title: string; text?: string; buttonText?: string }
    | { id: string; type: 'question'; questionText: string; requiredSelections: number; options: { id: string; text: string; image?: string }[]; next: string }
    | { id: string; type: 'strategic-question'; questionText: string; options: { id: string; text: string }[]; next: string }
    | { id: string; type: 'transition' | 'transition-result'; title: string; text?: string; next: string }
    | { id: string; type: 'result'; title: string; next: string }
    | { id: string; type: 'offer'; image?: string; variants: { matchValue: string; title: string; description: string; buttonText: string; testimonial: { quote: string; author: string } }[] };

export interface ScoringResult {
    styleScores: Record<string, number>;
    dominantStyle: string;
    ordered: [string, number][];
}

export interface OfferVariant {
    matchValue: string;
    title: string;
    description: string;
    buttonText: string;
    testimonial: { quote: string; author: string };
}

export interface IQuizRuntime {
    getDefinition(): CanonicalQuizDefinition;
    getStep(id: string): CanonicalQuizStep | undefined;
    listSteps(): CanonicalQuizStep[];
    getStepOrder(): string[];
    getCountedStepIds(): string[];
    computeScores(responses: Record<string, string[]>): ScoringResult;
    resolveOffer(matchValue: string): OfferVariant | undefined;
}

export type QuizEvent =
    | { type: 'quiz.step.viewed'; stepId: string; ts: number }
    | { type: 'quiz.step.answered'; stepId: string; answers: string[]; ts: number }
    | { type: 'quiz.progress.updated'; current: number; total: number; ts: number }
    | { type: 'quiz.result.computed'; dominantStyle: string; scores: Record<string, number>; ts: number }
    | { type: 'quiz.offer.shown'; matchValue: string; ts: number }
    | { type: 'quiz.definition.reload'; hash: string; ts: number }
    | { type: 'editor.step.modified'; stepId: string; field: string; ts: number }
    | { type: 'version.snapshot.created'; snapshotId: string; ts: number }
    | { type: 'version.published'; version: string; ts: number };

export interface IEventBus {
    publish<T extends QuizEvent>(event: T): void;
    subscribe<T extends QuizEvent['type']>(type: T, handler: (e: Extract<QuizEvent, { type: T }>) => void): () => void;
}

export interface IAnalyticsSink {
    track(event: QuizEvent): Promise<void> | void;
    flush?(): Promise<void>;
}

export interface VersionSnapshot { id: string; createdAt: number; hash: string; label?: string; stepCount: number }
export interface PublishedVersion { id: string; version: string; hash: string; publishedAt: number }
export interface VersionDiff { added: string[]; removed: string[]; modified: string[] }

export interface IVersioningService {
    createSnapshot(label?: string, meta?: Record<string, any>): Promise<VersionSnapshot>;
    listSnapshots(): Promise<VersionSnapshot[]>;
    getSnapshot(id: string): Promise<VersionSnapshot | undefined>;
    publish(snapshotId: string): Promise<PublishedVersion>;
    diff(aId: string, bId: string): Promise<VersionDiff>;
    rollback(versionId: string): Promise<boolean>;
}

export interface ValidationError { stepId: string; field: string; message: string }
export interface ValidationReport { errors: ValidationError[]; warnings: string[] }

export interface UseQuizState {
    currentStepId: string;
    step: CanonicalQuizStep;
    progress: { current: number; total: number; percent: number };
    answers: Record<string, string[]>;
    selectOptions(stepId: string, optionIds: string[]): void;
    next(): void;
    prev(): void;
    result?: ScoringResult;
    offer?: OfferVariant;
}

export interface UseQuizEditingState {
    selectedStepId?: string;
    selectStep(id: string): void;
    updateStep(id: string, patch: Partial<CanonicalQuizStep>): void;
    validate(): ValidationReport;
    saveDraft(): Promise<void>;
}

// Placeholder para expor (futuro) o schema Zod se necessário para edição dinâmica.
export interface IQuizSchemaRegistry {
    getCanonicalSchema(): ZodTypeAny;
}
