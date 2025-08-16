#!/bin/bash

# 🔄 SCRIPT DE REBASE E MERGE AUTOMÁTICO
# Automatiza o processo de rebase, merge e push para o repositório

set -e  # Sair se algum comando falhar

echo "🚀 INICIANDO PROCESSO DE REBASE E MERGE"
echo "======================================="

# Função para verificar se há mudanças não commitadas
check_clean_working_tree() {
    if ! git diff-index --quiet HEAD --; then
        echo "❌ Erro: Há mudanças não commitadas no working tree"
        echo "💡 Commit ou stash suas mudanças antes de continuar"
        git status
        exit 1
    fi
}

# Função para fazer backup da branch atual
backup_current_branch() {
    local current_branch=$(git branch --show-current)
    local backup_name="${current_branch}-backup-$(date +%Y%m%d-%H%M%S)"
    
    echo "📦 Criando backup da branch atual: $backup_name"
    git branch "$backup_name"
    echo "✅ Backup criado: $backup_name"
}

# Função principal de rebase e merge
perform_rebase_merge() {
    local target_branch=${1:-main}
    local current_branch=$(git branch --show-current)
    
    echo "🌿 Branch atual: $current_branch"
    echo "🎯 Branch de destino: $target_branch"
    
    # 1. Verificar working tree limpo
    echo "🔍 Verificando working tree..."
    check_clean_working_tree
    
    # 2. Criar backup
    backup_current_branch
    
    # 3. Fetch das últimas mudanças
    echo "📥 Fazendo fetch das últimas mudanças..."
    git fetch origin
    
    # 4. Checkout para a branch de destino e pull
    echo "🔄 Atualizando branch $target_branch..."
    git checkout "$target_branch"
    git pull origin "$target_branch"
    
    # 5. Voltar para a branch de trabalho
    echo "🔄 Voltando para branch $current_branch..."
    git checkout "$current_branch"
    
    # 6. Rebase interativo (opcional) ou normal
    echo "🔄 Fazendo rebase da branch $current_branch em $target_branch..."
    if [ "$2" = "--interactive" ]; then
        echo "🎮 Modo interativo ativado"
        git rebase -i "origin/$target_branch"
    else
        git rebase "origin/$target_branch"
    fi
    
    # 7. Verificar se o rebase foi bem-sucedido
    if [ $? -eq 0 ]; then
        echo "✅ Rebase concluído com sucesso!"
    else
        echo "❌ Erro durante o rebase. Resolva os conflitos e execute:"
        echo "   git rebase --continue"
        echo "   ou cancele com: git rebase --abort"
        exit 1
    fi
    
    # 8. Checkout para a branch de destino
    echo "🔄 Fazendo checkout para $target_branch..."
    git checkout "$target_branch"
    
    # 9. Merge da branch rebased
    echo "🔄 Fazendo merge de $current_branch..."
    if [ "$3" = "--no-ff" ]; then
        echo "🌿 Merge com commit de merge (--no-ff)"
        git merge --no-ff "$current_branch" -m "Merge branch '$current_branch' into $target_branch"
    else
        echo "⚡ Fast-forward merge"
        git merge "$current_branch"
    fi
    
    # 10. Push das mudanças
    echo "📤 Fazendo push para origin/$target_branch..."
    git push origin "$target_branch"
    
    # 11. Limpeza opcional da branch
    if [ "$4" = "--delete-branch" ]; then
        echo "🗑️ Deletando branch $current_branch..."
        git branch -d "$current_branch"
        git push origin --delete "$current_branch" 2>/dev/null || echo "Branch $current_branch não existe no remote"
    fi
    
    echo ""
    echo "🎉 PROCESSO CONCLUÍDO COM SUCESSO!"
    echo "=================================="
    echo "✅ Branch $current_branch foi rebased e merged em $target_branch"
    echo "✅ Mudanças foram enviadas para o repositório remoto"
    echo "📦 Backup disponível em: ${current_branch}-backup-$(date +%Y%m%d)*"
}

# Função para mostrar ajuda
show_help() {
    echo "🔄 SCRIPT DE REBASE E MERGE AUTOMÁTICO"
    echo "====================================="
    echo ""
    echo "USO:"
    echo "  $0 [target_branch] [--interactive] [--no-ff] [--delete-branch]"
    echo ""
    echo "PARÂMETROS:"
    echo "  target_branch    Branch de destino (padrão: main)"
    echo "  --interactive    Rebase interativo"
    echo "  --no-ff          Merge com commit de merge"
    echo "  --delete-branch  Deletar branch após merge"
    echo ""
    echo "EXEMPLOS:"
    echo "  $0                          # Rebase e merge em main"
    echo "  $0 develop                  # Rebase e merge em develop"
    echo "  $0 main --interactive       # Rebase interativo"
    echo "  $0 main --no-ff            # Merge com commit de merge"
    echo "  $0 main --delete-branch     # Deletar branch após merge"
    echo ""
    echo "PROCESSO:"
    echo "  1. Verificar working tree limpo"
    echo "  2. Criar backup da branch atual"
    echo "  3. Fetch das últimas mudanças"
    echo "  4. Atualizar branch de destino"
    echo "  5. Rebase da branch atual"
    echo "  6. Merge na branch de destino"
    echo "  7. Push para o repositório remoto"
    echo "  8. Limpeza opcional"
}

# Verificar se é para mostrar ajuda
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

# Verificar se estamos em um repositório Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Erro: Este não é um repositório Git"
    exit 1
fi

# Executar o processo principal
perform_rebase_merge "$1" "$2" "$3" "$4"

echo ""
echo "🎯 COMANDOS ÚTEIS PÓS-MERGE:"
echo "=========================="
echo "📊 Ver log: git log --oneline -10"
echo "📈 Ver branches: git branch -a"
echo "🔍 Ver status: git status"
echo "🔄 Sincronizar: git fetch --all"
