/**
 * 🔧 SCRIPT DE CORREÇÃO: CONFIGURAÇÕES DE BOTÕES E AUTO-AVANÇO
 * 
 * Regras:
 * - Etapas 2-11: 3 seleções obrigatórias + auto-avanço
 * - Etapas 13-17: 1 seleção obrigatória + avanço manual
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 CORRIGINDO CONFIGURAÇÕES DE BOTÕES E AUTO-AVANÇO\n');

// Configurações por tipo de etapa
const STEP_CONFIGS = {
  // Etapas 2-11: Quiz normal com múltipla seleção
  quiz_normal: {
    range: [2, 11],
    multipleSelection: true,
    minSelections: 3,
    maxSelections: 3,
    autoAdvance: true,
    autoAdvanceDelay: 1500,
    buttonText: "Próxima Questão →",
    enableOnSelection: true,
    validationMessage: "Selecione 3 opções para continuar"
  },
  
  // Etapa 12: Transição (se existir)
  transition: {
    range: [12, 12],
    // Sem configuração específica - manter como está
  },
  
  // Etapas 13-17: Quiz estratégico com seleção única
  quiz_strategic: {
    range: [13, 17],
    multipleSelection: false,
    minSelections: 1,
    maxSelections: 1,
    autoAdvance: false,
    autoAdvanceDelay: 0,
    buttonText: "Continuar →",
    enableOnSelection: true,
    validationMessage: "Selecione uma opção para continuar"
  }
};

function updateJSONTemplate(stepNum, config) {
  const stepNumStr = String(stepNum).padStart(2, '0');
  const templatePath = path.join(__dirname, 'public/templates', `step-${stepNumStr}-template.json`);
  
  if (!fs.existsSync(templatePath)) {
    console.log(`⚠️  Template JSON não encontrado: step-${stepNumStr}-template.json`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(templatePath, 'utf8');
    const template = JSON.parse(content);
    
    console.log(`📝 Atualizando JSON: step-${stepNumStr}-template.json`);
    
    // Atualizar options-grid
    const optionsGrid = template.blocks.find(block => block.type === 'options-grid');
    if (optionsGrid) {
      const props = optionsGrid.properties;
      
      // Configurar seleções
      if (config.multipleSelection !== undefined) props.multipleSelection = config.multipleSelection;
      if (config.minSelections !== undefined) props.minSelections = config.minSelections;
      if (config.maxSelections !== undefined) props.maxSelections = config.maxSelections;
      if (config.validationMessage !== undefined) props.validationMessage = config.validationMessage;
      
      // Configurar auto-avanço
      if (config.autoAdvance !== undefined) {
        props.autoAdvance = config.autoAdvance;
        props.autoAdvanceOnComplete = config.autoAdvance;
        props.autoAdvanceDelay = config.autoAdvanceDelay || 0;
      }
      
      console.log(`   🔘 Options-Grid: ${config.multipleSelection ? 'múltipla' : 'única'} (${config.minSelections}-${config.maxSelections})`);
      console.log(`   ⚡ Auto-avanço: ${config.autoAdvance ? `✅ (${config.autoAdvanceDelay}ms)` : '❌ manual'}`);
    }
    
    // Atualizar button-inline
    const button = template.blocks.find(block => block.type === 'button-inline');
    if (button) {
      const props = button.properties;
      
      if (config.buttonText) props.text = config.buttonText;
      if (config.enableOnSelection !== undefined) {
        props.enableOnSelection = config.enableOnSelection;
        props.requiresValidSelection = config.enableOnSelection;
      }
      
      // Texto quando desabilitado
      props.textWhenDisabled = config.validationMessage || props.textWhenDisabled;
      
      console.log(`   ▶️  Botão: "${config.buttonText}" (${config.enableOnSelection ? 'condicional' : 'sempre ativo'})`);
    }
    
    // Atualizar validações globais
    if (template.validation) {
      template.validation.minAnswers = config.minSelections;
      template.validation.maxAnswers = config.maxSelections;
      template.validation.validationMessage = config.validationMessage;
    }
    
    // Salvar arquivo
    fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
    console.log(`   ✅ JSON atualizado com sucesso\n`);
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ Erro ao atualizar JSON: ${error.message}\n`);
    return false;
  }
}

function updateTSXTemplate(stepNum, config) {
  const stepNumStr = String(stepNum).padStart(2, '0');
  const templatePath = path.join(__dirname, 'src/components/steps', `Step${stepNumStr}Template.tsx`);
  
  if (!fs.existsSync(templatePath)) {
    console.log(`⚠️  Template TSX não encontrado: Step${stepNumStr}Template.tsx`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(templatePath, 'utf8');
    
    console.log(`📝 Atualizando TSX: Step${stepNumStr}Template.tsx`);
    
    // Atualizar propriedades do options-grid
    if (config.multipleSelection !== undefined) {
      content = content.replace(
        /multipleSelection:\s*(true|false)/g,
        `multipleSelection: ${config.multipleSelection}`
      );
    }
    
    if (config.minSelections !== undefined) {
      content = content.replace(
        /minSelections:\s*\d+/g,
        `minSelections: ${config.minSelections}`
      );
    }
    
    if (config.maxSelections !== undefined) {
      content = content.replace(
        /maxSelections:\s*\d+/g,
        `maxSelections: ${config.maxSelections}`
      );
    }
    
    // Atualizar auto-avanço
    if (config.autoAdvance !== undefined) {
      // Adicionar ou atualizar autoAdvanceOnComplete
      if (!content.includes('autoAdvanceOnComplete')) {
        content = content.replace(
          /(multipleSelection:\s*(true|false),?)/,
          `$1\n        autoAdvanceOnComplete: ${config.autoAdvance},`
        );
      } else {
        content = content.replace(
          /autoAdvanceOnComplete:\s*(true|false)/g,
          `autoAdvanceOnComplete: ${config.autoAdvance}`
        );
      }
      
      // Adicionar ou atualizar autoAdvanceDelay
      if (!content.includes('autoAdvanceDelay')) {
        content = content.replace(
          /(autoAdvanceOnComplete:\s*(true|false),?)/,
          `$1\n        autoAdvanceDelay: ${config.autoAdvanceDelay},`
        );
      } else {
        content = content.replace(
          /autoAdvanceDelay:\s*\d+/g,
          `autoAdvanceDelay: ${config.autoAdvanceDelay}`
        );
      }
    }
    
    // Atualizar texto do botão
    if (config.buttonText) {
      content = content.replace(
        /text:\s*['"`][^'"`]*['"`]/g,
        `text: '${config.buttonText}'`
      );
    }
    
    // Atualizar requiresValidSelection
    if (config.enableOnSelection !== undefined) {
      content = content.replace(
        /requiresValidSelection:\s*(true|false)/g,
        `requiresValidSelection: ${config.enableOnSelection}`
      );
    }
    
    // Salvar arquivo
    fs.writeFileSync(templatePath, content);
    console.log(`   ✅ TSX atualizado com sucesso\n`);
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ Erro ao atualizar TSX: ${error.message}\n`);
    return false;
  }
}

function applyConfiguration() {
  console.log('🚀 INICIANDO CORREÇÕES...\n');
  
  let totalUpdated = 0;
  let totalErrors = 0;
  
  Object.entries(STEP_CONFIGS).forEach(([configName, config]) => {
    if (!config.range) return;
    
    const [startStep, endStep] = config.range;
    console.log(`📋 Aplicando configuração: ${configName} (etapas ${startStep}-${endStep})`);
    
    for (let stepNum = startStep; stepNum <= endStep; stepNum++) {
      console.log(`\n🔄 Processando Etapa ${stepNum}:`);
      
      // Atualizar JSON
      const jsonSuccess = updateJSONTemplate(stepNum, config);
      if (jsonSuccess) totalUpdated++;
      else totalErrors++;
      
      // Atualizar TSX  
      const tsxSuccess = updateTSXTemplate(stepNum, config);
      if (tsxSuccess) totalUpdated++;
      else totalErrors++;
    }
  });
  
  return { totalUpdated, totalErrors };
}

function validateConfiguration() {
  console.log('🔍 VALIDANDO CONFIGURAÇÕES APLICADAS...\n');
  
  const validationResults = [];
  
  // Validar etapas 2-11 (quiz normal)
  for (let i = 2; i <= 11; i++) {
    const stepNum = String(i).padStart(2, '0');
    const templatePath = path.join(__dirname, 'public/templates', `step-${stepNum}-template.json`);
    
    if (fs.existsSync(templatePath)) {
      try {
        const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
        const optionsGrid = template.blocks.find(b => b.type === 'options-grid');
        const button = template.blocks.find(b => b.type === 'button-inline');
        
        const result = {
          step: i,
          type: 'quiz_normal',
          optionsGrid: optionsGrid ? {
            multipleSelection: optionsGrid.properties.multipleSelection,
            minSelections: optionsGrid.properties.minSelections,
            maxSelections: optionsGrid.properties.maxSelections,
            autoAdvance: optionsGrid.properties.autoAdvanceOnComplete
          } : null,
          button: button ? {
            enableOnSelection: button.properties.enableOnSelection,
            text: button.properties.text
          } : null
        };
        
        validationResults.push(result);
        
      } catch (e) {
        validationResults.push({ step: i, error: e.message });
      }
    }
  }
  
  // Validar etapas 13-17 (quiz estratégico)
  for (let i = 13; i <= 17; i++) {
    const stepNum = String(i).padStart(2, '0');
    const templatePath = path.join(__dirname, 'public/templates', `step-${stepNum}-template.json`);
    
    if (fs.existsSync(templatePath)) {
      try {
        const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
        const optionsGrid = template.blocks.find(b => b.type === 'options-grid');
        const button = template.blocks.find(b => b.type === 'button-inline');
        
        const result = {
          step: i,
          type: 'quiz_strategic',
          optionsGrid: optionsGrid ? {
            multipleSelection: optionsGrid.properties.multipleSelection,
            minSelections: optionsGrid.properties.minSelections,
            maxSelections: optionsGrid.properties.maxSelections,
            autoAdvance: optionsGrid.properties.autoAdvanceOnComplete
          } : null,
          button: button ? {
            enableOnSelection: button.properties.enableOnSelection,
            text: button.properties.text
          } : null
        };
        
        validationResults.push(result);
        
      } catch (e) {
        validationResults.push({ step: i, error: e.message });
      }
    }
  }
  
  // Mostrar resultados
  console.log('📊 RESULTADOS DA VALIDAÇÃO:\n');
  
  validationResults.forEach(result => {
    if (result.error) {
      console.log(`❌ Etapa ${result.step}: ${result.error}`);
      return;
    }
    
    const isCorrect = result.type === 'quiz_normal' 
      ? (result.optionsGrid?.multipleSelection === true && 
         result.optionsGrid?.minSelections === 3 && 
         result.optionsGrid?.maxSelections === 3 &&
         result.optionsGrid?.autoAdvance === true)
      : (result.optionsGrid?.multipleSelection === false && 
         result.optionsGrid?.minSelections === 1 && 
         result.optionsGrid?.maxSelections === 1 &&
         result.optionsGrid?.autoAdvance === false);
    
    const icon = isCorrect ? '✅' : '⚠️';
    const typeLabel = result.type === 'quiz_normal' ? 'Quiz Normal' : 'Quiz Estratégico';
    
    console.log(`${icon} Etapa ${result.step} (${typeLabel}):`);
    if (result.optionsGrid) {
      console.log(`   🔘 Seleção: ${result.optionsGrid.multipleSelection ? 'múltipla' : 'única'} (${result.optionsGrid.minSelections}-${result.optionsGrid.maxSelections})`);
      console.log(`   ⚡ Auto-avanço: ${result.optionsGrid.autoAdvance ? '✅' : '❌'}`);
    }
    if (result.button) {
      console.log(`   ▶️  Botão: "${result.button.text}" (${result.button.enableOnSelection ? 'condicional' : 'sempre ativo'})`);
    }
    console.log('');
  });
  
  return validationResults;
}

// Executar script
console.log('🎯 CONFIGURAÇÕES DE BOTÕES E AUTO-AVANÇO');
console.log('==========================================\n');

console.log('📋 REGRAS A APLICAR:');
console.log('• Etapas 2-11: 3 seleções obrigatórias + auto-avanço');
console.log('• Etapas 13-17: 1 seleção obrigatória + avanço manual\n');

const { totalUpdated, totalErrors } = applyConfiguration();

console.log('\n📊 RESUMO DAS CORREÇÕES:');
console.log(`   ✅ Arquivos atualizados: ${totalUpdated}`);
console.log(`   ❌ Erros encontrados: ${totalErrors}`);

if (totalErrors === 0) {
  console.log('\n🎉 TODAS AS CORREÇÕES APLICADAS COM SUCESSO!');
  
  // Validar configurações
  const validationResults = validateConfiguration();
  
  const correctSteps = validationResults.filter(r => !r.error).length;
  console.log(`\n✅ ${correctSteps} etapas configuradas corretamente`);
  console.log('🚀 Sistema pronto para funcionar com as novas regras!');
  
} else {
  console.log('\n⚠️  Algumas correções falharam. Verifique os erros acima.');
}
