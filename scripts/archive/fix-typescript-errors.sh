#!/bin/bash

# Script para corrigir erros de TypeScript nos arquivos de blocos
# Corrige tipos de parâmetros em funções getMarginClass

echo "🔧 Corrigindo tipos TypeScript nos blocos..."

# Lista de arquivos com funções getMarginClass que precisam de correção
FILES=(
    "src/components/blocks/inline/CountdownInlineBlock.tsx"
    "src/components/blocks/inline/DividerInlineBlock.tsx"
    "src/components/blocks/inline/LoadingAnimationBlock.tsx"
    "src/components/blocks/inline/QuizOfferCTAInlineBlock.tsx"
    "src/components/blocks/inline/QuizOfferPricingInlineBlock.tsx"
    "src/components/blocks/inline/ResultCardInlineBlock.tsx"
    "src/components/blocks/inline/SecondaryStylesInlineBlock.tsx"
    "src/components/blocks/inline/StepHeaderInlineBlock.tsx"
    "src/components/blocks/inline/StyleCharacteristicsInlineBlock.tsx"
    "src/components/blocks/inline/TestimonialCardInlineBlock.tsx"
    "src/components/blocks/inline/TestimonialsInlineBlock.tsx"
    "src/components/blocks/offer/HeroSectionBlock.tsx"
    "src/components/blocks/offer/SectionTitleBlock.tsx"
    "src/components/blocks/quiz/LoadingTransitionBlock.tsx"
    "src/components/blocks/quiz/QuizBenefitsBlock.tsx"
    "src/components/blocks/quiz/QuizIntroBlock.tsx"
    "src/components/blocks/quiz/QuizMultipleChoiceBlock.tsx"
    "src/components/blocks/quiz/QuizNavigationBlock.tsx"
    "src/components/blocks/quiz/QuizOptionsGridBlock.tsx"
    "src/components/blocks/quiz/QuizResultsBlock.tsx"
    "src/components/blocks/quiz/QuizResultsBlockEditor.tsx"
    "src/components/blocks/quiz/QuizTransitionBlock.tsx"
    "src/components/blocks/quiz/StartButtonBlock.tsx"
    "src/components/blocks/quiz/StrategicQuestionBlock.tsx"
)

# Corrigir tipos de parâmetros da função getMarginClass
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✏️  Corrigindo tipos em: $(basename "$file")"
        
        # Substituir const getMarginClass = (value, type) => { por const getMarginClass = (value: string | number, type: string): string => {
        sed -i 's/const getMarginClass = (value, type) => {/const getMarginClass = (value: string | number, type: string): string => {/g' "$file"
        
        echo "  ✅ Tipos corrigidos em: $(basename "$file")"
    else
        echo "  ⚠️  Arquivo não encontrado: $(basename "$file")"
    fi
done

echo ""
echo "✅ Correção de tipos concluída!"