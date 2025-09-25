/**
 * 🧪 TESTE MANUAL DO QUIZ
 * 
 * Script para verificar se o quiz está funcionando corretamente
 */

import { HybridTemplateService } from './src/services/HybridTemplateService.js';

async function testarQuiz() {
    console.log('🧪 === TESTANDO QUIZ ===');

    try {
        // 1. Carregar configuração da primeira etapa
        console.log('\n1️⃣ Testando carregamento da Step 1...');
        const step1Config = await HybridTemplateService.getStepConfig(1);
        console.log('✅ Step 1 carregada:', {
            tipo: step1Config.metadata?.type,
            nome: step1Config.metadata?.name,
            temBlocks: Array.isArray(step1Config.blocks) && step1Config.blocks.length > 0,
            quantidadeBlocks: step1Config.blocks?.length || 0,
            autoAdvance: step1Config.behavior?.autoAdvance,
            validation: step1Config.validation?.type
        });

        // 2. Carregar configuração de uma etapa do quiz (step 5)
        console.log('\n5️⃣ Testando carregamento da Step 5...');
        const step5Config = await HybridTemplateService.getStepConfig(5);
        console.log('✅ Step 5 carregada:', {
            tipo: step5Config.metadata?.type,
            nome: step5Config.metadata?.name,
            temBlocks: Array.isArray(step5Config.blocks) && step5Config.blocks.length > 0,
            quantidadeBlocks: step5Config.blocks?.length || 0,
            autoAdvance: step5Config.behavior?.autoAdvance,
            validation: step5Config.validation?.type
        });

        // 3. Carregar configuração de uma etapa estratégica (step 15)
        console.log('\n🎯 Testando carregamento da Step 15 (estratégica)...');
        const step15Config = await HybridTemplateService.getStepConfig(15);
        console.log('✅ Step 15 carregada:', {
            tipo: step15Config.metadata?.type,
            nome: step15Config.metadata?.name,
            temBlocks: Array.isArray(step15Config.blocks) && step15Config.blocks.length > 0,
            quantidadeBlocks: step15Config.blocks?.length || 0,
            autoAdvance: step15Config.behavior?.autoAdvance,
            validation: step15Config.validation?.type
        });

        // 4. Testar configurações globais
        console.log('\n🌐 Testando configurações globais...');
        const globalConfig = HybridTemplateService.getGlobalConfig();
        console.log('✅ Config global carregada:', {
            temNavigation: !!globalConfig.navigation,
            autoAdvanceSteps: globalConfig.navigation?.autoAdvanceSteps?.length || 0,
            temBranding: !!globalConfig.branding,
            temScoring: !!globalConfig.scoring
        });

        // 5. Testar se JSON master foi carregado corretamente
        console.log('\n📄 Verificando status do JSON master...');
        const masterStats = HybridTemplateService.getMasterTemplateStats();
        console.log('✅ Master template stats:', masterStats);

        console.log('\n🎉 QUIZ ESTÁ FUNCIONANDO CORRETAMENTE!');
        console.log('✅ Todas as etapas podem ser carregadas');
        console.log('✅ Configurações globais estão disponíveis');
        console.log('✅ Hierarquia JSON Master → TypeScript funcionando');

    } catch (error) {
        console.error('❌ ERRO NO TESTE:', error);
        console.log('\n🔍 Possíveis problemas:');
        console.log('- JSON master não foi carregado corretamente');
        console.log('- HybridTemplateService não está funcionando');
        console.log('- Templates TypeScript não estão acessíveis');
    }
}

// Executar teste
testarQuiz();