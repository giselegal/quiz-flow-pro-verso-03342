import { test, expect } from '@playwright/test';

// E2E focado: Options Grid nas etapas iniciais e fluxo de salvar com toast

test.describe('Editor - Options Grid e Salvar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Seleção em Options Grid em step inicial e salvar', async ({ page }) => {
    // Abrir o editor com o template alvo (quando suportado)
    await page.goto('/editor?template=quiz21StepsComplete');

    // Esperar o canvas carregar
    await expect(page.getByTestId('canvas-editor')).toBeVisible({ timeout: 15000 });

  // Selecionar a etapa de pergunta (step-02)
  await page.getByText('step-02', { exact: true }).first().click();

  // Dentro do canvas, pegar a primeira opção clicável do grid
  const firstOption = page.locator('[data-testid^="grid-option-"]').first();
    await expect(firstOption).toBeVisible({ timeout: 10000 });

    // Clicar para selecionar e verificar o atributo data-selected
    await firstOption.click();
    await expect(firstOption).toHaveAttribute('data-selected', 'true');

  // Abrir o overlay de Navegação e ajustar um link para forçar alteração
  await page.getByRole('button', { name: /Navegação/i }).click();
  const firstSelect = page.locator('select').first();
  await expect(firstSelect).toBeVisible();
  // Selecionar a primeira opção do select (ex.: finalizar)
  await firstSelect.selectOption({ index: 0 });

  // No overlay, clicar em "Salvar Alterações" (não depende do isDirty)
  await page.getByRole('button', { name: /Salvar Alterações/i }).click();

    // Verificar o toast de sucesso (título ou conteúdo)
    const toastSuccess = page.getByText(/Salvo com sucesso/i);
    await expect(toastSuccess).toBeVisible({ timeout: 10000 });
  });
});
