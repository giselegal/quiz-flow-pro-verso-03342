#!/usr/bin/env node
import fs from 'fs';

const json = JSON.parse(fs.readFileSync('public/templates/quiz21-complete.json', 'utf-8'));

console.log('🔍 ANÁLISE DE QUESTÕES E OPÇÕES\n');
console.log('='.repeat(60));

for (let i = 2; i <= 11; i++) {
    const stepNum = i.toString().padStart(2, '0');
    const stepKey = `step-${stepNum}`;
    const step = json.steps[stepKey];

    if (!step) {
        console.log(`\n❌ Step ${stepNum}: NÃO ENCONTRADO`);
        continue;
    }

    console.log(`\n📋 STEP ${stepNum}: ${step.metadata?.name || 'Sem nome'}`);
    console.log('-'.repeat(60));

    // Procurar seção de questão
    const questionSection = step.sections?.find(s =>
        s.type === 'quiz-question' ||
        s.type === 'multiple-choice' ||
        s.type === 'question-options'
    );

    if (!questionSection) {
        console.log('⚠️  Seção de questão não encontrada');
        const allTypes = step.sections?.map(s => s.type).join(', ') || 'nenhuma';
        console.log(`   Tipos encontrados: ${allTypes}`);
        continue;
    }

    const question = questionSection.content?.questionText || questionSection.content?.question || 'SEM TEXTO';
    console.log(`Pergunta: ${question.substring(0, 80)}${question.length > 80 ? '...' : ''}`);

    // Verificar opções
    const options = questionSection.content?.options || [];
    console.log(`\nOpções: ${options.length} encontradas`);

    if (options.length === 0) {
        console.log('❌ PROBLEMA: Nenhuma opção definida!');
    } else if (options.length < 3) {
        console.log(`⚠️  ALERTA: Apenas ${options.length} opções (recomendado: 3-4)`);
    }

    options.forEach((opt, idx) => {
        const text = opt.text || opt.label || 'SEM TEXTO';
        const value = opt.value || 'sem-valor';
        const isGeneric = text.toLowerCase().includes('opção') ||
            text.toLowerCase().includes('option') ||
            text === 'SEM TEXTO';
        const emoji = isGeneric ? '⚠️ ' : '✅';
        const preview = text.substring(0, 50);
        console.log(`  ${emoji} [${idx + 1}] ${preview}${text.length > 50 ? '...' : ''} (valor: ${value})`);
    });
}

console.log('\n' + '='.repeat(60));
console.log('\n📊 RESUMO:');
console.log('✅ = Opção com texto real');
console.log('⚠️  = Opção genérica ou sem texto');
