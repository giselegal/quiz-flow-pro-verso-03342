#!/bin/bash

echo "🔍 AUDITORIA COMPLETA DOS IMPORTS @ QUEBRADOS"
echo "============================================="

echo ""
echo "📁 Verificando TODOS os arquivos do caminho drag & drop:"

echo ""
echo "1️⃣ CORE FILES:"
echo "App.tsx:"
grep -n "from '@/" src/App.tsx | head -5

echo ""
echo "MainEditor.tsx:"
grep -n "from '@/" src/pages/MainEditor.tsx | head -5

echo ""
echo "2️⃣ EDITOR COMPONENTS:"
echo "EditorPro.tsx:"
grep -n "from '@/" src/components/editor/EditorPro.tsx | head -5

echo ""
echo "EditorProvider.tsx:"
grep -n "from '@/" src/components/editor/EditorProvider.tsx | head -5

echo ""
echo "ErrorBoundary.tsx:"
grep -n "from '@/" src/components/editor/ErrorBoundary.tsx | head -5

echo ""
echo "3️⃣ DRAG & DROP COMPONENTS:"
echo "CanvasDropZone.tsx:"
grep -n "from '@/" src/components/editor/canvas/CanvasDropZone.tsx | head -5

echo ""
echo "DraggableComponentItem.tsx:"
grep -n "from '@/" src/components/editor/dnd/DraggableComponentItem.tsx | head -5

echo ""
echo "🎯 RESUMO DOS PROBLEMAS ENCONTRADOS:"
echo "=================================="

TOTAL_BROKEN_IMPORTS=0

for file in "src/App.tsx" "src/pages/MainEditor.tsx" "src/components/editor/EditorPro.tsx" "src/components/editor/EditorProvider.tsx" "src/components/editor/ErrorBoundary.tsx" "src/components/editor/canvas/CanvasDropZone.tsx" "src/components/editor/dnd/DraggableComponentItem.tsx"; do
    if [ -f "$file" ]; then
        BROKEN_COUNT=$(grep -c "from '@/" "$file" 2>/dev/null || echo 0)
        TOTAL_BROKEN_IMPORTS=$((TOTAL_BROKEN_IMPORTS + BROKEN_COUNT))
        echo "$(basename "$file"): $BROKEN_COUNT imports @ quebrados"
    fi
done

echo ""
echo "🚨 TOTAL DE IMPORTS @ QUEBRADOS: $TOTAL_BROKEN_IMPORTS"
echo ""
if [ $TOTAL_BROKEN_IMPORTS -gt 0 ]; then
    echo "❌ DIAGNÓSTICO: Sistema de drag & drop completamente quebrado por imports @"
    echo "💡 SOLUÇÃO: Corrigir todos os $TOTAL_BROKEN_IMPORTS imports ou configurar alias @"
else
    echo "✅ TODOS OS IMPORTS @ CORRIGIDOS - investigar outros problemas"
fi
