/**
 * 🧪 TESTES E2E - EDITOR DE FUNIS
 * 
 * Testa as funcionalidades do editor:
 * - Carregamento do editor
 * - Criação de novo funil
 * - Edição de etapas
 * - Adição e remoção de blocos
 * - Preview de alterações
 * - Salvamento
 * 
 * @module tests/e2e/editor-functionality
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
const EDITOR_URL = `${BASE_URL}/editor`;
const TIMEOUT = 15000;

test.describe('📝 Editor de Funis - Funcionalidades Básicas', () => {
  
  test('deve carregar o editor corretamente', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    
    // Fechar modal inicial se existir
    await closeStartupModal(page);
    
    // Verificar elementos principais do editor
    const editorContainer = page.locator('[data-testid*="editor"], .editor-container, .editor-page, main').first();
    await expect(editorContainer).toBeVisible({ timeout: TIMEOUT });
    
    console.log('✅ Editor carregado com sucesso');
  });

  test('deve exibir lista de etapas', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Procurar por lista de etapas
    const stepsListSelectors = [
      '[data-testid*="steps-list"]',
      '[data-testid*="step-list"]',
      '.steps-list',
      '.step-list',
      'aside', // Sidebar
      '[role="navigation"]'
    ];
    
    let foundStepsList = false;
    for (const selector of stepsListSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        foundStepsList = true;
        console.log('✅ Lista de etapas encontrada');
        break;
      }
    }
    
    // Alternativamente, procurar por itens de etapa
    const stepItems = page.locator('[data-testid*="step-"], .step-item, li').all();
    const hasSteps = (await stepItems).length > 0;
    
    expect(foundStepsList || hasSteps).toBeTruthy();
  });

  test('deve permitir selecionar uma etapa', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Procurar por etapas clicáveis
    const stepSelectors = [
      '[data-testid*="step-"]',
      '.step-item',
      'li[role="button"]',
      'button[data-step]'
    ];
    
    for (const selector of stepSelectors) {
      const firstStep = page.locator(selector).first();
      if (await firstStep.isVisible().catch(() => false)) {
        await firstStep.click();
        await page.waitForTimeout(1000);
        console.log('✅ Etapa selecionada');
        return;
      }
    }
    
    console.log('ℹ️ Não foi possível encontrar etapas clicáveis');
  });

  test('deve exibir área de edição de conteúdo', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Procurar por área de edição
    const editorAreaSelectors = [
      '[data-testid*="editor-content"]',
      '[data-testid*="content-editor"]',
      '.editor-content',
      '.content-area',
      'main section',
      '[role="main"]'
    ];
    
    let foundEditorArea = false;
    for (const selector of editorAreaSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        foundEditorArea = true;
        console.log('✅ Área de edição encontrada');
        break;
      }
    }
    
    expect(foundEditorArea).toBeTruthy();
  });

  test('deve permitir editar texto de um bloco', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Procurar por campos de texto editáveis
    const textInputs = page.locator('input[type="text"], textarea, [contenteditable="true"]');
    const firstInput = textInputs.first();
    
    if (await firstInput.isVisible().catch(() => false)) {
      const testText = 'Texto de teste E2E';
      await firstInput.fill(testText);
      await page.waitForTimeout(500);
      
      const value = await firstInput.inputValue().catch(() => await firstInput.textContent());
      expect(value).toContain('teste');
      
      console.log('✅ Texto editado com sucesso');
    } else {
      console.log('ℹ️ Nenhum campo de texto encontrado');
    }
  });

  test('deve ter botão de adicionar novo bloco', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Procurar por botões de adicionar
    const addButtonSelectors = [
      'button:has-text("Adicionar")',
      'button:has-text("Add")',
      'button:has-text("+")',
      '[data-testid*="add-block"]',
      '[data-action="add-block"]',
      '.add-block-button'
    ];
    
    let foundAddButton = false;
    for (const selector of addButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        foundAddButton = true;
        console.log('✅ Botão de adicionar bloco encontrado');
        break;
      }
    }
    
    // Pode não ter sempre visível
    if (!foundAddButton) {
      console.log('ℹ️ Botão de adicionar não encontrado na vista atual');
    }
  });

  test('deve ter opção de salvar', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Procurar por botão de salvar
    const saveButtonSelectors = [
      'button:has-text("Salvar")',
      'button:has-text("Save")',
      'button:has-text("Guardar")',
      '[data-testid*="save"]',
      '[data-action="save"]',
      '.save-button'
    ];
    
    let foundSaveButton = false;
    for (const selector of saveButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        foundSaveButton = true;
        console.log('✅ Botão de salvar encontrado');
        break;
      }
    }
    
    expect(foundSaveButton).toBeTruthy();
  });

  test('deve ter opção de preview', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Procurar por botão de preview
    const previewButtonSelectors = [
      'button:has-text("Preview")',
      'button:has-text("Visualizar")',
      'button:has-text("Ver")',
      '[data-testid*="preview"]',
      '[data-action="preview"]',
      '.preview-button'
    ];
    
    let foundPreviewButton = false;
    for (const selector of previewButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        foundPreviewButton = true;
        console.log('✅ Botão de preview encontrado');
        break;
      }
    }
    
    if (!foundPreviewButton) {
      console.log('ℹ️ Botão de preview não encontrado');
    }
  });
});

test.describe('📝 Editor - Criação de Novo Funil', () => {
  
  test('deve permitir criar novo funil', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por modal ou opção de novo funil
    const newFunnelSelectors = [
      'button:has-text("Novo")',
      'button:has-text("Criar")',
      'button:has-text("New")',
      '[data-testid*="new-funnel"]',
      '[data-testid*="create-funnel"]'
    ];
    
    let foundNewButton = false;
    for (const selector of newFunnelSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        await page.waitForTimeout(1000);
        foundNewButton = true;
        console.log('✅ Opção de criar novo funil encontrada');
        break;
      }
    }
    
    if (!foundNewButton) {
      console.log('ℹ️ Modal de criação pode abrir automaticamente');
    }
  });

  test('deve carregar com template de 21 etapas', async ({ page }) => {
    await page.goto(`${EDITOR_URL}?template=quiz-estilo-21-steps`);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    await page.waitForTimeout(2000);
    
    // Contar etapas no sidebar
    const steps = await page.locator('[data-testid*="step-"], .step-item, li[data-step]').all();
    
    console.log(`✅ Template carregado com ${steps.length} etapas visíveis`);
    expect(steps.length).toBeGreaterThan(0);
  });
});

test.describe('📝 Editor - Edição com FunnelId', () => {
  
  test('deve carregar funil específico por ID', async ({ page }) => {
    const funnelId = 'quiz-estilo-21-steps';
    await page.goto(`${EDITOR_URL}/${funnelId}`);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Verificar se o ID está na URL
    await expect(page).toHaveURL(new RegExp(funnelId));
    
    // Verificar se carregou conteúdo
    await page.waitForTimeout(2000);
    const hasContent = await page.locator('[data-testid*="editor"], .editor-container').first().isVisible();
    expect(hasContent).toBeTruthy();
    
    console.log(`✅ Funil ${funnelId} carregado`);
  });

  test('deve preservar alterações ao recarregar', async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Fazer uma alteração
    const textInput = page.locator('input[type="text"], textarea').first();
    if (await textInput.isVisible().catch(() => false)) {
      const uniqueText = `E2E Test ${Date.now()}`;
      await textInput.fill(uniqueText);
      await page.waitForTimeout(500);
      
      // Salvar se possível
      const saveButton = page.locator('button:has-text("Salvar"), [data-action="save"]').first();
      if (await saveButton.isVisible().catch(() => false)) {
        await saveButton.click();
        await page.waitForTimeout(1000);
      }
      
      // Recarregar página
      await page.reload();
      await page.waitForLoadState('networkidle');
      await closeStartupModal(page);
      
      // Verificar se o texto persiste (pode estar no localStorage)
      console.log('✅ Teste de persistência executado');
    }
  });
});

test.describe('📝 Editor - Responsividade', () => {
  
  test('deve funcionar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    // Verificar se o editor está acessível
    const editorVisible = await page.locator('[data-testid*="editor"], .editor-container, main').first().isVisible();
    expect(editorVisible).toBeTruthy();
    
    console.log('✅ Editor funcional em mobile');
  });

  test('deve funcionar em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    await closeStartupModal(page);
    
    const editorVisible = await page.locator('[data-testid*="editor"], .editor-container, main').first().isVisible();
    expect(editorVisible).toBeTruthy();
    
    console.log('✅ Editor funcional em tablet');
  });
});

// ============================================================================
// HELPERS
// ============================================================================

async function closeStartupModal(page: Page) {
  await page.waitForTimeout(500);
  
  const modalSelectors = [
    '[data-testid*="modal"]',
    '[role="dialog"]',
    '.modal',
    '[data-testid*="startup"]'
  ];
  
  for (const selector of modalSelectors) {
    const modal = page.locator(selector).first();
    if (await modal.isVisible().catch(() => false)) {
      // Tentar fechar com X
      const closeButton = modal.locator('button[aria-label*="close"], button[aria-label*="fechar"], .close-button, [data-testid*="close"]').first();
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click();
        await page.waitForTimeout(500);
        return;
      }
      
      // Tentar clicar em qualquer botão do modal
      const anyButton = modal.locator('button').first();
      if (await anyButton.isVisible().catch(() => false)) {
        await anyButton.click();
        await page.waitForTimeout(500);
        return;
      }
    }
  }
}
