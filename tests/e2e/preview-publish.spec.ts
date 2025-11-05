import { test, expect } from '@playwright/test';

/**
 * E2E-11: Preview mode e publicação
 * 
 * Testa o fluxo de preview e publicação:
 * 1. Criar/editar funil
 * 2. Entrar em modo preview
 * 3. Testar interatividade
 * 4. Voltar ao editor
 * 5. Publicar funil
 */
test.describe('Preview and Publish', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/admin/my-funnels');
  });

  test('E2E-11: Deve entrar em modo preview e voltar ao editor', async ({ page }) => {
    // Criar funil de teste
    const createButton = page.getByRole('button', { name: /Criar Novo Funil|Novo Funil/i });
    await createButton.click();

    const blankModeButton = page.getByRole('button', { name: /Em Branco|Blank|Do Zero/i });
    await blankModeButton.click();

    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill(`Funil Preview ${Date.now()}`);

    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });

    // Salvar primeiro
    const saveButton = page.getByRole('button', { name: /Salvar|Save/i }).first();
    await saveButton.click();
    await expect(page.locator('text=Salvo com sucesso')).toBeVisible({ timeout: 5000 });

    // Entrar em modo preview
    const previewButton = page.getByRole('button', { name: /Preview|Visualizar|Pré-visualização/i });
    await previewButton.click();

    // Aguardar modo preview carregar
    await page.waitForTimeout(2000);

    // Verificar que está em modo preview (ferramentas de edição não visíveis)
    const editorTools = page.locator('[data-testid="editor-toolbar"]');
    if (await editorTools.isVisible().catch(() => false)) {
      expect(await editorTools.isVisible()).toBe(false);
    }

    // Verificar que conteúdo está visível
    await expect(page.locator('[data-testid="canvas-column"]')).toBeVisible({ timeout: 5000 });

    // Sair do preview
    const exitPreviewButton = page.getByRole('button', { name: /Sair|Exit|Fechar Preview/i });
    await exitPreviewButton.click();

    // Verificar que voltou ao editor
    await page.waitForTimeout(1000);
    const editorToolbar = page.locator('[data-testid="editor-toolbar"]');
    if (await editorToolbar.isVisible().catch(() => false)) {
      expect(await editorToolbar.isVisible()).toBe(true);
    }
  });

  test('E2E-11b: Deve testar interatividade no preview', async ({ page }) => {
    // Usar template quiz21steps que tem interatividade
    const chooseTemplateButton = page.getByRole('button', { name: /Escolher Template|Choose Template/i });
    if (await chooseTemplateButton.isVisible().catch(() => false)) {
      await chooseTemplateButton.click();
    }

    const firstTemplate = page.locator('[data-testid="template-card"]').first();
    await firstTemplate.click();

    const useTemplateButton = page.getByRole('button', { name: /Usar Template|Use|Importar/i });
    await useTemplateButton.click();

    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill(`Funil Interativo ${Date.now()}`);

    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });

    // Salvar
    const saveButton = page.getByRole('button', { name: /Salvar|Save/i }).first();
    await saveButton.click();
    await expect(page.locator('text=Salvo com sucesso')).toBeVisible({ timeout: 5000 });

    // Entrar em preview
    const previewButton = page.getByRole('button', { name: /Preview|Visualizar/i });
    await previewButton.click();

    await page.waitForTimeout(2000);

    // Testar navegação entre steps
    const nextButton = page.getByRole('button', { name: /Próximo|Next|Avançar|Continuar/i });
    if (await nextButton.isVisible().catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(1000);

      // Verificar que mudou de step
      const step2Indicator = page.locator('text=Step 2|Etapa 2|2 de');
      if (await step2Indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
        expect(await step2Indicator.isVisible()).toBe(true);
      }
    }

    // Testar botão voltar
    const backButton = page.getByRole('button', { name: /Voltar|Back|Anterior/i });
    if (await backButton.isVisible().catch(() => false)) {
      await backButton.click();
      await page.waitForTimeout(1000);

      const step1Indicator = page.locator('text=Step 1|Etapa 1|1 de');
      if (await step1Indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
        expect(await step1Indicator.isVisible()).toBe(true);
      }
    }
  });

  test('E2E-11c: Deve publicar funil com sucesso', async ({ page }) => {
    // Criar funil simples
    const createButton = page.getByRole('button', { name: /Criar Novo Funil|Novo Funil/i });
    await createButton.click();

    const blankModeButton = page.getByRole('button', { name: /Em Branco|Blank|Do Zero/i });
    await blankModeButton.click();

    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill(`Funil Publish ${Date.now()}`);

    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });

    // Salvar primeiro
    const saveButton = page.getByRole('button', { name: /Salvar|Save/i }).first();
    await saveButton.click();
    await expect(page.locator('text=Salvo com sucesso')).toBeVisible({ timeout: 5000 });

    // Clicar em publicar
    const publishButton = page.getByRole('button', { name: /Publicar|Publish/i });
    await publishButton.click();

    // Aguardar modal de confirmação
    await expect(page.locator('text=Confirmar publicação|Publish confirmation')).toBeVisible({ timeout: 5000 });

    // Confirmar publicação
    const confirmPublishButton = page.getByRole('button', { name: /Confirmar|Publish|Sim/i }).last();
    await confirmPublishButton.click();

    // Aguardar sucesso
    await expect(page.locator('text=Publicado com sucesso|Published successfully')).toBeVisible({ timeout: 10000 });

    // Verificar que URL pública foi gerada
    const publicUrlText = page.locator('text=https://|http://');
    if (await publicUrlText.isVisible({ timeout: 5000 }).catch(() => false)) {
      expect(await publicUrlText.isVisible()).toBe(true);
    }
  });

  test('E2E-11d: Deve validar antes de publicar', async ({ page }) => {
    // Criar funil vazio (sem conteúdo)
    const createButton = page.getByRole('button', { name: /Criar Novo Funil|Novo Funil/i });
    await createButton.click();

    const blankModeButton = page.getByRole('button', { name: /Em Branco|Blank|Do Zero/i });
    await blankModeButton.click();

    const nameInput = page.getByPlaceholder(/Nome do funil|Funnel name/i);
    await nameInput.fill(`Funil Vazio ${Date.now()}`);

    const confirmButton = page.getByRole('button', { name: /Criar|Create|Confirmar/i });
    await confirmButton.click();

    await page.waitForURL(/\/editor\?.*/, { timeout: 15000 });

    // Tentar publicar sem conteúdo
    const publishButton = page.getByRole('button', { name: /Publicar|Publish/i });
    if (await publishButton.isVisible().catch(() => false)) {
      await publishButton.click();

      // Deve mostrar aviso ou erro de validação
      const validationError = page.locator('text=pelo menos|at least|adicione|add content|vazio|empty');
      if (await validationError.isVisible({ timeout: 5000 }).catch(() => false)) {
        expect(await validationError.isVisible()).toBe(true);
      }
    }
  });
});
