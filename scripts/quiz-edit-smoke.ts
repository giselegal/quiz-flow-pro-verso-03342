#!/usr/bin/env ts-node
/**
 * Smoke test simples para validar fluxo de edição do quiz.
 * - Carrega estado
 * - Altera título de step-2
 * - Salva
 * - (Opcional) Gera master JSON se ambiente suportar
 */

// Mock mínimo para ambiente Node (antes de qualquer import)
// @ts-ignore
if (typeof global !== 'undefined' && !(global as any).window) {
    // @ts-ignore
    (global as any).window = { addEventListener: () => { }, removeEventListener: () => { }, navigator: { onLine: true } };
    // @ts-ignore
    (global as any).document = { createElement: () => ({ getContext: () => { } }) };
}

import { quizEditingService } from '../src/domain/quiz/QuizEditingService';

async function waitUntilReady(timeoutMs = 2000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const s = quizEditingService.getState();
            if (s) return s;
        } catch { }
        await new Promise(r => setTimeout(r, 50));
    }
    throw new Error('QuizEditingService não inicializou dentro do timeout');
}

async function run() {
    const before = await waitUntilReady();
    const originalTitle = before.steps.find(s => s.id === 'step-2')?.title;
    console.log('Hash original:', before.hash, 'Título step-2:', originalTitle);

    quizEditingService.updateStep('step-2', { title: 'Nova Pergunta 2 (Smoke)' });
    quizEditingService.save();

    const after = quizEditingService.getState();
    console.log('Hash após edição:', after.hash, 'Novo título:', after.steps.find(s => s.id === 'step-2')?.title);

    if (after.hash === before.hash) {
        console.error('❌ Hash não mudou após edição');
        process.exit(1);
    }

    // Gerar master JSON em modo headless para validar refletir override
    try {
        process.env.QUIZ_HEADLESS = '1';
        const mod = await import('../src/services/DynamicMasterJSONGenerator');
        const inst = (mod as any).dynamicMasterJSON || (mod as any).DynamicMasterJSONGenerator?.getInstance?.();
        if (inst?.generateMasterJSON) {
            const master = await inst.generateMasterJSON();
            const name = master.steps['step-2']?.metadata?.name;
            console.log('Master JSON (headless) step-2 name:', name);
            if (!name || !name.includes('Nova Pergunta')) {
                console.error('❌ Headless master JSON não refletiu override');
                process.exit(1);
            } else {
                console.log('✅ Headless master JSON refletiu override');
            }
        }
    } catch (err) {
        console.warn('⚠️ Falha headless master JSON:', (err as any)?.message);
    }

    console.log('✅ Smoke test básico OK');
}

run().catch(err => { console.error(err); process.exit(1); });
