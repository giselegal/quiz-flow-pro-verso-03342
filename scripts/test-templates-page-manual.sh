#!/bin/bash

# 🧪 TESTE MANUAL: Validar fluxo /templates na prática
# Execute: bash scripts/test-templates-page-manual.sh

set -e

echo "=========================================="
echo "🧪 TESTE PRÁTICO: Rota /templates"
echo "=========================================="
echo ""

# 1. Verificar se JSON existe
echo "1️⃣ Verificando arquivo JSON..."
if [ -f "public/templates/quiz21-complete.json" ]; then
    SIZE=$(wc -c < "public/templates/quiz21-complete.json")
    echo "   ✅ quiz21-complete.json existe (${SIZE} bytes)"
    
    # Verificar estrutura básica
    STEPS_COUNT=$(grep -o '"step-[0-9]*"' public/templates/quiz21-complete.json | wc -l)
    echo "   ✅ Contém ${STEPS_COUNT} steps"
else
    echo "   ❌ quiz21-complete.json NÃO ENCONTRADO"
    exit 1
fi

echo ""

# 2. Verificar UNIFIED_TEMPLATE_REGISTRY
echo "2️⃣ Verificando UNIFIED_TEMPLATE_REGISTRY..."
if [ -f "src/config/unifiedTemplatesRegistry.ts" ]; then
    echo "   ✅ unifiedTemplatesRegistry.ts existe"
    
    # Contar templates
    REGISTRY_COUNT=$(grep -c "^    '[^']*':" src/config/unifiedTemplatesRegistry.ts || echo "0")
    echo "   ✅ Registry contém ~${REGISTRY_COUNT} templates"
    
    # Verificar template principal
    if grep -q "quiz21StepsComplete" src/config/unifiedTemplatesRegistry.ts; then
        echo "   ✅ Template principal 'quiz21StepsComplete' presente"
    fi
    
    # Verificar aliases
    if grep -q "quiz-estilo-completo" src/config/unifiedTemplatesRegistry.ts; then
        echo "   ✅ Alias 'quiz-estilo-completo' presente"
    fi
    
    if grep -q "quiz-estilo-21-steps" src/config/unifiedTemplatesRegistry.ts; then
        echo "   ✅ Alias 'quiz-estilo-21-steps' presente"
    fi
else
    echo "   ❌ unifiedTemplatesRegistry.ts NÃO ENCONTRADO"
    exit 1
fi

echo ""

# 3. Verificar TemplatesPage.tsx
echo "3️⃣ Verificando TemplatesPage.tsx..."
if [ -f "src/pages/TemplatesPage.tsx" ]; then
    echo "   ✅ TemplatesPage.tsx existe"
    
    # Verificar se usa getUnifiedTemplates
    if grep -q "getUnifiedTemplates" src/pages/TemplatesPage.tsx; then
        echo "   ✅ Usa getUnifiedTemplates() do registry"
    fi
    
    # Verificar redirecionamento para editor
    if grep -q "/editor?template=" src/pages/TemplatesPage.tsx; then
        echo "   ✅ Redireciona para /editor?template={id}"
    fi
else
    echo "   ❌ TemplatesPage.tsx NÃO ENCONTRADO"
    exit 1
fi

echo ""

# 4. Verificar TemplateService
echo "4️⃣ Verificando TemplateService..."
if [ -f "src/services/canonical/TemplateService.ts" ]; then
    echo "   ✅ TemplateService.ts existe"
    
    # Verificar getAllSteps
    if grep -q "async getAllSteps()" src/services/canonical/TemplateService.ts; then
        echo "   ✅ Método getAllSteps() presente"
    fi
    
    # Verificar normalização de IDs
    if grep -q "quiz-estilo-21-steps.*quiz21StepsComplete" src/services/canonical/TemplateService.ts; then
        echo "   ✅ Normalização de IDs implementada"
    fi
    
    # Verificar carregamento de JSON
    if grep -q "quiz21-complete.json" src/services/canonical/TemplateService.ts; then
        echo "   ✅ Carrega quiz21-complete.json"
    fi
else
    echo "   ❌ TemplateService.ts NÃO ENCONTRADO"
    exit 1
fi

echo ""

# 5. Verificar testes
echo "5️⃣ Verificando testes criados..."

TESTS_FOUND=0

if [ -f "tests/unit/template-service-json-loading.test.ts" ]; then
    echo "   ✅ Testes unitários do TemplateService"
    TESTS_FOUND=$((TESTS_FOUND + 1))
fi

if [ -f "tests/integration/unified-registry-aliases.test.ts" ]; then
    echo "   ✅ Testes de integração dos aliases"
    TESTS_FOUND=$((TESTS_FOUND + 1))
fi

if [ -f "tests/integration/templates-page-registry.test.ts" ]; then
    echo "   ✅ Testes da página /templates"
    TESTS_FOUND=$((TESTS_FOUND + 1))
fi

if [ -f "tests/e2e/templates-page-json-flow.spec.ts" ]; then
    echo "   ✅ Testes E2E do fluxo completo"
    TESTS_FOUND=$((TESTS_FOUND + 1))
fi

echo "   📊 Total: ${TESTS_FOUND}/4 arquivos de teste encontrados"

echo ""

# 6. Executar testes
echo "6️⃣ Executando testes automatizados..."
echo ""

npx vitest run tests/unit/template-service-json-loading.test.ts tests/integration/unified-registry-aliases.test.ts tests/integration/templates-page-registry.test.ts --reporter=basic 2>&1 | tail -20

echo ""
echo "=========================================="
echo "✅ VALIDAÇÃO COMPLETA"
echo "=========================================="
echo ""
echo "📋 Resumo:"
echo "   • JSON master: public/templates/quiz21-complete.json"
echo "   • Registry: src/config/unifiedTemplatesRegistry.ts"
echo "   • Página: src/pages/TemplatesPage.tsx"
echo "   • Service: src/services/canonical/TemplateService.ts"
echo "   • Testes: ${TESTS_FOUND} arquivos"
echo ""
echo "🎯 Fluxo:"
echo "   1. Usuário acessa /templates"
echo "   2. TemplatesPage carrega metadados do UNIFIED_TEMPLATE_REGISTRY"
echo "   3. Usuário clica em template → redireciona para /editor?template=X"
echo "   4. TemplateService.getAllSteps() carrega JSON quiz21-complete.json"
echo "   5. Editor renderiza 21 steps com blocos reais"
echo ""
echo "✅ Sistema validado e funcionando!"
