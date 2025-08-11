#!/bin/bash

# 🚀 COMANDOS RÁPIDOS PARA GIT REBASE E MERGE
# ===========================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Git Quick Commands - Rebase e Merge${NC}"
echo "=========================================="

# Função para mostrar status atual
show_status() {
    echo -e "\n${YELLOW}📊 Status atual:${NC}"
    git status --short
    echo -e "\n${YELLOW}🌿 Branch atual:${NC} $(git branch --show-current)"
    echo -e "${YELLOW}📈 Commits à frente:${NC} $(git rev-list --count HEAD ^origin/main 2>/dev/null || echo '0')"
}

# Função para pull rápido
quick_pull() {
    echo -e "\n${BLUE}⬇️ Fazendo pull da branch principal...${NC}"
    git checkout main
    git pull origin main
    echo -e "${GREEN}✅ Pull concluído!${NC}"
}

# Função para rebase interativo
quick_rebase() {
    echo -e "\n${BLUE}🔄 Iniciando rebase interativo...${NC}"
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" == "main" ]; then
        echo -e "${RED}❌ Você está na branch main. Mude para uma feature branch primeiro.${NC}"
        return 1
    fi
    
    # Atualizar main primeiro
    git checkout main
    git pull origin main
    
    # Voltar para a branch e fazer rebase
    git checkout "$current_branch"
    git rebase -i main
    
    echo -e "${GREEN}✅ Rebase concluído!${NC}"
}

# Função para rebase simples (não interativo)
quick_rebase_simple() {
    echo -e "\n${BLUE}🔄 Fazendo rebase simples...${NC}"
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" == "main" ]; then
        echo -e "${RED}❌ Você está na branch main. Mude para uma feature branch primeiro.${NC}"
        return 1
    fi
    
    # Atualizar main primeiro
    git checkout main
    git pull origin main
    
    # Voltar para a branch e fazer rebase
    git checkout "$current_branch"
    git rebase main
    
    echo -e "${GREEN}✅ Rebase simples concluído!${NC}"
}

# Função para squash commits
quick_squash() {
    echo -e "\n${BLUE}📦 Fazendo squash dos últimos commits...${NC}"
    
    read -p "Quantos commits você quer fazer squash? " commit_count
    
    if [[ ! "$commit_count" =~ ^[0-9]+$ ]] || [ "$commit_count" -lt 2 ]; then
        echo -e "${RED}❌ Por favor, insira um número válido (mínimo 2)${NC}"
        return 1
    fi
    
    git rebase -i HEAD~$commit_count
    echo -e "${GREEN}✅ Squash configurado!${NC}"
}

# Função para merge com main
quick_merge() {
    echo -e "\n${BLUE}🔀 Fazendo merge com main...${NC}"
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" == "main" ]; then
        echo -e "${RED}❌ Você já está na branch main.${NC}"
        return 1
    fi
    
    # Confirmar se quer fazer merge
    echo -e "${YELLOW}⚠️ Isso vai fazer merge da branch '$current_branch' na main.${NC}"
    read -p "Continuar? (y/N): " confirm
    
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo -e "${YELLOW}❌ Merge cancelado.${NC}"
        return 0
    fi
    
    # Atualizar main primeiro
    git checkout main
    git pull origin main
    
    # Fazer merge
    git merge "$current_branch" --no-ff -m "Merge branch '$current_branch'"
    
    echo -e "${GREEN}✅ Merge concluído!${NC}"
    
    # Perguntar se quer deletar a branch
    read -p "Deletar a branch '$current_branch'? (y/N): " delete_branch
    if [[ "$delete_branch" == "y" || "$delete_branch" == "Y" ]]; then
        git branch -d "$current_branch"
        echo -e "${GREEN}✅ Branch '$current_branch' deletada!${NC}"
    fi
}

# Função para commit rápido
quick_commit() {
    echo -e "\n${BLUE}💾 Fazendo commit rápido...${NC}"
    
    # Mostrar arquivos modificados
    echo -e "${YELLOW}📝 Arquivos modificados:${NC}"
    git status --short
    
    # Pedir mensagem do commit
    read -p "Digite a mensagem do commit: " commit_msg
    
    if [ -z "$commit_msg" ]; then
        echo -e "${RED}❌ Mensagem do commit não pode estar vazia.${NC}"
        return 1
    fi
    
    git add .
    git commit -m "$commit_msg"
    
    echo -e "${GREEN}✅ Commit criado!${NC}"
    
    # Perguntar se quer fazer push
    read -p "Fazer push? (y/N): " push_confirm
    if [[ "$push_confirm" == "y" || "$push_confirm" == "Y" ]]; then
        current_branch=$(git branch --show-current)
        git push origin "$current_branch"
        echo -e "${GREEN}✅ Push realizado!${NC}"
    fi
}

# Função para reset suave
quick_reset_soft() {
    echo -e "\n${BLUE}↩️ Reset suave do último commit...${NC}"
    
    # Mostrar último commit
    echo -e "${YELLOW}📋 Último commit:${NC}"
    git log --oneline -1
    
    read -p "Confirma reset suave? (y/N): " confirm
    
    if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
        git reset --soft HEAD~1
        echo -e "${GREEN}✅ Reset suave realizado!${NC}"
    else
        echo -e "${YELLOW}❌ Reset cancelado.${NC}"
    fi
}

# Função para limpar branches
clean_branches() {
    echo -e "\n${BLUE}🧹 Limpando branches locais...${NC}"
    
    echo -e "${YELLOW}📋 Branches locais:${NC}"
    git branch
    
    echo -e "\n${YELLOW}🗑️ Deletando branches já mergeadas...${NC}"
    git branch --merged main | grep -v main | xargs -n 1 git branch -d
    
    echo -e "${GREEN}✅ Limpeza concluída!${NC}"
}

# Menu principal
show_menu() {
    echo -e "\n${BLUE}📋 Escolha uma opção:${NC}"
    echo "1) 📊 Status"
    echo "2) ⬇️  Pull da main"
    echo "3) 🔄 Rebase interativo"
    echo "4) 🔄 Rebase simples"
    echo "5) 📦 Squash commits"
    echo "6) 🔀 Merge com main"
    echo "7) 💾 Commit rápido"
    echo "8) ↩️  Reset suave"
    echo "9) 🧹 Limpar branches"
    echo "0) ❌ Sair"
    echo ""
}

# Loop principal
while true; do
    show_status
    show_menu
    
    read -p "Digite sua opção: " option
    
    case $option in
        1) show_status ;;
        2) quick_pull ;;
        3) quick_rebase ;;
        4) quick_rebase_simple ;;
        5) quick_squash ;;
        6) quick_merge ;;
        7) quick_commit ;;
        8) quick_reset_soft ;;
        9) clean_branches ;;
        0) echo -e "${GREEN}👋 Até mais!${NC}"; exit 0 ;;
        *) echo -e "${RED}❌ Opção inválida!${NC}" ;;
    esac
    
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    read -p "Pressione Enter para continuar..."
done
