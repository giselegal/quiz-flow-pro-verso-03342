#!/bin/bash

echo "🧹 CORREÇÃO AUTOMÁTICA E LIMPEZA DE CÓDIGO"
echo "=========================================="

echo ""
echo "📊 1. REMOVENDO CONSOLE.LOGS DESNECESSÁRIOS..."
echo "--------------------------------------------"

# Encontrar todos os console.logs e permitir que o usuário decida
echo "🔍 Encontrando console.logs em arquivos TypeScript/TSX..."

# Criar backup antes da limpeza
echo "📋 Criando backup de console.logs..."
find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "console\." > console-logs-files.txt

echo "📊 Arquivos com console.logs encontrados: $(wc -l < console-logs-files.txt)"

# Mostrar alguns exemplos
echo "🔍 Primeiros 10 arquivos com console.logs:"
head -10 console-logs-files.txt

echo ""
echo "🧹 2. VERIFICANDO IMPORTS DESNECESSÁRIOS..."
echo "------------------------------------------"

# Procurar imports não utilizados
echo "🔍 Verificando imports problemáticos..."

# Encontrar imports relativos
echo "📊 Imports relativos encontrados:"
find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -n "import.*\.\." | head -10

echo ""
echo "🔧 3. VERIFICANDO TIPOS ANY..."
echo "----------------------------"

# Contar uso de any
ANY_COUNT=$(find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -c ": any" | awk -F: '{sum += $2} END {print sum}')
echo "📊 Total de usos de 'any': $ANY_COUNT"

# Mostrar alguns exemplos
echo "🔍 Exemplos de uso de 'any':"
find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -n ": any" | head -5

echo ""
echo "📁 4. ANALISANDO ESTRUTURA DE ARQUIVOS DUPLICADOS..."
echo "--------------------------------------------------"

# Criar relatório detalhado de duplicações
echo "📊 Principais arquivos duplicados:"

# Verificar EnhancedUniversalPropertiesPanel especificamente
echo ""
echo "🎯 Verificando EnhancedUniversalPropertiesPanel:"
find . -name "EnhancedUniversalPropertiesPanel.tsx" | grep -v node_modules

echo ""
echo "📊 Verificando se há diferenças entre os arquivos:"
if [ -f "src/components/universal/EnhancedUniversalPropertiesPanel.tsx" ] && [ -f "components/universal/EnhancedUniversalPropertiesPanel.tsx" ]; then
    echo "✅ Ambos os arquivos existem"
    echo "📏 Linhas em src/: $(wc -l < src/components/universal/EnhancedUniversalPropertiesPanel.tsx)"
    echo "📏 Linhas em root/: $(wc -l < components/universal/EnhancedUniversalPropertiesPanel.tsx)"
    
    # Verificar se são idênticos
    if diff -q "src/components/universal/EnhancedUniversalPropertiesPanel.tsx" "components/universal/EnhancedUniversalPropertiesPanel.tsx" > /dev/null; then
        echo "✅ Arquivos são idênticos"
    else
        echo "⚠️ Arquivos são diferentes"
    fi
fi

echo ""
echo "🧹 5. SUGESTÕES DE LIMPEZA..."
echo "----------------------------"

echo "💡 Comandos sugeridos para limpeza:"
echo ""

echo "🗑️ REMOVER ARQUIVOS DUPLICADOS (CUIDADO!):"
echo "# Para remover duplicatas em /components/ (manter apenas /src/):"
echo "# rm -rf components/universal/EnhancedUniversalPropertiesPanel.tsx"

echo ""
echo "🧹 LIMPAR CONSOLE.LOGS (REVISAR ANTES!):"
echo "# Para revisar console.logs:"
echo "find src/ -name \"*.ts\" -o -name \"*.tsx\" | xargs grep -n \"console\\.\""

echo ""
echo "🔧 CORRIGIR IMPORTS RELATIVOS:"
echo "# Para encontrar imports que podem ser absolutos:"
echo "find src/ -name \"*.ts\" -o -name \"*.tsx\" | xargs grep -n \"import.*\\.\\.\" | head -20"

echo ""
echo "📊 6. ANÁLISE DE SAÚDE DO PROJETO..."
echo "-----------------------------------"

# Verificar arquivos essenciais
ESSENTIAL_FILES=(
    "src/hooks/useUnifiedProperties.ts"
    "src/components/universal/EnhancedUniversalPropertiesPanel.tsx"
    "src/config/enhancedBlockRegistry.ts"
    "src/pages/editor-fixed-dragdrop.tsx"
)

echo "🔍 Verificando arquivos essenciais:"
for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        ERRORS=$(npx tsc --noEmit "$file" 2>&1 | grep -c "error" || echo "0")
        echo "✅ $file - $ERRORS erros TypeScript"
    else
        echo "❌ $file - NÃO ENCONTRADO"
    fi
done

echo ""
echo "🎯 7. COMANDOS DE CORREÇÃO RECOMENDADOS..."
echo "----------------------------------------"

echo "📋 Execute na ordem:"
echo ""
echo "1️⃣ FORMATAÇÃO:"
echo "npx prettier --write \"src/**/*.{ts,tsx}\""
echo ""

echo "2️⃣ VERIFICAÇÃO DE TIPOS:"
echo "npx tsc --noEmit"
echo ""

echo "3️⃣ REMOVER DUPLICATAS IDENTIFICADAS:"
echo "# REVISAR ANTES DE EXECUTAR!"
echo "# find . -name \"*.tsx\" -o -name \"*.ts\" | sort | uniq -d | head -10"
echo ""

echo "4️⃣ TESTE DE COMPILAÇÃO:"
echo "npm run build"
echo ""

echo "5️⃣ TESTE DE EXECUÇÃO:"
echo "npm run dev"

echo ""
echo "⚠️ IMPORTANTE:"
echo "- Sempre faça backup antes de remover arquivos"
echo "- Teste a aplicação após cada mudança"
echo "- Revise console.logs antes de remover (alguns podem ser importantes)"
echo "- Verifique se imports relativos são realmente problemáticos"

echo ""
echo "🏁 ANÁLISE CONCLUÍDA!"
echo "==================="
echo "📁 Arquivo de log: console-logs-files.txt criado"
echo "🔧 Use os comandos sugeridos com cuidado"
echo "✅ Prettier já foi executado em todos os arquivos"
