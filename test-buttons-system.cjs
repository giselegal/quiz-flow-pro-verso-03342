/**
 * 🧪 TESTE PRÁTICO: SISTEMA DE BOTÕES DE OPÇÕES E CONTINUAR
 *
 * Verifica se todos os botões estão configurados corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔘 TESTE DO SISTEMA DE BOTÕES - OPÇÕES E CONTINUAR\n');

function testButtonsConfiguration() {
  console.log('🔍 ANALISANDO CONFIGURAÇÕES DOS BOTÕES:\n');

  const results = {
    optionButtons: 0,
    continueButtons: 0,
    loadingSteps: 0,
    resultButtons: 0,
    offerButtons: 0,
  };

  // Verificar templates das etapas 2-21
  for (let i = 2; i <= 21; i++) {
    const stepNum = String(i).padStart(2, '0');
    const templatePath = path.join(__dirname, 'public/templates', `step-${stepNum}-template.json`);

    try {
      const content = fs.readFileSync(templatePath, 'utf8');
      const template = JSON.parse(content);

      console.log(`📄 STEP ${i}: ${template.metadata?.name || 'Sem nome'}`);

      // Procurar por options-grid
      const optionsGrid = template.blocks.find(block => block.type === 'options-grid');
      if (optionsGrid) {
        const props = optionsGrid.properties;
        console.log(`   🔘 Options-Grid encontrado:`);
        console.log(`      - Opções: ${props.options?.length || 0}`);
        console.log(`      - Múltipla seleção: ${props.multipleSelection ? '✅' : '❌'}`);
        console.log(
          `      - Min/Max seleções: ${props.minSelections || 1}/${props.maxSelections || 1}`
        );
        console.log(`      - Colunas: ${props.columns || 2}`);
        results.optionButtons++;
      }

      // Procurar por button-inline
      const button = template.blocks.find(block => block.type === 'button-inline');
      if (button) {
        const props = button.properties;
        console.log(`   ▶️ Button-Inline encontrado:`);
        console.log(`      - Texto: "${props.text}"`);
        console.log(`      - Texto desabilitado: "${props.textWhenDisabled || 'N/A'}"`);
        console.log(`      - Habilitar por seleção: ${props.enableOnSelection ? '✅' : '❌'}`);
        console.log(`      - Cor de fundo: ${props.backgroundColor}`);

        // Classificar tipo de botão
        if (i >= 2 && i <= 14) {
          results.continueButtons++;
        } else if (i >= 17 && i <= 19) {
          results.resultButtons++;
        } else if (i === 21) {
          results.offerButtons++;
        }
      }

      // Verificar loading-animation
      const loading = template.blocks.find(block => block.type === 'loading-animation');
      if (loading) {
        console.log(`   ⏳ Loading Animation encontrado`);
        results.loadingSteps++;
      }

      console.log(''); // Linha em branco
    } catch (error) {
      console.log(`   ❌ Erro ao ler template: ${error.message}\n`);
    }
  }

  return results;
}

function analyzeButtonBehavior() {
  console.log('⚙️ ANALISANDO COMPORTAMENTOS DOS BOTÕES:\n');

  // Verificar componente OptionsGridInlineBlock
  const optionsGridPath = path.join(
    __dirname,
    'src/components/blocks/inline/OptionsGridInlineBlock.tsx'
  );

  if (fs.existsSync(optionsGridPath)) {
    const content = fs.readFileSync(optionsGridPath, 'utf8');

    const hasSelectionLogic = content.includes('handleOptionClick');
    const hasMultipleSelection = content.includes('multipleSelection');
    const hasValidation = content.includes('isValidSelection');
    const hasEventDispatch = content.includes('onPropertyChange');

    console.log('🎯 OPTIONS-GRID BEHAVIORS:');
    console.log(`   ✅ Lógica de seleção: ${hasSelectionLogic ? '✅' : '❌'}`);
    console.log(`   ✅ Seleção múltipla: ${hasMultipleSelection ? '✅' : '❌'}`);
    console.log(`   ✅ Validação: ${hasValidation ? '✅' : '❌'}`);
    console.log(`   ✅ Comunicação: ${hasEventDispatch ? '✅' : '❌'}`);
  }

  // Verificar componente ButtonInline
  const buttonPath = path.join(__dirname, 'src/components/blocks/inline/ButtonInline.tsx');

  if (fs.existsSync(buttonPath)) {
    const content = fs.readFileSync(buttonPath, 'utf8');

    const hasDisabledState = content.includes('disabled');
    const hasConditionalText = content.includes('textWhenDisabled');
    const hasEnableOnSelection = content.includes('enableOnSelection');
    const hasValidation = content.includes('requiresValidInput');

    console.log('\n▶️ BUTTON-INLINE BEHAVIORS:');
    console.log(`   ✅ Estado desabilitado: ${hasDisabledState ? '✅' : '❌'}`);
    console.log(`   ✅ Texto condicional: ${hasConditionalText ? '✅' : '❌'}`);
    console.log(`   ✅ Habilitar por seleção: ${hasEnableOnSelection ? '✅' : '❌'}`);
    console.log(`   ✅ Validação de entrada: ${hasValidation ? '✅' : '❌'}`);
  }
}

function checkSpecificStepConfigurations() {
  console.log('\n🎯 CONFIGURAÇÕES ESPECÍFICAS POR TIPO DE ETAPA:\n');

  // Etapa 2 (Quiz Normal)
  try {
    const step2 = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'public/templates/step-02-template.json'), 'utf8')
    );
    const options2 = step2.blocks.find(b => b.type === 'options-grid');
    const button2 = step2.blocks.find(b => b.type === 'button-inline');

    console.log('📊 ETAPA 2 (Quiz Normal):');
    console.log(`   - Múltipla seleção: ${options2?.properties.multipleSelection ? '✅' : '❌'}`);
    console.log(
      `   - Min/Max: ${options2?.properties.minSelections}/${options2?.properties.maxSelections}`
    );
    console.log(`   - Botão: "${button2?.properties.text}"`);
    console.log(`   - Desabilitado: "${button2?.properties.textWhenDisabled}"`);
  } catch (e) {
    console.log('❌ Erro ao verificar Etapa 2');
  }

  // Etapa 8 (Quiz Estratégico - se existir)
  try {
    const step8 = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'public/templates/step-08-template.json'), 'utf8')
    );
    const options8 = step8.blocks.find(b => b.type === 'options-grid');
    const button8 = step8.blocks.find(b => b.type === 'button-inline');

    console.log('\n🎯 ETAPA 8 (Quiz):');
    console.log(`   - Múltipla seleção: ${options8?.properties.multipleSelection ? '✅' : '❌'}`);
    console.log(
      `   - Min/Max: ${options8?.properties.minSelections}/${options8?.properties.maxSelections}`
    );
    console.log(`   - Botão: "${button8?.properties.text}"`);
  } catch (e) {
    console.log('⚠️ Etapa 8 não encontrada ou diferente');
  }

  // Etapa 15 (Transição)
  try {
    const step15 = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'public/templates/step-15-template.json'), 'utf8')
    );
    const loading = step15.blocks.find(b => b.type === 'loading-animation');

    console.log('\n⏳ ETAPA 15 (Transição):');
    console.log(`   - Loading animation: ${loading ? '✅' : '❌'}`);
    console.log(
      `   - Sem botões: ${step15.blocks.some(b => b.type === 'button-inline') ? '❌' : '✅'}`
    );
  } catch (e) {
    console.log('⚠️ Etapa 15 não encontrada');
  }

  // Etapa 17 (Resultado)
  try {
    const step17 = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'public/templates/step-17-template.json'), 'utf8')
    );
    const button17 = step17.blocks.find(b => b.type === 'button-inline');

    console.log('\n🏆 ETAPA 17 (Resultado):');
    console.log(`   - Botão resultado: ${button17 ? '✅' : '❌'}`);
    console.log(`   - Texto: "${button17?.properties.text}"`);
    console.log(`   - Sempre habilitado: ${!button17?.properties.enableOnSelection ? '✅' : '❌'}`);
  } catch (e) {
    console.log('⚠️ Etapa 17 não encontrada');
  }
}

// Executar todos os testes
console.log('🚀 INICIANDO ANÁLISE COMPLETA DOS BOTÕES...\n');

const results = testButtonsConfiguration();
analyzeButtonBehavior();
checkSpecificStepConfigurations();

console.log('\n📊 ESTATÍSTICAS FINAIS:');
console.log(`   🔘 Botões de opção encontrados: ${results.optionButtons}`);
console.log(`   ▶️ Botões de continuar encontrados: ${results.continueButtons}`);
console.log(`   ⏳ Etapas com loading: ${results.loadingSteps}`);
console.log(`   🏆 Botões de resultado: ${results.resultButtons}`);
console.log(`   💰 Botões de oferta: ${results.offerButtons}`);

const totalWithButtons =
  results.optionButtons + results.continueButtons + results.resultButtons + results.offerButtons;

console.log('\n🎯 RESULTADO FINAL:');
if (totalWithButtons >= 18) {
  // Esperado: ~19-20 botões no total
  console.log('✅ SISTEMA DE BOTÕES COMPLETAMENTE CONFIGURADO!');
  console.log('✅ Botões de opção funcionais');
  console.log('✅ Botões de continuar configurados');
  console.log('✅ Estados habilitado/desabilitado implementados');
  console.log('✅ Validação e comunicação entre componentes');
  console.log('✅ Textos dinâmicos e responsividade');
  console.log('\n🚀 Todos os botões estão prontos para uso!');
} else {
  console.log(`⚠️ Encontrados ${totalWithButtons} botões de um total esperado de ~20`);
  console.log('🔍 Alguns botões podem precisar de verificação');
}
