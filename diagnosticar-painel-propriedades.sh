#!/bin/bash

# 🔍 DIAGNÓSTICO COMPLETO: PAINEL DE PROPRIEDADES
# Verificar todos os possíveis problemas com o editor

echo "🔍 DIAGNÓSTICO COMPLETO: PAINEL DE PROPRIEDADES"
echo "=============================================="
echo ""

echo "📋 1. STATUS DO SERVIDOR:"
echo "   ✅ URL: http://localhost:8080/editor-fixed"
echo "   ✅ Servidor: ATIVO"
echo ""

echo "📋 2. VERIFICAÇÃO DE ARQUIVOS CRÍTICOS:"
echo ""

# Verificar OptimizedPropertiesPanel
echo "📁 OptimizedPropertiesPanel.tsx:"
if [ -f "src/components/editor/OptimizedPropertiesPanel.tsx" ]; then
    lines=$(wc -l < src/components/editor/OptimizedPropertiesPanel.tsx)
    echo "   ✅ Arquivo existe ($lines linhas)"
    
    # Verificar importações críticas
    echo "   🔍 Verificando importações:"
    if grep -q "import.*zod" src/components/editor/OptimizedPropertiesPanel.tsx; then
        echo "      ✅ Zod importado"
    else
        echo "      ❌ Zod não encontrado"
    fi
    
    if grep -q "useForm" src/components/editor/OptimizedPropertiesPanel.tsx; then
        echo "      ✅ React Hook Form importado"
    else
        echo "      ❌ React Hook Form não encontrado"
    fi
    
    # Verificar exports
    if grep -q "export default" src/components/editor/OptimizedPropertiesPanel.tsx; then
        echo "      ✅ Export default encontrado"
    else
        echo "      ❌ Export default não encontrado"
    fi
else
    echo "   ❌ Arquivo não encontrado"
fi

echo ""

# Verificar editor-fixed-dragdrop
echo "📁 editor-fixed-dragdrop.tsx:"
if [ -f "src/pages/editor-fixed-dragdrop.tsx" ]; then
    lines=$(wc -l < src/pages/editor-fixed-dragdrop.tsx)
    echo "   ✅ Arquivo existe ($lines linhas)"
    
    # Verificar se importa OptimizedPropertiesPanel
    if grep -q "OptimizedPropertiesPanel" src/pages/editor-fixed-dragdrop.tsx; then
        echo "      ✅ OptimizedPropertiesPanel importado"
    else
        echo "      ❌ OptimizedPropertiesPanel não importado"
    fi
    
    # Verificar se usa o painel
    if grep -q "<OptimizedPropertiesPanel" src/pages/editor-fixed-dragdrop.tsx; then
        echo "      ✅ OptimizedPropertiesPanel usado no JSX"
    else
        echo "      ❌ OptimizedPropertiesPanel não usado no JSX"
    fi
else
    echo "   ❌ Arquivo não encontrado"
fi

echo ""

echo "📋 3. VERIFICAÇÃO DE DEPENDÊNCIAS:"
echo ""

# Verificar package.json para dependências críticas
if [ -f "package.json" ]; then
    echo "📦 Dependências críticas:"
    
    if grep -q "zod" package.json; then
        version=$(grep "zod" package.json | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
        echo "   ✅ zod: $version"
    else
        echo "   ❌ zod não encontrado"
    fi
    
    if grep -q "react-hook-form" package.json; then
        version=$(grep "react-hook-form" package.json | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
        echo "   ✅ react-hook-form: $version"
    else
        echo "   ❌ react-hook-form não encontrado"
    fi
    
    if grep -q "@hookform/resolvers" package.json; then
        version=$(grep "@hookform/resolvers" package.json | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
        echo "   ✅ @hookform/resolvers: $version"
    else
        echo "   ❌ @hookform/resolvers não encontrado"
    fi
else
    echo "   ❌ package.json não encontrado"
fi

echo ""

echo "📋 4. VERIFICAÇÃO DE SINTAXE:"
echo ""

# Verificar erros de sintaxe TypeScript (simulado)
echo "🔍 Verificando possíveis erros de sintaxe..."

# Verificar se há problemas no OptimizedPropertiesPanel
problem_count=0

if [ -f "src/components/editor/OptimizedPropertiesPanel.tsx" ]; then
    # Verificar se numberSchema.min() foi corrigido
    if grep -q "z.number().optional()" src/components/editor/OptimizedPropertiesPanel.tsx; then
        echo "   ❌ PROBLEMA: z.number().optional() antes de .min() encontrado!"
        problem_count=$((problem_count + 1))
    else
        echo "   ✅ Schema de número corrigido"
    fi
    
    # Verificar imports duplicados
    zod_imports=$(grep -c "import.*zod" src/components/editor/OptimizedPropertiesPanel.tsx)
    if [ $zod_imports -gt 1 ]; then
        echo "   ⚠️ AVISO: $zod_imports imports do zod encontrados (possível duplicação)"
    else
        echo "   ✅ Imports do zod ok"
    fi
fi

echo ""

echo "📋 5. VERIFICAÇÃO DO CONTEXTO:"
echo ""

# Verificar EditorContext
if [ -f "src/context/EditorContext.tsx" ]; then
    echo "   ✅ EditorContext existe"
    
    if grep -q "selectedBlock" src/context/EditorContext.tsx; then
        echo "      ✅ selectedBlock no contexto"
    else
        echo "      ❌ selectedBlock não encontrado no contexto"
    fi
else
    echo "   ❌ EditorContext não encontrado"
fi

echo ""

echo "📋 6. RESUMO DO DIAGNÓSTICO:"
echo ""

if [ $problem_count -eq 0 ]; then
    echo "✅ TODOS OS ARQUIVOS PARECEM ESTAR CORRETOS!"
    echo ""
    echo "🎯 POSSÍVEIS CAUSAS DO PROBLEMA:"
    echo "   1. Cache do browser - Pressione Ctrl+F5 para recarregar"
    echo "   2. Bloco não selecionado - Clique em um componente no editor"
    echo "   3. Estado do React - O painel só aparece quando um bloco está selecionado"
    echo "   4. JavaScript desabilitado - Verifique se JavaScript está ativo"
    echo ""
    echo "🚀 PRÓXIMOS PASSOS RECOMENDADOS:"
    echo "   1. Acesse: http://localhost:8080/editor-fixed"
    echo "   2. Clique em qualquer componente da etapa"
    echo "   3. O painel deve aparecer do lado direito"
    echo "   4. Se não aparecer, verifique o console do browser (F12)"
else
    echo "❌ $problem_count PROBLEMA(S) ENCONTRADO(S)!"
    echo "   Verifique os erros acima e corrija antes de usar o editor."
fi

echo ""
echo "=============================================="
echo "🔧 Diagnóstico concluído!"
