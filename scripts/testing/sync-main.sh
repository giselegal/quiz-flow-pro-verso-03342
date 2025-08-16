#!/bin/bash

# =================================================================
# Script de Sincronização Rápida - Git Batch Update
# =================================================================

echo "🚀 Iniciando sincronização rápida com origin/main..."

# 1. Verificar status atual
echo "📋 Status atual:"
git status --porcelain

# 2. Adicionar todas as mudanças
echo "➕ Adicionando mudanças..."
git add -A

# 3. Commit rápido se houver mudanças
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Fazendo commit das mudanças locais..."
    git commit -m "chore: sync local changes before merge"
else
    echo "✅ Nenhuma mudança local para commit"
fi

# 4. Fetch do remoto
echo "📥 Buscando atualizações do remoto..."
git fetch origin main

# 5. Merge ou rebase (escolha uma opção)
echo "🔄 Sincronizando com origin/main..."

# Opção A: Merge (preserva histórico)
git merge origin/main --no-edit

# Opção B: Rebase (histórico linear) - descomente para usar
# git rebase origin/main

# 6. Push das mudanças
echo "📤 Enviando mudanças para o remoto..."
git push origin main

echo "✅ Sincronização concluída com sucesso!"
echo "📊 Status final:"
git status --short
