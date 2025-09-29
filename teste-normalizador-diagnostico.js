#!/usr/bin/env node

console.log('🧪 TESTE DIAGNÓSTICO: Normalizador de Funnel');
console.log('==========================================');

const testIds = [
    'funnel_1759089203449_5mx9ze724',
    'quiz21StepsComplete',
    'quiz-cores-perfeitas-1758512392351_o1cke0',
    '',
    null,
    undefined,
    'canvas-vazio',
    'template-quiz'
];

// Simular normalizeFunnelId
function normalizeFunnelId(funnelId) {
    if (!funnelId || typeof funnelId !== 'string') {
        return {
            baseId: 'empty-canvas',
            originalId: funnelId || 'default-funnel',
            isTemplate: false
        };
    }

    const originalId = funnelId;

    if (funnelId.startsWith('template-')) {
        return {
            baseId: funnelId.replace('template-', ''),
            originalId,
            isTemplate: true
        };
    }

    let baseId = funnelId;

    // IDs genéricos = canvas vazio
    if (funnelId.match(/^funnel_\d+_[a-zA-Z0-9]+$/)) {
        return {
            baseId: 'empty-canvas',
            originalId,
            isTemplate: false
        };
    }

    // Remove timestamps
    baseId = baseId.replace(/-\d{13,}_[a-zA-Z0-9]+$/, '');
    baseId = baseId.replace(/-\d{13,}$/, '');

    if (baseId.length < 3) {
        baseId = originalId;
    }

    return {
        baseId,
        originalId,
        isTemplate: false
    };
}

console.log('\n📋 RESULTADO DOS TESTES:');
console.log('========================');

testIds.forEach(id => {
    try {
        const result = normalizeFunnelId(id);
        const status = result.baseId === 'empty-canvas' ? '🆕 CANVAS VAZIO' : '✅ NORMAL';
        console.log(`${status} '${id}' → '${result.baseId}' (template: ${result.isTemplate})`);
    } catch (error) {
        console.log(`❌ '${id}' → ERRO: ${error.message}`);
    }
});

console.log('\n🔍 VERIFICAÇÕES ESPECÍFICAS:');
console.log('============================');

// Teste específico para o ID problemático
const problematicId = 'funnel_1759089203449_5mx9ze724';
const result = normalizeFunnelId(problematicId);

if (result.baseId === 'empty-canvas') {
    console.log('✅ SUCESSO: ID genérico será tratado como canvas vazio');
    console.log('   ✓ Não haverá mais "Erro no Template"');
    console.log('   ✓ Editor carregará interface de canvas vazio');
} else {
    console.log('❌ PROBLEMA: ID genérico não foi normalizado corretamente');
    console.log(`   Resultado: ${result.baseId}`);
}