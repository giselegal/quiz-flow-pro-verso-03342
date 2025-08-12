#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 INICIANDO SINCRONIZAÇÃO TSX → JSON...');

// CONFIGURAÇÕES POR STEP
const stepConfigs = {
  // STEPS 2-11: 3 seleções obrigatórias + auto-avanço
  '02': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  '03': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  '04': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  '05': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  '06': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  '07': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  '08': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  '09': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  '10': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  '11': { minSelections: 3, maxSelections: 3, autoAdvance: true, multipleSelection: true },
  
  // STEPS 13-17: 1 seleção obrigatória + manual
  '13': { minSelections: 1, maxSelections: 1, autoAdvance: false, multipleSelection: false },
  '14': { minSelections: 1, maxSelections: 1, autoAdvance: false, multipleSelection: false },
  '15': { minSelections: 1, maxSelections: 1, autoAdvance: false, multipleSelection: false },
  '16': { minSelections: 1, maxSelections: 1, autoAdvance: false, multipleSelection: false },
  '17': { minSelections: 1, maxSelections: 1, autoAdvance: false, multipleSelection: false }
};

function fixTsxFile(stepNumber) {
  const filePath = `src/components/steps/Step${stepNumber}Template.tsx`;
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
    return;
  }

  const config = stepConfigs[stepNumber];
  if (!config) {
    console.log(`⚠️  Configuração não definida para step ${stepNumber}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  console.log(`🔧 Corrigindo ${filePath}...`);

  // 1. CORRIGIR MULTIPLE SELECTION
  content = content.replace(
    /multipleSelection:\s*(true|false)/g,
    `multipleSelection: ${config.multipleSelection}`
  );

  // 2. CORRIGIR MIN SELECTIONS
  content = content.replace(
    /minSelections:\s*\d+/g,
    `minSelections: ${config.minSelections}`
  );

  // 3. CORRIGIR MAX SELECTIONS
  content = content.replace(
    /maxSelections:\s*\d+/g,
    `maxSelections: ${config.maxSelections}`
  );

  // 4. ADICIONAR AUTO ADVANCE se não existir
  if (config.autoAdvance && !content.includes('autoAdvance:')) {
    content = content.replace(
      /(minSelections:\s*\d+,)/g,
      `$1\n        autoAdvance: ${config.autoAdvance},`
    );
  }

  // 5. CORRIGIR AUTO ADVANCE EXISTENTE
  content = content.replace(
    /autoAdvance:\s*(true|false)/g,
    `autoAdvance: ${config.autoAdvance}`
  );

  // 6. CORRIGIR AUTO ADVANCE ON COMPLETE
  if (config.autoAdvance) {
    content = content.replace(
      /autoAdvanceOnComplete:\s*(true|false)/g,
      `autoAdvanceOnComplete: true`
    );
  } else {
    content = content.replace(
      /autoAdvanceOnComplete:\s*(true|false)/g,
      `autoAdvanceOnComplete: false`
    );
  }

  // 7. CORRIGIR TEXTO DO BOTÃO
  const selectionText = config.minSelections === 3 ? '3 opções' : '1 opção';
  content = content.replace(
    /textWhenDisabled:\s*['"`][^'"`]*['"`]/g,
    `textWhenDisabled: 'Selecione ${selectionText} para continuar'`
  );

  // 8. CORRIGIR AUTO ADVANCE AFTER ACTIVATION NO BOTÃO
  if (config.autoAdvance) {
    content = content.replace(
      /autoAdvanceAfterActivation:\s*(true|false)/g,
      `autoAdvanceAfterActivation: false` // Options fazem auto advance, não o botão
    );
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${filePath} corrigido!`);
}

// EXECUTAR CORREÇÕES
Object.keys(stepConfigs).forEach(stepNumber => {
  fixTsxFile(stepNumber);
});

console.log('🎉 SINCRONIZAÇÃO TSX CONCLUÍDA!');
