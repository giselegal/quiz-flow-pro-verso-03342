// Script para limpar cache conflitante e forçar uso do template correto

console.log('🧹 Limpando cache do quiz...');

// Limpar todos os dados publicados do localStorage
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('quiz_published_blocks_') || key.includes('step-'))) {
        keysToRemove.push(key);
    }
}

keysToRemove.forEach(key => {
    console.log(`🗑️ Removendo: ${key}`);
    localStorage.removeItem(key);
});

// Limpar cache de templates
if (localStorage.getItem('templateCache')) {
    localStorage.removeItem('templateCache');
    console.log('🗑️ Cache de templates removido');
}

// Limpar dados de sessão do quiz
const sessionKeys = Object.keys(sessionStorage).filter(key =>
    key.includes('quiz') || key.includes('step') || key.includes('template')
);

sessionKeys.forEach(key => {
    console.log(`🗑️ Removendo sessão: ${key}`);
    sessionStorage.removeItem(key);
});

console.log(`✅ Limpeza concluída! Removidas ${keysToRemove.length} chaves do localStorage e ${sessionKeys.length} da sessão.`);
console.log('🔄 Recarregue a página para aplicar as alterações.');

// Forçar invalidação de cache se houver algum serviço ativo
if (window.unifiedTemplateService) {
    window.unifiedTemplateService.invalidateCache();
    console.log('🗑️ Cache do UnifiedTemplateService invalidado');
}

// Mostrar alerta para o usuário
alert('Cache limpo! Recarregue a página para ver o funil correto.');