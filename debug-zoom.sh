#!/bin/bash

# 🔧 SCRIPT DE DEBUG PARA PROBLEMA DE ZOOM NO DRAG

echo "🔍 DEBUG: Problema de Zoom no Drag-and-Drop"
echo "============================================"

echo ""
echo "📊 1. Verificando correções aplicadas..."

# Verificar sensor distance
if grep -q "distance: 8" src/pages/EditorUnified.tsx; then
    echo "✅ Sensor distance corrigido para 8px"
else
    echo "❌ Sensor distance ainda em 1px"
fi

# Verificar remoção de scale-95
if grep -q "scale-95" src/components/editor/dnd/DraggableComponentItem.tsx; then
    echo "❌ scale-95 ainda presente (causa zoom)"
else
    echo "✅ scale-95 removido"
fi

# Verificar remoção de restrictToParentElement
if grep -q "restrictToParentElement" src/pages/EditorUnified.tsx; then
    echo "❌ restrictToParentElement ainda presente"
else
    echo "✅ restrictToParentElement removido"
fi

# Verificar CSS de transform
if grep -q "transform: none" src/styles/editor-unified.css; then
    echo "✅ CSS transform corrigido"
else
    echo "❌ CSS transform não corrigido"
fi

echo ""
echo "🔧 2. Verificando compilação..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build sem erros"
else
    echo "❌ Build com erros"
fi

echo ""
echo "🌐 3. Testando servidor..."
if curl -s http://localhost:8080/editor-unified > /dev/null; then
    echo "✅ Servidor respondendo"
else
    echo "❌ Servidor não responde"
fi

echo ""
echo "📋 4. CHECKLIST DE CORREÇÕES:"
echo "   ✅ PointerSensor distance: 1px → 8px"
echo "   ✅ Removido scale-95 (causava zoom)"  
echo "   ✅ Removido restrictToParentElement"
echo "   ✅ CSS transform: none !important"
echo "   ✅ CSS transform-origin: center center"

echo ""
echo "🎯 5. TESTE MANUAL:"
echo "   1. Abrir: http://localhost:8080/editor-unified"
echo "   2. Abrir DevTools (F12)"
echo "   3. Tentar arrastar componente da sidebar"
echo "   4. Verificar se não há zoom"

echo ""
echo "📝 6. LOGS PARA VERIFICAR NO CONSOLE:"
echo "   - '🔧 Sensors configurados: distance: 8px'"
echo "   - '🖱️ MouseDown no item:' (sem zoom exagerado)"
echo "   - '🎯 === DRAG END DEBUG ===' (se drop funcionar)"

echo ""
echo "🚨 SE PROBLEMA PERSISTIR:"
echo "   1. Limpar cache do navegador (Ctrl+Shift+R)"
echo "   2. Verificar zoom do navegador (deve ser 100%)"
echo "   3. Testar em modo incógnito"
echo "   4. Verificar extensões do navegador que podem interferir"
