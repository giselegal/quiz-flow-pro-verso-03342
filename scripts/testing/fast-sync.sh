#!/bin/bash

# =================================================================
# Git Fast Sync - Comandos em lote otimizados
# =================================================================

echo "⚡ Fast Git Sync"
echo "==============="

# Comando único otimizado
git add . && \
git commit -m "chore: sync $(date +'%Y-%m-%d %H:%M')" || true && \
git fetch origin && \
git merge origin/main --no-edit && \
git push origin main && \
echo "✅ Sincronização concluída!" && \
git status --short

echo ""
echo "🎯 Branch sincronizado com origin/main"
