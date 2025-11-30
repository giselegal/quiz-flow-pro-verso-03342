/**
 * 🧪 TESTES RÁPIDOS - Carregamento do Editor com Funis
 * 
 * Testa especificamente:
 * - /editor (vazio)
 * - /editor?funnelId=funnel-quiz21-SKZYE1GX (Quiz 21 Steps)
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
const QUIZ21_FUNNEL_ID = 'funnel-quiz21-SKZYE1GX';

test.describe('Carregamento do Editor - Testes Rápidos', () => {
  
  test('Deve carregar /editor sem erros', async ({ page }) => {
    console.log('\n🎯 Teste 1: Carregando /editor...');
    
    const startTime = Date.now();
    
    // Interceptar erros de console
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Interceptar erros de página
    const pageErrors: Error[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error);
    });
    
    // Navegar
    await page.goto(`${BASE_URL}/editor`);
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    const loadTime = Date.now() - startTime;
    
    // Verificar se carregou
    const isVisible = await page.locator('body').isVisible();
    expect(isVisible).toBe(true);
    
    console.log(`   ⏱️  Tempo de carregamento: ${loadTime}ms`);
    
    // Verificar erros críticos
    const hasCriticalError = pageErrors.some(err => 
      err.message.includes('ERR_ABORTED') || 
      err.message.includes('Failed to fetch')
    );
    
    if (hasCriticalError) {
      console.log('   ❌ Erros encontrados:');
      pageErrors.forEach(err => console.log(`      - ${err.message}`));
    }
    
    // Screenshot
    await page.screenshot({ 
      path: 'test-results/editor-empty-load.png', 
      fullPage: false 
    });
    
    expect(hasCriticalError).toBe(false);
    console.log('   ✅ Editor vazio carregado sem erros críticos');
  });

  test('Deve carregar /editor?funnelId=funnel-quiz21-SKZYE1GX', async ({ page }) => {
    console.log('\n🎯 Teste 2: Carregando Quiz 21 Steps...');
    
    const startTime = Date.now();
    
    // Interceptar erros
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      pageErrors.push(error);
    });
    
    // Navegar com funnelId
    const url = `${BASE_URL}/editor?funnelId=${QUIZ21_FUNNEL_ID}`;
    console.log(`   URL: ${url}`);
    
    await page.goto(url);
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    const loadTime = Date.now() - startTime;
    
    console.log(`   ⏱️  Tempo de carregamento: ${loadTime}ms`);
    
    // Aguardar interface do editor
    await page.waitForTimeout(2000);
    
    // Verificar se há conteúdo
    const bodyText = await page.locator('body').textContent();
    const hasContent = bodyText && bodyText.length > 100;
    
    console.log(`   📄 Conteúdo na página: ${hasContent ? 'Sim' : 'Não'}`);
    
    // Verificar erros ERR_ABORTED ou Failed to fetch
    const hasCriticalError = pageErrors.some(err => 
      err.message.includes('ERR_ABORTED') || 
      err.message.includes('Failed to fetch') ||
      err.message.includes('dynamically imported module')
    );
    
    if (pageErrors.length > 0) {
      console.log(`   ⚠️  ${pageErrors.length} erro(s) encontrado(s):`);
      pageErrors.slice(0, 3).forEach(err => {
        const shortMsg = err.message.substring(0, 100);
        console.log(`      - ${shortMsg}...`);
      });
    }
    
    if (consoleErrors.length > 0) {
      console.log(`   ⚠️  ${consoleErrors.length} erro(s) de console:`);
      consoleErrors.slice(0, 3).forEach(msg => {
        const shortMsg = msg.substring(0, 100);
        console.log(`      - ${shortMsg}...`);
      });
    }
    
    // Screenshot
    await page.screenshot({ 
      path: 'test-results/editor-quiz21-load.png', 
      fullPage: true 
    });
    
    // Assertions
    expect(hasContent).toBe(true);
    
    if (hasCriticalError) {
      console.log('   ❌ ERRO CRÍTICO DE CARREGAMENTO DETECTADO');
      console.log('   💡 Possíveis causas:');
      console.log('      1. Módulo QuizModularEditor com erro de sintaxe');
      console.log('      2. Dependência circular nas importações');
      console.log('      3. Cache do Vite corrompido');
      console.log('   🔧 Solução: Reinicie o servidor Vite');
    }
    
    expect(hasCriticalError).toBe(false);
    console.log('   ✅ Quiz 21 Steps carregado com sucesso');
  });

  test('Deve verificar se o editor está acessível', async ({ page }) => {
    console.log('\n🎯 Teste 3: Verificando acessibilidade do editor...');
    
    await page.goto(`${BASE_URL}/editor?funnelId=${QUIZ21_FUNNEL_ID}`);
    await page.waitForLoadState('networkidle');
    
    // Aguardar carregamento completo
    await page.waitForTimeout(3000);
    
    // Buscar por elementos típicos do editor
    const elements = {
      main: await page.locator('main, [role="main"], .editor-container').count(),
      buttons: await page.locator('button').count(),
      inputs: await page.locator('input, textarea').count(),
    };
    
    console.log('   📊 Elementos detectados:');
    console.log(`      - Containers principais: ${elements.main}`);
    console.log(`      - Botões: ${elements.buttons}`);
    console.log(`      - Inputs: ${elements.inputs}`);
    
    // Deve ter pelo menos alguns elementos de interface
    const hasInterface = elements.buttons > 0 || elements.inputs > 0;
    
    expect(hasInterface).toBe(true);
    console.log('   ✅ Interface do editor está acessível');
  });

  test('Deve medir performance de carregamento', async ({ page }) => {
    console.log('\n🎯 Teste 4: Medindo performance...');
    
    // Métricas de navegação
    await page.goto(`${BASE_URL}/editor?funnelId=${QUIZ21_FUNNEL_ID}`);
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      };
    });
    
    console.log('   📈 Métricas de Performance:');
    console.log(`      - DOM Content Loaded: ${Math.round(performanceMetrics.domContentLoaded)}ms`);
    console.log(`      - Load Complete: ${Math.round(performanceMetrics.loadComplete)}ms`);
    console.log(`      - DOM Interactive: ${Math.round(performanceMetrics.domInteractive)}ms`);
    console.log(`      - Tempo Total: ${Math.round(performanceMetrics.totalTime)}ms`);
    
    // Tempo total deve ser razoável
    expect(performanceMetrics.totalTime).toBeLessThan(15000);
    
    if (performanceMetrics.totalTime < 3000) {
      console.log('   ✅ Performance excelente! 🚀');
    } else if (performanceMetrics.totalTime < 5000) {
      console.log('   ✅ Performance boa');
    } else if (performanceMetrics.totalTime < 10000) {
      console.log('   ⚠️  Performance aceitável');
    } else {
      console.log('   ⚠️  Performance lenta');
    }
  });

  test('Deve verificar se há módulos faltando', async ({ page }) => {
    console.log('\n🎯 Teste 5: Verificando módulos...');
    
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.goto(`${BASE_URL}/editor?funnelId=${QUIZ21_FUNNEL_ID}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    if (failedRequests.length > 0) {
      console.log(`   ⚠️  ${failedRequests.length} requisição(ões) falharam:`);
      failedRequests.slice(0, 5).forEach(url => {
        const shortUrl = url.substring(url.lastIndexOf('/') + 1);
        console.log(`      - ${shortUrl}`);
      });
    } else {
      console.log('   ✅ Todos os módulos carregados com sucesso');
    }
    
    // Verificar se há erro específico do QuizModularEditor
    const hasEditorModuleError = failedRequests.some(url => 
      url.includes('QuizModularEditor')
    );
    
    if (hasEditorModuleError) {
      console.log('   ❌ ERRO: Módulo QuizModularEditor não está carregando!');
      console.log('   🔧 Execute: rm -rf node_modules/.vite && reinicie o servidor');
    }
    
    expect(hasEditorModuleError).toBe(false);
  });

  test('Deve listar recursos carregados', async ({ page }) => {
    console.log('\n🎯 Teste 6: Listando recursos carregados...');
    
    await page.goto(`${BASE_URL}/editor?funnelId=${QUIZ21_FUNNEL_ID}`);
    await page.waitForLoadState('networkidle');
    
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      return {
        total: entries.length,
        byType: {
          script: entries.filter(e => e.initiatorType === 'script').length,
          link: entries.filter(e => e.initiatorType === 'link').length,
          fetch: entries.filter(e => e.initiatorType === 'fetch' || e.initiatorType === 'xmlhttprequest').length,
          img: entries.filter(e => e.initiatorType === 'img').length,
        },
        largest: entries
          .sort((a, b) => b.transferSize - a.transferSize)
          .slice(0, 3)
          .map(e => ({
            name: e.name.substring(e.name.lastIndexOf('/') + 1),
            size: Math.round(e.transferSize / 1024),
          })),
      };
    });
    
    console.log('   📦 Recursos Carregados:');
    console.log(`      - Total: ${resources.total}`);
    console.log(`      - Scripts: ${resources.byType.script}`);
    console.log(`      - Links/CSS: ${resources.byType.link}`);
    console.log(`      - Fetch/XHR: ${resources.byType.fetch}`);
    console.log(`      - Imagens: ${resources.byType.img}`);
    
    console.log('   📊 Maiores recursos:');
    resources.largest.forEach(r => {
      console.log(`      - ${r.name}: ${r.size}KB`);
    });
    
    expect(resources.total).toBeGreaterThan(0);
    console.log('   ✅ Recursos carregados com sucesso');
  });
});
