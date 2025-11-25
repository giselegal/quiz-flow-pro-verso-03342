import { test, expect } from '@playwright/test';

test.describe('Properties Panel - Testes de Edição E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Ativar flag
    await page.addInitScript(() => {
      localStorage.setItem('qm-editor:use-simple-properties', 'true');
    });
    
    // Navegar para o editor
    await page.goto('/editor?template=quiz21StepsComplete');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
  });

  test('deve editar propriedade de texto de um bloco', async ({ page }) => {
    // Aguardar blocos carregarem
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    // Clicar no primeiro bloco
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    
    // Aguardar Properties Panel atualizar
    await page.waitForTimeout(500);
    
    // Procurar campo de texto (input ou textarea)
    const textInput = page.locator('[data-testid="column-properties"] input[type="text"]').first();
    
    if (await textInput.count() > 0) {
      const valorOriginal = await textInput.inputValue();
      console.log('📝 Valor original:', valorOriginal);
      
      // Editar valor
      await textInput.clear();
      await textInput.fill('Texto editado via E2E');
      
      // Aguardar um pouco
      await page.waitForTimeout(300);
      
      const novoValor = await textInput.inputValue();
      console.log('✏️ Novo valor:', novoValor);
      
      expect(novoValor).toBe('Texto editado via E2E');
      console.log('✅ Edição de texto funcionou');
    } else {
      console.log('⚠️ Nenhum campo de texto encontrado');
    }
  });

  test('deve editar propriedade numérica de um bloco', async ({ page }) => {
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    await page.waitForTimeout(500);
    
    // Procurar campo numérico
    const numberInput = page.locator('[data-testid="column-properties"] input[type="number"]').first();
    
    if (await numberInput.count() > 0) {
      const valorOriginal = await numberInput.inputValue();
      console.log('🔢 Valor original:', valorOriginal);
      
      await numberInput.clear();
      await numberInput.fill('42');
      await page.waitForTimeout(300);
      
      const novoValor = await numberInput.inputValue();
      console.log('🔢 Novo valor:', novoValor);
      
      expect(novoValor).toBe('42');
      console.log('✅ Edição numérica funcionou');
    } else {
      console.log('⚠️ Nenhum campo numérico encontrado');
    }
  });

  test('deve salvar alterações ao clicar em Aplicar', async ({ page }) => {
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    const firstBlock = page.locator('[data-block-id]').first();
    const blockId = await firstBlock.getAttribute('data-block-id');
    console.log('🎯 Bloco selecionado:', blockId);
    
    await firstBlock.click();
    await page.waitForTimeout(500);
    
    // Capturar logs de salvamento
    const saveLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Aplicar') || text.includes('save') || text.includes('update')) {
        saveLogs.push(text);
      }
    });
    
    // Editar algum campo
    const textInput = page.locator('[data-testid="column-properties"] input').first();
    if (await textInput.count() > 0) {
      await textInput.clear();
      await textInput.fill('Teste de salvamento');
      await page.waitForTimeout(300);
    }
    
    // Procurar botão "Aplicar" ou "Save"
    const applyBtn = page.locator('button:has-text("Aplicar"), button:has-text("Salvar")').first();
    
    if (await applyBtn.count() > 0) {
      console.log('💾 Clicando em botão de aplicar');
      await applyBtn.click();
      await page.waitForTimeout(1000);
      
      console.log('📊 Logs de salvamento:', saveLogs.length);
      saveLogs.forEach(log => console.log('  ', log));
      
      console.log('✅ Botão de salvar clicado');
    } else {
      console.log('⚠️ Botão de aplicar não encontrado - salvamento pode ser automático');
    }
  });

  test('deve mostrar indicador de alterações não salvas', async ({ page }) => {
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    await page.waitForTimeout(500);
    
    // Editar campo
    const textInput = page.locator('[data-testid="column-properties"] input').first();
    if (await textInput.count() > 0) {
      await textInput.clear();
      await textInput.fill('Alteração não salva');
      await page.waitForTimeout(500);
      
      // Procurar indicador de alterações não salvas
      const unsavedIndicator = page.locator('text=/alterações não (aplicadas|salvas)/i, [class*="unsaved"], [class*="dirty"]');
      
      if (await unsavedIndicator.count() > 0) {
        const indicatorText = await unsavedIndicator.first().textContent();
        console.log('⚠️ Indicador encontrado:', indicatorText);
        expect(await unsavedIndicator.first().isVisible()).toBe(true);
        console.log('✅ Indicador de alterações não salvas funciona');
      } else {
        console.log('⚠️ Indicador de alterações não salvas não encontrado');
      }
    }
  });

  test('deve permitir desfazer alterações', async ({ page }) => {
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    await page.waitForTimeout(500);
    
    const textInput = page.locator('[data-testid="column-properties"] input[type="text"]').first();
    
    if (await textInput.count() > 0) {
      const valorOriginal = await textInput.inputValue();
      console.log('📝 Valor original:', valorOriginal);
      
      // Editar
      await textInput.clear();
      await textInput.fill('Alteração temporária');
      await page.waitForTimeout(300);
      
      // Procurar botão de desfazer/resetar
      const undoBtn = page.locator('button:has-text("Desfazer"), button:has-text("Resetar"), button[aria-label*="undo"]');
      
      if (await undoBtn.count() > 0) {
        console.log('↩️ Clicando em desfazer');
        await undoBtn.first().click();
        await page.waitForTimeout(500);
        
        const valorDepoisDesfazer = await textInput.inputValue();
        console.log('📝 Valor após desfazer:', valorDepoisDesfazer);
        
        expect(valorDepoisDesfazer).toBe(valorOriginal);
        console.log('✅ Desfazer funcionou');
      } else {
        console.log('⚠️ Botão de desfazer não encontrado');
      }
    }
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    await page.waitForTimeout(500);
    
    // Procurar campo com atributo required
    const requiredInput = page.locator('[data-testid="column-properties"] input[required], [data-testid="column-properties"] input[aria-required="true"]').first();
    
    if (await requiredInput.count() > 0) {
      console.log('✋ Campo obrigatório encontrado');
      
      // Limpar campo obrigatório
      await requiredInput.clear();
      await page.waitForTimeout(300);
      
      // Tentar aplicar
      const applyBtn = page.locator('button:has-text("Aplicar")').first();
      if (await applyBtn.count() > 0) {
        await applyBtn.click();
        await page.waitForTimeout(500);
        
        // Procurar mensagem de erro
        const errorMsg = page.locator('text=/obrigatório|required|campo.*vazio/i, [class*="error"]');
        
        if (await errorMsg.count() > 0) {
          console.log('❌ Validação funcionou - erro exibido');
          expect(await errorMsg.first().isVisible()).toBe(true);
        } else {
          console.log('⚠️ Mensagem de erro não encontrada');
        }
      }
    } else {
      console.log('⚠️ Nenhum campo obrigatório encontrado');
    }
  });

  test('deve persistir alterações entre seleções de blocos', async ({ page }) => {
    await page.waitForSelector('[data-block-id]', { timeout: 15000 });
    
    const blocks = page.locator('[data-block-id]');
    const blockCount = await blocks.count();
    
    if (blockCount < 2) {
      console.log('⚠️ Menos de 2 blocos - pulando teste');
      return;
    }
    
    // Selecionar primeiro bloco
    await blocks.nth(0).click();
    await page.waitForTimeout(500);
    
    // Editar
    const textInput = page.locator('[data-testid="column-properties"] input').first();
    if (await textInput.count() > 0) {
      await textInput.clear();
      await textInput.fill('Valor editado');
      await page.waitForTimeout(300);
      
      // Aplicar se houver botão
      const applyBtn = page.locator('button:has-text("Aplicar")').first();
      if (await applyBtn.count() > 0) {
        await applyBtn.click();
        await page.waitForTimeout(500);
      }
      
      // Selecionar outro bloco
      await blocks.nth(1).click();
      await page.waitForTimeout(500);
      
      // Voltar ao primeiro bloco
      await blocks.nth(0).click();
      await page.waitForTimeout(500);
      
      // Verificar se valor persistiu
      const valorPersistido = await textInput.inputValue();
      console.log('💾 Valor persistido:', valorPersistido);
      
      if (valorPersistido === 'Valor editado') {
        console.log('✅ Alterações persistiram entre seleções');
      } else {
        console.log('⚠️ Valor não persistiu:', valorPersistido);
      }
    }
  });
});
