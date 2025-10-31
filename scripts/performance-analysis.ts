/**
 * 🎯 PERFORMANCE ANALYSIS SCRIPT
 * 
 * Script para análise de métricas de performance do editor.
 * Acessa o profiler exposto em window.__performanceProfiler
 */

// Executar no console do navegador após usar o editor:
// 
// 1. Abrir editor: http://localhost:5173/editor
// 2. Interagir: adicionar blocks, drag/drop, salvar, navegar entre steps
// 3. Copiar e colar este script no console:

(() => {
  const profiler = (window as any).__performanceProfiler;
  
  if (!profiler) {
    console.error('❌ Performance Profiler não encontrado. Certifique-se de estar em modo DEV.');
    return;
  }

  console.log('📊 ANÁLISE DE PERFORMANCE - Quiz Flow Pro');
  console.log('='.repeat(60));
  console.log('');

  // Relatório completo
  const report = profiler.generateReport();
  console.log(report);

  // Análise de re-renders
  console.log('🔄 ANÁLISE DE RE-RENDERS:');
  console.log('-'.repeat(60));
  
  const editorCount = profiler.getRenderCount('QuizModularProductionEditor');
  console.log(`📝 QuizModularProductionEditor: ${editorCount} renders`);
  
  const blockComponents = [
    'TitleBlock',
    'ImageBlock', 
    'ButtonBlock',
    'TextBlock',
    'QuestionTextBlock',
    'OptionsBlock',
    'FormInputBlock',
    'ResultBlock',
    'TransitionBlock',
    'OfferBlock',
    'QuizIntroHeaderBlock'
  ];
  
  console.log('');
  console.log('📦 Componentes de Block:');
  blockComponents.forEach(name => {
    const count = profiler.getRenderCount(name);
    if (count > 0) {
      console.log(`  • ${name}: ${count} renders`);
    }
  });
  
  // Métricas de operações
  console.log('');
  console.log('⚙️  MÉTRICAS DE OPERAÇÕES:');
  console.log('-'.repeat(60));
  
  const operations = profiler.getMetricsByCategory('operation');
  if (operations.length > 0) {
    const byName = new Map<string, number[]>();
    
    operations.forEach(op => {
      if (!byName.has(op.name)) {
        byName.set(op.name, []);
      }
      byName.get(op.name)!.push(op.duration || 0);
    });
    
    Array.from(byName.entries())
      .sort((a, b) => {
        const avgA = a[1].reduce((s, d) => s + d, 0) / a[1].length;
        const avgB = b[1].reduce((s, d) => s + d, 0) / b[1].length;
        return avgB - avgA;
      })
      .forEach(([name, durations]) => {
        const total = durations.reduce((s, d) => s + d, 0);
        const avg = total / durations.length;
        const max = Math.max(...durations);
        console.log(`  • ${name}:`);
        console.log(`    - Chamadas: ${durations.length}`);
        console.log(`    - Média: ${avg.toFixed(2)}ms`);
        console.log(`    - Total: ${total.toFixed(2)}ms`);
        console.log(`    - Pico: ${max.toFixed(2)}ms`);
      });
  } else {
    console.log('  Nenhuma operação registrada. Interaja com o editor.');
  }
  
  // Recomendações
  console.log('');
  console.log('💡 RECOMENDAÇÕES:');
  console.log('-'.repeat(60));
  
  if (editorCount > 50) {
    console.warn(`⚠️  Editor renderizou ${editorCount} vezes - considere otimizar dependências de useEffect`);
  } else if (editorCount > 20) {
    console.log(`✅ Editor renderizou ${editorCount} vezes - aceitável para sessão de uso`);
  } else {
    console.log(`🎯 Editor renderizou ${editorCount} vezes - excelente!`);
  }
  
  const slowOps = operations.filter(op => (op.duration || 0) > 100);
  if (slowOps.length > 0) {
    console.warn(`⚠️  ${slowOps.length} operações lentas (>100ms) detectadas:`);
    slowOps.forEach(op => {
      console.warn(`    • ${op.name}: ${op.duration?.toFixed(2)}ms`);
    });
  } else {
    console.log('✅ Nenhuma operação lenta detectada');
  }
  
  // Exportar para análise posterior
  console.log('');
  console.log('📥 EXPORTAR DADOS:');
  console.log('-'.repeat(60));
  console.log('Para exportar dados completos:');
  console.log('  copy(window.__performanceProfiler.getAllMetrics())');
  console.log('');
  console.log('Para limpar métricas:');
  console.log('  window.__performanceProfiler.clear()');
  console.log('');
  console.log('Para resetar contagem de renders:');
  console.log('  window.__performanceProfiler.resetRenderCounts()');
})();

export {};
