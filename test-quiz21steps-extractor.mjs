// test-quiz21steps-extractor.mjs
// 🔍 Teste do extrator real de dados do quiz21StepsComplete

import Quiz21StepsDataExtractor from './src/utils/Quiz21StepsDataExtractor.js';

console.log('🔍 TESTE: Quiz21StepsDataExtractor - Dados Reais');
console.log('='.repeat(70));

try {
    // 1. Debug da estrutura completa
    console.log('\n1. DEBUG DA ESTRUTURA EXTRAÍDA:');
    console.log('-'.repeat(50));
    Quiz21StepsDataExtractor.debugExtractedData();

    // 2. Teste de questões específicas
    console.log('\n2. TESTE DE QUESTÕES ESPECÍFICAS:');
    console.log('-'.repeat(50));

    ['q1', 'q2', 'q5', 'q10', 'intro'].forEach(qId => {
        const questionData = Quiz21StepsDataExtractor.getQuestionData(qId);
        const scoreMapping = Quiz21StepsDataExtractor.getScoreMapping(qId);

        console.log(`\n${qId}:`);
        if (questionData) {
            console.log(`  ✅ Questão encontrada: ${questionData.options.length} opções`);
            console.log(`  📍 Step: ${questionData.stepNumber}`);
            console.log(`  🎯 Seleções: ${questionData.minSelections}-${questionData.maxSelections}`);
        } else {
            console.log(`  ❌ Questão não encontrada`);
        }

        if (scoreMapping && Object.keys(scoreMapping).length > 0) {
            console.log(`  🏆 Mapeamento: ${Object.keys(scoreMapping).length} opções pontuáveis`);
            // Mostrar primeiras 3 para não poluir
            Object.entries(scoreMapping).slice(0, 3).forEach(([optId, data]) => {
                console.log(`     ${optId} → ${data.style} (${data.points}pts)`);
            });
        } else {
            console.log(`  ⚠️ Sem mapeamento de pontuação`);
        }
    });

    // 3. Teste de cálculo com respostas simuladas
    console.log('\n3. TESTE DE CÁLCULO COM RESPOSTAS SIMULADAS:');
    console.log('-'.repeat(50));

    const testScenarios = [
        {
            name: 'Cenário Natural/Clássico',
            answers: [
                { questionId: 'q1', selectedOptions: ['natural_q1', 'classico_q1'] },
                { questionId: 'q2', selectedOptions: ['natural_q2', 'classico_q2'] }
            ]
        },
        {
            name: 'Cenário Romântico/Sexy',
            answers: [
                { questionId: 'q1', selectedOptions: ['romantico_q1', 'sexy_q1'] },
                { questionId: 'q2', selectedOptions: ['romantico_q2', 'sexy_q2', 'elegante_q2'] }
            ]
        }
    ];

    testScenarios.forEach(scenario => {
        console.log(`\n📊 ${scenario.name}:`);
        let totalStylePoints = {};

        scenario.answers.forEach(answer => {
            const points = Quiz21StepsDataExtractor.calculateStylePointsFromAnswer(
                answer.questionId,
                answer.selectedOptions
            );

            console.log(`  ${answer.questionId}: ${JSON.stringify(points)}`);

            // Acumular pontos
            Object.entries(points).forEach(([style, pts]) => {
                totalStylePoints[style] = (totalStylePoints[style] || 0) + pts;
            });
        });

        console.log(`  🏆 Total acumulado:`, totalStylePoints);

        // Determinar vencedor
        const winner = Object.entries(totalStylePoints)
            .sort(([, a], [, b]) => b - a)[0];
        if (winner) {
            console.log(`  🥇 Estilo vencedor: ${winner[0]} (${winner[1]} pontos)`);
        }
    });

    // 4. Estatísticas gerais
    console.log('\n4. ESTATÍSTICAS GERAIS:');
    console.log('-'.repeat(50));

    const allData = Quiz21StepsDataExtractor.extractQuizData();
    console.log(`📊 Total de questões extraídas: ${allData.questions.length}`);
    console.log(`🎯 Total de mapeamentos: ${Object.keys(allData.scoreMapping).length}`);
    console.log(`📍 Range de steps: ${Object.keys(allData.stepMapping).join(', ')}`);

    const allStyles = Quiz21StepsDataExtractor.getAvailableStyles();
    console.log(`🎨 Estilos disponíveis: ${allStyles.join(', ')}`);

} catch (error) {
    console.error('❌ ERRO no teste:', error.message);
    console.error(error.stack);
}

console.log('\n✅ TESTE DO EXTRATOR CONCLUÍDO!');
console.log('='.repeat(70));