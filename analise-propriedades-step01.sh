#!/bin/bash

echo "🔍 ANÁLISE COMPLETA - PROPRIEDADES DO STEP01"
echo "============================================"

echo ""
echo "📋 COMPONENTES USADOS NO STEP01:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Extrair tipos de componentes do Step01Intro.tsx
grep -o 'type: "[^"]*"' src/components/editor/steps/Step01Intro.tsx | sort | uniq | while read type_line; do
    component_type=$(echo "$type_line" | sed 's/type: "\([^"]*\)"/\1/')
    echo "  - $component_type"
done

echo ""
echo "🔍 VERIFICANDO MAPEAMENTO NO UniversalPropertiesPanel:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

grep -o 'type: "[^"]*"' src/components/editor/steps/Step01Intro.tsx | sort | uniq | while read type_line; do
    component_type=$(echo "$type_line" | sed 's/type: "\([^"]*\)"/\1/')
    
    if grep -q "\"$component_type\":" src/components/universal/UniversalPropertiesPanel.tsx; then
        echo "  ✅ $component_type: MAPEADO no painel"
    else
        echo "  ❌ $component_type: NÃO MAPEADO"
    fi
done

echo ""
echo "📊 PROPRIEDADES USADAS NO STEP01:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Extrair todas as propriedades usadas
grep -o '[a-zA-Z][a-zA-Z0-9]*:' src/components/editor/steps/Step01Intro.tsx | grep -v 'type:' | grep -v 'properties:' | sort | uniq | while read prop; do
    prop_name=$(echo "$prop" | sed 's/://')
    echo "  - $prop_name"
done

echo ""
echo "🚨 PROPRIEDADES CRÍTICAS QUE PRECISAM ESTAR NO PAINEL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. content (para text-inline com HTML)"
echo "  2. fontSize (text-3xl, text-4xl, text-xl, text-lg)"
echo "  3. fontFamily (Playfair Display)"
echo "  4. textAlign (text-center)"
echo "  5. color (#432818, #B89B7A)"
echo "  6. backgroundColor"
echo "  7. marginBottom, marginTop"
echo "  8. lineHeight"
echo "  9. fontWeight (font-bold)"
echo " 10. borderRadius (rounded-full)"
echo " 11. padding (py-4 px-8)"
echo " 12. boxShadow (shadow-xl)"

echo ""
echo "💡 RECOMENDAÇÕES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Adicionar mapeamentos específicos para:"
echo "   - quiz-intro-header"
echo "   - decorative-bar-inline"
echo "   - text-inline"
echo "   - image-display-inline"
echo "   - form-input"
echo "   - button-inline"
echo "   - legal-notice-inline"
echo ""
echo "2. Garantir que propriedades Tailwind sejam suportadas"
echo "3. Adicionar controles visuais para cores da marca"
echo "4. Implementar prévia em tempo real"

echo ""
echo "CONCLUÍDO! ✨"
