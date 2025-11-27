#!/bin/bash

# Script para executar testes individuais de cada coluna do editor

echo "🧪 Executando Testes de Colunas do Editor"
echo "=========================================="
echo ""

# Verificar se servidor está rodando
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ ERRO: Servidor não está rodando em localhost:8080"
    echo "Execute: npm run dev"
    exit 1
fi

echo "✅ Servidor ativo"
echo ""

# Função para executar teste de uma coluna
run_column_test() {
    local column_num=$1
    local column_name=$2
    local test_file="tests/e2e/editor-column-${column_num}.spec.ts"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 Testando Coluna ${column_num}: ${column_name}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    npx playwright test "$test_file" \
        --project=chromium \
        --reporter=list \
        --timeout=90000 \
        --max-failures=3
    
    local exit_code=$?
    echo ""
    
    if [ $exit_code -eq 0 ]; then
        echo "✅ Coluna ${column_num} - TODOS OS TESTES PASSARAM"
    else
        echo "⚠️ Coluna ${column_num} - ALGUNS TESTES FALHARAM (código: $exit_code)"
    fi
    
    echo ""
    return $exit_code
}

# Executar testes de cada coluna
run_column_test "01-steps" "Steps Navigator"
run_column_test "02-library" "Component Library"
run_column_test "03-canvas" "Canvas"
run_column_test "04-properties" "Properties Panel"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏁 Testes Finalizados"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
