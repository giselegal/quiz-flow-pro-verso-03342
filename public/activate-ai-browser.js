/**
 * 🤖 ATIVAÇÃO REAL DA IA NO BROWSER
 * 
 * Este script será executado no console do browser para ativar a IA
 */

// Ativar IA do Funil
import('/src/utils/funnelAIActivator.js').then(module => {
    console.log('🚀 Ativando IA do Funil...');
    const result = module.activateFunnelAI();

    if (result) {
        console.log('✅ IA DO FUNIL ATIVADA COM SUCESSO!');

        // Verificar status
        const status = module.checkFunnelAIStatus();
        console.log('📊 Status da IA:', status);

    } else {
        console.log('❌ Falha na ativação da IA');
    }
}).catch(error => {
    console.error('❌ Erro ao carregar IA:', error);
    console.log('🔄 Tentando ativação alternativa...');

    // Ativação manual
    if (window.AIEnhancedHybridTemplateService) {
        window.AIEnhancedHybridTemplateService.enableAI({
            enabled: true,
            fallbackEnabled: true,
            personalizationEnabled: true,
            optimizationEnabled: true,
            contentGenerationEnabled: true
        });
        console.log('✅ IA ativada manualmente!');
    }
});

// Também ativar outras IAs disponíveis
setTimeout(() => {
    console.log('🔄 Verificando outros sistemas de IA...');

    // Tentar ativar AI features
    if (window.useActivatedFeatures) {
        console.log('🚀 Ativando features de IA...');
    }

    // Informar usuário sobre acesso à IA
    console.log('🎯 Para acessar quiz com IA, navegue para:');
    console.log('   • /quiz-estilo (quiz padrão)');
    console.log('   • /quiz-ai-21-steps (quiz com IA avançada)');

}, 1000);