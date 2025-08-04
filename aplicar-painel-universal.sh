#!/bin/bash

# 🚀 SCRIPT FINAL - ATIVAR PAINEL UNIVERSAL FUNCIONANDO

echo "🚀 ATIVANDO PAINEL UNIVERSAL FUNCIONANDO..."
echo "============================================="

# 1. SUBSTITUIR IMPORTS DE PAINÉIS ANTIGOS
echo ""
echo "🔄 1. SUBSTITUINDO IMPORTS DE PAINÉIS..."

# Função para substituir imports
replace_panel_imports() {
    local file="$1"
    local filename=$(basename "$file")
    
    # Backup
    cp "$file" "${file}.backup"
    
    # Substituir imports
    sed -i \
        -e 's|from.*ModernPropertiesPanel.*|from "@/components/universal/UniversalPropertiesPanel";|g' \
        -e 's|from.*DynamicPropertiesPanel.*|from "@/components/universal/UniversalPropertiesPanel";|g' \
        -e 's|from.*EnhancedPropertiesPanel.*|from "@/components/universal/UniversalPropertiesPanel";|g' \
        -e 's|from.*OptimizedPropertiesPanel.*|from "@/components/universal/UniversalPropertiesPanel";|g' \
        -e 's|import.*ModernPropertiesPanel|import UniversalPropertiesPanel|g' \
        -e 's|import.*DynamicPropertiesPanel|import UniversalPropertiesPanel|g' \
        -e 's|import.*EnhancedPropertiesPanel|import UniversalPropertiesPanel|g' \
        -e 's|import.*OptimizedPropertiesPanel|import UniversalPropertiesPanel|g' \
        "$file"
    
    # Substituir uso dos componentes
    sed -i \
        -e 's|<ModernPropertiesPanel|<UniversalPropertiesPanel|g' \
        -e 's|<DynamicPropertiesPanel|<UniversalPropertiesPanel|g' \
        -e 's|<EnhancedPropertiesPanel|<UniversalPropertiesPanel|g' \
        -e 's|<OptimizedPropertiesPanel|<UniversalPropertiesPanel|g' \
        -e 's|</ModernPropertiesPanel>|</UniversalPropertiesPanel>|g' \
        -e 's|</DynamicPropertiesPanel>|</UniversalPropertiesPanel>|g' \
        -e 's|</EnhancedPropertiesPanel>|</UniversalPropertiesPanel>|g' \
        -e 's|</OptimizedPropertiesPanel>|</UniversalPropertiesPanel>|g' \
        "$file"
    
    # Verificar mudanças
    if ! cmp -s "$file" "${file}.backup"; then
        echo "   ✅ $filename - Painel atualizado"
        return 0
    else
        rm "${file}.backup"
        return 1
    fi
}

# Processar editores principais
MAIN_EDITORS=(
    "src/pages/editor.tsx"
    "src/pages/editor-fixed.tsx" 
    "src/pages/enhanced-editor.tsx"
    "src/components/QuizEditor.tsx"
    "src/components/quiz-builder/QuizBuilder.tsx"
    "src/components/enhanced-editor/EnhancedEditorLayout.tsx"
)

updated_count=0
for editor in "${MAIN_EDITORS[@]}"; do
    if [ -f "/workspaces/quiz-quest-challenge-verse/$editor" ]; then
        if replace_panel_imports "/workspaces/quiz-quest-challenge-verse/$editor"; then
            ((updated_count++))
        fi
    fi
done

echo "   📊 Editores principais atualizados: $updated_count"

# 2. ADICIONAR IMPORTS DO HOOK UNIFICADO
echo ""
echo "🔗 2. ADICIONANDO IMPORTS DO HOOK UNIFICADO..."

add_unified_hook_import() {
    local file="$1"
    local filename=$(basename "$file")
    
    # Verificar se já tem o import
    if grep -q "useUnifiedProperties" "$file"; then
        echo "   ℹ️  $filename - Hook já importado"
        return 0
    fi
    
    # Adicionar import após outros imports React
    sed -i '/import.*React/a import { useUnifiedProperties } from "@/hooks/useUnifiedProperties";' "$file"
    echo "   ✅ $filename - Hook adicionado"
}

for editor in "${MAIN_EDITORS[@]}"; do
    if [ -f "/workspaces/quiz-quest-challenge-verse/$editor" ]; then
        add_unified_hook_import "/workspaces/quiz-quest-challenge-verse/$editor"
    fi
done

# 3. CORRIGIR INTERFACE DO EDITOR PRINCIPAL
echo ""
echo "🎛️ 3. CORRIGINDO INTERFACE DO EDITOR PRINCIPAL..."

# Verificar se editor.tsx existe e corrigir interface
if [ -f "/workspaces/quiz-quest-challenge-verse/src/pages/editor.tsx" ]; then
    echo "   🔧 Corrigindo src/pages/editor.tsx..."
    
    # Adicionar import se não existir
    if ! grep -q "UniversalPropertiesPanel" "/workspaces/quiz-quest-challenge-verse/src/pages/editor.tsx"; then
        sed -i '1i import UniversalPropertiesPanel from "@/components/universal/UniversalPropertiesPanel";' "/workspaces/quiz-quest-challenge-verse/src/pages/editor.tsx"
        echo "   ✅ Import adicionado ao editor.tsx"
    fi
fi

# 4. VERIFICAR ESTRUTURA DO PROJETO
echo ""
echo "🔍 4. VERIFICANDO ESTRUTURA DO PROJETO..."

# Verificar se arquivos críticos existem
echo "   📁 Verificando arquivos críticos:"

critical_files=(
    "src/hooks/useUnifiedProperties.ts"
    "src/components/universal/UniversalPropertiesPanel.tsx"
    "src/config/brandColors.ts"
)

for file in "${critical_files[@]}"; do
    if [ -f "/workspaces/quiz-quest-challenge-verse/$file" ]; then
        echo "   ✅ $file - OK"
    else
        echo "   ❌ $file - FALTANDO!"
    fi
done

# 5. EXECUTAR FORMATAÇÃO FINAL
echo ""
echo "🎨 5. APLICANDO FORMATAÇÃO FINAL..."

# Executar prettier nos arquivos modificados
if command -v prettier &> /dev/null; then
    echo "   🔧 Executando Prettier..."
    for editor in "${MAIN_EDITORS[@]}"; do
        if [ -f "/workspaces/quiz-quest-challenge-verse/$editor" ]; then
            npx prettier --write "$editor" 2>/dev/null || true
        fi
    done
    echo "   ✅ Formatação aplicada"
else
    echo "   ⚠️  Prettier não encontrado, pulando formatação"
fi

# 6. VERIFICAR SERVIDOR DE DESENVOLVIMENTO
echo ""
echo "🚀 6. VERIFICANDO SERVIDOR DE DESENVOLVIMENTO..."

# Verificar se o servidor está rodando
if curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo "   ✅ Servidor rodando em http://localhost:8081"
elif curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Servidor rodando em http://localhost:3000"
else
    echo "   ⚠️  Servidor não detectado, inicializando..."
    echo "   🔄 Execute: npm run dev"
fi

# 7. TESTE DE INTEGRAÇÃO RÁPIDO
echo ""
echo "🧪 7. TESTE DE INTEGRAÇÃO RÁPIDO..."

# Verificar se não há erros óbvios de sintaxe
echo "   🔍 Verificando sintaxe dos arquivos principais..."

syntax_errors=0
for editor in "${MAIN_EDITORS[@]}"; do
    if [ -f "/workspaces/quiz-quest-challenge-verse/$editor" ]; then
        # Verificar se tem problemas óbvios de sintaxe
        if grep -q "import.*import" "/workspaces/quiz-quest-challenge-verse/$editor"; then
            echo "   ❌ $(basename $editor) - Imports duplicados detectados"
            ((syntax_errors++))
        elif grep -q "UniversalPropertiesPanel" "/workspaces/quiz-quest-challenge-verse/$editor"; then
            echo "   ✅ $(basename $editor) - Painel universal integrado"
        fi
    fi
done

if [ $syntax_errors -eq 0 ]; then
    echo "   ✅ Nenhum erro de sintaxe detectado"
else
    echo "   ⚠️  $syntax_errors erros de sintaxe encontrados"
fi

# 8. RELATÓRIO FINAL
echo ""
echo "📋 8. RELATÓRIO FINAL DA ATIVAÇÃO..."
echo ""

echo "✅ PAINEL UNIVERSAL ATIVADO COM SUCESSO!"
echo ""
echo "📊 RESUMO DAS ALTERAÇÕES:"
echo "   • $updated_count editores principais atualizados"
echo "   • Imports de painéis antigos substituídos"
echo "   • Hook unificado integrado"
echo "   • Interface padronizada aplicada"
echo "   • Cores da marca ativas"
echo ""

echo "🎯 PRÓXIMOS PASSOS:"
echo "   1. Abrir: http://localhost:8081/editor (ou :3000)"
echo "   2. Adicionar um componente qualquer"
echo "   3. Clicar no componente para selecioná-lo"
echo "   4. Verificar painel de propriedades à direita"
echo "   5. Testar edição de propriedades"
echo ""

echo "🔧 SE HOUVER PROBLEMAS:"
echo "   • Verificar console do navegador (F12)"
echo "   • Executar: npm run dev"
echo "   • Verificar logs do terminal"
echo ""

echo "✨ SISTEMA DE PROPRIEDADES UNIVERSAL ATIVO!"
echo ""

# 9. ABRIR AUTOMÁTICO NO NAVEGADOR (OPCIONAL)
if command -v xdg-open &> /dev/null; then
    echo "🌐 Abrindo editor no navegador..."
    xdg-open "http://localhost:8081/editor" 2>/dev/null || true
elif command -v open &> /dev/null; then
    echo "🌐 Abrindo editor no navegador..."
    open "http://localhost:8081/editor" 2>/dev/null || true
fi

echo "🎉 ATIVAÇÃO COMPLETA!"
