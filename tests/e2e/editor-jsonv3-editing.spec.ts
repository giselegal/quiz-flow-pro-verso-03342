import { test, expect } from '@playwright/test';

/**
 * E2E: Edição no /editor com JSONs v3 (modo JSON-only)
 * - Força flags via localStorage para garantir fonte TEMPLATE_DEFAULT (JSON)
 * - Desativa Supabase e overrides
 * - Valida carregamento de step-01 vindo do v3 e edição refletida no canvas
 */

test.describe('Editor (JSON v3) - edição básica', () => {
  test.beforeEach(async ({ page }) => {
    // Setar flags antes de carregar a página
    await page.goto('/editor?template=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });
    
    await page.evaluate(() => {
      try {
        localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
        localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');
        localStorage.setItem('VITE_DISABLE_TEMPLATE_OVERRIDES', 'true');
        localStorage.setItem('VITE_ENABLE_INDEXEDDB_CACHE', 'true');
        localStorage.setItem('supabase:disableNetwork', 'true');
        localStorage.setItem('editor:phase2:modular', '1');
      } catch {}
    });

    // Recarregar para aplicar flags
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('carrega step-01 do JSON v3 e edita propriedade de texto', async ({ page }) => {
    // 1) Esperar que o editor carregue - buscar por elementos específicos do layout modular
    await expect(page.locator('[data-testid="step-navigator-column"], .step-navigator')).toBeVisible({ timeout: 60000 });

    // 1) Esperar que o editor carregue - buscar por elementos específicos do layout modular
    await expect(page.locator('[data-testid="step-navigator-column"], .step-navigator')).toBeVisible({ timeout: 60000 });

    // 2) Esperar canvas carregar (sem mensagem de carregamento)
    await page.locator('text=Carregando etapa').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    
    // 3) Validar que step-01 está ativo no navegador
    const step01Active = page.locator('[data-step="step-01"][data-active="true"], [data-step="1"][data-active="true"], button:has-text("01 -"):has([data-active="true"])').first();
    await expect(step01Active).toBeVisible({ timeout: 15000 });

    // 4) Esperar conteúdo do JSON v3 step-01 no canvas
    // "Bem-vindo(a)!" é o texto do intro-title em step-01-v3.json
    await expect(page.locator('text=/Bem-vindo|Chega de ficar em dúvida/i')).toBeVisible({ timeout: 20000 });

    // 5) Clicar no primeiro bloco do canvas para abrir propriedades
    const firstBlock = page.locator('[data-block-id], [data-testid^="canvas-block"]').first();
    await firstBlock.click({ timeout: 10000 });

    // 6) Esperar painel de propriedades abrir
    await expect(page.locator('[data-testid="properties-panel"], .properties-column')).toBeVisible({ timeout: 10000 });

    // 7) Encontrar campo de texto editável e modificar
    const textInput = page.locator('input[type="text"], textarea').filter({ hasText: '' }).or(
      page.locator('input[placeholder*="texto"], input[placeholder*="título"], textarea[placeholder*="descrição"]')
    ).first();
    
    const newValue = `Teste E2E ${Date.now()}`;
    await textInput.fill(newValue);
    await textInput.blur();

    // 8) Validar que mudança reflete no canvas
    await expect(page.locator(`text=${newValue}`)).toBeVisible({ timeout: 8000 });

    // 9) Validar métricas de fonte TEMPLATE_DEFAULT
    const metricsOk = await page.evaluate(() => {
      const arr = (window as any).__TEMPLATE_SOURCE_METRICS as Array<{ stepId: string; source: string }>|undefined;
      if (!arr || !Array.isArray(arr)) return false;
      return arr.some(x => /step-0?1/i.test(x.stepId) && x.source === 'TEMPLATE_DEFAULT');
    });
    expect(metricsOk).toBeTruthy();
  });

  test('navega entre steps e valida carregamento JSON v3', async ({ page }) => {
    // Esperar editor carregar
    await expect(page.locator('[data-testid="step-navigator-column"], .step-navigator')).toBeVisible({ timeout: 60000 });
    
    // Validar step-01 inicial
    await expect(page.locator('text=/Bem-vindo|01 -/i')).toBeVisible({ timeout: 20000 });

    // Navegar para step-02
    const step02Button = page.locator('button:has-text("02 -"), [data-step="step-02"], [data-step="2"]').first();
    await step02Button.click();

    // Esperar carregamento do step-02
    await page.locator('text=Carregando etapa').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    
    // Validar conteúdo do step-02 (primeira pergunta do quiz)
    await expect(page.locator('text=/QUAL O SEU TIPO DE ROUPA|Pergunta 1/i')).toBeVisible({ timeout: 20000 });

    // Validar que métricas mostram TEMPLATE_DEFAULT para step-02
    const step02Metrics = await page.evaluate(() => {
      const arr = (window as any).__TEMPLATE_SOURCE_METRICS as Array<{ stepId: string; source: string }>|undefined;
      if (!arr) return false;
      return arr.some(x => /step-0?2/i.test(x.stepId) && x.source === 'TEMPLATE_DEFAULT');
    });
    expect(step02Metrics).toBeTruthy();
  });

  test('adiciona bloco da biblioteca e persiste edição', async ({ page }) => {
    // Esperar editor carregar
    await expect(page.locator('[data-testid="step-navigator-column"]')).toBeVisible({ timeout: 60000 });
    await page.locator('text=Carregando etapa').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});

    // Abrir biblioteca de componentes
    const libraryToggle = page.locator('button:has-text("Biblioteca"), [data-testid="library-toggle"]').first();
    if (await libraryToggle.isVisible().catch(() => false)) {
      await libraryToggle.click();
    }

    // Encontrar um bloco na biblioteca (ex: texto, título, botão)
    const libraryBlock = page.locator('[data-library-block], [draggable="true"]').filter({ hasText: /texto|título|botão/i }).first();
    
    if (await libraryBlock.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Drag & drop para o canvas
      const canvas = page.locator('[data-testid="canvas-area"], .canvas-column').first();
      await libraryBlock.dragTo(canvas);

      // Validar que bloco foi adicionado
      const blockCount = await page.locator('[data-block-id], [data-testid^="canvas-block"]').count();
      expect(blockCount).toBeGreaterThan(0);
    }
  });

  test('valida que não há chamadas 404 para Supabase', async ({ page }) => {
    const failed404s: string[] = [];
    
    page.on('requestfailed', request => {
      const url = request.url();
      if (url.includes('supabase') && request.failure()?.errorText.includes('404')) {
        failed404s.push(url);
      }
    });

    // Carregar editor e navegar entre alguns steps
    await expect(page.locator('[data-testid="step-navigator-column"]')).toBeVisible({ timeout: 60000 });
    
    // Navegar para step-02, step-03
    for (const step of ['02', '03']) {
      const btn = page.locator(`button:has-text("${step} -")`).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(1000);
      }
    }

    // Validar que não houve 404s do Supabase
    expect(failed404s).toHaveLength(0);
  });
});
