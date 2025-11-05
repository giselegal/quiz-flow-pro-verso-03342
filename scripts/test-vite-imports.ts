/**
 * Teste de imports dinâmicos usando o ambiente Vite
 * Executa via tsx para suportar TypeScript e aliases do Vite
 */

interface TestResult {
  type: string;
  path: string;
  success: boolean;
  error?: string;
  hasDefault?: boolean;
  exportKeys?: string[];
}

const componentsToTest = [
  { type: 'quiz-intro-header', path: '../src/components/editor/blocks/QuizIntroHeaderBlock' },
  { type: 'intro-title', path: '../src/components/editor/blocks/atomic/IntroTitleBlock' },
  { type: 'intro-image', path: '../src/components/editor/blocks/atomic/IntroImageBlock' },
  { type: 'intro-description', path: '../src/components/editor/blocks/atomic/IntroDescriptionBlock' },
  { type: 'intro-form', path: '../src/components/editor/blocks/atomic/IntroFormBlock' },
  
  { type: 'question-progress', path: '../src/components/editor/blocks/atomic/QuestionProgressBlock' },
  { type: 'question-title', path: '../src/components/editor/blocks/atomic/QuestionTextBlock' },
  { type: 'question-navigation', path: '../src/components/editor/blocks/atomic/QuestionNavigationBlock' },
  { type: 'options-grid', path: '../src/components/editor/blocks/OptionsGridBlock' },
  { type: 'question-hero', path: '../src/components/editor/blocks/QuizQuestionHeaderBlock' },
  
  { type: 'transition-hero', path: '../src/components/sections/transitions/index' },
  { type: 'transition-text', path: '../src/components/editor/blocks/atomic/TransitionTextBlock' },
  
  { type: 'result-congrats', path: '../src/components/editor/blocks/ResultCongratsBlock' },
  { type: 'quiz-score-display', path: '../src/components/quiz/blocks/QuizScoreDisplay' },
  { type: 'result-main', path: '../src/components/editor/blocks/atomic/ResultMainBlock' },
  { type: 'result-image', path: '../src/components/editor/blocks/atomic/ResultImageBlock' },
  { type: 'result-description', path: '../src/components/editor/blocks/atomic/ResultDescriptionBlock' },
  { type: 'result-progress-bars', path: '../src/components/editor/blocks/ResultProgressBarsBlock' },
  { type: 'result-secondary-styles', path: '../src/components/editor/blocks/atomic/ResultSecondaryStylesBlock' },
  { type: 'result-share', path: '../src/components/editor/blocks/atomic/ResultShareBlock' },
  { type: 'result-cta', path: '../src/components/editor/blocks/atomic/ResultCTABlock' },
  
  { type: 'offer-hero', path: '../src/components/editor/blocks/QuizOfferHeroBlock' },
  { type: 'pricing', path: '../src/components/sections/offer/index' },
  
  { type: 'text-inline', path: '../src/components/editor/blocks/TextInlineBlock' },
  { type: 'CTAButton', path: '../src/components/editor/blocks/atomic/CTAButtonBlock' },
];

async function testComponent(component: typeof componentsToTest[0]): Promise<TestResult> {
  try {
    const module = await import(component.path);
    const exportKeys = Object.keys(module);
    const hasDefault = 'default' in module && module.default !== undefined;
    
    return {
      type: component.type,
      path: component.path,
      success: hasDefault,
      hasDefault,
      exportKeys: exportKeys.slice(0, 10) // Primeiros 10 exports
    };
  } catch (error) {
    return {
      type: component.type,
      path: component.path,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function runTests() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║          🧪 TESTE VITE IMPORTS - COMPONENTES REACT/TS               ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');
  
  const results: TestResult[] = [];
  let successCount = 0;
  let errorCount = 0;
  
  console.log(`📦 Testando ${componentsToTest.length} componentes...\n`);
  
  for (const component of componentsToTest) {
    const result = await testComponent(component);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${component.type.padEnd(30)} → OK (default export encontrado)`);
      successCount++;
    } else {
      console.log(`❌ ${component.type.padEnd(30)} → FALHA`);
      if (result.error) {
        console.log(`   └─ Erro: ${result.error.substring(0, 80)}`);
      } else if (result.exportKeys && result.exportKeys.length > 0) {
        console.log(`   └─ Exports encontrados: ${result.exportKeys.join(', ')}`);
        console.log(`   └─ ⚠️  Falta export default!`);
      }
      errorCount++;
    }
  }
  
  console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║                           📊 RESULTADO                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`  ✅ Imports bem-sucedidos: ${successCount}`);
  console.log(`  ❌ Imports com falha:     ${errorCount}`);
  console.log(`  📊 Taxa de sucesso:       ${((successCount / componentsToTest.length) * 100).toFixed(1)}%\n`);
  
  if (errorCount > 0) {
    console.log('❌ COMPONENTES COM PROBLEMAS:\n');
    results.filter(r => !r.success).forEach(result => {
      console.log(`  • ${result.type}`);
      console.log(`    Path: ${result.path}`);
      if (result.error) {
        console.log(`    Erro: ${result.error}`);
      } else if (result.exportKeys) {
        console.log(`    Exports: ${result.exportKeys.join(', ')}`);
        console.log(`    ⚠️  Necessita adicionar export default`);
      }
      console.log('');
    });
  } else {
    console.log('🎉 SUCESSO TOTAL! Todos os componentes possuem export default correto!\n');
  }
  
  process.exit(errorCount > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('\n❌ Erro fatal ao executar testes:', error);
  process.exit(1);
});
