import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../src/templates/quiz21StepsComplete';

type AnyBlock = {
    id?: string;
    type?: string;
    content?: any;
    properties?: any;
    order?: number;
};

type ExtractedOption = {
    id?: string;
    text?: string;
    imageUrl?: string;
    points?: number;
    category?: string;
    value?: string;
};

type ExtractedQuestion = {
    blockId?: string;
    type?: string;
    order?: number;
    question?: string;
    subtitle?: string;
    description?: string;
    optionsCount?: number;
    options?: ExtractedOption[];
};

type ExtractedStep = {
    stepKey: string;
    questions: ExtractedQuestion[];
};

function getQuestionFromBlock(block: AnyBlock): ExtractedQuestion | null {
    if (!block) return null;
    const type = (block.type || '').toLowerCase();
    // Considerar tipos que representam questões com opções
    const isQuestion = type.includes('options-grid') || type === 'quiz-question' || type === 'quiz-question-inline';
    if (!isQuestion) return null;

    const c = block.content || {};
    const p = block.properties || {};

    // Preferir content.question; fallback para content.title/properties.title
    const question = c.question ?? c.title ?? p.title ?? '';
    const subtitle = c.subtitle ?? p.subtitle ?? '';
    const description = c.description ?? p.description ?? '';

    // Preferir content.options
    const optionsArr: ExtractedOption[] = Array.isArray(c.options)
        ? c.options.map((o: any) => ({
            id: o?.id ?? o?.value,
            text: o?.text ?? o?.label ?? '',
            imageUrl: o?.imageUrl ?? o?.image ?? '',
            points: typeof o?.points === 'number' ? o.points : (typeof o?.score === 'number' ? o.score : undefined),
            category: o?.category,
            value: o?.value,
        }))
        : [];

    return {
        blockId: block.id,
        type: block.type,
        order: typeof block.order === 'number' ? block.order : undefined,
        question,
        subtitle,
        description,
        optionsCount: optionsArr.length,
        options: optionsArr,
    };
}

function extractAll(): ExtractedStep[] {
    const steps: ExtractedStep[] = [];
    const entries = Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE || {});
    for (const [stepKey, blocks] of entries) {
        const list = (blocks as AnyBlock[]) || [];
        const questions = list
            .map(getQuestionFromBlock)
            .filter((q): q is ExtractedQuestion => !!q && (q.question?.trim()?.length || 0) > 0);
        steps.push({ stepKey, questions });
    }
    return steps;
}

const result = extractAll();
const outDir = join(process.cwd(), 'data');
const outFile = join(outDir, 'extracted-questions.json');
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), steps: result }, null, 2), 'utf8');

// Também imprimir um resumo no console para inspeção rápida
const summary = result.map(s => ({ stepKey: s.stepKey, questions: s.questions.map(q => ({ blockId: q.blockId, question: q.question, options: q.optionsCount })) }));
console.log(JSON.stringify(summary, null, 2));
console.log(`\n✅ Extraído: ${result.length} etapas -> ${outFile}`);
