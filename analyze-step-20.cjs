#!/usr/bin/env node
/**
 * 🎯 ANÁLISE COMPLETA DO STEP 20
 * Verifica modularidade, responsividade, editabilidade e cálculos precisos
 */

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

console.log(colorize('bright', '🎯 ANÁLISE COMPLETA DO STEP 20 - FUNIL DE 21 ETAPAS'));
console.log('============================================================\n');

// Ler template do Step 20
const templatePath = './public/templates/step-20-template.json';
let template;

try {
  template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
} catch (error) {
  console.error(colorize('red', `❌ Erro ao ler template: ${error.message}`));
  process.exit(1);
}

console.log(colorize('cyan', '📊 COMPONENTES IDENTIFICADOS:'));
console.log(`   • Total de blocos: ${template.blocks.length}`);

template.blocks.forEach((block, index) => {
  console.log(`   ${index + 1}. ${colorize('yellow', block.type)} (ID: ${block.id})`);
});

console.log('\n' + colorize('bright', '🔍 ANÁLISE DETALHADA POR COMPONENTE:'));
console.log('============================================================\n');

// Análise de cada componente
template.blocks.forEach((block, index) => {
  console.log(colorize('bright', `${index + 1}. COMPONENTE: ${block.type.toUpperCase()}`));
  console.log(colorize('blue', `   ID: ${block.id}`));

  // Verificar propriedades
  const props = Object.keys(block.properties || {});
  console.log(`   📋 Propriedades (${props.length}): ${props.join(', ')}`);

  // Verificar se o React component existe
  const componentPaths = [
    `./src/components/blocks/inline/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Block.tsx`,
    `./src/components/blocks/inline/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}InlineBlock.tsx`,
    `./src/components/blocks/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Block.tsx`
  ];

  let componentExists = false;
  let componentPath = '';

  for (const cPath of componentPaths) {
    if (fs.existsSync(cPath)) {
      componentExists = true;
      componentPath = cPath;
      break;
    }
  }

  if (componentExists) {
    console.log(`   ✅ React Component: ${colorize('green', 'ENCONTRADO')} - ${componentPath}`);

    // Analisar o componente React
    try {
      const componentCode = fs.readFileSync(componentPath, 'utf8');

      // Verificar mobile-first
      const hasMobileFirst = componentCode.includes('mobile') || componentCode.includes('sm:') || componentCode.includes('md:') || componentCode.includes('lg:');
      console.log(`   📱 Mobile-First: ${hasMobileFirst ? colorize('green', 'SIM') : colorize('red', 'NÃO')}`);

      // Verificar modularidade
      const hasPropsInterface = componentCode.includes('interface') && componentCode.includes('Props');
      const hasDefaultProps = componentCode.includes('default') || componentCode.includes('=');
      console.log(`   🔧 Modular: ${(hasPropsInterface && hasDefaultProps) ? colorize('green', 'SIM') : colorize('yellow', 'PARCIAL')}`);

      // Verificar cálculos/lógica de dados
      const hasCalculations = componentCode.includes('calculate') || componentCode.includes('compute') || componentCode.includes('useState') || componentCode.includes('useEffect');
      console.log(`   🧮 Cálculos/Estado: ${hasCalculations ? colorize('green', 'SIM') : colorize('yellow', 'BÁSICO')}`);

    } catch (error) {
      console.log(`   ❌ Erro ao analisar componente: ${error.message}`);
    }

  } else {
    console.log(`   ❌ React Component: ${colorize('red', 'NÃO ENCONTRADO')}`);
  }

  // Verificar PropertyEditor no SinglePropertiesPanel.tsx
  let editorExists = false;
  let editorPath = '';

  try {
    const panelContent = fs.readFileSync('./src/components/editor/properties/SinglePropertiesPanel.tsx', 'utf8');

    // Verificar se o tipo está mapeado nos cases
    const typeChecks = [
      `case '${block.type}':`,
      `case '${block.type.replace('-', '_')}':`,
    ];

    // Mapeamentos específicos conhecidos
    if (block.type === 'quiz-intro-header') {
      typeChecks.push(`case 'quiz-intro-header':`, `case 'quiz-header':`);
    } else if (block.type === 'text-inline') {
      typeChecks.push(`case 'text':`, `case 'text-inline':`, `case 'headline':`, `case 'title':`);
    } else if (block.type === 'lead-form') {
      typeChecks.push(`case 'lead-form':`);
    }

    for (const check of typeChecks) {
      if (panelContent.includes(check)) {
        editorExists = true;
        // Determinar qual PropertyEditor está sendo usado
        if (block.type === 'quiz-intro-header') {
          editorPath = 'HeaderPropertyEditor (mapeado no SinglePropertiesPanel.tsx)';
        } else if (block.type === 'text-inline') {
          editorPath = 'TextPropertyEditor (mapeado no SinglePropertiesPanel.tsx)';
        } else if (block.type === 'lead-form') {
          editorPath = 'LeadFormPropertyEditor (mapeado no SinglePropertiesPanel.tsx)';
        }
        break;
      }
    }

    // Fallback: verificar arquivos dedicados
    if (!editorExists) {
      const editorPaths = [
        `./src/components/editor/properties/editors/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}PropertyEditor.tsx`,
        `./src/components/editor/properties/editors/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Editor.tsx`,
        // Mapeamentos especiais
        ...(block.type === 'lead-form' ? ['./src/components/editor/properties/editors/LeadFormPropertyEditor.tsx'] : []),
        ...(block.type === 'text-inline' ? ['./src/components/editor/properties/editors/TextPropertyEditor.tsx', './src/components/editor/properties/editors/TextInlinePropertyEditor.tsx'] : []),
        ...(block.type === 'quiz-intro-header' ? ['./src/components/editor/properties/editors/HeaderPropertyEditor.tsx', './src/components/editor/properties/editors/QuizIntroHeaderPropertyEditor.tsx'] : [])
      ];

      for (const ePath of editorPaths) {
        if (fs.existsSync(ePath)) {
          editorExists = true;
          editorPath = ePath;
          break;
        }
      }
    }
  } catch (error) {
    console.log(`   ❌ Erro ao verificar PropertyEditor: ${error.message}`);
  }

  if (editorExists) {
    console.log(`   ✅ PropertyEditor: ${colorize('green', 'ENCONTRADO')} - ${editorPath}`);
  } else {
    console.log(`   ❌ PropertyEditor: ${colorize('red', 'NÃO ENCONTRADO')}`);
  }

  console.log('');
});

// Análise de responsividade do template
console.log(colorize('bright', '📱 ANÁLISE DE RESPONSIVIDADE:'));
console.log('============================================================');

if (template.layout) {
  console.log(`   • Container Width: ${template.layout.containerWidth || 'não definido'}`);
  console.log(`   • Spacing: ${template.layout.spacing || 'não definido'}`);
  console.log(`   • Background: ${template.layout.backgroundColor || 'não definido'}`);
  console.log(`   • Responsivo: ${template.layout.responsive ? colorize('green', 'SIM') : colorize('red', 'NÃO')}`);
} else {
  console.log(colorize('yellow', '   ⚠️ Layout não definido no template'));
}

// Análise de validação
console.log('\n' + colorize('bright', '✅ ANÁLISE DE VALIDAÇÃO E CÁLCULOS:'));
console.log('============================================================');

if (template.validation) {
  console.log(`   • Required: ${template.validation.required ? colorize('green', 'SIM') : colorize('red', 'NÃO')}`);
  console.log(`   • Min Answers: ${template.validation.minAnswers || 'não definido'}`);
  console.log(`   • Max Answers: ${template.validation.maxAnswers || 'não definido'}`);
  console.log(`   • Validation Message: ${template.validation.validationMessage ? colorize('green', 'DEFINIDA') : colorize('yellow', 'NÃO DEFINIDA')}`);
} else {
  console.log(colorize('yellow', '   ⚠️ Validação não definida no template'));
}

// Análise de analytics
console.log('\n' + colorize('bright', '📈 ANÁLISE DE ANALYTICS E TRACKING:'));
console.log('============================================================');

if (template.analytics) {
  console.log(`   • Events: ${template.analytics.events ? template.analytics.events.join(', ') : 'não definidos'}`);
  console.log(`   • Tracking ID: ${template.analytics.trackingId || 'não definido'}`);
  console.log(`   • Tracking: ${template.analytics.trackingId ? colorize('green', 'CONFIGURADO') : colorize('yellow', 'NÃO CONFIGURADO')}`);
} else {
  console.log(colorize('yellow', '   ⚠️ Analytics não definido no template'));
}

// Score final
console.log('\n' + colorize('bright', '🎯 RESUMO EXECUTIVO:'));
console.log('============================================================');

let totalComponents = template.blocks.length;
let componentsWithReact = 0;
let componentsWithEditor = 0;
let mobileFirstComponents = 0;

// Recalcular scores (simplificado para este exemplo)
template.blocks.forEach((block) => {
  const componentPaths = [
    `./src/components/blocks/inline/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Block.tsx`,
    `./src/components/blocks/inline/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}InlineBlock.tsx`,
    `./src/components/blocks/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Block.tsx`
  ];

  for (const cPath of componentPaths) {
    if (fs.existsSync(cPath)) {
      componentsWithReact++;

      try {
        const code = fs.readFileSync(cPath, 'utf8');
        if (code.includes('sm:') || code.includes('md:') || code.includes('lg:')) {
          mobileFirstComponents++;
        }
      } catch (error) {
        // ignore
      }
      break;
    }
  }

  // Detecção expandida de PropertyEditors (inclui mapeamentos no SinglePropertiesPanel e nomes especiais)
  let editorDetected = false;
  try {
    const panelContent = fs.readFileSync('./src/components/editor/properties/SinglePropertiesPanel.tsx', 'utf8');
    const casesToCheck = [
      `case '${block.type}':`,
      `case '${block.type.replace('-', '_')}':`
    ];
    if (block.type === 'quiz-intro-header') {
      casesToCheck.push(`case 'quiz-header':`);
    } else if (block.type === 'text-inline') {
      casesToCheck.push(`case 'text':`, `case 'headline':`, `case 'title':`);
    }
    for (const c of casesToCheck) {
      if (panelContent.includes(c)) {
        editorDetected = true;
        break;
      }
    }
  } catch (err) {
    // ignore leitura falha
  }

  if (!editorDetected) {
    const editorPaths = [
      `./src/components/editor/properties/editors/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}PropertyEditor.tsx`,
      `./src/components/editor/properties/editors/${block.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Editor.tsx`,
      // Caminhos especiais conhecidos
      ...(block.type === 'quiz-intro-header' ? ['./src/components/editor/properties/editors/HeaderPropertyEditor.tsx'] : []),
      ...(block.type === 'text-inline' ? ['./src/components/editor/properties/editors/TextPropertyEditor.tsx'] : []),
      ...(block.type === 'lead-form' ? ['./src/components/editor/properties/editors/LeadFormPropertyEditor.tsx'] : [])
    ];
    for (const ePath of editorPaths) {
      if (fs.existsSync(ePath)) {
        editorDetected = true;
        break;
      }
    }
  }

  if (editorDetected) {
    componentsWithEditor++;
  }
});

const reactScore = Math.round((componentsWithReact / totalComponents) * 100);
const editorScore = Math.round((componentsWithEditor / totalComponents) * 100);
const mobileScore = Math.round((mobileFirstComponents / totalComponents) * 100);
const overallScore = Math.round((reactScore + editorScore + mobileScore) / 3);

console.log(`📊 Componentes React: ${colorize(reactScore >= 80 ? 'green' : reactScore >= 60 ? 'yellow' : 'red', `${reactScore}%`)} (${componentsWithReact}/${totalComponents})`);
console.log(`🎨 Property Editors: ${colorize(editorScore >= 80 ? 'green' : editorScore >= 60 ? 'yellow' : 'red', `${editorScore}%`)} (${componentsWithEditor}/${totalComponents})`);
console.log(`📱 Mobile-First: ${colorize(mobileScore >= 80 ? 'green' : mobileScore >= 60 ? 'yellow' : 'red', `${mobileScore}%`)} (${mobileFirstComponents}/${totalComponents})`);
console.log(`🎯 Score Geral: ${colorize(overallScore >= 80 ? 'green' : overallScore >= 60 ? 'yellow' : 'red', `${overallScore}%`)}`);

console.log('\n' + colorize('bright', '🔧 PRÓXIMAS AÇÕES RECOMENDADAS:'));
console.log('============================================================');

if (reactScore < 100) {
  console.log(`${colorize('yellow', '⚠️')} Implementar componentes React faltantes`);
}
if (editorScore < 100) {
  console.log(`${colorize('yellow', '⚠️')} Criar PropertyEditors dedicados`);
}
if (mobileScore < 100) {
  console.log(`${colorize('yellow', '⚠️')} Implementar responsividade mobile-first`);
}

if (overallScore >= 80) {
  console.log(`${colorize('green', '✅')} Step 20 está bem estruturado!`);
} else if (overallScore >= 60) {
  console.log(`${colorize('yellow', '⚠️')} Step 20 precisa de melhorias`);
} else {
  console.log(`${colorize('red', '❌')} Step 20 requer reestruturação completa`);
}

console.log('\n' + colorize('bright', '🎯 STEP 20 ANALYSIS COMPLETED!'));