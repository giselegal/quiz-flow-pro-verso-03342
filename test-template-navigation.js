// Teste rápido de navegação para template
// Execute no console do browser em /editor-templates

// Simular seleção de template
const templateId = 'quiz-estilo-21-steps';
console.log('🧪 Testando seleção de template:', templateId);

// Verificar se a função está disponível
if (typeof handleSelectTemplate === 'function') {
    handleSelectTemplate(templateId);
} else {
    console.log('❌ handleSelectTemplate não está disponível');
    console.log('💡 Clique em um template para testar');
}
