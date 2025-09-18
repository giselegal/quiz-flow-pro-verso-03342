import type { Adapter, TemplateAdapterConfig } from './types';
import type { CanonicalQuiz, CanonicalQuestion, CanonicalOption } from '@/types/quizCanonical';

type TemplateOption = {
    id: string;
    text?: string;
    label?: string;
    imageUrl?: string;
    src?: string;
};

type TemplateBlock = {
    id?: string;
    type?: string; // 'options-grid'
    title?: string;
    text?: string;
    order?: number;
    content?: {
        question?: string;
        options?: TemplateOption[];
    } & Record<string, unknown>;
    properties?: {
        scoreValues?: Record<string, number>;
        requiredSelections?: number;
        minSelections?: number;
        maxSelections?: number;
    } & Record<string, unknown>;
};

type TemplateRoot = {
    [key: string]: TemplateBlock[] | unknown;
};

function getAllBlocks(root: TemplateRoot): TemplateBlock[] {
    const result: TemplateBlock[] = [];
    for (const v of Object.values(root)) {
        if (Array.isArray(v)) {
            for (const b of v) {
                if (b && typeof b === 'object' && 'type' in b) {
                    result.push(b as TemplateBlock);
                }
            }
        }
    }
    return result;
}

function asText(opt?: { text?: string; label?: string } | undefined): string {
    return (opt?.text ?? opt?.label ?? '').toString();
}

function extractStyleFromOptionId(optionId: string): string | undefined {
    const m = optionId.match(/^([a-zA-Z]+)_q\d+/);
    return m?.[1];
}

function inferKindFromBlock(block: TemplateBlock): 'scored' | 'strategic' {
    return block.properties && (block.properties as any).scoreValues ? 'scored' : 'strategic';
}

function selectionConstraints(block: TemplateBlock) {
    const p = block.properties ?? {};
    if (typeof (p as any).requiredSelections === 'number') return { requiredSelections: (p as any).requiredSelections as number } as const;
    return {
        minSelections: typeof (p as any).minSelections === 'number' ? ((p as any).minSelections as number) : undefined,
        maxSelections: typeof (p as any).maxSelections === 'number' ? ((p as any).maxSelections as number) : undefined,
    } as const;
}

export function makeTemplateAdapter(config: TemplateAdapterConfig = {}): Adapter<TemplateRoot> {
    const { segmentByOptionId = {}, strategicQuestionIds } = config;

    return {
        canHandle(src: unknown): src is TemplateRoot {
            // quiz template é um objeto com chaves 'step-*' cujo valor é array de blocks
            return !!src && typeof src === 'object';
        },

        toCanonical(src: TemplateRoot): CanonicalQuiz {
            const blocks = getAllBlocks(src);
            const questions: CanonicalQuestion[] = [];

            blocks.forEach((block, idx) => {
                if ((block.type ?? '').toLowerCase() !== 'options-grid') return;
                const kindFromBlock = inferKindFromBlock(block);
                const isStrategicById = block.id && strategicQuestionIds?.has(block.id);
                const kind: 'scored' | 'strategic' = isStrategicById ? 'strategic' : kindFromBlock;

                const scoreValues = ((block.properties?.scoreValues ?? {}) as Record<string, number>);
                const opts = (block.content?.options ?? []) as TemplateOption[];

                const options: CanonicalOption[] = opts.map((o, i) => {
                    const style = extractStyleFromOptionId(o.id);
                    const base: CanonicalOption = {
                        id: o.id ?? `opt_${i + 1}`,
                        text: asText(o),
                        imageUrl: (o as any).imageUrl ?? (o as any).src,
                    };
                    if (kind === 'scored' && style) {
                        // scoreValues pode ser { optionId: number } OU { optionId: { estilo: pontos } }
                        const sv = (scoreValues as any)[o.id as string];
                        if (typeof sv === 'number') {
                            base.score = { [style]: sv };
                        } else if (sv && typeof sv === 'object' && typeof sv[style] === 'number') {
                            base.score = { [style]: sv[style] };
                        } else {
                            const ptsByStyle = typeof (scoreValues as any)[style] === 'number' ? (scoreValues as any)[style] : 1;
                            base.score = { [style]: ptsByStyle };
                        }
                    } else if (kind === 'strategic') {
                        base.segment = segmentByOptionId[o.id];
                    }
                    return base;
                });

                questions.push({
                    id: block.id ?? `q${idx + 1}`,
                    title: block.title,
                    text: (block.content as any)?.question ?? block.text ?? block.title ?? '',
                    kind,
                    options,
                    ...selectionConstraints(block),
                });
            });

            return {
                id: 'template_quiz',
                title: 'Template Quiz (21 Steps)',
                questions,
            };
        },
    };
}
