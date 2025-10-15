#!/bin/bash

# 🚀 SCRIPT FINAL DE VALIDAÇÃO CANVAS-PREVIEW SYNC
# Execute: ./validate-canvas-preview-sync.sh

echo "🚀 VALIDAÇÃO FINAL - Sistema Canvas ↔ Preview Sync"
echo "=================================================="

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de resultados
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Função para adicionar resultado
add_result() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ "$1" = "PASS" ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo -e "✅ ${GREEN}PASS${NC}: $2"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo -e "❌ ${RED}FAIL${NC}: $2"
    fi
}

echo ""
echo -e "${BLUE}1. Verificando estrutura de arquivos...${NC}"

# Verificar arquivos essenciais
if [ -f "src/tests/canvasPreviewSync.test.ts" ]; then
    add_result "PASS" "Teste de sincronização existe"
else
    add_result "FAIL" "Teste de sincronização não encontrado"
fi

if [ -f "src/components/diagnostics/CanvasPreviewSyncDiagnostic.tsx" ]; then
    add_result "PASS" "Componente de diagnóstico existe"
else
    add_result "FAIL" "Componente de diagnóstico não encontrado"
fi

if [ -f "src/components/diagnostics/SyncDiagnosticIntegration.tsx" ]; then
    add_result "PASS" "Integração de diagnóstico existe"
else
    add_result "FAIL" "Integração de diagnóstico não encontrada"
fi

if [ -f "public/test-canvas-preview-sync.js" ]; then
    add_result "PASS" "Script de teste no navegador existe"
else
    add_result "FAIL" "Script de teste no navegador não encontrado"
fi

echo ""
echo -e "${BLUE}2. Executando testes unitários...${NC}"

# Executar teste de sincronização
TEST_OUTPUT=$(npx vitest run src/tests/canvasPreviewSync.test.ts --reporter=json 2>&1)
if echo "$TEST_OUTPUT" | grep -q '"success":true'; then
    VITEST_PASSED=$(echo "$TEST_OUTPUT" | grep -o '"numPassedTests":[0-9]*' | grep -o '[0-9]*')
    add_result "PASS" "Testes Vitest: $VITEST_PASSED testes passaram"
else
    add_result "FAIL" "Testes Vitest falharam"
fi

echo ""
echo -e "${BLUE}3. Verificando compilação TypeScript...${NC}"

# Verificar compilação
COMPILE_OUTPUT=$(npx tsc --noEmit --project . 2>&1)
if [ $? -eq 0 ]; then
    add_result "PASS" "Compilação TypeScript sem erros"
else
    ERROR_COUNT=$(echo "$COMPILE_OUTPUT" | grep -c "error TS")
    add_result "FAIL" "Compilação TypeScript: $ERROR_COUNT erros encontrados"
fi

echo ""
echo -e "${BLUE}4. Verificando servidor de desenvolvimento...${NC}"

# Verificar se o servidor responde
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null)
if [ "$HTTP_STATUS" = "200" ]; then
    add_result "PASS" "Servidor de desenvolvimento rodando (HTTP 200)"
else
    add_result "FAIL" "Servidor de desenvolvimento não responde (HTTP $HTTP_STATUS)"
fi

echo ""
echo -e "${BLUE}5. Verificando integração no App.tsx...${NC}"

# Verificar se diagnóstico está integrado
if grep -q "withSyncDiagnostic" src/App.tsx; then
    add_result "PASS" "Diagnóstico integrado no App.tsx"
else
    add_result "FAIL" "Diagnóstico não integrado no App.tsx"
fi

if grep -q "SyncDiagnosticIntegration" src/App.tsx; then
    add_result "PASS" "Import de diagnóstico encontrado"
else
    add_result "FAIL" "Import de diagnóstico não encontrado"
fi

echo ""
echo -e "${BLUE}6. Verificando assets públicos...${NC}"

# Verificar se script está referenciado no HTML
if grep -q "test-canvas-preview-sync.js" index.html; then
    add_result "PASS" "Script de teste referenciado no HTML"
else
    add_result "FAIL" "Script de teste não referenciado no HTML"
fi

echo ""
echo "=================================================="
echo -e "${BLUE}📊 RESULTADO FINAL${NC}"
echo "=================================================="

SUCCESS_RATE=$(echo "scale=1; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc -l 2>/dev/null || echo "0")

echo -e "✅ Testes Passaram: ${GREEN}$PASSED_TESTS${NC}/$TOTAL_TESTS"
echo -e "❌ Testes Falharam: ${RED}$FAILED_TESTS${NC}/$TOTAL_TESTS"
echo -e "📈 Taxa de Sucesso: ${GREEN}$SUCCESS_RATE%${NC}"

echo ""
if [ "$FAILED_TESTS" -eq 0 ]; then
    echo -e "🎉 ${GREEN}SUCESSO TOTAL!${NC} Sistema Canvas ↔ Preview Sync 100% implementado!"
    echo ""
    echo -e "${YELLOW}💻 COMO TESTAR NO NAVEGADOR:${NC}"
    echo "1. Abra http://localhost:5173"
    echo "2. Abra DevTools (F12)"
    echo "3. Execute: testCanvasPreviewSync()"
    echo "4. Ou pressione: Ctrl+Shift+D para abrir diagnóstico visual"
    echo ""
    echo -e "${YELLOW}🔄 MONITORAMENTO CONTÍNUO:${NC}"
    echo "Execute no console: startSyncDiagnostic()"
    echo ""
    exit 0
else
    echo -e "⚠️ ${YELLOW}ATENÇÃO:${NC} $FAILED_TESTS testes falharam. Verifique os itens acima."
    echo ""
    echo -e "${YELLOW}🔧 PRÓXIMOS PASSOS:${NC}"
    if [ "$HTTP_STATUS" != "200" ]; then
        echo "- Iniciar servidor: npm run dev"
    fi
    echo "- Corrigir erros de compilação se existirem"
    echo "- Verificar integração dos componentes"
    echo ""
    exit 1
fi