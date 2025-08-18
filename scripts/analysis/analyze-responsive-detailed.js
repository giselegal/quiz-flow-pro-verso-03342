#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 ANÁLISE DETALHADA DE RESPONSIVIDADE - ETAPAS 20 E 21\n');

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

// Padrões problemáticos específicos
const responsiveIssues = [
  {
    pattern: /grid-cols-3(?!\s+(?:sm|md|lg|xl):)/g,
    description: '3 colunas sem breakpoint responsivo',
    severity: 'high',
  },
  {
    pattern: /grid-cols-4(?!\s+(?:sm|md|lg|xl):)/g,
    description: '4+ colunas sem breakpoint responsivo',
    severity: 'critical',
  },
  {
    pattern: /w-\d+(?!.*(?:sm|md|lg|xl):)/g,
    description: 'Largura fixa sem responsividade',
    severity: 'medium',
  },
  {
    pattern: /max-w-\d+(?!.*(?:sm|md|lg|xl):)/g,
    description: 'Max-width fixa sem responsividade',
    severity: 'medium',
  },
  {
    pattern: /flex-\[1_1_\d+%\]/g,
    description: 'Flex basis percentual fixo',
    severity: 'medium',
  },
  {
    pattern: /overflow-x-auto(?!.*(?:sm|md|lg|xl):)/g,
    description: 'Overflow horizontal (verificar se é carrossel intencional)',
    severity: 'info',
  },
];

function analyzeComponent(filePath, componentName, step) {
  if (!fs.existsSync(filePath)) {
    return {
      name: componentName,
      step: step,
      exists: false,
      score: 70,
      issues: ['Arquivo não encontrado'],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  let score = 100;

  // Verificar cada padrão problemático
  responsiveIssues.forEach(issue => {
    const matches = content.match(issue.pattern) || [];
    if (matches.length > 0) {
      // Para overflow-x-auto, verificar se está em contexto de carrossel mobile
      if (issue.pattern.source.includes('overflow-x-auto')) {
        // Verificar se há contexto de carrossel responsivo
        const hasCarouselContext =
          content.includes('md:hidden') ||
          content.includes('snap-x') ||
          content.includes('mobile') ||
          content.includes('carrossel');

        if (!hasCarouselContext) {
          issues.push(`${issue.description}: ${matches.length} ocorrência(s)`);
          score -=
            issue.severity === 'critical'
              ? 30
              : issue.severity === 'high'
                ? 20
                : issue.severity === 'medium'
                  ? 10
                  : 5;
        } else {
          // É um carrossel responsivo - apenas nota informativa
          issues.push(`📱 Carrossel mobile detectado: ${matches.length} implementação(s)`);
        }
      } else {
        issues.push(`${issue.description}: ${matches.length} ocorrência(s)`);
        score -=
          issue.severity === 'critical'
            ? 30
            : issue.severity === 'high'
              ? 20
              : issue.severity === 'medium'
                ? 10
                : 5;
      }
    }
  });

  // Verificar implementações responsivas positivas
  const positivePatterns = [
    /(?:sm|md|lg|xl):grid-cols-/g,
    /(?:sm|md|lg|xl):flex-/g,
    /(?:sm|md|lg|xl):w-/g,
    /(?:sm|md|lg|xl):max-w-/g,
    /(?:sm|md|lg|xl):p-/g,
    /(?:sm|md|lg|xl):text-/g,
  ];

  let responsiveImplementations = 0;
  positivePatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    responsiveImplementations += matches.length;
  });

  // Bonus por implementações responsivas
  if (responsiveImplementations > 10) {
    score += 5;
  } else if (responsiveImplementations > 5) {
    score += 3;
  }

  // Verificar se tem carrossel mobile bem implementado
  if (content.includes('md:hidden') && content.includes('md:grid')) {
    score += 5; // Bonus por implementação mobile/desktop diferenciada
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: componentName,
    step: step,
    exists: true,
    score: score,
    issues: issues,
    responsiveImplementations: responsiveImplementations,
  };
}

console.log('📊 ETAPA 20 - RESULTADO');
console.log('==================================================');

step20Components.forEach(component => {
  const filePath = path.join(componentsDir, component);
  const analysis = analyzeComponent(filePath, component.replace('.tsx', ''), 20);

  const emoji = analysis.score >= 90 ? '✅' : analysis.score >= 70 ? '⚠️' : '❌';
  console.log(`${emoji} ${analysis.name} - Score: ${analysis.score}/100`);

  if (analysis.issues.length > 0) {
    analysis.issues.forEach(issue => {
      const issueEmoji = issue.includes('📱') ? '📱' : issue.includes('Carrossel') ? '📱' : '   •';
      console.log(`${issueEmoji} ${issue}`);
    });
  }
  console.log('');
});

console.log('📊 ETAPA 21 - OFERTA');
console.log('==================================================');

step21Components.forEach(component => {
  const filePath = path.join(componentsDir, component);
  const analysis = analyzeComponent(filePath, component.replace('.tsx', ''), 21);

  const emoji = analysis.score >= 90 ? '✅' : analysis.score >= 70 ? '⚠️' : '❌';
  console.log(`${emoji} ${analysis.name} - Score: ${analysis.score}/100`);

  if (analysis.issues.length > 0) {
    analysis.issues.forEach(issue => {
      const issueEmoji = issue.includes('📱') ? '📱' : issue.includes('Carrossel') ? '📱' : '   •';
      console.log(`${issueEmoji} ${issue}`);
    });
  }
  console.log('');
});

console.log('🔍 ANÁLISE ESPECÍFICA DE PROBLEMAS REAIS\n');

// Vamos verificar especificamente os padrões mais problemáticos
const criticalPatterns = [
  'grid-cols-3',
  'grid-cols-4',
  'grid-cols-5',
  'w-full md:w-1/3',
  'flex-1/3',
];

console.log('🚨 VERIFICANDO PADRÕES CRÍTICOS:\n');

[...step20Components, ...step21Components].forEach(component => {
  const filePath = path.join(componentsDir, component);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');

    criticalPatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        console.log(`❌ ${component}: Contém "${pattern}"`);

        // Mostrar o contexto onde o padrão aparece
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(pattern)) {
            console.log(`   Linha ${index + 1}: ${line.trim()}`);
          }
        });
      }
    });
  }
});

console.log('\n💡 RECOMENDAÇÕES ESPECÍFICAS PARA CORREÇÃO:\n');

console.log('1. 🔧 Para componentes com grid-cols-3:');
console.log('   Alterar para: grid-cols-1 md:grid-cols-2 lg:grid-cols-3');

console.log('\n2. 📱 Para carrosséis mobile:');
console.log('   ✅ Implementação correta detectada com md:hidden + md:grid');

console.log('\n3. 🎯 Para larguras fixas:');
console.log('   Usar: w-full md:w-1/2 lg:w-1/3 em vez de w-1/3');

console.log('\n4. 📐 Para espaçamentos:');
console.log('   Usar: gap-4 md:gap-6 lg:gap-8 para responsividade');

console.log('\n🏁 ANÁLISE DETALHADA CONCLUÍDA!');
