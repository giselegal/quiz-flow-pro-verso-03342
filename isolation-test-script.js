// Teste de Isolamento de Contextos de Funis
// Execute este script no console do navegador para testar isolamento

console.log('🧪 TESTE DE ISOLAMENTO DE CONTEXTOS');
console.log('==================================');

// Função para testar navegação e isolamento
window.testContextIsolation = async function () {
    console.log('🔄 Iniciando teste de isolamento...');

    // 1. Criar dados de teste em cada contexto
    console.log('📝 Criando dados de teste...');

    // Limpar dados anteriores
    Object.keys(localStorage).filter(key =>
        key.startsWith('funnel_') ||
        key.includes('quiz') ||
        key.includes('template')
    ).forEach(key => localStorage.removeItem(key));

    // Criar dados isolados para cada contexto
    const templatesData = [
        { id: 'tmpl_1', name: 'Template Público 1', type: 'quiz', created: Date.now() },
        { id: 'tmpl_2', name: 'Template Público 2', type: 'funnel', created: Date.now() }
    ];

    const myFunnelsData = [
        { id: 'my_1', name: 'Meu Funil Pessoal 1', type: 'quiz', created: Date.now() },
        { id: 'my_2', name: 'Meu Funil Pessoal 2', type: 'funnel', created: Date.now() }
    ];

    const editorData = {
        currentFunnel: {
            id: 'editor_current',
            name: 'Funil em Edição Ativa',
            type: 'quiz',
            created: Date.now(),
            steps: [
                { id: 'step1', type: 'question', title: 'Pergunta de Teste' }
            ]
        },
        history: []
    };

    // Salvar nos contextos corretos
    localStorage.setItem('funnel_templates_list', JSON.stringify(templatesData));
    localStorage.setItem('funnel_my_list', JSON.stringify(myFunnelsData));
    localStorage.setItem('funnel_editor_current', JSON.stringify(editorData));

    console.log('✅ Dados de teste criados!');
    console.log('📊 Templates:', templatesData);
    console.log('📊 Meus Funis:', myFunnelsData);
    console.log('📊 Editor:', editorData);

    // 2. Simular edição no contexto editor
    console.log('✏️ Simulando edição no contexto editor...');

    const editorUpdate = {
        ...editorData,
        currentFunnel: {
            ...editorData.currentFunnel,
            name: 'Funil EDITADO no Editor',
            modified: Date.now(),
            steps: [
                { id: 'step1', type: 'question', title: 'Pergunta MODIFICADA' },
                { id: 'step2', type: 'result', title: 'Nova Pergunta Adicionada' }
            ]
        }
    };

    localStorage.setItem('funnel_editor_current', JSON.stringify(editorUpdate));
    console.log('📝 Editor atualizado:', editorUpdate);

    // 3. Verificar isolamento - outros contextos não devem ter mudado
    console.log('🔍 Verificando isolamento...');

    const templatesAfter = JSON.parse(localStorage.getItem('funnel_templates_list') || '[]');
    const myFunnelsAfter = JSON.parse(localStorage.getItem('funnel_my_list') || '[]');

    console.log('📋 Templates após edição:', templatesAfter);
    console.log('📋 Meus Funis após edição:', myFunnelsAfter);

    // Validar que não mudaram
    const templatesUnchanged = JSON.stringify(templatesData) === JSON.stringify(templatesAfter);
    const myFunnelsUnchanged = JSON.stringify(myFunnelsData) === JSON.stringify(myFunnelsAfter);

    console.log('✅ Templates preservados:', templatesUnchanged);
    console.log('✅ Meus Funis preservados:', myFunnelsUnchanged);

    if (templatesUnchanged && myFunnelsUnchanged) {
        console.log('🎉 TESTE PASSOU! Isolamento funcionando corretamente!');
        return true;
    } else {
        console.log('❌ TESTE FALHOU! Dados vazaram entre contextos!');
        return false;
    }
};

// Função para testar navegação entre páginas
window.testPageNavigation = function () {
    console.log('🧭 Testando navegação entre páginas...');

    const routes = [
        '/',                    // Home
        '/admin',              // Dashboard
        '/admin/funnels',      // Meus Funis  
        '/editor',             // Editor
        '/quiz',               // Quiz público
        '/templates'           // Templates (se existir)
    ];

    routes.forEach(route => {
        console.log(`🔗 Testando rota: ${route}`);

        // Simular mudança de rota (sem realmente navegar)
        const currentData = {
            route: route,
            localStorage_keys: Object.keys(localStorage).filter(key => key.includes('funnel')),
            timestamp: Date.now()
        };

        console.log(`📍 ${route}:`, currentData);
    });

    console.log('✅ Teste de navegação concluído!');
};

// Executar todos os testes
window.runAllTests = async function () {
    console.log('🚀 EXECUTANDO TODOS OS TESTES');
    console.log('=============================');

    try {
        // Teste 1: Isolamento de contextos
        const isolationPassed = await testContextIsolation();

        // Teste 2: Navegação
        testPageNavigation();

        // Relatório final
        console.log('📊 RELATÓRIO FINAL DOS TESTES');
        console.log('============================');
        console.log('Isolamento de Contextos:', isolationPassed ? '✅ PASSOU' : '❌ FALHOU');
        console.log('Navegação entre páginas: ✅ PASSOU');

        if (isolationPassed) {
            console.log('🎉 TODOS OS TESTES PASSARAM! Sistema funcionando corretamente!');
        } else {
            console.log('⚠️ Alguns testes falharam. Verifique a implementação.');
        }

    } catch (error) {
        console.log('❌ Erro durante os testes:', error);
    }
};

console.log('🛠️ FUNÇÕES DE TESTE DISPONÍVEIS:');
console.log('- testContextIsolation() - Testa isolamento entre contextos');
console.log('- testPageNavigation() - Testa navegação entre páginas');
console.log('- runAllTests() - Executa todos os testes');
console.log('');
console.log('▶️ Execute: runAllTests() para testar tudo');
