/**
 * Teste específico da Etapa 20 - Resultado Final com Score
 * Verifica todos os blocos usados na step-20
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface TestResult {
  blockId: string;
  blockType: string;
  success: boolean;
  error?: string;
  hasDefault?: boolean;
  componentName?: string;
}

async function testBlockComponent(blockType: string, blockId: string): Promise<TestResult> {
  const componentMap: Record<string, string> = {
    'result-congrats': '../src/components/editor/blocks/ResultCongratsBlock',
    'quiz-score-display': '../src/components/quiz/blocks/QuizScoreDisplay',
    'result-main': '../src/components/editor/blocks/atomic/ResultMainBlock',
    'result-image': '../src/components/editor/blocks/atomic/ResultImageBlock',
    'result-description': '../src/components/editor/blocks/atomic/ResultDescriptionBlock',
    'result-progress-bars': '../src/components/editor/blocks/ResultProgressBarsBlock',
    'result-secondary-styles': '../src/components/editor/blocks/atomic/ResultSecondaryStylesBlock',
    'result-share': '../src/components/editor/blocks/atomic/ResultShareBlock',
    'result-cta': '../src/components/editor/blocks/atomic/ResultCTABlock',
    'text-inline': '../src/components/editor/blocks/TextInlineBlock',
  };

  const componentPath = componentMap[blockType];
  
  if (!componentPath) {
    return {
      blockId,
      blockType,
      success: false,
      error: `Tipo de bloco '${blockType}' não mapeado`
    };
  }

  try {
    const module = await import(componentPath);
    const hasDefault = 'default' in module && module.default !== undefined;
    const componentName = module.default?.name || module.default?.displayName || 'Anônimo';
    
    return {
      blockId,
      blockType,
      success: hasDefault,
      hasDefault,
      componentName
    };
  } catch (error) {
    return {
      blockId,
      blockType,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function runTest() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║              🧪 TESTE STEP-20 - RESULTADO FINAL                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');

  // Carregar quiz21-complete.json
  const quizPath = join(process.cwd(), 'public/templates/quiz21-complete.json');
  const quizData = JSON.parse(readFileSync(quizPath, 'utf-8'));
  
  const step20 = quizData.steps['step-20'];
  
  if (!step20) {
    console.error('❌ Step-20 não encontrada no quiz21-complete.json');
    process.exit(1);
  }

  console.log('📋 Informações da Step-20:');
  console.log(`   Tipo: ${step20.type}`);
  console.log(`   Nome: ${step20.metadata.name}`);
  console.log(`   Categoria: ${step20.metadata.category}`);
  console.log(`   Total de blocos: ${step20.blocks.length}\n`);

  console.log('🔍 Testando imports de todos os blocos...\n');

  const results: TestResult[] = [];
  let successCount = 0;
  let errorCount = 0;

  // Testar cada bloco
  for (const block of step20.blocks) {
    if (!block.properties?.enabled) {
      console.log(`⏭️  ${block.type.padEnd(30)} [${block.id}] → Desabilitado (pulando)`);
      continue;
    }

    const result = await testBlockComponent(block.type, block.id);
    results.push(result);

    if (result.success) {
      console.log(`✅ ${block.type.padEnd(30)} [${block.id}]`);
      console.log(`   └─ Componente: ${result.componentName}`);
      successCount++;
    } else {
      console.log(`❌ ${block.type.padEnd(30)} [${block.id}]`);
      if (result.error) {
        console.log(`   └─ Erro: ${result.error.substring(0, 80)}`);
      }
      errorCount++;
    }
  }

  console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║                           📊 RESULTADO                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');

  console.log(`  📦 Total de blocos na Step-20: ${step20.blocks.length}`);
  console.log(`  ✅ Blocos funcionais:          ${successCount}`);
  console.log(`  ❌ Blocos com erro:            ${errorCount}`);
  console.log(`  ⏭️  Blocos desabilitados:       ${step20.blocks.length - successCount - errorCount}`);
  
  const enabledBlocks = step20.blocks.filter((b: any) => b.properties?.enabled !== false);
  const rate = enabledBlocks.length > 0 ? ((successCount / enabledBlocks.length) * 100).toFixed(1) : 0;
  console.log(`  📊 Taxa de sucesso:            ${rate}%\n`);

  if (errorCount > 0) {
    console.log('❌ BLOCOS COM PROBLEMAS:\n');
    results.filter(r => !r.success).forEach(result => {
      console.log(`  • ${result.blockType} [${result.blockId}]`);
      if (result.error) {
        console.log(`    Erro: ${result.error}`);
      }
      console.log('');
    });
  } else if (successCount === enabledBlocks.length) {
    console.log('🎉 SUCESSO TOTAL! Todos os blocos habilitados da Step-20 estão funcionando!\n');
  }

  // Detalhe dos blocos testados
  console.log('📋 BLOCOS TESTADOS NA STEP-20:\n');
  step20.blocks.forEach((block: any, index: number) => {
    const result = results.find(r => r.blockId === block.id);
    const status = block.properties?.enabled === false ? '⏭️ ' : (result?.success ? '✅' : '❌');
    console.log(`  ${index + 1}. ${status} ${block.type} [${block.id}]`);
    console.log(`     Order: ${block.order} | Enabled: ${block.properties?.enabled !== false}`);
  });

  process.exit(errorCount > 0 ? 1 : 0);
}

runTest().catch(error => {
  console.error('\n❌ Erro fatal ao executar teste:', error);
  process.exit(1);
});
