#!/bin/bash

# Script para atualizar imports diretos de arquivos específicos para barrel exports
# Sprint 1 - Task 3: Unificação de Contexts - Fase 2
# Data: 2025-10-10

echo "🔄 Atualizando imports diretos para barrel exports..."
echo ""

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
    
    # Substituir imports diretos de arquivos por barrel exports
    sed -i "s|from '@/contexts/UnifiedCRUDProvider'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/AuthContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/ThemeContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/PreviewContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/EditorContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/FunnelsContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/QuizContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/ScrollSyncContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/QuizFlowProvider'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/EditorRuntimeProviders'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/UserDataContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/StepsContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/UnifiedConfigContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/AdminAuthContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/TimelineContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/EditorQuizContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/UnifiedFunnelContext'|from '@/contexts'|g" "$file"
    sed -i "s|from '@/contexts/ValidationContext'|from '@/contexts'|g" "$file"
    
    # Verificar se houve mudanças
    if ! cmp -s "$file" "$file.bak"; then
        echo "✅ $file"
        changed=true
        ((total++))
    fi
    
    # Remover backup
    rm "$file.bak"
}

# Processar todos os arquivos .ts e .tsx em src/ (exceto backup/archived)
while IFS= read -r -d '' file; do
    update_file "$file"
done < <(find /workspaces/quiz-quest-challenge-verse/src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/backup*" ! -path "*/archived*" -print0)

echo ""
echo "📊 Total de arquivos atualizados: $total"
echo "✅ Imports diretos convertidos para barrel exports!"
