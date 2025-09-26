// Script de debug para identificar problema no quiz /quiz-estilo

console.log('🔍 Iniciando debug do problema no /quiz-estilo');

// Testar imports básicos
try {
    console.log('✅ Testing basic imports...');

    // 1. Verificar se os dados do quiz estão carregando
    import('./src/data/quizSteps.js').then(({ QUIZ_STEPS, STEP_ORDER }) => {
        console.log('✅ QUIZ_STEPS loaded:', Object.keys(QUIZ_STEPS).length, 'steps');
        console.log('✅ STEP_ORDER loaded:', STEP_ORDER?.length, 'steps');

        // Verificar step-1
        if (QUIZ_STEPS['step-1']) {
            console.log('✅ step-1 found:', QUIZ_STEPS['step-1'].type);
        } else {
            console.log('❌ step-1 not found!');
        }
    }).catch(err => {
        console.log('❌ Error loading quizSteps:', err.message);
    });

    // 2. Verificar se os estilos estão carregando
    import('./src/data/styles.js').then(({ styleMapping, STYLE_DEFINITIONS }) => {
        console.log('✅ styleMapping loaded:', Object.keys(styleMapping || {}).length, 'styles');
        console.log('✅ STYLE_DEFINITIONS loaded:', Object.keys(STYLE_DEFINITIONS || {}).length, 'styles');
    }).catch(err => {
        console.log('❌ Error loading styles:', err.message);
    });

} catch (error) {
    console.log('❌ Critical error:', error.message);
}