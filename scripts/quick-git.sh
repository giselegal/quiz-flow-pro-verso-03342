#!/bin/bash

# Quick Git Commands - Comandos rápidos mais usados

echo "=== Comandos Git Rápidos ==="

# Função para commit rápido
quick_commit() {
    if [ -z "$1" ]; then
        echo "Uso: quick_commit 'mensagem do commit'"
        return 1
    fi
    git add .
    git commit -m "$1"
    git push origin $(git branch --show-current)
    echo "✅ Commit '$1' realizado e enviado!"
}

# Função para sincronização rápida
quick_sync() {
    echo "🔄 Sincronizando com repositório remoto..."
    git fetch origin
    git pull origin $(git branch --show-current)
    echo "✅ Sincronização concluída!"
}

# Função para criar branch rápida
quick_branch() {
    if [ -z "$1" ]; then
        echo "Uso: quick_branch nome-da-branch"
        return 1
    fi
    git checkout -b "$1"
    git push -u origin "$1"
    echo "✅ Branch '$1' criada!"
}

# Função para status detalhado
quick_status() {
    echo "📊 Status do repositório:"
    git status --short
    echo -e "\n📋 Últimos 3 commits:"
    git log --oneline -3
    echo -e "\n🌿 Branch atual: $(git branch --show-current)"
}

# Menu principal
echo "Escolha um comando rápido:"
echo "1. Status detalhado"
echo "2. Commit rápido"
echo "3. Sincronizar"
echo "4. Criar nova branch"
echo "5. Ver diferenças"
echo "6. Histórico resumido"

read -p "Digite sua escolha (1-6): " choice

case $choice in
    1)
        quick_status
        ;;
    2)
        read -p "Digite a mensagem do commit: " msg
        quick_commit "$msg"
        ;;
    3)
        quick_sync
        ;;
    4)
        read -p "Digite o nome da nova branch: " branch
        quick_branch "$branch"
        ;;
    5)
        echo "📝 Diferenças nos arquivos modificados:"
        git diff --stat
        echo -e "\n📄 Arquivos modificados:"
        git diff --name-only
        ;;
    6)
        echo "📚 Histórico dos últimos 10 commits:"
        git log --graph --pretty=format:'%Cred%h%Creset - %s %Cgreen(%cr)%Creset' -10
        ;;
    *)
        echo "❌ Opção inválida!"
        ;;
esac
