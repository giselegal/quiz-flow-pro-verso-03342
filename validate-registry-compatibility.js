/**
 * 🔍 VALIDADOR DE REGISTRY - Verifica compatibilidade de templates
 *
 * Analisa se todos os tipos de blocos dos templates existem no registry
 */

import fs from 'fs';
import path from 'path';
import { ENHANCED_BLOCK_REGISTRY } from '../src/config/enhancedBlockRegistry.js';

export async function validateRegistryCompatibility() {
  console.log('🔍 VALIDAÇÃO DO REGISTRY - Verificando compatibilidade...\n');

  const results = {
    totalBlocks: 0,
    validBlocks: 0,
    invalidBlocks: 0,
    missingComponents: new Set(),
    blockTypeStats: {},
    templateStats: {},
    errors: [],
    warnings: [],
  };

  // 1. Obter todos os tipos disponíveis no registry
  const availableTypes = Object.keys(ENHANCED_BLOCK_REGISTRY);
  console.log(`📦 Componentes disponíveis no registry: ${availableTypes.length}`);
  console.log(
    `📋 Tipos: ${availableTypes.slice(0, 10).join(', ')}${availableTypes.length > 10 ? '...' : ''}\n`
  );

  // 2. Analisar todos os templates
  console.log('1️⃣ Analisando templates...');

  for (let step = 1; step <= 21; step++) {
    const stepId = step.toString().padStart(2, '0');
    const templatePath = path.join(
      process.cwd(),
      'public',
      'templates',
      `step-${stepId}-template.json`
    );

    if (fs.existsSync(templatePath)) {
      try {
        const content = fs.readFileSync(templatePath, 'utf8');
        const template = JSON.parse(content);

        results.templateStats[step] = {
          name: template.metadata?.name || `Step ${step}`,
          blocks: template.blocks?.length || 0,
          validBlocks: 0,
          invalidBlocks: 0,
          missingTypes: [],
        };

        // Analisar cada bloco
        if (template.blocks && Array.isArray(template.blocks)) {
          template.blocks.forEach(block => {
            results.totalBlocks++;
            const blockType = block.type;

            // Contar estatísticas por tipo
            if (!results.blockTypeStats[blockType]) {
              results.blockTypeStats[blockType] = {
                count: 0,
                exists: availableTypes.includes(blockType),
                usedInSteps: [],
              };
            }
            results.blockTypeStats[blockType].count++;
            results.blockTypeStats[blockType].usedInSteps.push(step);

            // Verificar se existe no registry
            if (availableTypes.includes(blockType)) {
              results.validBlocks++;
              results.templateStats[step].validBlocks++;
            } else {
              results.invalidBlocks++;
              results.templateStats[step].invalidBlocks++;
              results.templateStats[step].missingTypes.push(blockType);
              results.missingComponents.add(blockType);

              results.warnings.push(
                `Step ${step}: Bloco '${blockType}' não encontrado no registry`
              );
            }
          });
        }

        const status = results.templateStats[step].invalidBlocks === 0 ? '✅' : '⚠️';
        console.log(
          `${status} Step ${step}: ${results.templateStats[step].validBlocks}/${results.templateStats[step].blocks} blocos válidos`
        );
      } catch (error) {
        results.errors.push(`Erro ao processar Step ${step}: ${error.message}`);
        console.log(`❌ Step ${step}: Erro ao processar`);
      }
    } else {
      results.errors.push(`Template Step ${step} não encontrado`);
      console.log(`❌ Step ${step}: Template não encontrado`);
    }
  }

  // 3. Relatório detalhado
  console.log('\n📊 RELATÓRIO DE COMPATIBILIDADE:');
  console.log('='.repeat(50));

  console.log(`📦 Total de blocos analisados: ${results.totalBlocks}`);
  console.log(
    `✅ Blocos válidos: ${results.validBlocks} (${((results.validBlocks / results.totalBlocks) * 100).toFixed(1)}%)`
  );
  console.log(
    `⚠️ Blocos inválidos: ${results.invalidBlocks} (${((results.invalidBlocks / results.totalBlocks) * 100).toFixed(1)}%)`
  );

  // 4. Tipos de blocos não encontrados
  if (results.missingComponents.size > 0) {
    console.log('\n❌ COMPONENTES AUSENTES NO REGISTRY:');
    Array.from(results.missingComponents).forEach(componentType => {
      const stats = results.blockTypeStats[componentType];
      console.log(
        `  • ${componentType}: ${stats.count}x (usado nos steps: ${stats.usedInSteps.join(', ')})`
      );
    });
  }

  // 5. Top 10 tipos de blocos mais usados
  console.log('\n📋 TIPOS DE BLOCOS MAIS UTILIZADOS:');
  Object.entries(results.blockTypeStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .forEach(([type, stats]) => {
      const status = stats.exists ? '✅' : '❌';
      console.log(`  ${status} ${type}: ${stats.count}x`);
    });

  // 6. Templates com problemas
  const problemTemplates = Object.entries(results.templateStats)
    .filter(([_, stats]) => stats.invalidBlocks > 0)
    .map(([step, stats]) => ({ step: parseInt(step), ...stats }));

  if (problemTemplates.length > 0) {
    console.log('\n⚠️ TEMPLATES QUE PRECISAM DE ATENÇÃO:');
    problemTemplates.forEach(template => {
      console.log(
        `  • Step ${template.step} (${template.name}): ${template.invalidBlocks} blocos inválidos`
      );
      template.missingTypes.forEach(type => {
        console.log(`    - Tipo ausente: ${type}`);
      });
    });
  }

  // 7. Recomendações
  console.log('\n🔧 RECOMENDAÇÕES:');

  if (results.missingComponents.size > 0) {
    console.log('1️⃣ Adicionar os seguintes componentes ao ENHANCED_BLOCK_REGISTRY:');
    Array.from(results.missingComponents).forEach(type => {
      console.log(`   - ${type}`);
    });
  }

  if (results.invalidBlocks > 0) {
    console.log('2️⃣ Criar fallbacks para componentes ausentes no TemplateAdapter');
    console.log('3️⃣ Atualizar templates para usar componentes existentes');
  }

  // 8. Conclusão
  const compatibilityRate = results.validBlocks / results.totalBlocks;
  console.log('\n🎯 CONCLUSÃO:');

  if (compatibilityRate >= 0.95) {
    console.log('🎉 EXCELENTE COMPATIBILIDADE!');
    console.log('✨ Registry está quase 100% compatível com os templates');
  } else if (compatibilityRate >= 0.8) {
    console.log('👍 BOA COMPATIBILIDADE');
    console.log('🔧 Alguns ajustes menores necessários');
  } else if (compatibilityRate >= 0.6) {
    console.log('⚠️ COMPATIBILIDADE MODERADA');
    console.log('🔧 Vários componentes precisam ser adicionados');
  } else {
    console.log('❌ BAIXA COMPATIBILIDADE');
    console.log('🚧 Registry precisa de muitas adições');
  }

  return {
    compatibilityRate,
    missingComponents: Array.from(results.missingComponents),
    ...results,
  };
}

// Executar se chamado diretamente
if (process.argv[1] === new URL(import.meta.url).pathname) {
  validateRegistryCompatibility().catch(console.error);
}
