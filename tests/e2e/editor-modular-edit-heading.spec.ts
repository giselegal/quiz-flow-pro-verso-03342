import { test, expect } from '@playwright/test';

// E2E: Editar propriedade de texto e validar no Canvas
// Cenário: adicionar um bloco de texto (text-inline), selecionar, editar o campo "text" no painel de propriedades,
// e verificar que o Canvas reflete a alteração no preview.

test.describe('Editor Modular - Editar Propriedade (Texto)', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // Navega primeiro para a origem correta, então seta a flag e recarrega
    await page.goto(baseURL || 'http://localhost:8080');
    await page.addInitScript(() => {
      try {
        localStorage.setItem('editor:phase2:modular', '1');
      } catch {}
    });
  });

  test('deve editar o texto de um bloco e refletir no Canvas', async ({ page, baseURL }) => {
    // Vai para o editor desejado
    const url = `${baseURL || 'http://localhost:8080'}/editor?template=quiz21StepsComplete`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Recarrega para garantir que a flag do modular foi aplicada no mesmo origin
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Aguarda layout modular
    await expect(page.getByTestId('modular-layout')).toBeVisible({ timeout: 15000 });

    // Garante que pelo menos um bloco exista: se necessário, adiciona um text-inline da biblioteca
    const canvasBlocks = page.locator('[data-testid="canvas-block"]');
    let count = await canvasBlocks.count();
    if (count === 0) {
      const libText = page.getByTestId('lib-item-text-inline');
      await expect(libText).toBeVisible();
      await libText.dispatchEvent('dragstart');
      // Aguarda um novo bloco aparecer
      await expect(canvasBlocks).toHaveCount(1, { timeout: 10000 });
      count = 1;
    }

    // Seleciona o último bloco do canvas
    const lastBlock = canvasBlocks.last();
    await lastBlock.scrollIntoViewIfNeeded();
    await lastBlock.click();

    // Captura o id do bloco selecionado para verificar o preview específico
    const selectedBlockId = await lastBlock.getAttribute('data-block-id');
    expect(selectedBlockId).toBeTruthy();

    // Encontra o campo de texto no painel de propriedades e edita
    const newText = `Título E2E ${Date.now()}`;
    const textFieldWrapper = page.locator('[data-testid="column-properties"] [data-field-key="text"]');
    await expect(textFieldWrapper).toBeVisible();
    const input = textFieldWrapper.locator('input, textarea');
    await input.fill('');
    await input.fill(newText);

    // Verifica que o preview do Canvas refletiu o novo texto
    const blockPreviewText = page.locator(`[data-block-id="${selectedBlockId}"] [data-testid="canvas-block-text"]`);
    await expect(blockPreviewText).toHaveText(newText, { timeout: 10000 });
  });
});
