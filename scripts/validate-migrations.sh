#!/bin/bash
##############################################################################
# Script: Validação de Migrations Corrigidas
# Data: 2025-11-28
# Descrição: Valida se todas as correções foram aplicadas corretamente
##############################################################################

echo "🔍 VALIDAÇÃO DE MIGRATIONS CORRIGIDAS"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Validação 1: Verificar se user_id não está sendo usado diretamente em quiz_sessions
echo "1️⃣  Verificando quiz_sessions..."
if grep -q "auth.uid()::text = user_id" supabase/migrations/20251110_auth_hardening_rls.sql 2>/dev/null; then
    echo -e "   ${RED}❌ ERRO: quiz_sessions ainda usa user_id diretamente${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "   ${GREEN}✅ OK: quiz_sessions usa relação via funnels${NC}"
fi

# Validação 2: Verificar se status não está sendo usado em funnels
echo "2️⃣  Verificando funnels.status..."
if grep -q "funnels.status" supabase/migrations/20251110_auth_hardening_rls.sql 2>/dev/null; then
    echo -e "   ${RED}❌ ERRO: Ainda há referência a funnels.status${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "   ${GREEN}✅ OK: Usa funnels.is_published${NC}"
fi

# Validação 3: Verificar constraint em security_enhancements
echo "3️⃣  Verificando constraint em funnels..."
if grep -q "funnels_valid_status" supabase/migrations/20251128_security_enhancements.sql 2>/dev/null; then
    echo -e "   ${RED}❌ ERRO: Constraint funnels_valid_status ainda existe${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "   ${GREEN}✅ OK: Usa funnels_valid_published${NC}"
fi

# Validação 4: Verificar se nova migration foi criada
echo "4️⃣  Verificando migration de drafts..."
if [ -f "supabase/migrations/20251128_fix_drafts_integration.sql" ]; then
    echo -e "   ${GREEN}✅ OK: Migration de drafts criada${NC}"
else
    echo -e "   ${RED}❌ ERRO: Migration de drafts não encontrada${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Validação 5: Verificar DELETE policy em quiz_drafts
echo "5️⃣  Verificando DELETE policy em quiz_drafts..."
if grep -q "quiz_drafts_delete_policy" supabase/migrations/20251128_fix_drafts_integration.sql 2>/dev/null; then
    echo -e "   ${GREEN}✅ OK: DELETE policy presente${NC}"
else
    echo -e "   ${RED}❌ ERRO: DELETE policy não encontrada${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Validação 6: Verificar função publish_quiz_draft
echo "6️⃣  Verificando função RPC publish_quiz_draft..."
if grep -q "CREATE OR REPLACE FUNCTION publish_quiz_draft" supabase/migrations/20251128_fix_drafts_integration.sql 2>/dev/null; then
    echo -e "   ${GREEN}✅ OK: Função RPC presente${NC}"
else
    echo -e "   ${RED}❌ ERRO: Função RPC não encontrada${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ TODAS AS VALIDAÇÕES PASSARAM!${NC}"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Acesse: https://pwtjuuhchtbzttrzoutw.supabase.co"
    echo "   2. SQL Editor → New Query"
    echo "   3. Execute as migrations na ordem:"
    echo "      a) 20251110_auth_hardening_rls.sql"
    echo "      b) 20251128_security_enhancements.sql"
    echo "      c) 20251128_fix_drafts_integration.sql"
    echo ""
    exit 0
else
    echo -e "${RED}❌ $ERRORS ERRO(S) ENCONTRADO(S)${NC}"
    echo ""
    echo "Por favor, revise as migrations antes de aplicar."
    exit 1
fi
