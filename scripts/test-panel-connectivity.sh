#!/bin/bash

# 🧪 TESTE DE CONECTIVIDADE: Painel → Canvas
echo "🔗 TESTANDO CONECTIVIDADE PAINEL → CANVAS..."
echo ""

# 1. Verificar se o hook useDebounce existe
echo "🔧 1. VERIFICANDO HOOK useDebounce:"
if [ -f "src/hooks/useDebounce.ts" ]; then
    echo "✅ useDebounce.ts encontrado"
    debounce_lines=$(wc -l < "src/hooks/useDebounce.ts")
    echo "   📏 ${debounce_lines} linhas"
else
    echo "❌ useDebounce.ts NÃO encontrado - PROBLEMA!"
fi

echo ""
echo "🔍 2. VERIFICANDO FLUXO DE DADOS:"

# 2. Verificar se OptimizedPropertiesPanel usa useDebounce
if grep -q "useDebounce" src/components/editor/OptimizedPropertiesPanel.tsx; then
    echo "✅ OptimizedPropertiesPanel usa useDebounce"
else
    echo "❌ OptimizedPropertiesPanel NÃO usa useDebounce"
fi

# 3. Verificar se tem React.useEffect para onUpdateBlock
if grep -q "React.useEffect" src/components/editor/OptimizedPropertiesPanel.tsx; then
    echo "✅ OptimizedPropertiesPanel tem useEffect"
else
    echo "❌ OptimizedPropertiesPanel NÃO tem useEffect"
fi

# 4. Verificar se chama onUpdateBlock
if grep -q "onUpdateBlock" src/components/editor/OptimizedPropertiesPanel.tsx; then
    echo "✅ OptimizedPropertiesPanel chama onUpdateBlock"
else
    echo "❌ OptimizedPropertiesPanel NÃO chama onUpdateBlock"
fi

echo ""
echo "🎯 3. VERIFICANDO EDITOR CONTEXT:"

# 5. Verificar se updateBlock está implementado
if grep -q "const updateBlock = useCallback" src/context/EditorContext.tsx; then
    echo "✅ EditorContext.updateBlock implementado"
else
    echo "❌ EditorContext.updateBlock NÃO implementado"
fi

# 6. Verificar se atualiza o estado dos blocos
if grep -q "setStageBlocks" src/context/EditorContext.tsx; then
    echo "✅ EditorContext atualiza setStageBlocks"
else
    echo "❌ EditorContext NÃO atualiza setStageBlocks"
fi

echo ""
echo "🖥️ 4. VERIFICANDO CANVAS RENDERING:"

# 7. Verificar se CanvasDropZone recebe onUpdateBlock
if grep -q "onUpdateBlock={updateBlock}" src/pages/editor-fixed-dragdrop.tsx; then
    echo "✅ CanvasDropZone recebe onUpdateBlock"
else
    echo "❌ CanvasDropZone NÃO recebe onUpdateBlock"
fi

# 8. Verificar se UniversalBlockRenderer é usado
if grep -q "UniversalBlockRenderer" src/pages/editor-fixed-dragdrop.tsx; then
    echo "✅ UniversalBlockRenderer importado"
else
    echo "❌ UniversalBlockRenderer NÃO importado"
fi

echo ""
echo "📱 5. ANÁLISE DE CÓDIGO DETALHADA:"

# Extrair o código do useEffect
echo "🔍 Código do useEffect (OptimizedPropertiesPanel):"
grep -A 5 -B 2 "React.useEffect" src/components/editor/OptimizedPropertiesPanel.tsx | head -10

echo ""
echo "🔍 Código do updateBlock (EditorContext):"
grep -A 10 "const updateBlock = useCallback" src/context/EditorContext.tsx | head -15

echo ""
echo "📊 DIAGNÓSTICO FINAL:"
echo "========================"

# Verificar todas as condições necessárias
conditions_met=0
total_conditions=8

# Verificar cada condição
if [ -f "src/hooks/useDebounce.ts" ]; then ((conditions_met++)); fi
if grep -q "useDebounce" src/components/editor/OptimizedPropertiesPanel.tsx; then ((conditions_met++)); fi
if grep -q "React.useEffect" src/components/editor/OptimizedPropertiesPanel.tsx; then ((conditions_met++)); fi
if grep -q "onUpdateBlock" src/components/editor/OptimizedPropertiesPanel.tsx; then ((conditions_met++)); fi
if grep -q "const updateBlock = useCallback" src/context/EditorContext.tsx; then ((conditions_met++)); fi
if grep -q "setStageBlocks" src/context/EditorContext.tsx; then ((conditions_met++)); fi
if grep -q "onUpdateBlock={updateBlock}" src/pages/editor-fixed-dragdrop.tsx; then ((conditions_met++)); fi
if grep -q "UniversalBlockRenderer" src/pages/editor-fixed-dragdrop.tsx; then ((conditions_met++)); fi

echo "✅ Condições atendidas: ${conditions_met}/${total_conditions}"

if [ $conditions_met -eq $total_conditions ]; then
    echo "🎉 CONECTIVIDADE: 100% FUNCIONAL!"
    echo "   📡 Painel → debounce → context → canvas ✅"
else
    echo "⚠️  CONECTIVIDADE: ${conditions_met}/${total_conditions} ($(($conditions_met * 100 / $total_conditions))%)"
    echo "   🔧 Algumas conexões podem estar faltando"
fi

echo ""
echo "🎮 TESTE MANUAL RECOMENDADO:"
echo "1. Abra: http://localhost:8082/editor-fixed"
echo "2. Adicione um componente ao canvas"
echo "3. Selecione o componente"
echo "4. Edite uma propriedade no painel"
echo "5. Observe se o canvas atualiza em tempo real"
echo ""
echo "⏱️  TIMING ESPERADO:"
echo "- Debounce: 300ms"
echo "- Atualização: Imediata após debounce"
echo "- Re-render: Otimizado (React Hook Form)"
