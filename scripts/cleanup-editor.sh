#!/bin/bash

# 🧹 Script de Limpeza do Editor
# Remove arquivos duplicados, quebrados e temporários

echo "🚀 Iniciando limpeza da pasta /editor..."

# Criar backup antes da limpeza
backup_dir="/workspaces/quiz-quest-challenge-verse/backup/editor-cleanup-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"

echo "📦 Criando backup em: $backup_dir"

# Arquivos a serem removidos (mas fazer backup primeiro)
files_to_remove=(
  "src/components/editor/EditorPro-backup.tsx"
  "src/components/editor/EditorPro-clean.tsx"
  "src/components/editor/EditorPro-WORKING.tsx"
  "src/components/editor/QuizEditorPro.corrected.tsx"
  "src/components/editor/EnhancedComponentsSidebar.tsx.broken"
  "src/components/editor/canvas/SortableBlockWrapper_temp.tsx"
)

echo "🔍 Arquivos identificados para remoção:"
for file in "${files_to_remove[@]}"; do
  if [ -f "/workspaces/quiz-quest-challenge-verse/$file" ]; then
    echo "  ✓ $file"
    # Fazer backup
    cp "/workspaces/quiz-quest-challenge-verse/$file" "$backup_dir/$(basename $file)"
  else
    echo "  ⚠️  $file (não encontrado)"
  fi
done

echo ""
echo "📋 Resumo da limpeza:"
echo "  - Arquivos para backup e remoção: ${#files_to_remove[@]}"
echo "  - Diretório de backup: $backup_dir"
echo ""
echo "⚠️  Execute este script manualmente para confirmar a limpeza"
echo "    bash scripts/cleanup-editor.sh --execute"

if [ "$1" = "--execute" ]; then
  echo ""
  echo "🗑️  Executando limpeza..."
  
  for file in "${files_to_remove[@]}"; do
    if [ -f "/workspaces/quiz-quest-challenge-verse/$file" ]; then
      rm "/workspaces/quiz-quest-challenge-verse/$file"
      echo "  ✅ Removido: $file"
    fi
  done
  
  echo ""
  echo "✨ Limpeza concluída!"
  echo "   Backup salvo em: $backup_dir"
else
  echo ""
  echo "💡 Para executar a limpeza, use: bash scripts/cleanup-editor.sh --execute"
fi
