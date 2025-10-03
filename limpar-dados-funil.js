/**
 * 🧹 SCRIPT PARA LIMPAR DADOS ALTERADOS E RESTAURAR MODELO PADRÃO
 * 
 * Execute este script no console do browser para:
 * 1. Limpar todos os dados alterados do funil
 * 2. Restaurar ao modelo padrão original
 * 3. Remover cache e dados temporários
 */

console.log('🧹 === LIMPANDO DADOS ALTERADOS DO FUNIL === 🧹');

// 1. LIMPAR LOCALSTORAGE
console.log('📝 Limpando localStorage...');
const keysToRemove = [];

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
        key.includes('funnel') ||
        key.includes('quiz') ||
        key.includes('editor') ||
        key.includes('unified') ||
        key.includes('crud') ||
        key.includes('step') ||
        key.includes('WYSIWYG') ||
        key.includes('contextual')
    )) {
        keysToRemove.push(key);
    }
}

console.log(`Encontradas ${keysToRemove.length} chaves para remover:`, keysToRemove);

keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removido: ${key}`);
});

// 2. LIMPAR INDEXEDDB
console.log('🗃️ Limpando IndexedDB...');

// Tentar limpar QuizQuestEditorDB
const deleteDB = (dbName) => {
    return new Promise((resolve, reject) => {
        const deleteReq = indexedDB.deleteDatabase(dbName);
        deleteReq.onerror = () => reject(deleteReq.error);
        deleteReq.onsuccess = () => {
            console.log(`✅ IndexedDB ${dbName} removido com sucesso`);
            resolve();
        };
        deleteReq.onblocked = () => {
            console.warn(`⚠️ IndexedDB ${dbName} bloqueado - feche outras abas`);
        };
    });
};

// Lista de bancos IndexedDB para limpar
const dbsToDelete = [
    'QuizQuestEditorDB',
    'FunnelUnifiedDB',
    'EditorStorage',
    'UnifiedCRUDDB'
];

Promise.all(dbsToDelete.map(db => deleteDB(db).catch(err => console.log(`DB ${db} não encontrado ou erro:`, err))))
    .then(() => {
        console.log('✅ Limpeza do IndexedDB concluída');
    });

// 3. LIMPAR SESSIONSTORAGE
console.log('💾 Limpando sessionStorage...');
const sessionKeysToRemove = [];

for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (
        key.includes('funnel') ||
        key.includes('quiz') ||
        key.includes('editor')
    )) {
        sessionKeysToRemove.push(key);
    }
}

sessionKeysToRemove.forEach(key => {
    sessionStorage.removeItem(key);
    console.log(`✅ SessionStorage removido: ${key}`);
});

// 4. LIMPAR CACHE DO REACT (se existir)
console.log('⚛️ Tentando limpar cache do React...');
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React DevTools detectado - limpeza de cache disponível');
}

// 5. RECARREGAR PÁGINA PARA ESTADO LIMPO
console.log('🔄 Recarregando página para aplicar estado limpo...');

setTimeout(() => {
    console.log('✅ === LIMPEZA CONCLUÍDA === ✅');
    console.log('🎯 O funil foi restaurado ao modelo padrão original');
    console.log('📝 Dados alterados foram removidos');
    console.log('🔄 Recarregue a página se necessário');

    // Auto-reload após 2 segundos
    setTimeout(() => {
        if (confirm('Deseja recarregar a página agora para aplicar as mudanças?')) {
            window.location.reload();
        }
    }, 2000);
}, 1000);