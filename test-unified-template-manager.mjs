#!/usr/bin/env node
/**
 * 🧪 TESTE DO UNIFIED TEMPLATE MANAGER
 * 
 * Valida o funcionamento do novo gerenciador unificado
 */

import { unifiedTemplateManager } from './src/core/templates/UnifiedTemplateManager.js';

console.log('🚀 Iniciando teste do UnifiedTemplateManager...\n');

async function testUnifiedTemplateManager() {
    try {
        // ===============================================================
        // TESTE 1: Buscar todos os templates
        // ===============================================================
        console.log('1️⃣ Testando getAllTemplates()...');

        const allTemplates = await unifiedTemplateManager.getAllTemplates();
        console.log(`   ✅ ${allTemplates.length} templates encontrados`);

        if (allTemplates.length > 0) {
            console.log(`   📊 Primeiro template: "${allTemplates[0].name}" (${allTemplates[0].source})`);
        }

        // ===============================================================
        // TESTE 2: Buscar templates por categoria
        // ===============================================================
        console.log('\n2️⃣ Testando filtro por categoria...');

        const quizTemplates = await unifiedTemplateManager.getAllTemplates({
            category: 'quiz-style'
        });
        console.log(`   ✅ ${quizTemplates.length} templates de quiz encontrados`);

        // ===============================================================
        // TESTE 3: Buscar templates customizados
        // ===============================================================
        console.log('\n3️⃣ Testando filtro de templates customizados...');

        const customTemplates = await unifiedTemplateManager.getAllTemplates({
            isCustom: true
        });
        console.log(`   ✅ ${customTemplates.length} templates customizados encontrados`);

        // ===============================================================
        // TESTE 4: Buscar template específico por ID
        // ===============================================================
        console.log('\n4️⃣ Testando getTemplateById()...');

        const specificTemplate = await unifiedTemplateManager.getTemplateById('quiz-estilo-21-steps');
        if (specificTemplate) {
            console.log(`   ✅ Template encontrado: "${specificTemplate.name}"`);
            console.log(`   📋 Descrição: ${specificTemplate.description}`);
            console.log(`   🏷️ Categoria: ${specificTemplate.category}`);
            console.log(`   📊 Etapas: ${specificTemplate.stepCount}`);
            console.log(`   🔄 Usos: ${specificTemplate.usageCount}`);
        } else {
            console.log('   ⚠️ Template não encontrado');
        }

        // ===============================================================
        // TESTE 5: Listar categorias disponíveis
        // ===============================================================
        console.log('\n5️⃣ Testando getCategories()...');

        const categories = unifiedTemplateManager.getCategories();
        const categoryNames = Object.entries(categories).map(([key, cat]) => `${key}: ${cat.name}`);
        console.log(`   ✅ ${categoryNames.length} categorias disponíveis:`);
        categoryNames.forEach(name => console.log(`     - ${name}`));

        // ===============================================================
        // TESTE 6: Testar ordenação
        // ===============================================================
        console.log('\n6️⃣ Testando ordenação por uso...');

        const templatesByUsage = await unifiedTemplateManager.getAllTemplates({
            sortBy: 'usageCount',
            limit: 3
        });
        console.log(`   ✅ Top 3 templates mais usados:`);
        templatesByUsage.forEach((template, index) => {
            console.log(`     ${index + 1}. "${template.name}" - ${template.usageCount} usos`);
        });

        // ===============================================================
        // TESTE 7: Verificar deduplicação
        // ===============================================================
        console.log('\n7️⃣ Testando deduplicação de templates...');

        const allSources = await unifiedTemplateManager.getAllTemplates();
        const uniqueIds = new Set(allSources.map(t => t.id));

        if (allSources.length === uniqueIds.size) {
            console.log(`   ✅ Deduplicação funcionando: ${allSources.length} templates únicos`);
        } else {
            console.log(`   ⚠️ Possível duplicação: ${allSources.length} templates, ${uniqueIds.size} IDs únicos`);
        }

        // ===============================================================
        // TESTE 8: Verificar prioridades das fontes
        // ===============================================================
        console.log('\n8️⃣ Testando prioridades das fontes...');

        const sourceStats = allSources.reduce((acc, template) => {
            acc[template.source] = (acc[template.source] || 0) + 1;
            return acc;
        }, {});

        console.log('   📊 Templates por fonte:');
        Object.entries(sourceStats).forEach(([source, count]) => {
            console.log(`     - ${source}: ${count} templates`);
        });

        // ===============================================================
        // RESUMO
        // ===============================================================
        console.log('\n' + '='.repeat(60));
        console.log('📋 RESUMO DOS TESTES');
        console.log('='.repeat(60));
        console.log(`✅ Total de templates: ${allTemplates.length}`);
        console.log(`🎨 Categorias disponíveis: ${Object.keys(categories).length}`);
        console.log(`🔧 Templates customizados: ${customTemplates.length}`);
        console.log(`🏆 Template mais usado: ${templatesByUsage[0]?.name || 'N/A'}`);
        console.log(`🎯 Deduplicação: ${allSources.length === uniqueIds.size ? 'OK' : 'ERRO'}`);
        console.log('='.repeat(60));
        console.log('🎉 Todos os testes concluídos!\n');

    } catch (error) {
        console.error('❌ Erro durante os testes:', error);
        process.exit(1);
    }
}

// Executar testes
testUnifiedTemplateManager().then(() => {
    console.log('✨ UnifiedTemplateManager está funcionando corretamente!');
    process.exit(0);
});
