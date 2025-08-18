#!/bin/bash

# Criar diretório de backup
BACKUP_DIR="src/pages/backup_editors_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Lista de arquivos a serem movidos para backup
BACKUP_FILES=(
  "src/pages/editor-minimal.tsx"
  "src/pages/editor-debug-minimal.tsx"
  "src/pages/editor-fixed-simple.tsx"
  "src/pages/editor-fixed-dragdrop.tsx"
  "src/pages/editor-optimized.tsx"
  "src/pages/editor-fixed-debug.tsx"
  "src/pages/editor-fixed-dragdrop-clean.tsx"
  "src/pages/editor-fixed-simples.tsx"
  "src/pages/editor-backup-20250811-125122.tsx"
  "src/pages/editor-test.tsx"
)

# Mover arquivos para backup
for file in "${BACKUP_FILES[@]}"; do
  if [ -f "$file" ]; then
    mv "$file" "$BACKUP_DIR/"
    echo "Moved $file to backup"
  fi
done

echo "Backup completed in $BACKUP_DIR"
