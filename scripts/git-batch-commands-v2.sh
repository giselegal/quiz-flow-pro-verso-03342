#!/bin/bash

# Git Batch Commands - Funções Específicas
# Uso: ./git-batch-commands.sh [função] [parâmetros]

# Função para atualizar main
update_main() {
    echo "🔄 Atualizando branch main..."
    git checkout main
    git pull origin main
    echo "✅ Branch main atualizada!"
}

# Função para criar nova branch
create_branch() {
    if [ -z "$1" ]; then
        echo "❌ Erro: Nome da branch é obrigatório"
        echo "Uso: ./git-batch-commands.sh create_branch nome-da-branch"
        exit 1
    fi
    
    branch_name="$1"
    echo "🌿 Criando branch: $branch_name"
    git checkout -b "$branch_name"
    git push -u origin "$branch_name"
    echo "✅ Branch '$branch_name' criada e enviada para o repositório!"
}

# Função para commit e push
commit_and_push() {
    if [ -z "$1" ]; then
        echo "❌ Erro: Mensagem do commit é obrigatória"
        echo "Uso: ./git-batch-commands.sh commit_and_push \"Sua mensagem aqui\""
        exit 1
    fi
    
    commit_msg="$1"
    current_branch=$(git branch --show-current)
    echo "📝 Fazendo commit na branch: $current_branch"
    echo "💬 Mensagem: $commit_msg"
    
    git add .
    git commit -m "$commit_msg"
    git push origin "$current_branch"
    echo "✅ Commit e push realizados com sucesso!"
}

# Função para voltar ao main
back_to_main() {
    echo "🏠 Voltando para branch main..."
    git checkout main
    echo "✅ Agora você está na branch main!"
}

# Função para workflow completo
full_workflow() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "❌ Erro: Nome da branch e mensagem são obrigatórios"
        echo "Uso: ./git-batch-commands.sh full_workflow nome-da-branch \"Mensagem do commit\""
        exit 1
    fi
    
    branch_name="$1"
    commit_msg="$2"
    
    echo "🚀 Iniciando workflow completo..."
    
    # 1. Atualizar main
    update_main
    
    # 2. Criar nova branch
    create_branch "$branch_name"
    
    echo "✅ Branch criada! Agora você pode:"
    echo "   - Fazer suas mudanças no código"
    echo "   - Executar: ./git-batch-commands.sh commit_and_push \"$commit_msg\""
    echo "   - Executar: ./git-batch-commands.sh back_to_main"
}

# Função para merge da branch atual para main
merge_to_main() {
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "main" ]; then
        echo "❌ Você já está na branch main!"
        exit 1
    fi
    
    echo "🔄 Fazendo merge de '$current_branch' para main..."
    
    # Commit mudanças pendentes se houver
    if [ -n "$(git status --porcelain)" ]; then
        echo "📝 Há mudanças não commitadas. Fazendo commit primeiro..."
        read -p "Digite a mensagem do commit: " commit_msg
        git add .
        git commit -m "$commit_msg"
    fi
    
    # Push da branch atual
    git push origin "$current_branch"
    
    # Ir para main e fazer merge
    git checkout main
    git pull origin main
    git merge "$current_branch"
    git push origin main
    
    echo "✅ Merge realizado com sucesso!"
    echo "🗑️  Quer deletar a branch '$current_branch'? (y/n)"
    read -p "> " delete_confirm
    if [ "$delete_confirm" = "y" ]; then
        git branch -d "$current_branch"
        git push origin --delete "$current_branch"
        echo "✅ Branch '$current_branch' deletada!"
    fi
}

# Verificar se foi passada uma função
if [ -z "$1" ]; then
    echo "🤖 Git Batch Commands - Uso:"
    echo ""
    echo "📥 Atualizar main:"
    echo "   ./git-batch-commands-v2.sh update_main"
    echo ""
    echo "🌿 Criar nova branch:"
    echo "   ./git-batch-commands-v2.sh create_branch feature/nova-funcionalidade"
    echo ""
    echo "📝 Commit e push:"
    echo "   ./git-batch-commands-v2.sh commit_and_push \"Adiciona nova funcionalidade X\""
    echo ""
    echo "🏠 Voltar para main:"
    echo "   ./git-batch-commands-v2.sh back_to_main"
    echo ""
    echo "🔄 Merge para main:"
    echo "   ./git-batch-commands-v2.sh merge_to_main"
    echo ""
    echo "🚀 Workflow completo (main → branch → commit):"
    echo "   ./git-batch-commands-v2.sh full_workflow feature/nova-funcionalidade \"Mensagem do commit\""
    echo ""
    echo "📊 Status atual:"
    git status --short
    echo ""
    echo "🌿 Branch atual: $(git branch --show-current)"
    exit 0
fi

# Executar a função solicitada
case "$1" in
    "update_main")
        update_main
        ;;
    "create_branch")
        create_branch "$2"
        ;;
    "commit_and_push")
        commit_and_push "$2"
        ;;
    "back_to_main")
        back_to_main
        ;;
    "merge_to_main")
        merge_to_main
        ;;
    "full_workflow")
        full_workflow "$2" "$3"
        ;;
    *)
        echo "❌ Função desconhecida: $1"
        echo "Execute sem parâmetros para ver a ajuda: ./git-batch-commands.sh"
        exit 1
        ;;
esac
