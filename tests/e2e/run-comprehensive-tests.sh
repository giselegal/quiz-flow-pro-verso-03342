#!/bin/bash

# 🧪 SCRIPT DE EXECUÇÃO DE TESTES E2E ABRANGENTES
# Executa suite completa de validação da estrutura atual

echo "════════════════════════════════════════════════════════════"
echo "🚀 INICIANDO TESTES E2E ABRANGENTES - QUIZ FLOW PRO"
echo "════════════════════════════════════════════════════════════"
echo ""

# Verificar se o Playwright está instalado
if ! command -v npx playwright &> /dev/null; then
    echo "❌ Playwright não encontrado. Instalando..."
    npm install -D @playwright/test
    npx playwright install
fi

# Verificar se o servidor está rodando
echo "🔍 Verificando se o servidor está rodando..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Servidor já está rodando em localhost:8080"
    SERVER_RUNNING=true
else
    echo "⚠️ Servidor não detectado. Iniciando servidor de desenvolvimento..."
    SERVER_RUNNING=false
fi

# Criar diretório de screenshots se não existir
mkdir -p tests/e2e/screenshots

# Função para executar teste específico
run_test() {
    local test_file=$1
    local test_name=$2
    
    echo ""
    echo "────────────────────────────────────────────────────────────"
    echo "🧪 Executando: $test_name"
    echo "────────────────────────────────────────────────────────────"
    
    if npx playwright test "$test_file" --reporter=line; then
        echo "✅ $test_name - PASSOU"
        return 0
    else
        echo "❌ $test_name - FALHOU"
        return 1
    fi
}

# Lista de testes para executar
TESTS=(
    "tests/e2e/comprehensive-structure-validation.spec.ts:Validação Estrutural Completa"
    "tests/e2e/00-main-suite.spec.ts:Suite Principal"
    "tests/e2e/health-check.spec.ts:Health Check"
    "tests/e2e/smoke.spec.ts:Smoke Tests"
    "tests/e2e/critical-functionality.spec.ts:Funcionalidade Crítica"
)

# Contadores de resultados
PASSED=0
FAILED=0
TOTAL=0

echo ""
echo "📋 EXECUTANDO TESTES SEQUENCIAIS"
echo "════════════════════════════════════════════════════════════"

for test_entry in "${TESTS[@]}"; do
    IFS=':' read -r test_file test_name <<< "$test_entry"
    
    if [ -f "$test_file" ]; then
        ((TOTAL++))
        if run_test "$test_file" "$test_name"; then
            ((PASSED++))
        else
            ((FAILED++))
        fi
    else
        echo "⚠️ Arquivo não encontrado: $test_file"
    fi
done

# Executar teste customizado de validação estrutural
echo ""
echo "────────────────────────────────────────────────────────────"
echo "🏗️ Executando Validação Estrutural Customizada"
echo "────────────────────────────────────────────────────────────"

((TOTAL++))
if npx playwright test tests/e2e/comprehensive-structure-validation.spec.ts --reporter=html; then
    ((PASSED++))
    echo "✅ Validação Estrutural Customizada - PASSOU"
else
    ((FAILED++))
    echo "❌ Validação Estrutural Customizada - FALHOU"
fi

# Gerar relatório final
echo ""
echo "════════════════════════════════════════════════════════════"
echo "📊 RELATÓRIO FINAL DOS TESTES E2E"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📈 Estatísticas:"
echo "   Total de testes executados: $TOTAL"
echo "   ✅ Passou: $PASSED"
echo "   ❌ Falhou: $FAILED"

if [ $TOTAL -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED * 100) / TOTAL ))
    echo "   📊 Taxa de sucesso: $SUCCESS_RATE%"
    
    if [ $SUCCESS_RATE -ge 80 ]; then
        echo "   🎉 RESULTADO: EXCELENTE"
    elif [ $SUCCESS_RATE -ge 60 ]; then
        echo "   👍 RESULTADO: BOM"
    else
        echo "   ⚠️ RESULTADO: PRECISA MELHORAR"
    fi
fi

echo ""
echo "📁 Arquivos gerados:"
echo "   📸 Screenshots: tests/e2e/screenshots/"
echo "   📊 Relatório HTML: playwright-report/"
echo "   📋 Logs: playwright-report/index.html"

echo ""
echo "🔗 Para ver o relatório detalhado:"
echo "   npx playwright show-report"

echo ""
echo "════════════════════════════════════════════════════════════"

# Exit code baseado nos resultados
if [ $FAILED -eq 0 ]; then
    echo "🎉 TODOS OS TESTES PASSARAM!"
    exit 0
else
    echo "⚠️ Alguns testes falharam. Veja detalhes acima."
    exit 1
fi