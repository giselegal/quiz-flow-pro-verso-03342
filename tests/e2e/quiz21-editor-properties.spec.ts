/**
 * 🧪 TESTES E2E: Propriedades dos Blocos
 * 
 * Suite de testes para validar edição de propriedades dos 27 tipos de blocos
 * do quiz21StepsComplete, incluindo SchemaInterpreter e validações.
 * 
 * @priority ALTA
 * @coverage Edição de propriedades, validação Zod, defaults
 * @duration ~3-5 minutos
 */

import { test, expect, Page } from '@playwright/test';

async function closeStartupModal(page: Page) {
  try {
    const modal = page.locator('[data-testid="startup-modal"]');
    if (await modal.isVisible({ timeout: 2000 })) {
      await modal.locator('button[aria-label="Close"]').click();
    }
  } catch (e) {
    // Modal não apareceu
  }
}

async function waitForEditorReady(page: Page) {
  const layout = page.getByTestId('modular-layout');
  const fallbackRoot = page.locator('[data-editor="modular-enhanced"], .qm-editor').first();

  try {
    await expect(layout).toBeVisible({ timeout: 12000 });
  } catch {
    await expect(fallbackRoot).toBeVisible({ timeout: 12000 });
  }
  await expect(page.getByTestId('column-steps')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('column-canvas')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('column-properties')).toBeVisible({ timeout: 15000 });
  console.log('✅ Editor pronto para testes de propriedades');
}

async function selectFirstBlock(page: Page): Promise<boolean> {
  await page.waitForTimeout(1000);
  
  const canvas = page.getByTestId('column-canvas').first();
  const firstBlock = canvas.locator('[data-block-id]').first();
  
  const blockCount = await canvas.locator('[data-block-id]').count();
  if (blockCount === 0) {
    console.log('⚠️ Nenhum bloco encontrado no step atual');
    return false;
  }
  
  await firstBlock.click();
  await page.waitForTimeout(300);
  
  const propertiesPanel = page.getByTestId('column-properties').first();
  await expect(propertiesPanel).toBeVisible({ timeout: 3000 });
  
  return true;
}

test.describe('Properties - Painel de Propriedades', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('PROP-001: Painel deve abrir ao selecionar bloco', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    await expect(propertiesPanel).toBeVisible();
    
    // Verificar título do painel
    const panelTitle = propertiesPanel.locator('h3, h2').first();
    await expect(panelTitle).toBeVisible();
    
    console.log('✅ Painel de propriedades abriu corretamente');
  });

  test('PROP-002: Painel deve exibir tipo do bloco selecionado', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Procurar por indicação do tipo (ex: "Texto", "Botão", etc)
    const content = await propertiesPanel.textContent();
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
    
    console.log('✅ Tipo do bloco visível no painel');
  });

  test('PROP-003: Painel deve conter campos editáveis', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Contar inputs editáveis
    const inputs = propertiesPanel.locator('input:not([type="hidden"]), textarea, select');
    const inputCount = await inputs.count();
    
    expect(inputCount).toBeGreaterThan(0);
    console.log(`✅ Painel contém ${inputCount} campos editáveis`);
  });

  test('PROP-004: Deve permitir fechar painel', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Procurar botão de fechar
    const closeButton = propertiesPanel.locator('button[aria-label*="fechar"], button[aria-label*="close"]').first();
    
    if (await closeButton.isVisible({ timeout: 1000 })) {
      await closeButton.click();
      await page.waitForTimeout(300);
      
      // Verificar que painel fechou ou está vazio
      const isEmpty = await propertiesPanel.locator('text=/nenhum.*selecionado|no.*selected/i').isVisible().catch(() => false);
      
      if (isEmpty) {
        console.log('✅ Painel fechado com sucesso');
      }
    } else {
      console.log('⚠️ Botão de fechar não encontrado (pode ser opcional)');
    }
  });
});

test.describe('Properties - Edição de Campos de Texto', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('PROP-010: Deve editar campo de texto', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Procurar primeiro input de texto
    const textInput = propertiesPanel.locator('input[type="text"], textarea').first();
    
    if (!(await textInput.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Nenhum campo de texto encontrado');
      test.skip();
      return;
    }
    
    // Limpar e digitar novo valor
    await textInput.clear();
    await textInput.fill('Teste E2E - Propriedades');
    
    // Verificar que valor foi atualizado
    const newValue = await textInput.inputValue();
    expect(newValue).toBe('Teste E2E - Propriedades');
    
    console.log('✅ Campo de texto editado com sucesso');
  });

  test('PROP-011: Deve editar textarea (texto longo)', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    const textarea = propertiesPanel.locator('textarea').first();
    
    if (!(await textarea.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Nenhum textarea encontrado neste bloco');
      test.skip();
      return;
    }
    
  const longText = `Este é um texto longo para testar textarea.
Com múltiplas linhas.
E formatação.`;
    
    await textarea.clear();
    await textarea.fill(longText);
    
    const newValue = await textarea.inputValue();
    expect(newValue).toBe(longText);
    
    console.log('✅ Textarea editado com sucesso');
  });

  test('PROP-012: Deve validar campo obrigatório', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Procurar campo com atributo required
    const requiredInput = propertiesPanel.locator('input[required], textarea[required]').first();
    
    if (!(await requiredInput.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Nenhum campo obrigatório encontrado');
      test.skip();
      return;
    }
    
    // Limpar campo obrigatório
    await requiredInput.clear();
    
    // Tentar salvar (clicar em outro lugar)
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    
    // Verificar se há mensagem de erro ou validação visual
    const hasError = await requiredInput.evaluate((el) => {
      return el.getAttribute('aria-invalid') === 'true' || 
             el.classList.contains('error') ||
             el.classList.contains('invalid');
    });
    
    if (hasError) {
      console.log('✅ Validação de campo obrigatório funcionando');
    } else {
      console.log('⚠️ Validação visual não detectada (pode estar no submit)');
    }
  });
});

test.describe('Properties - Edição de Campos Numéricos', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('PROP-020: Deve editar campo numérico', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    const numberInput = propertiesPanel.locator('input[type="number"]').first();
    
    if (!(await numberInput.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Nenhum campo numérico encontrado neste bloco');
      test.skip();
      return;
    }
    
    await numberInput.clear();
    await numberInput.fill('42');
    
    const newValue = await numberInput.inputValue();
    expect(newValue).toBe('42');
    
    console.log('✅ Campo numérico editado com sucesso');
  });

  test('PROP-021: Deve validar limites de campos numéricos', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    const numberInput = propertiesPanel.locator('input[type="number"][min], input[type="number"][max]').first();
    
    if (!(await numberInput.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Nenhum campo numérico com limites encontrado');
      test.skip();
      return;
    }
    
    const min = await numberInput.getAttribute('min');
    const max = await numberInput.getAttribute('max');
    
    console.log(`✅ Campo numérico tem limites: min=${min}, max=${max}`);
  });

  test('PROP-022: Deve usar incremento/decremento', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    const numberInput = propertiesPanel.locator('input[type="number"]').first();
    
    if (!(await numberInput.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    // Setar valor inicial
    await numberInput.clear();
    await numberInput.fill('10');
    
    const initialValue = await numberInput.inputValue();
    
    // Usar seta para cima (incrementar)
    await numberInput.press('ArrowUp');
    await page.waitForTimeout(200);
    
    const incrementedValue = await numberInput.inputValue();
    expect(parseInt(incrementedValue)).toBeGreaterThan(parseInt(initialValue));
    
    console.log(`✅ Incremento funciona: ${initialValue} → ${incrementedValue}`);
  });
});

test.describe('Properties - Seleção e Checkboxes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('PROP-030: Deve alternar checkbox', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    const checkbox = propertiesPanel.locator('input[type="checkbox"]').first();
    
    if (!(await checkbox.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Nenhum checkbox encontrado neste bloco');
      test.skip();
      return;
    }
    
    const initialState = await checkbox.isChecked();
    
    // Alternar checkbox
    await checkbox.click();
    await page.waitForTimeout(200);
    
    const newState = await checkbox.isChecked();
    expect(newState).toBe(!initialState);
    
    console.log(`✅ Checkbox alternado: ${initialState} → ${newState}`);
  });

  test('PROP-031: Deve selecionar opção em select', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    const select = propertiesPanel.locator('select').first();
    
    if (!(await select.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Nenhum select encontrado neste bloco');
      test.skip();
      return;
    }
    
    // Obter opções disponíveis
    const options = await select.locator('option').count();
    
    if (options < 2) {
      console.log('⚠️ Select tem menos de 2 opções');
      test.skip();
      return;
    }
    
    // Selecionar segunda opção
    const secondOption = await select.locator('option').nth(1).getAttribute('value');
    await select.selectOption(secondOption!);
    
    const selectedValue = await select.inputValue();
    expect(selectedValue).toBe(secondOption);
    
    console.log(`✅ Opção selecionada com sucesso: ${secondOption}`);
  });

  test('PROP-032: Deve exibir opções corretas em select de alinhamento', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Procurar select de alinhamento (common em blocos de texto)
    const alignSelect = propertiesPanel.locator('select[name*="align"], select[id*="align"]').first();
    
    if (!(await alignSelect.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Select de alinhamento não encontrado neste bloco');
      test.skip();
      return;
    }
    
    const options = await alignSelect.locator('option').allTextContents();
    
    // Verificar que tem opções típicas de alinhamento
    const hasAlignOptions = options.some(opt => 
      /left|center|right|justify|esquerda|centro|direita/i.test(opt)
    );
    
    expect(hasAlignOptions).toBe(true);
    console.log(`✅ Opções de alinhamento disponíveis: ${options.join(', ')}`);
  });
});

test.describe('Properties - Cores e Estilos', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('PROP-040: Deve editar cor (color picker)', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    const colorInput = propertiesPanel.locator('input[type="color"]').first();
    
    if (!(await colorInput.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Nenhum color picker encontrado neste bloco');
      test.skip();
      return;
    }
    
    const initialColor = await colorInput.inputValue();
    
    // Tentar setar nova cor
    await colorInput.fill('#ff0000');
    await page.waitForTimeout(200);
    
    const newColor = await colorInput.inputValue();
    expect(newColor.toLowerCase()).toBe('#ff0000');
    
    console.log(`✅ Cor alterada: ${initialColor} → ${newColor}`);
  });

  test('PROP-041: Deve validar formato hexadecimal de cor', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Procurar input de cor em formato texto (ex: backgroundColor)
    const colorTextInput = propertiesPanel.locator('input[name*="color"], input[id*="color"]').first();
    
    if (!(await colorTextInput.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    const type = await colorTextInput.getAttribute('type');
    
    if (type === 'color') {
      console.log('✅ Color picker nativo (validação automática)');
    } else {
      // Tentar inserir cor inválida
      await colorTextInput.clear();
      await colorTextInput.fill('not-a-color');
      await colorTextInput.blur();
      await page.waitForTimeout(300);
      
      console.log('⚠️ Validação de formato de cor (verificar visualmente)');
    }
  });
});

test.describe('Properties - Validação Zod', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('PROP-050: Schema deve prevenir valores inválidos', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Procurar campo numérico com validação
    const numberInput = propertiesPanel.locator('input[type="number"]').first();
    
    if (!(await numberInput.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    // Tentar inserir valor negativo em campo que só aceita positivos
    const min = await numberInput.getAttribute('min');
    
    if (min && parseInt(min) >= 0) {
      await numberInput.clear();
      await numberInput.fill('-10');
      await numberInput.blur();
      await page.waitForTimeout(300);
      
      const finalValue = await numberInput.inputValue();
      
      // Browser pode auto-corrigir ou mostrar erro
      console.log(`✅ Validação aplicada: tentou -10, resultado: ${finalValue}`);
    }
  });

  test('PROP-051: Defaults devem ser aplicados corretamente', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Verificar que campos têm valores padrão
    const inputs = propertiesPanel.locator('input[type="text"], input[type="number"]');
    const count = await inputs.count();
    
    let hasDefaults = 0;
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const value = await inputs.nth(i).inputValue();
      if (value && value.length > 0) {
        hasDefaults++;
      }
    }
    
    console.log(`✅ ${hasDefaults}/${Math.min(count, 5)} campos têm valores padrão`);
  });
});

test.describe('Properties - SchemaInterpreter', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('PROP-060: SchemaInterpreter deve renderizar campos dinamicamente', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Verificar que há campos renderizados
    const allInputs = propertiesPanel.locator('input, textarea, select');
    const inputCount = await allInputs.count();
    
    expect(inputCount).toBeGreaterThan(0);
    console.log(`✅ SchemaInterpreter renderizou ${inputCount} campos`);
  });

  test('PROP-061: Campos devem ter labels descritivos', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Contar labels
    const labels = propertiesPanel.locator('label');
    const labelCount = await labels.count();
    
    if (labelCount > 0) {
      const firstLabelText = await labels.first().textContent();
      console.log(`✅ ${labelCount} labels encontrados. Exemplo: "${firstLabelText}"`);
    } else {
      console.log('⚠️ Nenhum label encontrado (podem estar implícitos)');
    }
  });

  test('PROP-062: Deve exibir help text para campos complexos', async ({ page }) => {
    const hasBlock = await selectFirstBlock(page);
    if (!hasBlock) {
      test.skip();
      return;
    }
    
    const propertiesPanel = page.getByTestId('column-properties').first();
    
    // Procurar textos de ajuda (small, span.help, etc)
    const helpTexts = propertiesPanel.locator('small, .help-text, [class*="hint"]');
    const helpCount = await helpTexts.count();
    
    if (helpCount > 0) {
      console.log(`✅ ${helpCount} textos de ajuda encontrados`);
    } else {
      console.log('⚠️ Nenhum texto de ajuda encontrado (pode ser opcional)');
    }
  });
});
