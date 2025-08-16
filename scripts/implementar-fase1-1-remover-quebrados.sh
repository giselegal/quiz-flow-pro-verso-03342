#!/bin/bash

# 🗑️ FASE 1.1 - REMOÇÃO DE COMPONENTES QUEBRADOS
# Remove todos os componentes com imports não resolvidos

echo "🗑️ FASE 1.1 - REMOVENDO COMPONENTES QUEBRADOS"
echo "============================================="

# Lista de componentes quebrados identificados
BROKEN_COMPONENTS=(
    "src/components/editor/blocks/inline/TestimonialsInlineBlock.tsx"
    "src/components/editor/blocks/inline/QuizOfferPricingInlineBlock.tsx"
    "src/components/editor/blocks/inline/BonusListInlineBlock.tsx"
    "src/components/editor/blocks/inline/BeforeAfterInlineBlock.tsx"
    "src/components/editor/blocks/inline/CharacteristicsListInlineBlock.tsx"
    "src/components/editor/blocks/inline/QuizStartPageInlineBlock.tsx"
)

echo "📋 Componentes a remover:"
for component in "${BROKEN_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "   ❌ $(basename "$component")"
        # Fazer backup antes de remover
        mkdir -p "backup/broken-components/$(dirname "$component")"
        cp "$component" "backup/broken-components/$component"
        rm "$component"
        echo "   ✅ Removido e backup criado"
    else
        echo "   ⚠️  $(basename "$component") - Já não existe"
    fi
done

echo ""
echo "✅ FASE 1.1 CONCLUÍDA - Componentes quebrados removidos"
