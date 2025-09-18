import type { CanonicalQuiz } from '@/types/quizCanonical';
import type { Adapter } from './types';
import { optimizedAdapter } from './optimizedAdapter';
import { makeTemplateAdapter } from './templateAdapter';

export const adapters: Adapter[] = [
    optimizedAdapter,
    makeTemplateAdapter(),
];

export function toCanonicalAny(src: unknown): CanonicalQuiz {
    const ad = adapters.find(a => a.canHandle(src));
    if (!ad) throw new Error('Nenhum adapter compatível para a fonte fornecida.');
    return ad.toCanonical(src as any);
}
