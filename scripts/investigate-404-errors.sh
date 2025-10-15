#!/bin/bash

# Script para identificar a causa dos erros 404 no preview
# Data: 15 de outubro de 2025

echo "🔍 ======================================"
echo "   INVESTIGANDO ERROS 404"
echo "========================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Análise dos Erros 404:${NC}"
echo "-------------------------------------------"
echo ""
echo "Erro 1: pwtjuuhchtbzttrzoutw…ete-1760491377394"
echo "  → Parece ser um ID de funnel do Supabase"
echo "  → Formato: [funnel-id]-[timestamp]"
echo ""
echo "Erro 2: pwtjuuhchtbzttrzoutw…d_at.desc&limit=1"
echo "  → Parece ser uma query do Supabase"
echo "  → created_at.desc&limit=1 → buscando último registro"
echo ""

echo -e "${BLUE}📋 Procurando por chamadas ao Supabase:${NC}"
echo "-------------------------------------------"

# Procurar por chamadas ao Supabase no código
echo "Procurando 'from(' ou 'select(' (métodos do Supabase)..."
SUPABASE_CALLS=$(grep -rn "\.from\(.*\)\.select\|supabase.*from" src/components/editor/quiz/ 2>/dev/null | wc -l)

if [ "$SUPABASE_CALLS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️${NC}  Encontradas $SUPABASE_CALLS possíveis chamadas ao Supabase no editor"
    echo ""
    echo "Exemplos:"
    grep -rn "\.from\(.*\)\.select\|supabase.*from" src/components/editor/quiz/ 2>/dev/null | head -3
else
    echo -e "${GREEN}✅${NC} Nenhuma chamada direta ao Supabase encontrada no editor"
fi

echo ""
echo -e "${BLUE}📋 Procurando por fetch/axios:${NC}"
echo "-------------------------------------------"

# Procurar por fetch
FETCH_CALLS=$(grep -rn "fetch\(" src/components/editor/quiz/ 2>/dev/null | grep -v "// " | wc -l)
echo "Chamadas fetch(): $FETCH_CALLS"

if [ "$FETCH_CALLS" -gt 0 ]; then
    echo "Exemplos:"
    grep -rn "fetch\(" src/components/editor/quiz/ 2>/dev/null | grep -v "// " | head -3
fi

echo ""

# Procurar por axios
AXIOS_CALLS=$(grep -rn "axios\." src/components/editor/quiz/ 2>/dev/null | wc -l)
echo "Chamadas axios: $AXIOS_CALLS"

if [ "$AXIOS_CALLS" -gt 0 ]; then
    echo "Exemplos:"
    grep -rn "axios\." src/components/editor/quiz/ 2>/dev/null | head -3
fi

echo ""
echo -e "${BLUE}📋 Verificando ConfigurationAPI:${NC}"
echo "-------------------------------------------"

CONFIG_API="src/services/ConfigurationAPI.ts"

if [ -f "$CONFIG_API" ]; then
    echo -e "${GREEN}✅${NC} ConfigurationAPI encontrado"
    
    # Verificar se faz chamadas HTTP
    if grep -q "fetch\|axios\|http" "$CONFIG_API"; then
        echo -e "${YELLOW}⚠️${NC}  ConfigurationAPI faz chamadas HTTP"
        echo ""
        echo "URLs encontradas:"
        grep -n "http\|fetch\|axios" "$CONFIG_API" | head -5
    else
        echo -e "${GREEN}✅${NC} ConfigurationAPI não faz chamadas HTTP diretas"
    fi
fi

echo ""
echo -e "${BLUE}📋 Procurando por IDs de funnel:${NC}"
echo "-------------------------------------------"

# O ID do erro: pwtjuuhchtbzttrzoutw
FUNNEL_ID_PATTERN="pwtjuuhchtbzttrzoutw"

if grep -rq "$FUNNEL_ID_PATTERN" src/ 2>/dev/null; then
    echo -e "${YELLOW}⚠️${NC}  ID de funnel hardcoded encontrado no código"
    grep -rn "$FUNNEL_ID_PATTERN" src/ 2>/dev/null
else
    echo -e "${GREEN}✅${NC} Nenhum ID de funnel hardcoded"
fi

echo ""
echo "======================================"
echo "   DIAGNÓSTICO"
echo "======================================"
echo ""

echo "Os erros 404 indicam que:"
echo ""
echo "1. O código está tentando buscar um funnel pelo ID"
echo "2. Esse funnel não existe no Supabase (404)"
echo "3. A busca inclui 'created_at.desc&limit=1'"
echo ""
echo -e "${BLUE}Possíveis Causas:${NC}"
echo ""
echo "A. Preview tentando carregar dados do funnel"
echo "   → Solução: Usar dados mock/locais no editor"
echo ""
echo "B. ConfigurationAPI tentando buscar no Supabase"
echo "   → Solução: Fallback para defaults se 404"
echo ""
echo "C. QuizAppConnected tentando carregar configurações"
echo "   → Solução: Modo editor não deve depender do Supabase"
echo ""

echo -e "${GREEN}Recomendações:${NC}"
echo ""
echo "1. Adicionar interceptor de erros 404"
echo "2. Usar dados locais no modo editor"
echo "3. Implementar fallback para configurações"
echo "4. Adicionar flag 'editorMode' que bypassa Supabase"
echo ""

echo "✅ Análise concluída!"
