#!/bin/bash

# Script para corrigir todas as cores fora da paleta da marca
# Cores aprovadas: #B89B7A, #432818, #8B7355, #FEFEFE

echo "🎨 Iniciando correção da paleta de cores..."

# Array de substituições: ANTES → DEPOIS
declare -A substituicoes=(
    # Yellow → Brand
    ["yellow-50"]="brand/10"
    ["yellow-100"]="brand/20"  
    ["yellow-200"]="brand/30"
    ["yellow-300"]="brand/40"
    ["yellow-400"]="brand/60"
    ["yellow-500"]="brand"
    ["yellow-600"]="brand-dark"
    ["yellow-700"]="brand-dark"
    ["yellow-800"]="brand-dark"
    
    # Blue → Brand
    ["blue-50"]="brand/10"
    ["blue-100"]="brand/20"
    ["blue-200"]="brand/30"
    ["blue-300"]="brand/40"
    ["blue-400"]="brand/60"
    ["blue-500"]="brand"
    ["blue-600"]="brand-dark"
    ["blue-700"]="brand-dark"
    ["blue-800"]="brand-dark"
    
    # Green → Brand
    ["green-50"]="brand/10"
    ["green-100"]="brand/20"
    ["green-200"]="brand/30"
    ["green-300"]="brand/40"
    ["green-400"]="brand/60"
    ["green-500"]="brand"
    ["green-600"]="brand-dark"
    ["green-700"]="brand-dark"
    ["green-800"]="brand-dark"
    
    # Purple → Brand
    ["purple-50"]="brand/10"
    ["purple-100"]="brand/20"
    ["purple-200"]="brand/30"
    ["purple-300"]="brand/40"
    ["purple-400"]="brand/60"
    ["purple-500"]="brand"
    ["purple-600"]="brand-dark"
    ["purple-700"]="brand-dark"
    ["purple-800"]="brand-dark"
    
    # Red → Brand Dark
    ["red-50"]="brand-dark/10"
    ["red-100"]="brand-dark/20"
    ["red-200"]="brand-dark/30"
    ["red-300"]="brand-dark/40"
    ["red-400"]="brand-dark/60"
    ["red-500"]="brand-dark"
    ["red-600"]="brand-dark"
    ["red-700"]="brand-dark"
    ["red-800"]="brand-dark"
    
    # Orange → Brand
    ["orange-50"]="brand/10"
    ["orange-100"]="brand/20"
    ["orange-200"]="brand/30"
    ["orange-300"]="brand/40"
    ["orange-400"]="brand/60"
    ["orange-500"]="brand"
    ["orange-600"]="brand-dark"
    ["orange-700"]="brand-dark"
    ["orange-800"]="brand-dark"
)

# Função para aplicar substituições
aplicar_substituicoes() {
    local arquivo="$1"
    local modificado=false
    
    for antes in "${!substituicoes[@]}"; do
        local depois="${substituicoes[$antes]}"
        
        # Verifica se o arquivo contém a cor antiga
        if grep -q "$antes" "$arquivo"; then
            echo "  🔄 $antes → $depois"
            sed -i "s/$antes/$depois/g" "$arquivo"
            modificado=true
        fi
    done
    
    if [ "$modificado" = true ]; then
        echo "✅ $arquivo atualizado"
    fi
}

# Processa arquivos TypeScript/TSX
echo "📁 Processando arquivos .tsx e .ts..."
find src -name "*.tsx" -o -name "*.ts" | while read arquivo; do
    aplicar_substituicoes "$arquivo"
done

# Processa arquivos CSS
echo "📁 Processando arquivos .css..."
find src -name "*.css" | while read arquivo; do
    aplicar_substituicoes "$arquivo"
done

echo "🎯 Correção de paleta concluída!"
echo "✨ Agora todos os componentes usam apenas as cores da marca:"
echo "   🤎 #B89B7A (brand)"
echo "   🌰 #432818 (brand-dark)" 
echo "   🏆 #8B7355 (gradiente)"
echo "   ⚪ #FEFEFE (branco)"
