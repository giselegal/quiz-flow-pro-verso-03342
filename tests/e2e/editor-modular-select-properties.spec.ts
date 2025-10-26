import { test, expect } from '@playwright/test';

// E2E: Seleciona um bloco no Canvas e valida que o painel de propriedades reflete a seleção

test.describe('Editor modular - seleção e painel de propriedades', () => {
  test('ao selecionar um bloco, o painel mostra o tipo do bloco', async ({ page }) => {
    // Abre o editor, liga a flag e recarrega para aplicar
    await page.goto('/editor?template=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => { try { localStorage.setItem('editor:phase2:modular', '1'); } catch {} });
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
    } catch {
      // Fallback em navegadores que abortam reload no dev server: navega novamente
      await page.goto('/editor?template=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });
    }

    // Aguarda layout modular
    await expect(page.getByTestId('modular-layout')).toBeVisible({ timeout: 60000 });

    const canvas = page.getByTestId('column-canvas');

    // Garante que há pelo menos um bloco; se não houver, adiciona um da biblioteca
    let count = await canvas.locator('[data-testid="canvas-block"]').count();
    if (count === 0) {
      const firstLibItem = page.getByTestId('column-library').locator('[data-testid^="lib-item-"]').first();
      await expect(firstLibItem).toBeVisible();
      await firstLibItem.dispatchEvent('dragstart');
      await expect(async () => {
        const newCount = await canvas.locator('[data-testid="canvas-block"]').count();
        expect(newCount).toBeGreaterThan(count);
      }).toPass();
      count = await canvas.locator('[data-testid="canvas-block"]').count();
    }

    // Seleciona o último bloco (o mais novo, se acabamos de adicionar)
  const lastBlock = canvas.locator('[data-testid="canvas-block"]').nth(count - 1);
  await lastBlock.scrollIntoViewIfNeeded();
  await expect(lastBlock).toBeVisible();
  await lastBlock.click();

    // Painel de propriedades deve refletir a seleção
    await expect(page.getByTestId('properties-no-selection')).toHaveCount(0);
    const typeLabel = page.getByTestId('properties-selected-type');
    await expect(typeLabel).toBeVisible();
    await expect(typeLabel).not.toHaveText('');
  });
});
