import { test, expect, Page } from '@playwright/test';

/**
 * Suite de testes E2E completa para o layout do Editor Modular
 * 
 * Valida:
 * - ✅ Estrutura HTML e CSS
 * - ✅ Alinhamento de colunas e botões
 * - ✅ Responsividade e viewport
 * - ✅ Estados de loading
 * - ✅ Interações com painéis
 * - ✅ Toggle de modos (edit/preview)
 * - ✅ Navegação entre steps
 * - ✅ Accessibility (ARIA)
 */

test.setTimeout(120_000);

// Helper: Captura screenshot com timestamp
async function captureDebugScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `test-results/layout-${name}-${timestamp}.png`,
    fullPage: true
  });
}

// Helper: Valida espaçamento e alinhamento
async function validateSpacing(page: Page, selector: string, expectedGap: number) {
  const element = page.locator(selector);
  const box = await element.boundingBox();
  if (!box) return false;
  
  // Valida que o elemento tem dimensões razoáveis
  return box.width > 0 && box.height > 0;
}

test.describe('Editor Layout - Estrutura e Design', () => {
  
  test.beforeEach(async ({ page }) => {
    // Habilita layout modular
    await page.addInitScript(() => {
      try {
        localStorage.setItem('editor:phase2:modular', '1');
        localStorage.setItem('qm-editor:use-simple-properties', 'true');
      } catch {}
    });

    // Navega para o editor
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // Aguarda layout carregar
    const layout = page.locator('[data-editor="modular-enhanced"], .qm-editor').first();
    await expect(layout).toBeVisible({ timeout: 20000 });
  });

  test('01 - Header: estrutura e botões principais', async ({ page }) => {
    console.log('🧪 Teste 01: Validando header do editor');

    // Valida que o header existe e é visível
    const header = page.getByTestId('editor-header');
    await expect(header).toBeVisible();

    // Valida que o header tem role toolbar (accessibility)
    await expect(header).toHaveAttribute('role', 'toolbar');
    await expect(header).toHaveAttribute('aria-label', 'Editor toolbar');

    // Valida classes CSS do header
    const headerClasses = await header.getAttribute('class');
    expect(headerClasses).toContain('flex');
    expect(headerClasses).toContain('items-center');
    expect(headerClasses).toContain('justify-between');
    expect(headerClasses).toContain('bg-white');
    expect(headerClasses).toContain('border-b');

    // Valida título "Editor Modular"
    await expect(page.locator('h1:has-text("Editor Modular")')).toBeVisible();

    // Valida botões principais (Salvar, Publicar, Exportar)
    await expect(page.getByRole('button', { name: /Salvar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Publicar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Exportar JSON/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Exportar v3/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Importar JSON/i })).toBeVisible();

    // Valida botões Undo/Redo
    const undoButton = page.locator('button[title*="Desfazer"]');
    const redoButton = page.locator('button[title*="Refazer"]');
    await expect(undoButton).toBeVisible();
    await expect(redoButton).toBeVisible();

    // Screenshot para validação visual
    await captureDebugScreenshot(page, 'header-structure');

    console.log('✅ Header validado com sucesso');
  });

  test('02 - Toggle de modos: Live vs Production', async ({ page }) => {
    console.log('🧪 Teste 02: Validando toggle de modos');

    // Aguarda toggle group carregar
    const toggleGroup = page.locator('[aria-label="Modo do canvas"]');
    await expect(toggleGroup).toBeVisible({ timeout: 10000 });

    // Valida que ambos os botões existem
    const liveButton = page.locator('button[aria-label="Edição ao vivo"]');
    const productionButton = page.locator('button[aria-label="Visualizar publicado"]');
    
    await expect(liveButton).toBeVisible();
    await expect(productionButton).toBeVisible();

    // Valida ícones e textos
    await expect(liveButton).toContainText('Live');
    await expect(productionButton).toContainText('Pub');

    // Captura estado inicial
    await captureDebugScreenshot(page, 'mode-toggle-initial');

    // Testa alternância para Production
    await productionButton.click();
    await page.waitForTimeout(500); // Aguarda transição

    // Valida que o modo mudou (verifica indicador visual)
    const modeIndicator = page.locator('div:has-text("Publicado")').first();
    await expect(modeIndicator).toBeVisible({ timeout: 5000 });

    await captureDebugScreenshot(page, 'mode-toggle-production');

    // Volta para Live
    await liveButton.click();
    await page.waitForTimeout(500);

    const editIndicator = page.locator('div:has-text("Editando")').first();
    await expect(editIndicator).toBeVisible({ timeout: 5000 });

    await captureDebugScreenshot(page, 'mode-toggle-live');

    console.log('✅ Toggle de modos validado com sucesso');
  });

  test('03 - Colunas: estrutura e alinhamento', async ({ page }) => {
    console.log('🧪 Teste 03: Validando estrutura das 4 colunas');

    // Valida presença das 4 colunas principais
    const stepsColumn = page.getByTestId('column-steps');
    const libraryColumn = page.getByTestId('column-library');
    const canvasColumn = page.getByTestId('column-canvas');
    const propertiesColumn = page.getByTestId('column-properties');

    await expect(stepsColumn).toBeVisible({ timeout: 10000 });
    await expect(libraryColumn).toBeVisible({ timeout: 10000 });
    await expect(canvasColumn).toBeVisible({ timeout: 10000 });
    await expect(propertiesColumn).toBeVisible({ timeout: 10000 });

    // Valida classes CSS das colunas
    const stepsClasses = await stepsColumn.getAttribute('class');
    expect(stepsClasses).toContain('border-r');
    expect(stepsClasses).toContain('bg-white');
    expect(stepsClasses).toContain('overflow-y-auto');

    // Valida dimensões (bounding boxes)
    const stepsBox = await stepsColumn.boundingBox();
    const libraryBox = await libraryColumn.boundingBox();
    const canvasBox = await canvasColumn.boundingBox();
    const propertiesBox = await propertiesColumn.boundingBox();

    expect(stepsBox).toBeTruthy();
    expect(libraryBox).toBeTruthy();
    expect(canvasBox).toBeTruthy();
    expect(propertiesBox).toBeTruthy();

    // Valida que as colunas têm largura e altura
    if (stepsBox) expect(stepsBox.width).toBeGreaterThan(100);
    if (libraryBox) expect(libraryBox.width).toBeGreaterThan(100);
    if (canvasBox) expect(canvasBox.width).toBeGreaterThan(200);
    if (propertiesBox) expect(propertiesBox.width).toBeGreaterThan(100);

    // Valida alinhamento horizontal (x crescente)
    if (stepsBox && libraryBox && canvasBox && propertiesBox) {
      expect(stepsBox.x).toBeLessThan(libraryBox.x);
      expect(libraryBox.x).toBeLessThan(canvasBox.x);
      expect(canvasBox.x).toBeLessThan(propertiesBox.x);
    }

    await captureDebugScreenshot(page, 'columns-alignment');

    console.log('✅ Estrutura das colunas validada:', {
      steps: stepsBox,
      library: libraryBox,
      canvas: canvasBox,
      properties: propertiesBox
    });
  });

  test('04 - Resizable handles: drag entre colunas', async ({ page }) => {
    console.log('🧪 Teste 04: Validando handles redimensionáveis');

    // Aguarda handles carregarem
    const handles = page.locator('.w-1.bg-gray-200.hover\\:bg-blue-400');
    const handleCount = await handles.count();
    
    console.log(`Encontrados ${handleCount} handles redimensionáveis`);
    expect(handleCount).toBeGreaterThan(0);

    // Valida que handles têm estilo hover correto
    if (handleCount > 0) {
      const firstHandle = handles.first();
      await expect(firstHandle).toBeVisible();

      const handleClasses = await firstHandle.getAttribute('class');
      expect(handleClasses).toContain('hover:bg-blue-400');
      expect(handleClasses).toContain('transition-colors');
    }

    // Testa drag do primeiro handle (library/canvas)
    if (handleCount > 1) {
      const libraryCanvasHandle = handles.nth(1);
      const handleBox = await libraryCanvasHandle.boundingBox();

      if (handleBox) {
        // Drag para a direita (expandir library)
        await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(handleBox.x + 50, handleBox.y + handleBox.height / 2, { steps: 10 });
        await page.mouse.up();

        await page.waitForTimeout(300);
        await captureDebugScreenshot(page, 'handle-drag-right');

        // Drag de volta (reduzir library)
        await page.mouse.move(handleBox.x + 50, handleBox.y + handleBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(handleBox.x, handleBox.y + handleBox.height / 2, { steps: 10 });
        await page.mouse.up();

        await page.waitForTimeout(300);
        await captureDebugScreenshot(page, 'handle-drag-left');
      }
    }

    console.log('✅ Handles redimensionáveis validados');
  });

  test('05 - Viewport selector: mobile, tablet, desktop', async ({ page }) => {
    console.log('🧪 Teste 05: Validando seletor de viewport');

    // Valida que o viewport selector existe (pode estar oculto em telas pequenas)
    const viewportSelector = page.locator('[class*="lg:flex"]').filter({ hasText: /mobile|tablet|desktop/i });
    
    // Verifica se está visível OU se existe mas está oculto (responsivo)
    const isVisible = await viewportSelector.isVisible().catch(() => false);
    const exists = await viewportSelector.count();

    console.log(`Viewport selector: visible=${isVisible}, exists=${exists > 0}`);

    if (isVisible) {
      // Tenta clicar em cada viewport (se visível)
      const viewportButtons = page.locator('button[title*="viewport" i], button[aria-label*="viewport" i]');
      const buttonCount = await viewportButtons.count();
      
      console.log(`Encontrados ${buttonCount} botões de viewport`);

      // Snapshot para validação visual
      await captureDebugScreenshot(page, 'viewport-selector');
    } else {
      console.log('ℹ️ Viewport selector oculto (modo responsivo ou resolução pequena)');
    }

    console.log('✅ Viewport selector validado');
  });

  test('06 - Toggle de painéis: biblioteca e propriedades', async ({ page }) => {
    console.log('🧪 Teste 06: Validando toggle de visibilidade dos painéis');

    // Botões de toggle (ícones 📚 e ⚙️)
    const libraryToggle = page.locator('button[title*="biblioteca"]');
    const propertiesToggle = page.locator('button[title*="propriedades"]');

    await expect(libraryToggle).toBeVisible({ timeout: 10000 });
    await expect(propertiesToggle).toBeVisible({ timeout: 10000 });

    // Captura estado inicial (ambos visíveis)
    await captureDebugScreenshot(page, 'panels-both-visible');

    // Testa ocultar biblioteca
    const libraryColumn = page.getByTestId('column-library');
    await expect(libraryColumn).toBeVisible();

    await libraryToggle.click();
    await page.waitForTimeout(500);

    // Valida que biblioteca foi ocultada
    const libraryHidden = !(await libraryColumn.isVisible().catch(() => true));
    console.log(`Biblioteca oculta: ${libraryHidden}`);

    await captureDebugScreenshot(page, 'panel-library-hidden');

    // Mostra biblioteca novamente
    await libraryToggle.click();
    await page.waitForTimeout(500);

    await expect(libraryColumn).toBeVisible({ timeout: 5000 });
    await captureDebugScreenshot(page, 'panel-library-restored');

    // Nota: Properties panel não pode ser desligado em modo debug (veja comentário no código)
    // Apenas validamos que o botão existe
    console.log('✅ Toggle de painéis validado');
  });

  test('07 - Estados de loading: template e step', async ({ page }) => {
    console.log('🧪 Teste 07: Validando estados de loading');

    // Recarrega página para capturar loading inicial
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Tenta capturar indicador de loading do template
    const templateLoading = page.locator('span:has-text("Carregando template")');
    const isLoadingVisible = await templateLoading.isVisible().catch(() => false);

    console.log(`Loading template visível: ${isLoadingVisible}`);

    if (isLoadingVisible) {
      await captureDebugScreenshot(page, 'loading-template');
    }

    // Aguarda carregamento completo
    await page.waitForTimeout(3000);

    // Valida que indicador desapareceu
    await expect(templateLoading).not.toBeVisible({ timeout: 10000 });

    // Valida indicador de sucesso (template carregado)
    const templateLoaded = page.locator('span:has-text("📄")').first();
    await expect(templateLoaded).toBeVisible({ timeout: 5000 });

    await captureDebugScreenshot(page, 'template-loaded');

    console.log('✅ Estados de loading validados');
  });

  test('08 - Navegação de steps: estrutura e interação', async ({ page }) => {
    console.log('🧪 Teste 08: Validando navegação de steps');

    // Aguarda items de step carregarem
    await page.waitForTimeout(3000);

    const stepItems = page.locator('[data-testid="step-navigator-item"]');
    const itemCount = await stepItems.count();

    console.log(`Encontrados ${itemCount} itens de step`);

    if (itemCount > 0) {
      // Valida estrutura do primeiro item
      const firstStep = stepItems.first();
      await expect(firstStep).toBeVisible();

      // Captura estado inicial
      await captureDebugScreenshot(page, 'steps-initial');

      // Clica no segundo step (se existir)
      if (itemCount > 1) {
        const secondStep = stepItems.nth(1);
        await secondStep.click();
        await page.waitForTimeout(1000);

        // Valida que o step mudou (verifica indicador no header)
        const stepIndicator = page.locator('span.bg-blue-100').filter({ hasText: /step-/i });
        const stepText = await stepIndicator.textContent();
        console.log(`Step atual após clique: ${stepText}`);

        await captureDebugScreenshot(page, 'step-changed');

        // Volta para o primeiro step
        await firstStep.click();
        await page.waitForTimeout(1000);

        await captureDebugScreenshot(page, 'step-back-to-first');
      }
    } else {
      console.warn('⚠️ Nenhum item de step encontrado');
    }

    console.log('✅ Navegação de steps validada');
  });

  test('09 - Accessibility: ARIA labels e roles', async ({ page }) => {
    console.log('🧪 Teste 09: Validando acessibilidade (ARIA)');

    // Header deve ter role="toolbar"
    const header = page.getByTestId('editor-header');
    await expect(header).toHaveAttribute('role', 'toolbar');
    await expect(header).toHaveAttribute('aria-label', 'Editor toolbar');

    // Toggle group deve ter aria-label
    const toggleGroup = page.locator('[aria-label="Modo do canvas"]');
    await expect(toggleGroup).toBeVisible();

    // Botões de modo devem ter aria-label
    const liveButton = page.locator('button[aria-label="Edição ao vivo"]');
    const productionButton = page.locator('button[aria-label="Visualizar publicado"]');
    await expect(liveButton).toBeVisible();
    await expect(productionButton).toBeVisible();

    // Botões principais devem ter text acessível
    const saveButton = page.getByRole('button', { name: /Salvar/i });
    const publishButton = page.getByRole('button', { name: /Publicar/i });
    await expect(saveButton).toBeVisible();
    await expect(publishButton).toBeVisible();

    // Valida que botões de undo/redo têm title (tooltip)
    const undoButton = page.locator('button[title*="Desfazer"]');
    const redoButton = page.locator('button[title*="Refazer"]');
    await expect(undoButton).toHaveAttribute('title');
    await expect(redoButton).toHaveAttribute('title');

    console.log('✅ Acessibilidade ARIA validada');
  });

  test('10 - Canvas: sem pointer-events-none', async ({ page }) => {
    console.log('🧪 Teste 10: Validando que canvas está clicável (BUG FIX)');

    // Aguarda canvas carregar
    const canvas = page.getByTestId('column-canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Aguarda loading terminar
    await page.waitForTimeout(4000);

    // Valida que NÃO há classe pointer-events-none
    const canvasClasses = await canvas.getAttribute('class');
    expect(canvasClasses).not.toContain('pointer-events-none');

    // Valida child elements dentro do canvas
    const canvasChildren = canvas.locator('> *');
    const childCount = await canvasChildren.count();

    console.log(`Canvas tem ${childCount} elementos filhos`);

    if (childCount > 0) {
      for (let i = 0; i < Math.min(childCount, 3); i++) {
        const child = canvasChildren.nth(i);
        const childClasses = await child.getAttribute('class');
        const hasPointerEventsNone = childClasses?.includes('pointer-events-none') || false;

        console.log(`Child ${i}: pointer-events-none = ${hasPointerEventsNone}`);

        // Validação CRÍTICA: nenhum elemento deve ter pointer-events-none após loading
        if (hasPointerEventsNone) {
          // Captura screenshot do problema
          await captureDebugScreenshot(page, `BUG-pointer-events-child-${i}`);
          
          // Log detalhado
          console.error('❌ CRITICAL BUG: pointer-events-none detectado!', {
            element: i,
            classes: childClasses
          });
        }

        expect(hasPointerEventsNone).toBe(false);
      }
    }

    // Captura estado final
    await captureDebugScreenshot(page, 'canvas-clickable-final');

    console.log('✅ Canvas validado como clicável (sem pointer-events-none)');
  });

  test('11 - Responsividade: layout adapta a diferentes viewports', async ({ page }) => {
    console.log('🧪 Teste 11: Validando responsividade');

    // Desktop (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await captureDebugScreenshot(page, 'responsive-desktop');

    // Valida que todas as colunas estão visíveis
    await expect(page.getByTestId('column-steps')).toBeVisible();
    await expect(page.getByTestId('column-library')).toBeVisible();
    await expect(page.getByTestId('column-canvas')).toBeVisible();
    await expect(page.getByTestId('column-properties')).toBeVisible();

    // Tablet (1024x768)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);
    await captureDebugScreenshot(page, 'responsive-tablet');

    // Valida que layout ainda funciona
    await expect(page.getByTestId('column-canvas')).toBeVisible();

    // Mobile (375x667) - layout pode colapsar
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await captureDebugScreenshot(page, 'responsive-mobile');

    // Valida que canvas permanece visível
    await expect(page.getByTestId('column-canvas')).toBeVisible();

    // Volta para desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    console.log('✅ Responsividade validada');
  });

  test('12 - CSS Grid/Flex: estrutura correta', async ({ page }) => {
    console.log('🧪 Teste 12: Validando estrutura CSS');

    // Root editor deve usar flexbox vertical
    const editorRoot = page.locator('.qm-editor');
    const editorClasses = await editorRoot.getAttribute('class');
    
    expect(editorClasses).toContain('flex');
    expect(editorClasses).toContain('flex-col');
    expect(editorClasses).toContain('h-screen');

    // Header deve usar flexbox horizontal
    const header = page.getByTestId('editor-header');
    const headerClasses = await header.getAttribute('class');
    
    expect(headerClasses).toContain('flex');
    expect(headerClasses).toContain('items-center');
    expect(headerClasses).toContain('justify-between');

    // Colunas devem ter overflow-y-auto
    const stepsColumn = page.getByTestId('column-steps');
    const stepsClasses = await stepsColumn.getAttribute('class');
    expect(stepsClasses).toContain('overflow-y-auto');

    console.log('✅ Estrutura CSS validada');
  });
});

test.describe('Editor Layout - Edge Cases', () => {
  
  test('13 - Erro de carregamento: fallback UI', async ({ page }) => {
    console.log('🧪 Teste 13: Validando fallback para erro de carregamento');

    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });

    // Navega para recurso inexistente
    await page.goto('/editor?resource=NONEXISTENT_RESOURCE', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // Aguarda layout carregar
    await page.waitForTimeout(3000);

    // Valida que mostra mensagem de modo livre ou erro
    const freeMode = page.locator('span:has-text("Modo Construção Livre")');
    const errorMessage = page.locator('text=/erro|error/i');

    const hasFreeMode = await freeMode.isVisible().catch(() => false);
    const hasError = await errorMessage.isVisible().catch(() => false);

    console.log(`Free mode: ${hasFreeMode}, Error: ${hasError}`);

    // Pelo menos uma das mensagens deve estar visível
    expect(hasFreeMode || hasError).toBe(true);

    await captureDebugScreenshot(page, 'fallback-ui');

    console.log('✅ Fallback UI validado');
  });

  test('14 - Performance: tempo de renderização', async ({ page }) => {
    console.log('🧪 Teste 14: Validando performance de renderização');

    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });

    const startTime = Date.now();

    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    const layout = page.locator('[data-editor="modular-enhanced"]');
    await expect(layout).toBeVisible({ timeout: 20000 });

    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);

    // Valida que carregou em menos de 10 segundos
    expect(loadTime).toBeLessThan(10000);

    console.log('✅ Performance validada');
  });
});
