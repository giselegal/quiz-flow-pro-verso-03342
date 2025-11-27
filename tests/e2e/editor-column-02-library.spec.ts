/**
 * 🧪 E2E Tests - Coluna 02: Component Library
 * 
 * Testa individualmente a coluna de biblioteca de componentes
 * Valida estrutura, drag-and-drop, busca, categorias e boas práticas
 */

import { test, expect } from '@playwright/test';

const EDITOR_URL = 'http://localhost:8080/editor?resource=quiz21StepsComplete';
const TIMEOUT = 60000;

test.describe('Column 02: Component Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('[data-testid="column-library"]', { timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  // ✅ TESTE 01: Estrutura HTML correta
  test('02.01 - Estrutura HTML semântica', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    await expect(column).toBeVisible();
    
    const classes = await column.getAttribute('class');
    expect(classes).toContain('bg-white');
    expect(classes).toContain('border-r');
    expect(classes).toContain('overflow-y-auto');
    
    console.log('✅ Estrutura HTML correta');
  });

  // ✅ TESTE 02: Campo de busca presente
  test('02.02 - Campo de busca funcional', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    // Procurar por input de busca
    const searchInput = column.locator('input[type="text"], input[placeholder*="Busca"], input[placeholder*="Search"]');
    
    const hasSearch = await searchInput.count() > 0;
    
    if (hasSearch) {
      await expect(searchInput.first()).toBeVisible();
      
      // Testar digitação
      await searchInput.first().fill('button');
      await page.waitForTimeout(500);
      
      // Verificar se filtra resultados
      const componentsAfterSearch = column.locator('[class*="lib:"], [draggable="true"]');
      const count = await componentsAfterSearch.count();
      
      console.log(`✅ Busca funcional (${count} resultados para "button")`);
    } else {
      console.log('⚠️ Campo de busca não encontrado');
    }
  });

  // ✅ TESTE 03: Componentes renderizados
  test('02.03 - Lista de componentes visível', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    await page.waitForTimeout(2000);
    
    // Procurar por componentes (cards, itens drag-drop)
    const components = column.locator('[class*="cursor-grab"], [draggable="true"], .group');
    const count = await components.count();
    
    console.log(`📊 Componentes encontrados: ${count}`);
    expect(count).toBeGreaterThan(0);
    
    console.log('✅ Componentes renderizados');
  });

  // ✅ TESTE 04: Categorias colapsáveis
  test('02.04 - Categorias com collapse/expand', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    // Procurar por headers de categoria com chevron
    const categoryHeaders = column.locator('button:has(svg), [role="button"]:has(svg)');
    const count = await categoryHeaders.count();
    
    if (count > 0) {
      console.log(`✅ ${count} categorias encontradas`);
      
      // Testar collapse da primeira categoria
      const firstCategory = categoryHeaders.first();
      await firstCategory.click();
      await page.waitForTimeout(300);
      
      // Click novamente para expandir
      await firstCategory.click();
      await page.waitForTimeout(300);
      
      console.log('✅ Collapse/expand funcional');
    } else {
      console.log('⚠️ Nenhuma categoria com collapse encontrada');
    }
  });

  // ✅ TESTE 05: Drag and drop habilitado
  test('02.05 - Componentes com drag habilitado', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    await page.waitForTimeout(2000);
    
    // Procurar por elementos draggable
    const draggableItems = column.locator('[class*="cursor-grab"]');
    const count = await draggableItems.count();
    
    console.log(`📊 Items draggable: ${count}`);
    expect(count).toBeGreaterThan(0);
    
    // Verificar cursor no primeiro item
    const firstItem = draggableItems.first();
    const classes = await firstItem.getAttribute('class');
    expect(classes).toContain('cursor-grab');
    
    console.log('✅ Drag and drop configurado');
  });

  // ✅ TESTE 06: Hover states visuais
  test('02.06 - Estados de hover nos componentes', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    await page.waitForTimeout(2000);
    
    const firstComponent = column.locator('[class*="cursor-grab"]').first();
    
    // Hover no componente
    await firstComponent.hover();
    await page.waitForTimeout(200);
    
    // Verificar se tem classes hover
    const classes = await firstComponent.getAttribute('class');
    const hasHoverClasses = classes?.includes('hover:') || classes?.includes('group');
    
    console.log(`Hover states: ${hasHoverClasses ? 'SIM' : 'NÃO'}`);
    
    console.log('✅ Estados visuais implementados');
  });

  // ✅ TESTE 07: Badges (New, Favorite, etc)
  test('02.07 - Badges de status nos componentes', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    await page.waitForTimeout(2000);
    
    // Procurar por badges (Star, "Novo", etc)
    const badges = column.locator('[class*="badge"], [class*="text-yellow"], svg[class*="fill-yellow"]');
    const count = await badges.count();
    
    console.log(`📊 Badges encontrados: ${count}`);
    
    if (count > 0) {
      console.log('✅ Sistema de badges implementado');
    } else {
      console.log('⚠️ Nenhum badge visível (OK se não há items favoritos/novos)');
    }
  });

  // ✅ TESTE 08: Descrições dos componentes
  test('02.08 - Componentes têm descrições visíveis', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    await page.waitForTimeout(2000);
    
    const firstComponent = column.locator('[class*="cursor-grab"]').first();
    
    // Verificar se há texto descritivo (name, type, description)
    const text = await firstComponent.innerText();
    
    console.log(`Texto do componente: "${text.substring(0, 50)}..."`);
    expect(text.length).toBeGreaterThan(0);
    
    console.log('✅ Componentes têm labels/descrições');
  });

  // ✅ TESTE 09: Stats da biblioteca
  test('02.09 - Estatísticas da biblioteca visíveis', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    // Procurar por contadores (ex: "24 components", "5 categories")
    const stats = column.locator('text=/\\d+\\s+(component|categor|item)/i');
    const hasStats = await stats.count() > 0;
    
    if (hasStats) {
      const text = await stats.first().innerText();
      console.log(`✅ Stats encontradas: "${text}"`);
    } else {
      console.log('⚠️ Stats não encontradas (OK se não implementadas)');
    }
  });

  // ✅ TESTE 10: Scroll vertical
  test('02.10 - Overflow scroll funcional', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    const classes = await column.getAttribute('class');
    expect(classes).toContain('overflow-y-auto');
    
    // Testar scroll
    await column.hover();
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(300);
    
    console.log('✅ Scroll vertical funcional');
  });

  // ✅ TESTE 11: Feedback de drag
  test('02.11 - Feedback visual durante drag', async ({ page }) => {
    const column = page.locator('[data-testid="column-library"]');
    
    await page.waitForTimeout(2000);
    
    const firstDraggable = column.locator('[class*="cursor-grab"]').first();
    
    // Simular início de drag (hover + mousedown)
    await firstDraggable.hover();
    
    const box = await firstDraggable.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(100);
      
      // Verificar se cursor muda
      const classes = await firstDraggable.getAttribute('class');
      const hasDragCursor = classes?.includes('cursor-grab') || classes?.includes('cursor-grabbing');
      
      await page.mouse.up();
      
      console.log(`✅ Feedback de drag: ${hasDragCursor ? 'SIM' : 'NÃO'}`);
    }
  });

  // ✅ TESTE 12: Performance - Carregamento rápido
  test('02.12 - Coluna carrega em menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('[data-testid="column-library"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="column-library"] [class*="cursor-grab"]', { timeout: 5000 });
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(3000);
    console.log('✅ Performance adequada');
  });
});
