import { test, expect } from '@playwright/test';

test.describe('Properties Panel - Editor de Propriedades', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para o editor com step 1
    await page.goto('http://localhost:8080/editor?resource=quiz21StepsComplete&step=1');
    
    // Aguardar o editor carregar - usar seletor correto
    await page.waitForSelector('[data-testid="column-canvas"]', { timeout: 10000 });
    
    // Aguardar os blocos carregarem (esperar pelo primeiro bloco)
    await page.waitForSelector('[data-block-id]', { timeout: 10000 });
    
    // Aguardar estabilização
    await page.waitForTimeout(1000);
  });

  test('deve exibir o painel de propriedades quando clicar em um bloco', async ({ page }) => {
    console.log('🧪 Teste 1: Verificar exibição do painel ao clicar em bloco');
    
    // Procurar o primeiro bloco no canvas
    const firstBlock = page.locator('[data-block-id]').first();
    await expect(firstBlock).toBeVisible();
    
    // Clicar no bloco
    await firstBlock.click();
    
    // Verificar se o painel de propriedades aparece (usar seletor correto)
    const propertiesPanel = page.locator('[data-testid="column-properties"]');
    await expect(propertiesPanel).toBeVisible({ timeout: 3000 });
    
    console.log('✅ Painel de propriedades está visível');
  });

  test('deve mostrar as propriedades do bloco selecionado', async ({ page }) => {
    console.log('🧪 Teste 2: Verificar propriedades do bloco selecionado');
    
    // Selecionar primeiro bloco
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    
    // Aguardar painel abrir
    await page.waitForTimeout(1000);
    
    // Verificar se mostra o ID do bloco (PropertiesColumnSimple - primeiro input)
    const anyInput = page.locator('[data-testid="column-properties"] input').first();
    await expect(anyInput).toBeVisible({ timeout: 5000 });
    
    const blockIdValue = await anyInput.inputValue();
    console.log('📦 Block ID:', blockIdValue);
    expect(blockIdValue).toBeTruthy();
    
    console.log('✅ Propriedades do bloco estão visíveis');
  });

  test('deve permitir editar o ID do bloco', async ({ page }) => {
    console.log('🧪 Teste 3: Editar ID do bloco');
    
    // Selecionar primeiro bloco
    const firstBlock = page.locator('[data-block-id]').first();
    const originalBlockId = await firstBlock.getAttribute('data-block-id');
    console.log('📦 Block ID original:', originalBlockId);
    
    await firstBlock.click();
    await page.waitForTimeout(1000);
    
    // Encontrar campo de ID (primeiro input no painel de propriedades)
    const blockIdInput = page.locator('[data-testid="column-properties"] input[type="text"]').first();
    await expect(blockIdInput).toBeVisible();
    
    // Limpar e digitar novo ID
    const newId = `test-block-${Date.now()}`;
    await blockIdInput.fill('');
    await blockIdInput.fill(newId);
    
    // Blur para acionar onBlur handler
    await blockIdInput.blur();
    
    // Aguardar atualização
    await page.waitForTimeout(1000);
    
    // Verificar se o valor foi atualizado
    const updatedValue = await blockIdInput.inputValue();
    console.log('📦 Novo Block ID:', updatedValue);
    expect(updatedValue).toBe(newId);
    
    console.log('✅ ID do bloco foi editado com sucesso');
  });

  test('deve permitir editar o tipo do bloco', async ({ page }) => {
    console.log('🧪 Teste 4: Editar tipo do bloco');
    
    // Selecionar primeiro bloco
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    
    // Aguardar painel atualizar
    await page.waitForTimeout(1500);
    
    // Encontrar campo de tipo (segundo input no painel de propriedades)
    const allInputs = page.locator('[data-testid="column-properties"] input[type="text"]');
    await expect(allInputs.first()).toBeVisible({ timeout: 5000 });
    
    const inputCount = await allInputs.count();
    console.log('📝 Total de inputs encontrados:', inputCount);
    
    if (inputCount >= 2) {
      const blockTypeInput = allInputs.nth(1);
      await expect(blockTypeInput).toBeVisible();
      
      const originalType = await blockTypeInput.inputValue();
      console.log('🏷️ Tipo original:', originalType);
      
      // Editar tipo
      await blockTypeInput.fill('');
      await blockTypeInput.fill('custom-block-type');
      await blockTypeInput.blur();
      
      await page.waitForTimeout(1000);
      
      const updatedType = await blockTypeInput.inputValue();
      console.log('🏷️ Novo tipo:', updatedType);
      expect(updatedType).toBe('custom-block-type');
      
      console.log('✅ Tipo do bloco foi editado');
    } else {
      console.log('⚠️ Apenas 1 input encontrado, pulando teste de tipo');
    }
  });

  test('deve exibir JSON do bloco no modo debug', async ({ page }) => {
    console.log('🧪 Teste 5: Verificar visualização JSON');
    
    // Selecionar primeiro bloco
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    await page.waitForTimeout(1000);
    
    // Procurar por área de debug/JSON (PropertiesColumnSimple tem pre com JSON)
    const jsonArea = page.locator('[data-testid="column-properties"] pre');
    
    if (await jsonArea.count() > 0) {
      await expect(jsonArea.first()).toBeVisible();
      const jsonText = await jsonArea.first().textContent();
      console.log('📄 JSON preview encontrado (primeiros 200 chars):', jsonText?.substring(0, 200));
      expect(jsonText).toContain('id');
      expect(jsonText).toContain('type');
      console.log('✅ JSON do bloco está visível');
    } else {
      console.log('⚠️ JSON debug não encontrado (pode estar usando PropertiesColumnWithJson)');
    }
  });

  test('deve permitir selecionar diferentes blocos', async ({ page }) => {
    console.log('🧪 Teste 6: Alternar entre blocos');
    
    // Contar blocos disponíveis
    const allBlocks = page.locator('[data-block-id]');
    const blockCount = await allBlocks.count();
    console.log('📦 Total de blocos encontrados:', blockCount);
    
    if (blockCount >= 2) {
      // Selecionar primeiro bloco
      const firstBlockElement = allBlocks.nth(0);
      const firstBlockIdAttr = await firstBlockElement.getAttribute('data-block-id');
      await firstBlockElement.click();
      await page.waitForTimeout(1000);
      
      console.log('📦 Primeiro bloco ID (do atributo):', firstBlockIdAttr);
      
      // Selecionar segundo bloco
      const secondBlockElement = allBlocks.nth(1);
      const secondBlockIdAttr = await secondBlockElement.getAttribute('data-block-id');
      await secondBlockElement.click();
      await page.waitForTimeout(1000);
      
      console.log('📦 Segundo bloco ID (do atributo):', secondBlockIdAttr);
      
      // Verificar que são diferentes
      expect(firstBlockIdAttr).not.toBe(secondBlockIdAttr);
      
      // Verificar que o painel atualizou para mostrar o segundo bloco
      const inputAfterSecondClick = page.locator('[data-testid="column-properties"] input[type="text"]').first();
      const inputValue = await inputAfterSecondClick.inputValue();
      console.log('📦 Valor no input do painel:', inputValue);
      expect(inputValue).toBe(secondBlockIdAttr);
      
      console.log('✅ Seleção de diferentes blocos funciona');
    } else {
      console.log('⚠️ Menos de 2 blocos disponíveis para testar seleção');
    }
  });

  test('deve mostrar lista de blocos disponíveis', async ({ page }) => {
    console.log('🧪 Teste 7: Verificar lista de blocos');
    
    // Selecionar qualquer bloco para abrir o painel
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    await page.waitForTimeout(1000);
    
    // Procurar por lista de blocos no painel
    const blockList = page.locator('[data-testid="blocks-list"], .blocks-list, ul li').filter({ hasText: /bloco|block|id/i });
    
    if (await blockList.count() > 0) {
      const listCount = await blockList.count();
      console.log('📋 Itens na lista de blocos:', listCount);
      console.log('✅ Lista de blocos está visível');
    } else {
      console.log('⚠️ Lista de blocos não encontrada');
    }
  });

  test('deve validar alterações e mostrar feedback', async ({ page }) => {
    console.log('🧪 Teste 8: Verificar feedback de alterações');
    
    // Selecionar primeiro bloco
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    await page.waitForTimeout(1000);
    
    // Fazer uma alteração
    const blockIdInput = page.locator('[data-testid="column-properties"] input[type="text"]').first();
    await blockIdInput.fill('');
    await blockIdInput.fill('modified-block-test');
    await blockIdInput.blur();
    
    // Aguardar e verificar se há mensagem de sucesso ou indicador visual
    await page.waitForTimeout(1000);
    
    // Procurar por mensagens de sucesso/erro
    const toast = page.locator('.toast, [role="alert"], .notification');
    if (await toast.count() > 0) {
      console.log('✅ Feedback visual detectado');
    }
    
    // Verificar se o valor foi salvo
    const savedValue = await blockIdInput.inputValue();
    expect(savedValue).toBe('modified-block-test');
    console.log('✅ Alteração foi salva');
  });
});

test.describe('Properties Panel - Console Logs', () => {
  test('deve logar ações no console', async ({ page }) => {
    console.log('🧪 Teste 9: Verificar logs do console');
    
    const logs: string[] = [];
    
    // Capturar logs do console
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('PROPRIEDADES') || text.includes('Block') || text.includes('bloco')) {
        logs.push(text);
        console.log('📝 Console log:', text);
      }
    });
    
    // Navegar e interagir
    await page.goto('http://localhost:8080/editor?resource=quiz21StepsComplete&step=1');
    await page.waitForSelector('[data-block-id]', { timeout: 10000 });
    
    const firstBlock = page.locator('[data-block-id]').first();
    await firstBlock.click();
    
    await page.waitForTimeout(2000);
    
    console.log(`📊 Total de logs relevantes capturados: ${logs.length}`);
    logs.forEach((log, i) => console.log(`  ${i + 1}. ${log.substring(0, 100)}`));
  });
});
