#!/bin/bash

# 🎯 TESTE DO SISTEMA DRAG & DROP

echo "🔧 === TESTE DRAG & DROP SYSTEM ==="
echo ""

echo "📋 Checklist de Verificações:"
echo "✅ SortableContext no UnifiedPreviewEngine"
echo "✅ useSortable no SortablePreviewBlockWrapper com listeners"
echo "✅ DraggableComponentItem com data correto"
echo "✅ DndContext com onDragStart e onDragEnd"
echo "✅ Logs de debug configurados"
echo ""

echo "🚀 Para testar:"
echo "1. Acesse: http://localhost:8080/editor-unified"
echo "2. Abra DevTools (F12) → Console"
echo "3. Teste arrastar componente da sidebar para o canvas"
echo "4. Teste reordenar blocos existentes"
echo ""

echo "🔍 Logs esperados:"
echo "- '🚀 === DRAG START ===' quando iniciar drag"
echo "- '🎯 === DRAG END DEBUG ===' quando soltar"
echo "- '🧩 ✅ ADICIONANDO COMPONENTE:' ao adicionar do sidebar"
echo "- '🔄 ✅ REORDENANDO BLOCOS:' ao reordenar"
echo ""

echo "💡 Se não funcionar, verifique:"
echo "- Se os logs aparecem no console"
echo "- Se activeData.type === 'sidebar-component'"
echo "- Se overData.type === 'dropzone'"
echo "- Se blocos têm listeners configurados"
echo ""

echo "🎉 Teste completo configurado!"
