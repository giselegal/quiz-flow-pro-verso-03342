#!/bin/bash

# 🧪 Test Quality Script
# Comprehensive testing and quality checks

echo "🧪 Iniciando verificações de qualidade..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to run command and check exit code
run_check() {
    local command=$1
    local description=$2
    
    print_status $YELLOW "🔍 $description..."
    
    if eval $command; then
        print_status $GREEN "✅ $description - PASSOU"
        return 0
    else
        print_status $RED "❌ $description - FALHOU"
        return 1
    fi
}

# Initialize counters
TOTAL_CHECKS=0
PASSED_CHECKS=0

# 1. Unit Tests
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if run_check "npm run test -- --run" "Testes unitários"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# 2. Integration Tests
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if run_check "npx vitest run --config vitest-integration.config.ts" "Testes de integração"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# 3. TypeScript Check
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if run_check "npx tsc --noEmit" "Verificação TypeScript"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# 4. ESLint Check (if available)
if command -v eslint &> /dev/null; then
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if run_check "npx eslint src --ext .ts,.tsx --max-warnings 0" "Análise ESLint"; then
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    fi
fi

# 5. Build Check
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if run_check "npm run build" "Build de produção"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# 6. Test Coverage Check
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if run_check "npm run test -- --run --coverage --coverage.threshold.global.lines=70" "Cobertura de testes (70%)"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

echo ""
echo "=========================================="
print_status $YELLOW "📊 RESUMO DA QUALIDADE"
echo "=========================================="

# Calculate percentage
PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

if [ $PERCENTAGE -eq 100 ]; then
    print_status $GREEN "🎉 TODOS OS TESTES PASSARAM! ($PASSED_CHECKS/$TOTAL_CHECKS)"
    print_status $GREEN "🏆 Qualidade: EXCELENTE (100%)"
elif [ $PERCENTAGE -ge 80 ]; then
    print_status $YELLOW "⚠️  $PASSED_CHECKS/$TOTAL_CHECKS testes passaram"
    print_status $YELLOW "📈 Qualidade: BOA ($PERCENTAGE%)"
else
    print_status $RED "🚨 $PASSED_CHECKS/$TOTAL_CHECKS testes passaram"
    print_status $RED "📉 Qualidade: PRECISA MELHORAR ($PERCENTAGE%)"
fi

echo ""
print_status $YELLOW "🔗 Links úteis:"
echo "   • Resultados: ./test-results-integration.json"
echo "   • Cobertura: ./coverage/index.html"
echo "   • Cobertura integração: ./coverage-integration/index.html"

# Exit with error if not all tests passed
if [ $PERCENTAGE -lt 80 ]; then
    echo ""
    print_status $RED "❌ Qualidade insuficiente. Mínimo requerido: 80%"
    exit 1
else
    echo ""
    print_status $GREEN "✅ Qualidade aprovada!"
    exit 0
fi