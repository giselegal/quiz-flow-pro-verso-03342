#!/bin/bash

# 🔄 COMANDOS ESPECÍFICOS DE REBASE E MERGE
# Comandos avançados para operações Git de rebase e merge

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
echo_success() { echo -e "${GREEN}✅ $1${NC}"; }
echo_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
echo_error() { echo -e "${RED}❌ $1${NC}"; }
echo_purple() { echo -e "${PURPLE}🔮 $1${NC}"; }

# ============================================================================
# 🔄 COMANDOS DE REBASE
# ============================================================================

# Rebase interativo nos últimos N commits
interactive_rebase() {
    local commits=${1:-5}
    echo_info "Rebase interativo nos últimos $commits commits..."
    git rebase -i HEAD~$commits
}

# Rebase em branch específica
rebase_on_branch() {
    local target_branch=${1:-main}
    echo_info "Fazendo rebase em $target_branch..."
    
    git fetch origin
    git rebase origin/$target_branch
    
    if [ $? -eq 0 ]; then
        echo_success "Rebase em $target_branch concluído!"
    else
        echo_error "Conflitos encontrados. Comandos úteis:"
        echo "  git status                 # Ver conflitos"
        echo "  git add <arquivo>          # Marcar como resolvido"
        echo "  git rebase --continue      # Continuar rebase"
        echo "  git rebase --abort         # Cancelar rebase"
    fi
}

# Rebase com autosquash (combinar commits)
autosquash_rebase() {
    local target_branch=${1:-main}
    echo_info "Rebase com autosquash em $target_branch..."
    
    git fetch origin
    git rebase -i --autosquash origin/$target_branch
}

# Continuar rebase após resolver conflitos
continue_rebase() {
    echo_info "Continuando rebase após resolver conflitos..."
    git rebase --continue
    
    if [ $? -eq 0 ]; then
        echo_success "Rebase continuado com sucesso!"
    else
        echo_error "Ainda há conflitos para resolver"
        git status
    fi
}

# Abortar rebase
abort_rebase() {
    echo_warning "Abortando rebase..."
    git rebase --abort
    echo_success "Rebase abortado. Estado restaurado."
}

# ============================================================================
# 🔀 COMANDOS DE MERGE
# ============================================================================

# Merge com commit de merge (--no-ff)
merge_no_ff() {
    local source_branch=${1:-$(git branch --show-current)}
    local target_branch=${2:-main}
    local message=${3:-"Merge branch '$source_branch' into $target_branch"}
    
    echo_info "Merge no-ff de $source_branch para $target_branch..."
    
    git checkout $target_branch
    git pull origin $target_branch
    git merge --no-ff $source_branch -m "$message"
    
    if [ $? -eq 0 ]; then
        echo_success "Merge no-ff concluído!"
        git push origin $target_branch
    else
        echo_error "Conflitos no merge. Resolva e commit."
    fi
}

# Merge squash (combinar todos os commits em um)
merge_squash() {
    local source_branch=${1:-$(git branch --show-current)}
    local target_branch=${2:-main}
    
    echo_info "Merge squash de $source_branch para $target_branch..."
    
    git checkout $target_branch
    git pull origin $target_branch
    git merge --squash $source_branch
    
    echo_warning "Faça o commit das mudanças squashed:"
    echo "git commit -m \"Squashed merge from $source_branch\""
}

# Fast-forward merge
fast_forward_merge() {
    local source_branch=${1:-$(git branch --show-current)}
    local target_branch=${2:-main}
    
    echo_info "Fast-forward merge de $source_branch para $target_branch..."
    
    git checkout $target_branch
    git pull origin $target_branch
    git merge --ff-only $source_branch
    
    if [ $? -eq 0 ]; then
        echo_success "Fast-forward merge concluído!"
        git push origin $target_branch
    else
        echo_error "Fast-forward não é possível. Use rebase primeiro."
    fi
}

# ============================================================================
# 🔧 COMANDOS COMBINADOS
# ============================================================================

# Rebase + Merge completo
rebase_and_merge() {
    local source_branch=$(git branch --show-current)
    local target_branch=${1:-main}
    
    echo_purple "🔄 REBASE + MERGE COMPLETO"
    echo "=========================="
    echo "Source: $source_branch"
    echo "Target: $target_branch"
    echo ""
    
    # 1. Rebase
    echo_info "Passo 1: Rebase em $target_branch"
    rebase_on_branch $target_branch
    
    if [ $? -ne 0 ]; then
        echo_error "Rebase falhou. Resolva conflitos primeiro."
        return 1
    fi
    
    # 2. Merge
    echo_info "Passo 2: Merge para $target_branch"
    git checkout $target_branch
    git merge $source_branch
    
    if [ $? -eq 0 ]; then
        echo_info "Passo 3: Push para origin"
        git push origin $target_branch
        echo_success "Rebase + Merge concluído!"
    else
        echo_error "Merge falhou"
        return 1
    fi
}

# Preparar PR (Pull Request)
prepare_pr() {
    local target_branch=${1:-main}
    local current_branch=$(git branch --show-current)
    
    echo_purple "📋 PREPARANDO PULL REQUEST"
    echo "========================="
    echo "Branch: $current_branch -> $target_branch"
    echo ""
    
    # 1. Commit mudanças pendentes
    if ! git diff-index --quiet HEAD --; then
        echo_info "Commitando mudanças pendentes..."
        git add .
        read -p "Digite a mensagem do commit: " commit_msg
        git commit -m "$commit_msg"
    fi
    
    # 2. Rebase para limpar histórico
    echo_info "Limpando histórico com rebase..."
    rebase_on_branch $target_branch
    
    # 3. Push da branch
    echo_info "Fazendo push da branch..."
    git push origin $current_branch --force-with-lease
    
    echo_success "Branch $current_branch está pronta para PR!"
    echo ""
    echo "🔗 Próximos passos:"
    echo "   1. Vá ao GitHub/GitLab"
    echo "   2. Crie Pull Request de $current_branch para $target_branch"
    echo "   3. Adicione revisores se necessário"
}

# ============================================================================
# 📊 COMANDOS DE ANÁLISE
# ============================================================================

# Ver histórico de commits gráfico
show_graph() {
    echo_info "Histórico gráfico de commits:"
    git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit -20
}

# Ver diferenças entre branches
compare_branches() {
    local branch1=${1:-main}
    local branch2=${2:-$(git branch --show-current)}
    
    echo_info "Comparando $branch1 com $branch2:"
    echo ""
    echo "📊 Commits em $branch2 que não estão em $branch1:"
    git log $branch1..$branch2 --oneline
    echo ""
    echo "📊 Commits em $branch1 que não estão em $branch2:"
    git log $branch2..$branch1 --oneline
}

# Ver status de rebase/merge em progresso
show_rebase_status() {
    if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
        echo_warning "Rebase em progresso!"
        echo ""
        echo "📊 Status do rebase:"
        if [ -f ".git/rebase-merge/msgnum" ]; then
            local current=$(cat .git/rebase-merge/msgnum)
            local total=$(cat .git/rebase-merge/end)
            echo "   Progresso: $current/$total"
        fi
        echo ""
        echo "🔧 Comandos úteis:"
        echo "   git status                 # Ver arquivos em conflito"
        echo "   git add <arquivo>          # Marcar como resolvido"
        echo "   git rebase --continue      # Continuar"
        echo "   git rebase --abort         # Abortar"
    else
        echo_info "Nenhum rebase em progresso"
    fi
}

# ============================================================================
# 📋 MENU PRINCIPAL
# ============================================================================

show_rebase_merge_menu() {
    echo ""
    echo_purple "🔄 COMANDOS REBASE & MERGE AVANÇADOS"
    echo "===================================="
    echo ""
    echo "📝 REBASE:"
    echo "  1.  Rebase interativo (últimos N commits)"
    echo "  2.  Rebase em branch específica"
    echo "  3.  Rebase com autosquash"
    echo "  4.  Continuar rebase"
    echo "  5.  Abortar rebase"
    echo ""
    echo "🔀 MERGE:"
    echo "  6.  Merge no-ff (com commit de merge)"
    echo "  7.  Merge squash"
    echo "  8.  Fast-forward merge"
    echo ""
    echo "🚀 COMBINADOS:"
    echo "  9.  Rebase + Merge completo"
    echo "  10. Preparar Pull Request"
    echo ""
    echo "📊 ANÁLISE:"
    echo "  11. Ver histórico gráfico"
    echo "  12. Comparar branches"
    echo "  13. Status de rebase/merge"
    echo ""
    echo "  0.  Voltar"
    echo ""
}

# Loop do menu
rebase_merge_menu() {
    while true; do
        show_rebase_merge_menu
        read -p "Escolha uma opção (0-13): " choice
        
        case $choice in
            1)
                read -p "Quantos commits? (padrão: 5): " commits
                interactive_rebase ${commits:-5}
                ;;
            2)
                read -p "Branch de destino (padrão: main): " branch
                rebase_on_branch ${branch:-main}
                ;;
            3)
                read -p "Branch de destino (padrão: main): " branch
                autosquash_rebase ${branch:-main}
                ;;
            4) continue_rebase ;;
            5) abort_rebase ;;
            6)
                read -p "Branch source (atual): " source
                read -p "Branch target (main): " target
                read -p "Mensagem do merge: " message
                merge_no_ff ${source:-$(git branch --show-current)} ${target:-main} "$message"
                ;;
            7)
                read -p "Branch source (atual): " source
                read -p "Branch target (main): " target
                merge_squash ${source:-$(git branch --show-current)} ${target:-main}
                ;;
            8)
                read -p "Branch source (atual): " source
                read -p "Branch target (main): " target
                fast_forward_merge ${source:-$(git branch --show-current)} ${target:-main}
                ;;
            9)
                read -p "Branch de destino (padrão: main): " branch
                rebase_and_merge ${branch:-main}
                ;;
            10)
                read -p "Branch de destino (padrão: main): " branch
                prepare_pr ${branch:-main}
                ;;
            11) show_graph ;;
            12)
                read -p "Branch 1 (main): " b1
                read -p "Branch 2 (atual): " b2
                compare_branches ${b1:-main} ${b2:-$(git branch --show-current)}
                ;;
            13) show_rebase_status ;;
            0) break ;;
            *) echo_error "Opção inválida!" ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Verificar argumentos da linha de comando
case "$1" in
    "interactive"|"i") interactive_rebase $2 ;;
    "rebase") rebase_on_branch $2 ;;
    "autosquash") autosquash_rebase $2 ;;
    "continue") continue_rebase ;;
    "abort") abort_rebase ;;
    "merge-noff") merge_no_ff $2 $3 "$4" ;;
    "merge-squash") merge_squash $2 $3 ;;
    "merge-ff") fast_forward_merge $2 $3 ;;
    "rebase-merge") rebase_and_merge $2 ;;
    "prepare-pr") prepare_pr $2 ;;
    "graph") show_graph ;;
    "compare") compare_branches $2 $3 ;;
    "status") show_rebase_status ;;
    "menu"|"") rebase_merge_menu ;;
    *)
        echo_info "USO: $0 [comando] [argumentos]"
        echo ""
        echo "COMANDOS DISPONÍVEIS:"
        echo "  interactive [N]     - Rebase interativo (N commits)"
        echo "  rebase [branch]     - Rebase em branch"
        echo "  autosquash [branch] - Rebase com autosquash"
        echo "  continue            - Continuar rebase"
        echo "  abort              - Abortar rebase"
        echo "  merge-noff         - Merge no-ff"
        echo "  merge-squash       - Merge squash"
        echo "  merge-ff           - Fast-forward merge"
        echo "  rebase-merge       - Rebase + Merge completo"
        echo "  prepare-pr         - Preparar Pull Request"
        echo "  graph              - Histórico gráfico"
        echo "  compare            - Comparar branches"
        echo "  status             - Status rebase/merge"
        echo "  menu               - Menu interativo"
        ;;
esac
