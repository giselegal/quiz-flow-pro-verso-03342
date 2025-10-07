#!/usr/bin/env node
/**
 * 🫧 SMOKE TEST: Fluxo completo 21 etapas (sem render UI)
 * Executa navegação usando lógica aproximada do hook para garantir que ids existem e sequência está consistente.
 */
import { QUIZ_STEPS } from '../src/data/quizSteps.ts';

const order = [
    'step-01',
    'step-02', 'step-03', 'step-04', 'step-05', 'step-06', 'step-07', 'step-08', 'step-09', 'step-10', 'step-11',
    'step-12', 'step-13', 'step-14', 'step-15', 'step-16', 'step-17', 'step-18', 'step-19', 'step-20', 'step-21'
];

let ok = true;
for (const id of order) {
    if (!QUIZ_STEPS[id]) {
        console.error('❌ Missing step in QUIZ_STEPS:', id);
        ok = false;
    }
}

if (!ok) {
    console.error('Fluxo inválido. Abort.');
    process.exit(1);
}

console.log('✅ Todos os steps existem no quizSteps.ts');

// Checar encadeamento nextStep básico para blocos cruciais
const chainChecks = [
    ['step-11', 'step-12'],
    ['step-12', 'step-13'],
    ['step-18', 'step-19'],
    ['step-19', 'step-20']
];

for (const [from, to] of chainChecks) {
    const next = QUIZ_STEPS[from]?.nextStep;
    if (next !== to) {
        console.warn(`⚠️ Encadeamento inesperado: ${from} -> ${next} (esperado ${to})`);
    } else {
        console.log(`🔗 Encadeamento OK: ${from} -> ${to}`);
    }
}

console.log('🫧 Smoke test concluído.');
