#!/usr/bin/env ts-node
/**
 * Smoke test simples para validar fluxo de edição do quiz.
 * - Carrega estado
 * - Altera título de step-2
 * - Salva
 * - Recarrega gerador dinâmico e imprime diff de hash
 */

import { quizEditingService } from '../src/domain/quiz/QuizEditingService.ts';
import DynamicMasterJSONGenerator from '../src/services/DynamicMasterJSONGenerator.ts';

async function run() {
    const before = quizEditingService.getState();
    const originalTitle = before.steps.find(s => s.id === 'step-2')?.title;
    console.log('Hash original:', before.hash, 'Título step-2:', originalTitle);

    quizEditingService.updateStep('step-2', { title: 'Nova Pergunta 2 (Smoke)' });
    quizEditingService.save();

    const after = quizEditingService.getState();
    console.log('Hash após edição:', after.hash, 'Novo título:', after.steps.find(s => s.id === 'step-2')?.title);

    const generator = DynamicMasterJSONGenerator.getInstance();
    const master = await generator.generateMasterJSON();
    console.log('Master JSON step-2 name:', master.steps['step-2'].metadata.name);

    if (master.steps['step-2'].metadata.name?.includes('Nova Pergunta')) {
        console.log('✅ Smoke test OK');
    } else {
        console.error('❌ Smoke test falhou: metadata não refletiu override');
        process.exit(1);
    }
}

run().catch(err => { console.error(err); process.exit(1); });
