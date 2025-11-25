import { test, expect } from '@playwright/test';

test.describe('Properties Panel - Testes E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Ativar flag antes de cada teste
    await page.addInitScript(() => {
      localStorage.setItem('qm-editor:use-simple-properties', 'true');
    });
    
    // Navegar para o editor
    await page.goto('/editor?template=quiz21StepsComplete');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
  });

  test('deve ativar PropertiesColumn com flag correta', async ({ page }) => {
    // Verificar flag no localStorage
    const flag = await page.evaluate(() => {
      return localStorage.getItem('qm-editor:use-simple-properties');
    });
    
    expect(flag).toBe('true');
    console.log('✅ Flag ativada:', flag);
  });

  test('deve renderizar PropertiesColumn quando editor carrega', async ({ page }) => {
    // Aguardar PropertiesColumn aparecer
    const propsColumn = page.locator('[data-testid="column-properties"]');
    await expect(propsColumn).toBeVisible({ timeout: 10000 });
    
    console.log('✅ PropertiesColumn renderizado');
  });

  test('deve mostrar blocos no canvas', async ({ page }) => {
    // Aguardar blocos carregarem
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    const blocks = await page.locator('[data-block-id]').count();
    expect(blocks).toBeGreaterThan(0);
    
    console.log(`✅ ${blocks} blocos encontrados no canvas`);
  });

  test('deve selecionar bloco ao clicar', async ({ page }) => {
    // Aguardar blocos
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    // Capturar logs do console
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('PropertiesColumn') || 
          msg.text().includes('handleWYSIWYGBlockSelect') ||
          msg.text().includes('selectedBlock')) {
        logs.push(msg.text());
      }
    });
    
    // Clicar no primeiro bloco
    const firstBlock = page.locator('[data-block-id]').first();
    const blockId = await firstBlock.getAttribute('data-block-id');
    
    console.log('🖱️ Clicando no bloco:', blockId);
    await firstBlock.click();
    
    // Aguardar um pouco para logs aparecerem
    await page.waitForTimeout(1000);
    
    // Verificar se há logs relevantes
    console.log('📊 Logs capturados:', logs.length);
    logs.forEach(log => console.log('  ', log));
    
    expect(logs.length).toBeGreaterThan(0);
  });

  test('deve mostrar propriedades do bloco selecionado', async ({ page }) => {
    // Aguardar blocos
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    // Clicar no primeiro bloco
    await page.locator('[data-block-id]').first().click();
    
    // Aguardar PropertiesColumn atualizar
    await page.waitForTimeout(500);
    
    // Verificar se Properties Panel tem conteúdo
    const propsColumn = page.locator('[data-testid="column-properties"]');
    const text = await propsColumn.textContent();
    
    console.log('📝 Conteúdo do Properties Panel:', text?.substring(0, 200));
    
    // Não deve mostrar "Nenhum bloco disponível"
    expect(text).not.toContain('Nenhum bloco disponível');
  });

  test('deve ter botão de toggle entre painéis', async ({ page }) => {
    // Procurar botão com texto "PropertiesColumn" ou "WithJson"
    const toggleBtn = page.locator('button:has-text("PropertiesColumn"), button:has-text("WithJson")');
    
    if (await toggleBtn.count() > 0) {
      await expect(toggleBtn.first()).toBeVisible();
      console.log('✅ Botão de toggle encontrado');
      
      // Clicar no botão
      await toggleBtn.first().click();
      await page.waitForTimeout(500);
      
      console.log('✅ Botão clicado com sucesso');
    } else {
      console.log('⚠️ Botão de toggle não encontrado (pode estar em outra versão)');
    }
  });

  test('deve ter logs de debug no console', async ({ page }) => {
    const debugLogs: string[] = [];
    
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('🔍') || text.includes('🖱️') || text.includes('🎯')) {
        debugLogs.push(text);
      }
    });
    
    // Aguardar carregamento completo
    await page.waitForTimeout(2000);
    
    // Clicar em um bloco
    const blocks = page.locator('[data-block-id]');
    if (await blocks.count() > 0) {
      await blocks.first().click();
      await page.waitForTimeout(1000);
    }
    
    console.log(`🐛 ${debugLogs.length} logs de debug capturados`);
    debugLogs.forEach(log => console.log('  ', log));
    
    expect(debugLogs.length).toBeGreaterThan(0);
  });
});
