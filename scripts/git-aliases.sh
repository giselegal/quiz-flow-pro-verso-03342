# 🚀 GIT ALIASES COMPLETOS - Adicione ao seu ~/.bashrc ou ~/.zshrc
# ================================================================

# Aliases básicos
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias gb='git branch'
alias gco='git checkout'
alias gf='git fetch'

# Aliases avançados
alias gaa='git add .'
alias gcm='git commit -m'
alias gpo='git push origin'
alias gpl='git pull origin'
alias gst='git status --short'
alias glog='git log --oneline --graph --decorate'
alias glogo='git log --oneline --graph --decorate --all'

# Aliases para workflows comuns
alias gpom='git push origin main'
alias gplm='git pull origin main'
alias gcom='git checkout main'
alias gcb='git checkout -b'
alias gbd='git branch -d'
alias gbD='git branch -D'

# Aliases para rebase e merge
alias grb='git rebase'
alias grbi='git rebase -i'
alias grbc='git rebase --continue'
alias grba='git rebase --abort'
alias grbm='git rebase main'
alias gm='git merge'
alias gmm='git merge main'
alias gmnf='git merge --no-ff'

# Aliases para commits
alias gca='git commit --amend'
alias gcan='git commit --amend --no-edit'
alias gcf='git commit --fixup'
alias gcs='git commit -S'  # commit assinado

# Aliases para push/pull seguros
alias gpsf='git push --force-with-lease origin'
alias gpsu='git push -u origin'

# Aliases para stash
alias gstash='git stash'
alias gstashp='git stash pop'
alias gstashl='git stash list'
alias gstashd='git stash drop'

# Aliases para reset
alias gundo='git reset --soft HEAD~1'
alias grh='git reset --hard'
alias grs='git reset --soft'
alias gclean='git clean -fd'

# Aliases para operações avançadas
alias grebase='git rebase -i'
alias gsquash='git rebase -i HEAD~'
alias gprune='git remote prune origin'
alias gshow='git show --stat'

# Funções úteis para adicionar ao shell
git_quick_commit() {
    if [ -z "$1" ]; then
        echo "❌ Uso: gqc 'mensagem do commit'"
        return 1
    fi
    git add .
    git commit -m "$1"
    current_branch=$(git branch --show-current)
    git push origin "$current_branch"
    echo "✅ Commit e push realizados na branch: $current_branch"
}

git_new_branch() {
    if [ -z "$1" ]; then
        echo "❌ Uso: gnb 'nome-da-branch'"
        return 1
    fi
    git checkout -b "$1"
    git push -u origin "$1"
    echo "✅ Nova branch '$1' criada e enviada para o repositório"
}

git_merge_to_main() {
    current_branch=$(git branch --show-current)
    if [ "$current_branch" == "main" ]; then
        echo "❌ Você já está na branch main"
        return 1
    fi
    
    echo "🔄 Fazendo merge da branch '$current_branch' para main..."
    git checkout main
    git pull origin main
    git merge "$current_branch" --no-ff -m "Merge branch '$current_branch'"
    git push origin main
    echo "✅ Merge concluído!"
    
    read -p "Deletar a branch '$current_branch'? (y/N): " delete_branch
    if [[ "$delete_branch" == "y" || "$delete_branch" == "Y" ]]; then
        git branch -d "$current_branch"
        git push origin --delete "$current_branch"
        echo "✅ Branch '$current_branch' deletada local e remotamente"
    fi
}

git_rebase_main() {
    current_branch=$(git branch --show-current)
    if [ "$current_branch" == "main" ]; then
        echo "❌ Você está na branch main. Mude para uma feature branch primeiro."
        return 1
    fi
    
    echo "🔄 Fazendo rebase com main..."
    git checkout main
    git pull origin main
    git checkout "$current_branch"
    git rebase main
    echo "✅ Rebase com main concluído!"
}

git_squash_commits() {
    if [ -z "$1" ]; then
        echo "❌ Uso: gsq <número-de-commits>"
        return 1
    fi
    git rebase -i HEAD~$1
}

git_safe_push() {
    current_branch=$(git branch --show-current)
    if [ "$current_branch" == "main" ] || [ "$current_branch" == "master" ]; then
        echo "⚠️ AVISO: Você está na branch principal!"
        read -p "Tem certeza que quer fazer push? (y/N): " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            echo "❌ Push cancelado."
            return 1
        fi
    fi
    
    git push origin "$current_branch"
    echo "✅ Push realizado com segurança na branch: $current_branch"
}

git_branch_cleanup() {
    echo "🧹 Limpando branches locais mergeadas..."
    git checkout main
    git pull origin main
    git branch --merged main | grep -v main | xargs -n 1 git branch -d
    echo "✅ Limpeza de branches concluída!"
}

git_undo_commit() {
    echo "↩️ Desfazendo último commit (mantendo alterações)..."
    git reset --soft HEAD~1
    echo "✅ Último commit desfeito! Use 'git status' para ver as alterações."
}

# Para usar as funções, adicione também:
alias gqc='git_quick_commit'
alias gnb='git_new_branch'
alias gmtm='git_merge_to_main'
alias grbm='git_rebase_main'
alias gsq='git_squash_commits'
alias gsp='git_safe_push'
alias gcleanup='git_branch_cleanup'
alias gundo='git_undo_commit'

# 📋 EXEMPLOS DE USO:
# ===================

# Commits rápidos:
# gqc "fix: corrigir bug no componente Header"
# gqc "feat: adicionar nova funcionalidade de busca"

# Criar nova branch:
# gnb "feature/nova-funcionalidade"
# gnb "fix/corrigir-bug-login"

# Rebase com main:
# grbm  # (estando numa feature branch)

# Squash dos últimos 3 commits:
# gsq 3

# Merge seguro para main:
# gmtm  # (estando numa feature branch)

# Push seguro (confirma se não está na main):
# gsp

# Limpar branches mergeadas:
# gcleanup

# Ver histórico bonito:
# glog
# glogo  # (com todas as branches)

# ⚡ COMANDOS RÁPIDOS MAIS USADOS:
# ===============================

# Workflow completo para nova feature:
# 1. gnb "feature/minha-feature"
# 2. # fazer alterações
# 3. gqc "feat: implementar minha feature"
# 4. gmtm  # merge para main

# Workflow para correção de bug:
# 1. gnb "fix/corrigir-bug"
# 2. # fazer correções
# 3. gqc "fix: corrigir problema no login"
# 4. gmtm  # merge para main

# Workflow para rebase:
# 1. grbm  # rebase com main
# 2. gsp   # push seguro

# 🔧 INSTALAÇÃO:
# ===============
# 1. Execute: source scripts/git-aliases.sh
# 2. Ou adicione ao ~/.bashrc ou ~/.zshrc:
#    echo 'source /caminho/para/scripts/git-aliases.sh' >> ~/.bashrc
# 3. Execute: source ~/.bashrc

echo "✅ Git aliases carregados! Use 'glog' para ver commits ou 'gqc \"mensagem\"' para commit rápido."
