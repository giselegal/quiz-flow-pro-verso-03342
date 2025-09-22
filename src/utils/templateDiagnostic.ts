// Script de teste para diagnosticar o carregamento do template
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../templates/quiz21StepsComplete';

console.log('🔧 [DIAGNOSTIC] Testando carregamento do template...');

// Verificar se o template existe
if (QUIZ_STYLE_21_STEPS_TEMPLATE) {
    console.log('✅ [DIAGNOSTIC] Template carregado com sucesso!');
    console.log('📊 [DIAGNOSTIC] Número de etapas:', Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length);

    // Verificar primeira etapa
    const firstStep = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE)[0];
    if (firstStep) {
        const firstStepBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[firstStep];
        console.log('🎯 [DIAGNOSTIC] Primeira etapa:', firstStep);
        console.log('🧩 [DIAGNOSTIC] Blocos na primeira etapa:', firstStepBlocks?.length || 0);

        if (firstStepBlocks && firstStepBlocks.length > 0) {
            console.log('📝 [DIAGNOSTIC] Primeiro bloco:', {
                id: firstStepBlocks[0]?.id,
                type: firstStepBlocks[0]?.type,
                hasContent: !!firstStepBlocks[0]?.content
            });
        }
    }

    // Verificar se todas as etapas têm blocos
    let emptySteps = 0;
    let totalBlocks = 0;

    Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepKey, blocks]) => {
        if (!blocks || blocks.length === 0) {
            emptySteps++;
            console.log(`⚠️ [DIAGNOSTIC] Etapa vazia encontrada: ${stepKey}`);
        } else {
            totalBlocks += blocks.length;
        }
    });

    console.log(`📈 [DIAGNOSTIC] Estatísticas:`, {
        totalSteps: Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length,
        emptySteps,
        totalBlocks,
        averageBlocksPerStep: totalBlocks / Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length
    });

} else {
    console.error('❌ [DIAGNOSTIC] Template não carregado! Verifique imports.');
    console.log('🔍 [DIAGNOSTIC] Valor do template:', QUIZ_STYLE_21_STEPS_TEMPLATE);
}

// Testar se o módulo está acessível globalmente
if (typeof window !== 'undefined') {
    (window as any).__DIAGNOSTIC_TEMPLATE__ = QUIZ_STYLE_21_STEPS_TEMPLATE;
    console.log('🌍 [DIAGNOSTIC] Template disponível em window.__DIAGNOSTIC_TEMPLATE__');
}

export default function runTemplateDiagnostic() {
    return {
        templateLoaded: !!QUIZ_STYLE_21_STEPS_TEMPLATE,
        stepCount: Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE || {}).length,
        template: QUIZ_STYLE_21_STEPS_TEMPLATE
    };
}