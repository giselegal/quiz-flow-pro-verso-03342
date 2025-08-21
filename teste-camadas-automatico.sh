#!/bin/bash

echo "🔍 TESTE AUTOMÁTICO: Camadas Canvas e Containers"
echo "=============================================="

# 1. Verificar se o servidor está ativo
echo "📡 Verificando servidor..."
SERVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082)
if [ "$SERVER_STATUS" = "200" ]; then
    echo "✅ Servidor ativo na porta 8082"
else
    echo "❌ Servidor não está respondendo (status: $SERVER_STATUS)"
    # Tentar outras portas
    for PORT in 8080 8081 8083 8084; do
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT 2>/dev/null)
        if [ "$STATUS" = "200" ]; then
            echo "✅ Servidor encontrado na porta $PORT"
            break
        fi
    done
fi

# 2. Verificar arquivos principais
echo ""
echo "📁 Verificando arquivos principais..."

FILES=(
    "src/pages/EditorUnified.tsx"
    "src/components/editor/unified/UnifiedPreviewEngine-drag.tsx" 
    "src/components/editor/unified/SortablePreviewBlockWrapper.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file encontrado"
    else
        echo "❌ $file não encontrado"
    fi
done

# 3. Análise de SortableContext duplicado
echo ""
echo "🔍 Verificando SortableContext duplicado..."

SORTABLE_COUNT_EDITOR=$(grep -c "SortableContext" src/pages/EditorUnified.tsx 2>/dev/null || echo "0")
SORTABLE_COUNT_ENGINE=$(grep -c "SortableContext" src/components/editor/unified/UnifiedPreviewEngine-drag.tsx 2>/dev/null || echo "0")

echo "SortableContext em EditorUnified.tsx: $SORTABLE_COUNT_EDITOR"
echo "SortableContext em UnifiedPreviewEngine-drag.tsx: $SORTABLE_COUNT_ENGINE"

if [[ "$SORTABLE_COUNT_EDITOR" -gt 0 ]] && [[ "$SORTABLE_COUNT_ENGINE" -gt 0 ]]; then
    echo "❌ PROBLEMA: SortableContext duplicado detectado"
else
    echo "✅ SortableContext único"
fi

# 4. Análise de estrutura de imports
echo ""
echo "📦 Verificando imports..."

if grep -q "UnifiedPreviewEngine-drag" src/pages/EditorUnified.tsx; then
    echo "✅ EditorUnified usa UnifiedPreviewEngine-drag (versão correta)"
else
    echo "❌ EditorUnified não usa UnifiedPreviewEngine-drag"
fi

# 5. Análise de droppable
echo ""
echo "🎯 Verificando configuração droppable..."

DROPPABLE_COUNT=$(grep -c "useDroppable\|setCanvasDroppableRef" src/pages/EditorUnified.tsx 2>/dev/null || echo "0")
echo "Configurações droppable encontradas: $DROPPABLE_COUNT"

if [ "$DROPPABLE_COUNT" -gt 0 ]; then
    echo "✅ Droppable configurado"
else
    echo "❌ Droppable não encontrado"
fi

# 6. Análise de modos
echo ""
echo "🎭 Verificando controle de modos..."

MODE_HANDLERS=$(grep -c "handleModeChange\|editorMode\|isPreviewing" src/pages/EditorUnified.tsx 2>/dev/null || echo "0")
echo "Handlers de modo encontrados: $MODE_HANDLERS"

if [ "$MODE_HANDLERS" -gt 5 ]; then
    echo "✅ Sistema de modos implementado"
else
    echo "⚠️ Sistema de modos pode estar incompleto"
fi

# 7. Análise de estilos conflitantes
echo ""
echo "🎨 Verificando estilos de background..."

UNIFIED_CANVAS_BG=$(grep -o "unified-editor-canvas.*bg-gradient" src/pages/EditorUnified.tsx 2>/dev/null | head -1)
PREVIEW_CONTAINER_BG=$(grep -o "preview-container.*bg-white" src/components/editor/unified/UnifiedPreviewEngine-drag.tsx 2>/dev/null | head -1)

if [ -n "$UNIFIED_CANVAS_BG" ] && [ -n "$PREVIEW_CONTAINER_BG" ]; then
    echo "⚠️ POSSÍVEL CONFLITO: Backgrounds diferentes detectados"
    echo "   Canvas: $UNIFIED_CANVAS_BG"
    echo "   Container: $PREVIEW_CONTAINER_BG"
else
    echo "✅ Sem conflitos óbvios de background"
fi

# 8. Verificar logs de debug
echo ""
echo "🐛 Verificando logs de debug..."

DEBUG_LOGS=$(grep -c "console.log.*DEBUG\|console.log.*🔧" src/pages/EditorUnified.tsx 2>/dev/null || echo "0")
echo "Logs de debug encontrados: $DEBUG_LOGS"

# 9. Análise de componentes relacionados
echo ""
echo "🧩 Verificando componentes relacionados..."

ENHANCED_SIDEBAR_EXISTS=$([ -f "src/components/editor/EnhancedComponentsSidebar.tsx" ] && echo "✅" || echo "❌")
DRAGGABLE_ITEM_EXISTS=$([ -f "src/components/editor/dnd/DraggableComponentItem.tsx" ] && echo "✅" || echo "❌")

echo "EnhancedComponentsSidebar: $ENHANCED_SIDEBAR_EXISTS"
echo "DraggableComponentItem: $DRAGGABLE_ITEM_EXISTS"

# 10. RESUMO FINAL
echo ""
echo "🎯 RESUMO DA ANÁLISE:"
echo "===================="

ISSUES=0

if [[ "$SORTABLE_COUNT_EDITOR" -gt 0 ]] && [[ "$SORTABLE_COUNT_ENGINE" -gt 0 ]]; then
    echo "❌ SortableContext duplicado"
    ((ISSUES++))
fi

if ! grep -q "UnifiedPreviewEngine-drag" src/pages/EditorUnified.tsx; then
    echo "❌ Engine incorreto sendo usado"
    ((ISSUES++))
fi

if [[ "$DROPPABLE_COUNT" -eq 0 ]]; then
    echo "❌ Droppable não configurado"
    ((ISSUES++))
fi

if [[ "$ISSUES" -eq 0 ]]; then
    echo "✅ ESTRUTURA PARECE CORRETA"
    echo "💡 Execute teste no browser para verificação completa:"
    echo "   1. Acesse http://localhost:8083/editor-unified"
    echo "   2. Cole o script teste-camadas-canvas-containers.js no console"
else
    echo "🔧 $ISSUES PROBLEMA(S) IDENTIFICADO(S)"
    echo "💡 Correções necessárias na estrutura"
fi

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Se problemas: Aplicar correções sugeridas"
echo "2. Se tudo OK: Testar drag & drop no browser"
echo "3. Verificar comportamento entre modos edit/preview"
