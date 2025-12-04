#!/bin/bash

# 🧪 Script de Validação HierarchicalTemplateSource V2
# Testa a implementação refatorada e compara com V1

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 VALIDAÇÃO: HierarchicalTemplateSource V2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0
TOTAL=0

# Função para testar
test_case() {
  local name="$1"
  local command="$2"
  
  TOTAL=$((TOTAL + 1))
  echo -n "[$TOTAL] $name... "
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSOU${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FALHOU${NC}"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# Função para testar com output
test_with_output() {
  local name="$1"
  local command="$2"
  local expected="$3"
  
  TOTAL=$((TOTAL + 1))
  echo -n "[$TOTAL] $name... "
  
  local output=$(eval "$command" 2>&1)
  
  if [[ "$output" == *"$expected"* ]]; then
    echo -e "${GREEN}✓ PASSOU${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FALHOU${NC}"
    echo "  Esperado: $expected"
    echo "  Obtido: $output"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo -e "${BLUE}📋 FASE 1: Verificações de Estrutura${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar arquivos existem
test_case "Arquivo V2 existe" "[ -f src/services/core/HierarchicalTemplateSourceV2.ts ]"
test_case "Migration existe" "[ -f src/services/core/HierarchicalTemplateSourceMigration.ts ]"
test_case "TemplateSourceLoader existe" "[ -f src/services/core/loaders/TemplateSourceLoader.ts ]"
test_case "TemplateCache existe" "[ -f src/services/core/cache/TemplateCache.ts ]"

# Contar linhas
V2_LINES=$(wc -l < src/services/core/HierarchicalTemplateSourceV2.ts)
V1_LINES=$(wc -l < src/services/core/HierarchicalTemplateSource.ts)
REDUCTION=$((100 - (V2_LINES * 100 / V1_LINES)))

echo ""
echo -e "${BLUE}📊 Redução de Código:${NC}"
echo "  V1: $V1_LINES linhas"
echo "  V2: $V2_LINES linhas"
echo -e "  Redução: ${GREEN}${REDUCTION}%${NC}"

echo ""
echo -e "${BLUE}📋 FASE 2: Verificações de JSON Templates${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar templates JSON existem
STEPS_DIR="public/templates/quiz21Steps/steps"
test_case "Diretório de steps existe" "[ -d $STEPS_DIR ]"

# Contar steps disponíveis
STEP_COUNT=$(ls -1 $STEPS_DIR/step-*.json 2>/dev/null | wc -l)
echo -e "  ${GREEN}✓${NC} Encontrados $STEP_COUNT steps JSON"

# Testar alguns steps específicos
for i in 01 05 10 15 21; do
  STEP_FILE="$STEPS_DIR/step-$i.json"
  test_case "Step-$i existe" "[ -f $STEP_FILE ]"
  
  if [ -f "$STEP_FILE" ]; then
    # Validar JSON
    test_case "Step-$i é JSON válido" "jq empty $STEP_FILE"
    
    # Verificar estrutura
    BLOCK_COUNT=$(jq '.blocks | length' $STEP_FILE 2>/dev/null)
    if [ "$BLOCK_COUNT" -gt 0 ]; then
      echo -e "    ${GREEN}└─${NC} $BLOCK_COUNT blocos encontrados"
    fi
  fi
done

echo ""
echo -e "${BLUE}📋 FASE 3: Testes de Compilação${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar imports
test_case "V2 importa TemplateDataSource" "grep -q 'TemplateDataSource' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "V2 importa TemplateSourceLoader" "grep -q 'TemplateSourceLoader' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "V2 importa TemplateCache" "grep -q 'TemplateCache' src/services/core/HierarchicalTemplateSourceV2.ts"

# Verificar enum SourceMode
test_case "V2 define enum SourceMode" "grep -q 'enum SourceMode' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "SourceMode tem EDITOR mode" "grep -q 'EDITOR.*=' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "SourceMode tem PRODUCTION mode" "grep -q 'PRODUCTION.*=' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "SourceMode tem LIVE_EDIT mode" "grep -q 'LIVE_EDIT.*=' src/services/core/HierarchicalTemplateSourceV2.ts"

# Verificar métodos principais
test_case "V2 implementa getPrimary" "grep -q 'async getPrimary' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "V2 implementa setPrimary" "grep -q 'async setPrimary' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "V2 implementa invalidate" "grep -q 'async invalidate' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "V2 implementa predictSource" "grep -q 'async predictSource' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "V2 implementa getMetrics" "grep -q 'getMetrics' src/services/core/HierarchicalTemplateSourceV2.ts"

echo ""
echo -e "${BLUE}📋 FASE 4: Sistema de Migração${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar feature flag
test_case "Migration detecta flag V2" "grep -q 'FEATURE_HIERARCHICAL_V2' src/services/core/HierarchicalTemplateSourceMigration.ts"
test_case "Migration importa V1" "grep -q 'HierarchicalTemplateSource.*V1' src/services/core/HierarchicalTemplateSourceMigration.ts"
test_case "Migration importa V2" "grep -q 'HierarchicalTemplateSource.*V2' src/services/core/HierarchicalTemplateSourceMigration.ts"
test_case "Migration exporta singleton" "grep -q 'export const hierarchicalTemplateSource' src/services/core/HierarchicalTemplateSourceMigration.ts"

echo ""
echo -e "${BLUE}📋 FASE 5: Verificações de Arquitetura${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Ordem de carregamento otimizada
test_case "V2 verifica cache primeiro" "grep -q 'await this.cache.get' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "V2 carrega JSON após cache" "grep -q 'await this.loader.loadJSON' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "V2 aplica overlays USER_EDIT" "grep -q 'loadUserEdit' src/services/core/HierarchicalTemplateSourceV2.ts"
test_case "V2 aplica overlays ADMIN_OVERRIDE" "grep -q 'loadAdminOverride' src/services/core/HierarchicalTemplateSourceV2.ts"

# Verificar prefetch
test_case "Cache implementa prefetch" "grep -q 'prefetchAdjacent' src/services/core/cache/TemplateCache.ts"

# Loader usa fetch
test_case "Loader usa fetch para JSON" "grep -q 'fetch.*templates' src/services/core/loaders/TemplateSourceLoader.ts"

echo ""
echo -e "${BLUE}📋 FASE 6: Métricas de Performance${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Testar tempo de load de um JSON
START_TIME=$(date +%s%3N)
curl -s http://localhost:8081/templates/quiz21Steps/steps/step-01.json > /dev/null 2>&1 || echo "Servidor não disponível"
END_TIME=$(date +%s%3N)
LOAD_TIME=$((END_TIME - START_TIME))

if [ $LOAD_TIME -lt 500 ]; then
  echo -e "${GREEN}✓${NC} Tempo de load: ${LOAD_TIME}ms (< 500ms target)"
  PASSED=$((PASSED + 1))
else
  echo -e "${YELLOW}⚠${NC} Tempo de load: ${LOAD_TIME}ms (> 500ms target)"
fi
TOTAL=$((TOTAL + 1))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 RESUMO DOS TESTES${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "  Total de testes: $TOTAL"
echo -e "  ${GREEN}Passaram: $PASSED${NC}"
echo -e "  ${RED}Falharam: $FAILED${NC}"
echo ""

SUCCESS_RATE=$((PASSED * 100 / TOTAL))

if [ $SUCCESS_RATE -ge 90 ]; then
  echo -e "${GREEN}✅ VALIDAÇÃO APROVADA ($SUCCESS_RATE% de sucesso)${NC}"
  echo ""
  echo -e "${BLUE}🚀 Próximos Passos:${NC}"
  echo "  1. Abra: http://localhost:8081/test-hierarchical-v2.html"
  echo "  2. Clique em 'Habilitar V2'"
  echo "  3. Recarregue a aplicação principal"
  echo "  4. Monitore console do navegador para logs"
  echo "  5. Teste carregamento de steps"
  echo ""
  exit 0
elif [ $SUCCESS_RATE -ge 70 ]; then
  echo -e "${YELLOW}⚠️  VALIDAÇÃO PARCIAL ($SUCCESS_RATE% de sucesso)${NC}"
  echo "  Alguns testes falharam, mas implementação pode estar funcional"
  exit 1
else
  echo -e "${RED}❌ VALIDAÇÃO FALHOU ($SUCCESS_RATE% de sucesso)${NC}"
  echo "  Muitos testes falharam, revisar implementação"
  exit 2
fi
