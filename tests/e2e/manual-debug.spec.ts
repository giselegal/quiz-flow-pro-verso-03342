import { test, expect } from '@playwright/test';

test.describe('Debug Manual - Sistema Real', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar localStorage ANTES de navegar
    await page.goto('http://localhost:8080');
    await page.evaluate(() => {
      localStorage.setItem('qm-editor:use-simple-properties', 'true');
    });
    
    // Navegar para o editor
    await page.goto('http://localhost:8080/editor?funnel=quiz21StepsComplete');
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('1. Verificar estrutura DOM completa', async ({ page }) => {
    console.log('🔍 === VERIFICANDO ESTRUTURA DOM REAL ===');
    
    // Verificar PanelGroup
    const panelGroup = page.locator('[data-panel-group]');
    const panelGroupExists = await panelGroup.count();
    console.log('📦 PanelGroup encontrado:', panelGroupExists > 0);
    
    // Verificar quantos painéis existem
    const panels = page.locator('[data-panel]');
    const panelCount = await panels.count();
    console.log('📊 Número de painéis:', panelCount);
    
    // Verificar se PropertiesColumn está visível
    const propsColumn = page.locator('[data-testid="column-properties"]');
    const propsExists = await propsColumn.count();
    const propsVisible = await propsColumn.isVisible().catch(() => false);
    console.log('🎨 PropertiesColumn encontrado:', propsExists > 0);
    console.log('👁️ PropertiesColumn visível:', propsVisible);
    
    // Se não estiver visível, verificar CSS
    if (!propsVisible && propsExists > 0) {
      const styles = await propsColumn.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          width: computed.width,
          height: computed.height,
          position: computed.position,
          overflow: computed.overflow,
        };
      });
      console.log('🎨 Estilos CSS:', styles);
    }
    
    // Verificar CanvasColumn
    const canvas = page.locator('[data-testid="canvas-column"]');
    const canvasExists = await canvas.count();
    console.log('🖼️ CanvasColumn encontrado:', canvasExists > 0);
    
    // Verificar blocos no canvas
    const blocks = page.locator('[data-block-id]');
    const blockCount = await blocks.count();
    console.log('🧱 Número de blocos:', blockCount);
    
    if (blockCount > 0) {
      // Listar todos os blocos
      const blockIds = await blocks.evaluateAll((els) => 
        els.map(el => el.getAttribute('data-block-id'))
      );
      console.log('🆔 IDs dos blocos:', blockIds);
    }
    
    // Screenshot para debug
    await page.screenshot({ 
      path: '/workspaces/quiz-flow-pro-verso-03342/test-results/debug-estrutura.png',
      fullPage: true 
    });
    
    expect(panelCount).toBeGreaterThan(0);
  });

  test('2. Testar click em bloco e verificar painel', async ({ page }) => {
    console.log('🖱️ === TESTANDO CLICK EM BLOCO ===');
    
    // Aguardar blocos carregarem
    await page.waitForSelector('[data-block-id]', { timeout: 10000 });
    
    const blocks = page.locator('[data-block-id]');
    const blockCount = await blocks.count();
    console.log('🧱 Blocos disponíveis:', blockCount);
    
    if (blockCount === 0) {
      console.log('❌ NENHUM BLOCO ENCONTRADO!');
      await page.screenshot({ 
        path: '/workspaces/quiz-flow-pro-verso-03342/test-results/debug-sem-blocos.png',
        fullPage: true 
      });
      throw new Error('Nenhum bloco encontrado para clicar');
    }
    
    // Pegar primeiro bloco
    const firstBlock = blocks.first();
    const blockId = await firstBlock.getAttribute('data-block-id');
    console.log('🎯 Clicando no bloco:', blockId);
    
    // Screenshot ANTES do click
    await page.screenshot({ 
      path: '/workspaces/quiz-flow-pro-verso-03342/test-results/debug-antes-click.png',
      fullPage: true 
    });
    
    // Click no bloco
    await firstBlock.click();
    await page.waitForTimeout(1000);
    
    // Screenshot DEPOIS do click
    await page.screenshot({ 
      path: '/workspaces/quiz-flow-pro-verso-03342/test-results/debug-depois-click.png',
      fullPage: true 
    });
    
    // Verificar se painel está visível
    const propsColumn = page.locator('[data-testid="column-properties"]');
    const propsVisible = await propsColumn.isVisible().catch(() => false);
    console.log('👁️ PropertiesColumn visível após click:', propsVisible);
    
    // Verificar se há classe 'selected' no bloco
    const blockClasses = await firstBlock.getAttribute('class');
    console.log('🎨 Classes do bloco:', blockClasses);
    const isSelected = blockClasses?.includes('selected') || blockClasses?.includes('active');
    console.log('✅ Bloco marcado como selecionado:', isSelected);
    
    // Verificar console logs no navegador
    const logs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('[QuizModularEditor]') || 
          text.includes('[PropertiesColumn]') || 
          text.includes('[WYSIWYG]')) {
        console.log('📝 Browser log:', text);
        logs.push(text);
      }
    });
    
    // Click novamente para capturar logs
    await firstBlock.click();
    await page.waitForTimeout(500);
    
    console.log('📋 Total de logs capturados:', logs.length);
    
    expect(propsVisible).toBe(true);
  });

  test('3. Verificar estado do localStorage', async ({ page }) => {
    console.log('💾 === VERIFICANDO LOCALSTORAGE ===');
    
    const storage = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const result: Record<string, string | null> = {};
      
      keys.forEach(key => {
        if (key.includes('editor') || key.includes('qm') || key.includes('properties')) {
          result[key] = localStorage.getItem(key);
        }
      });
      
      return result;
    });
    
    console.log('🔑 Chaves relevantes:', storage);
    
    const useSimple = storage['qm-editor:use-simple-properties'];
    console.log('✅ qm-editor:use-simple-properties:', useSimple);
    
    expect(useSimple).toBe('true');
  });

  test('4. Verificar se botão de toggle existe', async ({ page }) => {
    console.log('🔘 === VERIFICANDO BOTÃO DE TOGGLE ===');
    
    // Procurar pelo botão de toggle
    const toggleButton = page.locator('button:has-text("PropertiesColumn"), button:has-text("WithJson")');
    const buttonExists = await toggleButton.count();
    console.log('🔘 Botão de toggle encontrado:', buttonExists > 0);
    
    if (buttonExists > 0) {
      const buttonText = await toggleButton.textContent();
      console.log('📝 Texto do botão:', buttonText);
      
      // Screenshot do botão
      await toggleButton.screenshot({ 
        path: '/workspaces/quiz-flow-pro-verso-03342/test-results/debug-toggle-button.png'
      });
    }
    
    expect(buttonExists).toBeGreaterThan(0);
  });

  test('5. Forçar exibição do painel via DevTools', async ({ page }) => {
    console.log('🔧 === FORÇANDO EXIBIÇÃO DO PAINEL ===');
    
    // Forçar showProperties = true
    await page.evaluate(() => {
      // @ts-ignore
      window.__forceShowProperties = true;
    });
    
    // Verificar se painel aparece
    const propsColumn = page.locator('[data-testid="column-properties"]');
    await page.waitForTimeout(1000);
    
    const propsVisible = await propsColumn.isVisible().catch(() => false);
    console.log('👁️ PropertiesColumn visível após forçar:', propsVisible);
    
    if (!propsVisible) {
      // Verificar o que está impedindo
      const editorModeUI = await page.evaluate(() => {
        // @ts-ignore
        return window.__editorModeUI || 'não encontrado';
      });
      console.log('🎮 Estado editorModeUI:', editorModeUI);
    }
    
    await page.screenshot({ 
      path: '/workspaces/quiz-flow-pro-verso-03342/test-results/debug-forcado.png',
      fullPage: true 
    });
  });
});
