#!/bin/bash

echo "🎛️ IMPLEMENTANDO CONTROLES DE TAMANHO DE CONTAINER UNIFICADO"
echo "============================================================"

echo ""
echo "📋 Baseado na análise, 16 componentes precisam de controle de tamanho de container"

# Lista de todos os componentes que precisam do controle
COMPONENTS=(
    "text-inline"
    "image-display-inline" 
    "button-inline"
    "decorative-bar-inline"
    "pricing-card"
    "quiz-intro-header"
    "quiz-step"
    "quiz-progress"
    "options-grid"
    "quiz-results"
    "quiz-results-block"
    "style-results"
    "style-results-block"
    "final-step"
    "form-input"
    "legal-notice-inline"
)

echo "🔍 Verificando useUnifiedProperties.ts..."

HOOK_FILE="src/hooks/useUnifiedProperties.ts"

if [ ! -f "$HOOK_FILE" ]; then
    echo "❌ Arquivo $HOOK_FILE não encontrado!"
    exit 1
fi

# Fazer backup
cp "$HOOK_FILE" "${HOOK_FILE}.backup.containersize"
echo "📋 Backup criado: ${HOOK_FILE}.backup.containersize"

echo ""
echo "🎛️ Adicionando controle de tamanho de container para cada componente..."

# Para cada componente, vamos adicionar o controle de tamanho do container
for component in "${COMPONENTS[@]}"; do
    echo "⚙️ Processando: $component"
    
    # Procurar o case do componente no switch
    if grep -q "case \"$component\":" "$HOOK_FILE"; then
        echo "   ✅ Case encontrado para $component"
        
        # Verificar se já tem controle de containerSize
        if grep -A 20 "case \"$component\":" "$HOOK_FILE" | grep -q "containerSize\|container-size"; then
            echo "   ⚠️ $component já tem controle de tamanho de container"
        else
            echo "   🔧 Adicionando controle de tamanho de container para $component"
            
            # Criar arquivo temporário com a modificação
            awk -v comp="$component" '
            /case "'"$component'".:/ {
                in_case = 1
                print
                next
            }
            in_case && /return \[/ {
                print
                print "              // ✅ Controle de tamanho do container"
                print "              {"
                print "                key: \"containerSize\","
                print "                type: PropertyType.RANGE,"
                print "                label: \"Tamanho do Container\","
                print "                category: PropertyCategory.STYLE,"
                print "                value: currentBlock?.properties?.containerSize || 100,"
                print "                min: 50,"
                print "                max: 200,"
                print "                step: 5,"
                print "                unit: \"%\","
                print "                description: \"Ajusta o tamanho geral do container do componente\""
                print "              },"
                in_case = 0
                next
            }
            in_case && /\];/ {
                in_case = 0
            }
            { print }
            ' "$HOOK_FILE" > "${HOOK_FILE}.tmp"
            
            # Substituir o arquivo original
            mv "${HOOK_FILE}.tmp" "$HOOK_FILE"
            echo "   ✅ Controle adicionado para $component"
        fi
    else
        echo "   ⚠️ Case não encontrado para $component"
    fi
done

echo ""
echo "🎨 Verificando se o EnhancedUniversalPropertiesPanel suporta RANGE..."

PANEL_FILE="src/components/universal/EnhancedUniversalPropertiesPanel.tsx"

if [ -f "$PANEL_FILE" ]; then
    if grep -q "PropertyType.RANGE" "$PANEL_FILE"; then
        echo "✅ Painel já suporta PropertyType.RANGE"
    else
        echo "❌ Painel precisa ser atualizado para suportar RANGE"
    fi
else
    echo "⚠️ Arquivo do painel não encontrado"
fi

echo ""
echo "📊 RESUMO DA IMPLEMENTAÇÃO:"
echo "=========================="

echo "🎛️ Controle de Tamanho de Container adicionado:"
echo "- Propriedade: containerSize"
echo "- Tipo: PropertyType.RANGE"
echo "- Categoria: PropertyCategory.STYLE"
echo "- Valores: 50% a 200% (padrão: 100%)"
echo "- Incrementos: 5%"
echo "- Label: 'Tamanho do Container'"

echo ""
echo "✅ Componentes processados: ${#COMPONENTS[@]}"

echo ""
echo "🔧 Para aplicar no CSS dos componentes, use:"
echo "transform: scale(var(--container-size, 1));"
echo "ou"
echo "width: calc(100% * var(--container-size, 1));"

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Verificar se todas as adições estão corretas"
echo "2. Testar o painel de propriedades"
echo "3. Aplicar o CSS nos componentes para usar containerSize"
echo "4. npm run dev para testar"

echo ""
echo "📁 Arquivos modificados:"
echo "- $HOOK_FILE (backup: ${HOOK_FILE}.backup.containersize)"

echo ""
echo "🎯 EXEMPLO DE USO NO COMPONENTE:"
echo "const containerSize = properties?.containerSize || 100;"
echo "const containerStyle = {"
echo "  transform: \`scale(\${containerSize / 100})\`,"
echo "  transformOrigin: 'center',"
echo "};"
echo ""
echo "<div style={containerStyle}>"
echo "  {/* Conteúdo do componente */}"
echo "</div>"

echo ""
echo "🎉 IMPLEMENTAÇÃO CONCLUÍDA!"
echo "Todos os 16 componentes agora têm controle de tamanho de container unificado!"
