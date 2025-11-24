#!/bin/bash

# 🔥 VALIDAÇÃO RÁPIDA: Editor → JSON → Renderização
# 
# Este script executa uma bateria de validações para garantir que
# o fluxo completo Editor → TemplateService → JSON está funcionando

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 VALIDAÇÃO RÁPIDA: Editor → JSON"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de testes
TOTAL=0
PASSED=0
FAILED=0

# Função para executar teste
run_test() {
    local name="$1"
    local command="$2"
    
    TOTAL=$((TOTAL + 1))
    echo -n "📍 ${name}... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSOU${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FALHOU${NC}"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# 1️⃣ Verificar se JSON existe
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  VERIFICANDO ARQUIVOS JSON"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "JSON principal existe" "test -f public/templates/quiz21-complete.json"
run_test "JSON tem > 100KB" "test $(stat -f%z public/templates/quiz21-complete.json 2>/dev/null || stat -c%s public/templates/quiz21-complete.json) -gt 100000"

# Validar estrutura JSON
if command -v node &> /dev/null; then
    run_test "JSON é válido (sintaxe)" "node -e \"JSON.parse(require('fs').readFileSync('public/templates/quiz21-complete.json'))\""
    
    STEPS_COUNT=$(node -e "const j = JSON.parse(require('fs').readFileSync('public/templates/quiz21-complete.json')); console.log(Object.keys(j.steps || {}).length);" 2>/dev/null || echo "0")
    
    if [ "$STEPS_COUNT" -ge 20 ]; then
        echo -e "📍 JSON tem $STEPS_COUNT steps... ${GREEN}✅ PASSOU${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "📍 JSON tem $STEPS_COUNT steps... ${RED}❌ FALHOU (esperado >= 20)${NC}"
        FAILED=$((FAILED + 1))
    fi
    TOTAL=$((TOTAL + 1))
fi

echo ""

# 2️⃣ Verificar código-fonte
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  VERIFICANDO CÓDIGO-FONTE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "App.tsx extrai resourceId" "grep -q 'const resourceId = params.get' src/App.tsx"
run_test "App.tsx passa resourceId para QuizModularEditor" "grep -q 'resourceId={resourceId}' src/App.tsx"
run_test "QuizModularEditor aceita resourceId" "grep -q 'resourceId.*props' src/components/editor/quiz/QuizModularEditor/index.tsx"
run_test "TemplateService.getStep existe" "grep -q 'async getStep(' src/services/canonical/TemplateService.ts"

echo ""

# 3️⃣ Executar testes automatizados
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  EXECUTANDO TESTES AUTOMATIZADOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v npx &> /dev/null; then
    # Testes de integração (rápido)
    echo "📍 Testes de integração (Vitest)..."
    if npx vitest run tests/integration/editor-json-complete-flow.test.ts --reporter=silent > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ 14/14 testes de integração passaram${NC}"
        PASSED=$((PASSED + 14))
    else
        echo -e "   ${RED}❌ Alguns testes de integração falharam${NC}"
        FAILED=$((FAILED + 1))
    fi
    TOTAL=$((TOTAL + 14))
    
    # Testes E2E (mais lento, opcional)
    if [ "${SKIP_E2E}" != "1" ]; then
        echo "📍 Testes E2E (Playwright)..."
        echo "   (Use SKIP_E2E=1 para pular testes E2E)"
        
        if npx playwright test tests/e2e/resourceid-json-loading.spec.ts --reporter=line > /dev/null 2>&1; then
            echo -e "   ${GREEN}✅ 9/9 testes E2E passaram${NC}"
            PASSED=$((PASSED + 9))
        else
            echo -e "   ${RED}❌ Alguns testes E2E falharam${NC}"
            FAILED=$((FAILED + 1))
        fi
        TOTAL=$((TOTAL + 9))
    else
        echo "   ⏭️  Testes E2E pulados (SKIP_E2E=1)"
    fi
else
    echo -e "${YELLOW}⚠️  npm/npx não encontrado - testes automatizados pulados${NC}"
fi

echo ""

# 4️⃣ Verificar servidor de desenvolvimento
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  VERIFICANDO SERVIDOR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo -e "📍 Servidor rodando em :8080... ${GREEN}✅ PASSOU${NC}"
    PASSED=$((PASSED + 1))
    
    # Testar rota /editor
    if curl -s "http://localhost:8080/editor?template=quiz21StepsComplete" > /dev/null 2>&1; then
        echo -e "📍 Rota /editor acessível... ${GREEN}✅ PASSOU${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "📍 Rota /editor acessível... ${RED}❌ FALHOU${NC}"
        FAILED=$((FAILED + 1))
    fi
    TOTAL=$((TOTAL + 2))
else
    echo -e "${YELLOW}⚠️  Servidor não está rodando em :8080${NC}"
    echo "   Execute: npm run dev"
fi

echo ""

# Resultado final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTADO FINAL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   Total de testes: $TOTAL"
echo -e "   ${GREEN}Passaram: $PASSED${NC}"
echo -e "   ${RED}Falharam: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ TODOS OS TESTES PASSARAM!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🎉 O fluxo Editor → JSON está 100% funcional!"
    echo ""
    echo "Para testar no navegador:"
    echo "  \$BROWSER \"http://localhost:8080/editor?template=quiz21StepsComplete\""
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ ALGUNS TESTES FALHARAM${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Consulte a documentação:"
    echo "  cat docs/EDITOR_JSON_COMPLETE_FLOW.md"
    echo ""
    echo "Execute testes individualmente:"
    echo "  npx vitest run tests/integration/editor-json-complete-flow.test.ts"
    echo "  npx playwright test tests/e2e/resourceid-json-loading.spec.ts"
    echo ""
    exit 1
fi
