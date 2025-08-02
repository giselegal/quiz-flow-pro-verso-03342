#!/bin/bash

# Git/GitHub Batch Commands Script
# Este script contém comandos úteis para gerenciar o repositório

echo "=== Git/GitHub Batch Commands ==="
echo "Selecione uma opção:"
echo "1. Status e informações básicas"
echo "2. Sincronizar com repositório remoto"
echo "3. Commit e push completo"
echo "4. Criar nova branch"
echo "5. Merge e cleanup"
echo "6. Reverter mudanças"
echo "7. Comandos de limpeza"
echo "8. Ver histórico"
echo "9. Todos os comandos úteis"
echo "0. Sair"

read -p "Digite sua escolha (0-9): " choice

case $choice in
    1)
        echo "=== Status e Informações Básicas ==="
        echo "Status do repositório:"
        git status
        echo -e "\nBranches locais:"
        git branch
        echo -e "\nBranches remotos:"
        git branch -r
        echo -e "\nÚltimos commits:"
        git log --oneline -5
        ;;
    2)
        echo "=== Sincronizar com Repositório Remoto ==="
        echo "Fazendo fetch das mudanças remotas..."
        git fetch origin
        echo "Fazendo pull do main..."
        git pull origin main
        echo "Push das mudanças locais..."
        git push origin $(git branch --show-current)
        ;;
    3)
        echo "=== Commit e Push Completo ==="
        read -p "Digite a mensagem do commit: " commit_msg
        git add .
        git commit -m "$commit_msg"
        git push origin $(git branch --show-current)
        echo "Commit e push realizados com sucesso!"
        ;;
    4)
        echo "=== Criar Nova Branch ==="
        read -p "Digite o nome da nova branch: " branch_name
        git checkout -b "$branch_name"
        git push -u origin "$branch_name"
        echo "Branch '$branch_name' criada e enviada para o repositório remoto!"
        ;;
    5)
        echo "=== Merge e Cleanup ==="
        current_branch=$(git branch --show-current)
        echo "Branch atual: $current_branch"
        if [ "$current_branch" != "main" ]; then
            read -p "Fazer merge de '$current_branch' para main? (y/n): " confirm
            if [ "$confirm" = "y" ]; then
                git checkout main
                git pull origin main
                git merge "$current_branch"
                git push origin main
                read -p "Deletar branch '$current_branch'? (y/n): " delete_confirm
                if [ "$delete_confirm" = "y" ]; then
                    git branch -d "$current_branch"
                    git push origin --delete "$current_branch"
                fi
            fi
        else
            echo "Você já está na branch main"
        fi
        ;;
    6)
        echo "=== Reverter Mudanças ==="
        echo "1. Reverter mudanças não commitadas"
        echo "2. Reverter último commit"
        echo "3. Voltar para commit específico"
        read -p "Escolha (1-3): " revert_choice
        case $revert_choice in
            1)
                git restore .
                echo "Mudanças não commitadas revertidas!"
                ;;
            2)
                git reset --soft HEAD~1
                echo "Último commit revertido (mudanças mantidas)!"
                ;;
            3)
                git log --oneline -10
                read -p "Digite o hash do commit: " commit_hash
                git reset --hard "$commit_hash"
                echo "Repositório voltou para o commit $commit_hash"
                ;;
        esac
        ;;
    7)
        echo "=== Comandos de Limpeza ==="
        echo "Limpando branches mergueadas..."
        git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d
        echo "Fazendo garbage collection..."
        git gc
        echo "Removendo arquivos não rastreados..."
        git clean -fd
        echo "Limpeza concluída!"
        ;;
    8)
        echo "=== Ver Histórico ==="
        echo "1. Log detalhado (últimos 10)"
        echo "2. Log resumido (últimos 20)"
        echo "3. Histórico de um arquivo específico"
        read -p "Escolha (1-3): " log_choice
        case $log_choice in
            1)
                git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' -10
                ;;
            2)
                git log --oneline -20
                ;;
            3)
                read -p "Digite o caminho do arquivo: " file_path
                git log --follow --patch -- "$file_path"
                ;;
        esac
        ;;
    9)
        echo "=== Executando Todos os Comandos Úteis ==="
        echo "1. Status atual:"
        git status
        echo -e "\n2. Branches:"
        git branch -a
        echo -e "\n3. Últimos commits:"
        git log --oneline -5
        echo -e "\n4. Diferenças não commitadas:"
        git diff --stat
        echo -e "\n5. Arquivos modificados:"
        git diff --name-only
        echo -e "\n6. Informações do repositório remoto:"
        git remote -v
        ;;
    0)
        echo "Saindo..."
        exit 0
        ;;
    *)
        echo "Opção inválida!"
        ;;
esac
