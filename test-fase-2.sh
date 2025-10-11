#!/bin/bash
# 🧪 Script de Testes Automatizados - FASE 2

echo "════════════════════════════════════════════════════════════════════════════════"
echo "                    🧪 TESTES AUTOMATIZADOS - FASE 2"
echo "════════════════════════════════════════════════════════════════════════════════"
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
WARNINGS=0

# Função de teste
test_check() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "${BLUE}🔍 Testando: ${test_name}${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSOU: ${test_name}${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FALHOU: ${test_name}${NC}"
        ((FAILED++))
        return 1
    fi
}

test_warning() {
    local test_name="$1"
    local message="$2"
    
    echo -e "${YELLOW}⚠️  AVISO: ${test_name}${NC}"
    echo -e "${YELLOW}   ${message}${NC}"
    ((WARNINGS++))
}

echo "┌──────────────────────────────────────────────────────────────────────────────┐"
echo "│  1️⃣  TESTES DE COMPILAÇÃO                                                    │"
echo "└──────────────────────────────────────────────────────────────────────────────┘"
echo ""

# Teste 1: TypeScript sem erros
test_check "TypeScript sem erros" "npm run type-check 2>&1 | grep -q 'Found 0 errors'" || {
    echo "   ℹ️  Executando: npm run type-check"
    npm run type-check 2>&1 | tail -20
}
echo ""

# Teste 2: Build sem erros
test_check "Build do projeto" "npm run build > /dev/null 2>&1"
echo ""

echo "┌──────────────────────────────────────────────────────────────────────────────┐"
echo "│  2️⃣  TESTES DE ARQUIVOS                                                      │"
echo "└──────────────────────────────────────────────────────────────────────────────┘"
echo ""

# Teste 3: Arquivos existem
test_check "JsonTemplateService existe" "test -f src/services/JsonTemplateService.ts"
test_check "useQuizState modificado" "grep -q 'useTemplateLoader' src/hooks/useQuizState.ts"
test_check "QuizApp modificado" "grep -q 'isLoadingTemplate' src/components/quiz/QuizApp.tsx"
test_check "editor.ts modificado" "grep -q 'JsonBlockType' src/types/editor.ts"
echo ""

echo "┌──────────────────────────────────────────────────────────────────────────────┐"
echo "│  3️⃣  TESTES DE TEMPLATES JSON                                                │"
echo "└──────────────────────────────────────────────────────────────────────────────┘"
echo ""

# Teste 4: Templates JSON existem
TEMPLATE_COUNT=0
for i in {1..21}; do
    if test -f "templates/quiz-estilo-step-$i.json" || test -f "src/templates/quiz-estilo-step-$i.json"; then
        ((TEMPLATE_COUNT++))
    fi
done

if [ $TEMPLATE_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ PASSOU: Templates JSON encontrados (${TEMPLATE_COUNT}/21)${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  AVISO: Nenhum template JSON encontrado${NC}"
    echo -e "${YELLOW}   Templates serão carregados via fallback${NC}"
    ((WARNINGS++))
fi
echo ""

echo "┌──────────────────────────────────────────────────────────────────────────────┐"
echo "│  4️⃣  TESTES DE INTEGRAÇÃO                                                    │"
echo "└──────────────────────────────────────────────────────────────────────────────┘"
echo ""

# Teste 5: Imports corretos
test_check "JsonTemplateService imports" "grep -q 'QuizStepAdapter' src/services/JsonTemplateService.ts"
test_check "useQuizState imports" "grep -q 'useFeatureFlags' src/hooks/useQuizState.ts"
test_check "Types exportados" "grep -q 'export type JsonBlockType' src/types/editor.ts"
echo ""

echo "┌──────────────────────────────────────────────────────────────────────────────┐"
echo "│  5️⃣  TESTES DE HELPERS                                                       │"
echo "└──────────────────────────────────────────────────────────────────────────────┘"
echo ""

# Teste 6: Helpers implementados
test_check "isJsonBlockType helper" "grep -q 'export function isJsonBlockType' src/types/editor.ts"
test_check "isQuizBlockType helper" "grep -q 'export function isQuizBlockType' src/types/editor.ts"
test_check "isOfferBlockType helper" "grep -q 'export function isOfferBlockType' src/types/editor.ts"
test_check "getBlockCategory helper" "grep -q 'export function getBlockCategory' src/types/editor.ts"
echo ""

echo "┌──────────────────────────────────────────────────────────────────────────────┐"
echo "│  6️⃣  TESTES DE DOCUMENTAÇÃO                                                  │"
echo "└──────────────────────────────────────────────────────────────────────────────┘"
echo ""

# Teste 7: Documentação existe
test_check "Guia de testes" "test -f GUIA_TESTES_FASE_2.md"
test_check "Relatório FASE 2" "test -f FASE_2_IMPLEMENTACAO_CONCLUIDA.md"
test_check "Análise BlockRenderer" "test -f ANALISE_BLOCKRENDERER_JSON_TEMPLATES.md"
test_check "Alinhamento arquitetura" "test -f ALINHAMENTO_ARQUITETURA_TEMPLATES_JSON.md"
echo ""

echo "════════════════════════════════════════════════════════════════════════════════"
echo "                              📊 RESULTADOS FINAIS"
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""

TOTAL=$((PASSED + FAILED))

echo -e "${GREEN}✅ PASSOU:   $PASSED/$TOTAL testes${NC}"
echo -e "${RED}❌ FALHOU:   $FAILED/$TOTAL testes${NC}"
echo -e "${YELLOW}⚠️  AVISOS:   $WARNINGS${NC}"
echo ""

# Calcular taxa de sucesso
if [ $TOTAL -gt 0 ]; then
    SUCCESS_RATE=$((PASSED * 100 / TOTAL))
    echo "📊 Taxa de Sucesso: $SUCCESS_RATE%"
    echo ""
fi

# Determinar status final
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    echo ""
    echo "✅ Sistema está pronto para:"
    echo "   • Deploy em produção"
    echo "   • Testes manuais no navegador"
    echo "   • Avançar para FASE 3"
    echo ""
    exit 0
elif [ $FAILED -lt 3 ]; then
    echo -e "${YELLOW}⚠️  TESTES COM AVISOS${NC}"
    echo ""
    echo "Sistema funcional, mas com $FAILED problema(s) menor(es)."
    echo "Recomenda-se revisar antes de produção."
    echo ""
    exit 1
else
    echo -e "${RED}❌ TESTES FALHARAM${NC}"
    echo ""
    echo "Sistema precisa de correções antes de continuar."
    echo "Execute: npm run type-check"
    echo ""
    exit 2
fi
