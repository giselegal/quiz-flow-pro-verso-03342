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

    // Navigation: espera a lista de etapas estar disponível e clica na primeira
    await page.waitForSelector('[data-testid="step-navigator-item"]', { timeout: 60000 });
    const firstStep = page.locator('[data-testid="step-navigator-item"]').first();
    await expect(firstStep).toBeVisible({ timeout: 15000 });
    await firstStep.click();

    // Library -> adiciona um bloco ao canvas se necessário
    let count = await canvas.locator('[data-testid="canvas-block"]').count();
    if (count === 0) {
      const firstLibItem = lib.locator('[data-testid^="lib-item-"]').first();
      await expect(firstLibItem).toBeVisible();
      await firstLibItem.dispatchEvent('dragstart');
      await expect(async () => {
        const newCount = await canvas.locator('[data-testid="canvas-block"]').count();
        expect(newCount).toBeGreaterThan(count);
      }).toPass();
      count = await canvas.locator('[data-testid="canvas-block"]').count();
    }

    // Seleciona o primeiro bloco do canvas e verifica que o painel de propriedades exibe campos
    const block = canvas.locator('[data-testid="canvas-block"]').first();
    await expect(block).toBeVisible();
    await block.click();

    const anyField = page.locator('[data-field-key]').first();
    await expect(anyField).toBeVisible({ timeout: 5000 });

    // Se chegamos até aqui, as 4 colunas estão presentes e com funcionalidade básica
  });
});
