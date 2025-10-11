#!/bin/bash

# 🚀 Script de Automação: Abrir Editor do Quiz
# Facilita o acesso ao editor do template quiz21StepsComplete

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   🚀 ABRIR EDITOR DO QUIZ DE ESTILO PESSOAL${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"

# Verificar se o servidor está rodando
echo -e "${YELLOW}🔍 Verificando servidor de desenvolvimento...${NC}"
if pgrep -f "vite" > /dev/null; then
    echo -e "${GREEN}✅ Servidor já está rodando!${NC}\n"
else
    echo -e "${RED}❌ Servidor não está rodando${NC}"
    echo -e "${YELLOW}📦 Iniciando servidor de desenvolvimento...${NC}\n"
    
    # Iniciar servidor em background
    npm run dev > /tmp/vite-server.log 2>&1 &
    SERVER_PID=$!
    
    echo -e "${BLUE}⏳ Aguardando servidor inicializar (15s)...${NC}"
    sleep 15
    
    if pgrep -f "vite" > /dev/null; then
        echo -e "${GREEN}✅ Servidor iniciado com sucesso! (PID: $SERVER_PID)${NC}\n"
    else
        echo -e "${RED}❌ Falha ao iniciar servidor${NC}"
        echo -e "${YELLOW}📄 Logs em /tmp/vite-server.log${NC}\n"
        exit 1
    fi
fi

# Aguardar um momento para garantir que o servidor está pronto
sleep 2

# URLs disponíveis
EDITOR_URL="http://localhost:5173/editor?template=quiz21StepsComplete"
QUIZ_URL="http://localhost:5173/quiz-estilo"
ADMIN_URL="http://localhost:5173/admin/modelos-funis"

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎯 ESCOLHA UMA OPÇÃO:${NC}\n"
echo -e "${YELLOW}1)${NC} Abrir EDITOR (editar template)"
echo -e "   ${BLUE}→${NC} $EDITOR_URL\n"
echo -e "${YELLOW}2)${NC} Abrir QUIZ (testar em produção)"
echo -e "   ${BLUE}→${NC} $QUIZ_URL\n"
echo -e "${YELLOW}3)${NC} Abrir DASHBOARD ADMIN (gerenciar modelos)"
echo -e "   ${BLUE}→${NC} $ADMIN_URL\n"
echo -e "${YELLOW}4)${NC} Abrir TODOS (3 abas)\n"
echo -e "${YELLOW}5)${NC} Ver LOGS do servidor\n"
echo -e "${YELLOW}0)${NC} Sair\n"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"

read -p "Digite sua escolha (1-5): " choice

case $choice in
    1)
        echo -e "\n${GREEN}🛠️  Abrindo EDITOR...${NC}"
        echo -e "${BLUE}URL: $EDITOR_URL${NC}\n"
        
        # Tentar abrir no navegador do host
        if [ -n "$BROWSER" ]; then
            "$BROWSER" "$EDITOR_URL" 2>/dev/null &
        else
            # Fallback: mostrar URL para copiar
            echo -e "${YELLOW}📋 Copie e cole esta URL no navegador:${NC}"
            echo -e "${GREEN}$EDITOR_URL${NC}\n"
        fi
        
        echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}✨ DICAS RÁPIDAS DO EDITOR:${NC}"
        echo -e "  • Clique nas abas Step 1-20 para navegar"
        echo -e "  • Clique em um bloco para editar propriedades"
        echo -e "  • Use Ctrl+S para salvar"
        echo -e "  • Clique em Preview para testar"
        echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
        ;;
        
    2)
        echo -e "\n${GREEN}🎮 Abrindo QUIZ...${NC}"
        echo -e "${BLUE}URL: $QUIZ_URL${NC}\n"
        
        if [ -n "$BROWSER" ]; then
            "$BROWSER" "$QUIZ_URL" 2>/dev/null &
        else
            echo -e "${YELLOW}📋 Copie e cole esta URL no navegador:${NC}"
            echo -e "${GREEN}$QUIZ_URL${NC}\n"
        fi
        
        echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}✨ TESTANDO O QUIZ:${NC}"
        echo -e "  • Este é o quiz em PRODUÇÃO"
        echo -e "  • Complete todas as 20 etapas"
        echo -e "  • Veja seu resultado personalizado"
        echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
        ;;
        
    3)
        echo -e "\n${GREEN}🏢 Abrindo DASHBOARD ADMIN...${NC}"
        echo -e "${BLUE}URL: $ADMIN_URL${NC}\n"
        
        if [ -n "$BROWSER" ]; then
            "$BROWSER" "$ADMIN_URL" 2>/dev/null &
        else
            echo -e "${YELLOW}📋 Copie e cole esta URL no navegador:${NC}"
            echo -e "${GREEN}$ADMIN_URL${NC}\n"
        fi
        ;;
        
    4)
        echo -e "\n${GREEN}🚀 Abrindo TODAS as páginas...${NC}\n"
        
        if [ -n "$BROWSER" ]; then
            "$BROWSER" "$EDITOR_URL" 2>/dev/null &
            sleep 2
            "$BROWSER" "$QUIZ_URL" 2>/dev/null &
            sleep 2
            "$BROWSER" "$ADMIN_URL" 2>/dev/null &
        else
            echo -e "${YELLOW}📋 Copie e cole estas URLs no navegador:${NC}"
            echo -e "${GREEN}1. EDITOR:${NC}"
            echo -e "   $EDITOR_URL\n"
            echo -e "${GREEN}2. QUIZ:${NC}"
            echo -e "   $QUIZ_URL\n"
            echo -e "${GREEN}3. ADMIN:${NC}"
            echo -e "   $ADMIN_URL\n"
        fi
        
        echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}✨ 3 ABAS ABERTAS:${NC}"
        echo -e "  • Aba 1: Editor (para editar)"
        echo -e "  • Aba 2: Quiz (para testar)"
        echo -e "  • Aba 3: Admin (para gerenciar)"
        echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
        ;;
        
    5)
        echo -e "\n${GREEN}📄 LOGS DO SERVIDOR:${NC}\n"
        if [ -f /tmp/vite-server.log ]; then
            tail -50 /tmp/vite-server.log
        else
            echo -e "${YELLOW}⚠️  Arquivo de log não encontrado${NC}"
            echo -e "${BLUE}Executando logs em tempo real...${NC}\n"
            pgrep -f "vite" | xargs ps -p
        fi
        ;;
        
    0)
        echo -e "\n${BLUE}👋 Até logo!${NC}\n"
        exit 0
        ;;
        
    *)
        echo -e "\n${RED}❌ Opção inválida!${NC}\n"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Concluído!${NC}\n"
echo -e "${YELLOW}💡 DICA:${NC} Execute novamente para abrir outras páginas:"
echo -e "   ${BLUE}./scripts/open-editor.sh${NC}\n"
