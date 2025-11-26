/**
 * 🧪 Script de Teste: Verificação de Duplicações em Templates
 * 
 * Verifica se há templates duplicados na página /templates
 */

import { getUnifiedTemplates, TemplateRegistry } from '../src/config/unifiedTemplatesRegistry';

console.log('🧪 TESTE: Verificação de Duplicações em Templates\n');
console.log('='.repeat(60));

// 1. Total de templates no registry
const allTemplates = TemplateRegistry.getAll();
console.log(`\n📊 Total de templates no registry: ${allTemplates.length}`);

// 2. Templates com parentTemplateId (aliases)
const aliases = allTemplates.filter(t => t.parentTemplateId);
console.log(`\n🔗 Templates que são aliases (herdam de outros): ${aliases.length}`);
if (aliases.length > 0) {
    aliases.forEach(alias => {
        console.log(`   - ${alias.id} → herda de: ${alias.parentTemplateId}`);
    });
}

// 3. Templates reais (sem aliases)
const realTemplates = allTemplates.filter(t => !t.parentTemplateId);
console.log(`\n✅ Templates reais (únicos): ${realTemplates.length}`);

// 4. Templates retornados por getUnifiedTemplates (default exclui aliases)
const templatesForUI = getUnifiedTemplates();
console.log(`\n🎨 Templates exibidos na UI (/templates): ${templatesForUI.length}`);

// 5. Verificar duplicações por nome
const nameCount = new Map<string, number>();
templatesForUI.forEach(t => {
    const count = nameCount.get(t.name) || 0;
    nameCount.set(t.name, count + 1);
});

const duplicateNames = Array.from(nameCount.entries()).filter(([_, count]) => count > 1);
if (duplicateNames.length > 0) {
    console.log(`\n⚠️ DUPLICAÇÕES ENCONTRADAS POR NOME:`);
    duplicateNames.forEach(([name, count]) => {
        console.log(`   - "${name}" aparece ${count}x`);
    });
} else {
    console.log(`\n✅ Nenhuma duplicação de nome encontrada!`);
}

// 6. Listar templates visíveis
console.log(`\n📋 Templates visíveis na página /templates:\n`);
templatesForUI
    .sort((a, b) => b.usageCount - a.usageCount)
    .forEach((t, index) => {
        console.log(`${index + 1}. ${t.name}`);
        console.log(`   ID: ${t.id}`);
        console.log(`   Categoria: ${t.category}`);
        console.log(`   Etapas: ${t.stepCount}`);
        console.log(`   Uso: ${t.usageCount} | Conversão: ${t.conversionRate}`);
        console.log('');
    });

console.log('='.repeat(60));
console.log('✅ Teste concluído!\n');
