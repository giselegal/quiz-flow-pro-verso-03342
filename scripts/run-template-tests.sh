#!/bin/bash

# Script de execução de testes automatizados para o sistema de templates
# Executa todos os testes criados: schema, hooks, service, component, integration

set -e

echo "🧪 Iniciando Suite de Testes - Sistema de Templates v3.1"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Contador de resultados
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Função para executar teste individual
run_test() {
  local test_file=$1
  local test_name=$2
  
  echo -e "${YELLOW}▶ Executando: ${test_name}${NC}"
  
  if npx vitest run "${test_file}" --reporter=basic --silent 2>&1 | grep -q "PASS"; then
    echo -e "${GREEN}✅ ${test_name} - PASSOU${NC}"
    ((PASSED_TESTS++))
  else
    echo -e "${RED}❌ ${test_name} - FALHOU${NC}"
    ((FAILED_TESTS++))
  fi
  
  ((TOTAL_TESTS++))
  echo ""
}

echo "📊 Testes de Validação (Schema)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
run_test "src/schemas/__tests__/templateSchema.test.ts" "Template Schema Validation"

echo "🪝 Testes de Hooks React Query"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
run_test "src/services/hooks/__tests__/templateHooks.test.tsx" "React Query Hooks"

echo "⚙️ Testes de Serviço (TemplateService)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
run_test "src/services/canonical/__tests__/TemplateService.test.ts" "Template Service (3-Tier)"

echo "🎨 Testes de Componente (ImportTemplateDialog)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
run_test "src/components/editor/quiz/dialogs/__tests__/ImportTemplateDialog.test.tsx" "Import Dialog Component"

echo "🔄 Testes de Integração (Workflows)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
run_test "src/__tests__/integration/templateWorkflows.test.tsx" "Integration Workflows"

# Resumo final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 RESUMO DOS TESTES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total de suites: ${TOTAL_TESTS}"
echo -e "${GREEN}Passou: ${PASSED_TESTS}${NC}"
if [ ${FAILED_TESTS} -gt 0 ]; then
  echo -e "${RED}Falhou: ${FAILED_TESTS}${NC}"
else
  echo -e "${GREEN}Falhou: ${FAILED_TESTS}${NC}"
fi

# Percentual de sucesso
SUCCESS_RATE=$(echo "scale=2; ${PASSED_TESTS} * 100 / ${TOTAL_TESTS}" | bc)
echo "Taxa de sucesso: ${SUCCESS_RATE}%"
echo ""

# Exit code baseado nos resultados
if [ ${FAILED_TESTS} -gt 0 ]; then
  echo -e "${RED}❌ Alguns testes falharam${NC}"
  exit 1
else
  echo -e "${GREEN}✅ Todos os testes passaram!${NC}"
  exit 0
fi
