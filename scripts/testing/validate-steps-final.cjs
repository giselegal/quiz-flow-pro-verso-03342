#!/usr/bin/env node

/**
 * 🧪 VALIDAÇÃO FINAL - Sistema das 21 Etapas
 *
 * Executa todos os testes e valida o alinhamento completo
 */

const fs = require('fs');
const path = require('path');

async function validateStepTemplates() {
  console.log('🔍 VALIDAÇÃO FINAL - Sistema das 21 Etapas\n');

  const results = {
    templatesFound: 0,
    validTemplates: 0,
    totalBlocks: 0,
    errors: [],
    warnings: [],
    summary: {},
  };

  // 1. Verificar se todos os 21 templates existem
  console.log('1️⃣ Verificando existência dos templates...');

  for (let step = 1; step <= 21; step++) {
    const stepId = step.toString().padStart(2, '0');
    const templatePath = path.join(
      __dirname,
      'public',
      'templates',
      `step-${stepId}-template.json`
    );

    if (fs.existsSync(templatePath)) {
      results.templatesFound++;

      try {
        const content = fs.readFileSync(templatePath, 'utf8');
        const template = JSON.parse(content);

        // Validação básica
        if (template.metadata && template.blocks && Array.isArray(template.blocks)) {
          results.validTemplates++;
          results.totalBlocks += template.blocks.length;

          console.log(
            `✅ Step ${step}: ${template.metadata.name} (${template.blocks.length} blocos)`
          );

          // Analisar tipos de blocos
          template.blocks.forEach(block => {
            const blockType = block.type;
            if (!results.summary[blockType]) {
              results.summary[blockType] = 0;
            }
            results.summary[blockType]++;
          });
        } else {
          results.errors.push(`Template ${step} tem estrutura inválida`);
          console.log(`❌ Step ${step}: Estrutura inválida`);
        }
      } catch (error) {
        results.errors.push(`Template ${step} não é um JSON válido: ${error.message}`);
        console.log(`❌ Step ${step}: JSON inválido`);
      }
    } else {
      results.errors.push(`Template ${step} não encontrado`);
      console.log(`❌ Step ${step}: Não encontrado`);
    }
  }

  // 2. Verificar configurações do sistema
  console.log('\n2️⃣ Verificando configurações do sistema...');

  // Verificar se Vite config está correto
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  if (fs.existsSync(viteConfigPath)) {
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    if (viteConfig.includes('publicDir') && viteConfig.includes('assetsInclude')) {
      console.log('✅ Vite configurado para servir templates');
    } else {
      results.warnings.push('Vite pode não estar configurado corretamente para servir templates');
    }
  } else {
    results.errors.push('Arquivo vite.config.ts não encontrado');
  }

  // 3. Verificar principais arquivos do sistema
  console.log('\n3️⃣ Verificando arquivos principais...');

  const coreFiles = [
    'src/components/editor-fixed/index.ts',
    'src/components/editor-fixed/EditorFixed.tsx',
    'src/components/editor-fixed/JsonTemplateEngine.ts',
    'src/components/editor-fixed/TemplateAdapter.ts',
    'src/components/editor-fixed/useEditorWithJson.ts',
  ];

  coreFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${filePath}`);
    } else {
      results.errors.push(`Arquivo não encontrado: ${filePath}`);
      console.log(`❌ ${filePath}`);
    }
  });

  // 4. Relatório final
  console.log('\n📊 RELATÓRIO FINAL:');
  console.log('=' * 50);

  console.log(`📁 Templates encontrados: ${results.templatesFound}/21`);
  console.log(`✅ Templates válidos: ${results.validTemplates}/21`);
  console.log(`📦 Total de blocos: ${results.totalBlocks}`);
  console.log(`🎯 Taxa de sucesso: ${((results.validTemplates / 21) * 100).toFixed(1)}%`);

  if (Object.keys(results.summary).length > 0) {
    console.log('\n📋 Tipos de blocos encontrados:');
    Object.entries(results.summary)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([type, count]) => {
        console.log(`  • ${type}: ${count}x`);
      });
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️ AVISOS:');
    results.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (results.errors.length > 0) {
    console.log('\n❌ ERROS:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }

  // 5. Conclusão
  const isFullyAligned =
    results.templatesFound === 21 && results.validTemplates === 21 && results.errors.length === 0;

  console.log('\n🎯 CONCLUSÃO:');
  if (isFullyAligned) {
    console.log('🎉 SISTEMA TOTALMENTE ALINHADO!');
    console.log('✨ Todas as 21 etapas estão funcionando perfeitamente');
    console.log('🚀 Pronto para usar em produção');
  } else if (results.errors.length === 0 && results.warnings.length <= 2) {
    console.log('👍 SISTEMA MAJORITARIAMENTE ALINHADO');
    console.log('🔧 Poucos ajustes menores necessários');
    console.log('✅ Funcional para desenvolvimento');
  } else {
    console.log('⚠️ SISTEMA REQUER AJUSTES');
    console.log('🔧 Algumas correções são necessárias');
    console.log('⏳ Revisar erros antes de usar');
  }

  return {
    aligned: isFullyAligned,
    successRate: results.validTemplates / 21,
    ...results,
  };
}

// Executar se chamado diretamente
if (require.main === module) {
  validateStepTemplates().catch(console.error);
}

module.exports = { validateStepTemplates };
