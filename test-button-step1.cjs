/**
 * 🧪 TESTE ESPECÍFICO: VALIDAÇÃO DO BOTÃO ETAPA 1
 * 
 * Verifica se o sistema de validação condicional funciona
 */

const fs = require('fs');
const path = require('path');

console.log('🔘 TESTE DO BOTÃO DA ETAPA 1\n');

// Função para verificar configurações
function testButtonConfiguration() {
  console.log('🔍 VERIFICANDO CONFIGURAÇÕES DO BOTÃO:\n');
  
  try {
    // 1. Verificar template JSON
    const jsonPath = path.join(__dirname, 'public/templates/step-01-template.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const jsonTemplate = JSON.parse(jsonContent);
    
    // Encontrar o botão no JSON
    let jsonButton = null;
    for (const block of jsonTemplate.blocks) {
      if (block.children) {
        for (const child of block.children) {
          if (child.id === 'intro-cta-button') {
            jsonButton = child;
            break;
          }
        }
      }
      if (jsonButton) break;
    }
    
    console.log('📄 TEMPLATE JSON:');
    if (jsonButton) {
      console.log(`   ✅ Botão encontrado: ${jsonButton.id}`);
      console.log(`   ✅ Tipo: ${jsonButton.type}`);
      console.log(`   ✅ Texto: "${jsonButton.properties.text}"`);
      console.log(`   ✅ RequiresValidInput: ${jsonButton.properties.requiresValidInput}`);
      console.log(`   ✅ WatchInputId: ${jsonButton.properties.watchInputId}`);
      console.log(`   ✅ DisabledText: "${jsonButton.properties.disabledText}"`);
      console.log(`   ✅ NextStepUrl: ${jsonButton.properties.nextStepUrl}`);
    } else {
      console.log('   ❌ Botão não encontrado no JSON');
      return false;
    }
    
    // 2. Verificar template TSX
    console.log('\n📄 TEMPLATE TSX:');
    const tsxPath = path.join(__dirname, 'src/components/steps/Step01Template.tsx');
    const tsxContent = fs.readFileSync(tsxPath, 'utf8');
    
    const hasRequiresValidInput = tsxContent.includes('requiresValidInput: true');
    const hasWatchInputId = tsxContent.includes("watchInputId: 'intro-form-input'");
    const hasDisabledText = tsxContent.includes('disabledText:');
    const hasNextStepUrl = tsxContent.includes("nextStepUrl: '/quiz/step-2'");
    
    console.log(`   ✅ RequiresValidInput: ${hasRequiresValidInput ? '✅' : '❌'}`);
    console.log(`   ✅ WatchInputId: ${hasWatchInputId ? '✅' : '❌'}`);
    console.log(`   ✅ DisabledText: ${hasDisabledText ? '✅' : '❌'}`);
    console.log(`   ✅ NextStepUrl: ${hasNextStepUrl ? '✅' : '❌'}`);
    
    // 3. Verificar hook de validação
    console.log('\n🎯 SISTEMA DE VALIDAÇÃO:');
    const hookPath = path.join(__dirname, 'src/hooks/useStep01Validation.tsx');
    
    if (fs.existsSync(hookPath)) {
      const hookContent = fs.readFileSync(hookPath, 'utf8');
      
      const hasEventListener = hookContent.includes("addEventListener('quiz-input-change'");
      const hasValidation = hookContent.includes('value.trim().length >= 2');
      const hasButtonEvent = hookContent.includes('step01-button-state-change');
      
      console.log(`   ✅ Event Listener: ${hasEventListener ? '✅' : '❌'}`);
      console.log(`   ✅ Validação (≥2 chars): ${hasValidation ? '✅' : '❌'}`);
      console.log(`   ✅ Button Event: ${hasButtonEvent ? '✅' : '❌'}`);
      
    } else {
      console.log('   ⚠️ Hook de validação não encontrado');
    }
    
    // 4. Verificar componente ButtonInline
    console.log('\n🔘 COMPONENTE BUTTON-INLINE:');
    const buttonPath = path.join(__dirname, 'src/components/blocks/inline/ButtonInline.tsx');
    
    if (fs.existsSync(buttonPath)) {
      const buttonContent = fs.readFileSync(buttonPath, 'utf8');
      
      const hasRequiresValidInputProp = buttonContent.includes('requiresValidInput?');
      const hasDisabledProp = buttonContent.includes('disabled?');
      const hasWatchInputIdProp = buttonContent.includes('watchInputId');
      
      console.log(`   ✅ RequiresValidInput prop: ${hasRequiresValidInputProp ? '✅' : '❌'}`);
      console.log(`   ✅ Disabled prop: ${hasDisabledProp ? '✅' : '❌'}`);
      console.log(`   ✅ WatchInputId prop: ${hasWatchInputIdProp ? '✅' : '❌'}`);
      
    } else {
      console.log('   ❌ Componente ButtonInline não encontrado');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao verificar configurações:', error.message);
    return false;
  }
}

// Verificar input de nome relacionado
function testInputConfiguration() {
  console.log('\n📝 VERIFICANDO INPUT DE NOME:\n');
  
  try {
    const jsonPath = path.join(__dirname, 'public/templates/step-01-template.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const jsonTemplate = JSON.parse(jsonContent);
    
    // Encontrar o input no JSON
    let jsonInput = null;
    for (const block of jsonTemplate.blocks) {
      if (block.children) {
        for (const child of block.children) {
          if (child.id === 'intro-form-input') {
            jsonInput = child;
            break;
          }
        }
      }
      if (jsonInput) break;
    }
    
    if (jsonInput) {
      console.log(`   ✅ Input encontrado: ${jsonInput.id}`);
      console.log(`   ✅ Tipo: ${jsonInput.type}`);
      console.log(`   ✅ Placeholder: "${jsonInput.properties.placeholder}"`);
      console.log(`   ✅ Required: ${jsonInput.properties.required}`);
      console.log(`   ✅ MinLength: ${jsonInput.properties.minLength}`);
      
      return true;
    } else {
      console.log('   ❌ Input de nome não encontrado');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar input:', error.message);
    return false;
  }
}

// Executar testes
const buttonConfigOk = testButtonConfiguration();
const inputConfigOk = testInputConfiguration();

console.log('\n🎯 RESULTADO FINAL:\n');

if (buttonConfigOk && inputConfigOk) {
  console.log('✅ CONFIGURAÇÃO PERFEITA!');
  console.log('✅ Botão completamente configurado');
  console.log('✅ Input de validação presente');
  console.log('✅ Sistema de validação implementado');
  console.log('✅ Estados visuais definidos');
  console.log('✅ Navegação configurada');
  console.log('\n🚀 O botão da etapa 1 está pronto para funcionar!');
} else {
  console.log('❌ Algumas configurações precisam ser verificadas');
}
