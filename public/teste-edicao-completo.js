/**
 * 🧪 TESTE COMPLETO DE EDIÇÃO DO PROPERTIES PANEL
 * 
 * Execute este script no console do browser para testar:
 * 1. Seleção de bloco
 * 2. Edição de propriedades
 * 3. Estado isDirty
 * 4. Botão Save
 * 5. Callbacks e handlers
 * 6. Modal JSON
 * 7. Error handling
 */

(async function testeEdicaoCompleto() {
  console.clear();
  console.log('🧪 ========================================');
  console.log('🧪 TESTE COMPLETO DE EDIÇÃO - Properties Panel');
  console.log('🧪 ========================================\n');

  // ============================================
  // ETAPA 1: Verificar estrutura do DOM
  // ============================================
  console.log('📋 ETAPA 1: Verificando estrutura do DOM...');
  
  const propertiesWrapper = document.querySelector('[data-testid="column-properties"]');
  console.log('✓ Wrapper Properties Column:', propertiesWrapper ? '✅ Encontrado' : '❌ NÃO encontrado');
  
  const propertiesPanel = document.querySelector('.w-80');
  console.log('✓ Properties Panel (w-80):', propertiesPanel ? '✅ Encontrado' : '❌ NÃO encontrado');
  
  const tabsContainer = propertiesWrapper?.querySelector('[role="tablist"]');
  console.log('✓ Tabs Container:', tabsContainer ? '✅ Encontrado' : '❌ NÃO encontrado');
  
  if (tabsContainer) {
    const tabs = Array.from(tabsContainer.querySelectorAll('[role="tab"]'));
    console.log('  └─ Tabs disponíveis:', tabs.map(t => t.textContent?.trim()));
    const activeTab = tabsContainer.querySelector('[data-state="active"]');
    console.log('  └─ Tab ativa:', activeTab?.textContent?.trim() || 'Nenhuma');
  }
  
  console.log('');

  // ============================================
  // ETAPA 2: Verificar blocos no canvas
  // ============================================
  console.log('📋 ETAPA 2: Verificando blocos no canvas...');
  
  const canvasBlocks = document.querySelectorAll('[data-block-id]');
  console.log('✓ Blocos no canvas:', canvasBlocks.length);
  
  if (canvasBlocks.length > 0) {
    const blockIds = Array.from(canvasBlocks).map(b => b.getAttribute('data-block-id'));
    console.log('  └─ IDs:', blockIds.slice(0, 5).join(', '), blockIds.length > 5 ? `... (+${blockIds.length - 5})` : '');
  }
  
  console.log('');

  // ============================================
  // ETAPA 3: Simular seleção de bloco
  // ============================================
  console.log('📋 ETAPA 3: Simulando seleção de bloco...');
  
  let selectedBlock = null;
  if (canvasBlocks.length > 0) {
    const firstBlock = canvasBlocks[0];
    console.log('✓ Clicando no primeiro bloco:', firstBlock.getAttribute('data-block-id'));
    firstBlock.click();
    
    // Aguardar render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verificar se painel foi atualizado
    const headerTitle = propertiesPanel?.querySelector('h3');
    console.log('✓ Título do painel:', headerTitle?.textContent || 'Nenhum');
    
    selectedBlock = firstBlock;
  } else {
    console.log('❌ Nenhum bloco disponível para selecionar');
  }
  
  console.log('');

  // ============================================
  // ETAPA 4: Verificar campos de edição
  // ============================================
  console.log('📋 ETAPA 4: Verificando campos de edição...');
  
  const inputs = propertiesPanel?.querySelectorAll('input[type="text"], input[type="number"]');
  const textareas = propertiesPanel?.querySelectorAll('textarea');
  const switches = propertiesPanel?.querySelectorAll('[role="switch"]');
  const selects = propertiesPanel?.querySelectorAll('select, [role="combobox"]');
  
  console.log('✓ Inputs:', inputs?.length || 0);
  console.log('✓ Textareas:', textareas?.length || 0);
  console.log('✓ Switches:', switches?.length || 0);
  console.log('✓ Selects/Comboboxes:', selects?.length || 0);
  
  const totalFields = (inputs?.length || 0) + (textareas?.length || 0) + (switches?.length || 0) + (selects?.length || 0);
  console.log('✓ Total de campos editáveis:', totalFields);
  
  if (totalFields === 0) {
    console.log('⚠️ ALERTA: Nenhum campo editável encontrado!');
    console.log('   Possíveis causas:');
    console.log('   - Bloco não selecionado');
    console.log('   - Schema não carregado');
    console.log('   - DynamicPropertyControls não renderizou');
  }
  
  console.log('');

  // ============================================
  // ETAPA 5: Simular edição
  // ============================================
  console.log('📋 ETAPA 5: Simulando edição...');
  
  if (inputs && inputs.length > 0) {
    const firstInput = inputs[0];
    const originalValue = firstInput.value;
    const newValue = originalValue + '_EDITADO';
    
    console.log('✓ Campo selecionado:', firstInput.name || firstInput.id || 'sem nome');
    console.log('  └─ Valor original:', originalValue);
    console.log('  └─ Novo valor:', newValue);
    
    // Simular mudança
    firstInput.value = newValue;
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    firstInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log('✓ Eventos disparados: input, change');
    
    // Aguardar atualização de estado
    await new Promise(resolve => setTimeout(resolve, 300));
  } else {
    console.log('❌ Nenhum input disponível para editar');
  }
  
  console.log('');

  // ============================================
  // ETAPA 6: Verificar estado isDirty
  // ============================================
  console.log('📋 ETAPA 6: Verificando estado isDirty...');
  
  const dirtyIndicator = propertiesPanel?.querySelector('[class*="dirty"], .text-yellow-600, .text-orange-600');
  console.log('✓ Indicador visual de edição:', dirtyIndicator ? '✅ Encontrado' : '❌ NÃO encontrado');
  
  if (dirtyIndicator) {
    console.log('  └─ Classe:', dirtyIndicator.className);
    console.log('  └─ Texto:', dirtyIndicator.textContent?.trim());
  }
  
  console.log('');

  // ============================================
  // ETAPA 7: Verificar botões de ação
  // ============================================
  console.log('📋 ETAPA 7: Verificando botões de ação...');
  
  const saveButton = Array.from(propertiesPanel?.querySelectorAll('button') || [])
    .find(b => b.textContent?.includes('Salvar') || b.textContent?.includes('Save'));
  
  const resetButton = Array.from(propertiesPanel?.querySelectorAll('button') || [])
    .find(b => b.textContent?.includes('Cancelar') || b.textContent?.includes('Reset'));
  
  const jsonButton = Array.from(propertiesPanel?.querySelectorAll('button') || [])
    .find(b => b.textContent?.includes('JSON') || b.textContent?.includes('Avançado'));
  
  console.log('✓ Botão Salvar:', saveButton ? '✅ Encontrado' : '❌ NÃO encontrado');
  if (saveButton) {
    console.log('  └─ Disabled:', saveButton.disabled);
    console.log('  └─ Classe:', saveButton.className);
  }
  
  console.log('✓ Botão Cancelar:', resetButton ? '✅ Encontrado' : '❌ NÃO encontrado');
  if (resetButton) {
    console.log('  └─ Disabled:', resetButton.disabled);
  }
  
  console.log('✓ Botão JSON (Avançado):', jsonButton ? '✅ Encontrado' : '❌ NÃO encontrado');
  
  console.log('');

  // ============================================
  // ETAPA 8: Testar salvamento
  // ============================================
  console.log('📋 ETAPA 8: Testando salvamento...');
  
  if (saveButton && !saveButton.disabled) {
    console.log('✓ Clicando no botão Salvar...');
    
    // Capturar logs do console
    const originalLog = console.log;
    const logs = [];
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    saveButton.click();
    
    // Aguardar processamento
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Restaurar console
    console.log = originalLog;
    
    // Verificar logs de sucesso/erro
    const successLogs = logs.filter(l => l.includes('✓') || l.includes('✅') || l.includes('sucesso'));
    const errorLogs = logs.filter(l => l.includes('❌') || l.includes('erro') || l.includes('error'));
    
    console.log('  └─ Logs de sucesso:', successLogs.length);
    console.log('  └─ Logs de erro:', errorLogs.length);
    
    if (errorLogs.length > 0) {
      console.log('  └─ Erros capturados:');
      errorLogs.forEach(log => console.log('     ', log));
    }
    
    // Verificar se alert de erro apareceu
    const errorAlert = propertiesPanel?.querySelector('[role="alert"], .alert-destructive');
    console.log('✓ Alert de erro visível:', errorAlert ? '❌ SIM (problema!)' : '✅ NÃO');
    
    if (errorAlert) {
      console.log('  └─ Mensagem:', errorAlert.textContent?.trim());
    }
  } else {
    console.log('⚠️ Botão Salvar não está disponível ou está desabilitado');
  }
  
  console.log('');

  // ============================================
  // ETAPA 9: Testar modal JSON
  // ============================================
  console.log('📋 ETAPA 9: Testando modal JSON...');
  
  if (jsonButton) {
    console.log('✓ Clicando no botão JSON Avançado...');
    jsonButton.click();
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const modal = document.querySelector('[role="dialog"]');
    console.log('✓ Modal aberto:', modal ? '✅ SIM' : '❌ NÃO');
    
    if (modal) {
      const jsonContent = modal.querySelector('pre');
      console.log('  └─ JSON exibido:', jsonContent ? '✅ SIM' : '❌ NÃO');
      
      if (jsonContent) {
        const jsonText = jsonContent.textContent || '';
        try {
          const parsed = JSON.parse(jsonText);
          console.log('  └─ JSON válido:', '✅ SIM');
          console.log('  └─ Propriedades:', Object.keys(parsed).join(', '));
        } catch (e) {
          console.log('  └─ JSON válido:', '❌ NÃO - Parse error');
        }
      }
      
      const copyButton = Array.from(modal.querySelectorAll('button'))
        .find(b => b.textContent?.includes('Copiar'));
      console.log('  └─ Botão Copiar:', copyButton ? '✅ Encontrado' : '❌ NÃO encontrado');
      
      // Fechar modal
      const closeButton = modal.querySelector('[aria-label="Close"]') || 
                         Array.from(modal.querySelectorAll('button')).find(b => b.textContent?.includes('Fechar'));
      if (closeButton) {
        closeButton.click();
      }
    }
  } else {
    console.log('⚠️ Botão JSON não encontrado');
  }
  
  console.log('');

  // ============================================
  // ETAPA 10: Verificar callbacks e handlers
  // ============================================
  console.log('📋 ETAPA 10: Verificando callbacks React...');
  
  // Verificar se componente está montado com Fiber
  const fiberKey = Object.keys(propertiesPanel || {}).find(k => k.startsWith('__react'));
  console.log('✓ React Fiber presente:', fiberKey ? '✅ SIM' : '❌ NÃO');
  
  if (fiberKey && propertiesPanel) {
    const fiber = propertiesPanel[fiberKey];
    console.log('  └─ Fiber type:', fiber?.type?.name || fiber?.elementType?.name || 'unknown');
    
    // Verificar props
    const props = fiber?.memoizedProps || fiber?.pendingProps;
    if (props) {
      console.log('  └─ Props disponíveis:', Object.keys(props).join(', '));
      console.log('  └─ onBlockUpdate:', typeof props.onBlockUpdate === 'function' ? '✅ Function' : '❌ NOT a function');
      console.log('  └─ selectedBlock:', props.selectedBlock ? '✅ Presente' : '❌ Ausente');
    }
  }
  
  console.log('');

  // ============================================
  // RESUMO FINAL
  // ============================================
  console.log('🎯 ========================================');
  console.log('🎯 RESUMO DO TESTE');
  console.log('🎯 ========================================');
  
  const results = {
    'DOM Estrutura': propertiesPanel ? '✅' : '❌',
    'Blocos Canvas': canvasBlocks.length > 0 ? '✅' : '❌',
    'Campos Edição': totalFields > 0 ? '✅' : '❌',
    'Botão Salvar': saveButton ? '✅' : '❌',
    'Botão JSON': jsonButton ? '✅' : '❌',
    'React Fiber': fiberKey ? '✅' : '❌'
  };
  
  Object.entries(results).forEach(([test, status]) => {
    console.log(`${status} ${test}`);
  });
  
  const failedCount = Object.values(results).filter(v => v === '❌').length;
  
  console.log('');
  if (failedCount === 0) {
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('   Sistema parece estar funcionando corretamente.');
  } else {
    console.log(`⚠️ ${failedCount} TESTE(S) FALHARAM`);
    console.log('   Revise os itens marcados com ❌ acima.');
  }
  
  console.log('');
  console.log('💡 Próximos passos:');
  console.log('   1. Se tudo passou: teste manualmente editando um bloco');
  console.log('   2. Se algo falhou: revise a implementação do item específico');
  console.log('   3. Monitore o console para logs 🎛️, 🔍, 💾 durante edição manual');
  
})();
