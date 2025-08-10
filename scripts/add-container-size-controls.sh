#!/bin/bash

# Script para adicionar controles de tamanho de container unificado
echo "🎛️ ADICIONANDO CONTROLES DE TAMANHO DE CONTAINER"
echo "==============================================="

HOOK_FILE="src/hooks/useUnifiedProperties.ts"

# Backup
cp "$HOOK_FILE" "${HOOK_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Lista de componentes que precisam do controle
COMPONENTS=(
    "hero-section"
    "text-block"
    "image-block"
    "button-block"
    "video-block"
    "quote-block"
    "list-block"
    "card-block"
    "testimonial-block"
    "feature-block"
    "stats-block"
    "gallery-block"
    "cta-block"
    "spacer-block"
    "divider-block"
    "social-media-block"
)

echo "📋 Processando ${#COMPONENTS[@]} componentes..."

for component in "${COMPONENTS[@]}"; do
    echo "🔧 Adicionando controle para: $component"
    
    # Encontrar a linha após "return [" para cada componente
    # e adicionar o controle de tamanho do container
    sed -i "/case \"$component\":/,/return \[/{
        /return \[/ a\\
              // ✅ Controle de tamanho do container\\
              {\\
                key: \"containerSize\",\\
                type: PropertyType.RANGE,\\
                label: \"Tamanho do Container\",\\
                category: PropertyCategory.STYLE,\\
                value: currentBlock?.properties?.containerSize || 100,\\
                min: 50,\\
                max: 200,\\
                step: 5,\\
                unit: \"%\",\\
                description: \"Ajusta o tamanho geral do container do componente\"\\
              },
    }" "$HOOK_FILE"
done

echo ""
echo "✅ CONTROLES DE TAMANHO ADICIONADOS COM SUCESSO"
echo "==============================================="
echo "📝 Backup salvo em: ${HOOK_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
echo "🔍 Verificando resultado..."

# Verificar se as mudanças foram aplicadas
grep -n "containerSize" "$HOOK_FILE" | head -5

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "1. ✅ Controles de tamanho adicionados ao useUnifiedProperties"
echo "2. 🔄 Reiniciar servidor de desenvolvimento se necessário"
echo "3. 🧪 Testar controles no editor: http://localhost:8082/editor-fixed-dragdrop"
