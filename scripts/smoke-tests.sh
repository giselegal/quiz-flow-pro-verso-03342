#!/bin/bash

# 🧪 SMOKE TESTS - VALIDAÇÃO PÓS-DEPLOY
# Executa testes básicos para validar deploy em staging

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 SMOKE TESTS - STAGING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# URL de staging (atualize após deploy)
STAGING_URL="${STAGING_URL:-http://localhost:5173}"

echo "🎯 Testando URL: $STAGING_URL"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de resultados
PASSED=0
FAILED=0
WARNINGS=0

# Função para testar endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $name... "
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $HTTP_CODE)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $HTTP_CODE, expected $expected_status)"
        FAILED=$((FAILED + 1))
    fi
}

# Função para verificar conteúdo
test_content() {
    local name=$1
    local url=$2
    local search_string=$3
    
    echo -n "Testing $name... "
    
    CONTENT=$(curl -s "$url" 2>/dev/null || echo "")
    
    if echo "$CONTENT" | grep -q "$search_string"; then
        echo -e "${GREEN}✅ PASS${NC} (found '$search_string')"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC} (missing '$search_string')"
        FAILED=$((FAILED + 1))
    fi
}

# ═══════════════════════════════════════════════════════════════
# [1/6] Homepage
# ═══════════════════════════════════════════════════════════════
echo "[1/6] Homepage Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Homepage" "$STAGING_URL/" 200
test_content "Index HTML" "$STAGING_URL/" "<!DOCTYPE html>"
test_content "Vite build" "$STAGING_URL/" "type=\"module\""

echo ""

# ═══════════════════════════════════════════════════════════════
# [2/6] Auth Routes
# ═══════════════════════════════════════════════════════════════
echo "[2/6] Auth Route Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Auth page" "$STAGING_URL/auth" 200
test_endpoint "Auth callback" "$STAGING_URL/auth/callback" 200

echo ""

# ═══════════════════════════════════════════════════════════════
# [3/6] Editor Routes
# ═══════════════════════════════════════════════════════════════
echo "[3/6] Editor Route Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Editor main" "$STAGING_URL/editor" 200
test_endpoint "Editor page 1" "$STAGING_URL/editor/1" 200
test_endpoint "Editor page 21" "$STAGING_URL/editor/21" 200

echo ""

# ═══════════════════════════════════════════════════════════════
# [4/6] Quiz Routes
# ═══════════════════════════════════════════════════════════════
echo "[4/6] Quiz Route Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Quiz main" "$STAGING_URL/quiz" 200
test_endpoint "Quiz integrated" "$STAGING_URL/quiz-integrated" 200

echo ""

# ═══════════════════════════════════════════════════════════════
# [5/6] Admin Routes
# ═══════════════════════════════════════════════════════════════
echo "[5/6] Admin Route Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Admin main" "$STAGING_URL/admin" 200
test_endpoint "Dashboard redirect" "$STAGING_URL/admin/dashboard" 200

echo ""

# ═══════════════════════════════════════════════════════════════
# [6/6] Static Assets
# ═══════════════════════════════════════════════════════════════
echo "[6/6] Static Assets Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Pegar URL do primeiro JS do index.html
JS_FILE=$(curl -s "$STAGING_URL/" | grep -oP '(?<=src=")[^"]*\.js' | head -1)
if [ -n "$JS_FILE" ]; then
    test_endpoint "JavaScript bundle" "$STAGING_URL/$JS_FILE" 200
else
    echo -e "${YELLOW}⚠️  SKIP${NC} (JavaScript bundle not found in HTML)"
    WARNINGS=$((WARNINGS + 1))
fi

# Pegar URL do primeiro CSS do index.html
CSS_FILE=$(curl -s "$STAGING_URL/" | grep -oP '(?<=href=")[^"]*\.css' | head -1)
if [ -n "$CSS_FILE" ]; then
    test_endpoint "CSS bundle" "$STAGING_URL/$CSS_FILE" 200
else
    echo -e "${YELLOW}⚠️  SKIP${NC} (CSS bundle not found in HTML)"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESULTADOS FINAIS
# ═══════════════════════════════════════════════════════════════
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTADOS DOS SMOKE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED * 100) / TOTAL ))
    echo "Success Rate: $SUCCESS_RATE%"
fi
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ SMOKE TESTS FAILED${NC}"
    echo ""
    echo "Verifique:"
    echo "1. RLS policies aplicadas no Supabase"
    echo "2. Auth URLs configuradas corretamente"
    echo "3. Variáveis de ambiente definidas"
    echo "4. Build deployado corretamente"
    exit 1
else
    echo -e "${GREEN}✅ ALL SMOKE TESTS PASSED${NC}"
    echo ""
    echo "🎉 Deploy validado com sucesso!"
    echo ""
    echo "Próximos passos:"
    echo "1. Teste manualmente as funcionalidades principais"
    echo "2. Compartilhe URL com stakeholders"
    echo "3. Execute testes E2E completos (FASE 3)"
    exit 0
fi
