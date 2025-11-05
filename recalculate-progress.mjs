#!/usr/bin/env node
/**
 * 🔄 AUTO-UPDATE: Progresso Dinâmico
 * Recalcula automaticamente progressValue baseado na ordem dos steps
 * Útil após reordenamento ou adição/remoção de steps
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUIZ_FILE = path.join(__dirname, 'public/templates/quiz21-complete.json');
const STEPS_DIR = path.join(__dirname, 'public/templates');

console.log('\n🔄 AUTO-UPDATE: Recalculando Progresso\n');
console.log('═'.repeat(80));

// Funções de cálculo de progresso
function calculateProgressValue(currentStepIndex, totalSteps) {
    if (totalSteps <= 0) return 0;
    if (currentStepIndex <= 0) return 0;
    if (currentStepIndex > totalSteps) return 100;
    return Math.round((currentStepIndex / totalSteps) * 100);
}

function updateProgressInBlocks(blocks, currentStepIndex, totalSteps) {
    if (!Array.isArray(blocks)) return blocks;
    
    const progressValue = calculateProgressValue(currentStepIndex, totalSteps);
    
    return blocks.map(block => {
        if (block.type === 'quiz-intro-header') {
            return {
                ...block,
                properties: {
                    ...block.properties,
                    progressValue,
                    progressMax: 100,
                    showProgress: true
                }
            };
        }
        return block;
    });
}

// Ler arquivo principal
console.log('📖 Lendo quiz21-complete.json...\n');
const quizData = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf-8'));

// Obter lista ordenada de steps
const stepKeys = Object.keys(quizData.steps).sort();
const totalSteps = stepKeys.length;

console.log(`📊 Total de steps encontrados: ${totalSteps}\n`);
console.log('🔍 Analisando e atualizando progresso...\n');

let stepsUpdated = 0;
let blocksUpdated = 0;

// Tabela de progresso
console.log('┌────────────┬──────────────┬──────────────┬────────┐');
console.log('│ Step       │ Antes        │ Depois       │ Status │');
console.log('├────────────┼──────────────┼──────────────┼────────┤');

stepKeys.forEach((stepKey, index) => {
    const stepIndex = index + 1;
    const expectedProgress = calculateProgressValue(stepIndex, totalSteps);
    
    const stepData = quizData.steps[stepKey];
    
    if (!stepData.blocks || !Array.isArray(stepData.blocks)) {
        console.log(`│ ${stepKey.padEnd(10)} │ N/A          │ N/A          │   ⚠️   │`);
        return;
    }
    
    // Encontrar bloco quiz-intro-header
    const headerBlock = stepData.blocks.find(b => b.type === 'quiz-intro-header');
    
    if (!headerBlock) {
        console.log(`│ ${stepKey.padEnd(10)} │ No header    │ No header    │   -    │`);
        return;
    }
    
    const beforeProgress = headerBlock.properties?.progressValue ?? 0;
    
    // Atualizar blocos
    stepData.blocks = updateProgressInBlocks(stepData.blocks, stepIndex, totalSteps);
    
    const afterProgress = expectedProgress;
    const changed = beforeProgress !== afterProgress;
    
    if (changed) {
        stepsUpdated++;
        blocksUpdated++;
    }
    
    const status = changed ? '✅ UPD' : '✓ OK';
    const beforeStr = String(beforeProgress).padStart(3) + '%';
    const afterStr = String(afterProgress).padStart(3) + '%';
    
    console.log(`│ ${stepKey.padEnd(10)} │ ${beforeStr.padEnd(12)} │ ${afterStr.padEnd(12)} │ ${status.padEnd(6)} │`);
});

console.log('└────────────┴──────────────┴──────────────┴────────┘');
console.log('');

// Atualizar metadata
quizData.metadata.updatedAt = new Date().toISOString();
quizData.metadata.progressRecalculated = true;
quizData.metadata.progressRecalculatedAt = new Date().toISOString();

// Salvar arquivo principal
console.log('💾 Salvando quiz21-complete.json...');
fs.writeFileSync(QUIZ_FILE, JSON.stringify(quizData, null, 2), 'utf-8');
console.log('   ✅ Arquivo principal atualizado\n');

// Gerar steps individuais atualizados
console.log('📦 Atualizando steps individuais...\n');

let filesGenerated = 0;
stepKeys.forEach((stepKey, index) => {
    const stepIndex = index + 1;
    const stepNumber = stepKey.replace('step-', '');
    const filename = `step-${stepNumber}-v3.json`;
    const filepath = path.join(STEPS_DIR, filename);
    
    const stepData = quizData.steps[stepKey];
    
    const individualStep = {
        templateVersion: stepData.templateVersion || "3.0",
        metadata: {
            ...stepData.metadata,
            updatedAt: new Date().toISOString(),
            progressRecalculated: true
        },
        theme: stepData.theme || quizData.theme,
        validation: stepData.validation,
        behavior: stepData.behavior,
        type: stepData.type,
        redirectPath: stepData.redirectPath,
        navigation: stepData.navigation,
        blocks: stepData.blocks
    };
    
    fs.writeFileSync(filepath, JSON.stringify(individualStep, null, 2), 'utf-8');
    filesGenerated++;
    
    const headerBlock = stepData.blocks?.find(b => b.type === 'quiz-intro-header');
    const progress = headerBlock?.properties?.progressValue ?? 'N/A';
    console.log(`   ✅ ${filename} (${progress}%)`);
});

// Resumo final
console.log('\n');
console.log('═'.repeat(80));
console.log('\n📊 RESUMO\n');
console.log(`Steps processados:       ${totalSteps}`);
console.log(`Steps atualizados:       ${stepsUpdated}`);
console.log(`Blocos atualizados:      ${blocksUpdated}`);
console.log(`Arquivos gerados:        ${filesGenerated}`);
console.log('');

if (stepsUpdated > 0) {
    console.log('✅ PROGRESSO RECALCULADO COM SUCESSO!');
    console.log('');
    console.log('📝 O que foi feito:');
    console.log('   - progressValue atualizado automaticamente');
    console.log(`   - Cálculo: (stepIndex / ${totalSteps}) * 100`);
    console.log('   - Ordem alfabética preservada (step-01, step-02, ...)');
    console.log('   - Ajuste automático se steps forem reordenados');
} else {
    console.log('✅ TODOS OS VALORES JÁ ESTÃO CORRETOS!');
    console.log('');
    console.log('📝 Nenhuma alteração necessária.');
}

console.log('');
console.log('💡 DICA: Execute este script sempre que:');
console.log('   - Adicionar novos steps');
console.log('   - Remover steps');
console.log('   - Reordenar steps');
console.log('   - Renumerar steps');
console.log('');
console.log('═'.repeat(80));
console.log('\n');
