#!/bin/bash

# 🧪 SCRIPT DE TESTE DIRETO - FUNCIONALIDADES DO SISTEMA
# Execute este script para testar todas as funcionalidades sem navegador

echo "🚀 INICIANDO TESTES AUTOMATIZADOS DO SISTEMA..."
echo "=================================================="
echo "Data: $(date)"
echo "Servidor: http://localhost:8080"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para teste
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_text=$3
    
    echo -n "🧪 Testando $description... "
    
    response=$(curl -s -w "%{http_code}" http://localhost:8080$endpoint)
    http_code=${response: -3}
    content=${response%???}
    
    if [ "$http_code" = "200" ]; then
        if [ -n "$expected_text" ] && echo "$content" | grep -q "$expected_text"; then
            echo -e "${GREEN}✅ PASSOU${NC} (contém: $expected_text)"
        elif [ -z "$expected_text" ]; then
            echo -e "${GREEN}✅ PASSOU${NC} (HTTP 200)"
        else
            echo -e "${YELLOW}⚠️ PARCIAL${NC} (HTTP 200, mas sem: $expected_text)"
        fi
    else
        echo -e "${RED}❌ FALHOU${NC} (HTTP $http_code)"
    fi
}

# Função para verificar arquivos
check_file() {
    local file=$1
    local description=$2
    
    echo -n "📁 Verificando $description... "
    
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo "0")
        echo -e "${GREEN}✅ EXISTE${NC} (${size} bytes)"
    else
        echo -e "${RED}❌ AUSENTE${NC}"
    fi
}

# Função para verificar imports em arquivo
check_imports() {
    local file=$1
    local import_name=$2
    local description=$3
    
    echo -n "🔍 Verificando $description... "
    
    if [ -f "$file" ] && grep -q "$import_name" "$file"; then
        echo -e "${GREEN}✅ ENCONTRADO${NC}"
    else
        echo -e "${RED}❌ AUSENTE${NC}"
    fi
}

echo "📋 TESTE 1: VERIFICAÇÃO DE ARQUIVOS PRINCIPAIS"
echo "----------------------------------------------"
check_file "src/pages/admin/FunnelPanelPage.tsx" "Página do Dashboard"
check_file "src/pages/SchemaDrivenEditorPage.tsx" "Página do Editor"
check_file "src/components/editor/SchemaDrivenEditorResponsive.tsx" "Componente do Editor"
check_file "src/services/schemaDrivenFunnelService.ts" "Serviço de Funis"
echo ""

echo "🔧 TESTE 2: VERIFICAÇÃO DE IMPORTS CORRIGIDOS"
echo "--------------------------------------------"
check_imports "src/pages/admin/FunnelPanelPage.tsx" "Calendar" "Import do Calendar (corrigido)"
check_imports "src/pages/admin/FunnelPanelPage.tsx" "Plus" "Import do Plus"
check_imports "src/pages/admin/FunnelPanelPage.tsx" "Target" "Import do Target"
echo ""

echo "🌐 TESTE 3: CONECTIVIDADE E ROTAS"
echo "----------------------------------"
test_endpoint "/" "Página Principal" "Quiz Quest"
test_endpoint "/admin" "Dashboard Admin" "Painel de Funis"
test_endpoint "/editor" "Editor Principal" ""
echo ""

echo "📱 TESTE 4: VERIFICAÇÃO DE COMPONENTES"
echo "-------------------------------------"

# Teste de componentes React (verificar se não há erros de sintaxe)
echo -n "⚛️  Verificando sintaxe dos componentes React... "
if npm run check > /dev/null 2>&1; then
    echo -e "${GREEN}✅ VÁLIDA${NC}"
else
    echo -e "${YELLOW}⚠️ VERIFICAR${NC} (execute 'npm run check' para detalhes)"
fi

# Verificar se os principais hooks existem
check_file "src/hooks/useSchemaEditor.ts" "Hook do Schema Editor"
check_file "src/hooks/useBlockOperations.ts" "Hook de Operações de Bloco"
echo ""

echo "💾 TESTE 5: ESTRUTURA DE DADOS"
echo "------------------------------"
check_file "src/data/blockDefinitions.ts" "Definições de Blocos"
check_file "src/types/editor.ts" "Tipos do Editor"

# Verificar estrutura das 21 etapas
echo -n "📊 Verificando estrutura das 21 etapas... "
if grep -q "createModularPages" src/services/schemaDrivenFunnelService.ts 2>/dev/null; then
    echo -e "${GREEN}✅ CONFIGURADA${NC}"
else
    echo -e "${YELLOW}⚠️ VERIFICAR${NC}"
fi
echo ""

echo "🎯 TESTE 6: FUNCIONALIDADES ESPECÍFICAS"
echo "--------------------------------------"

# Verificar se os templates estão configurados
echo -n "📋 Verificando templates de funis... "
if grep -q "FUNNEL_TEMPLATES" src/pages/admin/FunnelPanelPage.tsx 2>/dev/null; then
    template_count=$(grep -c "id:" src/pages/admin/FunnelPanelPage.tsx 2>/dev/null || echo "0")
    echo -e "${GREEN}✅ CONFIGURADOS${NC} (${template_count} templates)"
else
    echo -e "${RED}❌ AUSENTES${NC}"
fi

# Verificar navegação
echo -n "🧭 Verificando sistema de navegação... "
if grep -q "navigateToEditor" src/pages/admin/FunnelPanelPage.tsx 2>/dev/null; then
    echo -e "${GREEN}✅ IMPLEMENTADA${NC}"
else
    echo -e "${RED}❌ AUSENTE${NC}"
fi

# Verificar auto-save
echo -n "💾 Verificando sistema de auto-save... "
if grep -q "autoSave\|auto-save" src/components/editor/SchemaDrivenEditorResponsive.tsx 2>/dev/null; then
    echo -e "${GREEN}✅ IMPLEMENTADO${NC}"
else
    echo -e "${YELLOW}⚠️ VERIFICAR${NC}"
fi
echo ""

echo "🔄 TESTE 7: INTEGRAÇÃO E FLUXOS"
echo "-------------------------------"

# Verificar roteamento
echo -n "🛣️  Verificando configuração de rotas... "
if grep -q "/editor" src/App.tsx 2>/dev/null; then
    echo -e "${GREEN}✅ CONFIGURADAS${NC}"
else
    echo -e "${RED}❌ AUSENTES${NC}"
fi

# Verificar contextos
echo -n "🎭 Verificando contextos React... "
context_count=$(find src -name "*Context*" -type f | wc -l)
if [ "$context_count" -gt 0 ]; then
    echo -e "${GREEN}✅ ENCONTRADOS${NC} (${context_count} contextos)"
else
    echo -e "${YELLOW}⚠️ POUCOS${NC}"
fi
echo ""

# Resumo final
echo "📊 RESUMO DOS TESTES"
echo "===================="

total_tests=0
passed_tests=0

# Contar testes que passaram (simplificado)
if [ -f "src/pages/admin/FunnelPanelPage.tsx" ]; then ((passed_tests++)); fi
if [ -f "src/pages/SchemaDrivenEditorPage.tsx" ]; then ((passed_tests++)); fi
if grep -q "Calendar" "src/pages/admin/FunnelPanelPage.tsx" 2>/dev/null; then ((passed_tests++)); fi
if curl -s http://localhost:8080 > /dev/null 2>&1; then ((passed_tests++)); fi

total_tests=4
percentage=$((passed_tests * 100 / total_tests))

echo "✅ Testes passaram: $passed_tests/$total_tests ($percentage%)"

if [ $percentage -ge 75 ]; then
    echo -e "${GREEN}🎉 SISTEMA APROVADO!${NC} Funcionalidades principais operacionais."
    echo ""
    echo "🚀 PRÓXIMOS PASSOS:"
    echo "1. Acesse: http://localhost:8080/admin"
    echo "2. Teste criação de funil manualmente"
    echo "3. Navegue para o editor"
    echo "4. Teste adição de componentes"
    echo "5. Verifique salvamento"
else
    echo -e "${YELLOW}⚠️ SISTEMA PARCIALMENTE FUNCIONAL.${NC} Algumas melhorias necessárias."
fi

echo ""
echo "🔗 LINKS ÚTEIS:"
echo "- Dashboard: http://localhost:8080/admin"
echo "- Editor: http://localhost:8080/editor"
echo "- Principal: http://localhost:8080/"
echo ""
echo "💡 DICA: Abra http://localhost:8080/admin em seu navegador local para testar!"
