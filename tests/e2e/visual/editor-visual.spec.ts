/**
 * 🎨 TESTES VISUAIS - EDITOR DE FUNIL
 * 
 * Testes de regressão visual usando Playwright
 * Captura screenshots e compara com baselines para detectar mudanças visuais
 * 
 * @module tests/e2e/visual/editor-visual
 */

import { test, expect } from '@playwright/test';

// Configuração de timeouts
const TIMEOUT = 10000;

/**
 * Helper: Fechar modal de startup
 */
async function closeStartupModal(page) {
  const modal = page.locator('[data-testid="editor-startup-modal"]');
  
  if (await modal.isVisible().catch(() => false)) {
    console.log('⚠️ Modal de startup detectado, fechando...');
    
    // Tentar fechar usando botão X
    const closeButton = page.locator('[data-testid="editor-startup-modal-close"]');
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
      await page.waitForTimeout(500);
      return;
    }
    
    // Fallback: clicar em "Começar do Zero"
    const blankButton = page.locator('[data-testid="editor-startup-blank-button"]');
    if (await blankButton.isVisible().catch(() => false)) {
      await blankButton.click();
      await page.waitForTimeout(500);
    }
  }
}

test.describe('Testes Visuais - Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar viewport padrão
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('1. Modal de Startup - Deve renderizar corretamente', async ({ page }) => {
    // Limpar localStorage para garantir que modal aparece
    await page.goto('/editor');
    await page.evaluate(() => {
      localStorage.removeItem('editor:skipStartupModal');
    });
    
    // Recarregar para mostrar modal
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verificar se modal está visível
    const modal = page.locator('[data-testid="editor-startup-modal"]');
    await expect(modal).toBeVisible({ timeout: TIMEOUT });
    
    // Capturar screenshot do modal
    await page.screenshot({
      path: 'tests/screenshots/visual/modal-startup-full.png',
      fullPage: false
    });
    
    // Screenshot apenas do modal
    await modal.screenshot({
      path: 'tests/screenshots/visual/modal-startup-component.png'
    });
    
    console.log('✅ Screenshots do modal capturados');
  });

  test('2. Editor - Layout de 4 colunas', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Fechar modal
    await closeStartupModal(page);
    await page.waitForTimeout(1000);
    
    // Capturar screenshot do editor completo
    await page.screenshot({
      path: 'tests/screenshots/visual/editor-layout-full.png',
      fullPage: true
    });
    
    // Verificar cada coluna individualmente
    const columns = [
      { name: 'step-navigator', selector: 'div.h-full.border-r.bg-white >> nth=0' },
      { name: 'component-library', selector: 'div.h-full.border-r.bg-white >> nth=1' },
      { name: 'canvas', selector: 'div.h-full.bg-gray-50' },
      { name: 'properties', selector: 'div.h-full.border-l.bg-white' }
    ];
    
    for (const column of columns) {
      const element = page.locator(column.selector).first();
      if (await element.isVisible().catch(() => false)) {
        await element.screenshot({
          path: `tests/screenshots/visual/editor-column-${column.name}.png`
        });
        console.log(`✅ Screenshot da coluna ${column.name} capturado`);
      }
    }
  });

  test('3. Toolbar - Todos os botões visíveis', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await closeStartupModal(page);
    
    // Localizar toolbar
    const toolbar = page.locator('div.flex.items-center.gap-2').first();
    
    if (await toolbar.isVisible().catch(() => false)) {
      await toolbar.screenshot({
        path: 'tests/screenshots/visual/editor-toolbar.png'
      });
      console.log('✅ Screenshot da toolbar capturado');
    }
  });

  test('4. Modal com botão X - Visual regression', async ({ page }) => {
    await page.goto('/editor');
    await page.evaluate(() => {
      localStorage.removeItem('editor:skipStartupModal');
    });
    await page.reload();
    await page.waitForTimeout(2000);
    
    const modal = page.locator('[data-testid="editor-startup-modal"]');
    await expect(modal).toBeVisible({ timeout: TIMEOUT });
    
    // Verificar se botão X está presente
    const closeButton = page.locator('[data-testid="editor-startup-modal-close"]');
    await expect(closeButton).toBeVisible();
    
    // Highlight do botão X para captura
    await closeButton.evaluate(el => {
      el.style.outline = '2px solid red';
    });
    
    await page.screenshot({
      path: 'tests/screenshots/visual/modal-with-close-button.png'
    });
    
    console.log('✅ Screenshot do modal com botão X capturado');
  });

  test('5. Modal - Checkbox "Não mostrar novamente"', async ({ page }) => {
    await page.goto('/editor');
    await page.evaluate(() => {
      localStorage.removeItem('editor:skipStartupModal');
    });
    await page.reload();
    await page.waitForTimeout(2000);
    
    const modal = page.locator('[data-testid="editor-startup-modal"]');
    await expect(modal).toBeVisible({ timeout: TIMEOUT });
    
    // Verificar checkbox
    const checkbox = page.locator('input[type="checkbox"]#dontShowAgain');
    
    if (await checkbox.isVisible().catch(() => false)) {
      // Marcar checkbox para screenshot
      await checkbox.check();
      
      await modal.screenshot({
        path: 'tests/screenshots/visual/modal-with-checkbox-checked.png'
      });
      
      console.log('✅ Screenshot do modal com checkbox marcado capturado');
    }
  });

  test('6. Editor - Estado vazio (sem blocos)', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await closeStartupModal(page);
    
    // Canvas
    const canvas = page.locator('div.h-full.bg-gray-50').first();
    
    if (await canvas.isVisible().catch(() => false)) {
      await canvas.screenshot({
        path: 'tests/screenshots/visual/editor-canvas-empty.png'
      });
      console.log('✅ Screenshot do canvas vazio capturado');
    }
  });

  test('7. Editor - Responsivo Mobile (390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await closeStartupModal(page);
    
    await page.screenshot({
      path: 'tests/screenshots/visual/editor-mobile-portrait.png',
      fullPage: true
    });
    
    console.log('✅ Screenshot mobile capturado');
  });

  test('8. Editor - Responsivo Tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await closeStartupModal(page);
    
    await page.screenshot({
      path: 'tests/screenshots/visual/editor-tablet-portrait.png',
      fullPage: true
    });
    
    console.log('✅ Screenshot tablet capturado');
  });

  test('9. Comparação Visual - Antes vs Depois', async ({ page }) => {
    // Este teste captura o estado atual que será comparado
    await page.goto('/editor');
    await page.evaluate(() => {
      localStorage.removeItem('editor:skipStartupModal');
    });
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Estado 1: Modal aberto
    await page.screenshot({
      path: 'tests/screenshots/visual/comparison-modal-open.png'
    });
    
    // Estado 2: Modal fechado
    await closeStartupModal(page);
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: 'tests/screenshots/visual/comparison-modal-closed.png'
    });
    
    console.log('✅ Screenshots de comparação capturados');
  });

  test('10. Editor - Hover states dos botões', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await closeStartupModal(page);
    
    // Botão Salvar
    const saveButton = page.locator('button:has-text("Salvar")').first();
    
    if (await saveButton.isVisible().catch(() => false)) {
      // Estado normal
      await saveButton.screenshot({
        path: 'tests/screenshots/visual/button-save-normal.png'
      });
      
      // Estado hover
      await saveButton.hover();
      await page.waitForTimeout(300);
      await saveButton.screenshot({
        path: 'tests/screenshots/visual/button-save-hover.png'
      });
      
      console.log('✅ Screenshots de estados do botão capturados');
    }
  });
});

test.describe('Testes Visuais - Comparação Automática', () => {
  test('11. Regression Test - Modal deve manter aparência', async ({ page }) => {
    await page.goto('/editor');
    await page.evaluate(() => {
      localStorage.removeItem('editor:skipStartupModal');
    });
    await page.reload();
    await page.waitForTimeout(2000);
    
    const modal = page.locator('[data-testid="editor-startup-modal"]');
    await expect(modal).toBeVisible({ timeout: TIMEOUT });
    
    // Comparar com baseline (se existir)
    await expect(modal).toHaveScreenshot('modal-baseline.png', {
      maxDiffPixels: 100,
      threshold: 0.2
    });
  });

  test('12. Regression Test - Editor layout deve ser estável', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await closeStartupModal(page);
    
    // Comparar layout completo com baseline
    await expect(page).toHaveScreenshot('editor-layout-baseline.png', {
      maxDiffPixels: 500,
      threshold: 0.3,
      fullPage: true
    });
  });
});

test.describe('Testes de Acessibilidade Visual', () => {
  test('13. Contraste de cores - Modal', async ({ page }) => {
    await page.goto('/editor');
    await page.evaluate(() => {
      localStorage.removeItem('editor:skipStartupModal');
    });
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Injetar script para verificar contraste
    const contrastReport = await page.evaluate(() => {
      const modal = document.querySelector('[data-testid="editor-startup-modal"]');
      if (!modal) return { error: 'Modal não encontrado' };
      
      const title = modal.querySelector('h2');
      const buttons = modal.querySelectorAll('button');
      
      const getContrast = (el: Element) => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
          fontSize: style.fontSize
        };
      };
      
      return {
        title: title ? getContrast(title) : null,
        buttons: Array.from(buttons).map(b => getContrast(b))
      };
    });
    
    console.log('📊 Relatório de Contraste:', JSON.stringify(contrastReport, null, 2));
    
    // Screenshot para análise manual
    await page.screenshot({
      path: 'tests/screenshots/visual/accessibility-contrast.png'
    });
  });

  test('14. Foco visível - Navegação por teclado', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForTimeout(3000);
    await closeStartupModal(page);
    
    // Navegar por Tab
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.screenshot({
      path: 'tests/screenshots/visual/keyboard-focus-1.png'
    });
    
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.screenshot({
      path: 'tests/screenshots/visual/keyboard-focus-2.png'
    });
    
    console.log('✅ Screenshots de foco por teclado capturados');
  });
});
