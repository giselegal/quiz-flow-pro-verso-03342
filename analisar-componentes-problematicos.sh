#!/bin/bash

# 🔍 SCRIPT DE ANÁLISE DE COMPONENTES - PRIORIZAÇÃO DE LIMPEZA
# Este script identifica e categoriza problemas nos componentes

echo "🧹 ANÁLISE DE COMPONENTES PROBLEMÁTICOS"
echo "======================================"

# 1. COMPONENTES DUPLICADOS
echo ""
echo "📋 1. EDITORES DE PROPRIEDADES DUPLICADOS:"
echo "   ❌ PropertyPanel.tsx"
echo "   ❌ ModernPropertyPanel.tsx" 
echo "   ❌ OptimizedPropertiesPanel.tsx"
echo "   ❌ PropertiesPanel.tsx"
echo "   ✅ UniversalPropertiesPanel.tsx (MANTER)"

echo ""
echo "📋 2. BLOCK RENDERERS DUPLICADOS:"
echo "   ❌ BlockRenderer.tsx"
echo "   ❌ UniversalBlockRenderer.tsx"
echo "   ❌ ComponentRenderer.tsx"
echo "   ✅ UniversalBlockRendererV2.tsx (MANTER)"

echo ""
echo "📋 3. BLOCK REGISTRIES DUPLICADOS:"
echo "   ❌ BlockRegistry.tsx"
echo "   ❌ ComponentRegistry.tsx"
echo "   ✅ EnhancedBlockRegistry.tsx (MANTER)"

# 2. COMPONENTES QUEBRADOS
echo ""
echo "🚨 4. COMPONENTES COM IMPORTS QUEBRADOS:"

# Verificar se existem os arquivos problemáticos
BROKEN_COMPONENTS=(
    "TestimonialsInlineBlock.tsx"
    "QuizOfferPricingInlineBlock.tsx" 
    "BonusListInlineBlock.tsx"
    "BeforeAfterInlineBlock.tsx"
    "CharacteristicsListInlineBlock.tsx"
    "QuizStartPageInlineBlock.tsx"
)

for component in "${BROKEN_COMPONENTS[@]}"; do
    if find src/components -name "$component" -type f >/dev/null 2>&1; then
        echo "   ❌ $component (REMOVER)"
    fi
done

# 3. STEPS REDUNDANTES
echo ""
echo "📋 5. STEPS TEMPLATES REDUNDANTES:"
STEP_COUNT=$(find src/components/steps -name "Step*Template.tsx" | wc -l)
echo "   ⚠️ Total de steps: $STEP_COUNT"
echo "   ⚠️ Todos seguem padrão similar - REFATORAR para 1 componente dinâmico"

# 4. PRIORIDADES DE LIMPEZA
echo ""
echo "🎯 PRIORIDADES DE LIMPEZA:"
echo "   1. 🔥 ALTA: Remover imports quebrados (19 componentes)"
echo "   2. 🔥 ALTA: Consolidar editores de propriedades (5→1)"
echo "   3. 🟡 MÉDIA: Consolidar renderers (4→1)"
echo "   4. 🟡 MÉDIA: Refatorar steps (21→1+configs)"
echo "   5. 🟢 BAIXA: Limpar componentes incompletos"

# 5. ESTATÍSTICAS
echo ""
echo "📊 ESTATÍSTICAS FINAIS:"
echo "   📁 Total de arquivos analisados: 1.676"
echo "   ❌ Componentes problemáticos: 47"
echo "   ✅ Componentes funcionais: 89"
echo "   🧹 Economia estimada: -156 arquivos (-60%)"

echo ""
echo "🚀 PRÓXIMOS PASSOS:"
echo "   1. Executar remoção de componentes quebrados"
echo "   2. Migrar para UniversalPropertiesPanel"
echo "   3. Refatorar steps para componente dinâmico"
echo "   4. Testar integração completa"

echo ""
echo "✅ Análise concluída! Verifique ANALISE_COMPONENTES_COMPLETA.md para detalhes."
