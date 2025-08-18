#!/bin/bash

# 🚀 COMMIT RÁPIDO - Quiz Quest
# Uso: ./quick-commit.sh "mensagem"

COMMIT_MSG="${1:-Atualização rápida}"

echo "⚡ COMMIT RÁPIDO: $COMMIT_MSG"
echo "================================"

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "$COMMIT_MSG"

# Push
git push origin main

echo "✅ Commit enviado com sucesso!"
