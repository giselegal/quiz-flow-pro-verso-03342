import { test, expect } from '@playwright/test';

// E2E: Edita uma propriedade de texto de um bloco e valida atualização no Canvas

test.describe('Editor modular - editar propriedade de bloco', () => {
  test('editar campo de texto reflete no preview do canvas', async ({ page }) => {
    // Abre o editor, liga a flag e recarrega para aplicar
    await page.goto('/editor?funnel=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => { try { localStorage.setItem('editor:phase2:modular', '1'); } catch {} });
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
    } catch {
      await page.goto('/editor?funnel=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });
    }

    // Aguarda layout modular e canvas
    await expect(page.getByTestId('modular-layout')).toBeVisible({ timeout: 60000 });
    const canvas = page.getByTestId('column-canvas');
    await expect(canvas).toBeVisible();

    // Garante ao menos 1 bloco no canvas, adicionando da biblioteca se necessário
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

    // Tenta encontrar um bloco cujo painel possua campo "text"
    const newText = `E2E atualizado ${Date.now()}`;
    const blocks = canvas.locator('[data-testid="canvas-block"]');
    const total = await blocks.count();

    let edited = false;
    for (let i = 0; i < total; i++) {
      const block = blocks.nth(i);
      await block.scrollIntoViewIfNeeded();
      await block.click();

      const textFieldWrapper = page.locator('[data-field-key="text"]');
      const hasTextField = await textFieldWrapper.first().isVisible({ timeout: 1500 }).catch(() => false);
      if (!hasTextField) continue;

      // Preenche o campo (input ou textarea)
      const input = textFieldWrapper.locator('input, textarea').first();
      await expect(input).toBeVisible();
      await input.fill('');
      await input.type(newText);

      // Valida que o bloco selecionado mostra o novo texto no preview
      await expect(block).toContainText(newText, { timeout: 5000 });
      edited = true;
      break;
    }

    expect(edited).toBeTruthy();
  });
});
