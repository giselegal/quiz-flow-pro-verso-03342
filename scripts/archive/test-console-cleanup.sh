#!/bin/bash

echo "🧪 Testando Sistema de Limpeza de Console e Performance..."
echo ""

# Verificar se o arquivo de desenvolvimento existe
if [ -f "src/utils/development.ts" ]; then
    echo "✅ Arquivo de desenvolvimento encontrado"
else
    echo "❌ Arquivo de desenvolvimento não encontrado"
    exit 1
fi

# Verificar se está sendo importado no main.tsx
if grep -q "cleanupConsoleWarnings" "src/main.tsx"; then
    echo "✅ Sistema de limpeza ativado no main.tsx"
else
    echo "❌ Sistema de limpeza não encontrado no main.tsx"
fi

# Verificar se o DndProvider está usando as ferramentas de debug
if grep -q "dragDropDebugger" "src/components/editor/dnd/DndProvider.tsx"; then
    echo "✅ Debug aprimorado ativo no DndProvider"
else
    echo "❌ Debug aprimorado não encontrado no DndProvider"
fi

echo ""
echo "🔍 Funções implementadas:"

# Verificar funções específicas
functions=(
    "cleanupConsoleWarnings"
    "dragDropDebugger"
    "performanceMonitor"
    "optimizedUtils"
    "websocketManager"
)

for func in "${functions[@]}"; do
    if grep -q "$func" "src/utils/development.ts"; then
        echo "  ✅ $func"
    else
        echo "  ❌ $func"
    fi
done

echo ""
echo "📊 Filtros de avisos implementados:"

# Verificar filtros específicos
filters=(
    "Unrecognized feature:"
    "was preloaded using link preload"
    "iframe which has both allow-scripts"
    "setTimeout.*handler took"
    "Strategy 4: No clear indicators"
    "Max reconnect attempts"
    "facebook.com"
)

for filter in "${filters[@]}"; do
    if grep -q "$filter" "src/utils/development.ts"; then
        echo "  ✅ $filter"
    else
        echo "  ❌ $filter"
    fi
done

echo ""
echo "⚡ Otimizações de performance:"

# Verificar otimizações
optimizations=(
    "throttledTimeout"
    "debounce"
    "smoothAnimation"
    "batchDOMOperations"
    "originalSetTimeout"
    "originalSetInterval"
)

for opt in "${optimizations[@]}"; do
    if grep -q "$opt" "src/utils/development.ts"; then
        echo "  ✅ $opt"
    else
        echo "  ❌ $opt"
    fi
done

echo ""
echo "🎯 Para testar:"
echo "1. Abra o console do navegador (F12)"
echo "2. Navegue para http://localhost:8080"
echo "3. Verifique se os avisos listados abaixo NÃO aparecem:"
echo "   - Unrecognized feature: 'vr'"
echo "   - Facebook Pixel preload warnings"
echo "   - Strategy 4: No clear indicators found"
echo "   - iframe sandbox warnings"
echo ""
echo "4. Teste o drag and drop e verifique os logs organizados:"
echo "   - 🟢 Drag Start Event (grupos colapsáveis)"
echo "   - 🔄 Drag End Event"
echo "   - ✅ Drag & Drop Success"
echo ""
echo "5. Monitore a performance:"
echo "   - ⚡ Performance warnings para operações > 16ms"
echo "   - 🧹 Console warnings cleanup active"
echo "   - ⚡ Performance optimizations active"
echo ""

echo "✅ Teste de sistema de limpeza concluído!"
echo ""
echo "💡 Dica: Se ainda vir avisos indesejados, adicione-os ao array 'ignoredWarnings' em src/utils/development.ts"
