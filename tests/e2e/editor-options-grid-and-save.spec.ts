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

  // Encontrar o primeiro bloco de opções (aceita 'quiz-options' ou 'options-grid') visível no canvas
  const optionsGrid = page.locator('[data-block-type="quiz-options"], [data-block-type="options-grid"]').first();
    await expect(optionsGrid).toBeVisible({ timeout: 10000 });

    // Dentro do grid, pegar a primeira opção clicável
    const firstOption = optionsGrid.locator('[data-testid^="grid-option-"]').first();
    await expect(firstOption).toBeVisible({ timeout: 10000 });

    // Clicar para selecionar e verificar o atributo data-selected
    await firstOption.click();
    await expect(firstOption).toHaveAttribute('data-selected', 'true');

    // O clique deve marcar o editor como sujo; botão Salvar deve habilitar
    const salvarBtn = page.getByRole('button', { name: /salvar/i });
    await expect(salvarBtn).toBeEnabled({ timeout: 5000 });

    // Clicar em Salvar e aguardar o toast de sucesso
    await salvarBtn.click();

    // Verificar o toast de sucesso (título ou conteúdo)
    const toastSuccess = page.getByText(/Salvo com sucesso/i);
    await expect(toastSuccess).toBeVisible({ timeout: 10000 });
  });
});
