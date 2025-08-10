#!/bin/bash

# 🧪 TESTE VISUAL DOS COMPONENTES ENHANCED

echo "🔍 Testando Enhanced Components no /editor-fixed..."
echo "=================================================="

# Verificar se o servidor está rodando
echo "📡 Verificando servidor..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Servidor rodando em http://localhost:5173"
else
    echo "❌ Servidor não está rodando!"
    echo "   Execute: npm run dev"
    exit 1
fi

# Verificar arquivos de componentes
echo ""
echo "📁 Verificando arquivos dos componentes..."
echo "--------------------------------------------"

files=(
    "src/components/editor/EnhancedComponentsSidebar.tsx"
    "src/components/editor/DynamicPropertiesPanel.tsx"
    "src/components/editor/blocks/EnhancedBlockRegistry.tsx"
    "src/pages/editor-fixed.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - AUSENTE"
    fi
done

# Verificar importações
echo ""
echo "🔗 Verificando importações no editor-fixed..."
echo "----------------------------------------------"

if grep -q "EnhancedComponentsSidebar" src/pages/editor-fixed.tsx; then
    echo "✅ EnhancedComponentsSidebar importado"
else
    echo "❌ EnhancedComponentsSidebar NÃO importado"
fi

if grep -q "DynamicPropertiesPanel" src/pages/editor-fixed.tsx; then
    echo "✅ DynamicPropertiesPanel importado"
else
    echo "❌ DynamicPropertiesPanel NÃO importado"
fi

if grep -q "getBlockDefinition" src/pages/editor-fixed.tsx; then
    echo "✅ getBlockDefinition importado"
else
    echo "❌ getBlockDefinition NÃO importado"
fi

# Verificar funcionalidades implementadas
echo ""
echo "🎯 Verificando funcionalidades implementadas..."
echo "-----------------------------------------------"

echo "🔍 Busca avançada:"
if grep -q "searchQuery" src/components/editor/EnhancedComponentsSidebar.tsx; then
    echo "  ✅ Sistema de busca implementado"
else
    echo "  ❌ Sistema de busca AUSENTE"
fi

echo "🏷️ Filtros por categoria:"
if grep -q "selectedCategory" src/components/editor/EnhancedComponentsSidebar.tsx; then
    echo "  ✅ Filtros de categoria implementados"
else
    echo "  ❌ Filtros de categoria AUSENTES"
fi

echo "📊 Estatísticas:"
if grep -q "totalBlocks" src/components/editor/EnhancedComponentsSidebar.tsx; then
    echo "  ✅ Estatísticas de componentes implementadas"
else
    echo "  ❌ Estatísticas AUSENTES"
fi

echo "🎛️ Painel dinâmico:"
if grep -q "schema" src/components/editor/DynamicPropertiesPanel.tsx; then
    echo "  ✅ Schema dinâmico implementado"
else
    echo "  ❌ Schema dinâmico AUSENTE"
fi

echo "✅ Validação:"
if grep -q "validation" src/components/editor/DynamicPropertiesPanel.tsx; then
    echo "  ✅ Validação de propriedades implementada"
else
    echo "  ❌ Validação AUSENTE"
fi

echo "⚡ Lazy Loading:"
if grep -q "lazy.*import" src/components/editor/blocks/EnhancedBlockRegistry.tsx; then
    echo "  ✅ Lazy loading implementado"
else
    echo "  ❌ Lazy loading AUSENTE"
fi

# Contagem de componentes
echo ""
echo "📊 Estatísticas dos componentes..."
echo "---------------------------------"

lazy_count=$(grep -c "lazy.*import" src/components/editor/blocks/EnhancedBlockRegistry.tsx 2>/dev/null || echo "0")
category_count=$(grep -c "name.*icon.*description" src/components/editor/blocks/EnhancedBlockRegistry.tsx 2>/dev/null || echo "0")

echo "⚡ Componentes com lazy loading: $lazy_count"
echo "🏷️ Categorias disponíveis: $category_count"

# URLs para teste
echo ""
echo "🌐 URLs para testar..."
echo "---------------------"
echo "📝 Editor Fixed: http://localhost:5173/editor-fixed"
echo "🏠 Home: http://localhost:5173/"

echo ""
echo "🎯 INSTRUÇÕES DE TESTE:"
echo "======================="
echo "1. Abra: http://localhost:5173/editor-fixed"
echo "2. Verifique se a sidebar esquerda tem busca e filtros"
echo "3. Verifique se o painel direito mostra propriedades dinâmicas"
echo "4. Teste adicionar um componente da sidebar"
echo "5. Teste editar propriedades no painel direito"
echo ""
echo "✨ Se tudo funcionar, a implementação está PERFEITA!"

echo ""
echo "🎉 TESTE CONCLUÍDO!"
echo "==================="
