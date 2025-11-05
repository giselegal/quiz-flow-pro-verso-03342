import { test, expect } from '@playwright/test';

/**
 * E2E-08: Criar funil do zero (blank mode)
 * 
 * Testa o fluxo completo de criação de um funil em branco:
 * 1. Acessar dashboard
 * 2. Clicar em "Criar Novo Funil"
 * 3. Escolher modo "Em Branco"
 * 4. Configurar funil básico
 * 5. Adicionar componentes
 * 6. Salvar funil
 */
test.describe('Funnel Creation - Blank Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/admin/my-funnels');
  });

  test('E2E-08: Deve criar funil do zero com sucesso', async ({ page }) => {
    // Aguardar carregamento do dashboard
    await expect(page.locator('h1:has-text("Meus Funis")')).toBeVisible({ timeout: 10000 });

    // Clicar em "Criar Novo Funil"
    const createButton = page.getByRole('button', { name: /Criar Novo Funil|Novo Funil/i });
    await createButton.click();

    // Aguardar modal ou página de criação
    await expect(page.locator('text=Modo em Branco')).toBeVisible({ timeout: 5000 });

    // Selecionar modo "Em Branco"
    const blankModeButton = page.getByRole('button', { name: /Em Branco|Blank|Do Zero/i });
    await blankModeButton.click();

    // Preencher nome do funil
    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill('Funil Teste E2E');

    // Confirmar criação
    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    // Aguardar redirecionamento para o editor
    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });

    // Verificar que editor carregou
    await expect(page.locator('[data-testid="canvas-column"]')).toBeVisible({ timeout: 10000 });

    // Adicionar primeiro componente
    const addComponentButton = page.getByRole('button', { name: /Adicionar Componente|Add Component/i });
    if (await addComponentButton.isVisible().catch(() => false)) {
      await addComponentButton.click();

      // Selecionar tipo de componente (ex: text-block)
      const textBlockOption = page.getByRole('button', { name: /Texto|Text Block/i });
      await textBlockOption.click();

      // Verificar que componente foi adicionado
      await expect(page.locator('[data-component-type="text-block"]')).toBeVisible({ timeout: 5000 });
    }

    // Salvar funil
    const saveButton = page.getByRole('button', { name: /Salvar|Save/i }).first();
    await saveButton.click();

    // Aguardar confirmação
    await expect(page.locator('text=Salvo com sucesso')).toBeVisible({ timeout: 5000 });
  });

  test('E2E-08b: Deve validar campos obrigatórios na criação', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /Criar Novo Funil|Novo Funil/i });
    await createButton.click();

    const blankModeButton = page.getByRole('button', { name: /Em Branco|Blank|Do Zero/i });
    await blankModeButton.click();

    // Tentar criar sem nome
    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    // Deve mostrar erro de validação
    await expect(page.locator('text=obrigatório|required')).toBeVisible({ timeout: 3000 });
  });
});
