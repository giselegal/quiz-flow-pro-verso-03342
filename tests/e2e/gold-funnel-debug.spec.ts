/**
 * 🔍 TESTE DE DIAGNÓSTICO: Gold Funnel Loading
 * 
 * Teste simplificado para diagnosticar por que stepBlocks fica vazio
 */

import { test, expect } from '@playwright/test';

test.describe('Gold Funnel Debug Tests', () => {
  
  test('deve diagnosticar carregamento do template gold', async ({ page }) => {
    // Interceptar requisições para ver qual JSON está sendo carregado
    const requests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('.json') && url.includes('template')) {
        requests.push(url);
        console.log('📦 Request JSON:', url);
      }
    });

    page.on('response', async response => {
      const url = response.url();
      if (url.includes('.json') && url.includes('template')) {
        try {
          const json = await response.json();
          console.log('📄 Response JSON:', url);
          console.log('   Steps:', json.steps?.length || 0);
          console.log('   Template ID:', json.metadata?.id);
        } catch {
          console.log('⚠️ Failed to parse JSON:', url);
        }
      }
    });

    // Capturar TODOS os logs do console para debugging
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      // Mostrar logs relevantes em tempo real
      if (
        text.includes('UnifiedLoader') || 
        text.includes('useStepBlocksLoader') ||
        text.includes('setStepBlocks') ||
        text.includes('QuizModularEditor') ||
        text.includes('Bootstrap')
      ) {
        console.log(`🔊 ${text}`);
      }
    });

    // Navegar para o editor com funil gold
    await page.goto('/editor?funnel=quiz21-v4-gold&step=1');
    
    // Aguardar carregamento
    await page.waitForSelector('[data-testid="editor-header"]', { timeout: 15000 });
    // Dar tempo suficiente para o useStepBlocksLoader carregar
    await page.waitForTimeout(5000);

    // Verificar quais arquivos JSON foram carregados
    console.log('\n📊 DIAGNÓSTICO:');
    console.log('   Total de requests JSON:', requests.length);
    requests.forEach(req => console.log('   -', req));
    
    // Mostrar primeiros 20 logs do console
    console.log('\n🔊 Primeiros 20 logs do console:');
    consoleLogs.slice(0, 20).forEach((log, i) => {
      console.log(`   ${i + 1}. ${log.substring(0, 100)}`);
    });
    
    // Buscar logs específicos do loader
    const loaderLogs = consoleLogs.filter(log => 
      log.includes('useStepBlocksLoader') || 
      log.includes('UnifiedLoader') ||
      log.includes('loadStep')
    );
    console.log('\n🔍 Logs do Loader:', loaderLogs.length);
    loaderLogs.forEach(log => console.log(`   ${log}`));

    // Verificar estado do editor via console
    const stepBlocksState = await page.evaluate(() => {
      return (window as any).__EDITOR_STATE__?.editor?.stepBlocks || null;
    });

    console.log('\n🔍 Estado stepBlocks:', stepBlocksState);

    // Verificar localStorage
    const templateId = await page.evaluate(() => {
      return localStorage.getItem('qm-editor:active-template');
    });

    console.log('💾 Template ID no localStorage:', templateId);

    // Tentar ler o JSON diretamente (usar porta 8080 do Vite dev server)
    const baseUrl = 'http://localhost:8081';
    
    try {
      const goldJsonResponse = await page.request.get(`${baseUrl}/templates/quiz21-v4-gold.json`);
      if (goldJsonResponse.ok()) {
        const goldJson = await goldJsonResponse.json();
        console.log('\n✅ quiz21-v4-gold.json EXISTE:');
        console.log('   Steps:', goldJson.steps?.length);
        console.log('   Step 1 blocks:', goldJson.steps?.[0]?.blocks?.length);
      } else {
        console.log('\n❌ quiz21-v4-gold.json NÃO ENCONTRADO (status:', goldJsonResponse.status(), ')');
      }
    } catch (e) {
      console.log('\n⚠️ Erro ao buscar quiz21-v4-gold.json:', (e as Error).message);
    }

    try {
      const defaultJsonResponse = await page.request.get(`${baseUrl}/templates/quiz21-v4.json`);
      if (defaultJsonResponse.ok()) {
        const defaultJson = await defaultJsonResponse.json();
        console.log('\n✅ quiz21-v4.json (default) EXISTE:');
        console.log('   Steps:', defaultJson.steps?.length);
        console.log('   Step 1 blocks:', defaultJson.steps?.[0]?.blocks?.length);
      }
    } catch (e) {
      console.log('⚠️ Erro ao buscar quiz21-v4.json:', (e as Error).message);
    }

    // Exportar logs completos para análise
    console.log('\n📋 Todos os logs (últimos 50):');
    consoleLogs.slice(-50).forEach(log => console.log(`   ${log}`));

    // Não fazer assertions, apenas coletar dados
    console.log('\n📸 Screenshot salvo para análise visual');
    await page.screenshot({ path: 'test-results/gold-funnel-debug.png', fullPage: true });
  });

});
