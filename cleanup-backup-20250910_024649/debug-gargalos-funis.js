// 🔍 TESTE RÁPIDO: Identificar gargalos no acesso aos funis
console.log('=== DIAGNÓSTICO RÁPIDO: GARGALOS DOS FUNIS ===');

// 1. Testar localStorage
console.log('\n📦 1. TESTANDO LOCALSTORAGE:');
try {
    // Verificar suporte
    const storageSupported = typeof (Storage) !== "undefined";
    console.log('✓ LocalStorage suportado:', storageSupported);

    // Verificar chaves existentes relacionadas a funis
    const funnelKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('funnel') || key.includes('qqcv'))) {
            funnelKeys.push(key);
        }
    }
    console.log('✓ Chaves de funis encontradas:', funnelKeys);

    // Verificar conteúdo da lista principal
    const listKey = 'qqcv_funnels';
    const listData = localStorage.getItem(listKey);
    console.log('✓ Lista principal (qqcv_funnels):', listData);

    if (listData) {
        try {
            const parsed = JSON.parse(listData);
            console.log('✓ Lista parseada:', parsed);
            console.log('✓ Número de funis:', Array.isArray(parsed) ? parsed.length : 'Não é array');
        } catch (e) {
            console.log('❌ Erro ao parsear lista:', e.message);
        }
    } else {
        console.log('⚠️ Lista principal vazia ou inexistente');
    }

} catch (error) {
    console.log('❌ Erro geral no localStorage:', error.message);
}

// 2. Simular funnelLocalStore.list()
console.log('\n🗄️ 2. SIMULANDO funnelLocalStore.list():');
try {
    const LIST_KEY = 'qqcv_funnels';
    const raw = localStorage.getItem(LIST_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const result = Array.isArray(arr) ? arr : [];
    console.log('✓ Resultado da simulação:', result);
    console.log('✓ Comprimento:', result.length);
    console.log('✓ Tipo:', typeof result, Array.isArray(result) ? '(array)' : '(não array)');
} catch (error) {
    console.log('❌ Erro na simulação:', error.message);
}

// 3. Criar funil de teste
console.log('\n🧪 3. CRIANDO FUNIL DE TESTE:');
try {
    const testFunnel = {
        id: `debug-test-${Date.now()}`,
        name: 'Funil Teste Debug',
        status: 'draft',
        updatedAt: new Date().toISOString()
    };

    // Simular funnelLocalStore.upsert()
    const LIST_KEY = 'qqcv_funnels';
    let list = [];
    try {
        const raw = localStorage.getItem(LIST_KEY);
        list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];
    } catch {
        list = [];
    }

    const idx = list.findIndex(f => f.id === testFunnel.id);
    if (idx >= 0) {
        list[idx] = testFunnel;
        console.log('✓ Funil atualizado na posição:', idx);
    } else {
        list.push(testFunnel);
        console.log('✓ Funil adicionado. Nova lista:', list.length, 'items');
    }

    localStorage.setItem(LIST_KEY, JSON.stringify(list));
    console.log('✓ Lista salva no localStorage');

    // Verificar se foi salvo
    const verification = localStorage.getItem(LIST_KEY);
    console.log('✓ Verificação da gravação:', verification ? 'Sucesso' : 'Falhou');

} catch (error) {
    console.log('❌ Erro ao criar funil teste:', error.message);
}

// 4. Verificar roteamento
console.log('\n🛤️ 4. VERIFICANDO ROTEAMENTO:');
console.log('✓ URL atual:', window.location.href);
console.log('✓ Pathname:', window.location.pathname);
console.log('✓ Search:', window.location.search);
console.log('✓ Hash:', window.location.hash);
console.log('✓ Host:', window.location.host);
console.log('✓ Está no admin?', window.location.pathname.includes('/admin'));

// 5. Verificar autenticação (se disponível)
console.log('\n🔐 5. VERIFICANDO AUTENTICAÇÃO:');
try {
    // Tentar acessar variáveis de ambiente
    console.log('✓ NODE_ENV:', process.env.NODE_ENV);
    console.log('✓ import.meta.env.DEV:', import.meta.env.DEV);
    console.log('✓ import.meta.env.MODE:', import.meta.env.MODE);
    console.log('✓ Hostname:', window.location.hostname);

    // Verificar se está em desenvolvimento
    const isDevelopment =
        import.meta.env.DEV ||
        import.meta.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'development' ||
        window.location.hostname === 'localhost';

    console.log('✓ É desenvolvimento?', isDevelopment);

} catch (error) {
    console.log('❌ Erro ao verificar auth/env:', error.message);
}

// 6. Testar criação de funnel via interface
console.log('\n🎯 6. FUNÇÕES DE TESTE DISPONÍVEIS:');
console.log('Para testar manualmente, execute no console:');
console.log('createTestFunnel() - Cria um funil de teste');
console.log('listAllFunnels() - Lista todos os funis');
console.log('clearAllFunnels() - Limpa todos os funis');
console.log('checkRoutes() - Verifica rotas disponíveis');

// Funções auxiliares para teste manual
window.createTestFunnel = () => {
    const testFunnel = {
        id: `manual-test-${Date.now()}`,
        name: `Funil Manual ${new Date().toLocaleTimeString()}`,
        status: 'draft',
        updatedAt: new Date().toISOString()
    };

    const LIST_KEY = 'qqcv_funnels';
    let list = [];
    try {
        const raw = localStorage.getItem(LIST_KEY);
        list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];
    } catch {
        list = [];
    }

    list.push(testFunnel);
    localStorage.setItem(LIST_KEY, JSON.stringify(list));

    console.log('✅ Funil criado:', testFunnel);
    console.log('📊 Total de funis:', list.length);
    return testFunnel;
};

window.listAllFunnels = () => {
    const LIST_KEY = 'qqcv_funnels';
    try {
        const raw = localStorage.getItem(LIST_KEY);
        const list = raw ? JSON.parse(raw) : [];
        console.log('📋 Lista completa de funis:');
        console.table(list);
        return list;
    } catch (error) {
        console.log('❌ Erro ao listar funis:', error.message);
        return [];
    }
};

window.clearAllFunnels = () => {
    if (confirm('⚠️ Isso vai remover TODOS os funis. Continuar?')) {
        localStorage.removeItem('qqcv_funnels');
        console.log('🗑️ Todos os funis removidos');
    }
};

window.checkRoutes = () => {
    const routes = [
        '/admin',
        '/admin/meus-funis',
        '/admin/funis',
        '/editor'
    ];

    console.log('🛤️ Rotas para testar:');
    routes.forEach(route => {
        const fullUrl = window.location.origin + route;
        console.log(`📍 ${route} → ${fullUrl}`);
    });
};

console.log('\n✅ DIAGNÓSTICO CONCLUÍDO!');
console.log('📋 Execute as funções acima para testes manuais.');
console.log('🌐 Acesse: http://localhost:5174/debug-funnels-access.html para interface visual');
