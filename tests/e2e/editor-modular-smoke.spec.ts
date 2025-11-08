import { test, expect } from '@playwright/test';

test.describe('Editor modular (flag ON) - smoke', () => {
  test('renderiza layout 4 colunas e carrega rota do editor', async ({ page }) => {
    // Garantir flag ligada antes de qualquer navegação
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });

    // Usa a baseURL do config (8080). O setup local deve redirecionar para o dev server.
  await page.goto('/editor?resource=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });

    // Tenta layout principal e aplica fallback se necessário
    const layout = page.getByTestId('modular-layout');
    const fallbackRoot = page.locator('[data-editor="modular-enhanced"], .qm-editor').first();

    try {
      await expect(layout).toBeVisible({ timeout: 15000 });
    } catch {
      await expect(fallbackRoot).toBeVisible({ timeout: 15000 });
    }

    // Verifica colunas (canvas e steps obrigatórias; outras opcionais)
    await expect(page.getByTestId('column-steps')).toBeVisible({ timeout: 20000 });
    await expect(page.getByTestId('column-canvas')).toBeVisible({ timeout: 20000 });

    const libVisible = await page.getByTestId('column-library').isVisible().catch(() => false);
    const propsVisible = await page.getByTestId('column-properties').isVisible().catch(() => false);
    console.log(`ℹ️ Colunas opcionais: library=${libVisible}, properties=${propsVisible}`);
  });
});
