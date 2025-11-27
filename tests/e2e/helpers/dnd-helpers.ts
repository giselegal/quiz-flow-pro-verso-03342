/**
 * 🛠️ HELPERS E2E - Sistema DND
 * 
 * Utilitários reutilizáveis para testes Drag and Drop
 */

import { Page, Locator, expect } from '@playwright/test';

// ════════════════════════════════════════════════════════════════════════
// 🎯 NAVEGAÇÃO & SETUP
// ════════════════════════════════════════════════════════════════════════

/**
 * Navega até o editor e aguarda carregamento completo
 */
export async function navigateToEditor(page: Page, options?: {
    template?: string;
    timeout?: number;
}) {
    const { template, timeout = 30000 } = options || {};

    await page.goto('/', { waitUntil: 'networkidle', timeout });

    // Criar novo quiz ou selecionar template
    const createButton = page.getByRole('button', { name: /criar|novo|template/i }).first();
    if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);

        // Se template especificado, selecionar
        if (template) {
            const templateButton = page.getByRole('button', { name: new RegExp(template, 'i') });
            if (await templateButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await templateButton.click();
                await page.waitForTimeout(1000);
            }
        }
    }

    // Aguardar canvas estar pronto
    await page.waitForSelector('[data-testid="canvas-column"], .canvas-column', { 
        state: 'visible', 
        timeout: timeout - 5000 
    });

    // Aguardar blocos carregarem
    await page.waitForTimeout(1000);
}

/**
 * Aguarda sistema DND estar pronto
 */
export async function waitForDndReady(page: Page, timeout = 10000) {
    // Aguardar SafeDndContext não estar em fallback
    await expect(page.locator('[data-testid="safe-dnd-fallback"]')).not.toBeVisible({ timeout });
    await expect(page.locator('[data-testid="safe-dnd-no-context"]')).not.toBeVisible({ timeout });
    await expect(page.locator('[data-testid="safe-dnd-error"]')).not.toBeVisible({ timeout });

    // Aguardar pelo menos 1 bloco estar visível
    const blocks = await getCanvasBlocks(page);
    await expect(blocks.first()).toBeVisible({ timeout });
}

// ════════════════════════════════════════════════════════════════════════
// 🔍 SELETORES & QUERIES
// ════════════════════════════════════════════════════════════════════════

/**
 * Encontra blocos no canvas
 */
export function getCanvasBlocks(page: Page): Locator {
    return page.locator('[data-block-id]').or(page.locator('[data-testid^="block-"]'));
}

/**
 * Encontra bloco específico por ID
 */
export function getBlockById(page: Page, blockId: string): Locator {
    return page.locator(`[data-block-id="${blockId}"]`);
}

/**
 * Encontra handle de drag de um bloco
 */
export function getDragHandle(block: Locator): Locator {
    return block.locator('button[title*="Arrastar"]').or(block.locator('button[title*="drag"]'));
}

/**
 * Encontra preview overlay do DragOverlay
 */
export function getDragOverlay(page: Page): Locator {
    return page.locator('.bg-gradient-to-br.from-white.to-blue-50').or(
        page.locator('text=/Movendo bloco/i').locator('..')
    );
}

/**
 * Encontra indicador de drop (linha azul)
 */
export function getDropIndicator(page: Page): Locator {
    return page.locator('.bg-blue-500.scale-y-\\[8\\]').or(
        page.locator('text=/Inserir aqui/i').locator('..')
    );
}

// ════════════════════════════════════════════════════════════════════════
// 🖱️ AÇÕES DE DRAG & DROP
// ════════════════════════════════════════════════════════════════════════

/**
 * Executa drag com mouse (distance 5px constraint)
 */
export async function dragBlock(page: Page, fromIndex: number, toIndex: number, options?: {
    distance?: number;
    steps?: number;
    pauseBefore?: number;
    pauseAfter?: number;
}) {
    const {
        distance = 6,      // Mínimo 6px para ativar sensor (constraint: 5px)
        steps = 10,        // Passos para movimento suave
        pauseBefore = 100,
        pauseAfter = 300,  // Aguardar animação cubic-bezier
    } = options || {};

    const blocks = await getCanvasBlocks(page);
    const sourceBlock = blocks.nth(fromIndex);
    const targetBlock = blocks.nth(toIndex);

    // Capturar posições
    const sourceBBox = await sourceBlock.boundingBox();
    const targetBBox = await targetBlock.boundingBox();

    if (!sourceBBox || !targetBBox) {
        throw new Error(`Blocos não encontrados: fromIndex=${fromIndex}, toIndex=${toIndex}`);
    }

    const sourceCenter = {
        x: sourceBBox.x + sourceBBox.width / 2,
        y: sourceBBox.y + sourceBBox.height / 2,
    };

    const targetCenter = {
        x: targetBBox.x + targetBBox.width / 2,
        y: targetBBox.y + targetBBox.height / 2,
    };

    // 1. Hover sobre bloco origem
    await page.mouse.move(sourceCenter.x, sourceCenter.y);
    await page.waitForTimeout(pauseBefore);

    // 2. Mouse down
    await page.mouse.down();
    await page.waitForTimeout(50);

    // 3. Mover distance pixels para ativar sensor
    await page.mouse.move(sourceCenter.x + distance, sourceCenter.y);
    await page.waitForTimeout(100);

    // 4. Arrastar até target
    await page.mouse.move(targetCenter.x, targetCenter.y, { steps });
    await page.waitForTimeout(100);

    // 5. Soltar
    await page.mouse.up();
    await page.waitForTimeout(pauseAfter);
}

/**
 * Executa drag via teclado (Space + Setas)
 */
export async function dragBlockKeyboard(page: Page, fromIndex: number, direction: 'up' | 'down', options?: {
    steps?: number;
    pauseBetween?: number;
}) {
    const { steps = 1, pauseBetween = 100 } = options || {};

    const blocks = await getCanvasBlocks(page);
    const sourceBlock = blocks.nth(fromIndex);

    // Focar no bloco
    await sourceBlock.focus();
    await page.waitForTimeout(200);

    // Space para ativar drag
    await page.keyboard.press('Space');
    await page.waitForTimeout(pauseBetween);

    // Setas para mover
    const key = direction === 'up' ? 'ArrowUp' : 'ArrowDown';
    for (let i = 0; i < steps; i++) {
        await page.keyboard.press(key);
        await page.waitForTimeout(pauseBetween);
    }

    // Space para soltar
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
}

/**
 * Executa drag via touch (delay 250ms constraint)
 */
export async function dragBlockTouch(page: Page, fromIndex: number, toIndex: number, options?: {
    touchDelay?: number;
    steps?: number;
}) {
    const {
        touchDelay = 300, // Mínimo 250ms + margem
        steps = 10,
    } = options || {};

    const blocks = await getCanvasBlocks(page);
    const sourceBBox = await blocks.nth(fromIndex).boundingBox();
    const targetBBox = await blocks.nth(toIndex).boundingBox();

    if (!sourceBBox || !targetBBox) {
        throw new Error('Blocos não encontrados para touch drag');
    }

    const sourceCenter = {
        x: sourceBBox.x + sourceBBox.width / 2,
        y: sourceBBox.y + sourceBBox.height / 2,
    };

    const targetCenter = {
        x: targetBBox.x + targetBBox.width / 2,
        y: targetBBox.y + targetBBox.height / 2,
    };

    // Touch press (com delay 250ms)
    await page.touchscreen.tap(sourceCenter.x, sourceCenter.y);
    await page.waitForTimeout(touchDelay);

    // Arrastar (simular touch move)
    await page.mouse.move(sourceCenter.x, sourceCenter.y);
    await page.mouse.down();
    await page.mouse.move(targetCenter.x, targetCenter.y, { steps });
    await page.mouse.up();
    await page.waitForTimeout(300);
}

// ════════════════════════════════════════════════════════════════════════
// ✅ VALIDAÇÕES & ASSERTIONS
// ════════════════════════════════════════════════════════════════════════

/**
 * Valida que bloco foi reordenado com sucesso
 */
export async function assertBlockMoved(
    page: Page,
    originalIndex: number,
    expectedNewIndex: number,
    blockIdentifier: string // Texto único do bloco
) {
    const blocks = await getCanvasBlocks(page);
    const newBlock = blocks.nth(expectedNewIndex);
    
    await expect(newBlock).toContainText(blockIdentifier, { timeout: 5000 });
}

/**
 * Valida preview premium durante drag
 */
export async function assertDragPreview(page: Page, options?: {
    shouldHaveGradient?: boolean;
    shouldHaveIcon?: boolean;
    shouldHaveBadge?: boolean;
}) {
    const {
        shouldHaveGradient = true,
        shouldHaveIcon = true,
        shouldHaveBadge = true,
    } = options || {};

    const overlay = getDragOverlay(page);
    await expect(overlay).toBeVisible({ timeout: 2000 });

    if (shouldHaveGradient) {
        await expect(overlay).toHaveClass(/bg-gradient-to-br/);
        await expect(overlay).toHaveClass(/from-white/);
        await expect(overlay).toHaveClass(/to-blue-50/);
    }

    if (shouldHaveIcon) {
        // Verificar ícone 2x2 animado
        const dots = overlay.locator('.bg-blue-500.rounded-full.animate-pulse');
        expect(await dots.count()).toBeGreaterThanOrEqual(4);
    }

    if (shouldHaveBadge) {
        // Verificar badge circular com SVG
        const badge = overlay.locator('.bg-blue-500.rounded-full svg');
        await expect(badge).toBeVisible();
    }
}

/**
 * Valida indicador de drop
 */
export async function assertDropIndicator(page: Page, expectedPosition?: number) {
    // Linha azul
    const line = page.locator('.bg-blue-500.scale-y-\\[8\\]');
    await expect(line).toBeVisible({ timeout: 2000 });

    // Círculos nas extremidades
    const circles = page.locator('.bg-blue-500.rounded-full').filter({ hasText: '' });
    expect(await circles.count()).toBeGreaterThanOrEqual(2);

    // Label com posição
    if (expectedPosition !== undefined) {
        const label = page.locator(`text=Inserir aqui (#${expectedPosition})`);
        await expect(label).toBeVisible();
    }
}

/**
 * Valida animação cubic-bezier
 */
export async function assertTransitionAnimation(block: Locator) {
    const transition = await block.evaluate(el => window.getComputedStyle(el).transition);
    
    expect(transition).toContain('300ms');
    expect(transition).toContain('cubic-bezier');
}

/**
 * Valida que não há erros DND no console
 */
export async function assertNoDndErrors(page: Page, errors: string[]) {
    const dndErrors = errors.filter(e =>
        e.includes('dnd') ||
        e.includes('drag') ||
        e.includes('useLayoutEffect') ||
        e.includes('forwardRef')
    );

    expect(dndErrors).toHaveLength(0);
}

// ════════════════════════════════════════════════════════════════════════
// 📊 MÉTRICAS & PERFORMANCE
// ════════════════════════════════════════════════════════════════════════

/**
 * Mede taxa de sucesso de múltiplos drags
 */
export async function measureSuccessRate(
    page: Page,
    attempts: number,
    dragFn: () => Promise<void>
): Promise<number> {
    let successCount = 0;

    for (let i = 0; i < attempts; i++) {
        try {
            await dragFn();
            const blocks = await getCanvasBlocks(page);
            if (await blocks.count() > 0) {
                successCount++;
            }
        } catch (error) {
            console.error(`Tentativa ${i + 1}/${attempts} falhou:`, error);
        }
    }

    return (successCount / attempts) * 100;
}

/**
 * Mede FPS durante operação
 */
export async function measureFPS(page: Page, operationFn: () => Promise<void>): Promise<number> {
    // Iniciar monitor FPS
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

    // Executar operação
    await operationFn();
    await page.waitForTimeout(1000);

    // Capturar FPS
    const fps = await page.evaluate(() => (window as any).__fpsMonitor);
    const avgFps = fps.length > 0 
        ? fps.reduce((a: number, b: number) => a + b, 0) / fps.length 
        : 0;

    return avgFps;
}

/**
 * Mede tempo de resposta
 */
export async function measureResponseTime(operationFn: () => Promise<void>): Promise<number> {
    const startTime = Date.now();
    await operationFn();
    return Date.now() - startTime;
}

// ════════════════════════════════════════════════════════════════════════
// 🐛 DEBUG & LOGGING
// ════════════════════════════════════════════════════════════════════════

/**
 * Loga estado atual dos blocos
 */
export async function logBlocksState(page: Page, label = 'Blocos') {
    const blocks = await getCanvasBlocks(page);
    const count = await blocks.count();

    console.log(`\n📦 ${label} (total: ${count}):`);
    for (let i = 0; i < count; i++) {
        const text = await blocks.nth(i).textContent();
        const bbox = await blocks.nth(i).boundingBox();
        const blockId = await blocks.nth(i).getAttribute('data-block-id');
        console.log(`  [${i}] ID: ${blockId}, Text: ${text?.substring(0, 30)}...`, bbox);
    }
}

/**
 * Captura screenshot com label
 */
export async function debugScreenshot(page: Page, label: string) {
    const filename = `debug-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    await page.screenshot({ path: `test-results/${filename}`, fullPage: true });
    console.log(`📸 Screenshot: ${filename}`);
}

/**
 * Monitora console de erros DND
 */
export function setupDndErrorMonitor(page: Page): string[] {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
        const msg = error.message;
        if (msg.includes('dnd') || msg.includes('drag') || msg.includes('React')) {
            errors.push(`[PageError] ${msg}`);
            console.error('❌ DND Error:', msg);
        }
    });

    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            const text = msg.text();
            if (text.includes('dnd') || text.includes('drag')) {
                errors.push(`[Console] ${text}`);
                console.error('❌ Console Error:', text);
            }
        }
    });

    return errors;
}
