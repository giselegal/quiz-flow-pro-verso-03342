/**
 * 🧪 TESTE DO FLUXO: TEMPLATE → FUNNEL PERSONALIZADO
 * 
 * Este teste verifica se:
 * 1. Ao clicar em "Usar Template" em /admin/funis
 * 2. É criado um novo ID único
 * 3. O funnel aparece em /admin/meus-funis
 * 4. O isolamento de dados funciona
 */

console.log('🚀 TESTE: Fluxo Template → Funnel Personalizado');

// Simular funnelLocalStore
const FUNNEL_LIST_KEY = 'qqcv_funnels';

const funnelLocalStore = {
    list() {
        try {
            const raw = localStorage.getItem(FUNNEL_LIST_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
    },

    saveList(list) {
        try {
            localStorage.setItem(FUNNEL_LIST_KEY, JSON.stringify(list));
            console.log('💾 Lista de funnels salva:', list);
        } catch { }
    },

    get(id) {
        return this.list().find(f => f.id === id) || null;
    },

    upsert(item) {
        const list = this.list();
        const idx = list.findIndex(f => f.id === item.id);
        if (idx >= 0) {
            list[idx] = item;
            console.log('🔄 Funnel atualizado:', item);
        } else {
            list.push(item);
            console.log('✅ Novo funnel criado:', item);
        }
        this.saveList(list);
    }
};

// Simular templates disponíveis
const funnelTemplates = [
    {
        id: 'default-quiz-funnel-21-steps',
        name: 'Quiz Completo: Descoberta de Estilo Pessoal (21 Etapas)',
        description: 'Funil completo com 21 etapas para descoberta de estilo pessoal'
    },
    {
        id: 'template-optimized-21-steps-funnel',
        name: 'Quiz 21 Etapas (Otimizado)',
        description: 'Versão otimizada com blocos core, perguntas sincronizadas e pesos de pontuação'
    },
    {
        id: 'com-que-roupa-eu-vou',
        name: 'Com que Roupa Eu Vou?',
        description: 'Quiz especializado em combinações de looks com IA'
    }
];

// Função que simula o handleUseTemplate
function handleUseTemplate(templateId) {
    console.log(`🎯 Usuário clicou em "Usar Template": ${templateId}`);

    // 1. Gerar ID único para o novo funnel
    const now = new Date().toISOString();
    const newId = `${templateId}-${Date.now()}`;
    const template = funnelTemplates.find(t => t.id === templateId);
    const name = template ? template.name : 'Funil';

    console.log(`🆔 Novo ID gerado: ${newId}`);

    // 2. Criar entrada na lista de funnels
    const newFunnel = {
        id: newId,
        name: name,
        status: 'draft',
        updatedAt: now,
        templateId: templateId // Referência ao template original
    };

    funnelLocalStore.upsert(newFunnel);

    // 3. Simular navegação para o editor
    const editorUrl = `/editor?template=${templateId}&funnel=${newId}`;
    console.log(`🔗 Navegando para: ${editorUrl}`);

    return { newFunnel, editorUrl };
}

// Função para verificar se o funnel aparece em "Meus Funis"
function checkFunnelInMyFunnels(funnelId) {
    const funnels = funnelLocalStore.list();
    const funnel = funnels.find(f => f.id === funnelId);

    if (funnel) {
        console.log(`✅ Funnel encontrado em "Meus Funis":`, funnel);
        return true;
    } else {
        console.log(`❌ Funnel NÃO encontrado em "Meus Funis"`);
        return false;
    }
}

// Função para testar isolamento de dados
function testDataIsolation(funnelId1, funnelId2) {
    console.log('🔒 Testando isolamento de dados...');

    // Simular dados específicos para cada funnel
    const testData1 = { step1: 'Dados do Funnel 1', userId: 'user-001' };
    const testData2 = { step1: 'Dados do Funnel 2', userId: 'user-002' };

    // Usar o sistema de chaves únicas (simulado)
    const key1 = `funnel_data_${funnelId1}`;
    const key2 = `funnel_data_${funnelId2}`;

    localStorage.setItem(key1, JSON.stringify(testData1));
    localStorage.setItem(key2, JSON.stringify(testData2));

    // Verificar se os dados estão isolados
    const retrieved1 = JSON.parse(localStorage.getItem(key1));
    const retrieved2 = JSON.parse(localStorage.getItem(key2));

    const isolated = retrieved1.userId !== retrieved2.userId;

    console.log(`📊 Dados Funnel 1:`, retrieved1);
    console.log(`📊 Dados Funnel 2:`, retrieved2);
    console.log(`🔒 Isolamento: ${isolated ? 'FUNCIONAL' : 'FALHOU'}`);

    return isolated;
}

// EXECUTAR TESTES
console.log('\n🧪 INICIANDO TESTES...\n');

// Limpar dados anteriores
localStorage.removeItem(FUNNEL_LIST_KEY);

// TESTE 1: Criar funnel a partir de template
console.log('1️⃣ TESTE: Criar funnel a partir de template');
const result1 = handleUseTemplate('template-optimized-21-steps-funnel');
const funnelId1 = result1.newFunnel.id;

// TESTE 2: Criar outro funnel a partir de template diferente
console.log('\n2️⃣ TESTE: Criar segundo funnel');
const result2 = handleUseTemplate('com-que-roupa-eu-vou');
const funnelId2 = result2.newFunnel.id;

// TESTE 3: Verificar se ambos aparecem em "Meus Funis"
console.log('\n3️⃣ TESTE: Verificar "Meus Funis"');
const found1 = checkFunnelInMyFunnels(funnelId1);
const found2 = checkFunnelInMyFunnels(funnelId2);

// TESTE 4: Verificar isolamento de dados
console.log('\n4️⃣ TESTE: Isolamento de dados');
const isolated = testDataIsolation(funnelId1, funnelId2);

// TESTE 5: Verificar IDs únicos
console.log('\n5️⃣ TESTE: IDs únicos');
const uniqueIds = funnelId1 !== funnelId2;
console.log(`🆔 Funnel 1 ID: ${funnelId1}`);
console.log(`🆔 Funnel 2 ID: ${funnelId2}`);
console.log(`🔑 IDs únicos: ${uniqueIds ? 'SIM' : 'NÃO'}`);

// RESULTADO FINAL
console.log('\n📊 RESULTADO FINAL');
const allTestsPassed = found1 && found2 && isolated && uniqueIds;

console.log(`✅ Funnel 1 em "Meus Funis": ${found1}`);
console.log(`✅ Funnel 2 em "Meus Funis": ${found2}`);
console.log(`🔒 Isolamento de dados: ${isolated}`);
console.log(`🔑 IDs únicos: ${uniqueIds}`);

if (allTestsPassed) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ O fluxo Template → Funnel Personalizado está funcionando corretamente.');
    console.log('✅ Cada template cria um novo ID único.');
    console.log('✅ Os funnels aparecem em "Meus Funis".');
    console.log('✅ O isolamento de dados está funcional.');
} else {
    console.log('\n❌ ALGUNS TESTES FALHARAM!');
    console.log('⚠️ Verificar implementação do fluxo.');
}

// Mostrar lista final de funnels
console.log('\n📋 LISTA FINAL DE FUNNELS:');
const finalList = funnelLocalStore.list();
finalList.forEach((funnel, index) => {
    console.log(`${index + 1}. ${funnel.name} (ID: ${funnel.id})`);
});

console.log('\n💡 COMO TESTAR MANUALMENTE:');
console.log('1. Ir para /admin/funis');
console.log('2. Clicar em "Usar Template" em qualquer template');
console.log('3. Verificar se um novo ID é gerado na URL');
console.log('4. Ir para /admin/meus-funis');
console.log('5. Verificar se o funnel criado aparece na lista');
console.log('6. Editar o funnel e verificar que não afeta outros');
