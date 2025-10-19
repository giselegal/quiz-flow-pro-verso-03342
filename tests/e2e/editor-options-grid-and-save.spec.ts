import { test, expect } from '@playwright/test';

// E2E focado: Options Grid nas etapas iniciais e fluxo de salvar com toast

test.describe('Editor - Options Grid e Salvar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Salvar alterações via overlay de Navegação', async ({ page }) => {
    // Abrir o editor com o template alvo (quando suportado)
    await page.goto('/editor?template=quiz21StepsComplete');

    // Esperar o canvas carregar
    await expect(page.getByTestId('canvas-editor')).toBeVisible({ timeout: 15000 });

    // Abrir o overlay de Navegação (botão no header principal)
    await page.getByTestId('nav-open-button').click();

  // No overlay, clicar em "Salvar Alterações" (não depende do isDirty)
  await page.getByTestId('overlay-save-button').click();

    // Verificar o toast de sucesso (título ou conteúdo)
    const toastSuccess = page.getByText(/Salvo com sucesso/i);
    await expect(toastSuccess).toBeVisible({ timeout: 10000 });
  });
});
