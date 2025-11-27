import { test, expect } from '@playwright/test';

/**
 * Suite RÁPIDA de testes E2E para validação do layout do Editor
 * 
 * ✅ Focada em validações essenciais
 * ✅ Sem screenshots excessivos
 * ✅ Timeouts otimizados
 */

test.setTimeout(60_000); // 60s por teste

test.describe('Editor Layout - Validação Rápida', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('editor:phase2:modular', '1');
        localStorage.setItem('qm-editor:use-simple-properties', 'true');
      } catch {}
    });

    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 20000 
    });

    const layout = page.locator('[data-editor="modular-enhanced"], .qm-editor').first();
    await expect(layout).toBeVisible({ timeout: 15000 });
  });

  test('✅ 01 - Estrutura básica: 4 colunas visíveis', async ({ page }) => {
    console.log('🧪 Validando estrutura básica das 4 colunas');

    // Valida presença das 4 colunas
    await expect(page.getByTestId('column-steps')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('column-library')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('column-canvas')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('column-properties')).toBeVisible({ timeout: 10000 });

    console.log('✅ 4 colunas validadas');
  });

  test('✅ 02 - Header: botões principais', async ({ page }) => {
    console.log('🧪 Validando header e botões');

    const header = page.getByTestId('editor-header');
    await expect(header).toBeVisible();
    await expect(header).toHaveAttribute('role', 'toolbar');

    // Botões principais
    await expect(page.getByRole('button', { name: /Salvar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Publicar/i })).toBeVisible();

    console.log('✅ Header validado');
  });

  test('✅ 03 - Toggle de modos funcionando', async ({ page }) => {
    console.log('🧪 Validando toggle de modos');

    const liveButton = page.locator('button[aria-label="Edição ao vivo"]');
    const productionButton = page.locator('button[aria-label="Visualizar publicado"]');
    
    await expect(liveButton).toBeVisible();
    await expect(productionButton).toBeVisible();

    // Testa alternância
    await productionButton.click();
    await page.waitForTimeout(500);

    await liveButton.click();
    await page.waitForTimeout(500);

    console.log('✅ Toggle funcional');
  });

  test('✅ 04 - Canvas SEM pointer-events-none (BUG FIX)', async ({ page }) => {
    console.log('🧪 VALIDAÇÃO CRÍTICA: pointer-events-none');

    // Aguarda loading terminar
    await page.waitForTimeout(4000);

    const canvas = page.getByTestId('column-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Validação CRÍTICA
    const canvasClasses = await canvas.getAttribute('class');
    expect(canvasClasses).not.toContain('pointer-events-none');

    // Valida filhos também
    const canvasChildren = canvas.locator('> *');
    const childCount = await canvasChildren.count();

    console.log(`Canvas: ${childCount} elementos filhos`);

    if (childCount > 0) {
      const firstChildClasses = await canvasChildren.first().getAttribute('class');
      const hasPointerEventsNone = firstChildClasses?.includes('pointer-events-none') || false;
      
      if (hasPointerEventsNone) {
        console.error('❌ BUG DETECTADO: pointer-events-none presente!');
      }
      
      expect(hasPointerEventsNone).toBe(false);
    }

    console.log('✅ Canvas clicável (sem pointer-events-none)');
  });

  test('✅ 05 - Alinhamento de colunas', async ({ page }) => {
    console.log('🧪 Validando alinhamento horizontal');

    const stepsBox = await page.getByTestId('column-steps').boundingBox();
    const libraryBox = await page.getByTestId('column-library').boundingBox();
    const canvasBox = await page.getByTestId('column-canvas').boundingBox();
    const propertiesBox = await page.getByTestId('column-properties').boundingBox();

    expect(stepsBox).toBeTruthy();
    expect(libraryBox).toBeTruthy();
    expect(canvasBox).toBeTruthy();
    expect(propertiesBox).toBeTruthy();

    // Valida ordenação horizontal
    if (stepsBox && libraryBox && canvasBox && propertiesBox) {
      expect(stepsBox.x).toBeLessThan(libraryBox.x);
      expect(libraryBox.x).toBeLessThan(canvasBox.x);
      expect(canvasBox.x).toBeLessThan(propertiesBox.x);
    }

    console.log('✅ Alinhamento correto');
  });

  test('✅ 06 - Acessibilidade ARIA', async ({ page }) => {
    console.log('🧪 Validando ARIA labels');

    // Header
    const header = page.getByTestId('editor-header');
    await expect(header).toHaveAttribute('role', 'toolbar');
    await expect(header).toHaveAttribute('aria-label', 'Editor toolbar');

    // Toggle group
    const toggleGroup = page.locator('[aria-label="Modo do canvas"]');
    await expect(toggleGroup).toBeVisible();

    // Botões de modo
    const liveButton = page.locator('button[aria-label="Edição ao vivo"]');
    const productionButton = page.locator('button[aria-label="Visualizar publicado"]');
    await expect(liveButton).toBeVisible();
    await expect(productionButton).toBeVisible();

    console.log('✅ ARIA labels presentes');
  });

  test('✅ 07 - CSS Flexbox estrutura', async ({ page }) => {
    console.log('🧪 Validando estrutura CSS');

    // Root editor
    const editorRoot = page.locator('.qm-editor');
    const editorClasses = await editorRoot.getAttribute('class');
    
    expect(editorClasses).toContain('flex');
    expect(editorClasses).toContain('flex-col');
    expect(editorClasses).toContain('h-screen');

    // Header
    const header = page.getByTestId('editor-header');
    const headerClasses = await header.getAttribute('class');
    
    expect(headerClasses).toContain('flex');
    expect(headerClasses).toContain('items-center');

    console.log('✅ CSS correto');
  });

  test('✅ 08 - Resizable handles presentes', async ({ page }) => {
    console.log('🧪 Validando handles redimensionáveis');

    const handles = page.locator('.w-1.bg-gray-200.hover\\:bg-blue-400');
    const handleCount = await handles.count();
    
    console.log(`Handles encontrados: ${handleCount}`);
    expect(handleCount).toBeGreaterThan(0);

    console.log('✅ Handles presentes');
  });

  test('✅ 09 - Performance: carregamento < 15s', async ({ page }) => {
    console.log('🧪 Validando performance');

    const startTime = Date.now();
    
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 20000 
    });

    const layout = page.locator('[data-editor="modular-enhanced"]');
    await expect(layout).toBeVisible({ timeout: 15000 });

    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Tempo: ${loadTime}ms`);

    expect(loadTime).toBeLessThan(15000);

    console.log('✅ Performance OK');
  });

  test('✅ 10 - Fallback UI para erro', async ({ page }) => {
    console.log('🧪 Validando fallback UI');

    await page.goto('/editor?resource=NONEXISTENT', { 
      waitUntil: 'domcontentloaded',
      timeout: 20000 
    });

    await page.waitForTimeout(2000);

    // Deve mostrar modo livre OU mensagem de erro
    const freeMode = page.locator('span:has-text("Modo Construção Livre")');
    const errorMsg = page.locator('text=/erro|error/i');

    const hasFreeMode = await freeMode.isVisible().catch(() => false);
    const hasError = await errorMsg.isVisible().catch(() => false);

    expect(hasFreeMode || hasError).toBe(true);

    console.log('✅ Fallback funcional');
  });
});
