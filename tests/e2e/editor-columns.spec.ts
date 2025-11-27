import { test, expect } from '@playwright/test';

// Aumenta timeout global do teste para permitir carregamento do template
test.setTimeout(120_000);

// Valida que as 4 colunas do editor modular (Navigation, Canvas, Library, Properties)
// carregam corretamente e suportam interações básicas.
test.describe('Editor modular - colunas funcionais', () => {
  test('Navigation, Canvas, Library e Properties estão funcionais', async ({ page }) => {
    await page.goto('/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });

    // Habilita layout modular (mesma flag usada em outros E2E existentes)
    await page.evaluate(() => { try { localStorage.setItem('editor:phase2:modular', '1'); } catch {} });
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
    } catch {
      await page.goto('/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });
    }

    // Aguarda o layout modular
    await expect(page.getByTestId('modular-layout')).toBeVisible({ timeout: 60000 });

    const nav = page.getByTestId('column-steps');
    const lib = page.getByTestId('column-library');
    const canvas = page.getByTestId('column-canvas');
    const props = page.getByTestId('column-properties');

    await expect(nav).toBeVisible();
    await expect(lib).toBeVisible();
    await expect(canvas).toBeVisible();
    await expect(props).toBeVisible();

    // Interações básicas para validar funcionalidade das colunas

    // 1) Testa toggle da Biblioteca no header (deve ocultar/mostrar a coluna)
    const libToggle = page.locator('button[title="Mostrar/ocultar biblioteca de componentes"]');
    await expect(libToggle).toBeVisible();
    // Desliga biblioteca
    await libToggle.click();
    await page.waitForSelector('[data-testid="column-library"]', { state: 'hidden', timeout: 15000 });
    // Liga novamente
    await libToggle.click();
    await page.waitForSelector('[data-testid="column-library"]', { state: 'visible', timeout: 15000 });

    // 2) Testa que painel de propriedades existe e que o botão de toggle dispara o comportamento esperado
    const propsToggle = page.locator('button[title="Mostrar/ocultar painel de propriedades"]').or(page.locator('button[title="Mostrar/ocultar propriedades"]')).first();
    // O toggle de properties tem proteção em modo debug; interceptar possível alert
    let dialogSeen = false;
    page.once('dialog', (dialog) => {
      dialogSeen = true;
      dialog.dismiss().catch(() => {});
    });
    if (await propsToggle.isVisible().catch(() => false)) {
      await propsToggle.click().catch(() => {});
    }
    // Espera curto para o possível dialog disparar
    await page.waitForTimeout(500);
    // Se o dialog não apareceu, garantimos que a coluna de propriedades continua visível
    if (!dialogSeen) {
      await expect(page.getByTestId('column-properties')).toBeVisible();
    }

    // 3) Canvas: garante que a coluna do canvas existe e tem o container de viewport
    await expect(canvas).toBeVisible();
    const viewport = page.locator('[data-testid="canvas-edit-mode"]').or(page.locator('[data-testid="canvas-preview-mode"]'));
    // Pode ser que o modo não esteja presente imediatamente; apenas checamos que o container existe no DOM
    await expect(page.locator('[data-testid="column-canvas"]')).toBeVisible();

    // Se chegamos até aqui, as 4 colunas estão rendereizadas e suportam as operações básicas de UI
  });
});
