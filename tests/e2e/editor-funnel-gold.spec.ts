import { test, expect } from '@playwright/test';

// Abre o editor com o funil gold e verifica elementos essenciais

test.describe('Editor - Funil Gold (quiz21-v4-gold)', () => {
  test('carrega /editor?funnel=quiz21-v4-gold', async ({ page }) => {
    await page.goto('/editor?funnel=quiz21-v4-gold');

    // Barra de progresso do editor durante o boot
    // Header do editor visível após carregamento
      await expect(page.locator('[data-testid="editor-header"]')).toBeVisible({ timeout: 30000 });
  });

  test('carrega /editor/quiz21-v4-gold (rota com param)', async ({ page }) => {
    await page.goto('/editor/quiz21-v4-gold');

    // Deve exibir o header do editor
    await expect(page.locator('[data-testid="editor-header"]')).toBeVisible({ timeout: 30000 });
  });
});
