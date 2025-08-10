#!/bin/bash

# Script para substituir cores fora da identidade visual da marca
# Paleta da marca: #FEFEFE, #432818, #B89B7A, #6B4F43, #FAF9F7, #E5DDD5

echo "🎨 Iniciando transformação de cores para identidade da marca..."

# Definir mapeamentos de substituição
declare -A color_mappings=(
    # Azuis -> Tom principal da marca
    ["bg-blue-50"]="style={{ backgroundColor: '#FAF9F7' }}"
    ["bg-blue-100"]="style={{ backgroundColor: '#E5DDD5' }}"
    ["bg-blue-500"]="style={{ backgroundColor: '#B89B7A' }}"
    ["bg-blue-600"]="style={{ backgroundColor: '#B89B7A' }}"
    ["text-blue-500"]="style={{ color: '#B89B7A' }}"
    ["text-blue-600"]="style={{ color: '#B89B7A' }}"
    ["text-blue-700"]="style={{ color: '#6B4F43' }}"
    ["border-blue-300"]="style={{ borderColor: '#E5DDD5' }}"
    ["border-blue-400"]="style={{ borderColor: '#B89B7A' }}"
    ["border-blue-500"]="style={{ borderColor: '#B89B7A' }}"
    ["border-blue-600"]="style={{ borderColor: '#B89B7A' }}"
    ["ring-blue-500"]="style={{ boxShadow: '0 0 0 3px rgba(184, 155, 122, 0.5)' }}"
    
    # Roxos -> Tom principal da marca
    ["bg-purple-50"]="style={{ backgroundColor: '#FAF9F7' }}"
    ["bg-purple-100"]="style={{ backgroundColor: '#E5DDD5' }}"
    ["bg-purple-500"]="style={{ backgroundColor: '#B89B7A' }}"
    ["bg-purple-600"]="style={{ backgroundColor: '#B89B7A' }}"
    ["text-purple-500"]="style={{ color: '#B89B7A' }}"
    ["text-purple-600"]="style={{ color: '#B89B7A' }}"
    ["text-purple-700"]="style={{ color: '#6B4F43' }}"
    ["text-purple-900"]="style={{ color: '#432818' }}"
    ["border-purple-200"]="style={{ borderColor: '#E5DDD5' }}"
    ["border-purple-400"]="style={{ borderColor: '#B89B7A' }}"
    
    # Vermelhos -> Tom de alerta (manter funcionalidade)
    ["bg-red-50"]="style={{ backgroundColor: '#FAF9F7' }}"
    ["bg-red-200"]="style={{ backgroundColor: '#E5DDD5' }}"
    ["text-red-500"]="style={{ color: '#432818' }}"
    ["text-red-600"]="style={{ color: '#432818' }}"
    ["border-red-200"]="style={{ borderColor: '#E5DDD5' }}"
    ["border-red-300"]="style={{ borderColor: '#B89B7A' }}"
    
    # Amarelos -> Tom neutro da marca
    ["bg-yellow-50"]="style={{ backgroundColor: '#FAF9F7' }}"
    ["bg-yellow-100"]="style={{ backgroundColor: '#E5DDD5' }}"
    ["bg-yellow-200"]="style={{ backgroundColor: '#E5DDD5' }}"
    ["text-yellow-700"]="style={{ color: '#6B4F43' }}"
    ["text-yellow-800"]="style={{ color: '#432818' }}"
    ["border-yellow-200"]="style={{ borderColor: '#E5DDD5' }}"
    
    # Verdes -> Tom neutro da marca
    ["bg-green-100"]="style={{ backgroundColor: '#E5DDD5' }}"
    ["text-green-700"]="style={{ color: '#6B4F43' }}"
    
    # Âmbar/Laranja -> Tom principal da marca
    ["bg-amber-50"]="style={{ backgroundColor: '#FAF9F7' }}"
    ["text-amber-700"]="style={{ color: '#6B4F43' }}"
    ["text-amber-800"]="style={{ color: '#432818' }}"
    ["ring-amber-500"]="style={{ boxShadow: '0 0 0 3px rgba(184, 155, 122, 0.5)' }}"
    ["border-amber-200"]="style={{ borderColor: '#E5DDD5' }}"
    
    # Rosa -> Tom principal da marca
    ["bg-pink-50"]="style={{ backgroundColor: '#FAF9F7' }}"
    ["text-pink-500"]="style={{ color: '#B89B7A' }}"
    ["text-pink-600"]="style={{ color: '#B89B7A' }}"
    ["text-pink-900"]="style={{ color: '#432818' }}"
    
    # Cinzas -> Tons neutros da marca
    ["bg-gray-50"]="style={{ backgroundColor: '#FAF9F7' }}"
    ["bg-gray-100"]="style={{ backgroundColor: '#E5DDD5' }}"
    ["bg-gray-200"]="style={{ backgroundColor: '#E5DDD5' }}"
    ["text-gray-500"]="style={{ color: '#8B7355' }}"
    ["text-gray-600"]="style={{ color: '#6B4F43' }}"
    ["text-gray-700"]="style={{ color: '#6B4F43' }}"
    ["text-gray-800"]="style={{ color: '#432818' }}"
    ["text-gray-900"]="style={{ color: '#432818' }}"
    ["border-gray-200"]="style={{ borderColor: '#E5DDD5' }}"
    ["border-gray-300"]="style={{ borderColor: '#E5DDD5' }}"
    ["hover:bg-gray-50"]="hover:style={{ backgroundColor: '#FAF9F7' }}"
    ["hover:bg-gray-200"]="hover:style={{ backgroundColor: '#E5DDD5' }}"
    
    # Indigo -> Tom principal da marca
    ["bg-indigo-50"]="style={{ backgroundColor: '#FAF9F7' }}"
    ["bg-indigo-600"]="style={{ backgroundColor: '#B89B7A' }}"
    ["text-indigo-600"]="style={{ color: '#B89B7A' }}"
    ["text-indigo-700"]="style={{ color: '#6B4F43' }}"
)

# Função para processar arquivos
process_file() {
    local file="$1"
    echo "📝 Processando: $file"
    
    # Backup do arquivo original
    cp "$file" "$file.backup"
    
    # Aplicar substituições
    for old_color in "${!color_mappings[@]}"; do
        new_style="${color_mappings[$old_color]}"
        
        # Substituir classes Tailwind por estilos inline
        sed -i "s/className=\"[^\"]*${old_color}[^\"]*\"/className=\"\" ${new_style}/g" "$file"
        
        # Limpar classes vazias
        sed -i 's/className="" //g' "$file"
        sed -i 's/className=""//g' "$file"
    done
    
    echo "✅ Processado: $file"
}

# Encontrar e processar arquivos TypeScript/React
echo "🔍 Localizando arquivos para transformação..."

find /workspaces/quiz-quest-challenge-verse/src -name "*.tsx" -o -name "*.ts" | while read -r file; do
    # Verificar se o arquivo contém cores fora da paleta
    if grep -qE "(blue|purple|red|yellow|green|amber|pink|indigo|gray)-[0-9]+" "$file"; then
        process_file "$file"
    fi
done

echo "🎉 Transformação concluída!"
echo "📋 Cores substituídas para a paleta da marca:"
echo "   • #FEFEFE (fundo principal)"
echo "   • #432818 (texto escuro)"
echo "   • #B89B7A (destaque principal)"
echo "   • #6B4F43 (texto médio)"
echo "   • #FAF9F7 (fundo suave)"
echo "   • #E5DDD5 (bordas e elementos sutis)"
echo ""
echo "💾 Backups salvos com extensão .backup"
