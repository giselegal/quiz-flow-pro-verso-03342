#!/bin/bash

# 🧪 Script de Execução dos Testes E2E - Estrutura Atual
# Execute este script para rodar todas as suítes de teste

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir cabeçalhos
print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}\n"
}

# Função para imprimir sucesso
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Função para imprimir erro
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para imprimir aviso
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Função para verificar se o servidor está rodando
check_server() {
    print_header "Verificando servidor..."
    
    if curl -s http://localhost:8080 > /dev/null; then
        print_success "Servidor está rodando em http://localhost:8080"
        return 0
    else
        print_error "Servidor não está rodando em http://localhost:8080"
        return 1
    fi
}

# Função para executar uma suíte de testes
run_suite() {
    local suite_name=$1
    local suite_file=$2
    
    print_header "Suite: $suite_name"
    
    if npx playwright test "tests/e2e/$suite_file" --reporter=list; then
        print_success "$suite_name passou!"
        return 0
    else
        print_error "$suite_name falhou!"
        return 1
    fi
}

# Função principal
main() {
    print_header "🧪 Testes E2E - Estrutura Atual do Quiz Flow Pro"
    
    # Verificar se o servidor está rodando
    if ! check_server; then
        print_warning "Iniciando servidor de desenvolvimento..."
        npm run dev &
        SERVER_PID=$!
        
        echo "Aguardando servidor iniciar..."
        sleep 10
        
        if ! check_server; then
            print_error "Falha ao iniciar servidor"
            kill $SERVER_PID 2>/dev/null || true
            exit 1
        fi
    fi
    
    # Array para rastrear resultados
    declare -a results
    
    # Suite 01: Health Check
    if run_suite "01 - App Health" "suite-01-app-health.spec.ts"; then
        results+=("✅ Suite 01: App Health")
    else
        results+=("❌ Suite 01: App Health")
    fi
    
    # Suite 02: Routing
    if run_suite "02 - Sistema de Rotas" "suite-02-routing.spec.ts"; then
        results+=("✅ Suite 02: Routing")
    else
        results+=("❌ Suite 02: Routing")
    fi
    
    # Suite 03: Editor
    if run_suite "03 - Editor de Quiz" "suite-03-editor.spec.ts"; then
        results+=("✅ Suite 03: Editor")
    else
        results+=("❌ Suite 03: Editor")
    fi
    
    # Suite 04: Quiz Flow
    if run_suite "04 - Fluxo do Quiz" "suite-04-quiz-flow.spec.ts"; then
        results+=("✅ Suite 04: Quiz Flow")
    else
        results+=("❌ Suite 04: Quiz Flow")
    fi
    
    # Suite 05: Data Persistence
    if run_suite "05 - Persistência de Dados" "suite-05-data-persistence.spec.ts"; then
        results+=("✅ Suite 05: Persistence")
    else
        results+=("❌ Suite 05: Persistence")
    fi
    
    # Suite 06: Responsive
    if run_suite "06 - Responsividade" "suite-06-responsive.spec.ts"; then
        results+=("✅ Suite 06: Responsive")
    else
        results+=("❌ Suite 06: Responsive")
    fi
    
    # Suite 07: Performance
    if run_suite "07 - Performance" "suite-07-performance.spec.ts"; then
        results+=("✅ Suite 07: Performance")
    else
        results+=("❌ Suite 07: Performance")
    fi
    
    # Resumo dos resultados
    print_header "📊 RESUMO DOS TESTES"
    
    total=${#results[@]}
    passed=0
    
    for result in "${results[@]}"; do
        echo -e "$result"
        if [[ $result == *"✅"* ]]; then
            ((passed++))
        fi
    done
    
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    echo -e "Total: $total suítes"
    echo -e "${GREEN}Passou: $passed${NC}"
    echo -e "${RED}Falhou: $((total - passed))${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    
    # Abrir relatório HTML
    print_header "📄 Gerando relatório..."
    npx playwright show-report --host 0.0.0.0 &
    
    print_success "Relatório HTML disponível em http://localhost:9323"
    
    # Limpar servidor se foi iniciado por este script
    if [ ! -z "$SERVER_PID" ]; then
        print_warning "Encerrando servidor..."
        kill $SERVER_PID 2>/dev/null || true
    fi
    
    # Exit com código apropriado
    if [ $passed -eq $total ]; then
        print_success "TODOS OS TESTES PASSARAM! 🎉"
        exit 0
    else
        print_error "ALGUNS TESTES FALHARAM"
        exit 1
    fi
}

# Processar argumentos
case "${1:-all}" in
    1|suite1)
        check_server || exit 1
        run_suite "01 - App Health" "suite-01-app-health.spec.ts"
        ;;
    2|suite2)
        check_server || exit 1
        run_suite "02 - Sistema de Rotas" "suite-02-routing.spec.ts"
        ;;
    3|suite3)
        check_server || exit 1
        run_suite "03 - Editor de Quiz" "suite-03-editor.spec.ts"
        ;;
    4|suite4)
        check_server || exit 1
        run_suite "04 - Fluxo do Quiz" "suite-04-quiz-flow.spec.ts"
        ;;
    5|suite5)
        check_server || exit 1
        run_suite "05 - Persistência de Dados" "suite-05-data-persistence.spec.ts"
        ;;
    6|suite6)
        check_server || exit 1
        run_suite "06 - Responsividade" "suite-06-responsive.spec.ts"
        ;;
    7|suite7)
        check_server || exit 1
        run_suite "07 - Performance" "suite-07-performance.spec.ts"
        ;;
    all|*)
        main
        ;;
esac
