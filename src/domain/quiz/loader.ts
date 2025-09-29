import { quizDefinitionSchema, QuizDefinition } from './types';
import rawDefinition from './quiz-definition.json';

// Simple hash placeholder (real implementation could use crypto.subtle)
function simpleHash(obj: any): string {
    const json = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0, i, chr;
    for (i = 0; i < json.length; i++) {
        chr = json.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit int
    }
    return ('00000000' + (hash >>> 0).toString(16)).slice(-8);
}

export interface LoadResult {
    definition: QuizDefinition;
    warnings: string[];
}

export function loadQuizDefinition(): LoadResult {
    const cloned: any = JSON.parse(JSON.stringify(rawDefinition));
    const warnings: string[] = [];

    // Placeholder: steps will be injected later (migration phase)
    if (!Array.isArray(cloned.steps) || cloned.steps.length === 0) {
        warnings.push('Quiz definition currently has 0 steps (migration pending)');
    }

    // Compute / replace hash if placeholder
    if (cloned.integrity?.hash === '__PENDING__') {
        const temp = { ...cloned, integrity: undefined };
        const hash = simpleHash(temp);
        cloned.integrity = { hash };
    }

    const parsed = quizDefinitionSchema.safeParse(cloned);
    if (!parsed.success) {
        console.error('❌ Quiz definition validation failed', parsed.error.format());
        throw new Error('Invalid quiz definition');
    }

    const def = parsed.data;

    // Basic integrity cross-checks (when steps arrive)
    if (def.steps.length === 21) {
        // Check chain
        const ids = new Set(def.steps.map(s => s.id));
        def.steps.forEach(step => {
            if (step.next && !ids.has(step.next)) {
                warnings.push(`Step ${step.id} points to missing next ${step.next}`);
            }
        });
    }

    return { definition: def, warnings };
}
