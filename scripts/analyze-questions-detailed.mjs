#!/usr/bin/env node
import fs from 'fs';

const json = JSON.parse(fs.readFileSync('public/templates/quiz21-complete.json', 'utf-8'));

console.log('🔍 ANÁLISE DETALHADA DE QUESTÕES E OPÇÕES\n');
console.log('='.repeat(70));

const problemas = [];

for (let i = 2; i <= 11; i++) {
    const stepNum = i.toString().padStart(2, '0');
    const stepKey = `step-${stepNum}`;
    const step = json.steps[stepKey];

    if (!step) {
        console.log(`\n❌ Step ${stepNum}: NÃO ENCONTRADO`);
        problemas.push(`Step ${stepNum}: Step não encontrado no JSON`);
        continue;
    }

    console.log(`\n📋 STEP ${stepNum}: ${step.metadata?.name || 'Sem nome'}`);
    console.log('-'.repeat(70));

    // Procurar seção question-hero
    const questionSection = step.sections?.find(s => s.type === 'question-hero');

    if (!questionSection) {
        console.log('❌ PROBLEMA: Seção question-hero não encontrada!');
        problemas.push(`Step ${stepNum}: Falta seção question-hero`);
        continue;
    }

    const question = questionSection.content?.questionText || questionSection.content?.question || '';
    if (!question || question === '') {
        console.log('❌ PROBLEMA: Pergunta vazia ou sem texto!');
        problemas.push(`Step ${stepNum}: Pergunta vazia`);
    } else {
        const preview = question.substring(0, 80);
        console.log(`✅ Pergunta: "${preview}${question.length > 80 ? '...' : ''}"`);
    }

    // Procurar seção options-grid
    const optionsSection = step.sections?.find(s => s.type === 'options-grid');

    if (!optionsSection) {
        console.log('❌ PROBLEMA: Seção options-grid não encontrada!');
        problemas.push(`Step ${stepNum}: Falta seção options-grid`);
        continue;
    }

    const options = optionsSection.content?.options || [];
    console.log(`\n   Total de opções: ${options.length}`);

    if (options.length === 0) {
        console.log('   ❌ PROBLEMA CRÍTICO: Nenhuma opção definida!');
        problemas.push(`Step ${stepNum}: Zero opções`);
    } else if (options.length < 3) {
        console.log(`   ⚠️  ALERTA: Apenas ${options.length} opções (recomendado: 3-4)`);
        problemas.push(`Step ${stepNum}: Apenas ${options.length} opções`);
    }

    let optionsComProblema = 0;

    options.forEach((opt, idx) => {
        const text = opt.text || opt.label || '';
        const value = opt.value || opt.id || '';

        // Detectar problemas
        const semTexto = !text || text === '';
        const textoGenerico = text.toLowerCase().includes('opção') ||
            text.toLowerCase().includes('option') ||
            text.toLowerCase() === 'texto da opção' ||
            text.toLowerCase() === 'text';
        const semValor = !value || value === '';

        const temProblema = semTexto || textoGenerico || semValor;

        if (temProblema) {
            optionsComProblema++;
            const problemaDesc = [];
            if (semTexto) problemaDesc.push('SEM TEXTO');
            if (textoGenerico) problemaDesc.push('GENÉRICO');
            if (semValor) problemaDesc.push('SEM VALOR');

            console.log(`   ❌ [${idx + 1}] "${text || '(vazio)'}" → ${problemaDesc.join(', ')}`);
        } else {
            const preview = text.substring(0, 45);
            console.log(`   ✅ [${idx + 1}] "${preview}${text.length > 45 ? '...' : ''}" (${value})`);
        }
    });

    if (optionsComProblema > 0) {
        problemas.push(`Step ${stepNum}: ${optionsComProblema}/${options.length} opções com problemas`);
    }
}

console.log('\n' + '='.repeat(70));
console.log('\n📊 RESUMO DE PROBLEMAS ENCONTRADOS:\n');

if (problemas.length === 0) {
    console.log('✅ Nenhum problema encontrado! Todas as questões estão completas.');
} else {
    console.log(`❌ Total de problemas: ${problemas.length}\n`);
    problemas.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p}`);
    });

    console.log('\n💡 RECOMENDAÇÕES:');
    console.log('   • Adicionar textos reais nas perguntas vazias');
    console.log('   • Completar opções faltantes (mínimo 3-4 por questão)');
    console.log('   • Substituir textos genéricos por conteúdo específico');
    console.log('   • Garantir que todas as opções tenham valores únicos');
}

console.log('\n' + '='.repeat(70));
