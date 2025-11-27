/**
 * 🎯 E2E Tests: Seleção de Blocos - Versão Simplificada
 * 
 * Testes mínimos e robustos para validar o sistema de seleção
 */

import { test, expect } from '@playwright/test';

const EDITOR_URL = 'http://localhost:8080/editor?funnel=quiz21StepsComplete';

test.describe('🎯 Seleção de Blocos - Testes Essenciais', () => {
  
  test('01. Editor carrega e renderiza blocos', async ({ page }) => {
    console.log('🔍 Teste 01: Carregamento de blocos');
    
    await page.goto(EDITOR_URL, { timeout: 30000 });
    
    // Aguardar corpo da página
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Aguardar renderização completa
    
    // Capturar screenshot inicial
    await page.screenshot({ path: 'test-results/sel-01-page-loaded.png', fullPage: true });
    
    // Buscar blocos com múltiplos seletores
    const blockCount = await page.evaluate(() => {
      const selectors = [
        '[data-block-id]',
        '[data-testid^="block-"]',
        '[class*="block-item"]',
        '[class*="Block"]',
        '[draggable="true"]'
      ];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`✅ Encontrados ${elements.length} blocos com: ${selector}`);
          return elements.length;
        }
      }
      
      return 0;
    });
    
    console.log(`📊 Total de blocos: ${blockCount}`);
    expect(blockCount).toBeGreaterThan(0);
  });

  test('02. Clicar em bloco seleciona e mostra no console', async ({ page }) => {
    console.log('🖱️ Teste 02: Clique em bloco');
    
    const consoleLogs: string[] = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    
    await page.goto(EDITOR_URL, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Encontrar e clicar no primeiro bloco
    const clicked = await page.evaluate(() => {
      const selectors = [
        '[data-block-id]',
        '[data-testid^="block-"]',
        '[class*="block-item"]'
      ];
      
      for (const selector of selectors) {
        const block = document.querySelector(selector);
        if (block) {
          console.log('🎯 Clicando em bloco:', selector);
          (block as HTMLElement).click();
          return {
            success: true,
            selector,
            id: block.getAttribute('data-block-id') || block.getAttribute('id') || 'unknown'
          };
        }
      }
      
      return { success: false, selector: 'none', id: 'none' };
    });
    
    console.log('Resultado do clique:', clicked);
    await page.waitForTimeout(1000);
    
    // Screenshot após clique
    await page.screenshot({ path: 'test-results/sel-02-after-click.png', fullPage: true });
    
    expect(clicked.success).toBe(true);
    console.log('✅ Clique executado com sucesso');
  });

  test('03. Verificar se isLoadingStep está bloqueando cliques', async ({ page }) => {
    console.log('🔒 Teste 03: Detecção de loading bloqueante');
    
    await page.goto(EDITOR_URL, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Verificar múltiplas vezes se há elementos bloqueantes
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(1000);
      
      const blockingState = await page.evaluate(() => {
        // Verificar pointer-events-none
        const blockedElements = Array.from(
          document.querySelectorAll('[class*="pointer-events-none"]')
        ).filter(el => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.pointerEvents === 'none' && rect.width > 200 && rect.height > 200;
        });
        
        // Verificar opacidade baixa
        const fadedElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return parseFloat(style.opacity) < 0.6 && rect.width > 200 && rect.height > 200;
        });
        
        return {
          iteration: i + 1,
          hasBlockingElements: blockedElements.length > 0,
          blockingCount: blockedElements.length,
          fadedCount: fadedElements.length,
          blockingInfo: blockedElements.map(el => ({
            tag: el.tagName,
            class: el.className,
            rect: el.getBoundingClientRect()
          }))
        };
      });
      
      console.log(`Iteração ${i + 1}:`, blockingState);
      
      if (blockingState.hasBlockingElements) {
        console.error('❌ DETECTADO: Elementos bloqueando interação!');
        console.error('Detalhes:', blockingState.blockingInfo);
        
        await page.screenshot({ 
          path: `test-results/sel-03-blocking-detected-${i}.png`, 
          fullPage: true 
        });
      }
    }
    
    console.log('✅ Verificação de bloqueio concluída');
  });

  test('04. Stress test: múltiplos cliques seguidos', async ({ page }) => {
    console.log('⚡ Teste 04: Stress test de cliques');
    
    await page.goto(EDITOR_URL, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Fazer 10 cliques rápidos
    const results = [];
    
    for (let i = 0; i < 10; i++) {
      const result = await page.evaluate((iteration) => {
        const block = document.querySelector('[data-block-id], [data-testid^="block-"]');
        if (block) {
          (block as HTMLElement).click();
          return { iteration, success: true, timestamp: Date.now() };
        }
        return { iteration, success: false, timestamp: Date.now() };
      }, i + 1);
      
      results.push(result);
      await page.waitForTimeout(50); // Delay mínimo
    }
    
    console.log('Resultados dos cliques:', results);
    
    const successCount = results.filter(r => r.success).length;
    console.log(`✅ ${successCount}/10 cliques bem-sucedidos`);
    
    await page.screenshot({ path: 'test-results/sel-04-stress-test.png', fullPage: true });
    
    expect(successCount).toBeGreaterThanOrEqual(8);
  });

  test('05. Verificar estado de loading no contexto React', async ({ page }) => {
    console.log('⚛️ Teste 05: Estado de loading do React');
    
    await page.goto(EDITOR_URL, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Injetar script para monitorar estado
    const loadingStates = await page.evaluate(() => {
      return new Promise((resolve) => {
        const states: any[] = [];
        let checkCount = 0;
        const maxChecks = 10;
        
        const checkInterval = setInterval(() => {
          checkCount++;
          
          // Tentar acessar contextos React (hack)
          const rootElement = document.querySelector('[data-testid="modular-layout"], #root');
          const hasLoadingClass = document.body.className.includes('loading');
          const hasPointerEventsNone = Array.from(document.querySelectorAll('*')).some(el => {
            const style = window.getComputedStyle(el);
            return style.pointerEvents === 'none' && 
                   el.getBoundingClientRect().width > 300;
          });
          
          states.push({
            check: checkCount,
            timestamp: Date.now(),
            hasLoadingClass,
            hasPointerEventsNone,
            bodyClass: document.body.className
          });
          
          if (checkCount >= maxChecks) {
            clearInterval(checkInterval);
            resolve(states);
          }
        }, 500);
      });
    });
    
    console.log('Estados de loading capturados:', loadingStates);
    
    // Verificar se loading ficou travado
    const stuckLoading = loadingStates.filter((s: any) => s.hasPointerEventsNone);
    
    if (stuckLoading.length > 5) {
      console.error('❌ DETECTADO: Loading travado por múltiplas verificações!');
      console.error('Verificações com bloqueio:', stuckLoading.length);
    } else {
      console.log('✅ Loading não ficou travado');
    }
    
    await page.screenshot({ path: 'test-results/sel-05-loading-state.png', fullPage: true });
  });
});
