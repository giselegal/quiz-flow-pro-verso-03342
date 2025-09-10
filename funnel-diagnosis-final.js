/**
 * 🔍 DIAGNÓSTICO FINAL - SISTEMA DE FUNIS
 * 
 * Script para verificar se o sistema de funis está funcionando
 * corretamente no /editor com isolamento completo por ID.
 */

console.log('🔍 DIAGNÓSTICO FINAL DO SISTEMA DE FUNIS');
console.log('='.repeat(60));

// IDs de teste reportados pelo usuário
const testFunnelIds = [
    'personality-assessment-1757514679394',
    'lead-capture-simple-1757514692752', 
    'com-que-roupa-eu-vou-1757514710892',
    'style-quiz-21-steps-1757514731045'
];

console.log('📊 IDs DE TESTE:', testFunnelIds);

// ============================================================================
// TESTE 1: VERIFICAR STORAGE POR ID
// ============================================================================

console.log('\n🔍 TESTE 1: VERIFICAÇÃO DE STORAGE POR ID');
console.log('-'.repeat(50));

testFunnelIds.forEach((funnelId, index) => {
    // Testar diferentes padrões de chave de storage
    const storageKeys = [
        `unified_funnel:${funnelId}`,
        `contextual-editor-funnel-${funnelId}`,
        `contextual-my-templates-funnel-${funnelId}`,
        `qqcv_funnel_${funnelId}`,
        funnelId // chave direta
    ];

    console.log(`\n📋 ${index + 1}. TESTANDO ${funnelId}:`);
    
    storageKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                console.log(`   ✅ ${key}:`, {
                    id: parsed.id,
                    name: parsed.name || 'Sem nome',
                    blocks: Array.isArray(parsed.blocks) ? parsed.blocks.length : 'N/A'
                });
            } catch (e) {
                console.log(`   ✅ ${key}: [Dados não-JSON]`);
            }
        } else {
            console.log(`   ❌ ${key}: Não encontrado`);
        }
    });
});

// ============================================================================
// TESTE 2: VERIFICAR TEMPLATES DISPONÍVEIS
// ============================================================================

console.log('\n🔍 TESTE 2: TEMPLATES DISPONÍVEIS');
console.log('-'.repeat(50));

// Verificar templates no registry
if (typeof window !== 'undefined' && window.funnelTemplates) {
    console.log('✅ Registry de templates encontrado:', Object.keys(window.funnelTemplates).length);
} else {
    console.log('❌ Registry de templates não encontrado');
}

// Verificar localStorage de templates
const templateKeys = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('template') || key.includes('funnel'))) {
        templateKeys.push(key);
    }
}

console.log('📋 Chaves relacionadas a templates/funis no localStorage:', templateKeys.length);
templateKeys.slice(0, 10).forEach(key => {
    console.log(`   - ${key}`);
});

if (templateKeys.length > 10) {
    console.log(`   ... e mais ${templateKeys.length - 10} chaves`);
}

// ============================================================================
// TESTE 3: SIMULAR CRIAÇÃO DE FUNIL A PARTIR DE TEMPLATE
// ============================================================================

console.log('\n🔍 TESTE 3: SIMULAÇÃO DE CLONAGEM');
console.log('-'.repeat(50));

// Template de teste
const mockTemplate = {
    id: 'test-template',
    name: 'Template de Teste',
    blocks: [
        {
            type: 'FunnelHeroBlock',
            properties: {
                title: 'Título Original',
                description: 'Descrição original',
                ctaText: 'CTA original',
                settings: {
                    backgroundColor: '#ffffff',
                    textColor: '#000000',
                    nestedData: {
                        painPoints: ['Ponto 1', 'Ponto 2'],
                        features: { premium: true, basic: false }
                    }
                }
            }
        }
    ]
};

// Simular clonagem BEFORE (problema)
console.log('❌ BEFORE (shallow copy):');
const shallowClone = {
    id: `${mockTemplate.id}-${Date.now()}`,
    name: mockTemplate.name,
    blocks: mockTemplate.blocks.map(block => ({
        id: `block-${Date.now()}`,
        type: block.type,
        properties: { ...block.properties } // SHALLOW COPY!
    }))
};

// Simular clonagem AFTER (corrigido)
console.log('✅ AFTER (deep clone):');
const deepClone = {
    id: `${mockTemplate.id}-${Date.now()}`,
    name: mockTemplate.name,
    blocks: mockTemplate.blocks.map(block => ({
        id: `block-${Date.now()}`,
        type: block.type,
        properties: JSON.parse(JSON.stringify(block.properties || {})) // DEEP CLONE!
    }))
};

// Teste de isolamento
console.log('\n🧪 TESTE DE ISOLAMENTO:');

// Alterar shallow clone
shallowClone.blocks[0].properties.title = 'ALTERADO SHALLOW';
if (shallowClone.blocks[0].properties.settings) {
    shallowClone.blocks[0].properties.settings.backgroundColor = '#ff0000';
    if (shallowClone.blocks[0].properties.settings.nestedData) {
        shallowClone.blocks[0].properties.settings.nestedData.painPoints[0] = 'ALTERADO SHALLOW';
    }
}

// Alterar deep clone
deepClone.blocks[0].properties.title = 'ALTERADO DEEP';
if (deepClone.blocks[0].properties.settings) {
    deepClone.blocks[0].properties.settings.backgroundColor = '#00ff00';
    if (deepClone.blocks[0].properties.settings.nestedData) {
        deepClone.blocks[0].properties.settings.nestedData.painPoints[0] = 'ALTERADO DEEP';
    }
}

console.log('📊 RESULTADOS DO TESTE:');
console.log('Original title:', mockTemplate.blocks[0].properties.title);
console.log('Shallow title:', shallowClone.blocks[0].properties.title);
console.log('Deep title:', deepClone.blocks[0].properties.title);

if (mockTemplate.blocks[0].properties.settings?.nestedData?.painPoints) {
    console.log('Original painPoints[0]:', mockTemplate.blocks[0].properties.settings.nestedData.painPoints[0]);
    console.log('Shallow painPoints[0]:', shallowClone.blocks[0].properties.settings?.nestedData?.painPoints?.[0]);
    console.log('Deep painPoints[0]:', deepClone.blocks[0].properties.settings?.nestedData?.painPoints?.[0]);
}

// Verificar se houve vazamento
const hasShallowLeak = mockTemplate.blocks[0].properties.title === 'ALTERADO SHALLOW' ||
    (mockTemplate.blocks[0].properties.settings?.nestedData?.painPoints?.[0] === 'ALTERADO SHALLOW');

const hasDeepLeak = mockTemplate.blocks[0].properties.title === 'ALTERADO DEEP' ||
    (mockTemplate.blocks[0].properties.settings?.nestedData?.painPoints?.[0] === 'ALTERADO DEEP');

console.log(`\n🎯 VAZAMENTO SHALLOW: ${hasShallowLeak ? '❌ DETECTADO' : '✅ NÃO DETECTADO'}`);
console.log(`🎯 VAZAMENTO DEEP: ${hasDeepLeak ? '❌ DETECTADO' : '✅ NÃO DETECTADO'}`);

// ============================================================================
// TESTE 4: VERIFICAR CONFIGURAÇÃO DO EDITOR
// ============================================================================

console.log('\n🔍 TESTE 4: CONFIGURAÇÃO DO EDITOR');
console.log('-'.repeat(50));

// Verificar URL atual
console.log('📍 URL atual:', window.location.href);

// Verificar parâmetros
const params = new URLSearchParams(window.location.search);
const funnelParam = params.get('funnel');
const templateParam = params.get('template');

console.log('📊 Parâmetros URL:');
console.log(`   - funnel: ${funnelParam || 'Não definido'}`);
console.log(`   - template: ${templateParam || 'Não definido'}`);

// Verificar contextos React (se disponível)
if (window.React && window.React.version) {
    console.log('⚛️ React version:', window.React.version);
}

// ============================================================================
// SCORE FINAL
// ============================================================================

console.log('\n🏆 SCORE FINAL DO SISTEMA');
console.log('='.repeat(60));

let score = 100;
let issues = [];

// Penalizar problemas
if (hasShallowLeak) {
    score -= 50;
    issues.push('❌ Vazamento de referência em shallow copy detectado');
}

if (hasDeepLeak) {
    score -= 30;
    issues.push('❌ Vazamento de referência em deep copy detectado');
}

if (templateKeys.length < 5) {
    score -= 10;
    issues.push('⚠️ Poucos templates/funis no localStorage');
}

if (!funnelParam && !templateParam) {
    score -= 5;
    issues.push('⚠️ Nenhum parâmetro de funil/template na URL');
}

console.log(`📊 SCORE: ${Math.max(0, score)}/100`);
console.log(`📈 STATUS: ${score >= 80 ? '✅ EXCELENTE' : score >= 60 ? '⚠️ BOM' : '❌ NECESSITA CORREÇÃO'}`);

if (issues.length > 0) {
    console.log('\n🚨 PROBLEMAS IDENTIFICADOS:');
    issues.forEach(issue => console.log(`   ${issue}`));
} else {
    console.log('\n🎉 NENHUM PROBLEMA DETECTADO!');
    console.log('✅ Sistema de funis funcionando corretamente');
    console.log('✅ Isolamento entre funis garantido');
    console.log('✅ Templates configurados adequadamente');
}

console.log('\n📝 PRÓXIMOS PASSOS RECOMENDADOS:');
if (score >= 80) {
    console.log('✅ Sistema está funcionando bem!');
    console.log('✅ Testar criação de novos funis a partir de templates');
    console.log('✅ Verificar se alterações ficam isoladas entre IDs');
} else {
    console.log('🔧 Verificar implementação do deep clone nos templates');
    console.log('🔧 Garantir que cloneFunnelTemplate está sendo usado');
    console.log('🔧 Testar fluxo completo: template → meus funis → editor');
}

console.log('\n🔍 Diagnóstico concluído em', new Date().toISOString());
