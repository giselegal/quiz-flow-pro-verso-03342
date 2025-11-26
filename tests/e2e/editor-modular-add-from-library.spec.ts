import { test, expect } from '@playwright/test';

// Teste E2E: adiciona um componente da biblioteca ao Canvas via dragstart simplificado
// Observação: a coluna de biblioteca dispara a adição no onDragStart, então basta emitir o evento

test.describe('Editor modular - adicionar componente da biblioteca', () => {
  test('adiciona um item ao Canvas e aumenta a contagem de blocos', async ({ page }) => {
    // Abre a rota do editor, seta a flag e recarrega para aplicar
    await page.goto('/editor?funnel=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => { try { localStorage.setItem('editor:phase2:modular', '1'); } catch {} });
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Aguarda layout modular
    await expect(page.getByTestId('modular-layout')).toBeVisible({ timeout: 60000 });

    // Mede contagem inicial de blocos no Canvas
    const canvas = page.getByTestId('column-canvas');
    const initialBlocks = await canvas.locator('[data-testid="canvas-block"]').count();

    // Seleciona o primeiro item da biblioteca (qualquer) e dispara dragstart
    const firstLibItem = page.getByTestId('column-library').locator('[data-testid^="lib-item-"]').first();
    await expect(firstLibItem).toBeVisible();

    // Dispara dragstart para acionar onComponentDragStart (que adiciona o bloco no step atual)
    await firstLibItem.dispatchEvent('dragstart');

    // Verifica que a contagem de blocos aumentou
    await expect(async () => {
      const afterCount = await canvas.locator('[data-testid="canvas-block"]').count();
      expect(afterCount).toBeGreaterThan(initialBlocks);
    }).toPass();
  });
});
