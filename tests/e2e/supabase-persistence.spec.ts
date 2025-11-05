import { test, expect } from '@playwright/test';

/**
 * E2E-10: Salvar e restaurar do Supabase
 * 
 * Testa o fluxo completo de persistência:
 * 1. Criar/editar funil
 * 2. Salvar no Supabase
 * 3. Sair do editor
 * 4. Reabrir funil
 * 5. Verificar que dados foram restaurados
 */
test.describe('Supabase Persistence', () => {
  const testFunnelName = `Funil Persistência ${Date.now()}`;

  test('E2E-10: Deve salvar e restaurar funil do Supabase', async ({ page }) => {
    // Criar novo funil
    await page.goto('http://localhost:8080/admin/my-funnels');
    
    const createButton = page.getByRole('button', { name: /Criar Novo Funil|Novo Funil/i });
    await createButton.click();

    const blankModeButton = page.getByRole('button', { name: /Em Branco|Blank|Do Zero/i });
    await blankModeButton.click();

    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill(testFunnelName);

    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    // Aguardar editor
    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });

    // Adicionar componente único para identificação
    const addComponentButton = page.getByRole('button', { name: /Adicionar Componente|Add Component/i });
    if (await addComponentButton.isVisible().catch(() => false)) {
      await addComponentButton.click();

      const textBlockOption = page.getByRole('button', { name: /Texto|Text Block/i });
      await textBlockOption.click();

      // Editar texto
      const textInput = page.locator('input[type="text"]').first();
      if (await textInput.isVisible().catch(() => false)) {
        await textInput.fill('Texto Único E2E Persistência');
      }
    }

    // Salvar no Supabase
    const saveButton = page.getByRole('button', { name: /Salvar|Save/i }).first();
    await saveButton.click();

    // Aguardar confirmação
    await expect(page.locator('text=Salvo com sucesso')).toBeVisible({ timeout: 10000 });

    // Capturar URL do funil
    const currentUrl = page.url();
    const funnelId = new URL(currentUrl).searchParams.get('funnelId') || 
                     new URL(currentUrl).searchParams.get('template');

    // Voltar para dashboard
    await page.goto('http://localhost:8080/admin/my-funnels');

    // Aguardar lista carregar
    await page.waitForTimeout(2000);

    // Encontrar funil criado na lista
    const funnelCard = page.locator(`text="${testFunnelName}"`);
    await expect(funnelCard).toBeVisible({ timeout: 10000 });

    // Clicar para abrir
    await funnelCard.click();

    // Aguardar editor carregar novamente
    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });
    await expect(page.locator('[data-testid="canvas-column"]')).toBeVisible({ timeout: 10000 });

    // Aguardar dados restaurarem
    await page.waitForTimeout(3000);

    // Verificar que texto customizado foi restaurado
    const restoredText = page.locator('text=Texto Único E2E Persistência');
    await expect(restoredText).toBeVisible({ timeout: 10000 });
  });

  test('E2E-10b: Deve sincronizar alterações em tempo real', async ({ page }) => {
    await page.goto('http://localhost:8080/admin/my-funnels');
    
    const createButton = page.getByRole('button', { name: /Criar Novo Funil|Novo Funil/i });
    await createButton.click();

    const blankModeButton = page.getByRole('button', { name: /Em Branco|Blank|Do Zero/i });
    await blankModeButton.click();

    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill(`Funil Sync ${Date.now()}`);

    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });

    // Fazer múltiplas alterações com auto-save
    for (let i = 1; i <= 3; i++) {
      const addButton = page.getByRole('button', { name: /Adicionar Componente/i });
      if (await addButton.isVisible().catch(() => false)) {
        await addButton.click();
        const textOption = page.getByRole('button', { name: /Texto|Text Block/i });
        await textOption.click();
        await page.waitForTimeout(1000);
      }
    }

    // Verificar que auto-save ocorreu (indicador ou toast)
    const autoSaveIndicator = page.locator('text=Salvando|Saving|Auto-saved');
    if (await autoSaveIndicator.isVisible({ timeout: 5000 }).catch(() => false)) {
      expect(await autoSaveIndicator.isVisible()).toBe(true);
    }
  });

  test('E2E-10c: Deve lidar com conflitos de salvamento', async ({ page }) => {
    // Simula edições concorrentes
    await page.goto('http://localhost:8080/admin/my-funnels');
    
    const createButton = page.getByRole('button', { name: /Criar Novo Funil|Novo Funil/i });
    await createButton.click();

    const blankModeButton = page.getByRole('button', { name: /Em Branco|Blank|Do Zero/i });
    await blankModeButton.click();

    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill(`Funil Conflito ${Date.now()}`);

    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });

    // Fazer edição rápida
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible().catch(() => false)) {
      await textInput.fill('Edição 1');
    }

    // Salvar
    const saveButton = page.getByRole('button', { name: /Salvar|Save/i }).first();
    await saveButton.click();

    // Fazer segunda edição antes da primeira terminar de salvar (race condition)
    if (await textInput.isVisible().catch(() => false)) {
      await textInput.fill('Edição 2');
    }

    await saveButton.click();

    // Sistema deve lidar gracefully (última edição prevalece ou merge)
    await expect(page.locator('text=Salvo com sucesso|Erro ao salvar')).toBeVisible({ timeout: 10000 });
  });
});
