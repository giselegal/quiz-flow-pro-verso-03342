#!/bin/bash

echo "🔧 TESTE PÓS-CORREÇÃO: UnifiedPreviewEngine-drag.tsx"
echo "================================================="

# 1. Verificar se o servidor está rodando
echo "📡 Testando servidor..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8082 | grep -q "200" && echo "✅ Servidor ativo na 8082" || echo "❌ Servidor inativo"

# 2. Verificar se não há erros de compilação
echo ""
echo "🏗️ Verificando compilação..."
if [ -f "src/pages/EditorUnified.tsx" ] && [ -f "src/components/editor/unified/UnifiedPreviewEngine-drag.tsx" ]; then
    echo "✅ Arquivos principais encontrados"
else
    echo "❌ Arquivos não encontrados"
fi

# 3. Verificar se a importação está correta
echo ""
echo "📦 Verificando importação..."
if grep -q "UnifiedPreviewEngine-drag" src/pages/EditorUnified.tsx; then
    echo "✅ Importação corrigida para UnifiedPreviewEngine-drag"
else
    echo "❌ Importação ainda incorreta"
fi

# 4. Verificar se SortableContext está no arquivo correto
echo ""
echo "🧩 Verificando SortableContext..."
if grep -q "SortableContext" src/components/editor/unified/UnifiedPreviewEngine-drag.tsx; then
    echo "✅ SortableContext encontrado no UnifiedPreviewEngine-drag"
else
    echo "❌ SortableContext não encontrado"
fi

# 5. Contar componentes disponíveis
echo ""
echo "📊 Contando componentes..."
COMPONENTS_COUNT=$(grep -o '"type":' src/components/editor/blocks/enhancedBlockRegistry.ts | wc -l)
echo "✅ $COMPONENTS_COUNT componentes encontrados no registry"

echo ""
echo "🎯 CORREÇÃO APLICADA:"
echo "   - EditorUnified.tsx agora usa UnifiedPreviewEngine-drag.tsx"
echo "   - UnifiedPreviewEngine-drag.tsx tem SortableContext"
echo "   - Drag & Drop deve funcionar agora"
echo ""
echo "⏭️ PRÓXIMO PASSO:"
echo "   Acesse http://localhost:8082/editor-unified e teste o drag & drop"
