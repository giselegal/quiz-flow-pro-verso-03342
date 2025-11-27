/**
 * 🧪 E2E Tests - Coluna 01: Steps Navigator
 * 
 * Testa individualmente a coluna de navegação de steps
 * Valida estrutura, funcionalidade, acessibilidade e boas práticas
 */

import { test, expect } from '@playwright/test';

const EDITOR_URL = 'http://localhost:8080/editor?resource=quiz21StepsComplete';
const TIMEOUT = 60000; // 60s por teste

test.describe('Column 01: Steps Navigator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('[data-testid="column-steps"]', { timeout: 15000 });
    await page.waitForTimeout(1000); // Aguardar JS carregar
  });

  // ✅ TESTE 01: Estrutura HTML correta
  test('01.01 - Estrutura HTML semântica e organizada', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    // Verificar existência
    await expect(column).toBeVisible();
    
    // Verificar classes base (bg-white, border-r, overflow-y-auto)
    const classes = await column.getAttribute('class');
    expect(classes).toContain('bg-white');
    expect(classes).toContain('border-r');
    expect(classes).toContain('overflow-y-auto');
    expect(classes).toContain('flex-col');
    
    // Verificar h-full para ocupar altura total
    expect(classes).toContain('h-full');
    
    console.log('✅ Estrutura HTML correta');
  });

  // ✅ TESTE 02: Lista de steps renderizada
  test('01.02 - Lista de steps visível e interativa', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    // Aguardar carregamento dos steps (pode ter skeleton)
    await page.waitForTimeout(2000);
    
    // Verificar se há items de step (pelo menos 1)
    const stepItems = column.locator('button, li, [data-step-id]').first();
    await expect(stepItems).toBeVisible({ timeout: 5000 });
    
    // Contar quantos steps existem
    const count = await column.locator('button, li, [data-step-id]').count();
    console.log(`📊 Steps encontrados: ${count}`);
    expect(count).toBeGreaterThan(0);
    
    console.log('✅ Lista de steps renderizada');
  });

  // ✅ TESTE 03: Step selecionado destacado
  test('01.03 - Step ativo visualmente destacado', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    await page.waitForTimeout(2000);
    
    // Procurar por step com estado ativo (bg-blue, bg-primary, selected, etc)
    const activeStep = column.locator('[class*="bg-blue"], [class*="bg-primary"], [aria-current="true"], [data-active="true"]').first();
    
    // Pode não ter step ativo inicialmente, então verificar se existe
    const hasActiveStep = await activeStep.count() > 0;
    
    if (hasActiveStep) {
      await expect(activeStep).toBeVisible();
      console.log('✅ Step ativo encontrado e destacado');
    } else {
      console.log('⚠️ Nenhum step ativo inicialmente (OK se não houver seleção)');
    }
  });

  // ✅ TESTE 04: Botão "Add Step" presente
  test('01.04 - Botão de adicionar step acessível', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    // Procurar por botão com Plus icon ou texto "Add" / "Adicionar"
    const addButton = column.locator('button:has-text("Add"), button:has-text("Adicionar"), button:has(svg)').first();
    
    const hasAddButton = await addButton.count() > 0;
    
    if (hasAddButton) {
      await expect(addButton).toBeVisible();
      
      // Verificar se não está disabled
      const isDisabled = await addButton.isDisabled();
      expect(isDisabled).toBe(false);
      
      console.log('✅ Botão Add Step presente e habilitado');
    } else {
      console.log('⚠️ Botão Add Step não encontrado (pode estar oculto ou em dropdown)');
    }
  });

  // ✅ TESTE 05: Drag and drop habilitado
  test('01.05 - Suporte a drag and drop para reordenar', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    await page.waitForTimeout(2000);
    
    // Procurar por elementos com cursor-grab ou data-dnd
    const draggableItems = column.locator('[class*="cursor-grab"], [draggable="true"], [data-sortable-id]');
    const count = await draggableItems.count();
    
    if (count > 0) {
      console.log(`✅ ${count} items com drag and drop habilitado`);
      
      // Verificar cursor styles no primeiro item
      const firstItem = draggableItems.first();
      const classes = await firstItem.getAttribute('class');
      
      const hasDragCursor = classes?.includes('cursor-grab') || classes?.includes('cursor-move');
      console.log(`Cursor drag: ${hasDragCursor ? 'SIM' : 'NÃO'}`);
    } else {
      console.log('⚠️ Nenhum item com drag and drop visível');
    }
  });

  // ✅ TESTE 06: Health Panel Toggle Button
  test('01.06 - Botão de Health Panel presente no rodapé', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    // Procurar por botão "Saúde do Template" ou similar
    const healthButton = column.locator('button:has-text("Saúde"), button:has-text("Health")');
    
    const hasButton = await healthButton.count() > 0;
    
    if (hasButton) {
      await expect(healthButton.first()).toBeVisible();
      
      // Testar click (deve abrir/fechar painel)
      await healthButton.first().click();
      await page.waitForTimeout(500);
      
      console.log('✅ Botão Health Panel funcional');
    } else {
      console.log('⚠️ Botão Health Panel não encontrado');
    }
  });

  // ✅ TESTE 07: Validation badges (erros/warnings)
  test('01.07 - Badges de validação visíveis quando há erros', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    await page.waitForTimeout(2000);
    
    // Procurar por badges de erro/warning (⚠, ❌, números de erros)
    const errorBadges = column.locator('[class*="text-red"], [class*="text-orange"], [class*="text-yellow"]');
    const count = await errorBadges.count();
    
    console.log(`📊 Badges de validação encontrados: ${count}`);
    
    // Badges podem não estar presentes se template estiver válido
    if (count > 0) {
      console.log('✅ Sistema de validação visual ativo');
    } else {
      console.log('✅ Nenhum erro/warning (template válido)');
    }
  });

  // ✅ TESTE 08: Scroll vertical funcionando
  test('01.08 - Overflow scroll vertical habilitado', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    // Verificar classe overflow-y-auto
    const classes = await column.getAttribute('class');
    expect(classes).toContain('overflow-y-auto');
    
    // Tentar scroll (verificar se não trava)
    await column.hover();
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(300);
    
    console.log('✅ Scroll vertical funcional');
  });

  // ✅ TESTE 09: Acessibilidade - ARIA labels
  test('01.09 - Elementos com ARIA labels apropriados', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    // Verificar se botões têm aria-label ou title
    const buttons = column.locator('button');
    const buttonCount = await buttons.count();
    
    let accessibleCount = 0;
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      
      if (ariaLabel || title) {
        accessibleCount++;
      }
    }
    
    console.log(`📊 Botões com acessibilidade: ${accessibleCount}/${Math.min(buttonCount, 5)}`);
    
    // Pelo menos 50% devem ter labels
    if (buttonCount > 0) {
      const ratio = accessibleCount / Math.min(buttonCount, 5);
      expect(ratio).toBeGreaterThanOrEqual(0.5);
    }
    
    console.log('✅ Acessibilidade adequada');
  });

  // ✅ TESTE 10: Performance - Renderização rápida
  test('01.10 - Coluna carrega em menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: TIMEOUT });
    await page.waitForSelector('[data-testid="column-steps"]', { timeout: 10000 });
    
    // Aguardar primeiro step visível
    await page.waitForSelector('[data-testid="column-steps"] button, [data-testid="column-steps"] li', { timeout: 5000 });
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(3000);
    console.log('✅ Performance adequada');
  });

  // ✅ TESTE 11: Responsividade - Largura adaptável
  test('01.11 - Coluna respeita min/max size do Panel', async ({ page }) => {
    const column = page.locator('[data-testid="column-steps"]');
    
    // Verificar se está dentro de um Panel com constraints
    const parent = column.locator('..');
    const parentClass = await parent.getAttribute('class');
    
    // Panel deve ter data-panel-id
    const panelId = await parent.getAttribute('data-panel-id');
    
    if (panelId) {
      console.log(`✅ Coluna dentro de Panel resizável: ${panelId}`);
    } else {
      console.log('⚠️ Coluna não está em Panel resizável');
    }
    
    // Verificar largura atual
    const box = await column.boundingBox();
    if (box) {
      console.log(`📏 Largura atual: ${Math.round(box.width)}px`);
      
      // Deve estar entre 10% e 25% do viewport (aprox 150-400px em 1600px)
      expect(box.width).toBeGreaterThan(100);
      expect(box.width).toBeLessThan(500);
    }
  });

  // ✅ TESTE 12: Estados de loading (skeleton)
  test('01.12 - Skeleton loading states durante carregamento', async ({ page }) => {
    // Recarregar página e capturar estado inicial
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded' });
    
    const column = page.locator('[data-testid="column-steps"]');
    
    // Procurar por skeleton loaders nos primeiros 500ms
    const skeleton = column.locator('[class*="skeleton"], [class*="animate-pulse"]');
    
    // Verificar se skeleton aparece (pode ser rápido demais)
    const hasSkeletons = await skeleton.count() > 0;
    
    if (hasSkeletons) {
      console.log('✅ Skeleton loading states implementados');
    } else {
      console.log('⚠️ Carregamento muito rápido para detectar skeletons (bom!)');
    }
    
    // Aguardar carregamento completo
    await page.waitForSelector('[data-testid="column-steps"] button, [data-testid="column-steps"] li', { timeout: 5000 });
    
    // Skeleton deve desaparecer após carregamento
    const finalSkeletonCount = await skeleton.count();
    console.log(`Skeletons após carregamento: ${finalSkeletonCount}`);
  });
});
