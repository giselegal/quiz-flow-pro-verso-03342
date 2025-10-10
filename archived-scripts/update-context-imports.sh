#!/bin/bash

# Script para atualizar imports de @/context para @/contexts
# Sprint 1 - Task 3: Unificação de Contexts
# Data: 2025-10-10

echo "🔄 Atualizando imports dos contexts..."
echo ""

# Contador
total=0

# Função para atualizar imports em um arquivo
update_file() {
    local file="$1"
    local changed=false
    
    # Verificar se o arquivo não é do backup
    if [[ "$file" == *"backup"* ]] || [[ "$file" == *"archived"* ]]; then
        return
    fi
    
    # Criar backup temporário
    cp "$file" "$file.bak"
    
    # Substituir @/context/ por @/contexts/
    sed -i "s|from '@/context/|from '@/contexts/|g" "$file"
    sed -i 's|from "@/context/|from "@/contexts/|g' "$file"
    
    # Verificar se houve mudanças
    if ! cmp -s "$file" "$file.bak"; then
        echo "✅ $file"
        changed=true
        ((total++))
    fi
    
    # Remover backup
    rm "$file.bak"
}

# Processar todos os arquivos .ts e .tsx em src/
while IFS= read -r -d '' file; do
    update_file "$file"
done < <(find /workspaces/quiz-quest-challenge-verse/src -type f \( -name "*.ts" -o -name "*.tsx" \) -print0)

echo ""
echo "📊 Total de arquivos atualizados: $total"
echo "✅ Imports atualizados com sucesso!"
