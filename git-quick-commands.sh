#!/bin/bash

# 🚀 COMANDOS RÁPIDOS PARA GIT REBASE E MERGE
# Conjunto de comandos simplificados para operações Git comuns

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir mensagens coloridas
echo_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
echo_success() { echo -e "${GREEN}✅ $1${NC}"; }
echo_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
echo_error() { echo -e "${RED}❌ $1${NC}"; }

# Comando 1: Rebase rápido em main
quick_rebase_main() {
    echo_info "Iniciando rebase rápido em main..."
    
    git fetch origin
    git rebase origin/main
    
    if [ $? -eq 0 ]; then
        echo_success "Rebase concluído!"
    else
        echo_error "Conflitos encontrados. Resolva e execute: git rebase --continue"
        return 1
    fi
}

# Comando 2: Merge rápido para main
quick_merge_to_main() {
    echo_info "Fazendo merge rápido para main..."
    
    local current_branch=$(git branch --show-current)
    
    # Commit mudanças pendentes
    if ! git diff-index --quiet HEAD --; then
        echo_warning "Commitando mudanças pendentes..."
        git add .
        git commit -m "Quick commit: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # Rebase primeiro
    quick_rebase_main
    
    if [ $? -eq 0 ]; then
        # Fazer merge
        git checkout main
        git merge "$current_branch"
        git push origin main
        
        echo_success "Merge concluído! Branch $current_branch merged em main"
    fi
}

# Comando 3: Sync rápido (pull + rebase)
quick_sync() {
    echo_info "Sincronizando com repositório remoto..."
    
    git stash push -m "Auto stash before sync"
    git fetch origin
    git rebase origin/main
    git stash pop
    
    echo_success "Sincronização concluída!"
}

# Comando 4: Commit e push rápido
quick_commit_push() {
    local message=${1:-"Auto commit: $(date '+%Y-%m-%d %H:%M:%S')"}
    
    echo_info "Fazendo commit e push rápido..."
    
    git add .
    git commit -m "$message"
    git push origin $(git branch --show-current)
    
    echo_success "Commit e push concluídos!"
}

# Comando 5: Reset suave para main
soft_reset_to_main() {
    echo_warning "Fazendo reset suave para main..."
    
    git fetch origin
    git reset --soft origin/main
    
    echo_success "Reset concluído. Mudanças preservadas no staging area"
}

# Comando 6: Limpeza de branches
cleanup_branches() {
    echo_info "Limpando branches locais..."
    
    # Deletar branches já merged
    git branch --merged main | grep -v "main\|master\|\*" | xargs -n 1 git branch -d
    
    # Remover referências remotas obsoletas
    git remote prune origin
    
    echo_success "Limpeza concluída!"
}

# Comando 7: Rebase interativo
interactive_rebase() {
    echo_info "Iniciando rebase interativo..."
    
    local commits=${1:-3}
    read -p "Quantos commits para rebase? (padrão: $commits): " user_commits
    commits=${user_commits:-$commits}
    
    git rebase -i HEAD~$commits
    
    if [ $? -eq 0 ]; then
        echo_success "Rebase interativo concluído!"
    else
        echo_error "Problemas durante o rebase. Verifique e resolva conflitos."
    fi
}

# Comando 8: Merge com squash
squash_merge() {
    echo_info "Fazendo merge com squash..."
    
    local current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "main" ]; then
        echo_error "Você está na branch main. Mude para uma feature branch primeiro."
        return 1
    fi
    
    echo_warning "Isso vai fazer squash de todos os commits da branch $current_branch"
    read -p "Continuar? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        git checkout main
        git pull origin main
        git merge --squash "$current_branch"
        
        read -p "Digite a mensagem do commit squash: " squash_msg
        git commit -m "$squash_msg"
        
        echo_success "Merge com squash concluído!"
        echo_warning "A branch $current_branch ainda existe. Delete manualmente se necessário."
    else
        echo_info "Operação cancelada."
    fi
}

# Comando 9: Cherry-pick commits
cherry_pick_commits() {
    echo_info "Cherry-picking commits..."
    
    echo "Últimos 10 commits:"
    git log --oneline -10
    echo ""
    
    read -p "Digite o hash do commit para cherry-pick: " commit_hash
    
    if [ -n "$commit_hash" ]; then
        git cherry-pick "$commit_hash"
        
        if [ $? -eq 0 ]; then
            echo_success "Cherry-pick concluído!"
        else
            echo_error "Conflitos encontrados. Resolva e execute: git cherry-pick --continue"
        fi
    else
        echo_warning "Nenhum commit especificado."
    fi
}

# Menu principal
show_menu() {
    echo ""
    echo_info "🔄 COMANDOS RÁPIDOS GIT REBASE & MERGE"
    echo "======================================="
    echo "1. Rebase rápido em main"
    echo "2. Merge rápido para main"
    echo "3. Sync rápido (pull + rebase)"
    echo "4. Commit e push rápido"
    echo "5. Reset suave para main"
    echo "6. Limpeza de branches"
    echo "7. Rebase interativo"
    echo "8. Merge com squash"
    echo "9. Cherry-pick commits"
    echo "10. Status do repositório"
    echo "11. Executar script completo"
    echo "0. Sair"
    echo ""
}

# Função para mostrar status
show_status() {
    echo_info "STATUS DO REPOSITÓRIO:"
    echo "======================"
    echo "📍 Branch atual: $(git branch --show-current)"
    echo "📊 Commits ahead/behind:"
    git status -sb
    echo ""
    echo "📝 Últimos commits:"
    git log --oneline -5
    echo ""
    echo "🌿 Branches locais:"
    git branch
}

# Loop principal do menu
main_menu() {
    while true; do
        show_menu
        read -p "Escolha uma opção (0-11): " choice
        
        case $choice in
            1) quick_rebase_main ;;
            2) quick_merge_to_main ;;
            3) quick_sync ;;
            4) 
                read -p "Digite a mensagem do commit (Enter para padrão): " msg
                quick_commit_push "$msg"
                ;;
            5) soft_reset_to_main ;;
            6) cleanup_branches ;;
            7) 
                read -p "Quantos commits para rebase interativo? (padrão: 3): " commits
                interactive_rebase "$commits"
                ;;
            8) squash_merge ;;
            9) cherry_pick_commits ;;
            10) show_status ;;
            11) ./git-rebase-merge.sh ;;
            0) 
                echo_success "Saindo..."
                break
                ;;
            *) 
                echo_error "Opção inválida!"
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Verificar argumentos da linha de comando
case "$1" in
    "rebase") quick_rebase_main ;;
    "merge") quick_merge_to_main ;;
    "sync") quick_sync ;;
    "commit") quick_commit_push "$2" ;;
    "reset") soft_reset_to_main ;;
    "cleanup") cleanup_branches ;;
    "status") show_status ;;
    "menu"|"") main_menu ;;
    *)
        echo_info "USO: $0 [comando] [argumentos]"
        echo ""
        echo "COMANDOS DISPONÍVEIS:"
        echo "  rebase    - Rebase rápido em main"
        echo "  merge     - Merge rápido para main"
        echo "  sync      - Sync rápido (pull + rebase)"
        echo "  commit    - Commit e push rápido"
        echo "  reset     - Reset suave para main"
        echo "  cleanup   - Limpeza de branches"
        echo "  status    - Status do repositório"
        echo "  menu      - Menu interativo (padrão)"
        echo ""
        echo "EXEMPLOS:"
        echo "  $0 commit \"Nova funcionalidade\""
        echo "  $0 sync"
        echo "  $0 merge"
        ;;
esac
