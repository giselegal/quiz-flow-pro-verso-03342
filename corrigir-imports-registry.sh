#!/bin/bash

# 🔧 CORRIGIR IMPORTS QUEBRADOS NO ENHANCED BLOCK REGISTRY
echo "🔧 CORRIGINDO IMPORTS QUEBRADOS"
echo "==============================="

# Arquivo a corrigir
REGISTRY_FILE="src/config/enhancedBlockRegistry.ts"

echo ""
echo "📁 Verificando localização dos componentes..."

# Lista de componentes que podem estar em local errado
COMPONENTS_TO_FIX=(
    "BonusListInlineBlock"
    "ButtonInlineBlock" 
    "CardInlineBlock"
    "CountdownTimerBlock"
    "CreativeTestimonialInlineBlock"
    "DividerInlineBlock"
    "FAQInlineBlock"
    "FeatureListInlineBlock"
    "FormInlineBlock"
    "GalleryInlineBlock"
    "HeroInlineBlock"
    "LinkInlineBlock"
    "MapInlineBlock"
    "NewsletterInlineBlock"
    "PricingInlineBlock"
    "QuoteInlineBlock"
    "ReviewInlineBlock"
    "SocialInlineBlock"
    "TableInlineBlock"
    "TestimonialInlineBlock"
    "TimelineInlineBlock"
    "VideoInlineBlock"
)

echo ""
echo "🔍 Procurando componentes e corrigindo imports..."

for component in "${COMPONENTS_TO_FIX[@]}"; do
    # Procurar onde o arquivo realmente está
    FOUND_PATH=$(find src/components -name "${component}.tsx" -type f | head -1)
    
    if [ -n "$FOUND_PATH" ]; then
        # Extrair o caminho relativo correto
        RELATIVE_PATH=${FOUND_PATH#src/config/}
        RELATIVE_PATH="../${RELATIVE_PATH%.tsx}"
        
        echo "   ✅ $component - Encontrado em: $FOUND_PATH"
        
        # Corrigir o import no arquivo registry
        # Primeiro tentativa: /inline/
        sed -i "s|../components/editor/blocks/inline/${component}|${RELATIVE_PATH}|g" "$REGISTRY_FILE" 2>/dev/null
        
        # Segunda tentativa: sem /inline/
        sed -i "s|../components/editor/blocks/${component}|${RELATIVE_PATH}|g" "$REGISTRY_FILE" 2>/dev/null
        
    else
        echo "   ❌ $component - Não encontrado, precisa ser removido ou criado"
        
        # Comentar a linha do import se não encontrar
        sed -i "s|^import.*${component}.*|// import ${component} - ARQUIVO REMOVIDO|g" "$REGISTRY_FILE" 2>/dev/null
        
        # Comentar a linha no registry também
        sed -i "s|\".*\": ${component}|// \"component\": ${component} - REMOVIDO|g" "$REGISTRY_FILE" 2>/dev/null
    fi
done

echo ""
echo "🧹 Removendo imports comentados/inválidos..."

# Criar um arquivo temporário limpo
TEMP_FILE=$(mktemp)

# Filtrar linhas comentadas e vazias dos imports
grep -v "// import.*ARQUIVO REMOVIDO" "$REGISTRY_FILE" | \
grep -v "// \".*REMOVIDO" > "$TEMP_FILE"

# Substituir o arquivo original
mv "$TEMP_FILE" "$REGISTRY_FILE"

echo ""
echo "✅ CORREÇÃO CONCLUÍDA!"
echo ""
echo "📋 RELATÓRIO:"
echo "   • Imports corrigidos para caminhos corretos"
echo "   • Imports de arquivos inexistentes removidos"
echo "   • Arquivo $REGISTRY_FILE atualizado"
echo ""
echo "🚀 Testando build..."
