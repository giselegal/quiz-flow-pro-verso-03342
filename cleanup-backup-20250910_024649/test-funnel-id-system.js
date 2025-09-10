/**
 * 🧪 TESTE DIAGNÓSTICO: Sistema de IDs dos Funis
 * 
 * Testa o fluxo completo de captura de IDs de URLs
 */

// Simular ambiente de navegador
global.window = {
    location: {
        href: 'http://localhost:5173/editor?funnel=test-funnel-123',
        search: '?funnel=test-funnel-123'
    },
    localStorage: {
        data: {},
        getItem(key) { return this.data[key] || null; },
        setItem(key, value) { this.data[key] = value; },
        removeItem(key) { delete this.data[key]; }
    }
};

// Mock do import.meta.env
global.import = {
    meta: {
        env: {
            VITE_DEFAULT_FUNNEL_ID: 'env-default-funnel'
        }
    }
};

console.log('🧪 INICIANDO TESTE DO SISTEMA DE IDs DOS FUNIS');
console.log('='.repeat(60));

// Função de teste isolada (similar ao funnelIdentity.ts)
function testGetFunnelIdFromEnvOrStorage() {
    try {
        // Primeira tentativa: parâmetro da URL
        const url = new URL(window.location.href);
        const fromUrl = url.searchParams.get('funnel'); // ✅ Usando 'funnel'
        if (fromUrl) {
            console.log('🔍 FunnelId da URL:', fromUrl);
            return fromUrl;
        }

        // Segunda tentativa: localStorage
        const fromLs = window.localStorage.getItem('editor:funnelId');
        if (fromLs) {
            console.log('🔍 FunnelId do localStorage:', fromLs);
            return fromLs;
        }

        // Terceira tentativa: variável de ambiente
        const fromEnv = global.import.meta.env.VITE_DEFAULT_FUNNEL_ID;
        if (fromEnv) {
            console.log('🔍 FunnelId do env:', fromEnv);
            return fromEnv;
        }

        console.log('⚠️ Nenhum FunnelId encontrado, usando default');
        return 'default-funnel';
    } catch (error) {
        console.error('❌ Erro ao obter FunnelId:', error);
        return 'default-funnel';
    }
}

// Função de teste similar ao templateToFunnelCreator.ts
function testGetCurrentFunnelId() {
    try {
        const url = new URL(window.location.href);
        return url.searchParams.get('funnel');
    } catch (error) {
        console.error('❌ Erro ao obter current funnel ID:', error);
        return null;
    }
}

console.log('🧪 INICIANDO TESTE DO SISTEMA DE IDs DOS FUNIS');
console.log('='.repeat(60));

// Teste 1: Verificar se getFunnelIdFromEnvOrStorage pega da URL
console.log('\n1️⃣ TESTE: testGetFunnelIdFromEnvOrStorage()');
try {
    const funnelIdFromUrl = testGetFunnelIdFromEnvOrStorage();
    console.log('✅ ID capturado:', funnelIdFromUrl);
    if (funnelIdFromUrl === 'test-funnel-123') {
        console.log('✅ PASSOU: ID correto capturado da URL');
    } else {
        console.log('❌ FALHOU: ID esperado "test-funnel-123", recebido:', funnelIdFromUrl);
    }
} catch (error) {
    console.log('❌ ERRO:', error);
}

// Teste 2: Verificar se getCurrentFunnelId funciona
console.log('\n2️⃣ TESTE: testGetCurrentFunnelId()');
try {
    const currentId = testGetCurrentFunnelId();
    console.log('✅ ID capturado:', currentId);
    if (currentId === 'test-funnel-123') {
        console.log('✅ PASSOU: ID correto capturado');
    } else {
        console.log('❌ FALHOU: ID esperado "test-funnel-123", recebido:', currentId);
    }
} catch (error) {
    console.log('❌ ERRO:', error);
}

// Teste 3: Simular different URLs
console.log('\n3️⃣ TESTE: URLs diferentes');
const testUrls = [
    'http://localhost:5173/editor?funnel=abc-123',
    'http://localhost:5173/editor?funnel=quiz-estilo-completo',
    'http://localhost:5173/editor?funnel=novo-funil-456',
    'http://localhost:5173/editor', // Sem parâmetro
    'http://localhost:5173/editor?template=quiz-21-steps', // Parâmetro diferente
];

testUrls.forEach((url, index) => {
    console.log(`\n   Teste 3.${index + 1}: ${url}`);

    // Simular mudança de URL
    window.location = {
        href: url,
        search: url.includes('?') ? '?' + url.split('?')[1] : ''
    };

    try {
        const id = testGetFunnelIdFromEnvOrStorage();
        console.log(`   🔍 ID capturado:`, id);

        // Verificar se capturou corretamente
        if (url.includes('funnel=')) {
            const expectedId = url.split('funnel=')[1].split('&')[0];
            if (id === expectedId) {
                console.log('   ✅ PASSOU');
            } else {
                console.log(`   ❌ FALHOU: esperado "${expectedId}", recebido "${id}"`);
            }
        } else {
            if (id === 'default-funnel') {
                console.log('   ✅ PASSOU: fallback para default');
            } else {
                console.log(`   ❌ FALHOU: esperado "default-funnel", recebido "${id}"`);
            }
        }
    } catch (error) {
        console.log('   ❌ ERRO:', error);
    }
});

// Teste 4: localStorage persistence
console.log('\n4️⃣ TESTE: localStorage persistence');
try {
    // Limpar localStorage
    localStorage.removeItem('editor:funnelId');

    // Simular URL sem parâmetro
    window.location = {
        href: 'http://localhost:5173/editor',
        search: ''
    };

    // Definir ID no localStorage
    localStorage.setItem('editor:funnelId', 'stored-funnel-789');

    const id = testGetFunnelIdFromEnvOrStorage();
    console.log('🔍 ID do localStorage:', id);

    if (id === 'stored-funnel-789') {
        console.log('✅ PASSOU: localStorage funcionando');
    } else {
        console.log(`❌ FALHOU: esperado "stored-funnel-789", recebido "${id}"`);
    }
} catch (error) {
    console.log('❌ ERRO:', error);
}

console.log('\n' + '='.repeat(60));
console.log('🧪 TESTE CONCLUÍDO');

// Teste 5: Verificar se MainEditor consegue extrair funnelId
console.log('\n5️⃣ TESTE: Simulação MainEditor');
try {
    // Simular location do MainEditor
    const location = '/editor?funnel=main-editor-test&step=5';
    const params = new URLSearchParams(location.split('?')[1] || '');
    const funnelId = params.get('funnel');
    const stepParam = params.get('step');

    console.log('🔍 Location simulada:', location);
    console.log('🔍 funnelId extraído:', funnelId);
    console.log('🔍 step extraído:', stepParam);

    if (funnelId === 'main-editor-test' && stepParam === '5') {
        console.log('✅ PASSOU: MainEditor extração funciona');
    } else {
        console.log('❌ FALHOU: extração incorreta');
    }
} catch (error) {
    console.log('❌ ERRO:', error);
}

export { };
