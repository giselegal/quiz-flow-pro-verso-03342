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
    
    local branch_name=$1
    if [ -z "$branch_name" ]; then
        read -p "Nome da branch para fazer squash merge: " branch_name
    fi
    
    if [ -z "$branch_name" ]; then
        echo_error "Nome da branch é obrigatório!"
        return 1
    fi
    
    echo_info "Fazendo squash merge da branch '$branch_name'..."
    git merge --squash "$branch_name"
    
    if [ $? -eq 0 ]; then
        echo_success "Squash merge concluído! Agora faça o commit das mudanças."
        echo_info "Use: git commit -m 'Sua mensagem de commit'"
    else
        echo_error "Erro durante o squash merge."
    fi
}

# Comando 9: Rebase avançado com backup
safe_rebase() {
    echo_info "🔄 Rebase Seguro com Backup..."
    
    local target_branch=${1:-"main"}
    local current_branch=$(git branch --show-current)
    
    # Criar backup da branch atual
    local backup_branch="${current_branch}_backup_$(date +%Y%m%d_%H%M%S)"
    git branch "$backup_branch"
    echo_success "✅ Backup criado: $backup_branch"
    
    # Atualizar branch de destino
    echo_info "📥 Atualizando $target_branch..."
    git fetch origin "$target_branch"
    
    # Fazer rebase
    echo_info "🔄 Fazendo rebase em $target_branch..."
    git rebase "origin/$target_branch"
    
    if [ $? -eq 0 ]; then
        echo_success "✅ Rebase concluído com sucesso!"
        echo_info "💡 Para remover o backup: git branch -D $backup_branch"
    else
        echo_error "❌ Conflitos detectados durante o rebase!"
        echo_info "🔧 Resolva os conflitos e use: git rebase --continue"
        echo_info "🔙 Para cancelar: git rebase --abort"
        echo_info "🔄 Para restaurar backup: git reset --hard $backup_branch"
    fi
}

# Comando 10: Merge com estratégia
strategic_merge() {
    echo_info "🎯 Merge Estratégico..."
    
    local source_branch=$1
    local strategy=${2:-"recursive"}
    
    if [ -z "$source_branch" ]; then
        read -p "Branch de origem: " source_branch
    fi
    
    echo_info "📊 Estratégias disponíveis:"
    echo "  1) recursive (padrão)"
    echo "  2) ours (manter nossa versão)"
    echo "  3) theirs (aceitar versão deles)"
    echo "  4) octopus (múltiplas branches)"
    
    read -p "Escolha a estratégia (1-4): " strategy_choice
    
    case $strategy_choice in
        1) strategy="recursive" ;;
        2) strategy="ours" ;;
        3) strategy="theirs" ;;
        4) strategy="octopus" ;;
        *) strategy="recursive" ;;
    esac
    
    echo_info "🔄 Fazendo merge de '$source_branch' com estratégia '$strategy'..."
    git merge -s "$strategy" "$source_branch"
    
    if [ $? -eq 0 ]; then
        echo_success "✅ Merge estratégico concluído!"
    else
        echo_error "❌ Erro durante o merge estratégico."
    fi
}

# Comando 11: Rebase interativo avançado
advanced_interactive_rebase() {
    echo_info "🎨 Rebase Interativo Avançado..."
    
    local commits=${1:-5}
    echo_info "📊 Opções do rebase interativo:"
    echo "  pick   = usar commit"
    echo "  reword = editar mensagem"
    echo "  edit   = editar commit"
    echo "  squash = combinar com anterior"
    echo "  fixup  = combinar sem mensagem"
    echo "  drop   = remover commit"
    
    read -p "Quantos commits para editar? (padrão: $commits): " user_commits
    commits=${user_commits:-$commits}
    
    echo_info "🔄 Iniciando rebase interativo para últimos $commits commits..."
    git rebase -i HEAD~$commits
    
    if [ $? -eq 0 ]; then
        echo_success "✅ Rebase interativo concluído!"
    else
        echo_error "❌ Problemas durante o rebase."
        echo_info "🔧 Para continuar: git rebase --continue"
        echo_info "🔙 Para cancelar: git rebase --abort"
    fi
}

# Comando 12: Auto-merge com verificações
auto_merge_with_checks() {
    echo_info "🤖 Auto-merge com Verificações..."
    
    local source_branch=$1
    if [ -z "$source_branch" ]; then
        read -p "Branch para fazer merge: " source_branch
    fi
    
    # Verificar se branch existe
    if ! git show-ref --verify --quiet "refs/heads/$source_branch"; then
        echo_error "❌ Branch '$source_branch' não existe!"
        return 1
    fi
    
    # Verificar diferenças
    local diff_count=$(git rev-list --count HEAD.."$source_branch")
    echo_info "📊 $diff_count commits para merge"
    
    # Verificar conflitos potenciais
    echo_info "🔍 Verificando conflitos potenciais..."
    git merge-tree $(git merge-base HEAD "$source_branch") HEAD "$source_branch" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo_success "✅ Nenhum conflito detectado"
        
        read -p "Continuar com o merge? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            git merge "$source_branch" --no-ff
            
            if [ $? -eq 0 ]; then
                echo_success "✅ Auto-merge concluído com sucesso!"
            else
                echo_error "❌ Erro durante o merge."
            fi
        else
            echo_info "ℹ️ Merge cancelado pelo usuário."
        fi
    else
        echo_warning "⚠️ Conflitos potenciais detectados!"
        echo_info "Use rebase interativo primeiro ou resolva manualmente."
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

# Comando 12: Rebase seguro com backup
safe_rebase() {
    echo_info "Rebase seguro com backup automático..."
    
    local target_branch=${1:-main}
    local current_branch=$(git branch --show-current)
    local backup_branch="${current_branch}_backup_$(date +%Y%m%d_%H%M%S)"
    
    echo_info "Branch atual: $current_branch"
    echo_info "Target branch: $target_branch"
    echo_info "Backup branch: $backup_branch"
    
    # Criar backup
    echo_info "Criando backup..."
    git branch "$backup_branch"
    
    # Buscar últimas mudanças
    echo_info "Buscando últimas mudanças..."
    git fetch origin
    
    # Fazer rebase
    echo_info "Fazendo rebase..."
    git rebase "origin/$target_branch"
    
    if [ $? -eq 0 ]; then
        echo_success "Rebase concluído com sucesso!"
        echo_info "Backup criado em: $backup_branch"
        
        read -p "Deseja remover o backup? (y/N): " remove_backup
        if [[ $remove_backup =~ ^[Yy]$ ]]; then
            git branch -D "$backup_branch"
            echo_success "Backup removido"
        else
            echo_info "Backup mantido: $backup_branch"
        fi
    else
        echo_error "Problemas durante o rebase!"
        echo_info "Backup disponível em: $backup_branch"
        echo_info "Para restaurar: git reset --hard $backup_branch"
    fi
}

# Comando 13: Merge rápido com verificações
quick_merge() {
    echo_info "Merge rápido com verificações..."
    
    local branch_to_merge=${1}
    if [ -z "$branch_to_merge" ]; then
        read -p "Digite o nome da branch para merge: " branch_to_merge
    fi
    
    if [ -z "$branch_to_merge" ]; then
        echo_error "Nome da branch é obrigatório"
        return 1
    fi
    
    local current_branch=$(git branch --show-current)
    
    # Verificações pré-merge
    echo_info "Verificando se a branch existe..."
    if ! git show-ref --verify --quiet "refs/heads/$branch_to_merge"; then
        echo_error "Branch '$branch_to_merge' não encontrada"
        return 1
    fi
    
    echo_info "Verificando status do working directory..."
    if ! git diff-index --quiet HEAD --; then
        echo_error "Há mudanças não commitadas. Commit ou stash primeiro."
        return 1
    fi
    
    # Buscar atualizações
    echo_info "Buscando atualizações..."
    git fetch origin
    
    # Fazer merge
    echo_info "Fazendo merge de '$branch_to_merge' em '$current_branch'..."
    git merge "$branch_to_merge" --no-ff
    
    if [ $? -eq 0 ]; then
        echo_success "Merge concluído com sucesso!"
        
        read -p "Deseja deletar a branch '$branch_to_merge'? (y/N): " delete_branch
        if [[ $delete_branch =~ ^[Yy]$ ]]; then
            git branch -d "$branch_to_merge"
            echo_success "Branch '$branch_to_merge' deletada"
        fi
    else
        echo_error "Conflitos durante o merge. Resolva e execute 'git commit'"
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
