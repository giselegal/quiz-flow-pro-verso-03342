#!/bin/bash

# 🚀 COMANDOS EM LOTE PARA GITHUB
# Execute este script ou use os comandos individualmente

echo "🔍 STATUS DO REPOSITÓRIO"
echo "========================"

# 1. Verificar status atual
git status

echo ""
echo "📋 INFORMAÇÕES DAS BRANCHES"
echo "============================"

# 2. Listar todas as branches (local e remoto)
echo "📍 Branches locais:"
git branch

echo ""
echo "🌐 Branches remotas:"
git branch -r

echo ""
echo "🔗 Todas as branches:"
git branch -a

echo ""
echo "📊 COMMITS RECENTES"
echo "==================="

# 3. Mostrar últimos commits
git log --oneline -10

echo ""
echo "🔄 COMANDOS DE SINCRONIZAÇÃO"
echo "============================"

# Função para atualizar branch principal
update_main() {
    echo "🔄 Atualizando branch main..."
    git checkout main
    git pull origin main
    echo "✅ Branch main atualizada!"
}

# Função para criar nova branch
create_branch() {
    if [ -z "$1" ]; then
        echo "❌ Nome da branch é obrigatório"
        echo "💡 Uso: create_branch <nome-da-branch>"
        return 1
    fi
    
    echo "🌿 Criando nova branch: $1"
    git checkout -b "$1"
    git push -u origin "$1"
    echo "✅ Branch $1 criada e enviada para o remoto!"
}

# Função para fazer commit e push
commit_and_push() {
    if [ -z "$1" ]; then
        echo "❌ Mensagem de commit é obrigatória"
        echo "💡 Uso: commit_and_push 'mensagem do commit'"
        return 1
    fi
    
    echo "📝 Adicionando arquivos..."
    git add .
    
    echo "💾 Fazendo commit..."
    git commit -m "$1"
    
    echo "🚀 Enviando para o remoto..."
    git push
    
    echo "✅ Commit realizado e enviado!"
}

# Função para sincronizar com remoto
sync_with_remote() {
    echo "🔄 Sincronizando com o remoto..."
    
    # Buscar atualizações
    git fetch origin
    
    # Obter branch atual
    current_branch=$(git branch --show-current)
    
    echo "📍 Branch atual: $current_branch"
    
    # Fazer merge se houver atualizações
    echo "🔄 Fazendo merge das atualizações..."
    git pull origin "$current_branch"
    
    echo "✅ Sincronização concluída!"
}

# Função para resolver conflitos
resolve_conflicts() {
    echo "⚠️ RESOLUÇÃO DE CONFLITOS"
    echo "========================="
    
    # Verificar se há conflitos
    if git diff --name-only --diff-filter=U | grep -q .; then
        echo "🔍 Arquivos com conflito encontrados:"
        git diff --name-only --diff-filter=U
        
        echo ""
        echo "📝 Comandos para resolver:"
        echo "1. Edite os arquivos em conflito"
        echo "2. git add <arquivo-resolvido>"
        echo "3. git commit -m 'Resolve conflitos'"
        echo "4. git push"
    else
        echo "✅ Nenhum conflito encontrado!"
    fi
}

# Função para limpar branches antigas
cleanup_branches() {
    echo "🧹 LIMPEZA DE BRANCHES"
    echo "====================="
    
    echo "📍 Branches locais que não existem no remoto:"
    git remote prune origin --dry-run
    
    echo ""
    echo "🗑️ Para remover branches órfãs:"
    echo "git remote prune origin"
    
    echo ""
    echo "📋 Branches mescladas (podem ser removidas):"
    git branch --merged main | grep -v main
}

# Menu interativo
show_menu() {
    echo ""
    echo "🎯 MENU DE COMANDOS"
    echo "=================="
    echo "1. update_main - Atualizar branch main"
    echo "2. create_branch <nome> - Criar nova branch"
    echo "3. commit_and_push '<mensagem>' - Commit e push"
    echo "4. sync_with_remote - Sincronizar com remoto"
    echo "5. resolve_conflicts - Verificar conflitos"
    echo "6. cleanup_branches - Limpar branches antigas"
    echo ""
    echo "💡 Exemplos de uso:"
    echo "   ./git-batch-commands.sh update_main"
    echo "   ./git-batch-commands.sh create_branch feature/novo-editor"
    echo "   ./git-batch-commands.sh commit_and_push 'Adiciona novo editor'"
}

# Executar comando baseado no argumento
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
    "sync_with_remote")
        sync_with_remote
        ;;
    "resolve_conflicts")
        resolve_conflicts
        ;;
    "cleanup_branches")
        cleanup_branches
        ;;
    "")
        show_menu
        ;;
    *)
        echo "❌ Comando não reconhecido: $1"
        show_menu
        ;;
esac

echo ""
echo "🔍 STATUS FINAL"
echo "==============="
git status --short

echo ""
echo "📊 INFORMAÇÕES ÚTEIS"
echo "==================="
echo "🌐 URL do repositório: $(git config --get remote.origin.url)"
echo "📍 Branch atual: $(git branch --show-current)"
echo "👤 Usuário: $(git config --get user.name) <$(git config --get user.email)>"
echo "🔄 Último commit: $(git log -1 --format='%h - %s (%cr)')"
