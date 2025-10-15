#!/bin/bash

# 🔍 Script de Verificação - Comportamento de Produção no Preview
# Este script verifica se os componentes têm as regras de validação e auto-avanço

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   VERIFICAÇÃO: Comportamento de Produção no Preview         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0

# ============================================================================
# TESTE 1: Validação de Seleções em QuestionStep
# ============================================================================

echo "📋 TESTE 1: Validação de Seleções"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se QuestionStep tem validação de mínimo de seleções
if grep -q "minSelections\|selections\.length.*3\|requiredSelections.*3" src/components/quiz/QuestionStep.tsx; then
    echo -e "${GREEN}✅ QuestionStep tem validação de seleções${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ QuestionStep NÃO tem validação de seleções${NC}"
    ((FAILED++))
fi

# Verificar se há disabled no botão baseado em validação
if grep -q "disabled.*selection\|isDisabled\|canContinue" src/components/quiz/QuestionStep.tsx; then
    echo -e "${GREEN}✅ Botão de continuar tem lógica de disabled${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Botão pode não estar desabilitado quando inválido${NC}"
fi

echo ""

# ============================================================================
# TESTE 2: Auto-Avanço em QuestionStep
# ============================================================================

echo "📋 TESTE 2: Auto-Avanço em Perguntas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se QuestionStep tem auto-avanço
if grep -q "autoAdvance\|handleNext\|useEffect.*selections" src/components/quiz/QuestionStep.tsx; then
    echo -e "${GREEN}✅ QuestionStep tem lógica de auto-avanço${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ QuestionStep NÃO tem auto-avanço${NC}"
    ((FAILED++))
fi

echo ""

# ============================================================================
# TESTE 3: Auto-Avanço em TransitionStep
# ============================================================================

echo "📋 TESTE 3: Auto-Avanço em Transições"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se TransitionStep tem auto-avanço com timer
if grep -q "setTimeout\|useEffect.*timer\|autoAdvance" src/components/quiz/TransitionStep.tsx; then
    echo -e "${GREEN}✅ TransitionStep tem auto-avanço automático${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ TransitionStep NÃO tem auto-avanço${NC}"
    ((FAILED++))
fi

# Verificar delay do timer
if grep -E "setTimeout.*[0-9]{4}" src/components/quiz/TransitionStep.tsx; then
    DELAY=$(grep -oP "setTimeout.*?\K[0-9]{4}" src/components/quiz/TransitionStep.tsx | head -1)
    echo -e "${GREEN}✅ Delay configurado: ${DELAY}ms${NC}"
else
    echo -e "${YELLOW}⚠️  Delay não encontrado ou menor que 1s${NC}"
fi

echo ""

# ============================================================================
# TESTE 4: Cálculo de Resultado em ResultStep
# ============================================================================

echo "📋 TESTE 4: Cálculo de Resultado"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se ResultStep acessa respostas/estado
if grep -q "responses\|answers\|quizState\|selections" src/components/quiz/ResultStep.tsx; then
    echo -e "${GREEN}✅ ResultStep acessa respostas do quiz${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ ResultStep NÃO acessa respostas${NC}"
    ((FAILED++))
fi

# Verificar se há lógica de cálculo de estilo
if grep -q "calculateStyle\|computeResult\|dominantStyle\|styleScores" src/components/quiz/ResultStep.tsx; then
    echo -e "${GREEN}✅ ResultStep tem lógica de cálculo de estilo${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Lógica de cálculo pode estar em outro lugar${NC}"
    
    # Verificar em QuizAppConnected
    if grep -q "calculateStyle\|computeResult\|dominantStyle\|styleScores" src/components/quiz/QuizAppConnected.tsx; then
        echo -e "${GREEN}✅ Cálculo encontrado em QuizAppConnected${NC}"
        ((PASSED++))
    fi
fi

echo ""

# ============================================================================
# TESTE 5: QuizAppConnected usa componentes corretos
# ============================================================================

echo "📋 TESTE 5: Componentes Corretos no QuizAppConnected"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar imports dos componentes
COMPONENTS=("IntroStep" "QuestionStep" "StrategicQuestionStep" "TransitionStep" "ResultStep" "OfferStep")

for component in "${COMPONENTS[@]}"; do
    if grep -q "import.*${component}" src/components/quiz/QuizAppConnected.tsx; then
        echo -e "${GREEN}✅ ${component} importado${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ ${component} NÃO importado${NC}"
        ((FAILED++))
    fi
done

echo ""

# ============================================================================
# TESTE 6: Editor usa wrappers corretos
# ============================================================================

echo "📋 TESTE 6: Editor usa Wrappers Corretos"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se EditableIntroStep importa IntroStep original
if grep -q "from.*quiz/IntroStep\|from.*'\.\./.*/IntroStep'" src/components/editor/editable-steps/EditableIntroStep.tsx; then
    echo -e "${GREEN}✅ EditableIntroStep importa IntroStep original${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ EditableIntroStep NÃO importa componente original${NC}"
    ((FAILED++))
fi

echo ""

# ============================================================================
# RESULTADO FINAL
# ============================================================================

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    RESULTADO FINAL                           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo -e "Testes Passados: ${GREEN}${PASSED}${NC}"
echo -e "Testes Falhados: ${RED}${FAILED}${NC}"
echo -e "Total: ${TOTAL}"
echo -e "Taxa de Sucesso: ${PERCENTAGE}%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ TODOS OS TESTES PASSARAM!                         ║${NC}"
    echo -e "${GREEN}║  Preview deve ter comportamento de produção.          ║${NC}"
    echo -e "${GREEN}║  Prossiga com os testes manuais do GUIA_TESTE_PREVIEW.md ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    exit 0
elif [ $PERCENTAGE -ge 70 ]; then
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠️  ALGUNS TESTES FALHARAM                           ║${NC}"
    echo -e "${YELLOW}║  Sistema pode funcionar mas com limitações.           ║${NC}"
    echo -e "${YELLOW}║  Teste manualmente e reporte problemas encontrados.   ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
    exit 1
else
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ MUITOS TESTES FALHARAM                            ║${NC}"
    echo -e "${RED}║  Preview pode não ter comportamento de produção.      ║${NC}"
    echo -e "${RED}║  Revise os componentes antes de testar.               ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    exit 2
fi
