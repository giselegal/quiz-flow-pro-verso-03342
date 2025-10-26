import { test, expect } from '@playwright/test';

test.describe('Editor modular (flag ON) - smoke', () => {
  test('renderiza layout 4 colunas e carrega rota do editor', async ({ page }) => {
    // Garantir flag ligada antes de qualquer navegação
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });

    // Usa a baseURL do config (8080). O setup local deve redirecionar para o dev server.
    await page.goto('/editor?template=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });

    // Aguarda container principal do layout modular
    const layout = page.getByTestId('modular-layout');
    await expect(layout).toBeVisible({ timeout: 60000 });

    // Verifica as quatro colunas básicas
    await expect(page.getByTestId('column-steps')).toBeVisible();
    await expect(page.getByTestId('column-library')).toBeVisible();
    await expect(page.getByTestId('column-canvas')).toBeVisible();
    await expect(page.getByTestId('column-properties')).toBeVisible();
  });
});
