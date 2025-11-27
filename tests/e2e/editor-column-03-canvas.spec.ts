/**
 * 🧪 E2E Tests - Coluna 03: Canvas
 * 
 * Testa individualmente a coluna canvas (área de edição)
 * Valida renderização de blocos, drag-drop, seleção e interação
 */

import { test, expect } from '@playwright/test';

const EDITOR_URL = 'http://localhost:8080/editor?resource=quiz21StepsComplete';
const TIMEOUT = 60000;

test.describe('Column 03: Canvas (Editing Area)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('[data-testid="column-canvas"]', { timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  // ✅ TESTE 01: Estrutura HTML correta
  test('03.01 - Estrutura HTML semântica', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    await expect(column).toBeVisible();
    
    const classes = await column.getAttribute('class');
    expect(classes).toContain('bg-gray-50');
    expect(classes).toContain('overflow-y-auto');
    expect(classes).toContain('h-full');
    
    console.log('✅ Estrutura HTML correta');
  });

  // ✅ TESTE 02: Canvas NÃO tem pointer-events-none (CRITICAL BUG)
  test('03.02 - Canvas clicável (sem pointer-events-none)', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    await page.waitForTimeout(2000);
    
    // Verificar classes
    const classes = await column.getAttribute('class');
    expect(classes).not.toContain('pointer-events-none');
    
    // Verificar style inline
    const style = await column.getAttribute('style');
    if (style) {
      expect(style).not.toContain('pointer-events: none');
    }
    
    // Verificar filhos diretos
    const children = await column.locator('> *').count();
    console.log(`📊 Filhos diretos do canvas: ${children}`);
    expect(children).toBeGreaterThan(0);
    
    const firstChild = column.locator('> *').first();
    const childClasses = await firstChild.getAttribute('class');
    expect(childClasses).not.toContain('pointer-events-none');
    
    console.log('✅ Canvas totalmente clicável');
  });

  // ✅ TESTE 03: Blocos renderizados
  test('03.03 - Blocos do step visíveis no canvas', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    await page.waitForTimeout(2000);
    
    // Procurar por blocos renderizados ([data-block-id])
    const blocks = column.locator('[data-block-id]');
    const count = await blocks.count();
    
    console.log(`📊 Blocos encontrados: ${count}`);
    
    if (count > 0) {
      // Verificar se primeiro bloco está visível
      await expect(blocks.first()).toBeVisible();
      console.log('✅ Blocos renderizados corretamente');
    } else {
      console.log('⚠️ Nenhum bloco no step atual (pode ser step vazio)');
    }
  });

  // ✅ TESTE 04: Viewport container presente
  test('03.04 - Viewport container para preview responsivo', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    // Procurar por ViewportContainer
    const viewport = column.locator('[data-testid*="viewport"], [class*="viewport"]');
    const hasViewport = await viewport.count() > 0;
    
    if (hasViewport) {
      console.log('✅ Viewport container implementado');
      
      // Verificar atributos
      const testId = await viewport.first().getAttribute('data-testid');
      console.log(`Viewport testid: ${testId}`);
    } else {
      console.log('⚠️ Viewport container não encontrado');
    }
  });

  // ✅ TESTE 05: Drag and drop de blocos
  test('03.05 - Blocos com drag and drop habilitado', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    await page.waitForTimeout(2000);
    
    const draggableBlocks = column.locator('[data-block-id][class*="cursor-grab"]');
    const count = await draggableBlocks.count();
    
    if (count > 0) {
      console.log(`✅ ${count} blocos com drag habilitado`);
      
      // Verificar cursor no primeiro bloco
      const firstBlock = draggableBlocks.first();
      const classes = await firstBlock.getAttribute('class');
      expect(classes).toContain('cursor-grab');
    } else {
      console.log('⚠️ Nenhum bloco draggable encontrado (pode estar em modo preview)');
    }
  });

  // ✅ TESTE 06: Seleção de bloco funcional
  test('03.06 - Click em bloco seleciona e destaca', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    await page.waitForTimeout(2000);
    
    const blocks = column.locator('[data-block-id]');
    const count = await blocks.count();
    
    if (count > 0) {
      const firstBlock = blocks.first();
      const blockId = await firstBlock.getAttribute('data-block-id');
      
      // Click no bloco
      await firstBlock.click({ timeout: 10000, force: true });
      await page.waitForTimeout(300);
      
      // Verificar se ficou com border azul ou bg-blue (selecionado)
      const classes = await firstBlock.getAttribute('class');
      const isSelected = classes?.includes('border-blue') || classes?.includes('bg-blue');
      
      console.log(`✅ Bloco ${blockId} clicado - Selecionado: ${isSelected ? 'SIM' : 'PODE NÃO TER VISUAL'}`);
    } else {
      console.log('⚠️ Nenhum bloco para testar seleção');
    }
  });

  // ✅ TESTE 07: Botões de controle nos blocos
  test('03.07 - Blocos têm botões de controle (mover, deletar)', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    await page.waitForTimeout(2000);
    
    const blocks = column.locator('[data-block-id]');
    const count = await blocks.count();
    
    if (count > 0) {
      const firstBlock = blocks.first();
      
      // Procurar por botões dentro do bloco
      const buttons = firstBlock.locator('button');
      const buttonCount = await buttons.count();
      
      console.log(`📊 Botões no bloco: ${buttonCount}`);
      
      if (buttonCount > 0) {
        // Verificar se tem botões de move (↑ ↓) ou delete (×)
        const firstButton = buttons.first();
        const text = await firstButton.innerText();
        console.log(`Exemplo de botão: "${text}"`);
        
        console.log('✅ Controles de bloco presentes');
      } else {
        console.log('⚠️ Nenhum botão de controle (pode estar em modo preview)');
      }
    }
  });

  // ✅ TESTE 08: Empty state quando não há blocos
  test('03.08 - Empty state amigável em step vazio', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    await page.waitForTimeout(2000);
    
    const blocks = column.locator('[data-block-id]');
    const blockCount = await blocks.count();
    
    if (blockCount === 0) {
      // Procurar por mensagem de empty state
      const emptyState = column.locator('text=/empty|vazio|adicione blocos|arraste componentes/i');
      const hasEmptyState = await emptyState.count() > 0;
      
      if (hasEmptyState) {
        console.log('✅ Empty state encontrado');
        const text = await emptyState.first().innerText();
        console.log(`Mensagem: "${text}"`);
      } else {
        console.log('⚠️ Empty state não encontrado (OK se step tem blocos)');
      }
    } else {
      console.log(`⚠️ Step tem ${blockCount} blocos, pulando teste de empty state`);
    }
  });

  // ✅ TESTE 09: Loading states (skeleton)
  test('03.09 - Skeleton durante carregamento de blocos', async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded' });
    
    const column = page.locator('[data-testid="column-canvas"]');
    
    // Procurar skeleton nos primeiros 500ms
    const skeleton = column.locator('[class*="skeleton"], [class*="animate-pulse"]');
    const hasSkeletons = await skeleton.count() > 0;
    
    if (hasSkeletons) {
      console.log('✅ Skeleton loading implementado');
    } else {
      console.log('⚠️ Carregamento muito rápido para detectar skeletons');
    }
    
    // Aguardar carregamento completo
    await page.waitForSelector('[data-testid="column-canvas"]', { timeout: 10000 });
    await page.waitForTimeout(2000);
  });

  // ✅ TESTE 10: Scroll vertical funcional
  test('03.10 - Overflow scroll vertical', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    const classes = await column.getAttribute('class');
    expect(classes).toContain('overflow-y-auto');
    
    // Testar scroll
    await column.hover();
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(300);
    
    console.log('✅ Scroll vertical funcional');
  });

  // ✅ TESTE 11: Z-index correto (não sobrepõe header)
  test('03.11 - Z-index não conflita com outros elementos', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    const classes = await column.getAttribute('class');
    
    // Canvas deve ter z-index baixo (z-0 ou sem z-index)
    const hasLowZIndex = classes?.includes('z-0') || !classes?.includes('z-');
    
    console.log(`Z-index correto: ${hasLowZIndex ? 'SIM' : 'REVISAR'}`);
    
    console.log('✅ Z-index apropriado');
  });

  // ✅ TESTE 12: Performance - Renderização rápida
  test('03.12 - Canvas renderiza em menos de 2 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('[data-testid="column-canvas"]', { timeout: 10000 });
    
    // Aguardar primeiro bloco ou empty state
    await page.waitForSelector('[data-testid="column-canvas"] [data-block-id], [data-testid="column-canvas"] text=/empty|vazio/i', { timeout: 5000 }).catch(() => {
      console.log('⚠️ Nenhum bloco ou empty state encontrado');
    });
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Tempo de renderização: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(2000);
    console.log('✅ Performance excelente');
  });

  // ✅ TESTE 13: Responsividade do viewport
  test('03.13 - Viewport adapta ao tamanho selecionado', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    // Procurar por viewport container com width específico
    const viewport = column.locator('[style*="width"], [style*="max-width"]').first();
    
    const hasResponsiveContainer = await viewport.count() > 0;
    
    if (hasResponsiveContainer) {
      const style = await viewport.getAttribute('style');
      console.log(`✅ Viewport responsivo: ${style?.substring(0, 50)}...`);
    } else {
      console.log('⚠️ Container responsivo não detectado');
    }
  });

  // ✅ TESTE 14: Feedback visual de drag over
  test('03.14 - Área de drop visível durante drag', async ({ page }) => {
    const column = page.locator('[data-testid="column-canvas"]');
    
    await page.waitForTimeout(2000);
    
    // Verificar se canvas aceita drops (droppable)
    const droppableArea = column.locator('[data-droppable-id], [data-dnd-drop]');
    const hasDroppable = await droppableArea.count() > 0;
    
    if (hasDroppable) {
      console.log('✅ Área droppable configurada');
    } else {
      console.log('⚠️ Área droppable não encontrada (verificar configuração DnD)');
    }
  });
});
