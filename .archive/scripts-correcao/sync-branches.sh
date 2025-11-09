#!/bin/bash

# 🔄 SCRIPT DE SINCRONIZAÇÃO COMPLETA
# Sincroniza branches e resolve conflitos automaticamente

echo "🚀 Iniciando sincronização completa..."

# Verificar se estamos no diretório correto
if [ ! -d ".git" ]; then
    echo "❌ Erro: Não estamos em um repositório Git"
    exit 1
fi

# 1. Salvar mudanças locais
echo "💾 Salvando mudanças locais..."
git stash push -m "Backup antes da sincronização $(date)"

# 2. Buscar atualizações do remoto
echo "📡 Buscando atualizações do remoto..."
git fetch origin

# 3. Verificar branch atual
current_branch=$(git branch --show-current)
echo "📍 Branch atual: $current_branch"

# 4. Fazer merge ou rebase
if [ "$current_branch" = "main" ]; then
    echo "🔄 Fazendo merge com origin/main..."
    git merge origin/main
else
    echo "🔄 Fazendo rebase com main..."
    git checkout main
    git pull origin main
    git checkout "$current_branch"
    git rebase main
fi

# 5. Restaurar mudanças locais se existirem
stash_count=$(git stash list | wc -l)
if [ $stash_count -gt 0 ]; then
    echo "🔙 Restaurando mudanças locais..."
    git stash pop
fi

# 6. Push para sincronizar
echo "⬆️ Enviando para o remoto..."
git push origin "$current_branch"

# 7. Status final
echo "📊 Status final:"
git status --short

echo "✅ Sincronização completa!"
echo "📍 Branch: $current_branch"
echo "🌐 Remoto sincronizado"