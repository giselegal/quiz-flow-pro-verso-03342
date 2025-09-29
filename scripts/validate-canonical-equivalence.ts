import { readFileSync } from 'fs';
import path from 'path';

// Carrega legacy
import { QUIZ_STEPS } from '../src/data/quizSteps';
// Carrega canonical (compilado via ts/esbuild - usando import json com tsconfig lib apropriada)
import canonical from '../src/domain/quiz/quiz-definition.json';

interface Issue { level: 'ERROR' | 'WARN'; message: string; }
const issues: Issue[] = [];

function error(msg: string) { issues.push({ level: 'ERROR', message: msg }); }
function warn(msg: string) { issues.push({ level: 'WARN', message: msg }); }

// 1. IDs
const legacyIds = Object.keys(QUIZ_STEPS).sort();
const canonicalIds = (canonical.steps as any[]).map(s => s.id).sort();

if (legacyIds.length !== canonicalIds.length) {
    error(`Quantidade de steps difere legacy=${legacyIds.length} canonical=${canonicalIds.length}`);
}

const diffLegacy = legacyIds.filter(id => !canonicalIds.includes(id));
const diffCanonical = canonicalIds.filter(id => !legacyIds.includes(id));
if (diffLegacy.length) error('IDs presentes no legacy e ausentes no canonical: ' + diffLegacy.join(', '));
if (diffCanonical.length) error('IDs presentes no canonical e ausentes no legacy: ' + diffCanonical.join(', '));

// 2. Tipo, questionText e requiredSelections (quando aplicável)
legacyIds.forEach(id => {
    const legacy = (QUIZ_STEPS as any)[id];
    const canon = (canonical.steps as any[]).find(s => s.id === id);
    if (!canon) return; // já reportado

    if (legacy.type !== canon.type) {
        error(`Type mismatch ${id}: legacy=${legacy.type} canonical=${canon.type}`);
    }

    if (legacy.questionText && legacy.questionText !== canon.questionText) {
        error(`questionText mismatch ${id}`);
    }

    if (legacy.requiredSelections && legacy.requiredSelections !== canon.requiredSelections) {
        error(`requiredSelections mismatch ${id}`);
    }
});

// 3. Opções (para questions e strategic-question)
legacyIds.forEach(id => {
    const legacy = (QUIZ_STEPS as any)[id];
    if (!['question', 'strategic-question'].includes(legacy.type)) return;
    const canon = (canonical.steps as any[]).find(s => s.id === id);
    if (!canon) return;
    const legacyOpts = (legacy.options || []).map((o: any) => o.id).sort();
    const canonOpts = (canon.options || []).map((o: any) => o.id).sort();
    if (legacyOpts.join('|') !== canonOpts.join('|')) {
        error(`options id set mismatch ${id}`);
    }
});

// 4. Oferta: validar variantes
const legacyOffer = (QUIZ_STEPS as any)['step-21'];
const canonicalOffer = (canonical.steps as any[]).find(s => s.id === 'step-21');
if (legacyOffer && canonicalOffer) {
    const legacyKeys = Object.keys(legacyOffer.offerMap || {}).sort();
    const canonKeys = (canonicalOffer.variants || []).map((v: any) => v.matchValue).sort();
    if (legacyKeys.join('|') !== canonKeys.join('|')) {
        error('Offer variants mismatch');
    }
}

// 5. Progresso: countedStepIds deve conter todas as questions + strategic-question exceto intro/transitions/result/offer
const expectedProgress = legacyIds.filter(id => {
    const t = (QUIZ_STEPS as any)[id].type;
    return t === 'question' || t === 'strategic-question';
});
const canonicalProgress = (canonical.progress.countedStepIds as string[]).slice().sort();
if (expectedProgress.sort().join('|') !== canonicalProgress.join('|')) {
    warn('Progress countedStepIds difere do esperado (pode ser intencional)');
}

// Output
if (!issues.length) {
    console.log('✅ Equivalência canonical vs legacy: OK (sem divergências críticas)');
    process.exit(0);
} else {
    issues.forEach(i => console[i.level === 'ERROR' ? 'error' : 'warn'](`${i.level}: ${i.message}`));
    const hasErrors = issues.some(i => i.level === 'ERROR');
    process.exit(hasErrors ? 1 : 0);
}
