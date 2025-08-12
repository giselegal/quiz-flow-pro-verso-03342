#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo erros de sintaxe...\n');

// Lista de arquivos para correção manual
const syntaxFixes = [
  {
    file: 'src/components/funnel-blocks/SalesOffer.tsx',
    action: 'remove-empty-lines-at-end'
  },
  {
    file: 'src/components/funnel-blocks/StyleResultDisplay.tsx', 
    action: 'remove-empty-lines-at-end'
  },
  {
    file: 'src/components/funnel-blocks/steps/ProcessingStep.tsx',
    action: 'remove-empty-lines-at-end'
  },
  {
    file: 'src/components/pages/ModernResultPageComponent.tsx',
    action: 'fix-destructuring'
  },
  {
    file: 'src/components/pages/PreviewQuizOfferPage.tsx',
    action: 'fix-const-declaration'
  },
  {
    file: 'src/components/quiz-builder/QuizBuilder.tsx',
    action: 'fix-destructuring'
  }
];

let totalFixed = 0;

syntaxFixes.forEach(({ file, action }) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  switch (action) {
    case 'remove-empty-lines-at-end':
      // Remove linhas vazias no final e caracteres órfãos
      content = content.replace(/\n\s*$/, '\n');
      content = content.replace(/[,;\s]*$/, '');
      content += '\n';
      break;
      
    case 'fix-destructuring':
      // Fix incomplete destructuring assignments
      content = content.replace(/const\s*{\s*([^}]*),\s*$/, 'const { $1 } = {};');
      content = content.replace(/const\s*{\s*([^}]*),\s*}\s*=\s*[^;]*[,]?\s*$/gm, 'const { $1 } = {};');
      break;
      
    case 'fix-const-declaration':
      // Fix broken const declarations
      content = content.replace(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*[,;]\s*$/gm, '');
      break;
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${file} - Erro de sintaxe corrigido`);
    totalFixed++;
  } else {
    console.log(`ℹ️  ${file} - Nenhuma correção necessária`);
  }
});

console.log(`\n🎉 Total de correções aplicadas: ${totalFixed}`);
console.log('✨ Correções de sintaxe concluídas!');
