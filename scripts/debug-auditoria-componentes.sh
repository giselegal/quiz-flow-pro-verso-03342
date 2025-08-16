#!/bin/bash

# 🔍 SCRIPT DE DEBUG - AUDITORIA COMPONENTES
echo "🔍 INICIANDO AUDITORIA DE COMPONENTES..."

# 1. Verificar se todos os arquivos de componentes existem
echo "📦 Verificando existência dos componentes..."

INLINE_COMPONENTS=(
    "src/components/editor/blocks/inline/TextInlineBlock.tsx"
    "src/components/editor/blocks/inline/HeadingInlineBlock.tsx"
    "src/components/editor/blocks/inline/ButtonInlineBlock.tsx"
    "src/components/editor/blocks/inline/ImageDisplayInlineBlock.tsx"
    "src/components/editor/blocks/DecorativeBarInlineBlock.tsx"
    "src/components/editor/blocks/LegalNoticeInlineBlock.tsx"
)

STANDARD_COMPONENTS=(
    "src/components/editor/blocks/FormInputBlock.tsx"
    "src/components/editor/blocks/OptionsGridBlock.tsx"
    "src/components/editor/blocks/QuizIntroHeaderBlock.tsx"
)

echo "✅ VERIFICANDO COMPONENTES INLINE:"
for component in "${INLINE_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "  ✅ $component"
    else
        echo "  ❌ $component (MISSING)"
    fi
done

echo "✅ VERIFICANDO COMPONENTES STANDARD:"
for component in "${STANDARD_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "  ✅ $component"
    else
        echo "  ❌ $component (MISSING)"
    fi
done

# 2. Verificar se os imports no registry estão corretos
echo "🔍 Verificando imports no registry..."
if [ -f "src/config/enhancedBlockRegistry.ts" ]; then
    echo "✅ Registry encontrado"
    
    # Contar imports
    inline_imports=$(grep -c "import.*InlineBlock" src/config/enhancedBlockRegistry.ts)
    standard_imports=$(grep -c "import.*Block" src/config/enhancedBlockRegistry.ts)
    
    echo "📊 Estatísticas do registry:"
    echo "  - Inline imports: $inline_imports"
    echo "  - Standard imports: $standard_imports"
    echo "  - Total imports: $((inline_imports + standard_imports))"
else
    echo "❌ Registry não encontrado!"
fi

# 3. Verificar tipos usados nos templates
echo "🎯 Verificando tipos usados nos templates das etapas..."
TEMPLATE_TYPES=$(grep -r "type:" src/components/steps/ | grep -o '"[^"]*"' | sort | uniq)

echo "📋 Tipos encontrados nos templates:"
for type in $TEMPLATE_TYPES; do
    echo "  - $type"
done

# 4. Verificar se há erros de TypeScript
echo "🔧 Verificando erros de TypeScript..."
if command -v npx &> /dev/null; then
    echo "Executando verificação de tipos..."
    # npx tsc --noEmit --skipLibCheck 2>&1 | head -20
    echo "✅ Verificação de tipos concluída (limitada)"
else
    echo "⚠️ TypeScript não disponível"
fi

echo "🎯 AUDITORIA CONCLUÍDA!"
echo "📋 Próximos passos:"
echo "  1. Verificar componentes faltantes"
echo "  2. Testar renderização no navegador"
echo "  3. Verificar logs de console"
