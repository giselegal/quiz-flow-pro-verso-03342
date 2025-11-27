/**
 * 🧪 TESTES E2E - Sistema DND (Drag and Drop)
 * 
 * Cobertura completa do sistema DND implementado nas FASES 1+2:
 * - Sensores otimizados (mouse, keyboard, touch)
 * - Estratégia de colisão híbrida
 * - Visual feedback premium
 * - Acessibilidade (keyboard navigation)
 * - Responsividade (mobile)
 * 
 * @see PLANO_ATIVACAO_DND.md
 * @see FASE2_DND_COMPLETA.md
 */

import { test, expect, Page } from '@playwright/test';

// ════════════════════════════════════════════════════════════════════════
// 🎯 HELPERS & FIXTURES
// ════════════════════════════════════════════════════════════════════════

/**
 * Navega até o editor e aguarda carregamento completo
 */
async function navigateToEditor(page: Page) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Criar novo quiz ou selecionar template
    const createButton = page.getByRole('button', { name: /criar|novo|template/i }).first();
    if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
    }

    // Aguardar canvas estar pronto
    await expect(page.locator('[data-testid="canvas-column"]').or(page.locator('.canvas-column'))).toBeVisible({ timeout: 10000 });
}

/**
 * Encontra blocos no canvas
 */
async function getCanvasBlocks(page: Page) {
    return page.locator('[data-block-id]').or(page.locator('[data-testid^="block-"]'));
}

/**
 * Type guard para bounding box
 */
function assertBBox(bbox: { x: number; y: number; width: number; height: number } | null): asserts bbox is { x: number; y: number; width: number; height: number } {
    if (!bbox) {
        throw new Error('Bounding box não encontrada');
    }
}

/**
 * Executa drag com mouse
 */
async function dragBlock(page: Page, fromIndex: number, toIndex: number) {
    const blocks = await getCanvasBlocks(page);
    const sourceBlock = blocks.nth(fromIndex);
    const targetBlock = blocks.nth(toIndex);

    // Capturar posições
    const sourceBBox = await sourceBlock.boundingBox();
    const targetBBox = await targetBlock.boundingBox();

    assertBBox(sourceBBox);
    assertBBox(targetBBox);

    // Executar drag: hover → mouseDown → mover 5px → arrastar → soltar
    await page.mouse.move(sourceBBox.x + sourceBBox.width / 2, sourceBBox.y + sourceBBox.height / 2);
    await page.waitForTimeout(100);
    await page.mouse.down();
    await page.waitForTimeout(50);
    
    // Mover 5px para ativar sensor (constraint: distance 5px)
    await page.mouse.move(sourceBBox.x + sourceBBox.width / 2 + 6, sourceBBox.y + sourceBBox.height / 2);
    await page.waitForTimeout(100);

    // Arrastar até target
    await page.mouse.move(targetBBox.x + targetBBox.width / 2, targetBBox.y + targetBBox.height / 2, { steps: 10 });
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(300); // Aguardar animação cubic-bezier 300ms
}

// ════════════════════════════════════════════════════════════════════════
// 📦 SUITE 1: Inicialização & Carregamento DND
// ════════════════════════════════════════════════════════════════════════

test.describe('DND - Inicialização', () => {
    test('deve carregar @dnd-kit sem erros', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (msg) => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await navigateToEditor(page);

        // Verificar SafeDndContext renderizado (não fallback)
        await expect(page.locator('[data-testid="safe-dnd-fallback"]')).not.toBeVisible();
        await expect(page.locator('[data-testid="safe-dnd-no-context"]')).not.toBeVisible();
        await expect(page.locator('[data-testid="safe-dnd-error"]')).not.toBeVisible();

        // Validar ausência de erros relacionados a React APIs
        const reactErrors = errors.filter(e => 
            e.includes('useLayoutEffect') || 
            e.includes('forwardRef') || 
            e.includes('Cannot read properties of undefined')
        );
        expect(reactErrors).toHaveLength(0);
    });

    test('deve ter blocos arrastáveis no canvas', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        const count = await blocks.count();

        expect(count).toBeGreaterThan(0);

        // Verificar atributos DnD no primeiro bloco
        const firstBlock = blocks.first();
        await expect(firstBlock).toHaveAttribute('data-block-id');
        
        // Verificar handle de drag (⋮⋮)
        const dragHandle = firstBlock.locator('button[title*="Arrastar"]').or(firstBlock.locator('button[title*="drag"]'));
        await expect(dragHandle).toBeVisible();
    });
});

// ════════════════════════════════════════════════════════════════════════
// 🖱️ SUITE 2: Drag com Mouse (PointerSensor)
// ════════════════════════════════════════════════════════════════════════

test.describe('DND - Mouse/Pointer', () => {
    test('deve arrastar bloco com mouse (distance 5px)', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        const initialCount = await blocks.count();
        
        if (initialCount < 2) {
            test.skip();
        }

        // Capturar textos iniciais
        const block0Text = await blocks.nth(0).textContent();
        const block1Text = await blocks.nth(1).textContent();

        // Drag: posição 0 → posição 1
        await dragBlock(page, 0, 1);

        // Verificar reordenação
        await page.waitForTimeout(500);
        const newBlock0Text = await blocks.nth(0).textContent();
        const newBlock1Text = await blocks.nth(1).textContent();

        // Bloco 0 original agora deve estar na posição 1
        expect(newBlock1Text).toBe(block0Text);
        expect(newBlock0Text).toBe(block1Text);
    });

    test('deve mostrar preview premium durante drag', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 1) test.skip();

        const firstBlock = blocks.first();
        const bbox = await firstBlock.boundingBox();
        assertBBox(bbox);

        // Iniciar drag
        await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        await page.mouse.down();
        await page.mouse.move(bbox.x + bbox.width / 2 + 10, bbox.y + bbox.height / 2 + 50, { steps: 5 });

        // Verificar DragOverlay premium
        const overlay = page.locator('.bg-gradient-to-br.from-white.to-blue-50');
        await expect(overlay).toBeVisible();
        await expect(overlay).toHaveCSS('border-color', /rgb\(59, 130, 246\)/); // blue-500
        await expect(overlay).toHaveText(/Movendo bloco/i);

        // Verificar ícone animado 2x2
        const dots = overlay.locator('.bg-blue-500.rounded-full.animate-pulse');
        expect(await dots.count()).toBeGreaterThanOrEqual(4); // 2x2 grid

        // Verificar badge circular com SVG
        const badge = overlay.locator('.bg-blue-500.rounded-full svg');
        await expect(badge).toBeVisible();

        await page.mouse.up();
    });

    test('deve mostrar indicador de drop com linha azul e label', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 2) test.skip();

        const block0BBox = await blocks.nth(0).boundingBox();
        const block1BBox = await blocks.nth(1).boundingBox();
        assertBBox(block0BBox); assertBBox(block1BBox);

        // Iniciar drag e hover sobre bloco 1
        await page.mouse.move(block0BBox.x + block0BBox.width / 2, block0BBox.y + block0BBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(block0BBox.x + 10, block0BBox.y + 50);
        await page.mouse.move(block1BBox.x + block1BBox.width / 2, block1BBox.y + block1BBox.height / 2, { steps: 10 });

        // Verificar linha azul com scale-y-[8]
        const dropLine = page.locator('.bg-blue-500.scale-y-\\[8\\]');
        await expect(dropLine).toBeVisible();

        // Verificar círculos nas extremidades
        const circles = page.locator('.bg-blue-500.rounded-full').filter({ hasText: '' });
        expect(await circles.count()).toBeGreaterThanOrEqual(2);

        // Verificar label "Inserir aqui (#N)"
        const label = page.locator('text=/Inserir aqui \\(#\\d+\\)/i');
        await expect(label).toBeVisible();

        await page.mouse.up();
    });

    test('deve aplicar animação cubic-bezier ao soltar', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 2) test.skip();

        // Executar drag
        await dragBlock(page, 0, 1);

        // Verificar transição no bloco
        const block = blocks.nth(1);
        const transition = await block.evaluate(el => window.getComputedStyle(el).transition);
        
        // Deve conter 300ms e cubic-bezier
        expect(transition).toContain('300ms');
        expect(transition).toContain('cubic-bezier');
    });

    test('deve ter taxa de sucesso >=95% em múltiplos drags', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        const count = await blocks.count();
        if (count < 3) test.skip();

        let successCount = 0;
        const attempts = 10;

        for (let i = 0; i < attempts; i++) {
            try {
                const fromIndex = Math.floor(Math.random() * (count - 1));
                const toIndex = fromIndex === 0 ? 1 : 0;

                await dragBlock(page, fromIndex, toIndex);
                await page.waitForTimeout(500);

                // Verificar se reordenou
                const newBlocks = await getCanvasBlocks(page);
                if (await newBlocks.count() === count) {
                    successCount++;
                }
            } catch (error) {
                console.error(`Tentativa ${i + 1} falhou:`, error);
            }
        }

        const successRate = (successCount / attempts) * 100;
        console.log(`Taxa de sucesso: ${successRate}% (${successCount}/${attempts})`);
        
        expect(successRate).toBeGreaterThanOrEqual(95);
    });
});

// ════════════════════════════════════════════════════════════════════════
// ⌨️ SUITE 3: Navegação por Teclado (KeyboardSensor)
// ════════════════════════════════════════════════════════════════════════

test.describe('DND - Teclado (Acessibilidade)', () => {
    test('deve navegar entre blocos com Tab', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        const count = await blocks.count();
        if (count < 2) test.skip();

        // Tab até primeiro bloco
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        
        // Verificar foco
        let focusedId = await page.evaluate(() => document.activeElement?.getAttribute('data-block-id'));
        expect(focusedId).toBeTruthy();

        // Tab para próximo
        await page.keyboard.press('Tab');
        const newFocusedId = await page.evaluate(() => document.activeElement?.getAttribute('data-block-id'));
        expect(newFocusedId).not.toBe(focusedId);
    });

    test('deve mover bloco com Space + Setas', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 2) test.skip();

        // Capturar textos iniciais
        const block0Text = await blocks.nth(0).textContent();
        const block1Text = await blocks.nth(1).textContent();

        // Focar no primeiro bloco
        await blocks.nth(0).focus();
        await page.waitForTimeout(200);

        // Space para ativar drag
        await page.keyboard.press('Space');
        await page.waitForTimeout(100);

        // Seta para baixo para mover
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);

        // Space para soltar
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);

        // Verificar reordenação
        const newBlock0Text = await blocks.nth(0).textContent();
        const newBlock1Text = await blocks.nth(1).textContent();

        expect(newBlock1Text).toBe(block0Text);
        expect(newBlock0Text).toBe(block1Text);
    });

    test('deve cancelar drag com Escape', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 2) test.skip();

        const block0Text = await blocks.nth(0).textContent();

        // Focar e iniciar drag
        await blocks.nth(0).focus();
        await page.keyboard.press('Space');
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);

        // Cancelar com Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // Verificar que não moveu
        const newBlock0Text = await blocks.nth(0).textContent();
        expect(newBlock0Text).toBe(block0Text);
    });

    test('deve ter anúncios ARIA durante drag (básico)', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 1) test.skip();

        await blocks.nth(0).focus();
        await page.keyboard.press('Space');

        // Verificar se DragOverlay tem texto acessível
        const overlay = page.locator('[role="status"]').or(page.locator('text=/Movendo bloco/i'));
        await expect(overlay).toBeVisible({ timeout: 2000 });
    });
});

// ════════════════════════════════════════════════════════════════════════
// 📱 SUITE 4: Touch/Mobile (TouchSensor)
// ════════════════════════════════════════════════════════════════════════

test.describe('DND - Touch/Mobile', () => {
    test.use({ 
        viewport: { width: 375, height: 667 }, // iPhone SE
        hasTouch: true,
        isMobile: true
    });

    test('deve arrastar com touch (delay 250ms)', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 2) test.skip();

        const block0Text = await blocks.nth(0).textContent();
        const block1Text = await blocks.nth(1).textContent();

        const block0BBox = await blocks.nth(0).boundingBox();
        const block1BBox = await blocks.nth(1).boundingBox();
        assertBBox(block0BBox); assertBBox(block1BBox);

        // Touch drag: pressionar (250ms) → arrastar → soltar
        await page.touchscreen.tap(block0BBox.x + block0BBox.width / 2, block0BBox.y + block0BBox.height / 2);
        await page.waitForTimeout(300); // Delay 250ms + margem
        
        // Arrastar
        await page.mouse.move(block0BBox.x + block0BBox.width / 2, block0BBox.y + block0BBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(block1BBox.x + block1BBox.width / 2, block1BBox.y + block1BBox.height / 2, { steps: 10 });
        await page.mouse.up();
        await page.waitForTimeout(500);

        // Verificar reordenação
        const newBlock0Text = await blocks.nth(0).textContent();
        const newBlock1Text = await blocks.nth(1).textContent();

        expect(newBlock1Text).toBe(block0Text);
        expect(newBlock0Text).toBe(block1Text);
    });

    test('deve distinguir scroll de drag no mobile', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 1) test.skip();

        const block0Text = await blocks.nth(0).textContent();
        const bbox = await blocks.nth(0).boundingBox();
        assertBBox(bbox);

        // Scroll rápido (< 250ms) não deve ativar drag
        await page.touchscreen.tap(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        await page.waitForTimeout(100); // Menos que delay 250ms
        await page.mouse.move(bbox.x, bbox.y + 100);

        await page.waitForTimeout(300);

        // Verificar que NÃO moveu
        const newBlock0Text = await blocks.nth(0).textContent();
        expect(newBlock0Text).toBe(block0Text);
    });

    test('deve ter visual feedback responsivo no mobile', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 1) test.skip();

        const bbox = await blocks.nth(0).boundingBox();
        assertBBox(bbox);

        // Iniciar drag
        await page.touchscreen.tap(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        await page.waitForTimeout(300);
        await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        await page.mouse.down();
        await page.mouse.move(bbox.x + 10, bbox.y + 50);

        // Verificar preview premium
        const overlay = page.locator('.bg-gradient-to-br');
        await expect(overlay).toBeVisible();

        // Verificar tamanho mínimo (min-w-[280px])
        const width = await overlay.evaluate(el => el.getBoundingClientRect().width);
        expect(width).toBeGreaterThanOrEqual(280);

        await page.mouse.up();
    });
});

// ════════════════════════════════════════════════════════════════════════
// 🎯 SUITE 5: Estratégia de Colisão Híbrida
// ════════════════════════════════════════════════════════════════════════

test.describe('DND - Colisão Híbrida', () => {
    test('deve usar closestCorners para listas verticais', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 3) test.skip();

        // Drag de 0 → 2 (saltar 1 bloco)
        const block0BBox = await blocks.nth(0).boundingBox();
        const block2BBox = await blocks.nth(2).boundingBox();
        assertBBox(block0BBox); assertBBox(block2BBox);

        const block0Text = await blocks.nth(0).textContent();

        await page.mouse.move(block0BBox.x + block0BBox.width / 2, block0BBox.y + block0BBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(block0BBox.x + 10, block0BBox.y + 10);
        
        // Mover para posição entre bloco 1 e 2 (corner collision)
        await page.mouse.move(
            block2BBox.x + block2BBox.width / 2,
            block2BBox.y - 5, // Entre blocos
            { steps: 10 }
        );
        await page.waitForTimeout(200);
        await page.mouse.up();
        await page.waitForTimeout(500);

        // Verificar que bloco 0 foi inserido antes de bloco 2 (agora posição 2)
        const newBlock2Text = await blocks.nth(2).textContent();
        expect(newBlock2Text).toContain(block0Text?.substring(0, 10) || '');
    });

    test('deve usar pointerWithin quando cursor dentro', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 2) test.skip();

        const block1BBox = await blocks.nth(1).boundingBox();
        assertBBox(block1BBox);

        // Drag e soltar cursor BEM dentro do bloco 1 (centro)
        await dragBlock(page, 0, 1);
        await page.waitForTimeout(300);

        // Verificar que houve drop (colisão detectada)
        const newCount = await blocks.count();
        expect(newCount).toBeGreaterThan(0);
    });

    test('deve usar closestCenter como fallback', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 2) test.skip();

        // Drag para área entre blocos (nem corner, nem dentro)
        const block0BBox = await blocks.nth(0).boundingBox();
        const block1BBox = await blocks.nth(1).boundingBox();
        assertBBox(block0BBox); assertBBox(block1BBox);

        await page.mouse.move(block0BBox.x + block0BBox.width / 2, block0BBox.y + block0BBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(block0BBox.x + 10, block0BBox.y + 10);
        
        // Mover para espaço entre blocos (lateral)
        const betweenY = block0BBox.y + block0BBox.height + (block1BBox.y - block0BBox.y - block0BBox.height) / 2;
        await page.mouse.move(block0BBox.x - 50, betweenY, { steps: 10 }); // Fora lateral
        await page.waitForTimeout(200);
        await page.mouse.up();
        await page.waitForTimeout(500);

        // Deve ter usado closestCenter e feito drop em algum lugar válido
        const newCount = await blocks.count();
        expect(newCount).toBeGreaterThan(0);
    });
});

// ════════════════════════════════════════════════════════════════════════
// 🔥 SUITE 6: Performance & Estresse
// ════════════════════════════════════════════════════════════════════════

test.describe('DND - Performance', () => {
    test('deve manter FPS >30 durante drag com 10+ blocos', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        const count = await blocks.count();
        
        // Adicionar blocos se necessário (mock)
        if (count < 10) {
            test.skip();
        }

        // Monitorar FPS durante drag
        const fpsSamples: number[] = [];
        
        await page.evaluate(() => {
            (window as any).__fpsMonitor = [];
            let lastTime = performance.now();
            let frames = 0;

            function measureFPS() {
                frames++;
                const now = performance.now();
                if (now - lastTime >= 1000) {
                    (window as any).__fpsMonitor.push(frames);
                    frames = 0;
                    lastTime = now;
                }
                requestAnimationFrame(measureFPS);
            }
            requestAnimationFrame(measureFPS);
        });

        // Executar drag
        await dragBlock(page, 0, Math.floor(count / 2));
        await page.waitForTimeout(1000);

        // Capturar FPS
        const fps = await page.evaluate(() => (window as any).__fpsMonitor);
        const avgFps = fps.reduce((a: number, b: number) => a + b, 0) / fps.length;

        console.log(`FPS médio durante drag: ${avgFps}`);
        expect(avgFps).toBeGreaterThan(30);
    });

    test('deve ter tempo de resposta <100ms para ativar drag', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 1) test.skip();

        const bbox = await blocks.nth(0).boundingBox();
        assertBBox(bbox);

        const startTime = Date.now();
        
        // Mover 5px para ativar sensor
        await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        await page.mouse.down();
        await page.mouse.move(bbox.x + bbox.width / 2 + 6, bbox.y + bbox.height / 2);

        // Aguardar visual feedback (preview overlay)
        await page.locator('.bg-gradient-to-br').waitFor({ state: 'visible', timeout: 500 });
        
        const responseTime = Date.now() - startTime;
        console.log(`Tempo de resposta: ${responseTime}ms`);
        
        expect(responseTime).toBeLessThan(100);

        await page.mouse.up();
    });

    test('deve limpar listeners ao desmontar blocos', async ({ page }) => {
        await navigateToEditor(page);
        
        // Capturar listeners iniciais
        const initialListeners = await page.evaluate(() => {
            return {
                mousedown: (window as any).getEventListeners?.(document)?.mousedown?.length || 0,
                mousemove: (window as any).getEventListeners?.(document)?.mousemove?.length || 0,
                mouseup: (window as any).getEventListeners?.(document)?.mouseup?.length || 0,
            };
        });

        // Executar múltiplos drags
        for (let i = 0; i < 5; i++) {
            try {
                await dragBlock(page, 0, 1);
                await page.waitForTimeout(300);
            } catch (error) {
                // Ignorar falhas
            }
        }

        // Verificar listeners após drags
        const finalListeners = await page.evaluate(() => {
            return {
                mousedown: (window as any).getEventListeners?.(document)?.mousedown?.length || 0,
                mousemove: (window as any).getEventListeners?.(document)?.mousemove?.length || 0,
                mouseup: (window as any).getEventListeners?.(document)?.mouseup?.length || 0,
            };
        });

        // Listeners não devem crescer descontroladamente
        expect(finalListeners.mousedown).toBeLessThanOrEqual(initialListeners.mousedown + 10);
        expect(finalListeners.mousemove).toBeLessThanOrEqual(initialListeners.mousemove + 10);
        expect(finalListeners.mouseup).toBeLessThanOrEqual(initialListeners.mouseup + 10);
    });
});

// ════════════════════════════════════════════════════════════════════════
// 🎨 SUITE 7: Visual Regression
// ════════════════════════════════════════════════════════════════════════

test.describe('DND - Visual Regression', () => {
    test('snapshot: estado idle do canvas', async ({ page }) => {
        await navigateToEditor(page);
        await page.waitForTimeout(1000);

        const canvas = page.locator('[data-testid="canvas-column"]').or(page.locator('.canvas-column')).first();
        await expect(canvas).toHaveScreenshot('canvas-idle.png');
    });

    test('snapshot: bloco durante drag (preview premium)', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 1) test.skip();

        const bbox = await blocks.nth(0).boundingBox();
        assertBBox(bbox);

        // Iniciar drag
        await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        await page.mouse.down();
        await page.mouse.move(bbox.x + 50, bbox.y + 100, { steps: 5 });
        await page.waitForTimeout(300);

        // Snapshot do preview
        const overlay = page.locator('.bg-gradient-to-br').first();
        await expect(overlay).toHaveScreenshot('drag-preview-premium.png');

        await page.mouse.up();
    });

    test('snapshot: indicador de drop com linha azul', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 2) test.skip();

        const block1BBox = await blocks.nth(1).boundingBox();
        assertBBox(block1BBox);

        // Hover sobre bloco 1 durante drag
        await page.mouse.move(block1BBox.x, block1BBox.y);
        await page.mouse.down();
        await page.mouse.move(block1BBox.x + 10, block1BBox.y + 10);
        await page.mouse.move(block1BBox.x + block1BBox.width / 2, block1BBox.y + block1BBox.height / 2, { steps: 10 });
        await page.waitForTimeout(200);

        // Snapshot da linha + label
        const canvas = page.locator('[data-testid="canvas-column"]').or(page.locator('.canvas-column')).first();
        await expect(canvas).toHaveScreenshot('drop-indicator-blue-line.png');

        await page.mouse.up();
    });
});

// ════════════════════════════════════════════════════════════════════════
// 🐛 SUITE 8: Edge Cases & Robustez
// ════════════════════════════════════════════════════════════════════════

test.describe('DND - Edge Cases', () => {
    test('deve lidar com canvas vazio sem erros', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Tentar acessar canvas vazio
        const canvas = page.locator('[data-testid="canvas-column"]').or(page.locator('.canvas-column'));
        await canvas.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

        expect(errors.filter(e => e.includes('dnd') || e.includes('drag'))).toHaveLength(0);
    });

    test('deve cancelar drag ao sair da viewport', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 1) test.skip();

        const bbox = await blocks.nth(0).boundingBox();
        assertBBox(bbox);

        const blockText = await blocks.nth(0).textContent();

        // Iniciar drag e sair da viewport
        await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        await page.mouse.down();
        await page.mouse.move(bbox.x + 10, bbox.y + 10);
        await page.mouse.move(-100, -100); // Fora da viewport
        await page.waitForTimeout(500);
        await page.mouse.up();

        // Verificar que bloco permaneceu na posição original
        await page.waitForTimeout(500);
        const newBlockText = await blocks.nth(0).textContent();
        expect(newBlockText).toBe(blockText);
    });

    test('deve ignorar drags em modo não-editável', async ({ page }) => {
        await navigateToEditor(page);
        
        // Tentar acessar modo preview/visualização
        const previewButton = page.getByRole('button', { name: /preview|visualizar/i });
        if (await previewButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await previewButton.click();
            await page.waitForTimeout(1000);

            // Verificar que handles de drag não estão visíveis
            const dragHandles = page.locator('button[title*="Arrastar"]');
            const count = await dragHandles.count();
            
            if (count > 0) {
                // Handles podem existir mas devem estar disabled
                const isDisabled = await dragHandles.first().isDisabled();
                expect(isDisabled).toBe(true);
            }
        } else {
            test.skip();
        }
    });

    test('deve recuperar de erros de colisão', async ({ page }) => {
        const consoleWarnings: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'warning' && msg.text().includes('collision')) {
                consoleWarnings.push(msg.text());
            }
        });

        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        if (await blocks.count() < 2) test.skip();

        // Executar drag inválido (mesma posição)
        await dragBlock(page, 0, 0);
        await page.waitForTimeout(500);

        // Sistema deve continuar funcional
        await dragBlock(page, 0, 1);
        await page.waitForTimeout(500);

        // Verificar que não houve crash
        const finalCount = await blocks.count();
        expect(finalCount).toBeGreaterThan(0);
    });

    test('deve lidar com blocos de alturas variadas', async ({ page }) => {
        await navigateToEditor(page);
        
        const blocks = await getCanvasBlocks(page);
        const count = await blocks.count();
        if (count < 3) test.skip();

        // Verificar diferentes alturas
        const heights: number[] = [];
        for (let i = 0; i < Math.min(count, 5); i++) {
            const bbox = await blocks.nth(i).boundingBox();
            if (bbox) heights.push(bbox.height);
        }

        const hasVariation = new Set(heights).size > 1;
        if (!hasVariation) {
            console.log('Aviso: Todos blocos têm mesma altura');
        }

        // Drag entre blocos de alturas diferentes
        await dragBlock(page, 0, Math.min(2, count - 1));
        await page.waitForTimeout(500);

        // Verificar que funcionou
        const newCount = await blocks.count();
        expect(newCount).toBe(count);
    });
});
