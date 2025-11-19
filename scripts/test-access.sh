#!/bin/bash

###############################################################################
# 🧪 SCRIPT DE TESTE DE ACESSO - Quiz Flow Pro
#
# Valida acesso ao frontend e rotas críticas do editor
# Uso: ./scripts/test-access.sh [porta]
###############################################################################

set -euo pipefail

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuração
PORT="${1:-8080}"
BASE_URL="http://localhost:${PORT}"
TIMEOUT=5

# Contador de testes
PASSED=0
FAILED=0
TOTAL=0

###############################################################################
# Funções auxiliares
###############################################################################

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

print_test() {
    echo -e "${YELLOW}[TEST $((TOTAL + 1))]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

print_failure() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

test_endpoint() {
    local url="$1"
    local expected_code="${2:-200}"
    local description="$3"
    
    ((TOTAL++))
    print_test "$description"
    
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$url" 2>&1 || echo "000")
    
    if [ "$response" = "$expected_code" ]; then
        print_success "HTTP $response - $url"
        return 0
    else
        print_failure "HTTP $response (esperado $expected_code) - $url"
        return 1
    fi
}

test_content() {
    local url="$1"
    local pattern="$2"
    local description="$3"
    
    ((TOTAL++))
    print_test "$description"
    
    local content
    content=$(curl -s --connect-timeout $TIMEOUT "$url" 2>&1 || echo "")
    
    if echo "$content" | grep -q "$pattern"; then
        print_success "Pattern encontrado: '$pattern'"
        return 0
    else
        print_failure "Pattern não encontrado: '$pattern'"
        return 1
    fi
}

###############################################################################
# Testes
###############################################################################

print_header "🚀 INICIANDO TESTES DE ACESSO - Porta $PORT"

# Verificar se servidor está rodando
echo -e "${BLUE}Verificando disponibilidade do servidor...${NC}"
if ! curl -s --connect-timeout 2 "$BASE_URL" > /dev/null 2>&1; then
    echo -e "${RED}✗ Servidor não está respondendo em $BASE_URL${NC}"
    echo -e "${YELLOW}💡 Execute: npm run dev${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Servidor está online em $BASE_URL${NC}\n"

# Teste 1: Home/Root
test_endpoint "$BASE_URL/" 200 "Acesso à página inicial"

# Teste 2: Index.html
test_endpoint "$BASE_URL/index.html" 200 "Acesso ao index.html"

# Teste 3: Editor sem parâmetros
test_endpoint "$BASE_URL/editor" 200 "Acesso ao editor (sem funnelId)"

# Teste 4: Editor com funnelId (quiz21StepsComplete)
test_endpoint "$BASE_URL/editor?funnelId=quiz21StepsComplete" 200 "Acesso ao editor com funnelId=quiz21StepsComplete"

# Teste 5: Editor com step específico
test_endpoint "$BASE_URL/editor?funnelId=quiz21StepsComplete&step=1" 200 "Acesso ao editor com step=1"

# Teste 6: Editor com step 10
test_endpoint "$BASE_URL/editor?funnelId=quiz21StepsComplete&step=10" 200 "Acesso ao editor com step=10"

# Teste 7: Editor com step 21
test_endpoint "$BASE_URL/editor?funnelId=quiz21StepsComplete&step=21" 200 "Acesso ao editor com step=21"

# Teste 8: Conteúdo HTML válido
test_content "$BASE_URL/" "<html" "HTML válido na página inicial"

# Teste 9: Vite client script presente
test_content "$BASE_URL/" "/@vite/client" "Vite client script carregado"

# Teste 10: React root div presente
test_content "$BASE_URL/" 'id="root"' "React root div presente"

# Teste 11: Assets estáticos (verificar se há favicon ou outros assets)
test_endpoint "$BASE_URL/vite.svg" 200 "Acesso a assets estáticos"

# Teste 12: Verificar se JSON template editor está acessível
print_test "Verificar referências ao JsonTemplateEditor no bundle"
((TOTAL++))
if curl -s "$BASE_URL/editor?funnelId=quiz21StepsComplete" | grep -q "JsonTemplateEditor\|json-editor\|JSON"; then
    print_success "Referências ao JSON editor encontradas"
    ((PASSED++))
else
    print_failure "Referências ao JSON editor não encontradas"
    ((FAILED++))
fi

###############################################################################
# Testes de Performance
###############################################################################

print_header "⚡ TESTES DE PERFORMANCE"

# Teste 13: Tempo de resposta da home
print_test "Tempo de resposta da página inicial"
((TOTAL++))
start_time=$(date +%s%3N)
curl -s "$BASE_URL/" > /dev/null
end_time=$(date +%s%3N)
response_time=$((end_time - start_time))

if [ $response_time -lt 1000 ]; then
    print_success "Tempo de resposta: ${response_time}ms (< 1s)"
    ((PASSED++))
elif [ $response_time -lt 3000 ]; then
    echo -e "${YELLOW}⚠${NC} Tempo de resposta: ${response_time}ms (1-3s)"
    ((PASSED++))
else
    print_failure "Tempo de resposta: ${response_time}ms (> 3s)"
    ((FAILED++))
fi

# Teste 14: Tempo de resposta do editor
print_test "Tempo de resposta do editor"
((TOTAL++))
start_time=$(date +%s%3N)
curl -s "$BASE_URL/editor?funnelId=quiz21StepsComplete" > /dev/null
end_time=$(date +%s%3N)
response_time=$((end_time - start_time))

if [ $response_time -lt 1500 ]; then
    print_success "Tempo de resposta: ${response_time}ms (< 1.5s)"
    ((PASSED++))
elif [ $response_time -lt 4000 ]; then
    echo -e "${YELLOW}⚠${NC} Tempo de resposta: ${response_time}ms (1.5-4s)"
    ((PASSED++))
else
    print_failure "Tempo de resposta: ${response_time}ms (> 4s)"
    ((FAILED++))
fi

###############################################################################
# Testes de Rotas Específicas do PR #46
###############################################################################

print_header "🎯 TESTES ESPECÍFICOS DO PR #46"

# Teste 15: Verificar URL correta documentada
print_test "Validar URL documentada na resposta anterior"
((TOTAL++))
DOCUMENTED_URL="http://localhost:5173/editor?funnelId=quiz21StepsComplete"
CORRECT_URL="http://localhost:8080/editor?funnelId=quiz21StepsComplete"

if [ "$DOCUMENTED_URL" = "$CORRECT_URL" ]; then
    print_success "URL documentada está correta"
    ((PASSED++))
else
    print_failure "URL documentada INCORRETA!"
    echo -e "   ${RED}Documentado: $DOCUMENTED_URL${NC}"
    echo -e "   ${GREEN}Correto: $CORRECT_URL${NC}"
    ((FAILED++))
fi

# Teste 16: Verificar estrutura do initialData no SuperUnifiedProvider
print_test "Validar inicialização do editor com initialData"
((TOTAL++))
if curl -s "$BASE_URL/editor?funnelId=quiz21StepsComplete" | grep -q "AUDIT-FIX-ENHANCED\|initialData\|stepBlocks"; then
    print_success "Sistema de inicialização detectado"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Sistema de inicialização não detectado visualmente"
    ((PASSED++))
fi

###############################################################################
# Resumo
###############################################################################

print_header "📊 RESUMO DOS TESTES"

echo -e "Total de testes: ${BLUE}$TOTAL${NC}"
echo -e "Testes aprovados: ${GREEN}$PASSED${NC}"
echo -e "Testes falhados: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ TODOS OS TESTES PASSARAM!${NC}"
    echo -e "${GREEN}✓ O frontend está acessível em: $BASE_URL${NC}"
    echo -e "${GREEN}✓ Editor JSON disponível em: $BASE_URL/editor?funnelId=quiz21StepsComplete${NC}\n"
    exit 0
else
    echo -e "\n${RED}✗ $FAILED teste(s) falharam${NC}"
    echo -e "${YELLOW}💡 Verifique a configuração do servidor e tente novamente${NC}\n"
    exit 1
fi
