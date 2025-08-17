#!/usr/bin/env node

/**
 * 🔧 CORREÇÃO EM MASSA: ADICIONAR marginTop, marginBottom, marginLeft, marginRight
 *
 * Este script vai corrigir automaticamente todos os 63 componentes que têm o problema
 * de usar getMarginClass(marginTop) sem definir as variáveis de margem
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 INICIANDO CORREÇÃO EM MASSA DOS COMPONENTES...\n');

// Lista dos arquivos problemáticos
const problematicFiles = [
  'src/components/blocks/inline/BenefitsInlineBlock.tsx',
  'src/components/blocks/inline/BonusListInlineBlock.tsx',
  'src/components/blocks/inline/PricingCardInlineBlock.tsx',
  'src/components/blocks/inline/SecondaryStylesInlineBlock.tsx',
  'src/components/blocks/inline/StepHeaderInlineBlock.tsx',
  'src/components/blocks/inline/StyleCharacteristicsInlineBlock.tsx',
  'src/components/blocks/inline/TestimonialCardInlineBlock.tsx',
  'src/components/blocks/inline/TestimonialsInlineBlock.tsx',
  'src/components/editor/blocks/AdvancedCTABlock.tsx',
  'src/components/editor/blocks/AudioPlayerInlineBlock.tsx',
  'src/components/editor/blocks/BasicTextBlock.tsx',
  'src/components/editor/blocks/BeforeAfterBlock.tsx',
  'src/components/editor/blocks/BeforeAfterInlineBlock.tsx',
  'src/components/editor/blocks/BonusBlock.tsx',
  'src/components/editor/blocks/BonusInlineBlock.tsx',
  'src/components/editor/blocks/ButtonInlineBlock_clean.tsx',
  'src/components/editor/blocks/CTAInlineBlock.tsx',
  'src/components/editor/blocks/ComparisonInlineBlock.tsx',
  'src/components/editor/blocks/ComparisonTableBlock.tsx',
  'src/components/editor/blocks/EnhancedFallbackBlock.tsx',
  'src/components/editor/blocks/ExampleInlineBlock.tsx',
  'src/components/editor/blocks/FAQBlock.tsx',
  'src/components/editor/blocks/FAQSectionBlock.tsx',
  'src/components/editor/blocks/FallbackBlock.tsx',
  'src/components/editor/blocks/FinalCTABlock.tsx',
  'src/components/editor/blocks/GuaranteeBlock.tsx',
  'src/components/editor/blocks/GuaranteeInlineBlock.tsx',
  'src/components/editor/blocks/HeadingInlineBlock.tsx',
  'src/components/editor/blocks/HeadingInlineBlock_new.tsx',
  'src/components/editor/blocks/ImageInlineBlock.tsx',
  'src/components/editor/blocks/InlineDemoLayoutBlock.tsx',
  'src/components/editor/blocks/InteractiveQuizBlock.tsx',
  'src/components/editor/blocks/LoaderInlineBlock.tsx',
  'src/components/editor/blocks/MentorBlock.tsx',
  'src/components/editor/blocks/MentorSectionInlineBlock.tsx',
  'src/components/editor/blocks/ModernResultPageBlock.tsx',
  'src/components/editor/blocks/ModernResultPageBlock_clean.tsx',
  'src/components/editor/blocks/NotificationInlineBlock.tsx',
  'src/components/editor/blocks/PricingInlineBlock.tsx',
  'src/components/editor/blocks/ProductCarouselBlock.tsx',
  'src/components/editor/blocks/ProgressInlineBlock.tsx',
  'src/components/editor/blocks/QuizProgressBlock.tsx',
  'src/components/editor/blocks/QuizQuestionBlock.tsx',
  'src/components/editor/blocks/QuizTitleBlock.tsx',
  'src/components/editor/blocks/QuizTransitionBlock.tsx',
  'src/components/editor/blocks/ResultHeaderBlock.tsx',
  'src/components/editor/blocks/ResultPageHeaderBlock.tsx',
  'src/components/editor/blocks/SecurePurchaseBlock.tsx',
  'src/components/editor/blocks/SocialProofBlock.tsx',
  'src/components/editor/blocks/SpacerInlineBlock.tsx',
  'src/components/editor/blocks/StatInlineBlock.tsx',
  'src/components/editor/blocks/StrategicQuestionBlock.tsx',
  'src/components/editor/blocks/StyleCardBlock.tsx',
  'src/components/editor/blocks/StyleCardInlineBlock.tsx',
  'src/components/editor/blocks/TestimonialInlineBlock.tsx',
  'src/components/editor/blocks/TestimonialsBlock.tsx',
  'src/components/editor/blocks/TestimonialsRealInlineBlock.tsx',
  'src/components/editor/blocks/TextInlineBlock_clean.tsx',
  'src/components/editor/blocks/UniversalBlockRenderer.tsx',
  'src/components/editor/blocks/ValueAnchoringBlock.tsx',
  'src/components/editor/blocks/ValueStackBlock.tsx',
  'src/components/editor/blocks/VideoBlock.tsx',
  'src/components/editor/blocks/VideoPlayerInlineBlock.tsx',
];

function fixMarginVariables(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Verifica se já não está corrigido
    if (content.includes('marginTop =') || content.includes('marginTop:')) {
      console.log(`✅ Já corrigido: ${path.basename(filePath)}`);
      return true;
    }

    // Padrões para encontrar destructuring do style
    const patterns = [
      // Padrão: const { size = "md", theme = "default" } = style;
      /const\s*{\s*([^}]*)\s*}\s*=\s*style;/g,
      // Padrão: const { size, theme } = style;
      /const\s*{\s*([^}]*)\s*}\s*=\s*style;/g,
    ];

    let wasFixed = false;

    for (const pattern of patterns) {
      const matches = [...content.matchAll(pattern)];

      for (const match of matches) {
        const fullMatch = match[0];
        const destructuredVars = match[1];

        // Verifica se já não tem as variáveis de margem
        if (destructuredVars.includes('marginTop')) continue;

        // Adiciona as variáveis de margem
        let newDestructuring;
        if (destructuredVars.trim().endsWith(',')) {
          // Já termina com vírgula
          newDestructuring = `const { ${destructuredVars}
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0
  } = style;`;
        } else if (destructuredVars.trim() === '') {
          // Destructuring vazio
          newDestructuring = `const { 
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0
  } = style;`;
        } else {
          // Adiciona vírgula e as novas variáveis
          newDestructuring = `const { ${destructuredVars},
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0
  } = style;`;
        }

        content = content.replace(fullMatch, newDestructuring);
        wasFixed = true;
        break;
      }
    }

    if (!wasFixed) {
      // Tenta encontrar outras variações
      if (content.includes('} = style')) {
        console.log(`⚠️  Padrão não reconhecido em: ${path.basename(filePath)}`);
        console.log('    Manual fix needed');
        return false;
      }
    }

    if (wasFixed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Corrigido: ${path.basename(filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    console.log(`❌ Erro ao corrigir ${path.basename(filePath)}: ${error.message}`);
    return false;
  }
}

// Processar arquivos em lotes pequenos para evitar problemas
const batchSize = 10;
let successCount = 0;
let failureCount = 0;

console.log(`📊 Processando ${problematicFiles.length} arquivos em lotes de ${batchSize}...\n`);

for (let i = 0; i < problematicFiles.length; i += batchSize) {
  const batch = problematicFiles.slice(i, i + batchSize);

  console.log(
    `\n🔄 Lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(problematicFiles.length / batchSize)}:`
  );

  for (const file of batch) {
    const success = fixMarginVariables(file);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }
}

console.log(`\n📊 RESULTADOS FINAIS:`);
console.log(`✅ Sucessos: ${successCount}`);
console.log(`❌ Falhas: ${failureCount}`);
console.log(`📊 Total: ${successCount + failureCount}`);

if (successCount > 0) {
  console.log(`\n🎉 ${successCount} componentes foram corrigidos automaticamente!`);
  console.log(`\n⚠️  Recomendação: Teste o build para verificar se não há problemas:`);
  console.log(`   npm run build`);
}

if (failureCount > 0) {
  console.log(`\n⚠️  ${failureCount} arquivos precisam de correção manual.`);
  console.log(`   Verifique os arquivos marcados como "Manual fix needed"`);
}
