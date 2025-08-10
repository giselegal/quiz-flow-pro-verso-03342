#!/bin/bash

# ====================================================================
# TESTE DE VALIDAÇÃO - MIGRAÇÃO PARA DYNAMICPROPERTIESPANEL
# ====================================================================

echo "🎯 TESTE DE VALIDAÇÃO - MIGRAÇÃO DYNAMIC PROPERTIES PANEL"
echo "=============================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de testes
PASSED=0
FAILED=0

# Função para teste
test_condition() {
    local description="$1"
    local command="$2"
    
    echo -n "📋 $description... "
    
    if eval "$command" &>/dev/null; then
        echo -e "${GREEN}✅ PASSOU${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FALHOU${NC}"
        ((FAILED++))
    fi
}

echo -e "${BLUE}🔍 VERIFICANDO REMOÇÃO DO ADVANCEDPROPERTYPANEL...${NC}"

# Teste 1: Arquivo removido
test_condition "AdvancedPropertyPanel.tsx removido" "[ ! -f 'src/components/editor/AdvancedPropertyPanel.tsx' ]"

# Teste 2: Imports removidos
test_condition "Imports removidos do editor.tsx" "! grep -q 'AdvancedPropertyPanel' src/pages/editor.tsx"

# Teste 3: Imports removidos do enhanced-editor.tsx
test_condition "Imports removidos do enhanced-editor.tsx" "! grep -q 'AdvancedPropertyPanel' src/pages/enhanced-editor.tsx"

echo -e "${BLUE}🔍 VERIFICANDO IMPLEMENTAÇÃO DO DYNAMICPROPERTIESPANEL...${NC}"

# Teste 4: DynamicPropertiesPanel presente
test_condition "DynamicPropertiesPanel existe" "[ -f 'src/components/editor/panels/DynamicPropertiesPanel.tsx' ]"

# Teste 5: Import no editor.tsx
test_condition "Import no editor.tsx" "grep -q 'DynamicPropertiesPanel' src/pages/editor.tsx"

# Teste 6: Import no enhanced-editor.tsx
test_condition "Import no enhanced-editor.tsx" "grep -q 'DynamicPropertiesPanel' src/pages/enhanced-editor.tsx"

echo -e "${BLUE}🔍 VERIFICANDO DEPENDÊNCIAS...${NC}"

# Teste 7: blockDefinitions existe
test_condition "blockDefinitions.ts existe" "[ -f 'src/config/blockDefinitions.ts' ]"

# Teste 8: PropertyInput existe
test_condition "PropertyInput existe" "[ -f 'src/components/editor/panels/block-properties/PropertyInput.tsx' ]"

# Teste 9: useHistory existe
test_condition "useHistory hook criado" "[ -f 'src/hooks/useHistory.ts' ]"

echo -e "${BLUE}🔍 VERIFICANDO COMPILAÇÃO...${NC}"

# Teste 10: TypeScript sem erros
test_condition "TypeScript sem erros" "npx tsc --noEmit --skipLibCheck"

echo "=============================================================="
echo -e "${BLUE}📊 RESUMO DOS TESTES${NC}"
echo "=============================================================="
echo -e "✅ Testes que passaram: ${GREEN}$PASSED${NC}"
echo -e "❌ Testes que falharam: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 MIGRAÇÃO 100% CONCLUÍDA COM SUCESSO!${NC}"
    echo -e "${GREEN}✅ Todos os testes passaram${NC}"
    echo -e "${GREEN}🚀 Sistema pronto para produção${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  MIGRAÇÃO INCOMPLETA${NC}"
    echo -e "${RED}❌ $FAILED teste(s) falharam${NC}"
    echo -e "${YELLOW}🔧 Verificar issues acima${NC}"
    exit 1
fi
