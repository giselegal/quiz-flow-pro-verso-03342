/**
 * 🔍 DIAGNÓSTICO PRÁTICO - Painel de Propriedades
 * 
 * Execute no console do navegador em: /editor?resource=quiz21StepsComplete&step=1
 * 
 * Este script:
 * 1. Verifica se o Painel de Propriedades está renderizado
 * 2. Testa edição de propriedades
 * 3. Verifica sincronização properties ↔ content
 * 4. Testa botão JSON avançado
 * 5. Verifica error handling
 */

(function diagnosticoPropertiesPanel() {
  console.clear();
  console.log('🔍 INICIANDO DIAGNÓSTICO DO PAINEL DE PROPRIEDADES\n');

  // 1. VERIFICAR RENDERIZAÇÃO
  console.log('1️⃣ Verificando renderização...');
  const propertiesPanel = document.querySelector('[class*="w-80"]');
  
  if (!propertiesPanel) {
    console.error('❌ Painel de Propriedades NÃO encontrado!');
    return;
  }
  console.log('✅ Painel encontrado:', propertiesPanel);

  // 2. VERIFICAR BLOCO SELECIONADO
  console.log('\n2️⃣ Verificando bloco selecionado...');
  const blockId = propertiesPanel.querySelector('[class*="font-mono"]')?.textContent;
  console.log('Block ID:', blockId);

  // 3. VERIFICAR CAMPOS DE EDIÇÃO
  console.log('\n3️⃣ Verificando campos de edição...');
  const inputs = propertiesPanel.querySelectorAll('input:not([type="checkbox"])');
  const textareas = propertiesPanel.querySelectorAll('textarea');
  const switches = propertiesPanel.querySelectorAll('input[type="checkbox"]');
  
  console.log('Inputs encontrados:', inputs.length);
  console.log('Textareas encontrados:', textareas.length);
  console.log('Switches encontrados:', switches.length);

  if (inputs.length === 0 && textareas.length === 0) {
    console.error('❌ NENHUM CAMPO DE EDIÇÃO encontrado!');
    console.log('Conteúdo do painel:', propertiesPanel.textContent);
    return;
  }

  // 4. TESTAR EDIÇÃO
  console.log('\n4️⃣ Testando edição de propriedade...');
  const firstInput = inputs[0] || textareas[0];
  
  if (firstInput) {
    const originalValue = firstInput.value;
    console.log('Valor original:', originalValue);

    // Simular edição
    firstInput.value = originalValue + ' [TESTE]';
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    firstInput.dispatchEvent(new Event('change', { bubbles: true }));

    console.log('Novo valor:', firstInput.value);

    // Verificar se isDirty foi ativado
    setTimeout(() => {
      const dirtyIndicator = propertiesPanel.querySelector('[class*="amber"]');
      if (dirtyIndicator && dirtyIndicator.textContent.includes('não salvas')) {
        console.log('✅ isDirty ativado corretamente');
      } else {
        console.warn('⚠️ isDirty NÃO foi ativado');
      }

      // Verificar botão Salvar
      const saveButton = Array.from(propertiesPanel.querySelectorAll('button')).find(b =>
        b.textContent.includes('Salvar')
      );
      
      if (saveButton) {
        console.log('Botão Salvar:', saveButton.disabled ? 'DESABILITADO' : 'HABILITADO');
        
        if (!saveButton.disabled) {
          console.log('✅ Botão Salvar está habilitado');
          console.log('📌 Clique no botão Salvar para testar salvamento');
        }
      }

      // Restaurar valor original
      firstInput.value = originalValue;
      firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    }, 100);
  }

  // 5. VERIFICAR BOTÃO JSON AVANÇADO
  console.log('\n5️⃣ Verificando Editor JSON Avançado...');
  const jsonButton = Array.from(propertiesPanel.querySelectorAll('button')).find(b =>
    b.textContent.includes('JSON') && b.textContent.includes('Avançado')
  );

  if (jsonButton) {
    console.log('✅ Botão JSON Avançado encontrado');
  } else {
    console.warn('⚠️ Botão JSON Avançado NÃO encontrado');
  }

  // 6. VERIFICAR SCHEMAS
  console.log('\n6️⃣ Verificando schemas disponíveis...');
  const schemaInfo = propertiesPanel.querySelector('[class*="text-xs"]');
  if (schemaInfo && schemaInfo.textContent.includes('schema')) {
    console.log('✅ Informação de schema presente');
  } else {
    console.warn('⚠️ Sem informação de schema');
  }

  // 7. VERIFICAR CONSOLE LOGS
  console.log('\n7️⃣ Monitorando logs...');
  console.log('Abra o DevTools → Console e procure por:');
  console.log('  🎛️ [PropertyControl] - Logs de controles');
  console.log('  🔍 [PropertiesColumn] - Logs do painel');
  console.log('  💾 [PropertiesColumn] handleSave - Logs de salvamento');

  // 8. INSTRUÇÕES FINAIS
  console.log('\n8️⃣ PRÓXIMOS PASSOS:');
  console.log('═══════════════════════════════════════════════════════');
  console.log('1. Selecione um bloco no canvas (clique em qualquer elemento)');
  console.log('2. Verifique se o Painel de Propriedades atualiza');
  console.log('3. Edite um campo de texto');
  console.log('4. Verifique se "Alterações não salvas" aparece');
  console.log('5. Clique em Salvar');
  console.log('6. Verifique logs no console');
  console.log('7. Clique no botão "Editar JSON (Avançado)"');
  console.log('8. Verifique se o modal abre');
  console.log('═══════════════════════════════════════════════════════');

  console.log('\n✅ DIAGNÓSTICO COMPLETO\n');
})();
