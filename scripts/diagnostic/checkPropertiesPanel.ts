/*
 * Diagnóstico: valida resolução de propriedades usando completeBlockSchemas + fallback
 * Evita dependências com aliases do tsconfig.
 */
import { completeBlockSchemas, generateFallbackSchema } from '../../src/config/expandedBlockSchemas';

type Case = { type: string; label?: string };

const cases: Case[] = [
    { type: 'options-grid' },
    { type: 'quiz-intro-header' },
    { type: 'image-inline' },
    { type: 'button-inline' },
    { type: 'unknown-block-xyz', label: 'fallback generator' },
];

function preview(type: string) {
    const schema = (completeBlockSchemas as any)[type];
    const effective = schema ?? generateFallbackSchema(type);
    const fields = effective?.fields ?? [];
    const keys = fields.slice(0, 8).map((f: any) => f.key);
    return { count: fields.length, sample: keys, from: schema ? 'complete' : 'fallback' };
}

function run() {
    console.log('=== Properties Panel Diagnostic ===');
    for (const c of cases) {
        const r = preview(c.type);
        console.log(`• ${c.type}${c.label ? ` (${c.label})` : ''}:`, r.count, 'props, from:', r.from, 'sample:', r.sample);
    }
}

run();
