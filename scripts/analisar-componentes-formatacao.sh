#!/bin/bash

echo "🔍 ANÁLISE COMPLETA DE COMPONENTES E FORMATAÇÃO"
echo "=============================================="

echo ""
echo "📋 1. VERIFICANDO ESTRUTURA GERAL..."
echo "-----------------------------------"

# Contar arquivos por tipo
echo "📊 Contagem de arquivos:"
echo "- TypeScript/TSX: $(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l)"
echo "- JavaScript/JSX: $(find . -name "*.js" -o -name "*.jsx" | grep -v node_modules | wc -l)"
echo "- Componentes React: $(find . -name "*.tsx" | grep -E "(components|src)" | grep -v node_modules | wc -l)"

echo ""
echo "🎯 2. VERIFICANDO COMPONENTES DUPLICADOS..."
echo "------------------------------------------"

# Buscar arquivos duplicados por nome
echo "🔍 Arquivos com nomes duplicados:"
find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs basename -a | sort | uniq -d | while read file; do
    echo "⚠️  Arquivo duplicado: $file"
    find . -name "$file" | grep -v node_modules | head -5
    echo ""
done

echo ""
echo "📦 3. ANÁLISE DE IMPORTS E EXPORTS..."
echo "------------------------------------"

# Verificar imports problemáticos
echo "🔍 Imports problemáticos encontrados:"
grep -r "import.*from.*\.\." src/ --include="*.tsx" --include="*.ts" | head -10

echo ""
echo "🔍 Exports não utilizados:"
grep -r "export.*{" src/ --include="*.tsx" --include="*.ts" | head -10

echo ""
echo "🎨 4. VERIFICANDO PRETTIER..."
echo "----------------------------"

# Verificar se Prettier está instalado
if command -v npx &> /dev/null; then
    echo "✅ NPX encontrado"
    
    # Verificar se Prettier está disponível
    if npx prettier --version &> /dev/null; then
        echo "✅ Prettier está disponível: $(npx prettier --version)"
        
        echo ""
        echo "🔍 Verificando arquivos que precisam de formatação:"
        
        # Listar arquivos que não estão formatados corretamente
        UNFORMATTED=$(npx prettier --list-different "src/**/*.{ts,tsx,js,jsx}" 2>/dev/null | head -20)
        
        if [ -n "$UNFORMATTED" ]; then
            echo "⚠️  Arquivos que precisam de formatação:"
            echo "$UNFORMATTED"
        else
            echo "✅ Todos os arquivos estão formatados corretamente!"
        fi
        
    else
        echo "❌ Prettier não está instalado"
        echo "💡 Execute: npm install --save-dev prettier"
    fi
else
    echo "❌ NPX não encontrado"
fi

echo ""
echo "🔧 5. ANÁLISE DE TYPESCRIPT..."
echo "-----------------------------"

# Verificar arquivos TypeScript com problemas
echo "🔍 Verificando problemas TypeScript:"

# Procurar por any types
ANY_COUNT=$(grep -r ": any" src/ --include="*.tsx" --include="*.ts" | wc -l)
echo "📊 Uso de 'any': $ANY_COUNT ocorrências"

# Procurar por TODO/FIXME
TODO_COUNT=$(grep -r "TODO\|FIXME" src/ --include="*.tsx" --include="*.ts" | wc -l)
echo "📊 TODOs/FIXMEs: $TODO_COUNT encontrados"

# Procurar por console.log
CONSOLE_COUNT=$(grep -r "console\." src/ --include="*.tsx" --include="*.ts" | wc -l)
echo "📊 Console logs: $CONSOLE_COUNT encontrados"

echo ""
echo "🧹 6. VERIFICANDO LINTING..."
echo "---------------------------"

# Verificar ESLint
if command -v npx &> /dev/null && npx eslint --version &> /dev/null; then
    echo "✅ ESLint encontrado: $(npx eslint --version)"
    
    echo "🔍 Executando lint check..."
    LINT_ERRORS=$(npx eslint src/ --ext .ts,.tsx 2>&1 | head -20)
    
    if echo "$LINT_ERRORS" | grep -q "error\|warning"; then
        echo "⚠️  Problemas de lint encontrados:"
        echo "$LINT_ERRORS"
    else
        echo "✅ Nenhum problema de lint encontrado!"
    fi
else
    echo "❌ ESLint não encontrado"
fi

echo ""
echo "📁 7. ANÁLISE ESPECÍFICA DE COMPONENTES..."
echo "----------------------------------------"

# Verificar componentes principais
MAIN_COMPONENTS=(
    "src/components/universal/EnhancedUniversalPropertiesPanel.tsx"
    "src/hooks/useUnifiedProperties.ts"
    "src/config/enhancedBlockRegistry.ts"
    "src/pages/editor-fixed-dragdrop.tsx"
)

for component in "${MAIN_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $component - $(wc -l < "$component") linhas"
        
        # Verificar imports no componente
        IMPORTS=$(grep -c "^import" "$component" 2>/dev/null || echo "0")
        echo "   📦 Imports: $IMPORTS"
        
        # Verificar exports no componente
        EXPORTS=$(grep -c "^export" "$component" 2>/dev/null || echo "0")
        echo "   📤 Exports: $EXPORTS"
        
    else
        echo "❌ $component - NÃO ENCONTRADO"
    fi
done

echo ""
echo "🎯 8. RECOMENDAÇÕES DE FORMATAÇÃO..."
echo "----------------------------------"

echo "💡 Comandos recomendados para correção:"
echo ""

if command -v npx &> /dev/null && npx prettier --version &> /dev/null; then
    echo "🎨 FORMATAÇÃO PRETTIER:"
    echo "npx prettier --write \"src/**/*.{ts,tsx,js,jsx}\""
    echo "npx prettier --write \"components/**/*.{ts,tsx,js,jsx}\""
    echo ""
fi

if command -v npx &> /dev/null && npx eslint --version &> /dev/null; then
    echo "🔧 CORREÇÃO ESLINT:"
    echo "npx eslint src/ --ext .ts,.tsx --fix"
    echo "npx eslint components/ --ext .ts,.tsx --fix"
    echo ""
fi

echo "🧹 LIMPEZA GERAL:"
echo "find . -name \"*.tsx\" -o -name \"*.ts\" | grep -v node_modules | xargs -I {} sh -c 'echo \"Verificando: {}\"; head -5 \"{}\"'"

echo ""
echo "📋 9. VERIFICAÇÃO DE DEPENDÊNCIAS..."
echo "-----------------------------------"

if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
    
    # Verificar se as dependências essenciais estão presentes
    DEPS_CHECK=(
        "prettier"
        "eslint"
        "@typescript-eslint/parser"
        "@typescript-eslint/eslint-plugin"
    )
    
    for dep in "${DEPS_CHECK[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            echo "✅ $dep encontrado"
        else
            echo "❌ $dep NÃO encontrado"
        fi
    done
else
    echo "❌ package.json não encontrado"
fi

echo ""
echo "🏁 RESUMO FINAL"
echo "==============="
echo "1. Execute os comandos de formatação sugeridos"
echo "2. Revise arquivos duplicados identificados"
echo "3. Corrija problemas de TypeScript/ESLint"
echo "4. Remova console.logs desnecessários"
echo "5. Instale dependências faltantes se necessário"

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "1. npx prettier --write \"src/**/*.{ts,tsx}\""
echo "2. npx eslint src/ --ext .ts,.tsx --fix"
echo "3. npm run build (para verificar compilação)"
echo "4. npm run dev (para testar funcionamento)"
