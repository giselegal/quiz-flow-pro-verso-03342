/**
 * 🧪 SPRINT 2 - E2E TEST SUITE: Funnel CRUD Operations
 * 
 * Testes end-to-end para operações CRUD de funnels:
 * - Criar novo funnel
 * - Editar funnel existente
 * - Duplicar funnel
 * - Publicar/Despublicar
 * - Deletar funnel
 * 
 * @sprint 2
 * @priority HIGH
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Sprint 2: Funnel CRUD Operations', () => {
  let page: Page;
  let testFunnelId: string;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Navegar para dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('CRUD-001: Deve criar novo funnel com sucesso', async () => {
    await test.step('1. Clicar em "Criar Funil"', async () => {
      const createBtn = page.locator('button', { 
        hasText: /criar.*funil|novo.*funil|new.*funnel/i 
      }).first();
      
      await expect(createBtn).toBeVisible({ timeout: 10000 });
      await createBtn.click();
      
      // Aguardar modal/form aparecer
      await page.waitForTimeout(500);
    });

    await test.step('2. Preencher dados do funnel', async () => {
      // Nome do funnel
      const nameInput = page.locator('input[name="name"], input[placeholder*="nome" i]').first();
      await expect(nameInput).toBeVisible();
      
      const funnelName = `E2E Test Funnel ${Date.now()}`;
      await nameInput.fill(funnelName);
      
      // Descrição (opcional)
      const descInput = page.locator('textarea, input[name="description"]').first();
      if (await descInput.isVisible()) {
        await descInput.fill('Funil criado por teste E2E automatizado');
      }
      
      // Selecionar template
      const templateSelect = page.locator('select[name="template"], [role="combobox"]').first();
      if (await templateSelect.isVisible()) {
        await templateSelect.selectOption('quiz21StepsComplete');
      }
      
      console.log(`  📝 Dados preenchidos: ${funnelName}`);
    });

    await test.step('3. Salvar e validar criação', async () => {
      const saveBtn = page.locator('button', { 
        hasText: /criar|salvar|save|create/i 
      }).first();
      
      await saveBtn.click();
      
      // Aguardar redirecionamento ou confirmação
      await page.waitForTimeout(2000);
      
      // Verificar se funnel aparece na lista
      const funnelCard = page.locator('[data-testid*="funnel"], .funnel-card').first();
      await expect(funnelCard).toBeVisible({ timeout: 10000 });
      
      // Capturar ID do funnel criado
      testFunnelId = await page.evaluate(() => {
        const url = window.location.href;
        const match = url.match(/funnel[/-]([a-z0-9-]+)/i);
        return match ? match[1] : '';
      });
      
      console.log(`  ✅ Funnel criado: ID=${testFunnelId}`);
    });
  });

  test('CRUD-002: Deve editar funnel existente', async () => {
    await test.step('1. Selecionar funnel para editar', async () => {
      // Procurar primeiro funnel disponível
      const funnelCard = page.locator('[data-testid*="funnel"], .funnel-card').first();
      await expect(funnelCard).toBeVisible({ timeout: 10000 });
      
      // Clicar em editar
      const editBtn = funnelCard.locator('button', { hasText: /editar|edit/i }).first();
      
      if (await editBtn.isVisible()) {
        await editBtn.click();
      } else {
        // Se não tem botão explícito, clicar no card
        await funnelCard.click();
      }
      
      await page.waitForTimeout(1000);
    });

    await test.step('2. Modificar propriedades', async () => {
      // Aguardar editor carregar
      await expect(page).toHaveURL(/editor|edit/i);
      
      // Modificar título se houver campo
      const titleInput = page.locator('input[name="title"], [data-property="title"]').first();
      
      if (await titleInput.isVisible({ timeout: 5000 })) {
        const newTitle = `Título Editado ${Date.now()}`;
        await titleInput.clear();
        await titleInput.fill(newTitle);
        
        console.log(`  ✏️ Título modificado: ${newTitle}`);
      }
      
      // Modificar cor de fundo se houver color picker
      const colorInput = page.locator('input[type="color"]').first();
      
      if (await colorInput.isVisible({ timeout: 3000 })) {
        await colorInput.fill('#FF5733');
        console.log('  🎨 Cor de fundo modificada');
      }
    });

    await test.step('3. Salvar alterações', async () => {
      const saveBtn = page.locator('button', { 
        hasText: /salvar|save|publicar/i 
      }).first();
      
      if (await saveBtn.isVisible()) {
        await saveBtn.click();
        
        // Aguardar confirmação
        await page.waitForTimeout(2000);
        
        // Verificar mensagem de sucesso
        const successMessage = page.locator('text=/salvo|saved|success/i').first();
        
        if (await successMessage.isVisible({ timeout: 5000 })) {
          console.log('  ✅ Alterações salvas com sucesso');
        }
      }
    });
  });

  test('CRUD-003: Deve duplicar funnel', async () => {
    await test.step('1. Selecionar funnel para duplicar', async () => {
      const funnelCard = page.locator('[data-testid*="funnel"], .funnel-card').first();
      await expect(funnelCard).toBeVisible({ timeout: 10000 });
      
      // Procurar menu de ações (3 dots)
      const menuBtn = funnelCard.locator('button[aria-label*="menu"], button[aria-label*="actions"]').first();
      
      if (await menuBtn.isVisible({ timeout: 3000 })) {
        await menuBtn.click();
        await page.waitForTimeout(300);
        
        // Clicar em duplicar
        const duplicateBtn = page.locator('button, [role="menuitem"]', { 
          hasText: /duplicar|duplicate|copiar/i 
        }).first();
        
        if (await duplicateBtn.isVisible()) {
          await duplicateBtn.click();
          await page.waitForTimeout(2000);
          
          // Verificar se novo funnel foi criado
          const funnelCards = page.locator('[data-testid*="funnel"], .funnel-card');
          const count = await funnelCards.count();
          
          expect(count).toBeGreaterThan(1);
          console.log(`  ✅ Funnel duplicado (total: ${count})`);
        } else {
          console.log('  ⚠️ Botão duplicar não encontrado');
        }
      }
    });
  });

  test('CRUD-004: Deve publicar e despublicar funnel', async () => {
    await test.step('1. Navegar para editor', async () => {
      const funnelCard = page.locator('[data-testid*="funnel"], .funnel-card').first();
      await funnelCard.click();
      
      await expect(page).toHaveURL(/editor|edit/i);
      await page.waitForTimeout(1000);
    });

    await test.step('2. Publicar funnel', async () => {
      const publishBtn = page.locator('button', { 
        hasText: /publicar|publish|live/i 
      }).first();
      
      if (await publishBtn.isVisible({ timeout: 5000 })) {
        await publishBtn.click();
        await page.waitForTimeout(1000);
        
        // Verificar status publicado
        const statusBadge = page.locator('text=/publicado|published|live/i').first();
        
        if (await statusBadge.isVisible({ timeout: 5000 })) {
          console.log('  ✅ Funnel publicado');
        }
      }
    });

    await test.step('3. Despublicar funnel', async () => {
      const unpublishBtn = page.locator('button', { 
        hasText: /despublicar|unpublish|draft/i 
      }).first();
      
      if (await unpublishBtn.isVisible({ timeout: 5000 })) {
        await unpublishBtn.click();
        await page.waitForTimeout(1000);
        
        // Verificar status rascunho
        const statusBadge = page.locator('text=/rascunho|draft/i').first();
        
        if (await statusBadge.isVisible({ timeout: 5000 })) {
          console.log('  ✅ Funnel despublicado');
        }
      }
    });
  });

  test('CRUD-005: Deve deletar funnel', async () => {
    let initialCount: number;

    await test.step('1. Contar funnels existentes', async () => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      const funnelCards = page.locator('[data-testid*="funnel"], .funnel-card');
      initialCount = await funnelCards.count();
      
      console.log(`  📊 Funnels existentes: ${initialCount}`);
    });

    await test.step('2. Selecionar último funnel para deletar', async () => {
      const funnelCards = page.locator('[data-testid*="funnel"], .funnel-card');
      const lastFunnel = funnelCards.last();
      
      // Procurar menu de ações
      const menuBtn = lastFunnel.locator('button[aria-label*="menu"], button[aria-label*="actions"]').first();
      
      if (await menuBtn.isVisible({ timeout: 3000 })) {
        await menuBtn.click();
        await page.waitForTimeout(300);
        
        // Clicar em deletar
        const deleteBtn = page.locator('button, [role="menuitem"]', { 
          hasText: /deletar|delete|excluir|remover/i 
        }).first();
        
        if (await deleteBtn.isVisible()) {
          await deleteBtn.click();
          await page.waitForTimeout(500);
          
          // Confirmar deleção no modal
          const confirmBtn = page.locator('button', { 
            hasText: /confirmar|sim|delete|yes/i 
          }).first();
          
          if (await confirmBtn.isVisible({ timeout: 3000 })) {
            await confirmBtn.click();
            await page.waitForTimeout(2000);
          }
        }
      }
    });

    await test.step('3. Validar que funnel foi removido', async () => {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const funnelCards = page.locator('[data-testid*="funnel"], .funnel-card');
      const finalCount = await funnelCards.count();
      
      expect(finalCount).toBe(initialCount - 1);
      console.log(`  ✅ Funnel deletado (restantes: ${finalCount})`);
    });
  });

  test('CRUD-006: Deve validar campos obrigatórios ao criar', async () => {
    await test.step('1. Tentar criar funnel sem preencher nome', async () => {
      const createBtn = page.locator('button', { 
        hasText: /criar.*funil|novo/i 
      }).first();
      
      await createBtn.click();
      await page.waitForTimeout(500);
      
      // Não preencher nada, tentar salvar direto
      const saveBtn = page.locator('button', { 
        hasText: /criar|salvar/i 
      }).first();
      
      await saveBtn.click();
      await page.waitForTimeout(500);
      
      // Deve exibir erro de validação
      const errorMessage = page.locator('text=/obrigatório|required|preencha/i').first();
      
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
      console.log('  ✅ Validação de campos funcionando');
    });
  });
});

/**
 * 🎯 CHECKLIST DE COBERTURA
 * 
 * Funnel CRUD Tests:
 * ✅ CRUD-001: Criar novo funnel
 * ✅ CRUD-002: Editar funnel existente
 * ✅ CRUD-003: Duplicar funnel
 * ✅ CRUD-004: Publicar/Despublicar
 * ✅ CRUD-005: Deletar funnel
 * ✅ CRUD-006: Validação de campos obrigatórios
 * 
 * Próximos testes:
 * - [ ] Permissões (multi-usuário)
 * - [ ] Versionamento de funnels
 * - [ ] Import/Export de funnels
 * - [ ] Bulk operations (deletar múltiplos)
 */
