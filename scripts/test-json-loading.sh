#!/bin/bash

# 🧪 SCRIPT DE TESTE COMPLETO: Mecanismo de Carregamento JSON
# 
# Executa todos os testes relacionados ao carregamento do funil a partir do JSON

set -e

echo "🧪 ======================================"
echo "   TESTES: Carregamento de Funil JSON"
echo "========================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Testes Unitários do TemplateService
echo -e "${BLUE}📦 1. Testes Unitários - TemplateService${NC}"
echo "----------------------------------------"
npm run test:unit tests/unit/template-service-json-loading.test.ts
echo ""

# 2. Testes de Integração - Aliases do Registry
echo -e "${BLUE}🔗 2. Testes de Integração - Registry Aliases${NC}"
echo "----------------------------------------"
npm run test:unit tests/integration/unified-registry-aliases.test.ts
echo ""

# 3. Testes de Integração - Fluxo Completo
echo -e "${BLUE}🔄 3. Testes de Integração - Fluxo Completo${NC}"
echo "----------------------------------------"
npm run test:unit tests/integration/json-loading-flow.test.ts
echo ""

# 4. Testes E2E - Navegador
echo -e "${BLUE}🌐 4. Testes E2E - Playwright${NC}"
echo "----------------------------------------"
if command -v npx &> /dev/null; then
    npx playwright test tests/e2e/funnel-json-loading.spec.ts --reporter=list
else
    echo -e "${YELLOW}⚠️  Playwright não instalado. Pulando testes E2E.${NC}"
fi
echo ""

# Resumo
echo ""
echo -e "${GREEN}✅ ======================================"
echo "   TESTES CONCLUÍDOS COM SUCESSO!"
echo "======================================${NC}"
echo ""
echo "📊 Cobertura dos testes:"
echo "  ✓ TemplateService.getAllSteps()"
echo "  ✓ TemplateService.getStep()"
echo "  ✓ Normalização de IDs (quiz-estilo-21-steps → quiz21StepsComplete)"
echo "  ✓ Aliases do UNIFIED_TEMPLATE_REGISTRY"
echo "  ✓ Carregamento de quiz21-complete.json"
echo "  ✓ Renderização de todos os 21 steps"
echo "  ✓ Navegação entre steps"
echo "  ✓ Indicadores de progresso"
echo ""
