/**
 * 🧪 TESTE SIMPLES: Verificar se funnel_ID é tratado como canvas vazio
 */

// Simular a função normalizeFunnelId
const normalizeFunnelId = (funnelId) => {
    if (!funnelId || typeof funnelId !== 'string') {
        return {
            baseId: 'default-funnel',
            originalId: funnelId || 'default-funnel',
            isTemplate: false
        };
    }

    const originalId = funnelId;

    // Se é template com prefixo
    if (funnelId.startsWith('template-')) {
        return {
            baseId: funnelId.replace('template-', ''),
            originalId,
            isTemplate: true,
            templateId: funnelId.replace('template-', '')
        };
    }

    let baseId = funnelId;

    // 🔧 CORREÇÃO: Tratar IDs com padrão "funnel_timestamp_suffix"
    if (funnelId.match(/^funnel_\d+_[a-zA-Z0-9]+$/)) {
        console.log('🔍 ID genérico detectado, retornando empty-canvas:', funnelId);
        return {
            baseId: 'empty-canvas',
            originalId,
            isTemplate: false
        };
    }

    // Remove timestamp pattern
    baseId = baseId.replace(/-\d{13,}_[a-zA-Z0-9]+$/, '');
    baseId = baseId.replace(/-\d{13,}$/, '');
    baseId = baseId.replace(/_\d{13,}_[a-zA-Z0-9]+$/, '');
    baseId = baseId.replace(/_\d{13,}$/, '');

    if (baseId.length < 3) {
        baseId = originalId;
    }

    return {
        baseId,
        originalId,
        isTemplate: false
    };
};

// TESTES
console.log('🧪 TESTANDO NORMALIZADOR');
console.log('========================');

const testCases = [
    'funnel_1759089203449_5mx9ze724',
    'quiz21StepsComplete',
    'quiz-cores-perfeitas-1758512392351_o1cke0',
    '',
    null
];

testCases.forEach(testId => {
    const result = normalizeFunnelId(testId);
    console.log(`✅ '${testId}' → '${result.baseId}'`);

    if (testId === 'funnel_1759089203449_5mx9ze724') {
        if (result.baseId === 'empty-canvas') {
            console.log('🎉 SUCESSO: ID problemático será tratado como canvas vazio!');
        } else {
            console.log('❌ FALHA: ID problemático não foi normalizado corretamente');
        }
    }
});

console.log('\n📋 RESUMO:');
console.log('- IDs "funnel_*" devem retornar baseId "empty-canvas"');
console.log('- Isso ativará o canvas vazio em vez do erro de template');
console.log('- O erro "⚠️ Erro no Template" deve desaparecer');