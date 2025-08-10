#!/bin/bash

# 🔍 DIAGNÓSTICO COMPLETO - PAINEL DE PROPRIEDADES

echo "🔍 DIAGNÓSTICO COMPLETO - PAINEL DE PROPRIEDADES"
echo "================================================"

echo ""
echo "1. 📋 VERIFICANDO ARQUIVOS CRÍTICOS..."

# Verificar se arquivos existem
critical_files=(
    "src/components/universal/UniversalPropertiesPanel.tsx"
    "src/hooks/useUnifiedProperties.ts"
    "src/pages/editor.tsx"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file - EXISTE"
        # Verificar tamanho
        size=$(wc -l < "$file")
        echo "      📏 Linhas: $size"
    else
        echo "   ❌ $file - FALTANDO!"
    fi
done

echo ""
echo "2. 🔧 VERIFICANDO IMPORTS NO EDITOR..."

# Verificar imports no editor
if grep -q "UniversalPropertiesPanel" "src/pages/editor.tsx"; then
    echo "   ✅ Import UniversalPropertiesPanel - OK"
else
    echo "   ❌ Import UniversalPropertiesPanel - FALTANDO"
fi

if grep -q "useUnifiedProperties" "src/pages/editor.tsx"; then
    echo "   ✅ Import useUnifiedProperties - OK"
else
    echo "   ❌ Import useUnifiedProperties - FALTANDO"
fi

echo ""
echo "3. 🎯 VERIFICANDO USO DO PAINEL NO EDITOR..."

# Verificar se o painel está sendo usado
if grep -q "<UniversalPropertiesPanel" "src/pages/editor.tsx"; then
    echo "   ✅ Componente UniversalPropertiesPanel - USADO"
    
    # Contar quantas vezes aparece
    count=$(grep -c "<UniversalPropertiesPanel" "src/pages/editor.tsx")
    echo "      📊 Usado $count vez(es)"
else
    echo "   ❌ Componente UniversalPropertiesPanel - NÃO USADO"
fi

echo ""
echo "4. 🎛️ VERIFICANDO ESTADO selectedComponentId..."

# Verificar se selectedComponentId está sendo usado
if grep -q "selectedComponentId" "src/pages/editor.tsx"; then
    echo "   ✅ selectedComponentId - IMPLEMENTADO"
    
    # Verificar setSelectedComponentId
    if grep -q "setSelectedComponentId" "src/pages/editor.tsx"; then
        echo "   ✅ setSelectedComponentId - IMPLEMENTADO"
    else
        echo "   ❌ setSelectedComponentId - FALTANDO"
    fi
else
    echo "   ❌ selectedComponentId - FALTANDO"
fi

echo ""
echo "5. 🎨 VERIFICANDO ESTRUTURA DO PAINEL..."

# Verificar estrutura do painel
echo "   📁 Linha onde aparece o painel:"
grep -n "<UniversalPropertiesPanel" "src/pages/editor.tsx" | head -3

echo ""
echo "   📁 Contexto do painel:"
grep -A 5 -B 5 "selectedComponentId ?" "src/pages/editor.tsx" | head -15

echo ""
echo "6. 💻 VERIFICANDO SERVIDOR..."

# Verificar se servidor está rodando
if curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo "   ✅ Servidor rodando em :8081"
elif curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Servidor rodando em :3000"
else
    echo "   ❌ Servidor não detectado"
fi

echo ""
echo "7. 🧪 TESTE RÁPIDO DE COMPILAÇÃO..."

# Teste rápido de TypeScript
echo "   🔍 Verificando erros TypeScript..."
if command -v npx &> /dev/null; then
    # Só verificar o editor
    npx tsc --noEmit --strict src/pages/editor.tsx 2>&1 | head -5 || echo "      ✅ Sem erros graves de TS"
fi

echo ""
echo "8. 🎯 POSSÍVEIS PROBLEMAS IDENTIFICADOS..."

problems_found=0

# Verificar se painel está condicionalmente renderizado
if ! grep -q "selectedComponentId.*?" "src/pages/editor.tsx"; then
    echo "   ❌ PROBLEMA: Renderização condicional pode estar incorreta"
    ((problems_found++))
fi

# Verificar se há bloco selecionado
if ! grep -q "blocks.find" "src/pages/editor.tsx"; then
    echo "   ❌ PROBLEMA: Busca de bloco selecionado pode estar incorreta"
    ((problems_found++))
fi

# Verificar se há função onClick
if ! grep -q "onClick.*setSelectedComponentId" "src/pages/editor.tsx"; then
    echo "   ❌ PROBLEMA: onClick para seleção pode estar faltando"
    ((problems_found++))
fi

if [ $problems_found -eq 0 ]; then
    echo "   ✅ NENHUM PROBLEMA ÓBVIO DETECTADO"
fi

echo ""
echo "9. 📋 RESUMO DO DIAGNÓSTICO..."

echo ""
echo "✅ ARQUIVO FUNCIONANDO? $([ -f "src/components/universal/UniversalPropertiesPanel.tsx" ] && echo "SIM" || echo "NÃO")"
echo "✅ HOOK FUNCIONANDO? $([ -f "src/hooks/useUnifiedProperties.ts" ] && echo "SIM" || echo "NÃO")"
echo "✅ EDITOR INTEGRADO? $(grep -q "UniversalPropertiesPanel" "src/pages/editor.tsx" && echo "SIM" || echo "NÃO")"
echo "✅ SERVIDOR RODANDO? $(curl -s http://localhost:8081 > /dev/null 2>&1 && echo "SIM" || echo "NÃO")"

echo ""
echo "🎯 PRÓXIMOS PASSOS SUGERIDOS:"
echo "   1. Abrir http://localhost:8081/editor"
echo "   2. Abrir DevTools (F12)"
echo "   3. Adicionar um componente"
echo "   4. Clicar no componente"
echo "   5. Verificar console para erros"

echo ""
echo "🔧 SE PAINEL NÃO APARECER:"
echo "   • Verificar console JavaScript (erros)"
echo "   • Verificar se componente fica selecionado (borda)"
echo "   • Verificar se selectedComponentId tem valor"
echo "   • Verificar se props estão corretas"

echo ""
echo "📊 DIAGNÓSTICO COMPLETO FINALIZADO!"
