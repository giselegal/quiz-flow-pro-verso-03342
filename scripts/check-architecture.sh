#!/bin/bash

# 📊 Script de Verificação de Arquitetura
# Monitora progresso da migração V1 → V2 e identifica problemas

set -e

WORKSPACE="/workspaces/quiz-flow-pro-verso-03342"
cd "$WORKSPACE"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  📊 VERIFICAÇÃO DE ARQUITETURA - Providers V1 vs V2          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

compare_lt() {
  awk -v left="$1" -v right="$2" 'BEGIN {exit !(left < right)}'
}

# 1. Contar imports de V1
echo "🔍 Analisando imports de SuperUnifiedProvider V1..."
V1_COUNT=$(grep -r "from.*@/contexts/providers/SuperUnifiedProvider['\"]" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v ".test." | grep -v ".spec." | wc -l || echo "0")
echo -e "${BLUE}V1 (monolítico):${NC} $V1_COUNT arquivos"

# 2. Contar imports de V2
echo "🔍 Analisando imports de SuperUnifiedProviderV2..."
V2_COUNT=$(grep -r "from.*SuperUnifiedProviderV2" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")
echo -e "${BLUE}V2 (modular):${NC} $V2_COUNT arquivos"

# 3. Calcular progresso
TOTAL=$((V1_COUNT + V2_COUNT))
if [ $TOTAL -gt 0 ]; then
  PROGRESS=$(awk "BEGIN {printf \"%.1f\", ($V2_COUNT / $TOTAL) * 100}")
else
  PROGRESS=0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📈 Progresso de Migração: $PROGRESS%${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 4. Status visual
if compare_lt "$PROGRESS" 10; then
  echo -e "${RED}█${NC}░░░░░░░░░░ $PROGRESS%"
  STATUS="${RED}🔴 MIGRAÇÃO NÃO INICIADA${NC}"
elif compare_lt "$PROGRESS" 30; then
  echo -e "${RED}███${NC}░░░░░░░ $PROGRESS%"
  STATUS="${RED}🔴 INÍCIO DA MIGRAÇÃO${NC}"
elif compare_lt "$PROGRESS" 70; then
  echo -e "${YELLOW}█████${NC}░░░░░ $PROGRESS%"
  STATUS="${YELLOW}🟡 MIGRAÇÃO EM ANDAMENTO${NC}"
elif compare_lt "$PROGRESS" 100; then
  echo -e "${YELLOW}████████${NC}░░ $PROGRESS%"
  STATUS="${YELLOW}🟡 QUASE COMPLETO${NC}"
else
  echo -e "${GREEN}██████████${NC} $PROGRESS%"
  STATUS="${GREEN}✅ MIGRAÇÃO COMPLETA${NC}"
fi

echo ""
echo -e "Status: $STATUS"
echo ""

# 5. Verificar providers órfãos
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Verificando Providers Órfãos (criados mas não usados)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

declare -A PROVIDERS=(
  ["AuthProvider modular"]="@/contexts/auth/AuthProvider"
  ["ThemeProvider modular"]="@/contexts/theme/ThemeProvider"
  ["EditorStateProvider"]="@/contexts/editor/EditorStateProvider"
  ["FunnelDataProvider"]="@/contexts/funnel/FunnelDataProvider"
  ["NavigationProvider"]="@/contexts/navigation/NavigationProvider"
  ["QuizStateProvider"]="@/contexts/quiz/QuizStateProvider"
  ["ResultProvider"]="@/contexts/result/ResultProvider"
  ["StorageProvider modular"]="@/contexts/storage/StorageProvider"
  ["SyncProvider"]="@/contexts/sync/SyncProvider"
  ["ValidationProvider modular"]="@/contexts/validation/ValidationProvider"
  ["CollaborationProvider"]="@/contexts/collaboration/CollaborationProvider"
  ["VersioningProvider"]="@/contexts/versioning/VersioningProvider"
)

ORPHAN_COUNT=0
for name in "${!PROVIDERS[@]}"; do
  path="${PROVIDERS[$name]}"
  count=$(grep -r "from ['\"]${path}['\"]" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v ".test." | grep -v ".spec." | wc -l || echo "0")
  
  if [ "$count" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $name:${NC} 0 imports (órfão)"
    ((ORPHAN_COUNT++))
  else
    echo -e "${GREEN}✓${NC} $name: $count imports"
  fi
done

echo ""
echo -e "${YELLOW}Total de providers órfãos: $ORPHAN_COUNT/12${NC}"
echo ""

# 6. Verificar providers legados ainda em uso
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Verificando Providers Legados (a deprecar)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LEGACY_AUTH=$(grep -r "from.*@/contexts/auth/AuthContext" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v ".test." | wc -l || echo "0")
LEGACY_THEME=$(grep -r "from.*@/contexts/ui/ThemeContext" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v ".test." | wc -l || echo "0")
LEGACY_VALIDATION=$(grep -r "from.*@/contexts/validation/ValidationContext" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v ".test." | wc -l || echo "0")

echo -e "${BLUE}AuthContext (legado):${NC} $LEGACY_AUTH imports"
echo -e "${BLUE}ThemeContext (legado):${NC} $LEGACY_THEME imports"
echo -e "${BLUE}ValidationContext (legado):${NC} $LEGACY_VALIDATION imports"
echo ""

# 7. Verificar SecurityProvider
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 Verificando SecurityProvider..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "validateAccess: () => true" src/contexts/providers/SecurityProvider.tsx 2>/dev/null; then
  echo -e "${RED}⚠️  CRÍTICO: SecurityProvider é STUB (sempre retorna true)${NC}"
  echo -e "${RED}   Risco de segurança! Implementação real necessária.${NC}"
else
  echo -e "${GREEN}✅ SecurityProvider tem implementação real${NC}"
fi

SECURITY_IMPORTS=$(grep -r "from.*SecurityProvider" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v ".test." | wc -l || echo "0")
echo -e "${BLUE}Usado em:${NC} $SECURITY_IMPORTS arquivos"
echo ""

# 8. Resumo e Recomendações
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 RESUMO E RECOMENDAÇÕES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$V1_COUNT" -eq 0 ] && [ "$V2_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ Migração Completa!${NC}"
  echo "   Próximos passos:"
  echo "   1. Remover código V1"
  echo "   2. Deletar providers legados"
  echo "   3. Atualizar documentação"
elif [ "$V2_COUNT" -eq 0 ]; then
  echo -e "${RED}⚠️  Migração Não Iniciada${NC}"
  echo "   Ações recomendadas:"
  echo "   1. Ler: CHECKLIST_RESOLUCAO_DUPLICACOES.md"
  echo "   2. Decidir: Completar ou Reverter FASE 2.1"
  echo "   3. Iniciar migração de App.tsx (se completar)"
elif compare_lt "$PROGRESS" 50; then
  echo -e "${YELLOW}⚠️  Migração em Andamento (Baixo)${NC}"
  echo "   Continue migrando:"
  echo "   1. Próximo: hooks principais (useEditor, useAuth, etc)"
  echo "   2. Ver: CHECKLIST_RESOLUCAO_DUPLICACOES.md - FASE 3 Wave 2"
else
  echo -e "${YELLOW}⚠️  Migração em Andamento (Alto)${NC}"
  echo "   Finalizando:"
  echo "   1. Migrar arquivos restantes ($V1_COUNT arquivos)"
  echo "   2. Cleanup de código legado"
  echo "   3. Ver: CHECKLIST_RESOLUCAO_DUPLICACOES.md - FASE 3 Wave 3"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📚 Documentos de Referência:${NC}"
echo "   - ANALISE_ESTRUTURAS_DUPLICADAS.md"
echo "   - SUMARIO_EXECUTIVO_DUPLICACOES.md"
echo "   - CHECKLIST_RESOLUCAO_DUPLICACOES.md"
echo "   - PROVIDERS_ADICIONAIS.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 9. Exit code baseado no progresso
if [ "$ORPHAN_COUNT" -eq 12 ] && [ "$V1_COUNT" -gt 0 ]; then
  echo -e "${RED}❌ Todos providers V2 estão órfãos. Considere reverter FASE 2.1.${NC}"
  exit 1
elif [ "$V1_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Migração incompleta. Retornando código 0 (permitido durante transição).${NC}"
  exit 0
else
  echo -e "${GREEN}✅ Arquitetura validada!${NC}"
  exit 0
fi
