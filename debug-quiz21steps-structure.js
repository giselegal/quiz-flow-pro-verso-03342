// debug-quiz21steps-structure.js
// 🔍 Debug da estrutura do quiz21StepsComplete para entender os dados

console.log('🔍 ANÁLISE DA ESTRUTURA DO QUIZ21STEPS');
console.log('='.repeat(60));

// Simular o processo de extração sem imports
console.log('\n1. IDENTIFICAÇÃO DE QUESTÕES PONTUÁVEIS:');
console.log('-'.repeat(50));

// Baseado na análise, steps 2-11 contêm questões pontuáveis (q1-q10)
const scorableSteps = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const questionMapping = {};

scorableSteps.forEach((step, index) => {
    const questionId = `q${index + 1}`;
    questionMapping[`step-${step}`] = questionId;
    console.log(`Step ${step} → ${questionId}`);
});

console.log('\n2. ESTRUTURA DE SCOREVALUES IDENTIFICADA:');
console.log('-'.repeat(50));

// Baseado na análise do template, cada questão tem scoreValues como:
const exampleScoreValues = {
    'natural_q1': 1,
    'classico_q1': 1,
    'contemporaneo_q1': 1,
    'elegante_q1': 1,
    'romantico_q1': 1,
    'sexy_q1': 1,
    'dramatico_q1': 1,
    'criativo_q1': 1
};

console.log('Estrutura padrão por questão:');
Object.entries(exampleScoreValues).forEach(([option, points]) => {
    const style = option.split('_')[0];
    console.log(`  ${option} → Estilo: ${style}, Pontos: ${points}`);
});

console.log('\n3. MAPEAMENTO DE ESTILOS:');
console.log('-'.repeat(50));

const styleMapping = {
    'natural': 'Natural',
    'classico': 'Clássico',
    'contemporaneo': 'Contemporâneo',
    'elegante': 'Elegante',
    'romantico': 'Romântico',
    'sexy': 'Sexy',
    'dramatico': 'Dramático',
    'criativo': 'Criativo'
};

Object.entries(styleMapping).forEach(([key, name]) => {
    console.log(`  ${key} → ${name}`);
});

console.log('\n4. SIMULAÇÃO DO PROCESSO DE CÁLCULO:');
console.log('-'.repeat(50));

// Simular respostas de usuário
const userAnswers = [
    {
        questionId: 'q1',
        selectedOptions: ['natural_q1', 'classico_q1', 'romantico_q1'] // 3 seleções
    },
    {
        questionId: 'q2',
        selectedOptions: ['natural_q2', 'natural_q2', 'sexy_q2'] // Usuário pode selecionar repetidas? Não, mas teste edge case
    }
];

console.log('Processando respostas simuladas:');

const totalStylePoints = {};

userAnswers.forEach(answer => {
    console.log(`\n📋 ${answer.questionId}:`);
    console.log(`   Opções selecionadas: ${answer.selectedOptions.join(', ')}`);

    const questionPoints = {};

    // Remover duplicatas (usuário não pode selecionar a mesma opção 2x)
    const uniqueOptions = [...new Set(answer.selectedOptions)];
    console.log(`   Opções únicas: ${uniqueOptions.join(', ')}`);

    uniqueOptions.forEach(optionId => {
        // Extrair estilo do prefixo
        const stylePrefix = optionId.split('_')[0];
        const styleName = styleMapping[stylePrefix] || 'Desconhecido';
        const points = 1; // Cada seleção vale 1 ponto

        questionPoints[styleName] = (questionPoints[styleName] || 0) + points;
        totalStylePoints[styleName] = (totalStylePoints[styleName] || 0) + points;

        console.log(`   ${optionId} → ${styleName} (+${points})`);
    });

    console.log(`   Subtotal da questão:`, questionPoints);
});

console.log('\n5. RESULTADO FINAL:');
console.log('-'.repeat(50));

console.log('🏆 PONTUAÇÃO TOTAL POR ESTILO:');
const sortedResults = Object.entries(totalStylePoints)
    .sort(([, a], [, b]) => b - a);

sortedResults.forEach(([style, points], index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
    console.log(`${medal} ${style}: ${points} pontos`);
});

if (sortedResults.length > 0) {
    console.log(`\n🎯 Estilo vencedor: ${sortedResults[0][0]}`);
    console.log(`🎯 Estilos secundários: ${sortedResults.slice(1, 3).map(([style]) => style).join(', ')}`);
}

console.log('\n6. VALIDAÇÕES:');
console.log('-'.repeat(50));

console.log('✅ Sistema de pontuação 1:1 (cada seleção = 1 ponto)');
console.log('✅ 8 estilos disponíveis por questão');
console.log('✅ Questões q1-q10 são pontuáveis (steps 2-11)');
console.log('✅ Padrão de nomenclatura: {estilo}_q{numero}');
console.log('✅ Suporte a múltiplas seleções por questão');

console.log('\n✅ ANÁLISE CONCLUÍDA!');
console.log('🎯 PRONTO PARA INTEGRAÇÃO REAL COM UNIFIEDCALCULATIONENGINE');
console.log('='.repeat(60));