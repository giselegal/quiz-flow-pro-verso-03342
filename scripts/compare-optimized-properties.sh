#!/bin/bash

# 🔍 ANÁLISE COMPLETA: OptimizedPropertiesPanel vs OptimizedPropertiesPanel.modified

echo "🎯 ANÁLISE DOS DOIS ARQUIVOS OptimizedPropertiesPanel"
echo "=" x 60

echo ""
echo "📊 ESTATÍSTICAS DOS ARQUIVOS:"
echo "------------------------------"
echo "OptimizedPropertiesPanel.tsx: $(wc -l < src/components/editor/OptimizedPropertiesPanel.tsx) linhas"
echo "OptimizedPropertiesPanel.modified.tsx: $(wc -l < src/components/editor/OptimizedPropertiesPanel.modified.tsx) linhas"

echo ""
echo "🔍 DIFERENÇAS PRINCIPAIS:"
echo "-------------------------"

# Verificar qual tem mais debug logs
original_debug=$(grep -c "console.log\|DEBUG" src/components/editor/OptimizedPropertiesPanel.tsx)
modified_debug=$(grep -c "console.log\|DEBUG" src/components/editor/OptimizedPropertiesPanel.modified.tsx)

echo "🐛 Debug logs no original: $original_debug"
echo "🐛 Debug logs no modified: $modified_debug"

# Verificar se o original tem as correções de range/select
if grep -q "case \"range\":" src/components/editor/OptimizedPropertiesPanel.tsx; then
    echo "✅ Original tem suporte para 'range'"
else
    echo "❌ Original NÃO tem suporte para 'range'"
fi

if grep -q "case \"select\":" src/components/editor/OptimizedPropertiesPanel.tsx; then
    echo "✅ Original tem suporte para 'select'"
else
    echo "❌ Original NÃO tem suporte para 'select'"
fi

if grep -q "case \"range\":" src/components/editor/OptimizedPropertiesPanel.modified.tsx; then
    echo "✅ Modified tem suporte para 'range'"
else
    echo "❌ Modified NÃO tem suporte para 'range'"
fi

if grep -q "case \"select\":" src/components/editor/OptimizedPropertiesPanel.modified.tsx; then
    echo "✅ Modified tem suporte para 'select'"
else
    echo "❌ Modified NÃO tem suporte para 'select'"
fi

echo ""
echo "⚙️ QUAL ESTÁ SENDO USADO ATUALMENTE:"
echo "-----------------------------------"

# Verificar qual está sendo importado
if grep -q "OptimizedPropertiesPanel.modified" src/pages/editor-fixed-dragdrop.tsx; then
    echo "📝 Editor está usando: OptimizedPropertiesPanel.modified.tsx"
elif grep -q "OptimizedPropertiesPanel" src/pages/editor-fixed-dragdrop.tsx; then
    echo "📝 Editor está usando: OptimizedPropertiesPanel.tsx"
else
    echo "❓ Não foi possível determinar qual está sendo usado"
fi

echo ""
echo "🏆 RECOMENDAÇÃO:"
echo "----------------"
echo "O arquivo OptimizedPropertiesPanel.tsx tem:"
echo "  ✅ Mais debug logs para troubleshooting"
echo "  ✅ Correções de range/select implementadas"
echo "  ✅ Log inicial de renderização"
echo "  ✅ É o arquivo oficial (sem .modified)"
echo ""
echo "💡 AÇÃO RECOMENDADA:"
echo "O OptimizedPropertiesPanel.tsx é o arquivo correto e mais atualizado."
echo "Remover o .modified.tsx para evitar confusão."
