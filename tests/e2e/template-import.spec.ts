import { test, expect } from '@playwright/test';

/**
 * E2E-09: Importar template e customizar
 * 
 * Testa o fluxo de importação de template existente:
 * 1. Acessar galeria de templates
 * 2. Selecionar template
 * 3. Importar para o editor
 * 4. Customizar componentes
 * 5. Salvar como novo funil
 */
test.describe('Template Import and Customization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/admin/my-funnels');
  });

  test('E2E-09: Deve importar e customizar template com sucesso', async ({ page }) => {
    // Navegar para templates
    const templatesTab = page.getByRole('tab', { name: /Templates|Modelos/i });
    if (await templatesTab.isVisible().catch(() => false)) {
      await templatesTab.click();
    } else {
      // Ou clicar em "Escolher Template"
      const chooseTemplateButton = page.getByRole('button', { name: /Escolher Template|Choose Template/i });
      await chooseTemplateButton.click();
    }

    // Aguardar galeria de templates
    await expect(page.locator('[data-testid="template-card"]').first()).toBeVisible({ timeout: 10000 });

    // Selecionar primeiro template disponível
    const firstTemplate = page.locator('[data-testid="template-card"]').first();
    await firstTemplate.click();

    // Clicar em "Usar Template" ou "Importar"
    const useTemplateButton = page.getByRole('button', { name: /Usar Template|Use|Importar/i });
    await useTemplateButton.click();

    // Preencher nome do novo funil
    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill('Template Customizado E2E');

    // Confirmar
    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    // Aguardar editor carregar
    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });
    await expect(page.locator('[data-testid="canvas-column"]')).toBeVisible({ timeout: 10000 });

    // Aguardar steps carregarem
    await page.waitForTimeout(2000);

    // Selecionar primeiro componente editável
    const firstComponent = page.locator('[data-component-type]').first();
    await firstComponent.click({ timeout: 5000 });

    // Verificar que painel de propriedades abriu
    await expect(page.locator('[data-testid="properties-panel"]')).toBeVisible({ timeout: 5000 });

    // Editar propriedade de texto
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible().catch(() => false)) {
      await textInput.fill('Texto Customizado E2E');
    }

    // Salvar alterações
    const saveButton = page.getByRole('button', { name: /Salvar|Save/i }).first();
    await saveButton.click();

    // Aguardar confirmação
    await expect(page.locator('text=Salvo com sucesso')).toBeVisible({ timeout: 5000 });
  });

  test('E2E-09b: Deve preservar estrutura do template após importação', async ({ page }) => {
    const chooseTemplateButton = page.getByRole('button', { name: /Escolher Template|Choose Template/i });
    if (await chooseTemplateButton.isVisible().catch(() => false)) {
      await chooseTemplateButton.click();
    }

    // Selecionar template específico (quiz21steps)
    const quiz21Template = page.locator('[data-template-id="quiz21steps"]');
    if (await quiz21Template.isVisible().catch(() => false)) {
      await quiz21Template.click();
    } else {
      await page.locator('[data-testid="template-card"]').first().click();
    }

    const useTemplateButton = page.getByRole('button', { name: /Usar Template|Use|Importar/i });
    await useTemplateButton.click();

    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill('Template Estrutura E2E');

    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });

    // Verificar que steps foram importados
    const stepsPanel = page.locator('[data-testid="steps-panel"]');
    await expect(stepsPanel).toBeVisible({ timeout: 10000 });

    // Contar steps (deve ter pelo menos 3)
    const stepItems = page.locator('[data-testid="step-item"]');
    const stepCount = await stepItems.count();
    expect(stepCount).toBeGreaterThanOrEqual(3);
  });
});
