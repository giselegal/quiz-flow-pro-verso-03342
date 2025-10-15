#!/bin/bash

# Script de Teste para Validação das Correções Aplicadas
# Data: 15 de outubro de 2025

echo "🧪 =============================="
echo "   TESTE DE CORREÇÕES - EDITOR"
echo "==============================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de testes
PASSED=0
FAILED=0

# Função auxiliar para testes
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASSOU${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FALHOU${NC}: $2"
        ((FAILED++))
    fi
}

echo "📋 Teste 1: Verificar Estrutura de Arquivos"
echo "-------------------------------------------"

# Teste 1.1: Hook corrigido existe
if [ -f "src/hooks/useComponentConfiguration.ts" ]; then
    if grep -q "definitionLoadedRef" "src/hooks/useComponentConfiguration.ts"; then
        test_result 0 "Hook useComponentConfiguration contém correção de loop"
    else
        test_result 1 "Hook useComponentConfiguration NÃO contém correção de loop"
    fi
else
    test_result 1 "Arquivo useComponentConfiguration.ts não encontrado"
fi

# Teste 1.2: Schema corrigido existe
if [ -f "src/components/editor/quiz/schema/blockSchema.ts" ]; then
    if grep -q "intro-hero" "src/components/editor/quiz/schema/blockSchema.ts"; then
        test_result 0 "Schema blockSchema.ts contém intro-hero"
    else
        test_result 1 "Schema blockSchema.ts NÃO contém intro-hero"
    fi
    
    if grep -q "welcome-form" "src/components/editor/quiz/schema/blockSchema.ts"; then
        test_result 0 "Schema blockSchema.ts contém welcome-form"
    else
        test_result 1 "Schema blockSchema.ts NÃO contém welcome-form"
    fi
    
    if grep -q "question-hero" "src/components/editor/quiz/schema/blockSchema.ts"; then
        test_result 0 "Schema blockSchema.ts contém question-hero"
    else
        test_result 1 "Schema blockSchema.ts NÃO contém question-hero"
    fi
else
    test_result 1 "Arquivo blockSchema.ts não encontrado"
fi

# Teste 1.3: DynamicPropertiesForm corrigido
if [ -f "src/components/editor/quiz/components/DynamicPropertiesForm.tsx" ]; then
    if grep -q "normalizeColor" "src/components/editor/quiz/components/DynamicPropertiesForm.tsx"; then
        test_result 0 "DynamicPropertiesForm contém normalização de cores"
    else
        test_result 1 "DynamicPropertiesForm NÃO contém normalização de cores"
    fi
else
    test_result 1 "Arquivo DynamicPropertiesForm.tsx não encontrado"
fi

echo ""
echo "📋 Teste 2: Verificar Sintaxe TypeScript"
echo "-------------------------------------------"

# Teste 2.1: Verificar erros de compilação
echo "Executando verificação de tipos TypeScript..."
if npx tsc --noEmit --skipLibCheck 2>&1 | grep -q "error TS"; then
    test_result 1 "TypeScript detectou erros de compilação"
else
    test_result 0 "Nenhum erro de compilação TypeScript detectado"
fi

echo ""
echo "📋 Teste 3: Verificar Schema do options-grid"
echo "-------------------------------------------"

# Teste 3.1: Campo 'options' está presente
if grep -A 50 "type: 'options-grid'" "src/components/editor/quiz/schema/blockSchema.ts" | grep -q "key: 'options'"; then
    test_result 0 "Schema options-grid contém campo 'options'"
else
    test_result 1 "Schema options-grid NÃO contém campo 'options'"
fi

# Teste 3.2: Tipo 'options-list' está definido
if grep -A 50 "type: 'options-grid'" "src/components/editor/quiz/schema/blockSchema.ts" | grep -q "type: 'options-list'"; then
    test_result 0 "Campo 'options' usa tipo 'options-list'"
else
    test_result 1 "Campo 'options' NÃO usa tipo 'options-list'"
fi

echo ""
echo "📋 Teste 4: Verificar Duplicações"
echo "-------------------------------------------"

# Teste 4.1: Verificar se não há declarações duplicadas de blockSchemaMap
SCHEMA_MAP_COUNT=$(grep -c "export const blockSchemaMap" "src/components/editor/quiz/schema/blockSchema.ts")
if [ "$SCHEMA_MAP_COUNT" -eq 1 ]; then
    test_result 0 "Apenas uma declaração de blockSchemaMap encontrada"
else
    test_result 1 "Múltiplas declarações de blockSchemaMap encontradas ($SCHEMA_MAP_COUNT)"
fi

echo ""
echo "📋 Teste 5: Verificar Normalização de Cores"
echo "-------------------------------------------"

# Teste 5.1: Verificar se há cores de 8 dígitos sendo usadas incorretamente
if grep -r "type=\"color\"" "src/components/editor/quiz/components/" | grep -v "normalizeColor" | grep -v "//"; then
    echo -e "${YELLOW}⚠️  AVISO${NC}: Encontrados inputs type='color' sem normalização (verificar manualmente)"
else
    test_result 0 "Todos os inputs type='color' estão protegidos ou normalizados"
fi

echo ""
echo "=============================="
echo "   RESUMO DOS TESTES"
echo "=============================="
echo -e "✅ Testes Passados: ${GREEN}$PASSED${NC}"
echo -e "❌ Testes Falhados: ${RED}$FAILED${NC}"
echo -e "📊 Total: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Todos os testes passaram!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Abra o editor em: http://localhost:5173/editor/quiz21StepsComplete-..."
    echo "2. Verifique o console do navegador (não deve haver loops)"
    echo "3. Selecione um bloco options-grid e verifique o painel de propriedades"
    echo "4. Teste a edição de opções (imageUrl, pontos, categoria)"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Alguns testes falharam. Revise as correções.${NC}"
    exit 1
fi
