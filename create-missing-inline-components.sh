#!/bin/bash

# Script para criar componentes inline que faltam com interface BlockComponentProps

echo "🔍 Analisando componentes que precisam ser criados/atualizados..."

# Lista de tipos de componentes únicos dos 21 steps
COMPONENT_TYPES=(
    "quiz-intro-header"
    "decorative-bar-inline"
    "text-inline"
    "image-display-inline"
    "form-input"
    "button-inline"
    "legal-notice-inline"
    "heading"
    "options-grid"
    "result-header"
    "result-card"
    "style-results-block"
)

# Verificar quais já existem com BlockComponentProps
echo "📋 Verificando componentes existentes com BlockComponentProps:"
grep -r "BlockComponentProps" src/components/blocks/ | grep -E "(\.tsx|\.ts)" | cut -d: -f1 | sort | uniq

echo ""
echo "🚀 Componentes que precisam ser criados ou atualizados:"

# Verificar cada tipo
for component in "${COMPONENT_TYPES[@]}"; do
    # Converter kebab-case para PascalCase
    component_name=$(echo "$component" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^./\U&/')
    
    # Procurar por arquivos relacionados
    found_files=$(find src/components/blocks/ -name "*${component_name}*" 2>/dev/null || true)
    
    if [ -z "$found_files" ]; then
        echo "❌ $component ($component_name) - PRECISA SER CRIADO"
    else
        echo "✅ $component ($component_name) - Existe: $found_files"
        # Verificar se usa BlockComponentProps
        for file in $found_files; do
            if grep -q "BlockComponentProps" "$file" 2>/dev/null; then
                echo "   ✓ Já usa BlockComponentProps"
            else
                echo "   ⚠️  Precisa ser atualizado para usar BlockComponentProps"
            fi
        done
    fi
done

echo ""
echo "📊 RESUMO DA ANÁLISE:"
echo "Total de tipos de componentes únicos: ${#COMPONENT_TYPES[@]}"

# Contar quantos existem
existing_count=0
for component in "${COMPONENT_TYPES[@]}"; do
    component_name=$(echo "$component" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^./\U&/')
    found_files=$(find src/components/blocks/ -name "*${component_name}*" 2>/dev/null || true)
    if [ ! -z "$found_files" ]; then
        ((existing_count++))
    fi
done

echo "Componentes que já existem: $existing_count"
echo "Componentes que precisam ser criados: $((${#COMPONENT_TYPES[@]} - existing_count))"
