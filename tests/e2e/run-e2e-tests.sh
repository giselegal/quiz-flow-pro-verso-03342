#!/bin/bash

# 🧪 Script Helper para Testes E2E - Quiz Flow Pro
# 
# Este script facilita a execução dos testes E2E com diferentes opções
# Uso: ./run-e2e-tests.sh [opções]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo ""
echo "════════════════════════════════════════════════════════════"
echo "🧪 Quiz Flow Pro - E2E Test Runner"
echo "════════════════════════════════════════════════════════════"
echo ""

# Verificar se o servidor está rodando
check_server() {
    echo -e "${BLUE}🔍 Verificando se o servidor está rodando...${NC}"
    
    if curl -s -f http://localhost:8080 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Servidor está rodando em http://localhost:8080${NC}"
        return 0
    else
        echo -e "${RED}❌ Servidor não está rodando!${NC}"
        echo -e "${YELLOW}💡 Inicie o servidor com: npm run dev${NC}"
        return 1
    fi
}

# Função para executar testes
run_tests() {
    local test_file=$1
    local description=$2
    
    echo ""
    echo -e "${BLUE}▶️  Executando: $description${NC}"
    echo "────────────────────────────────────────────────────────────"
    
    if npx playwright test "$test_file" --reporter=line; then
        echo -e "${GREEN}✅ $description - PASSOU${NC}"
    else
        echo -e "${RED}❌ $description - FALHOU${NC}"
        return 1
    fi
}

# Menu de opções
show_menu() {
    echo "Escolha uma opção:"
    echo ""
    echo "  1) 🎯 Suite completa (todos os testes)"
    echo "  2) 🧭 Testes de navegação"
    echo "  3) 🎯 Fluxo do quiz (21 etapas)"
    echo "  4) 📝 Editor de funis"
    echo "  5) 🏢 Admin dashboard"
    echo "  6) 🔌 Integrações e APIs"
    echo "  7) 🚀 Modo rápido (apenas suite principal)"
    echo "  8) 🐛 Modo debug (com UI)"
    echo "  9) 📊 Gerar relatório HTML"
    echo "  0) ❌ Sair"
    echo ""
}

# Processar escolha
process_choice() {
    local choice=$1
    
    case $choice in
        1)
            echo -e "${BLUE}🎯 Executando suite completa...${NC}"
            npx playwright test
            ;;
        2)
            run_tests "tests/e2e/01-navigation-flow.spec.ts" "Testes de Navegação"
            ;;
        3)
            run_tests "tests/e2e/02-quiz-complete-flow.spec.ts" "Fluxo do Quiz"
            ;;
        4)
            run_tests "tests/e2e/03-editor-functionality.spec.ts" "Editor de Funis"
            ;;
        5)
            run_tests "tests/e2e/04-admin-dashboard.spec.ts" "Admin Dashboard"
            ;;
        6)
            run_tests "tests/e2e/05-integrations-apis.spec.ts" "Integrações e APIs"
            ;;
        7)
            run_tests "tests/e2e/00-main-suite.spec.ts" "Suite Principal"
            ;;
        8)
            echo -e "${BLUE}🐛 Iniciando modo debug...${NC}"
            npx playwright test --ui
            ;;
        9)
            echo -e "${BLUE}📊 Gerando relatório...${NC}"
            npx playwright test
            npx playwright show-report
            ;;
        0)
            echo -e "${GREEN}👋 Até logo!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opção inválida!${NC}"
            return 1
            ;;
    esac
}

# Main
main() {
    # Verificar servidor
    if ! check_server; then
        exit 1
    fi
    
    echo ""
    
    # Se houver argumento, processar diretamente
    if [ $# -gt 0 ]; then
        process_choice "$1"
        exit $?
    fi
    
    # Senão, mostrar menu interativo
    while true; do
        show_menu
        read -p "Digite sua escolha: " choice
        echo ""
        
        if ! process_choice "$choice"; then
            if [ "$choice" != "0" ]; then
                echo ""
                read -p "Pressione Enter para continuar..."
            fi
        else
            echo ""
            echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
            echo -e "${GREEN}✅ Testes concluídos com sucesso!${NC}"
            echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
            echo ""
            read -p "Pressione Enter para voltar ao menu..."
        fi
    done
}

# Executar
main "$@"
