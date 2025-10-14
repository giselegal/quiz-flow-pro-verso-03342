/**
 * 🎯 Test de performance de imports - identificar gargalo
 */

console.log('🔍 Testing import performance...\n');

// Test 1: Import básico de QUIZ_STEPS
console.time('⏱️ Import QUIZ_STEPS');
const quizStepsModule = await import('./src/data/quizSteps.ts');
console.timeEnd('⏱️ Import QUIZ_STEPS');

const { QUIZ_STEPS, STEP_ORDER } = quizStepsModule;
console.log(`✅ Loaded ${Object.keys(QUIZ_STEPS).length} steps`);
console.log(`✅ Step order has ${STEP_ORDER.length} items\n`);

// Test 2: Construir blocks enriquecidos
console.time('⏱️ Build enriched blocks');
const enrichedSteps = STEP_ORDER.map((stepId, idx) => {
    const quizStep = QUIZ_STEPS[stepId];

    const blocks = [];
    let order = 0;

    const push = (partial) => {
        blocks.push({
            id: `${stepId}-${partial.type}-${blocks.length + 1}`,
            type: partial.type,
            order: order++,
            parentId: null,
            content: partial.content || {},
            properties: partial.properties || {}
        });
    };

    switch (quizStep.type) {
        case 'intro':
            if (quizStep.title) push({ type: 'heading', content: { text: quizStep.title }, properties: { level: 2, allowHtml: true, textAlign: 'center' } });
            if (quizStep.image) push({ type: 'image', content: { src: quizStep.image, alt: 'Intro' }, properties: { width: '100%', borderRadius: '12px' } });
            if (quizStep.formQuestion) push({ type: 'form-input', content: { label: quizStep.formQuestion, placeholder: quizStep.placeholder || '' }, properties: { required: true } });
            push({ type: 'button', content: { text: quizStep.buttonText || 'Continuar' }, properties: { action: 'next-step' } });
            break;

        case 'question':
            if (quizStep.questionText) push({ type: 'heading', content: { text: quizStep.questionText }, properties: { level: 3, allowHtml: false, textAlign: 'center' } });
            push({ type: 'quiz-options', content: { options: quizStep.options || [] }, properties: { question: quizStep.questionText, questionNumber: quizStep.questionNumber, multiSelect: true, requiredSelections: quizStep.requiredSelections || 1, maxSelections: quizStep.requiredSelections || 3, autoAdvance: true } });
            break;

        case 'strategic-question':
            if (quizStep.questionText) push({ type: 'heading', content: { text: quizStep.questionText }, properties: { level: 3, textAlign: 'center' } });
            push({ type: 'quiz-options', content: { options: quizStep.options || [] }, properties: { question: quizStep.questionText, multiSelect: false, requiredSelections: 1, maxSelections: 1, autoAdvance: true } });
            break;

        case 'transition':
        case 'transition-result':
            if (quizStep.title) push({ type: 'heading', content: { text: quizStep.title }, properties: { level: 2, allowHtml: true, textAlign: 'center' } });
            if (quizStep.text) push({ type: 'text', content: { text: quizStep.text }, properties: { textAlign: 'center' } });
            if (quizStep.showContinueButton) push({ type: 'button', content: { text: quizStep.continueButtonText || 'Continuar' }, properties: { action: 'next-step' } });
            break;

        case 'result':
            push({ type: 'result-header-inline', content: { title: quizStep.title || 'Seu Resultado:' }, properties: {} });
            break;

        case 'offer':
            if (quizStep.image) push({ type: 'image', content: { src: quizStep.image, alt: 'Oferta' }, properties: { width: '100%', borderRadius: '12px' } });
            const firstOffer = quizStep.offerMap ? Object.values(quizStep.offerMap)[0] : null;
            push({ type: 'quiz-offer-cta-inline', content: { title: firstOffer?.title || 'Oferta Especial', description: firstOffer?.description || 'Conteúdo exclusivo liberado', buttonText: firstOffer?.buttonText || 'Quero Aproveitar', offerKey: firstOffer ? Object.keys(quizStep.offerMap)[0] : undefined }, properties: {} });
            break;
    }

    return {
        id: stepId,
        type: quizStep?.type,
        order: idx + 1,
        blocks,
        nextStep: quizStep?.nextStep || (idx < STEP_ORDER.length - 1 ? STEP_ORDER[idx + 1] : undefined),
        meta: quizStep
    };
});

console.timeEnd('⏱️ Build enriched blocks');

// Estatísticas
const totalBlocks = enrichedSteps.reduce((sum, step) => sum + step.blocks.length, 0);
console.log(`✅ Generated ${enrichedSteps.length} enriched steps`);
console.log(`✅ Total blocks: ${totalBlocks}`);
console.log(`✅ Avg blocks per step: ${(totalBlocks / enrichedSteps.length).toFixed(1)}\n`);

// Test 3: JSON serialization
console.time('⏱️ JSON.stringify');
const json = JSON.stringify(enrichedSteps);
console.timeEnd('⏱️ JSON.stringify');
console.log(`✅ JSON size: ${(json.length / 1024).toFixed(2)}KB\n`);

// Test 4: Identificar steps com mais blocos
console.log('📊 Steps com mais blocos:');
const sortedByBlocks = [...enrichedSteps].sort((a, b) => b.blocks.length - a.blocks.length).slice(0, 5);
sortedByBlocks.forEach(step => {
    console.log(`  ${step.id} (${step.type}): ${step.blocks.length} blocks`);
});

console.log('\n✅ All tests completed!');
