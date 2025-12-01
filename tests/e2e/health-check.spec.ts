import { test, expect } from '@playwright/test';

/**
 * Teste mínimo: apenas verificar que servidor está respondendo
 */

test.describe('Servidor - Health Check', () => {
  test('servidor responde na porta 8080', async ({ page }) => {
    test.setTimeout(60000);
    
    const response = await page.goto('http://localhost:8080/', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    expect(response?.status()).toBe(200);
    console.log('✅ Servidor respondeu com 200');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log('✅ Título da página:', title);
  });

  test('rota /editor existe', async ({ page }) => {
    test.setTimeout(60000);
    
    const response = await page.goto('http://localhost:8080/editor', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    expect(response?.status()).toBe(200);
    console.log('✅ /editor respondeu com 200');
    
    // Esperar React hidratar
    await page.waitForTimeout(3000);
    
    const bodyText = await page.textContent('body');
    expect(bodyText?.length).toBeGreaterThan(100);
    console.log('✅ /editor tem conteúdo');
  });

  test('pode setar flags localStorage', async ({ page }) => {
    await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
    
    await page.evaluate(() => {
      localStorage.setItem('TEST_FLAG', 'true');
    });
    
    const flag = await page.evaluate(() => localStorage.getItem('TEST_FLAG'));
    expect(flag).toBe('true');
    console.log('✅ localStorage funcionando');
  });

  test('pode fazer fetch de JSON v4 modular', async ({ page }) => {
    const response = await page.request.get('http://localhost:8080/templates/quiz21Steps/steps/step-01.json');
    expect(response.ok()).toBeTruthy();
    
    const json = await response.json();
    expect(json).toHaveProperty('blocks');
    expect(Array.isArray(json.blocks)).toBeTruthy();
    
    console.log('✅ JSON v4 modular acessível:', json.blocks.length, 'blocos');
  });
});
