// Diagnóstico e Migração de Dados - Execute no console do navegador
// Copie e cole este código no console do navegador quando estiver no localhost:5173

console.log('🔍 DIAGNÓSTICO DE DADOS DO LOCALSTORAGE');
console.log('=====================================');

// 1. Verificar dados existentes no localStorage
const allKeys = Object.keys(localStorage);
console.log('📋 Todas as chaves no localStorage:', allKeys);

// 2. Filtrar chaves relacionadas a funis
const funnelKeys = allKeys.filter(key =>
    key.includes('funnel') ||
    key.includes('quiz') ||
    key.includes('template') ||
    key.includes('editor')
);
console.log('🎯 Chaves relacionadas a funis:', funnelKeys);

// 3. Mostrar dados dos funis existentes
funnelKeys.forEach(key => {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        console.log(`📄 ${key}:`, data);
    } catch (e) {
        console.log(`❌ Erro ao parsear ${key}:`, localStorage.getItem(key));
    }
});

// 4. Função de migração manual (caso precise)
window.migrateDataManual = function () {
    console.log('🔄 Iniciando migração manual...');

    // Verificar se já existe dados contextuais
    const templateKeys = Object.keys(localStorage).filter(key =>
        key.startsWith('funnel_templates_') ||
        key.startsWith('funnel_my_') ||
        key.startsWith('funnel_editor_')
    );

    console.log('🔍 Dados contextuais existentes:', templateKeys);

    // Procurar dados legados para migrar
    const legacyKeys = Object.keys(localStorage).filter(key =>
        (key.includes('funnel') && !key.includes('funnel_templates_') && !key.includes('funnel_my_') && !key.includes('funnel_editor_')) ||
        key === 'funnels' ||
        key === 'templates' ||
        key === 'editorData'
    );

    console.log('🕰️ Dados legados encontrados:', legacyKeys);

    // Migrar dados legados se existirem
    if (legacyKeys.length > 0) {
        legacyKeys.forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                console.log(`📦 Migrando ${key}:`, data);

                // Determinar contexto baseado na chave
                let context = 'templates'; // padrão
                if (key.includes('editor') || key.includes('Editor')) {
                    context = 'editor';
                } else if (key.includes('my') || key.includes('My') || key.includes('user')) {
                    context = 'my';
                }

                // Nova chave contextual
                const newKey = `funnel_${context}_${key}`;
                localStorage.setItem(newKey, JSON.stringify(data));
                console.log(`✅ Migrado para: ${newKey}`);

                // Remover chave antiga (comentado por segurança)
                // localStorage.removeItem(key);

            } catch (e) {
                console.log(`❌ Erro na migração de ${key}:`, e);
            }
        });

        console.log('✅ Migração manual concluída!');
    } else {
        console.log('ℹ️ Nenhum dado legado encontrado para migrar');
    }
};

// 5. Função para limpar dados de teste
window.clearTestData = function () {
    const confirm = window.confirm('❓ Tem certeza que quer limpar todos os dados de funis do localStorage?');
    if (confirm) {
        const funnelKeys = Object.keys(localStorage).filter(key =>
            key.includes('funnel') ||
            key.includes('quiz') ||
            key.includes('template') ||
            key.includes('editor')
        );

        funnelKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`🗑️ Removido: ${key}`);
        });

        console.log('🧹 Limpeza concluída!');
    }
};

// 6. Função para criar dados de teste
window.createTestData = function () {
    console.log('🧪 Criando dados de teste...');

    // Dados de teste para templates
    const templateData = [
        { id: 'template1', name: 'Template Teste 1', type: 'quiz', context: 'templates' },
        { id: 'template2', name: 'Template Teste 2', type: 'funnel', context: 'templates' }
    ];
    localStorage.setItem('funnel_templates_data', JSON.stringify(templateData));

    // Dados de teste para meus funis
    const myFunnelsData = [
        { id: 'my1', name: 'Meu Funil 1', type: 'quiz', context: 'my' },
        { id: 'my2', name: 'Meu Funil 2', type: 'funnel', context: 'my' }
    ];
    localStorage.setItem('funnel_my_data', JSON.stringify(myFunnelsData));

    // Dados de teste para editor
    const editorData = {
        currentFunnel: { id: 'editor1', name: 'Funil em Edição', type: 'quiz', context: 'editor' },
        steps: []
    };
    localStorage.setItem('funnel_editor_current', JSON.stringify(editorData));

    console.log('✅ Dados de teste criados!');
};

console.log('🛠️ FUNÇÕES DISPONÍVEIS:');
console.log('- migrateDataManual() - Migra dados legados');
console.log('- clearTestData() - Limpa todos os dados');
console.log('- createTestData() - Cria dados de teste');
console.log('');
console.log('▶️ Execute qualquer função digitando o nome no console');
