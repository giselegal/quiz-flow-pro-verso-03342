#!/usr/bin/env ts-node
/**
 * Script de comparação entre fonte legacy (quizSteps.ts) e definição canonical (quiz-definition.json).
 * Saída: diferenças em IDs, tipos, contagem de opções e ofertas.
 */
import { readFileSync } from 'fs';
import path from 'path';

// Import dinâmico do legacy
import { QUIZ_STEPS } from '../src/data/quizSteps';
import canonical from '../src/domain/quiz/quiz-definition.json';

type LegacyStep = any;

interface DiffIssue {
    severity: 'error' | 'warn';
    code: string;
    message: string;
    context?: any;
}

const issues: DiffIssue[] = [];

function main() {
    const legacyIds = Object.keys(QUIZ_STEPS);
    const canonicalIds = canonical.steps.map(s => s.id);

    // 1. IDs presentes
    legacyIds.forEach(id => {
        if (!canonicalIds.includes(id)) {
            issues.push({ severity: 'error', code: 'MISSING_ID_CANON', message: `ID ${id} existe no legacy mas não no canonical` });
        }
    });
    canonicalIds.forEach(id => {
        if (!legacyIds.includes(id)) {
            issues.push({ severity: 'error', code: 'MISSING_ID_LEGACY', message: `ID ${id} existe no canonical mas não no legacy` });
        }
    });

    // 2. Tipos e estrutura
    legacyIds.forEach(id => {
        const legacy = (QUIZ_STEPS as Record<string, LegacyStep>)[id];
        const canon = canonical.steps.find(s => s.id === id);
        if (!canon) return;
        if (legacy.type !== canon.type) {
            issues.push({ severity: 'error', code: 'TYPE_MISMATCH', message: `Tipo divergente em ${id}: legacy=${legacy.type} canonical=${canon.type}` });
        }
        // Para question comparar número de opções
        if (legacy.type === 'question') {
            const legacyCount = legacy.options?.length || 0;
            const canonCount = (canon as any).options?.length || 0;
            if (legacyCount !== canonCount) {
                issues.push({ severity: 'error', code: 'OPTION_COUNT', message: `Contagem de options difere em ${id}: legacy=${legacyCount} canonical=${canonCount}` });
            }
        }
    });

    // 3. Oferta (step-21) comparação de variantes
    const legacyOffer = (QUIZ_STEPS as any)['step-21'];
    const canonOffer = canonical.steps.find(s => s.id === 'step-21');
    if (legacyOffer && canonOffer) {
        const legacyOfferKeys = Object.keys(legacyOffer.offerMap || {});
        const canonOfferKeys = (canonOffer as any).variants?.map((v: any) => v.matchValue) || [];
        legacyOfferKeys.forEach(k => {
            if (!canonOfferKeys.includes(k)) {
                issues.push({ severity: 'error', code: 'OFFER_VARIANT_MISSING_CANON', message: `Oferta '${k}' presente no legacy não encontrada no canonical` });
            }
        });
        canonOfferKeys.forEach((k: string) => {
            if (!legacyOfferKeys.includes(k)) {
                issues.push({ severity: 'warn', code: 'OFFER_VARIANT_EXTRA_CANON', message: `Oferta '${k}' presente no canonical não encontrada no legacy (talvez novo conteúdo)` });
            }
        });
    }

    // 4. Resumo
    const errors = issues.filter(i => i.severity === 'error');
    const warns = issues.filter(i => i.severity === 'warn');

    console.log('=== QUIZ CANONICAL COMPARISON REPORT ===');
    console.log('Legacy steps:', legacyIds.length, 'Canonical steps:', canonicalIds.length);
    console.log('Issues total:', issues.length, 'Errors:', errors.length, 'Warnings:', warns.length);
    issues.forEach(i => console.log(`[${i.severity.toUpperCase()}] ${i.code}: ${i.message}`));

    if (!issues.length) {
        console.log('✅ Canonical e legacy alinhados');
    } else {
        if (!errors.length) {
            console.log('⚠️ Apenas avisos (sem erros bloqueantes)');
        } else {
            console.log('❌ Diferenças críticas detectadas');
            process.exitCode = 1;
        }
    }
}

main();
