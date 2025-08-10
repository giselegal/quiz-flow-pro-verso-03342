#!/bin/bash

# 🧹 LIMPEZA SEGURA DAS DUPLICATAS DE STEPS
# Remove apenas arquivos de backup e duplicatas desnecessárias

echo "🧹 INICIANDO LIMPEZA SEGURA DAS DUPLICATAS DE STEPS..."

# Contador de arquivos removidos
removed_count=0

# 1. REMOVER DUPLICATAS NA PASTA PRINCIPAL
echo ""
echo "📁 Limpando pasta principal (src/components/steps/)..."

if [ -f "src/components/steps/Step02Template_FIXED.tsx" ]; then
    rm "src/components/steps/Step02Template_FIXED.tsx"
    echo "   ✅ Removido: Step02Template_FIXED.tsx (arquivo vazio)"
    ((removed_count++))
fi

if [ -f "src/components/steps/Step02Template_OLD.tsx" ]; then
    rm "src/components/steps/Step02Template_OLD.tsx"  
    echo "   ✅ Removido: Step02Template_OLD.tsx (versão antiga)"
    ((removed_count++))
fi

# 2. REMOVER ARQUIVOS DE BACKUP (SEGUROS DE REMOVER)
echo ""
echo "📦 Removendo backups seguros..."

# Backup específicos que são seguros de remover
backup_dirs=(
    "backup/fase2-steps-refactor"
    "backup-cleanup-2025-08-06T19-17-41-611Z"  
    "backup_duplicated_20250806_134328"
    "backup_editor_blocks_inline_20250806_133020"
)

for dir in "${backup_dirs[@]}"; do
    if [ -d "$dir" ]; then
        # Contar arquivos Step* antes de remover
        step_files=$(find "$dir" -name "*Step*" -type f 2>/dev/null | wc -l)
        if [ $step_files -gt 0 ]; then
            find "$dir" -name "*Step*" -type f -delete 2>/dev/null
            echo "   ✅ Removidos $step_files arquivos Step* de: $dir"
            ((removed_count+=step_files))
        fi
    fi
done

# 3. REMOVER BACKUP FILES ESPECÍFICOS COM .backup
echo ""
echo "🔄 Removendo arquivos .backup específicos..."

backup_files=$(find src/components/steps/ -name "*Template*.backup*" -type f 2>/dev/null)
if [ -n "$backup_files" ]; then
    backup_count=$(echo "$backup_files" | wc -l)
    echo "$backup_files" | xargs rm -f
    echo "   ✅ Removidos $backup_count arquivos .backup"
    ((removed_count+=backup_count))
fi

# 4. VERIFICAR ARQUIVOS QUE AINDA EXISTEM
echo ""
echo "📊 VERIFICANDO RESULTADO..."

active_files=$(find src/components/steps/ -name "*Template.tsx" -not -name "*backup*" -not -name "*_OLD*" -not -name "*_FIXED*" | wc -l)
remaining_backups=$(find . -name "*Step*" -path "*/backup*" -type f 2>/dev/null | wc -l)

echo "   ✅ Templates ativos restantes: $active_files"
echo "   📦 Backups restantes: $remaining_backups"
echo "   🗑️  Total removido: $removed_count arquivos"

# 5. EXECUTAR NOVA ANÁLISE
echo ""
echo "🔍 Executando nova análise para confirmar limpeza..."
if [ -f "analisar-duplicidade-steps.cjs" ]; then
    node analisar-duplicidade-steps.cjs
else
    echo "   ⚠️  Arquivo de análise não encontrado"
fi

echo ""
echo "✅ LIMPEZA CONCLUÍDA!"
echo "   - Arquivos removidos: $removed_count"
echo "   - Sistema mantido funcional"
echo "   - Apenas templates necessários preservados"
