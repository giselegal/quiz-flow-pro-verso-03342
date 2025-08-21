#!/bin/bash

# 🔧 SCRIPT DE TESTE DO DRAG-AND-DROP - EDITOR UNIFIED

echo "🎯 TESTANDO DRAG-AND-DROP NO EDITOR UNIFIED"
echo "=============================================="

# Verificar se o servidor está rodando
echo "📡 1. Verificando servidor..."
if curl -s http://localhost:8080/editor-unified > /dev/null; then
    echo "✅ Servidor respondendo em http://localhost:8080"
else
    echo "❌ Servidor não está respondendo"
    exit 1
fi

# Verificar estrutura de arquivos DnD
echo ""
echo "📁 2. Verificando arquivos DnD..."

# EditorUnified.tsx
if [ -f "src/pages/EditorUnified.tsx" ]; then
    echo "✅ EditorUnified.tsx encontrado"
    
    # Verificar imports do @dnd-kit
    if grep -q "@dnd-kit/core" src/pages/EditorUnified.tsx; then
        echo "✅ Imports @dnd-kit/core presentes"
    else
        echo "❌ Imports @dnd-kit/core ausentes"
    fi
    
    # Verificar DndContext
    if grep -q "DndContext" src/pages/EditorUnified.tsx; then
        echo "✅ DndContext implementado"
    else
        echo "❌ DndContext não encontrado"
    fi
    
    # Verificar handleDragEnd
    if grep -q "handleDragEnd" src/pages/EditorUnified.tsx; then
        echo "✅ handleDragEnd implementado"
    else
        echo "❌ handleDragEnd não encontrado"
    fi
else
    echo "❌ EditorUnified.tsx não encontrado"
fi

# EnhancedComponentsSidebar
if [ -f "src/components/editor/EnhancedComponentsSidebar.tsx" ]; then
    echo "✅ EnhancedComponentsSidebar.tsx encontrado"
else
    echo "❌ EnhancedComponentsSidebar.tsx não encontrado"
fi

# DraggableComponentItem
if [ -f "src/components/editor/dnd/DraggableComponentItem.tsx" ]; then
    echo "✅ DraggableComponentItem.tsx encontrado"
else
    echo "❌ DraggableComponentItem.tsx não encontrado"
fi

# Verificar CSS
echo ""
echo "🎨 3. Verificando CSS..."
if [ -f "src/styles/editor-unified.css" ]; then
    echo "✅ editor-unified.css encontrado"
    
    # Verificar overflow: visible
    if grep -q "overflow: visible" src/styles/editor-unified.css; then
        echo "✅ overflow: visible configurado"
    else
        echo "❌ overflow: visible não encontrado"
    fi
else
    echo "❌ editor-unified.css não encontrado"
fi

# Verificar erros de compilação
echo ""
echo "🔍 4. Verificando erros de compilação..."
if command -v npm &> /dev/null; then
    echo "Checando tipos TypeScript..."
    # Executar verificação de tipos apenas no EditorUnified
    npx tsc --noEmit src/pages/EditorUnified.tsx 2>/dev/null && echo "✅ Sem erros TypeScript" || echo "❌ Erros TypeScript encontrados"
else
    echo "⚠️ npm não disponível para verificação"
fi

# Status final
echo ""
echo "📊 RESUMO DO TESTE"
echo "=================="
echo "🌐 Servidor: $(curl -s http://localhost:8080/editor-unified > /dev/null && echo "✅ OK" || echo "❌ ERRO")"
echo "📁 Arquivos DnD: $([ -f "src/components/editor/dnd/DraggableComponentItem.tsx" ] && echo "✅ OK" || echo "❌ ERRO")"
echo "🎨 CSS DnD: $(grep -q "overflow: visible" src/styles/editor-unified.css && echo "✅ OK" || echo "❌ ERRO")"

echo ""
echo "🚀 PRÓXIMO PASSO: Testar manualmente em http://localhost:8080/editor-unified"
echo "   1. Abrir o editor no navegador"
echo "   2. Tentar arrastar um componente do painel lateral"
echo "   3. Soltar no canvas central"
echo "   4. Verificar console do browser para logs de debug"
echo ""
echo "🔧 DEBUG: Abrir DevTools e procurar por:"
echo "   - '🧩 DraggableComponentItem renderizado'"
echo "   - '🎯 === DRAG END DEBUG ==='"
echo "   - '✅ ADICIONANDO COMPONENTE'"
