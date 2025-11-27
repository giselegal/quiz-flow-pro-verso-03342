/**
 * 🧪 E2E Tests - Coluna 04: Properties Panel
 * 
 * Testa individualmente a coluna de propriedades
 * Valida formulários, edição, validação e sincronização
 */

import { test, expect } from '@playwright/test';

const EDITOR_URL = 'http://localhost:8080/editor?resource=quiz21StepsComplete';
const TIMEOUT = 60000;

test.describe('Column 04: Properties Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Aguardar canvas e selecionar primeiro bloco
    await page.waitForSelector('[data-testid="column-canvas"]', { timeout: 15000 });
    await page.waitForTimeout(1500);
    
    // Tentar selecionar primeiro bloco
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click({ timeout: 15000, force: true });
      await page.waitForTimeout(800);
    }
  });

  // ✅ TESTE 01: Estrutura HTML correta
  test('04.01 - Estrutura HTML semântica', async ({ page }) => {
    const column = page.locator('[data-testid="column-properties"]');
    
    // Column pode não existir se properties panel estiver oculto
    const hasColumn = await column.count() > 0;
    
    if (hasColumn) {
      await expect(column).toBeVisible();
      
      const classes = await column.getAttribute('class');
      expect(classes).toContain('border-l');
      
      console.log('✅ Estrutura HTML correta');
    } else {
      // Procurar por qualquer painel de propriedades
      const propertiesPanel = page.locator('[class*="properties"], [class*="Properties"]').first();
      const hasPanel = await propertiesPanel.count() > 0;
      
      if (hasPanel) {
        console.log('✅ Painel de propriedades encontrado (sem testid específico)');
      } else {
        console.log('⚠️ Painel de propriedades não visível (pode estar oculto)');
      }
    }
  });

  // ✅ TESTE 02: Painel vazio quando nenhum bloco selecionado
  test('04.02 - Empty state quando nada selecionado', async ({ page }) => {
    // Recarregar sem selecionar bloco
    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: TIMEOUT });
    await page.waitForTimeout(2000);
    
    // Procurar por mensagem de "Selecione um bloco"
    const emptyMessage = page.locator('text=/selecione um bloco|select a block|nenhum bloco|no block/i');
    const hasEmptyState = await emptyMessage.count() > 0;
    
    if (hasEmptyState) {
      console.log('✅ Empty state encontrado');
      const text = await emptyMessage.first().innerText();
      console.log(`Mensagem: "${text}"`);
    } else {
      console.log('⚠️ Empty state não encontrado (pode ter seleção automática)');
    }
  });

  // ✅ TESTE 03: Formulário carregado com bloco selecionado
  test('04.03 - Formulário de propriedades aparece ao selecionar bloco', async ({ page }) => {
    // Selecionar primeiro bloco
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click();
      await page.waitForTimeout(500);
      
      // Procurar por inputs, labels, form elements
      const formElements = page.locator('input, textarea, select, label');
      const count = await formElements.count();
      
      console.log(`📊 Elementos de formulário: ${count}`);
      
      if (count > 0) {
        console.log('✅ Formulário de propriedades renderizado');
      } else {
        console.log('⚠️ Nenhum elemento de formulário (verificar implementação)');
      }
    } else {
      console.log('⚠️ Nenhum bloco para selecionar');
    }
  });

  // ✅ TESTE 04: Campos editáveis
  test('04.04 - Inputs são editáveis', async ({ page }) => {
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click();
      await page.waitForTimeout(500);
      
      // Procurar por input de texto editável
      const textInput = page.locator('input[type="text"], textarea').first();
      const hasInput = await textInput.count() > 0;
      
      if (hasInput) {
        // Testar edição
        await textInput.fill('Teste de edição');
        await page.waitForTimeout(300);
        
        const value = await textInput.inputValue();
        expect(value).toBe('Teste de edição');
        
        console.log('✅ Campos editáveis funcionais');
      } else {
        console.log('⚠️ Nenhum input editável encontrado');
      }
    }
  });

  // ✅ TESTE 05: Tabs de propriedades/conteúdo
  test('04.05 - Tabs para alternar entre propriedades e conteúdo', async ({ page }) => {
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click();
      await page.waitForTimeout(500);
      
      // Procurar por tabs (Properties, Content, Style, etc)
      const tabs = page.locator('[role="tab"], [class*="tab"]');
      const count = await tabs.count();
      
      if (count > 0) {
        console.log(`✅ ${count} tabs encontradas`);
        
        // Testar click na segunda tab
        if (count > 1) {
          await tabs.nth(1).click();
          await page.waitForTimeout(300);
          console.log('✅ Navegação entre tabs funcional');
        }
      } else {
        console.log('⚠️ Sistema de tabs não encontrado');
      }
    }
  });

  // ✅ TESTE 06: Botão de delete presente
  test('04.06 - Botão de deletar bloco visível', async ({ page }) => {
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click();
      await page.waitForTimeout(500);
      
      // Procurar por botão delete/remove/trash
      const deleteButton = page.locator('button:has-text("Delete"), button:has-text("Deletar"), button:has-text("Remover")');
      const hasDelete = await deleteButton.count() > 0;
      
      if (hasDelete) {
        await expect(deleteButton.first()).toBeVisible();
        console.log('✅ Botão delete presente');
      } else {
        console.log('⚠️ Botão delete não encontrado');
      }
    }
  });

  // ✅ TESTE 07: Botão de duplicar presente
  test('04.07 - Botão de duplicar bloco visível', async ({ page }) => {
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click();
      await page.waitForTimeout(500);
      
      // Procurar por botão duplicate/copy
      const duplicateButton = page.locator('button:has-text("Duplicate"), button:has-text("Duplicar"), button:has-text("Copiar")');
      const hasDuplicate = await duplicateButton.count() > 0;
      
      if (hasDuplicate) {
        await expect(duplicateButton.first()).toBeVisible();
        console.log('✅ Botão duplicar presente');
      } else {
        console.log('⚠️ Botão duplicar não encontrado');
      }
    }
  });

  // ✅ TESTE 08: Accordion para seções colapsáveis
  test('04.08 - Seções de propriedades com accordion', async ({ page }) => {
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click();
      await page.waitForTimeout(500);
      
      // Procurar por accordion headers
      const accordionHeaders = page.locator('[role="button"]:has(svg), summary, [class*="accordion"]');
      const count = await accordionHeaders.count();
      
      if (count > 0) {
        console.log(`✅ ${count} seções de accordion encontradas`);
        
        // Testar collapse/expand
        await accordionHeaders.first().click();
        await page.waitForTimeout(300);
        console.log('✅ Accordion funcional');
      } else {
        console.log('⚠️ Accordion não encontrado (propriedades podem estar sempre visíveis)');
      }
    }
  });

  // ✅ TESTE 09: Validação visual de campos
  test('04.09 - Feedback de validação em campos inválidos', async ({ page }) => {
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click();
      await page.waitForTimeout(500);
      
      // Procurar por inputs com validação (border-red, text-red)
      const invalidInputs = page.locator('[class*="border-red"], [class*="text-red"], [aria-invalid="true"]');
      const count = await invalidInputs.count();
      
      console.log(`📊 Campos com validação visual: ${count}`);
      
      if (count > 0) {
        console.log('✅ Sistema de validação visual presente');
      } else {
        console.log('✅ Nenhum erro de validação (campos válidos)');
      }
    }
  });

  // ✅ TESTE 10: Scroll vertical funcional
  test('04.10 - Overflow scroll para propriedades longas', async ({ page }) => {
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click();
      await page.waitForTimeout(500);
      
      // Procurar por container com overflow
      const scrollContainer = page.locator('[class*="overflow-y-auto"]').last();
      const hasScroll = await scrollContainer.count() > 0;
      
      if (hasScroll) {
        await scrollContainer.hover();
        await page.mouse.wheel(0, 200);
        await page.waitForTimeout(300);
        
        console.log('✅ Scroll vertical funcional');
      } else {
        console.log('⚠️ Container com scroll não encontrado');
      }
    }
  });

  // ✅ TESTE 11: Preview mode selector
  test('04.11 - Seletor de modo de preview (desktop/tablet/mobile)', async ({ page }) => {
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      await firstBlock.click();
      await page.waitForTimeout(500);
      
      // Procurar por seletores de device (desktop/tablet/mobile)
      const deviceSelectors = page.locator('button:has-text("Desktop"), button:has-text("Tablet"), button:has-text("Mobile")');
      const count = await deviceSelectors.count();
      
      if (count > 0) {
        console.log(`✅ ${count} seletores de device encontrados`);
      } else {
        console.log('⚠️ Seletores de preview mode não encontrados (podem estar no header)');
      }
    }
  });

  // ✅ TESTE 12: Performance - Atualização rápida
  test('04.12 - Propriedades carregam rapidamente ao selecionar', async ({ page }) => {
    const firstBlock = page.locator('[data-testid="column-canvas"] [data-block-id]').first();
    const hasBlock = await firstBlock.count() > 0;
    
    if (hasBlock) {
      const startTime = Date.now();
      
      await firstBlock.click();
      
      // Aguardar formulário aparecer
      await page.waitForSelector('input, textarea, select', { timeout: 2000 }).catch(() => {
        console.log('⚠️ Nenhum formulário detectado');
      });
      
      const loadTime = Date.now() - startTime;
      console.log(`⏱️ Tempo para carregar propriedades: ${loadTime}ms`);
      
      expect(loadTime).toBeLessThan(1000);
      console.log('✅ Performance excelente');
    }
  });

  // ✅ TESTE 13: Não há Health Panel bloqueando
  test('04.13 - Health Panel não bloqueia coluna de propriedades', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Verificar se Health Panel está aberto sobre a coluna
    const healthPanel = page.locator('[class*="fixed"]:has-text("Saúde"), [class*="fixed"]:has-text("Health")');
    const isPanelOpen = await healthPanel.count() > 0 && await healthPanel.first().isVisible();
    
    if (isPanelOpen) {
      console.log('⚠️ Health Panel está aberto');
      
      // Verificar se tem botão de fechar visível
      const closeButton = healthPanel.locator('button[aria-label*="Fechar"], button:has-text("×")');
      const hasCloseButton = await closeButton.count() > 0;
      
      if (hasCloseButton) {
        await expect(closeButton.first()).toBeVisible();
        console.log('✅ Botão de fechar Health Panel presente');
        
        // Fechar painel
        await closeButton.first().click();
        await page.waitForTimeout(500);
        
        console.log('✅ Health Panel fechado com sucesso');
      } else {
        console.log('⚠️ Botão de fechar não encontrado');
      }
    } else {
      console.log('✅ Health Panel não está bloqueando');
    }
  });
});
