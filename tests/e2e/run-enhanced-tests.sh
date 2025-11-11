#!/bin/bash

# 🚀 SCRIPT AUTOMATIZADO PARA TESTES E2E MELHORADOS
# Executa suite completa de testes com relatórios detalhados

set -e

# Configurações
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RESULTS_DIR="${PROJECT_ROOT}/test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="${RESULTS_DIR}/reports"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  ${1}${NC}"
}

log_success() {
    echo -e "${GREEN}✅ ${1}${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  ${1}${NC}"
}

log_error() {
    echo -e "${RED}❌ ${1}${NC}"
}

log_header() {
    echo -e "\n${PURPLE}🧪 ${1}${NC}"
    echo -e "${WHITE}${'='*50}${NC}"
}

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para verificar servidor
check_server() {
    log_info "Verificando se servidor está rodando..."
    
    local server_url="http://localhost:8080"
    local max_attempts=5
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$server_url" >/dev/null 2>&1; then
            log_success "Servidor respondendo em $server_url"
            return 0
        fi
        
        log_warning "Tentativa $attempt/$max_attempts: servidor não responde"
        sleep 2
        ((attempt++))
    done
    
    log_error "Servidor não está disponível em $server_url"
    log_info "Execute 'npm run dev' em outro terminal antes de executar os testes"
    exit 1
}

# Função para preparar ambiente
prepare_environment() {
    log_header "Preparando Ambiente de Testes"
    
    # Verificar Node.js
    if ! command_exists node; then
        log_error "Node.js não está instalado"
        exit 1
    fi
    log_info "Node.js: $(node --version)"
    
    # Verificar npm
    if ! command_exists npm; then
        log_error "npm não está disponível"
        exit 1
    fi
    
    # Verificar Playwright
    if ! command_exists npx || ! npx playwright --version >/dev/null 2>&1; then
        log_error "Playwright não está instalado"
        log_info "Execute: npm install"
        exit 1
    fi
    log_info "Playwright: $(npx playwright --version)"
    
    # Criar diretórios
    mkdir -p "${RESULTS_DIR}/screenshots"
    mkdir -p "${RESULTS_DIR}/videos" 
    mkdir -p "${RESULTS_DIR}/traces"
    mkdir -p "${REPORT_DIR}"
    
    log_success "Ambiente preparado"
}

# Função para executar testes de acessibilidade
run_accessibility_tests() {
    log_header "Testes de Acessibilidade"
    
    log_info "Executando auditoria de acessibilidade com axe-core..."
    
    if npm run test:e2e:accessibility; then
        log_success "Testes de acessibilidade completados"
        return 0
    else
        log_warning "Alguns testes de acessibilidade falharam"
        return 1
    fi
}

# Função para executar testes visuais
run_visual_tests() {
    log_header "Testes de Regressão Visual"
    
    log_info "Executando comparações visuais..."
    
    if npm run test:e2e:visual-regression; then
        log_success "Testes visuais completados"
        return 0
    else
        log_warning "Alguns testes visuais falharam - pode indicar mudanças na UI"
        return 1
    fi
}

# Função para executar validação rápida
run_quick_validation() {
    log_header "Validação Rápida"
    
    log_info "Executando testes de sanidade..."
    
    if npm run test:e2e:quick-enhanced; then
        log_success "Validação rápida passou"
        return 0
    else
        log_error "Validação rápida falhou - problemas básicos detectados"
        return 1
    fi
}

# Função para executar suite completa
run_comprehensive_tests() {
    log_header "Suite Completa de Testes"
    
    log_info "Executando todos os testes melhorados..."
    
    if npm run test:e2e:enhanced; then
        log_success "Suite completa passou"
        return 0
    else
        log_warning "Alguns testes falharam na suite completa"
        return 1
    fi
}

# Função para gerar relatório consolidado
generate_reports() {
    log_header "Gerando Relatórios"
    
    # Verificar se arquivo de resultados existe
    if [ -f "${RESULTS_DIR}/results.json" ]; then
        log_info "Processando resultados JSON..."
        
        # Extrair estatísticas básicas
        local total_tests=$(jq -r '.stats.expected // 0' "${RESULTS_DIR}/results.json" 2>/dev/null || echo "0")
        local passed_tests=$(jq -r '.stats.passed // 0' "${RESULTS_DIR}/results.json" 2>/dev/null || echo "0")
        local failed_tests=$(jq -r '.stats.failed // 0' "${RESULTS_DIR}/results.json" 2>/dev/null || echo "0")
        
        log_info "Total: $total_tests | Passou: $passed_tests | Falhou: $failed_tests"
    fi
    
    # Verificar relatórios gerados
    if [ -f "${REPORT_DIR}/test-report.html" ]; then
        log_success "Relatório HTML gerado: ${REPORT_DIR}/test-report.html"
    fi
    
    if [ -f "${REPORT_DIR}/test-report.json" ]; then
        log_info "Relatório JSON disponível: ${REPORT_DIR}/test-report.json"
    fi
    
    if [ -f "${REPORT_DIR}/test-report.md" ]; then
        log_info "Relatório Markdown disponível: ${REPORT_DIR}/test-report.md"
    fi
    
    # Contar screenshots
    local screenshot_count=$(find "${RESULTS_DIR}" -name "*.png" 2>/dev/null | wc -l)
    if [ "$screenshot_count" -gt 0 ]; then
        log_info "Screenshots capturados: $screenshot_count"
    fi
    
    # Contar vídeos
    local video_count=$(find "${RESULTS_DIR}" -name "*.webm" 2>/dev/null | wc -l)
    if [ "$video_count" -gt 0 ]; then
        log_info "Vídeos de falhas: $video_count"
    fi
}

# Função para abrir relatórios
open_reports() {
    log_header "Abrindo Relatórios"
    
    local html_report="${REPORT_DIR}/test-report.html"
    local playwright_report="${RESULTS_DIR}/playwright-report/index.html"
    
    if [ -f "$html_report" ]; then
        log_info "Abrindo relatório personalizado..."
        
        # Tentar abrir no navegador (funciona em diferentes sistemas)
        if command_exists xdg-open; then
            xdg-open "$html_report" 2>/dev/null &
        elif command_exists open; then
            open "$html_report" 2>/dev/null &
        elif command_exists start; then
            start "$html_report" 2>/dev/null &
        else
            log_info "Relatório disponível em: $html_report"
        fi
    fi
    
    if [ -f "$playwright_report" ]; then
        log_info "Relatório Playwright disponível em: $playwright_report"
    fi
}

# Função principal
main() {
    local test_mode="${1:-full}"
    local exit_code=0
    
    echo -e "${CYAN}"
    echo "🧪 TESTES E2E MELHORADOS - QUIZ FLOW PRO"
    echo "========================================"
    echo -e "${NC}"
    echo "Modo: $test_mode"
    echo "Timestamp: $TIMESTAMP"
    echo ""
    
    # Preparar ambiente
    prepare_environment
    
    # Verificar servidor
    check_server
    
    case "$test_mode" in
        "quick"|"q")
            log_info "Executando apenas validação rápida..."
            run_quick_validation || exit_code=1
            ;;
            
        "accessibility"|"a11y")
            log_info "Executando apenas testes de acessibilidade..."
            run_accessibility_tests || exit_code=1
            ;;
            
        "visual"|"v")
            log_info "Executando apenas testes visuais..."
            run_visual_tests || exit_code=1
            ;;
            
        "comprehensive"|"comp")
            log_info "Executando suite completa..."
            run_comprehensive_tests || exit_code=1
            ;;
            
        "full"|"f"|*)
            log_info "Executando todos os tipos de teste..."
            
            # Validação rápida primeiro
            run_quick_validation || exit_code=1
            
            # Se validação rápida passou, continuar
            if [ $exit_code -eq 0 ]; then
                run_accessibility_tests || exit_code=1
                run_visual_tests || exit_code=1
                run_comprehensive_tests || exit_code=1
            fi
            ;;
    esac
    
    # Sempre gerar relatórios
    generate_reports
    
    # Resumo final
    log_header "Resumo da Execução"
    
    if [ $exit_code -eq 0 ]; then
        log_success "Todos os testes passaram! 🎉"
        echo -e "${GREEN}Sistema está funcionando conforme esperado.${NC}"
    else
        log_warning "Alguns testes falharam ⚠️"
        echo -e "${YELLOW}Verifique os relatórios para detalhes das falhas.${NC}"
    fi
    
    echo ""
    log_info "Resultados salvos em: ${RESULTS_DIR}"
    
    # Abrir relatórios se for execução interativa
    if [ -t 1 ] && [ "$CI" != "true" ]; then
        read -p "Deseja abrir os relatórios? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open_reports
        fi
    fi
    
    exit $exit_code
}

# Verificar se o script está sendo executado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi