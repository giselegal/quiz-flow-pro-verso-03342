#!/bin/bash

# 🧹 SCRIPT DE LIMPEZA E SINCRONIZAÇÃO DE BRANCHES
echo "🔄 Iniciando sincronização e limpeza de branches..."

# 1. Verificar branch atual
echo "📍 Branch atual: $(git branch --show-current)"

# 2. Buscar todas as atualizações
echo "📥 Buscando atualizações remotas..."
git fetch --all --prune

# 3. Sincronizar main
echo "🔄 Sincronizando branch main..."
git checkout main
git pull origin main

# 4. Listar branches locais (apenas informativo)
echo "📋 Branches locais:"
git branch --list

# 5. Verificar status final
echo "✅ Status final:"
git status --short

echo "🎉 Sincronização concluída!"
echo "💡 Para limpar branches antigas manualmente use:"
echo "   git branch -d <nome_da_branch>  # Para branches locais"
echo "   git push origin --delete <nome_da_branch>  # Para branches remotas"
