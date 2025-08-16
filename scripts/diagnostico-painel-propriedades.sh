#!/bin/bash

echo "🔧 DIAGNÓSTICO DO PAINEL DE PROPRIEDADES - EDITOR FIXED"
echo "========================================================"

echo ""
echo "📋 1. VERIFICANDO ESTRUTURA DE ARQUIVOS..."
echo "-------------------------------------------"

# Verificar se arquivos principais existem
files=(
    "src/components/universal/EnhancedUniversalPropertiesPanel.tsx"
    "src/hooks/useUnifiedProperties.ts"
    "src/pages/editor-fixed-dragdrop.tsx"
    "src/context/EditorContext.tsx"
    "src/context/StepsContext.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - ARQUIVO FALTANDO!"
    fi
done

echo ""
echo "📋 2. VERIFICANDO IMPORTS E EXPORTAÇÕES..."
echo "-------------------------------------------"

# Verificar se EnhancedUniversalPropertiesPanel está sendo importado corretamente
echo "🔍 Verificando import do EnhancedUniversalPropertiesPanel no editor-fixed..."
grep -n "EnhancedUniversalPropertiesPanel" src/pages/editor-fixed-dragdrop.tsx

echo ""
echo "🔍 Verificando export do EnhancedUniversalPropertiesPanel..."
grep -n "export.*EnhancedUniversalPropertiesPanel" src/components/universal/EnhancedUniversalPropertiesPanel.tsx

echo ""
echo "📋 3. VERIFICANDO HOOK useUnifiedProperties..."
echo "-------------------------------------------"

echo "🔍 Verificando se useUnifiedProperties está sendo usado no painel..."
grep -n "useUnifiedProperties" src/components/universal/EnhancedUniversalPropertiesPanel.tsx

echo ""
echo "📋 4. VERIFICANDO INTEGRAÇÃO COM EDITORCONTEXT..."
echo "---------------------------------------------------"

echo "🔍 Verificando como selectedBlock é passado para o painel..."
grep -A 10 -B 5 "EnhancedUniversalPropertiesPanel" src/pages/editor-fixed-dragdrop.tsx

echo ""
echo "📋 5. VERIFICANDO TIPOS E INTERFACES..."
echo "---------------------------------------"

echo "🔍 Verificando interface UnifiedBlock..."
grep -A 5 "interface UnifiedBlock" src/hooks/useUnifiedProperties.ts

echo ""
echo "📋 6. VERIFICANDO ERROS DE TYPESCRIPT..."
echo "----------------------------------------"

echo "🔍 Verificando erros de compilação..."
npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "(error|Error)" | head -10

echo ""
echo "📋 7. VERIFICANDO LOGS DO BROWSER..."
echo "------------------------------------"

echo "🔍 Para verificar erros no browser, abra:"
echo "   http://localhost:8087/editor-fixed"
echo "   E abra o DevTools (F12) para ver o console"

echo ""
echo "📋 8. PRÓXIMOS PASSOS SUGERIDOS..."
echo "----------------------------------"
echo "1. Abrir http://localhost:8087/editor-fixed no navegador"
echo "2. Abrir DevTools (F12) e verificar erros no Console"
echo "3. Tentar adicionar um componente a uma etapa"
echo "4. Verificar se o painel de propriedades aparece"
echo "5. Testar mudanças nas propriedades"

echo ""
echo "🚀 DIAGNÓSTICO CONCLUÍDO!"
echo "========================"
