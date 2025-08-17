#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('📦 ANÁLISE DE FLEXBOX - ETAPAS 20 E 21\n');

const componentsDir = '/workspaces/quiz-quest-challenge-verse/client/src/components/editor/blocks';

// Componentes das etapas 20 e 21
const step20Components = [
  'QuizResultMainCardBlock.tsx',
  'QuizResultHeaderBlock.tsx',
  'QuizResultDisplayBlock.tsx',
  'QuizResultSecondaryStylesBlock.tsx',
  'CaktoQuizResult.tsx',
];

const step21Components = [
  'QuizOfferPageBlock.tsx',
  'QuizOfferHeroBlock.tsx',
  'QuizOfferPricingBlock.tsx',
  'QuizOfferTestimonialsBlock.tsx',
  'QuizOfferCountdownBlock.tsx',
  'QuizOfferFinalCTABlock.tsx',
  'QuizOfferFAQBlock.tsx',
  'CaktoQuizOffer.tsx',
];

// Padrões de Flexbox para detectar
const flexPatterns = {
  container: [/\bflex\b/g, /\binline-flex\b/g],
  direction: [/\bflex-row\b/g, /\bflex-col\b/g, /\bflex-row-reverse\b/g, /\bflex-col-reverse\b/g],
  wrap: [/\bflex-wrap\b/g, /\bflex-nowrap\b/g, /\bflex-wrap-reverse\b/g],
  justify: [
    /\bjustify-start\b/g,
    /\bjustify-end\b/g,
    /\bjustify-center\b/g,
    /\bjustify-between\b/g,
    /\bjustify-around\b/g,
    /\bjustify-evenly\b/g,
  ],
  align: [
    /\bitems-start\b/g,
    /\bitems-end\b/g,
    /\bitems-center\b/g,
    /\bitems-baseline\b/g,
    /\bitems-stretch\b/g,
  ],
  content: [
    /\bcontent-start\b/g,
    /\bcontent-end\b/g,
    /\bcontent-center\b/g,
    /\bcontent-between\b/g,
    /\bcontent-around\b/g,
    /\bcontent-evenly\b/g,
  ],
  self: [
    /\bself-auto\b/g,
    /\bself-start\b/g,
    /\bself-end\b/g,
    /\bself-center\b/g,
    /\bself-stretch\b/g,
  ],
  grow: [
    /\bflex-1\b/g,
    /\bflex-auto\b/g,
    /\bflex-initial\b/g,
    /\bflex-none\b/g,
    /\bgrow\b/g,
    /\bshrink\b/g,
  ],
  gap: [/\bgap-\d+\b/g, /\bgap-x-\d+\b/g, /\bgap-y-\d+\b/g, /\bspace-x-\d+\b/g, /\bspace-y-\d+\b/g],
};

// Padrões alternativos (Grid, Block, etc.)
const alternativePatterns = {
  grid: [/\bgrid\b/g, /\binline-grid\b/g, /\bgrid-cols-\d+\b/g, /\bgrid-rows-\d+\b/g],
  block: [/\bblock\b/g, /\binline-block\b/g, /\binline\b/g],
  position: [/\babsolute\b/g, /\brelative\b/g, /\bfixed\b/g, /\bsticky\b/g],
};

function analyzeFlexboxUsage(filePath, componentName, step) {
  if (!fs.existsSync(filePath)) {
    return {
      name: componentName,
      step: step,
      exists: false,
      flexboxUsage: {},
      alternatives: {},
      score: 0,
      issues: ['Arquivo não encontrado'],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const flexboxUsage = {};
  const alternatives = {};
  const issues = [];

  // Analisar uso de Flexbox
  Object.entries(flexPatterns).forEach(([category, patterns]) => {
    const categoryMatches = [];
    patterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      categoryMatches.push(...matches);
    });
    if (categoryMatches.length > 0) {
      flexboxUsage[category] = [...new Set(categoryMatches)];
    }
  });

  // Analisar alternativas
  Object.entries(alternativePatterns).forEach(([category, patterns]) => {
    const categoryMatches = [];
    patterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      categoryMatches.push(...matches);
    });
    if (categoryMatches.length > 0) {
      alternatives[category] = [...new Set(categoryMatches)];
    }
  });

  // Calcular score de uso de Flexbox
  let score = 0;
  const totalFlexUsage = Object.values(flexboxUsage).flat().length;
  const totalAlternatives = Object.values(alternatives).flat().length;

  if (totalFlexUsage > 0) {
    score += Math.min(50, totalFlexUsage * 5); // Máximo 50 pontos por uso de flex
  }

  // Bonificações por categorias específicas
  if (flexboxUsage.container) score += 10; // Container flex definido
  if (flexboxUsage.justify) score += 10; // Justificação definida
  if (flexboxUsage.align) score += 10; // Alinhamento definido
  if (flexboxUsage.gap) score += 10; // Gaps definidos

  // Penalizações por uso excessivo de alternativas problemáticas
  if (alternatives.grid && alternatives.grid.length > flexboxUsage.container?.length) {
    score -= 5;
    issues.push('Uso excessivo de Grid em vez de Flexbox');
  }

  // Verificar padrões problemáticos específicos
  if (content.includes('float:') || content.includes('float-')) {
    score -= 10;
    issues.push('Uso de float (obsoleto)');
  }

  if (content.includes('display: table') || content.includes('table-')) {
    score -= 5;
    issues.push('Uso de table layout');
  }

  // Verificar responsividade do flexbox
  const responsiveFlexPatterns = [
    /(?:sm|md|lg|xl):flex/g,
    /(?:sm|md|lg|xl):flex-col/g,
    /(?:sm|md|lg|xl):flex-row/g,
    /(?:sm|md|lg|xl):justify-/g,
    /(?:sm|md|lg|xl):items-/g,
  ];

  let responsiveFlexCount = 0;
  responsiveFlexPatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    responsiveFlexCount += matches.length;
  });

  if (responsiveFlexCount > 0) {
    score += Math.min(20, responsiveFlexCount * 2);
  } else if (totalFlexUsage > 0) {
    issues.push('Flexbox não é responsivo');
    score -= 5;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: componentName,
    step: step,
    exists: true,
    flexboxUsage: flexboxUsage,
    alternatives: alternatives,
    responsiveFlexCount: responsiveFlexCount,
    score: score,
    issues: issues,
  };
}

console.log('📊 ETAPA 20 - RESULTADO');
console.log('==================================================');

const step20Results = [];
step20Components.forEach(component => {
  const filePath = path.join(componentsDir, component);
  const analysis = analyzeFlexboxUsage(filePath, component.replace('.tsx', ''), 20);
  step20Results.push(analysis);

  const emoji =
    analysis.score >= 80 ? '🟢' : analysis.score >= 60 ? '🟡' : analysis.score >= 40 ? '🟠' : '🔴';
  const flexType =
    Object.keys(analysis.flexboxUsage).length > 0
      ? 'FLEXBOX'
      : analysis.alternatives.grid
        ? 'GRID'
        : analysis.alternatives.block
          ? 'BLOCK'
          : 'UNKNOWN';

  console.log(`${emoji} ${analysis.name} - Score: ${analysis.score}/100 (${flexType})`);

  // Mostrar uso de flexbox
  if (Object.keys(analysis.flexboxUsage).length > 0) {
    Object.entries(analysis.flexboxUsage).forEach(([category, classes]) => {
      console.log(`   📦 ${category}: ${classes.join(', ')}`);
    });
  }

  // Mostrar alternativas
  if (Object.keys(analysis.alternatives).length > 0) {
    Object.entries(analysis.alternatives).forEach(([category, classes]) => {
      if (classes.length > 0) {
        console.log(
          `   ⚡ ${category}: ${classes.slice(0, 3).join(', ')}${classes.length > 3 ? '...' : ''}`
        );
      }
    });
  }

  // Mostrar problemas
  if (analysis.issues.length > 0) {
    analysis.issues.forEach(issue => {
      console.log(`   ⚠️  ${issue}`);
    });
  }

  console.log('');
});

console.log('📊 ETAPA 21 - OFERTA');
console.log('==================================================');

const step21Results = [];
step21Components.forEach(component => {
  const filePath = path.join(componentsDir, component);
  const analysis = analyzeFlexboxUsage(filePath, component.replace('.tsx', ''), 21);
  step21Results.push(analysis);

  const emoji =
    analysis.score >= 80 ? '🟢' : analysis.score >= 60 ? '🟡' : analysis.score >= 40 ? '🟠' : '🔴';
  const flexType =
    Object.keys(analysis.flexboxUsage).length > 0
      ? 'FLEXBOX'
      : analysis.alternatives.grid
        ? 'GRID'
        : analysis.alternatives.block
          ? 'BLOCK'
          : 'UNKNOWN';

  console.log(`${emoji} ${analysis.name} - Score: ${analysis.score}/100 (${flexType})`);

  // Mostrar uso de flexbox
  if (Object.keys(analysis.flexboxUsage).length > 0) {
    Object.entries(analysis.flexboxUsage).forEach(([category, classes]) => {
      console.log(`   📦 ${category}: ${classes.join(', ')}`);
    });
  }

  // Mostrar alternativas
  if (Object.keys(analysis.alternatives).length > 0) {
    Object.entries(analysis.alternatives).forEach(([category, classes]) => {
      if (classes.length > 0) {
        console.log(
          `   ⚡ ${category}: ${classes.slice(0, 3).join(', ')}${classes.length > 3 ? '...' : ''}`
        );
      }
    });
  }

  // Mostrar problemas
  if (analysis.issues.length > 0) {
    analysis.issues.forEach(issue => {
      console.log(`   ⚠️  ${issue}`);
    });
  }

  console.log('');
});

// Estatísticas finais
console.log('📈 RESUMO GERAL');
console.log('==================================================');

const allResults = [...step20Results, ...step21Results].filter(r => r.exists);
const flexboxComponents = allResults.filter(r => Object.keys(r.flexboxUsage).length > 0);
const gridComponents = allResults.filter(
  r => r.alternatives.grid && r.alternatives.grid.length > 0
);
const blockComponents = allResults.filter(
  r => r.alternatives.block && r.alternatives.block.length > 0
);

console.log(
  `📦 Componentes usando FLEXBOX: ${flexboxComponents.length}/${allResults.length} (${Math.round((flexboxComponents.length / allResults.length) * 100)}%)`
);
console.log(
  `🎯 Componentes usando GRID: ${gridComponents.length}/${allResults.length} (${Math.round((gridComponents.length / allResults.length) * 100)}%)`
);
console.log(
  `📄 Componentes usando BLOCK: ${blockComponents.length}/${allResults.length} (${Math.round((blockComponents.length / allResults.length) * 100)}%)`
);

const avgFlexScore =
  flexboxComponents.reduce((sum, comp) => sum + comp.score, 0) / (flexboxComponents.length || 1);
console.log(`\n🏆 Score médio dos componentes Flexbox: ${Math.round(avgFlexScore)}/100`);

const step20FlexScore =
  step20Results.filter(r => r.exists).reduce((sum, comp) => sum + comp.score, 0) /
  step20Results.filter(r => r.exists).length;
const step21FlexScore =
  step21Results.filter(r => r.exists).reduce((sum, comp) => sum + comp.score, 0) /
  step21Results.filter(r => r.exists).length;

console.log(`📊 Etapa 20 - Score Flexbox médio: ${Math.round(step20FlexScore)}/100`);
console.log(`📊 Etapa 21 - Score Flexbox médio: ${Math.round(step21FlexScore)}/100`);

// Recomendações
console.log('\n💡 RECOMENDAÇÕES');
console.log('==================================================');

if (flexboxComponents.length < allResults.length * 0.7) {
  console.log('🔧 Considere migrar mais componentes para Flexbox');
  console.log('   • Flexbox é mais eficiente para layouts 1D');
  console.log('   • Melhor suporte para responsividade');
  console.log('   • Mais fácil de manter');
}

if (avgFlexScore < 80) {
  console.log('📈 Melhore o uso de Flexbox:');
  console.log('   • Use justify-content e align-items adequadamente');
  console.log('   • Implemente gaps em vez de margins');
  console.log('   • Adicione breakpoints responsivos');
}

console.log('\n🏁 ANÁLISE DE FLEXBOX CONCLUÍDA!');
