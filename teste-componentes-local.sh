#!/bin/bash

# 🛠️ SCRIPT DE TESTE AUTOMATIZADO PARA COMPONENTES DRAG & DROP
# Verifica estrutura e funcionalidade de drag & drop no ambiente local

echo "🔍 Iniciando teste automatizado - componentes drag & drop"
echo "=============================================="

# Script para testar componentes no ambiente local
echo "🔍 TESTE AUTOMATIZADO - COMPONENTES DRAG & DROP"
echo "=============================================="

echo ""
echo "🌐 1. Verificando servidor local..."
if curl -s http://localhost:8082 > /dev/null; then
    echo "✅ Servidor respondendo em localhost:8082"
else
    echo "❌ Servidor não está respondendo"
    exit 1
fi
    exit 1
fi

echo ""
echo "📋 2. Verificando arquivos essenciais..."

# Verificar se os arquivos existem
files=(
    "src/components/editor/EnhancedComponentsSidebar.tsx"
    "src/components/editor/dnd/DraggableComponentItem.tsx"
    "src/components/editor/blocks/enhancedBlockRegistry.ts"
    "src/pages/EditorUnified.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - ARQUIVO AUSENTE"
    fi
done

echo ""
echo "🧩 3. Verificando AVAILABLE_COMPONENTS..."
if grep -q "AVAILABLE_COMPONENTS" src/components/editor/blocks/enhancedBlockRegistry.ts; then
    count=$(grep -c "type:" src/components/editor/blocks/enhancedBlockRegistry.ts)
    echo "✅ AVAILABLE_COMPONENTS encontrado com ~$count componentes"
else
    echo "❌ AVAILABLE_COMPONENTS não encontrado"
fi

echo ""
echo "🎯 4. Verificando logs de debug no código..."
if grep -q "console.log.*EnhancedComponentsSidebar" src/components/editor/EnhancedComponentsSidebar.tsx; then
    echo "✅ Logs de debug adicionados ao EnhancedComponentsSidebar"
else
    echo "❌ Logs de debug ausentes"
fi

echo ""
echo "🔧 5. Verificando imports..."
if grep -q "import.*AVAILABLE_COMPONENTS" src/components/editor/EnhancedComponentsSidebar.tsx; then
    echo "✅ Import AVAILABLE_COMPONENTS encontrado"
else
    echo "❌ Import AVAILABLE_COMPONENTS ausente"
fi

if grep -q "import.*DraggableComponentItem" src/components/editor/EnhancedComponentsSidebar.tsx; then
    echo "✅ Import DraggableComponentItem encontrado"  
else
    echo "❌ Import DraggableComponentItem ausente"
fi

echo ""
echo "📊 6. RESUMO DO DIAGNÓSTICO:"
echo "=========================="

# Contar problemas
issues=0

if [ ! -f "src/components/editor/EnhancedComponentsSidebar.tsx" ]; then
    ((issues++))
fi

if ! grep -q "AVAILABLE_COMPONENTS" src/components/editor/blocks/enhancedBlockRegistry.ts; then
    ((issues++))
fi

if ! curl -s http://localhost:8082 > /dev/null; then
    ((issues++))
fi

if [ $issues -eq 0 ]; then
    echo "✅ ESTRUTURA OK - Problema pode estar no browser/produção"
    echo ""
    echo "💡 PRÓXIMOS PASSOS:"
    echo "1. Acesse: http://localhost:8082/editor-unified"
    echo "2. Abra DevTools (F12)"
    echo "3. Execute no console:"
    echo ""
    echo "// Cole este código no console do browser:"
    echo 'console.log("🔍 TESTE:", document.querySelectorAll("[data-dnd-kit], [draggable=true]").length);'
    echo ""
    echo "4. Verifique se aparece:"
    echo "   - '🎯 EnhancedComponentsSidebar renderizando...'"
    echo "   - '🧩 AVAILABLE_COMPONENTS carregados: X'"
else
    echo "❌ ENCONTRADOS $issues PROBLEMAS - Corrigir antes de testar"
fi

echo ""
echo "🚀 Para executar teste completo no browser:"
echo "   1. Acesse http://localhost:8082/editor-unified"
echo "   2. Cole e execute o arquivo: diagnostico-ambiente-producao.js"
