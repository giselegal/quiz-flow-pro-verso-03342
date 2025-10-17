#!/usr/bin/env node
/**
 * 🧪 TESTE RUNTIME: Verificar Templates Carregados
 * 
 * Este script testa se loadTemplate() está carregando os templates corretos
 */

// Simular ambiente Node para testar a função
console.log('\n' + '='.repeat(80));
console.log('🧪 TESTE: Verificando loadTemplate()');
console.log('='.repeat(80) + '\n');

// Teste 1: Importar a função
console.log('📦 Teste 1: Importando loadTemplate...');
try {
  const importsModule = await import('../src/templates/imports.ts');
  console.log('✅ Módulo imports.ts carregado com sucesso\n');
  
  // Teste 2: Testar carregamento de Steps 12, 19, 20
  console.log('📦 Teste 2: Carregando templates dos steps críticos...\n');
  
  const steps = ['step-12', 'step-19', 'step-20'];
  
  for (const stepId of steps) {
    console.log(`🔍 Testando ${stepId}:`);
    
    try {
      const result = await importsModule.loadTemplate(stepId);
      
      if (!result) {
        console.log(`   ❌ Retornou null\n`);
        continue;
      }
      
      console.log(`   📄 Source: ${result.source}`);
      
      // Verificar estrutura
      const template = result.template;
      const stepData = template?.[stepId];
      
      if (!stepData) {
        console.log(`   ⚠️  Dados do step não encontrados em template[${stepId}]`);
        console.log(`   📋 Keys disponíveis: ${Object.keys(template || {}).join(', ')}\n`);
        continue;
      }
      
      console.log(`   ✅ Dados encontrados em template['${stepId}']`);
      console.log(`   📊 Estrutura:`);
      console.log(`      - Version: ${stepData.templateVersion || 'N/A'}`);
      console.log(`      - Type: ${stepData.metadata?.type || stepData.type || 'N/A'}`);
      console.log(`      - Has blocks: ${!!stepData.blocks}`);
      console.log(`      - Has sections: ${!!stepData.sections}`);
      console.log(`      - Has metadata: ${!!stepData.metadata}`);
      console.log(`      - Has design: ${!!stepData.design}`);
      
      if (stepData.blocks) {
        console.log(`   🧩 Blocos (${stepData.blocks.length}):`);
        stepData.blocks.slice(0, 5).forEach((block, i) => {
          console.log(`      ${i + 1}. ${block.type} (id: ${block.id || 'N/A'})`);
        });
        if (stepData.blocks.length > 5) {
          console.log(`      ... e mais ${stepData.blocks.length - 5} blocos`);
        }
      }
      
      if (stepData.sections) {
        console.log(`   ⚠️  ATENÇÃO: Template tem sections[] (estrutura TS antiga)`);
        console.log(`      Sections: ${stepData.sections.length}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}\n`);
    }
  }
  
  // Teste 3: Verificar fallback
  console.log('📦 Teste 3: Testando fallback para step que não existe...\n');
  
  try {
    const result = await importsModule.loadTemplate('step-99');
    if (result) {
      console.log(`   ⚠️  Retornou resultado para step inexistente`);
      console.log(`   Source: ${result.source}\n`);
    } else {
      console.log(`   ✅ Retornou null como esperado\n`);
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}\n`);
  }
  
  // Resultado final
  console.log('='.repeat(80));
  console.log('✅ TESTE COMPLETO!');
  console.log('='.repeat(80));
  console.log('\n💡 INTERPRETAÇÃO:');
  console.log('   • source: "json-v2-blocks" = ✅ Carregou JSON V2 correto');
  console.log('   • source: "static-import-sections" = ⚠️  Usou fallback TS');
  console.log('   • Has blocks: true = ✅ Estrutura correta');
  console.log('   • Has sections: true = ⚠️  Estrutura TS antiga');
  console.log('   • Has metadata/design: true = ✅ Template completo V2\n');
  
} catch (error) {
  console.log(`❌ Erro ao importar: ${error.message}`);
  console.log(`   Stack: ${error.stack}`);
}
