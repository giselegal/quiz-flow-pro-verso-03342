/**
 * 🔄 RESTAURAR MODELO PADRÃO DO FUNIL
 * 
 * Este script restaura completamente o funil ao estado original,
 * removendo todas as alterações feitas no editor.
 */

// Função principal para restaurar modelo padrão
function restaurarModeloPadrao() {
    console.log('🔄 === INICIANDO RESTAURAÇÃO DO MODELO PADRÃO === 🔄');

    try {
        // 1. LIMPAR TODOS OS DADOS SALVOS
        limparDadosSalvos();

        // 2. RESETAR ESTADO DO REACT
        resetarEstadoReact();

        // 3. LIMPAR CACHE DO NAVEGADOR
        limparCacheNavegador();

        // 4. RESTAURAR DADOS ORIGINAIS
        restaurarDadosOriginais();

        console.log('✅ === RESTAURAÇÃO CONCLUÍDA === ✅');
        console.log('🎯 Funil restaurado ao modelo padrão original');

        // Recarregar automaticamente após 3 segundos
        let countdown = 3;
        const interval = setInterval(() => {
            console.log(`🔄 Recarregando em ${countdown}...`);
            countdown--;
            if (countdown <= 0) {
                clearInterval(interval);
                window.location.reload();
            }
        }, 1000);

    } catch (error) {
        console.error('❌ Erro durante restauração:', error);
        console.log('🔄 Tentando recarregar página para forçar reset...');
        setTimeout(() => window.location.reload(), 2000);
    }
}

// 1. LIMPAR TODOS OS DADOS SALVOS
function limparDadosSalvos() {
    console.log('🧹 Limpando dados salvos...');

    // Lista completa de prefixos para limpar
    const prefixosParaLimpar = [
        'unified_funnel',
        'funnel_unified',
        'quiz_data',
        'quiz_steps',
        'editor_state',
        'wysiwyg_',
        'crud_',
        'contextual_',
        'template_',
        'schema_',
        'draft_',
        'autosave_',
        'history_',
        'cache_'
    ];

    // Limpar localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const shouldRemove = prefixosParaLimpar.some(prefix =>
                key.toLowerCase().includes(prefix.toLowerCase())
            );
            if (shouldRemove) {
                keysToRemove.push(key);
            }
        }
    }

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`✅ Removido localStorage: ${key}`);
    });

    // Limpar sessionStorage
    const sessionKeys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
            const shouldRemove = prefixosParaLimpar.some(prefix =>
                key.toLowerCase().includes(prefix.toLowerCase())
            );
            if (shouldRemove) {
                sessionKeys.push(key);
            }
        }
    }

    sessionKeys.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`✅ Removido sessionStorage: ${key}`);
    });
}

// 2. RESETAR ESTADO DO REACT
function resetarEstadoReact() {
    console.log('⚛️ Resetando estado do React...');

    // Tentar acessar o contexto do React se disponível
    if (window.React && window.React.version) {
        console.log(`React ${window.React.version} detectado`);
    }

    // Limpar qualquer cache de componentes
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        console.log('React DevTools detectado - cache será limpo no reload');
    }

    // Limpar variáveis globais relacionadas ao editor
    const globalsToReset = [
        '__EDITOR_STATE__',
        '__FUNNEL_DATA__',
        '__QUIZ_STATE__',
        '__WYSIWYG_STATE__',
        '__DISABLE_EDITOR_PERSISTENCE__'
    ];

    globalsToReset.forEach(global => {
        if (window[global]) {
            delete window[global];
            console.log(`✅ Resetado global: ${global}`);
        }
    });
}

// 3. LIMPAR CACHE DO NAVEGADOR
function limparCacheNavegador() {
    console.log('🗄️ Limpando cache do navegador...');

    // Forçar limpeza de cache se APIs estiverem disponíveis
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName.includes('quiz') || cacheName.includes('editor') ||
                        cacheName.includes('funnel')) {
                        console.log(`✅ Removendo cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).catch(err => console.log('Cache cleanup error:', err));
    }
}

// 4. RESTAURAR DADOS ORIGINAIS
function restaurarDadosOriginais() {
    console.log('📋 Restaurando dados originais...');

    // Marcar que queremos usar dados originais
    localStorage.setItem('USE_ORIGINAL_QUIZ_DATA', 'true');
    localStorage.setItem('FORCE_RESET_EDITOR', 'true');
    localStorage.setItem('CLEAR_ALL_DRAFTS', 'true');

    console.log('✅ Flags de restauração definidas');
}

// 5. LIMPAR INDEXEDDB COMPLETAMENTE
function limparIndexedDB() {
    console.log('🗃️ Limpando IndexedDB...');

    const databasesToDelete = [
        'QuizQuestEditorDB',
        'FunnelUnifiedDB',
        'EditorStorageDB',
        'CRUDServiceDB',
        'ContextualFunnelDB'
    ];

    databasesToDelete.forEach(dbName => {
        const deleteReq = indexedDB.deleteDatabase(dbName);
        deleteReq.onsuccess = () => console.log(`✅ IndexedDB removido: ${dbName}`);
        deleteReq.onerror = (err) => console.log(`⚠️ Erro ao remover ${dbName}:`, err);
        deleteReq.onblocked = () => console.log(`⚠️ ${dbName} bloqueado - feche outras abas`);
    });
}

// EXECUTAR RESTAURAÇÃO
console.log('🎯 Para restaurar o modelo padrão do funil, execute:');
console.log('restaurarModeloPadrao()');

// Auto-executar se chamado diretamente
if (typeof window !== 'undefined' && window.location) {
    // Verificar se deve auto-executar
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('restore') === 'true') {
        console.log('🔄 Auto-executando restauração...');
        setTimeout(restaurarModeloPadrao, 1000);
    }
}

// Exportar função para uso manual
window.restaurarModeloPadrao = restaurarModeloPadrao;
window.limparIndexedDB = limparIndexedDB;