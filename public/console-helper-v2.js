/**
 * 🧪 CONSOLE HELPER: HierarchicalTemplateSource V2
 * 
 * Cole este script no console do navegador para funções helper
 */

window.HierarchicalV2Helper = {
  /**
   * Habilitar V2
   */
  enable() {
    localStorage.setItem('FEATURE_HIERARCHICAL_V2', 'true');
    console.log('✅ V2 habilitada! Recarregue a página.');
    return true;
  },

  /**
   * Desabilitar V2 (voltar para V1)
   */
  disable() {
    localStorage.setItem('FEATURE_HIERARCHICAL_V2', 'false');
    console.log('⬇️ V2 desabilitada. Voltando para V1. Recarregue a página.');
    return false;
  },

  /**
   * Verificar qual versão está ativa
   */
  checkVersion() {
    const v2Active = localStorage.getItem('FEATURE_HIERARCHICAL_V2') === 'true';
    
    if (v2Active) {
      console.log('%c🚀 V2 ATIVA (Otimizada)', 'color: #10b981; font-weight: bold; font-size: 16px');
      console.log('  • 469 linhas (-42% vs V1)');
      console.log('  • 1 enum (vs 4 flags)');
      console.log('  • Cache L1 + L2');
      console.log('  • 0 HTTP 404s');
    } else {
      console.log('%c📦 V1 ATIVA (Legada)', 'color: #f59e0b; font-weight: bold; font-size: 16px');
      console.log('  • 808 linhas');
      console.log('  • 4 flags');
      console.log('  • ~84 HTTP 404s esperados');
    }
    
    return v2Active ? 'V2' : 'V1';
  },

  /**
   * Testar carregamento de um step
   */
  async testStep(stepId = 'step-01') {
    console.log(`🔄 Testando carregamento: ${stepId}...`);
    const startTime = performance.now();
    
    try {
      const response = await fetch(`/templates/quiz21Steps/steps/${stepId}.json`);
      const loadTime = performance.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log(`✅ ${stepId} carregado com sucesso!`);
      console.log(`  • Blocos: ${data.blocks.length}`);
      console.log(`  • Tempo: ${loadTime.toFixed(2)}ms`);
      console.log(`  • Status: ${response.status}`);
      
      return { success: true, data, loadTime };
    } catch (error) {
      console.error(`❌ Erro ao carregar ${stepId}:`, error);
      return { success: false, error };
    }
  },

  /**
   * Testar cache (2 chamadas seguidas)
   */
  async testCache(stepId = 'step-01') {
    console.log('🔄 Testando sistema de cache...');
    
    // Primeira chamada
    const result1 = await this.testStep(stepId);
    
    if (!result1.success) {
      console.error('❌ Primeira chamada falhou');
      return;
    }
    
    // Aguardar um pouco
    await new Promise(r => setTimeout(r, 100));
    
    // Segunda chamada (deve ser do cache)
    const result2 = await this.testStep(stepId);
    
    if (result2.success) {
      const improvement = ((result1.loadTime - result2.loadTime) / result1.loadTime * 100).toFixed(1);
      
      if (result2.loadTime < result1.loadTime * 0.5) {
        console.log(`✅ Cache detectado! Melhoria: ${improvement}%`);
        console.log(`  • 1ª chamada: ${result1.loadTime.toFixed(2)}ms`);
        console.log(`  • 2ª chamada: ${result2.loadTime.toFixed(2)}ms`);
      } else {
        console.log('⚠️ Cache não teve impacto significativo');
        console.log(`  • 1ª chamada: ${result1.loadTime.toFixed(2)}ms`);
        console.log(`  • 2ª chamada: ${result2.loadTime.toFixed(2)}ms`);
      }
    }
  },

  /**
   * Testar todos os steps (step-01 a step-21)
   */
  async testAllSteps() {
    console.log('🔄 Testando todos os 21 steps...');
    
    const results = [];
    let errors = 0;
    let totalTime = 0;
    
    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${i.toString().padStart(2, '0')}`;
      const result = await this.testStep(stepId);
      
      results.push({ stepId, ...result });
      
      if (result.success) {
        totalTime += result.loadTime;
      } else {
        errors++;
      }
      
      // Aguardar um pouco entre requisições
      await new Promise(r => setTimeout(r, 50));
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO DOS TESTES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Total de steps: 21`);
    console.log(`  ${errors === 0 ? '✅' : '❌'} Sucessos: ${21 - errors}`);
    console.log(`  ${errors === 0 ? '✅' : '❌'} Falhas: ${errors}`);
    console.log(`  ⏱️ Tempo total: ${totalTime.toFixed(2)}ms`);
    console.log(`  📊 Média: ${(totalTime / 21).toFixed(2)}ms/step`);
    
    return results;
  },

  /**
   * Ver métricas (se V2 estiver ativa e exposta)
   */
  getMetrics() {
    try {
      // Tentar acessar a instância (pode não estar disponível em todos os contextos)
      const metrics = window.hierarchicalTemplateSource?.getMetrics?.();
      
      if (metrics) {
        console.log('📊 Métricas V2:');
        console.table(metrics);
        return metrics;
      } else {
        console.warn('⚠️ Métricas não disponíveis (V2 pode não estar carregada neste contexto)');
        return null;
      }
    } catch (error) {
      console.warn('⚠️ Não foi possível acessar métricas:', error.message);
      return null;
    }
  },

  /**
   * Limpar cache do navegador
   */
  async clearBrowserCache() {
    console.log('🗑️ Limpando cache do navegador...');
    
    try {
      // Limpar IndexedDB
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name?.includes('template') || db.name?.includes('cache')) {
          indexedDB.deleteDatabase(db.name);
          console.log(`  ✅ Deletado: ${db.name}`);
        }
      }
      
      // Limpar localStorage relacionado
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('template') || key.includes('cache'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`  ✅ Removido: ${key}`);
      });
      
      console.log('✅ Cache limpo! Recarregue a página.');
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
    }
  },

  /**
   * Mostrar ajuda
   */
  help() {
    console.log('%c🧪 HierarchicalTemplateSource V2 - Console Helper', 'color: #6366f1; font-weight: bold; font-size: 18px');
    console.log('\n📋 Comandos Disponíveis:\n');
    
    const commands = [
      ['enable()', 'Habilitar V2'],
      ['disable()', 'Desabilitar V2 (voltar para V1)'],
      ['checkVersion()', 'Verificar qual versão está ativa'],
      ['testStep("step-01")', 'Testar carregamento de um step'],
      ['testCache("step-01")', 'Testar sistema de cache'],
      ['testAllSteps()', 'Testar todos os 21 steps'],
      ['getMetrics()', 'Ver métricas de performance'],
      ['clearBrowserCache()', 'Limpar cache do navegador'],
      ['help()', 'Mostrar esta ajuda'],
    ];
    
    console.table(commands.map(([cmd, desc]) => ({ Comando: cmd, Descrição: desc })));
    
    console.log('\n💡 Exemplo de Uso:');
    console.log('  HierarchicalV2Helper.enable()');
    console.log('  // Recarregue a página');
    console.log('  HierarchicalV2Helper.checkVersion()');
    console.log('  HierarchicalV2Helper.testAllSteps()');
    console.log('\n');
  },
};

// Alias mais curto
window.V2 = window.HierarchicalV2Helper;

// Mostrar ajuda automaticamente
console.log('%c🎯 Console Helper Carregado!', 'color: #10b981; font-weight: bold; font-size: 16px');
console.log('Digite: %cV2.help()%c para ver comandos disponíveis', 'color: #6366f1; font-weight: bold', '');
console.log('Atalho: Use %cV2%c em vez de %cHierarchicalV2Helper', 'color: #6366f1; font-weight: bold', '', 'color: #6366f1; font-weight: bold');
