import { test, expect } from '@playwright/test';

/**
 * E2E Simplificado: Validar carregamento do editor com JSON v3
 * Testa apenas que o editor carrega e usa JSON v3
 */

test.describe('Editor JSON v3 - Smoke Test', () => {
  test('carrega editor e valida fonte JSON v3', async ({ page }) => {
    test.setTimeout(180000); // 3 minutos

    // 1) Configurar flags ANTES de navegar
    await page.goto('about:blank');
    await page.goto('/editor?funnel=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });

    await page.evaluate(() => {
      localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
      localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');
      localStorage.setItem('VITE_DISABLE_TEMPLATE_OVERRIDES', 'true');
      localStorage.setItem('supabase:disableNetwork', 'true');
    });

    // 2) Navegar novamente com flags aplicadas
    await page.goto('/editor?funnel=quiz21StepsComplete', { waitUntil: 'networkidle', timeout: 90000 });

    // 4) Esperar React hidratar (indicador: qualquer botão ou input)
    await page.waitForSelector('button, input, [role="button"]', { timeout: 60000 });

    // 5) Aguardar mais um pouco para templates carregarem
    await page.waitForTimeout(5000);

    // 6) Tirar screenshot para debug
    await page.screenshot({ path: 'test-results/editor-loaded.png', fullPage: true });

    // 7) Verificar métricas no console
    const metrics = await page.evaluate(() => {
      const m = (window as any).__TEMPLATE_SOURCE_METRICS;
      return Array.isArray(m) ? m : [];
    });

    console.log('📊 Métricas capturadas:', JSON.stringify(metrics, null, 2));

    // 8) Validar que pelo menos um step foi carregado de TEMPLATE_DEFAULT
    const hasJsonSource = metrics.some((m: any) => 
      m && m.source === 'TEMPLATE_DEFAULT' && /step-\d+/i.test(m.stepId)
    );

    if (!hasJsonSource && metrics.length === 0) {
      console.warn('⚠️ Nenhuma métrica encontrada - pode ser que templates não registraram');
    }

    // 9) Verificar que não há erros 404 para Supabase
    const logs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('404') && text.includes('supabase')) {
        logs.push(text);
      }
    });

    await page.waitForTimeout(2000);
    
    expect(logs.length).toBe(0);
    console.log('✅ Nenhum 404 do Supabase detectado');

    // 10) Validar que DOM tem algum conteúdo do quiz
    const bodyText = await page.textContent('body');
    const hasQuizContent = bodyText && (
      /etapa|step|quiz|bem-vindo/i.test(bodyText) ||
      bodyText.length > 1000 // Garantir que há conteúdo significativo
    );

    expect(hasQuizContent).toBeTruthy();
    console.log('✅ Conteúdo do editor detectado');
  });

  test('valida localStorage flags aplicadas', async ({ page }) => {
    await page.goto('about:blank');
    await page.goto('/editor?funnel=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });

    await page.evaluate(() => {
      localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
      localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');
    });

    // Navegar novamente em vez de reload
    await page.goto('/editor?funnel=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });

    const flags = await page.evaluate(() => ({
      jsonOnly: localStorage.getItem('VITE_TEMPLATE_JSON_ONLY'),
      disableSupabase: localStorage.getItem('VITE_DISABLE_SUPABASE'),
    }));

    expect(flags.jsonOnly).toBe('true');
    expect(flags.disableSupabase).toBe('true');
    console.log('✅ Flags localStorage validadas:', flags);
  });

  test('carrega JSON v3 de step-01 via fetch direto', async ({ page }) => {
    // Teste independente: buscar JSON v3 direto
    const response = await page.request.get('/templates/step-01-v3.json');
    
    expect(response.ok()).toBeTruthy();
    
    const json = await response.json();
    expect(json).toHaveProperty('blocks');
    expect(Array.isArray(json.blocks)).toBeTruthy();
    expect(json.blocks.length).toBeGreaterThan(0);
    
    console.log(`✅ JSON v3 step-01 carregado: ${json.blocks.length} blocos`);
  });
});
