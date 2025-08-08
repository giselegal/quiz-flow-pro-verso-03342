#!/bin/bash

# Script para remover todas as funções getMarginClass problemáticas dos blocos
# e simplificar a estrutura para evitar erros de TypeScript

echo "🔧 Removendo funções getMarginClass problemáticas..."

# Lista de arquivos problemáticos
FILES=(
    "src/components/blocks/inline/QuizOfferCTAInlineBlock.tsx"
    "src/components/blocks/inline/QuizOfferPricingInlineBlock.tsx"
    "src/components/blocks/inline/ResultCardInlineBlock.tsx"
    "src/components/blocks/inline/SecondaryStylesInlineBlock.tsx"
    "src/components/blocks/inline/StepHeaderInlineBlock.tsx"
    "src/components/blocks/inline/StyleCharacteristicsInlineBlock.tsx"
    "src/components/blocks/inline/TestimonialCardInlineBlock.tsx"
    "src/components/blocks/inline/TestimonialsInlineBlock.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  🛠️  Simplificando: $(basename "$file")"
        
        # Remover função getMarginClass e suas chamadas
        sed -i '/const getMarginClass = /,/^};$/d' "$file"
        sed -i 's/getMarginClass([^,]*,[^)]*),//g' "$file"
        sed -i 's/getMarginClass([^,]*,[^)]*)//g' "$file"
        sed -i '/marginTop\|marginBottom\|marginLeft\|marginRight/d' "$file"
        
        echo "  ✅ Simplificado: $(basename "$file")"
    fi
done

echo ""
echo "✅ Simplificação concluída!"