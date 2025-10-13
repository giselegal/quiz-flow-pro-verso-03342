#!/bin/bash

# 🧪 Script de Execução de Testes do Editor
# Executa a suíte completa de testes para validar a correção do hook condicional

set -e

echo "🚀 Iniciando Testes do Editor Quiz..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para executar testes com feedback
run_test_suite() {
    local name=$1
    local path=$2
    local test_count=$3
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📋 $name${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "Caminho: $path"
    echo "Testes esperados: $test_count"
    echo ""
    
    if npx vitest run "$path" --reporter=verbose; then
        echo -e "${GREEN}✅ $name - PASSOU${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}❌ $name - FALHOU${NC}"
        echo ""
        return 1
    fi
}

# Contador de resultados
PASSED=0
FAILED=0
TOTAL=3

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  SUÍTE DE TESTES - EDITOR QUIZ         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# 1. Testes de Hooks (CanvasArea)
if run_test_suite \
    "Testes de Hooks - CanvasArea" \
    "src/components/editor/quiz/components/__tests__/CanvasArea.hooks.test.tsx" \
    "25"; then
    ((PASSED++))
else
    ((FAILED++))
fi

# 2. Testes do Hook useVirtualBlocks
if run_test_suite \
    "Testes do Hook useVirtualBlocks" \
    "src/components/editor/quiz/hooks/__tests__/useVirtualBlocks.test.ts" \
    "35"; then
    ((PASSED++))
else
    ((FAILED++))
fi

# 3. Testes de Integração
if run_test_suite \
    "Testes de Integração - Editor Completo" \
    "src/components/editor/quiz/__tests__/QuizEditor.integration.test.tsx" \
    "17"; then
    ((PASSED++))
else
    ((FAILED++))
fi

# Resumo Final
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 RESUMO DOS RESULTADOS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Total de Suítes: $TOTAL"
echo -e "Passaram: ${GREEN}$PASSED${NC}"
echo -e "Falharam: ${RED}$FAILED${NC}"
echo ""

# Taxa de sucesso
if [ $FAILED -eq 0 ]; then
    SUCCESS_RATE=100
else
    SUCCESS_RATE=$((PASSED * 100 / TOTAL))
fi

echo "Taxa de Sucesso: $SUCCESS_RATE%"
echo ""

# Status Final
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ TODOS OS TESTES PASSARAM!          ║${NC}"
    echo -e "${GREEN}║                                        ║${NC}"
    echo -e "${GREEN}║  Editor validado e pronto para uso!    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo "Próximos passos:"
    echo "  1. Executar testes manuais (GUIA_TESTES_MANUAIS_EDITOR.md)"
    echo "  2. Verificar editor no browser"
    echo "  3. Commit das mudanças"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ ALGUNS TESTES FALHARAM             ║${NC}"
    echo -e "${RED}║                                        ║${NC}"
    echo -e "${RED}║  Revisar falhas e corrigir código      ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo "Para debugar:"
    echo "  1. Executar testes individuais: npx vitest run <path>"
    echo "  2. Modo watch: npx vitest <path> --watch"
    echo "  3. UI interativa: npm run test:ui"
    echo "  4. Consultar: CORRECAO_HOOK_CONDICIONAL_VALIDACAO_FINAL.md"
    exit 1
fi
