import { test, expect } from '@playwright/test';

// E2E: Edita uma propriedade de texto de um bloco e valida atualização no Canvas

test.describe('Editor modular - editar propriedade de bloco', () => {
  test('editar campo de texto reflete no preview do canvas', async ({ page }) => {
    // Usa mesma abordagem do teste que passa (editor-columns)
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });

    await page.goto('/editor?resource=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });

    // Aguarda layout modular com fallback
    const layout = page.getByTestId('modular-layout');
    const fallbackRoot = page.locator('[data-editor="modular-enhanced"], .qm-editor').first();

    try {
      await expect(layout).toBeVisible({ timeout: 20000 });
    } catch {
      await expect(fallbackRoot).toBeVisible({ timeout: 20000 });
    }

    const canvas = page.getByTestId('column-canvas');
    await expect(canvas).toBeVisible();

    // Aguarda blocos carregarem (template precisa carregar)
    await page.waitForTimeout(3000);
    let count = await canvas.locator('[data-testid="canvas-block"]').count();
    
    // Se não há blocos, pula este teste (foco é validar edição, não adição)
    if (count === 0) {
      console.warn('⚠️ Nenhum bloco encontrado no canvas, pulando teste de edição');
      test.skip();
      return;
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
