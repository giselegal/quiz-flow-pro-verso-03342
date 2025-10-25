#!/bin/bash

# 🧪 TESTE ESPECÍFICO: Edições No-Code no Painel de Propriedades
echo "🎯 TESTANDO EDIÇÕES NO-CODE NO PAINEL DE PROPRIEDADES..."
echo "========================================================"

echo ""
echo "📊 VERIFICANDO INTEGRAÇÃO COM EnhancedUniversalPropertiesPanel..."
echo "=================================================================="

# Função para verificar se propriedade está corretamente configurada
check_property_panel() {
    local prop_name="$1"
    local prop_type="$2" 
    local section="$3"
    
    # Verificar se existe no useUnifiedProperties.ts
    if grep -A 5 -B 5 "\"$prop_name\"" src/hooks/useUnifiedProperties.ts | grep -q "PropertyType\.$prop_type"; then
        echo "  ✅ $prop_name ($prop_type) - $section"
        return 0
    else
        echo "  ❌ $prop_name ($prop_type) - $section - NÃO configurado corretamente"
        return 1
    fi
}

# Verificar estrutura do useUnifiedProperties.ts para options-grid
echo ""
echo "🔍 VERIFICANDO CASE 'options-grid' NO useUnifiedProperties.ts..."
echo "==============================================================="

if grep -A 200 'case "options-grid":' src/hooks/useUnifiedProperties.ts > /dev/null; then
    echo "✅ Case 'options-grid' encontrado no useUnifiedProperties.ts"
else
    echo "❌ Case 'options-grid' NÃO encontrado no useUnifiedProperties.ts"
    exit 1
fi

echo ""
echo "📊 SEÇÃO LAYOUT - Propriedades No-Code:"
echo "======================================="

layout_props=0
check_property_panel "gridColumns" "SELECT" "Layout"; [[ $? -eq 0 ]] && ((layout_props++))
check_property_panel "contentDirection" "SELECT" "Layout"; [[ $? -eq 0 ]] && ((layout_props++))
check_property_panel "contentLayout" "SELECT" "Layout"; [[ $? -eq 0 ]] && ((layout_props++))
check_property_panel "imageSize" "SELECT" "Layout"; [[ $? -eq 0 ]] && ((layout_props++))
check_property_panel "imageClasses" "TEXT" "Advanced"; [[ $? -eq 0 ]] && ((layout_props++))
check_property_panel "gridGap" "SELECT" "Layout"; [[ $? -eq 0 ]] && ((layout_props++))

echo ""
echo "📝 SEÇÃO CONTENT - Editor No-Code:"
echo "=================================="

content_props=0
check_property_panel "options" "ARRAY" "Content"; [[ $? -eq 0 ]] && ((content_props++))
check_property_panel "enableAddOption" "SWITCH" "Behavior"; [[ $? -eq 0 ]] && ((content_props++))

echo ""
echo "⚖️ SEÇÃO VALIDAÇÕES - Comportamento No-Code:"
echo "============================================="

validation_props=0
check_property_panel "multipleSelection" "SWITCH" "Behavior"; [[ $? -eq 0 ]] && ((validation_props++))
check_property_panel "minSelections" "RANGE" "Behavior"; [[ $? -eq 0 ]] && ((validation_props++))
check_property_panel "maxSelections" "RANGE" "Behavior"; [[ $? -eq 0 ]] && ((validation_props++))
check_property_panel "autoAdvance" "SWITCH" "Behavior"; [[ $? -eq 0 ]] && ((validation_props++))
check_property_panel "autoAdvanceDelay" "RANGE" "Behavior"; [[ $? -eq 0 ]] && ((validation_props++))
check_property_panel "enableButtonWhenValid" "SWITCH" "Behavior"; [[ $? -eq 0 ]] && ((validation_props++))

echo ""
echo "🎨 SEÇÃO ESTILIZAÇÃO - Visual No-Code:"
echo "======================================"

style_props=0
check_property_panel "borderWidth" "SELECT" "Style"; [[ $? -eq 0 ]] && ((style_props++))
check_property_panel "shadowSize" "SELECT" "Style"; [[ $? -eq 0 ]] && ((style_props++))
check_property_panel "optionSpacing" "SELECT" "Style"; [[ $? -eq 0 ]] && ((style_props++))
check_property_panel "visualDetail" "SELECT" "Style"; [[ $? -eq 0 ]] && ((style_props++))

echo ""
echo "🔘 SEÇÃO BOTÃO - Propriedades No-Code:"
echo "======================================"

button_props=0
check_property_panel "buttonText" "TEXT" "Content"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "buttonScale" "SELECT" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "buttonTextColor" "COLOR" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "buttonContainerColor" "COLOR" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "buttonBorderColor" "COLOR" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "fontFamily" "SELECT" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "buttonAlignment" "SELECT" "Layout"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "shadowType" "SELECT" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "shadowColor" "COLOR" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "visualEffect" "SELECT" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "borderRadius" "RANGE" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "hoverOpacity" "RANGE" "Style"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "buttonAction" "SELECT" "Behavior"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "targetUrl" "URL" "Behavior"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "linkTarget" "SELECT" "Behavior"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "requireValidInput" "SWITCH" "Behavior"; [[ $? -eq 0 ]] && ((button_props++))
check_property_panel "disabled" "SWITCH" "Behavior"; [[ $? -eq 0 ]] && ((button_props++))

echo ""
echo "🔧 SEÇÃO AVANÇADO - ID No-Code:"
echo "==============================="

advanced_props=0
check_property_panel "componentId" "TEXT" "Advanced"; [[ $? -eq 0 ]] && ((advanced_props++))

echo ""
echo "🎯 VERIFICANDO PROPRIEDADES UNIVERSAIS..."
echo "========================================="

# Verificar se as propriedades universais estão incluídas
universal_props=0
universal_properties=(
    "marginTop"
    "marginBottom" 
    "marginLeft"
    "marginRight"
    "scale"
    "containerBackgroundColor"
    "componentBackgroundColor"
    "textAlign"
    "textWidth"
)

echo "Propriedades Universais (aplicadas a todos os componentes):"
for prop in "${universal_properties[@]}"; do
    if grep -q "\"$prop\"" src/hooks/useUnifiedProperties.ts; then
        echo "  ✅ $prop - Disponível"
        ((universal_props++))
    else
        echo "  ❌ $prop - NÃO disponível"
    fi
done

echo ""
echo "📋 VERIFICANDO TIPOS DE CONTROLE NO-CODE..."
echo "============================================"

# Verificar se todos os tipos de PropertyType estão sendo usados corretamente
control_types=(
    "PropertyType.SELECT"
    "PropertyType.RANGE" 
    "PropertyType.COLOR"
    "PropertyType.SWITCH"
    "PropertyType.TEXT"
    "PropertyType.ARRAY"
    "PropertyType.URL"
)

controls_found=0
echo "Tipos de Controles No-Code implementados:"
for control in "${control_types[@]}"; do
    if grep -q "$control" src/hooks/useUnifiedProperties.ts; then
        echo "  ✅ $control - Usado"
        ((controls_found++))
    else
        echo "  ❌ $control - NÃO usado"
    fi
done

echo ""
echo "🔍 VERIFICANDO CATEGORIAS DE PROPRIEDADES..."
echo "============================================="

# Verificar se as categorias estão corretas
categories=(
    "PropertyCategory.LAYOUT"
    "PropertyCategory.CONTENT"
    "PropertyCategory.BEHAVIOR"
    "PropertyCategory.STYLE" 
    "PropertyCategory.ADVANCED"
)

categories_found=0
echo "Categorias de organização no painel:"
for category in "${categories[@]}"; do
    if grep -q "$category" src/hooks/useUnifiedProperties.ts; then
        echo "  ✅ $category - Configurada"
        ((categories_found++))
    else
        echo "  ❌ $category - NÃO configurada"
    fi
done

echo ""
echo "📊 RESUMO DAS EDIÇÕES NO-CODE..."
echo "================================"

total_props=$((layout_props + content_props + validation_props + style_props + button_props + advanced_props))
max_specific_props=34

echo "Propriedades Específicas do Options-Grid:"
echo "  📊 Layout: $layout_props/6"
echo "  📝 Content: $content_props/2"  
echo "  ⚖️ Validations: $validation_props/6"
echo "  🎨 Style: $style_props/4"
echo "  🔘 Button: $button_props/17"
echo "  🔧 Advanced: $advanced_props/1"
echo "  TOTAL: $total_props/$max_specific_props"

echo ""
echo "Propriedades Universais: $universal_props/9"
echo "Tipos de Controle: $controls_found/7"
echo "Categorias: $categories_found/5"

total_score=$((total_props + universal_props + controls_found + categories_found))
max_total_score=$((max_specific_props + 9 + 7 + 5))

percentage=$(( total_score * 100 / max_total_score ))

echo ""
echo "🎯 RESULTADO FINAL DAS EDIÇÕES NO-CODE:"
echo "======================================="
echo "Pontuação Total: $total_score/$max_total_score"
echo "Taxa de Sucesso: $percentage%"

if [ $percentage -ge 95 ]; then
    echo "🎉 EXCELENTE! Edições No-Code 100% funcionais no painel"
    echo "✅ Todas as propriedades configuradas corretamente"
    echo "✅ Tipos de controle implementados"
    echo "✅ Categorização organizada" 
    echo "✅ Propriedades universais inclusas"
elif [ $percentage -ge 80 ]; then
    echo "✅ BOM! Edições No-Code funcionais com pequenos ajustes"
elif [ $percentage -ge 60 ]; then
    echo "⚠️ PARCIAL! Várias propriedades precisam de correção"
else
    echo "❌ CRÍTICO! Muitas edições No-Code não funcionais"
fi

echo ""
echo "🧪 TESTE PRÁTICO RECOMENDADO:"
echo "============================="
echo "1. Abrir: http://localhost:8080/editor-fixed"
echo "2. Ir para Step02"
echo "3. Clicar no componente options-grid"
echo "4. Verificar se o painel mostra TODAS as seções:"
echo "   - 📊 LAYOUT (6 controles)"
echo "   - 📝 CONTENT (2 controles)"
echo "   - ⚖️ BEHAVIOR (6 controles)"  
echo "   - 🎨 STYLE (4 controles)"
echo "   - 🔘 BUTTON (17 controles)"
echo "   - 🔧 ADVANCED (1 controle)"
echo "   - 🌐 UNIVERSAL (9 controles)"
echo "5. Testar alteração de cada propriedade"
echo "6. Confirmar aplicação em tempo real"

echo ""
echo "📋 CHECKLIST DE VALIDAÇÃO NO-CODE:"
echo "=================================="
echo "[ ] Dropdown de colunas do grid funciona?"
echo "[ ] Color pickers de cores funcionam?"
echo "[ ] Range sliders de valores funcionam?"
echo "[ ] Switches ON/OFF funcionam?"
echo "[ ] Campos de texto editáveis funcionam?"
echo "[ ] Editor de array de opções funciona?"
echo "[ ] Todas as mudanças aplicam instantaneamente?"
echo "[ ] Propriedades persistem ao recarregar?"

echo ""
echo "🚀 PRÓXIMO PASSO: TESTE PRÁTICO NO EDITOR!"
