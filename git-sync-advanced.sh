#!/bin/bash

# =================================================================
# Script de Sincronização Avançada - Git Batch Commands
# =================================================================

set -e  # Parar em caso de erro

echo "🔄 Git Batch Sync - Sincronização Rápida"
echo "========================================"

# Função para executar comandos com feedback
run_cmd() {
    echo "▶️  $1"
    eval $1
    echo "✅ Concluído"
    echo ""
}

# 1. Status inicial
echo "📊 ETAPA 1: Verificando status inicial"
run_cmd "git status --short"

# 2. Salvar trabalho local
echo "💾 ETAPA 2: Salvando trabalho local"
run_cmd "git add ."
run_cmd "git commit -m 'feat: painel propriedades ativado + sync scripts' || echo 'Nada para commitar'"

# 3. Buscar atualizações
echo "📥 ETAPA 3: Buscando atualizações do remoto"
run_cmd "git fetch origin"

# 4. Verificar divergência
echo "🔍 ETAPA 4: Verificando divergências"
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base @ @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "✅ Já sincronizado!"
elif [ $LOCAL = $BASE ]; then
    echo "⬇️  Apenas mudanças remotas - fazendo pull"
    run_cmd "git pull origin main"
elif [ $REMOTE = $BASE ]; then
    echo "⬆️  Apenas mudanças locais - fazendo push"
    run_cmd "git push origin main"
else
    echo "🔀 Divergência detectada - fazendo merge"
    run_cmd "git merge origin/main --no-edit"
    run_cmd "git push origin main"
fi

# 5. Status final
echo "🎉 ETAPA 5: Verificação final"
run_cmd "git status"
run_cmd "git log --oneline -3"

echo ""
echo "✅ SINCRONIZAÇÃO CONCLUÍDA COM SUCESSO!"
echo "🌟 Painel de propriedades ativado e sincronizado"
