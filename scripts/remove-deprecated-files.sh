#!/bin/bash
set -e

ROOT_DIR=$(dirname "$0")/..
cd "$ROOT_DIR"

STAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/deprecated-$STAMP"

echo "🗑️ Removendo arquivos DEPRECATED... (backup em $BACKUP_DIR)"

mkdir -p "$BACKUP_DIR"

# Backup se existirem
[ -f src/data/quizSteps.ts ] && cp src/data/quizSteps.ts "$BACKUP_DIR/" || true
[ -f src/templates/quiz21StepsComplete.ts ] && cp src/templates/quiz21StepsComplete.ts "$BACKUP_DIR/" || true

# Deletar arquivos (apenas se presentes)
rm -f src/data/quizSteps.ts || true
rm -f src/templates/quiz21StepsComplete.ts || true

echo "✅ Arquivos removidos (se existiam). Backup em $BACKUP_DIR"}