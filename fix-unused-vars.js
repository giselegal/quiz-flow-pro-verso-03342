#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lista de correções para aplicar
const fixes = [
  // Remove imports não utilizados
  {
    file: 'src/components/funnel-blocks/QuizTransition.tsx',
    fixes: [
      { search: /import { getOptimizedContainerClasses } from.*\n/, replace: '' },
      { search: /\s+deviceView[^,\n}]+[,]?/, replace: '' },
      { search: /\s+isCompleted[^,\n}]+[,]?/, replace: '' }
    ]
  },
  {
    file: 'src/components/funnel-blocks/SalesOffer.tsx',
    fixes: [
      { search: /\s+showCountdown[^,\n}]+[,]?/, replace: '' },
      { search: /\s+countdownHours[^,\n}]+[,]?/, replace: '' },
      { search: /\s+guaranteePeriod[^,\n}]+[,]?/, replace: '' },
      { search: /\s+alignment[^,\n}]+[,]?/, replace: '' },
      { search: /\s+alignmentClasses[^,\n}]+[,]?/, replace: '' }
    ]
  },
  {
    file: 'src/components/funnel-blocks/StrategicQuestion.tsx',
    fixes: [
      { search: /import { getOptimizedContainerClasses } from.*\n/, replace: '' }
    ]
  },
  {
    file: 'src/components/funnel-blocks/StyleResultDisplay.tsx',
    fixes: [
      { search: /\s+alignment[^,\n}]+[,]?/, replace: '' },
      { search: /\s+alignmentClasses[^,\n}]+[,]?/, replace: '' }
    ]
  },
  {
    file: 'src/components/funnel-blocks/VideoSection.tsx',
    fixes: [
      { search: /import { getOptimizedContainerClasses } from.*\n/, replace: '' }
    ]
  },
  {
    file: 'src/components/layout/Navbar.tsx',
    fixes: [
      { search: /import React from "react";\n/, replace: '' }
    ]
  },
  {
    file: 'src/components/funnel-blocks/steps/ProcessingStep.tsx',
    fixes: [
      { search: /import.*Button.*from.*ui\/button.*\n/, replace: '' },
      { search: /\s+stepNumber[^,\n}]+[,]?/, replace: '' },
      { search: /\s+totalSteps[^,\n}]+[,]?/, replace: '' },
      { search: /\s+loadingClasses[^,\n}]+[,]?/, replace: '' }
    ]
  }
];

console.log('🔧 Iniciando correções automáticas...\n');

let totalFixed = 0;

fixes.forEach(({ file, fixes: fileFixes }) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixed = 0;

  fileFixes.forEach(({ search, replace }) => {
    if (content.match(search)) {
      content = content.replace(search, replace);
      fileFixed++;
      totalFixed++;
    }
  });

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${file} - ${fileFixed} correções aplicadas`);
  } else {
    console.log(`ℹ️  ${file} - Nenhuma correção necessária`);
  }
});

console.log(`\n🎉 Total de correções aplicadas: ${totalFixed}`);
console.log('✨ Correções concluídas!');
