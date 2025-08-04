#!/bin/bash

# Sistema de validação automática de componentes

echo "🔍 VALIDAÇÃO AUTOMÁTICA DE COMPONENTES"
echo "====================================="

# Verificar cores da marca
check_brand_colors() {
    local file="$1"
    local brand_colors=0
    local old_colors=0
    
    # Contar cores da marca
    brand_colors=$(grep -c "#B89B7A\|#D4C2A8\|#432818" "$file" 2>/dev/null || echo 0)
    
    # Contar cores antigas
    old_colors=$(grep -c "bg-blue-\|bg-yellow-\|bg-orange-\|text-blue-" "$file" 2>/dev/null || echo 0)
    
    if [ $old_colors -gt 0 ]; then
        echo "❌ $(basename $file) - $old_colors cores antigas encontradas"
        return 1
    elif [ $brand_colors -gt 0 ]; then
        echo "✅ $(basename $file) - $brand_colors cores da marca"
        return 0
    else
        echo "⚪ $(basename $file) - sem cores específicas"
        return 0
    fi
}

# Verificar propriedades padrão
check_properties() {
    local file="$1"
    
    if grep -q "useUnifiedProperties\|UniversalPropertiesPanel" "$file" 2>/dev/null; then
        echo "✅ $(basename $file) - usando sistema unificado"
        return 0
    elif grep -q "PropertiesPanel\|PropertyPanel" "$file" 2>/dev/null; then
        echo "⚠️  $(basename $file) - usando painel antigo"
        return 1
    else
        return 0
    fi
}

# Executar validação
echo "🎨 Validando cores da marca..."
colors_ok=0
colors_total=0

echo "🎛️ Validando painéis de propriedades..."
panels_ok=0
panels_total=0

find /workspaces/quiz-quest-challenge-verse/src/components -name "*.tsx" | while read file; do
    if check_brand_colors "$file"; then
        ((colors_ok++))
    fi
    ((colors_total++))
    
    if check_properties "$file"; then
        ((panels_ok++))
    fi
    ((panels_total++))
done

echo ""
echo "📊 RESULTADO DA VALIDAÇÃO:"
echo "   🎨 Cores: $colors_ok/$colors_total componentes em conformidade"
echo "   🎛️ Painéis: $panels_ok/$panels_total componentes modernizados"
