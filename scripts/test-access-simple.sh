#!/bin/bash

###############################################################################
# 🧪 TESTE RÁPIDO DE ACESSO - Quiz Flow Pro
###############################################################################

PORT="${1:-8080}"
BASE="http://localhost:${PORT}"

echo "🚀 TESTANDO ACESSO - Porta $PORT"
echo "════════════════════════════════════════"
echo ""

# Cores
G='\033[0;32m'
R='\033[0;31m'
Y='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

test_url() {
    local url="$1"
    local name="$2"
    local code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$code" = "200" ]; then
        echo -e "${G}✓${NC} $name - HTTP $code"
        ((PASS++))
    else
        echo -e "${R}✗${NC} $name - HTTP $code"
        ((FAIL++))
    fi
}

# Testes principais
test_url "$BASE/" "Página inicial"
test_url "$BASE/editor" "Editor (sem parâmetros)"
test_url "$BASE/editor?funnelId=quiz21StepsComplete" "Editor com funnel"
test_url "$BASE/editor?funnelId=quiz21StepsComplete&step=1" "Editor step 1"
test_url "$BASE/editor?funnelId=quiz21StepsComplete&step=10" "Editor step 10"
test_url "$BASE/editor?funnelId=quiz21StepsComplete&step=21" "Editor step 21"

echo ""
echo "════════════════════════════════════════"
echo -e "Passou: ${G}$PASS${NC} | Falhou: ${R}$FAIL${NC}"

if [ $FAIL -eq 0 ]; then
    echo -e "${G}✓ TODOS OS TESTES PASSARAM!${NC}"
    echo ""
    echo "📍 URLs disponíveis:"
    echo "   • Home: $BASE/"
    echo "   • Editor: $BASE/editor?funnelId=quiz21StepsComplete"
    echo "   • Step específico: $BASE/editor?funnelId=quiz21StepsComplete&step=1"
    exit 0
else
    echo -e "${R}✗ Alguns testes falharam${NC}"
    exit 1
fi
