#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 CORREÇÃO AUTOMÁTICA DE RESPONSIVIDADE - ETAPAS 20 E 21\n');

const componentsDir = '/workspaces/quiz-quest-challenge-verse/client/src/components/editor/blocks';

// Componentes a corrigir
const componentsToFix = [
  'QuizResultMainCardBlock.tsx',
  'QuizResultHeaderBlock.tsx', 
  'QuizOfferHeroBlock.tsx',
  'QuizOfferPricingBlock.tsx',
  'QuizOfferCountdownBlock.tsx',
  'QuizOfferFinalCTABlock.tsx',
  'QuizOfferFAQBlock.tsx'
];

// Mapeamentos de correção para max-width
const maxWidthReplacements = {
  'max-w-xs': 'max-w-xs sm:max-w-xs md:max-w-xs',
  'max-w-sm': 'max-w-xs sm:max-w-sm md:max-w-sm',
  'max-w-md': 'max-w-xs sm:max-w-sm md:max-w-md',
  'max-w-lg': 'max-w-xs sm:max-w-md md:max-w-lg',
  'max-w-xl': 'max-w-xs sm:max-w-md md:max-w-xl',
  'max-w-2xl': 'max-w-xs sm:max-w-lg md:max-w-2xl',
  'max-w-3xl': 'max-w-xs sm:max-w-lg md:max-w-3xl',
  'max-w-4xl': 'max-w-xs sm:max-w-lg md:max-w-4xl',
  'max-w-5xl': 'max-w-xs sm:max-w-lg md:max-w-5xl',
  'max-w-6xl': 'max-w-xs sm:max-w-lg md:max-w-6xl',
  'max-w-7xl': 'max-w-xs sm:max-w-lg md:max-w-7xl'
};

// Mapeamentos para larguras de ícones e elementos pequenos
const iconWidthReplacements = {
  'w-4 h-4': 'w-3 sm:w-4 h-3 sm:h-4',
  'w-5 h-5': 'w-4 sm:w-5 h-4 sm:h-5',
  'w-6 h-6': 'w-5 sm:w-6 h-5 sm:h-6',
  'w-8 h-8': 'w-6 sm:w-8 h-6 sm:h-8',
  'w-10 h-10': 'w-8 sm:w-10 h-8 sm:h-10',
  'w-12 h-12': 'w-10 sm:w-12 h-10 sm:h-12',
  'w-16 h-16': 'w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16',
  'w-20 h-20': 'w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20',
  'w-24 h-24': 'w-18 sm:w-20 md:w-24 h-18 sm:h-20 md:h-24'
};

function applyResponsiveFixes(filePath, componentName) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${componentName}: Arquivo não encontrado`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const changes = [];

  // Aplicar correções de max-width
  Object.entries(maxWidthReplacements).forEach(([original, replacement]) => {
    const regex = new RegExp(`\\b${original}\\b(?!\\s+(?:sm|md|lg|xl):)`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      modified = true;
      changes.push(`max-width: ${original} → ${replacement}`);
    }
  });

  // Aplicar correções de ícones (apenas para componentes específicos)
  if (['QuizOfferCountdownBlock.tsx', 'QuizOfferFAQBlock.tsx'].includes(componentName)) {
    Object.entries(iconWidthReplacements).forEach(([original, replacement]) => {
      const regex = new RegExp(`\\b${original}\\b`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        modified = true;
        changes.push(`ícone: ${original} → ${replacement}`);
      }
    });
  }

  // Salvar arquivo se houve modificações
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${componentName}: Corrigido`);
    changes.forEach(change => {
      console.log(`   📝 ${change}`);
    });
    return true;
  } else {
    console.log(`⚠️  ${componentName}: Nenhuma correção necessária`);
    return false;
  }
}

console.log('🚀 Iniciando correções...\n');

let totalFixed = 0;

componentsToFix.forEach(component => {
  const filePath = path.join(componentsDir, component);
  const fixed = applyResponsiveFixes(filePath, component);
  if (fixed) totalFixed++;
  console.log('');
console.log(`\n🎯 RESUMO: ${totalFixed}/${componentsToFix.length} componentes corrigidos`);

if (totalFixed > 0) {
  console.log('\n✨ MELHORIAS APLICADAS:');
  console.log('• Larguras máximas agora são responsivas');
  console.log('• Ícones redimensionam adequadamente em mobile');
  console.log('• Breakpoints progressivos implementados');
  console.log('\n🧪 Execute a análise novamente para verificar melhorias!');
} else {
  console.log('\n💡 Todos os componentes já estão otimizados!');
}
