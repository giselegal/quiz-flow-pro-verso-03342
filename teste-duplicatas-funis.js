// 🧪 SCRIPT DE TESTE: Verificar e criar funis duplicados para testar funcionalidade

console.log('🔍 Analisando localStorage em busca de funis...');

// Função para criar funis de exemplo (duplicados) para teste
function createTestDuplicates() {
    const testFunnels = [
        // Funis com prefixos diferentes
        { key: 'funnel-quiz-style-1', data: { id: '1', name: 'Quiz Estilo', type: 'quiz' } },
        { key: 'funnelData-quiz-style-2', data: { id: '2', name: 'Quiz Estilo', type: 'quiz' } },
        { key: 'quiz-funnel-style-3', data: { id: '3', name: 'Quiz Estilo', type: 'quiz' } },

        // Funis temporários/rascunhos
        { key: 'funnel-draft-lead-magnet-1', data: { id: 'draft1', name: 'Lead Magnet Draft', type: 'lead' } },
        { key: 'temp-funnel-lead-magnet-2', data: { id: 'temp1', name: 'Lead Magnet Temp', type: 'lead' } },
        { key: 'funnel-backup-lead-magnet-3', data: { id: 'backup1', name: 'Lead Magnet Backup', type: 'lead' } },

        // Cópias e duplicatas
        { key: 'funnel-copy-webinar-1', data: { id: 'copy1', name: 'Webinar Copy', type: 'webinar' } },
        { key: 'funnel-duplicate-webinar-2', data: { id: 'dup1', name: 'Webinar Duplicate', type: 'webinar' } },

        // Templates antigos
        { key: 'template-old-quiz-1', data: { id: 'oldquiz1', name: 'Quiz Template Old', type: 'template' } },
        { key: 'Funnel-Legacy-Template-2', data: { id: 'legacy1', name: 'Legacy Template', type: 'template' } },

        // Dados de cache/sessão
        { key: 'cache-funnel-session-1', data: { id: 'cache1', name: 'Session Cache', type: 'cache' } },
        { key: 'session-funnel-data-2', data: { id: 'session1', name: 'Session Data', type: 'session' } }
    ];

    console.log('🚀 Criando funis de teste para demonstrar funcionalidade...');

    testFunnels.forEach((funnel, index) => {
        localStorage.setItem(funnel.key, JSON.stringify(funnel.data));
        console.log(`${index + 1}. Criado: ${funnel.key}`);
    });

    console.log(`✅ ${testFunnels.length} funis de teste criados!`);
    return testFunnels.length;
}

// Função para analisar duplicatas existentes
function analyzeDuplicates() {
    const keys = Object.keys(localStorage);

    const funnelKeys = keys.filter(key =>
        key.startsWith('funnel-') ||
        key.startsWith('funnelData-') ||
        key.includes('funnel') ||
        key.includes('Funnel') ||
        key.includes('quiz') ||
        key.includes('Quiz') ||
        key.includes('template') ||
        key.includes('draft') ||
        key.includes('temp') ||
        key.includes('backup') ||
        key.includes('copy') ||
        key.includes('duplicate') ||
        key.includes('cache') ||
        key.includes('session')
    );

    console.log('\n📊 ANÁLISE DE DUPLICATAS:');
    console.log('========================');
    console.log(`Total de chaves no localStorage: ${keys.length}`);
    console.log(`Chaves relacionadas a funis: ${funnelKeys.length}`);

    if (funnelKeys.length > 0) {
        console.log('\n📋 Lista de funis encontrados:');
        funnelKeys.forEach((key, index) => {
            const value = localStorage.getItem(key);
            const size = value ? new Blob([value]).size : 0;
            console.log(`${index + 1}. ${key} (${size} bytes)`);
        });

        const totalSize = funnelKeys.reduce((acc, key) => {
            const value = localStorage.getItem(key) || '';
            return acc + new Blob([value]).size;
        }, 0);

        console.log(`\n💾 Espaço total usado: ${(totalSize / 1024).toFixed(2)} KB`);
        console.log(`🧹 Potencial de limpeza: ${funnelKeys.length} itens`);
    } else {
        console.log('✨ Nenhum funil duplicado encontrado no localStorage');
    }

    return {
        total: funnelKeys.length,
        keys: funnelKeys,
        totalSize: funnelKeys.reduce((acc, key) => {
            const value = localStorage.getItem(key) || '';
            return acc + new Blob([value]).size;
        }, 0)
    };
}

// Executar análise
const analysis = analyzeDuplicates();

if (analysis.total === 0) {
    console.log('\n🎯 Criando funis de teste para demonstrar a funcionalidade...');
    createTestDuplicates();

    // Re-analisar após criar
    console.log('\n🔄 Re-analisando após criar funis de teste...');
    analyzeDuplicates();
} else {
    console.log('\n✅ Funis duplicados já existem para teste');
}

console.log('\n🌐 Para testar:');
console.log('1. Acesse http://localhost:5174/admin/funis');
console.log('2. Clique no botão "Limpar Duplicatas"');
console.log('3. Veja a lista de itens detectados');
console.log('4. Execute a limpeza');
console.log('5. Verifique que os duplicados foram removidos');

// Exportar funções para uso no console
if (typeof window !== 'undefined') {
    window.createTestDuplicates = createTestDuplicates;
    window.analyzeDuplicates = analyzeDuplicates;
}
