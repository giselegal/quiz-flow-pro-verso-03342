/**
 * 🔍 MAPEAMENTO COMPLETO DE ARMAZENAMENTO DE FUNIS
 * 
 * Script para descobrir onde estão salvos os JSONs de cada funil
 */

console.log('🗂️ MAPEAMENTO COMPLETO DE ARMAZENAMENTO DE FUNIS');
console.log('='.repeat(60));

// ============================================================================
// ANÁLISE COMPLETA DO LOCALSTORAGE
// ============================================================================

console.log('\n📋 ANÁLISE COMPLETA DO LOCALSTORAGE');
console.log('-'.repeat(50));

const allKeys = [];
const funnelData = {
    unified: [],
    contextual: [],
    legacy: [],
    templates: [],
    outros: []
};

// Mapear todas as chaves
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
        allKeys.push(key);

        try {
            const value = localStorage.getItem(key);
            const parsed = value ? JSON.parse(value) : null;

            // Categorizar por padrão de chave
            if (key.startsWith('unified_funnel:')) {
                funnelData.unified.push({
                    key,
                    id: key.replace('unified_funnel:', ''),
                    data: parsed
                });
            } else if (key.includes('contextual') && key.includes('funnel')) {
                funnelData.contextual.push({
                    key,
                    context: key.split('-')[0] || 'unknown',
                    id: key.split('-').pop() || 'unknown',
                    data: parsed
                });
            } else if (key.includes('funnel') || key.includes('quiz')) {
                funnelData.legacy.push({
                    key,
                    data: parsed
                });
            } else if (key.includes('template')) {
                funnelData.templates.push({
                    key,
                    data: parsed
                });
            } else {
                // Verificar se contém dados de funil no conteúdo
                if (parsed && typeof parsed === 'object') {
                    if (parsed.blocks || parsed.steps || parsed.funnelId || parsed.templateId) {
                        funnelData.outros.push({
                            key,
                            data: parsed
                        });
                    }
                }
            }
        } catch (e) {
            // Ignorar dados não-JSON
        }
    }
}

console.log(`📊 Total de chaves no localStorage: ${allKeys.length}`);

// ============================================================================
// RELATÓRIO POR CATEGORIA
// ============================================================================

console.log('\n🔍 RELATÓRIO POR CATEGORIA');
console.log('='.repeat(60));

// 1. FUNIS UNIFICADOS
console.log('\n1️⃣ FUNIS UNIFICADOS (unified_funnel:)');
console.log('-'.repeat(40));
if (funnelData.unified.length > 0) {
    funnelData.unified.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}`);
        console.log(`      Chave: ${item.key}`);
        if (item.data) {
            console.log(`      Nome: ${item.data.name || 'Sem nome'}`);
            console.log(`      Blocos: ${Array.isArray(item.data.blocks) ? item.data.blocks.length : 'N/A'}`);
            console.log(`      Criado em: ${item.data.createdAt || 'N/A'}`);
        }
        console.log('');
    });
} else {
    console.log('   ❌ Nenhum funil unificado encontrado');
}

// 2. FUNIS CONTEXTUAIS
console.log('\n2️⃣ FUNIS CONTEXTUAIS (contextual-*-funnel-*)');
console.log('-'.repeat(40));
if (funnelData.contextual.length > 0) {
    const byContext = {};
    funnelData.contextual.forEach(item => {
        if (!byContext[item.context]) byContext[item.context] = [];
        byContext[item.context].push(item);
    });

    Object.keys(byContext).forEach(context => {
        console.log(`   📁 Contexto: ${context}`);
        byContext[context].forEach((item, index) => {
            console.log(`      ${index + 1}. ID: ${item.id}`);
            console.log(`         Chave: ${item.key}`);
            if (item.data) {
                console.log(`         Nome: ${item.data.name || 'Sem nome'}`);
                console.log(`         Tipo: ${item.data.type || 'N/A'}`);
            }
        });
        console.log('');
    });
} else {
    console.log('   ❌ Nenhum funil contextual encontrado');
}

// 3. FUNIS LEGACY
console.log('\n3️⃣ FUNIS LEGACY (outros padrões)');
console.log('-'.repeat(40));
if (funnelData.legacy.length > 0) {
    funnelData.legacy.forEach((item, index) => {
        console.log(`   ${index + 1}. Chave: ${item.key}`);
        if (item.data && typeof item.data === 'object') {
            console.log(`      Tipo: ${typeof item.data}`);
            if (item.data.name) console.log(`      Nome: ${item.data.name}`);
            if (item.data.id) console.log(`      ID: ${item.data.id}`);
            if (Array.isArray(item.data.blocks)) console.log(`      Blocos: ${item.data.blocks.length}`);
            if (Array.isArray(item.data.steps)) console.log(`      Steps: ${item.data.steps.length}`);
        }
        console.log('');
    });
} else {
    console.log('   ❌ Nenhum funil legacy encontrado');
}

// 4. TEMPLATES
console.log('\n4️⃣ TEMPLATES');
console.log('-'.repeat(40));
if (funnelData.templates.length > 0) {
    funnelData.templates.forEach((item, index) => {
        console.log(`   ${index + 1}. Chave: ${item.key}`);
        if (item.data) {
            if (Array.isArray(item.data)) {
                console.log(`      Lista com ${item.data.length} templates`);
            } else if (typeof item.data === 'object') {
                console.log(`      Nome: ${item.data.name || 'Sem nome'}`);
                console.log(`      ID: ${item.data.id || 'Sem ID'}`);
            }
        }
        console.log('');
    });
} else {
    console.log('   ❌ Nenhum template encontrado');
}

// 5. OUTROS DADOS RELACIONADOS
console.log('\n5️⃣ OUTROS DADOS RELACIONADOS');
console.log('-'.repeat(40));
if (funnelData.outros.length > 0) {
    funnelData.outros.forEach((item, index) => {
        console.log(`   ${index + 1}. Chave: ${item.key}`);
        if (item.data) {
            console.log(`      Tipo: ${typeof item.data}`);
            if (item.data.blocks) console.log(`      Tem blocos: ${Array.isArray(item.data.blocks) ? item.data.blocks.length : 'Sim'}`);
            if (item.data.steps) console.log(`      Tem steps: ${Array.isArray(item.data.steps) ? item.data.steps.length : 'Sim'}`);
            if (item.data.funnelId) console.log(`      Funnel ID: ${item.data.funnelId}`);
            if (item.data.templateId) console.log(`      Template ID: ${item.data.templateId}`);
        }
        console.log('');
    });
} else {
    console.log('   ❌ Nenhum outro dado relacionado encontrado');
}

// ============================================================================
// PADRÕES DE CHAVES IDENTIFICADOS
// ============================================================================

console.log('\n🔑 PADRÕES DE CHAVES IDENTIFICADOS');
console.log('='.repeat(60));

const patterns = {
    'unified_funnel:*': funnelData.unified.length,
    'contextual-*-funnel-*': funnelData.contextual.length,
    '*funnel*': funnelData.legacy.length,
    '*template*': funnelData.templates.length,
    'outros': funnelData.outros.length
};

Object.keys(patterns).forEach(pattern => {
    console.log(`📍 ${pattern}: ${patterns[pattern]} itens`);
});

// ============================================================================
// INSTRUÇÕES PARA ACESSAR DADOS
// ============================================================================

console.log('\n📝 INSTRUÇÕES PARA ACESSAR DADOS DE UM FUNIL ESPECÍFICO');
console.log('='.repeat(60));

console.log('Para acessar os dados de um funil específico:');
console.log('');

if (funnelData.unified.length > 0) {
    const exemplo = funnelData.unified[0];
    console.log('✅ FUNIL UNIFICADO:');
    console.log(`   const funnel = JSON.parse(localStorage.getItem('${exemplo.key}'));`);
    console.log(`   // ID: ${exemplo.id}`);
    console.log('');
}

if (funnelData.contextual.length > 0) {
    const exemplo = funnelData.contextual[0];
    console.log('✅ FUNIL CONTEXTUAL:');
    console.log(`   const funnel = JSON.parse(localStorage.getItem('${exemplo.key}'));`);
    console.log(`   // Contexto: ${exemplo.context}, ID: ${exemplo.id}`);
    console.log('');
}

console.log('🔍 Para explorar todos os dados:');
console.log('   // Listar todas as chaves relacionadas a funis');
console.log('   Object.keys(localStorage).filter(key => key.includes("funnel"))');
console.log('');
console.log('   // Buscar por ID específico');
console.log('   const funnelId = "SEU_ID_AQUI";');
console.log('   Object.keys(localStorage).filter(key => key.includes(funnelId))');

// ============================================================================
// RESUMO EXECUTIVO
// ============================================================================

console.log('\n📊 RESUMO EXECUTIVO');
console.log('='.repeat(60));

const totalFunnels = funnelData.unified.length + funnelData.contextual.length + funnelData.legacy.length;
const totalTemplates = funnelData.templates.length;

console.log(`🎯 TOTAL DE FUNIS ENCONTRADOS: ${totalFunnels}`);
console.log(`📋 TOTAL DE TEMPLATES ENCONTRADOS: ${totalTemplates}`);
console.log(`🗂️ TOTAL DE OUTROS DADOS: ${funnelData.outros.length}`);
console.log('');

if (totalFunnels > 0) {
    console.log('✅ SISTEMA DE ARMAZENAMENTO ATIVO');
    console.log('✅ Dados de funis encontrados no localStorage');

    if (funnelData.unified.length > 0) {
        console.log('✅ Sistema unificado em uso (unified_funnel:)');
    }

    if (funnelData.contextual.length > 0) {
        console.log('✅ Sistema contextual em uso (contextual-*-funnel-*)');
    }
} else {
    console.log('⚠️ NENHUM FUNIL ENCONTRADO NO LOCALSTORAGE');
    console.log('🔧 Possíveis causas:');
    console.log('   - Funis ainda não foram criados');
    console.log('   - Dados estão em outro local (sessionStorage, indexedDB)');
    console.log('   - localStorage foi limpo recentemente');
}

console.log('\n🔍 Análise concluída em', new Date().toISOString());
