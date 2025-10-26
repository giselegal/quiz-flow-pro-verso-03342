import { test, expect } from '@playwright/test';

// E2E: Editar propriedade de texto e validar no Canvas
// Fluxo: abre o editor, ativa layout modular, SEMPRE adiciona um text-inline, seleciona, edita campo "text"
// e valida que o Canvas mostra o novo valor no preview.

test.describe('Editor Modular - Editar Propriedade (Texto)', () => {
  test('deve editar o texto de um bloco e refletir no Canvas', async ({ page }) => {
    // Abre a rota do editor, seta a flag e recarrega para aplicar (com fallback de navegação)
    const url = '/editor?template=quiz21StepsComplete';
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => { try { localStorage.setItem('editor:phase2:modular', '1'); } catch {} });
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    // Aguarda layout modular
    await expect(page.getByTestId('modular-layout')).toBeVisible({ timeout: 60000 });

    // Contagem inicial de blocos
    const canvas = page.getByTestId('column-canvas');
    const canvasBlocks = canvas.locator('[data-testid="canvas-block"]');
    const initialCount = await canvasBlocks.count();

    // Adiciona sempre um bloco de texto (text-inline)
    const libText = page.getByTestId('column-library').getByTestId('lib-item-text-inline');
    await expect(libText).toBeVisible();
    await libText.dispatchEvent('dragstart');

    // Espera a contagem aumentar
    await expect(async () => {
      const after = await canvasBlocks.count();
      expect(after).toBeGreaterThan(initialCount);
    }).toPass();

    // Seleciona o último bloco do canvas (o recém-adicionado)
    const lastBlock = canvasBlocks.last();
    await lastBlock.waitFor({ state: 'visible' });
    await lastBlock.click();

    // Captura o id do bloco selecionado para verificar o preview específico
    const selectedBlockId = await lastBlock.getAttribute('data-block-id');
    expect(selectedBlockId).toBeTruthy();

  // Encontra o campo de texto no painel (aceita text ou headline) e edita
  const newText = `Título E2E ${Date.now()}`;
  const panel = page.getByTestId('column-properties');
  const fieldText = panel.locator('[data-field-key="text"]');
  const fieldHeadline = panel.locator('[data-field-key="headline"]');
  const textFieldWrapper = (await fieldText.count()) > 0 ? fieldText : fieldHeadline;
  await expect(textFieldWrapper).toBeVisible({ timeout: 20000 });
  const input = textFieldWrapper.locator('input, textarea');
    await input.fill('');
    await input.fill(newText);

    // Verifica que o preview do Canvas refletiu o novo texto
    const blockPreviewText = page.locator(`[data-block-id="${selectedBlockId}"] [data-testid="canvas-block-text"]`);
    await expect(blockPreviewText).toHaveText(newText, { timeout: 15000 });
  });
});
