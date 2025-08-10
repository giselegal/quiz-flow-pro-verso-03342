# Aliases Git Úteis - Adicione ao seu ~/.bashrc ou ~/.zshrc

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

# Aliases para operações avançadas
alias gundo='git reset --soft HEAD~1'
alias gclean='git clean -fd'
alias gstash='git stash'
alias gstashp='git stash pop'
alias grebase='git rebase -i'

# Funções úteis para adicionar ao shell
git_quick_commit() {
    git add .
    git commit -m "$1"
    git push origin $(git branch --show-current)
}

git_new_branch() {
    git checkout -b "$1"
    git push -u origin "$1"
}

git_merge_to_main() {
    current_branch=$(git branch --show-current)
    git checkout main
    git pull origin main
    git merge "$current_branch"
    git push origin main
}

# Para usar as funções, adicione também:
alias gqc='git_quick_commit'
alias gnb='git_new_branch'
alias gmtm='git_merge_to_main'

# Exemplos de uso:
# gqc "fix: corrigir bug no componente Logo"
# gnb "feature/nova-funcionalidade"
# gmtm
