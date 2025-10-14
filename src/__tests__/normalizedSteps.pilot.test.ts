import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Carregar JSON normalized gerado (piloto)
function readNormalized(stepId: string) {
    const p = path.join(process.cwd(), 'public', 'templates', 'normalized', `${stepId}.json`);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// Extrair fragmento legacy diretamente do template TS para comparação mínima
function extractLegacyStep(stepId: string): any | null {
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'quiz21StepsComplete.ts');
    if (!fs.existsSync(templatePath)) return null;
    const source = fs.readFileSync(templatePath, 'utf8');
    const marker = `'${stepId}': {`;
    const startIdx = source.indexOf(marker);
    if (startIdx === -1) return null;
    let i = startIdx + marker.length - 1;
    while (i < source.length && source[i] !== '{') i++;
    if (source[i] !== '{') return null;
    let brace = 1; let j = i + 1;
    while (j < source.length && brace > 0) { const c = source[j]; if (c === '{') brace++; else if (c === '}') brace--; j++; }
    const objText = source.slice(i, j);
    try { return eval('(' + objText + ')'); } catch { return null; }
}

describe('Normalized Steps Pilot', () => {
    it('step-01 normalized shape básico', () => {
        const norm = readNormalized('step-01');
        expect(norm).toBeTruthy();
        expect(norm.id).toBe('step-01');
        expect(norm.templateVersion).toBe('3.0');
        expect(Array.isArray(norm.blocks)).toBe(true);
        expect(norm.blocks.length).toBeGreaterThanOrEqual(1);
        const hero = norm.blocks.find((b: any) => b.type === 'hero-block');
        expect(hero).toBeTruthy();
    });

    it('step-02 parity de quantidade de opções', () => {
        const norm = readNormalized('step-02');
        const legacy = extractLegacyStep('step-02');
        expect(norm).toBeTruthy();
        expect(legacy).toBeTruthy();
        const legacyOptions = (legacy?.options || legacy?.sections?.flatMap((s: any) => s.options || []) || []);
        const questionBlock = norm.blocks.find((b: any) => b.type === 'question-block');
        expect(questionBlock).toBeTruthy();
        expect(questionBlock.config.options.length).toBe(legacyOptions.length);
    });
});
