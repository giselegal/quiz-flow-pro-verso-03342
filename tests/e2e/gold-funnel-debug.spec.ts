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

    // Capturar logs do console
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('UnifiedLoader') || text.includes('useStepBlocksLoader')) {
        console.log(`🔊 Console: ${text}`);
      }
    });

    // Navegar para o editor com funil gold
    await page.goto('/editor?funnel=quiz21-v4-gold&step=1');
    
    // Aguardar carregamento
    await page.waitForSelector('[data-testid="editor-header"]', { timeout: 15000 });
    await page.waitForTimeout(3000);

    // Verificar quais arquivos JSON foram carregados
    console.log('\n📊 DIAGNÓSTICO:');
    console.log('   Total de requests JSON:', requests.length);
    requests.forEach(req => console.log('   -', req));

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

    // Tentar ler o JSON diretamente
    const goldJsonResponse = await page.request.get('http://localhost:8082/templates/quiz21-v4-gold.json');
    if (goldJsonResponse.ok()) {
      const goldJson = await goldJsonResponse.json();
      console.log('\n✅ quiz21-v4-gold.json EXISTE:');
      console.log('   Steps:', goldJson.steps?.length);
      console.log('   Step 1 blocks:', goldJson.steps?.[0]?.blocks?.length);
    } else {
      console.log('\n❌ quiz21-v4-gold.json NÃO ENCONTRADO');
    }

    // Verificar o JSON default também
    const defaultJsonResponse = await page.request.get('http://localhost:8082/templates/quiz21-v4.json');
    if (defaultJsonResponse.ok()) {
      const defaultJson = await defaultJsonResponse.json();
      console.log('\n✅ quiz21-v4.json (default) EXISTE:');
      console.log('   Steps:', defaultJson.steps?.length);
      console.log('   Step 1 blocks:', defaultJson.steps?.[0]?.blocks?.length);
    }

    // Não fazer assertions, apenas coletar dados
    console.log('\n📸 Screenshot salvo para análise visual');
    await page.screenshot({ path: 'test-results/gold-funnel-debug.png', fullPage: true });
  });

});
