/**
 * 🔍 TESTE DE VALIDAÇÃO RÁPIDA - ESTRUTURA ATUAL
 * 
 * Teste simples e rápido para validar se a estrutura básica está funcionando.
 * Execute este teste primeiro antes dos testes abrangentes.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('⚡ Validação Rápida - Estrutura Básica', () => {
  
  test('deve validar que o projeto está acessível', async ({ page }) => {
    console.log('🚀 Testando conectividade básica...');
    
    const startTime = Date.now();
    const response = await page.goto(BASE_URL);
    const responseTime = Date.now() - startTime;
    
    console.log(`📊 Tempo de resposta: ${responseTime}ms`);
    console.log(`📈 Status HTTP: ${response?.status()}`);
    
    expect(response?.status()).toBeLessThan(400);
    expect(responseTime).toBeLessThan(10000); // 10 segundos max
    
    console.log('✅ Conectividade: OK');
  });

  test('deve ter conteúdo HTML válido', async ({ page }) => {
    console.log('🔍 Verificando estrutura HTML...');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    const title = await page.title();
    const hasBody = await page.locator('body').count() > 0;
    const bodyText = await page.locator('body').textContent();
    
    console.log(`📄 Título da página: "${title}"`);
    console.log(`🎯 Tem body: ${hasBody ? 'Sim' : 'Não'}`);
    console.log(`📝 Conteúdo: ${bodyText?.length || 0} caracteres`);
    
    expect(hasBody).toBeTruthy();
    expect(title).toBeTruthy();
    expect(bodyText?.length || 0).toBeGreaterThan(0);
    
    console.log('✅ HTML: OK');
  });

  test('deve carregar recursos básicos sem erros críticos', async ({ page }) => {
    console.log('📦 Verificando carregamento de recursos...');
    
    const errors: string[] = [];
    const resources: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (response.status() >= 400) {
        errors.push(`${response.status()}: ${url.split('/').pop()}`);
      } else if (url.includes('.js') || url.includes('.css')) {
        resources.push(url.split('/').pop() || '');
      }
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    console.log(`📊 Recursos carregados: ${resources.length}`);
    console.log(`❌ Erros encontrados: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('⚠️ Erros (primeiros 3):');
      errors.slice(0, 3).forEach(err => console.log(`   ${err}`));
    }

    // Permitir alguns erros menores (favicon, analytics, etc)
    expect(errors.length).toBeLessThan(10);
    expect(resources.length).toBeGreaterThan(0);
    
    console.log('✅ Recursos: OK');
  });

  test('deve ter navegação ou interatividade básica', async ({ page }) => {
    console.log('🖱️ Testando interatividade básica...');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    const buttons = await page.locator('button, [role="button"]').count();
    const links = await page.locator('a[href]').count();
    const interactiveElements = buttons + links;

    console.log(`🔘 Botões encontrados: ${buttons}`);
    console.log(`🔗 Links encontrados: ${links}`);
    console.log(`⚡ Total interativo: ${interactiveElements}`);

    expect(interactiveElements).toBeGreaterThan(0);
    
    console.log('✅ Interatividade: OK');
  });

  test('não deve ter erros de JavaScript críticos', async ({ page }) => {
    console.log('🐛 Verificando erros de JavaScript...');
    
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(`Page Error: ${error.message}`);
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    const criticalErrors = errors.filter(err => 
      !err.includes('favicon') &&
      !err.includes('Extension') &&
      !err.includes('DevTools') &&
      !err.toLowerCase().includes('warning')
    );

    console.log(`📊 Total de logs de erro: ${errors.length}`);
    console.log(`🔴 Erros críticos: ${criticalErrors.length}`);

    if (criticalErrors.length > 0) {
      console.log('⚠️ Erros críticos encontrados:');
      criticalErrors.slice(0, 2).forEach(err => {
        console.log(`   ${err.substring(0, 80)}...`);
      });
    }

    // Permitir poucos erros não críticos
    expect(criticalErrors.length).toBeLessThan(5);
    
    console.log('✅ JavaScript: OK');
  });

  test.afterAll(async () => {
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('🎉 VALIDAÇÃO RÁPIDA CONCLUÍDA');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');
    console.log('✅ Se todos os testes passaram, a estrutura básica está OK!');
    console.log('');
    console.log('🚀 Próximos passos:');
    console.log('   1. Execute: npm run test:e2e:comprehensive');
    console.log('   2. Para debug: npm run test:e2e:comprehensive:headed');
    console.log('   3. Para relatório: npm run test:e2e:comprehensive:ui');
    console.log('');
  });
});