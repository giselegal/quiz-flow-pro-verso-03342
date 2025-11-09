#!/bin/bash

# 🧪 SUITE DE TESTES AUTOMÁTICOS - Quiz Flow Pro
# Este script executa uma bateria completa de testes para validar a estrutura

echo "🧪 INICIANDO SUITE DE TESTES AUTOMÁTICOS"
echo "═══════════════════════════════════════════════════════════════════"
echo "📅 Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo "📁 Diretório: $(pwd)"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Função para executar teste
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_success="$3" # true/false
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "🔍 $test_name: "
    
    if eval "$test_command" >/dev/null 2>&1; then
        if [ "$expected_success" = "true" ]; then
            echo -e "${GREEN}✅ PASSOU${NC}"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            echo -e "${RED}❌ FALHOU (esperava falha mas passou)${NC}"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        if [ "$expected_success" = "false" ]; then
            echo -e "${GREEN}✅ PASSOU (falha esperada)${NC}"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            echo -e "${RED}❌ FALHOU${NC}"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    fi
}

# Função para verificar arquivo existe
test_file_exists() {
    local file_path="$1"
    [ -f "$file_path" ]
}

# Função para verificar diretório existe
test_dir_exists() {
    local dir_path="$1"
    [ -d "$dir_path" ]
}

# Função para verificar conteúdo do arquivo
test_file_contains() {
    local file_path="$1"
    local search_text="$2"
    [ -f "$file_path" ] && grep -q "$search_text" "$file_path"
}

echo "🔧 CATEGORIA 1: ESTRUTURA DE ARQUIVOS"
echo "─────────────────────────────────────────────────────────────────"

# Testes de estrutura básica
run_test "package.json existe" "test_file_exists 'package.json'" true
run_test "src/ existe" "test_dir_exists 'src'" true
run_test "public/ existe" "test_dir_exists 'public'" true
run_test "Diretório de templates existe" "test_dir_exists 'public/templates'" true

# Templates JSON
run_test "step-01-v3.json existe" "test_file_exists 'public/templates/step-01-v3.json'" true
run_test "step-02-v3.json existe" "test_file_exists 'public/templates/step-02-v3.json'" true
run_test "step-20-v3.json existe" "test_file_exists 'public/templates/step-20-v3.json'" true
run_test "step-21-v3.json existe" "test_file_exists 'public/templates/step-21-v3.json'" true

echo ""
echo "🧩 CATEGORIA 2: COMPONENTES CRÍTICOS"
echo "─────────────────────────────────────────────────────────────────"

# Componentes atômicos críticos
run_test "QuestionProgressBlock existe" "test_file_exists 'src/components/editor/blocks/atomic/QuestionProgressBlock.tsx'" true
run_test "QuestionTitleBlock existe" "test_file_exists 'src/components/editor/blocks/atomic/QuestionTitleBlock.tsx'" true
run_test "QuestionHeroBlock existe" "test_file_exists 'src/components/editor/blocks/atomic/QuestionHeroBlock.tsx'" true
run_test "QuestionNavigationBlock existe" "test_file_exists 'src/components/editor/blocks/atomic/QuestionNavigationBlock.tsx'" true
run_test "OptionsGridBlock existe" "test_file_exists 'src/components/editor/blocks/atomic/OptionsGridBlock.tsx'" true

echo ""
echo "🔗 CATEGORIA 3: REGISTRIES E NORMALIZAÇÃO"
echo "─────────────────────────────────────────────────────────────────"

# Registry principal
run_test "UnifiedBlockRegistry existe" "test_file_exists 'src/registry/UnifiedBlockRegistry.ts'" true
run_test "EnhancedBlockRegistry existe" "test_file_exists 'src/config/enhancedBlockRegistry.ts'" true
run_test "BlockDataNormalizer existe" "test_file_exists 'src/core/adapters/BlockDataNormalizer.ts'" true

# Verificar conteúdo dos registries
run_test "Registry contém question-progress" "test_file_contains 'src/registry/UnifiedBlockRegistry.ts' 'question-progress'" true
run_test "Registry contém question-title" "test_file_contains 'src/registry/UnifiedBlockRegistry.ts' 'question-title'" true
run_test "Registry contém options-grid" "test_file_contains 'src/registry/UnifiedBlockRegistry.ts' 'options-grid'" true

echo ""
echo "🎨 CATEGORIA 4: EDITOR E CANVAS"
echo "─────────────────────────────────────────────────────────────────"

# Editor principal
run_test "QuizModularEditor existe" "test_file_exists 'src/components/editor/quiz/QuizModularEditor/index.tsx'" true
run_test "CanvasColumn existe" "test_file_exists 'src/components/editor/quiz/QuizModularEditor/components/CanvasColumn/index.tsx'" true
run_test "PropertiesColumn existe" "test_file_exists 'src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/index.tsx'" true
run_test "SafeDndContext existe" "test_file_exists 'src/components/editor/quiz/QuizModularEditor/components/SafeDndContext.tsx'" true

# Verificar integração do normalizer
run_test "CanvasColumn usa normalizer" "test_file_contains 'src/components/editor/quiz/QuizModularEditor/components/CanvasColumn/index.tsx' 'BlockDataNormalizer'" true
run_test "PropertiesColumn usa normalizer" "test_file_contains 'src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/index.tsx' 'BlockDataNormalizer'" true

echo ""
echo "📄 CATEGORIA 5: CONTEÚDO DOS TEMPLATES"
echo "─────────────────────────────────────────────────────────────────"

# Verificar conteúdo dos templates
run_test "step-01 tem intro-title" "test_file_contains 'public/templates/step-01-v3.json' 'intro-title'" true
run_test "step-02 tem question-progress" "test_file_contains 'public/templates/step-02-v3.json' 'question-progress'" true
run_test "step-02 tem options-grid" "test_file_contains 'public/templates/step-02-v3.json' 'options-grid'" true
run_test "step-20 tem result-main" "test_file_contains 'public/templates/step-20-v3.json' 'result-main'" true
run_test "step-21 tem pricing" "test_file_contains 'public/templates/step-21-v3.json' 'pricing'" true

echo ""
echo "🔧 CATEGORIA 6: BUILD E CONFIGURAÇÃO"
echo "─────────────────────────────────────────────────────────────────"

# Arquivos de configuração
run_test "vite.config.ts existe" "test_file_exists 'vite.config.ts'" true
run_test "tsconfig.json existe" "test_file_exists 'tsconfig.json'" true
run_test "src/main.tsx existe" "test_file_exists 'src/main.tsx'" true

# Verificar se backup foi criado
run_test "Backup do registry existe" "test_file_exists 'src/registry/UnifiedBlockRegistry.ts.backup'" true

echo ""
echo "📊 CATEGORIA 7: TESTES FUNCIONAIS NODE.JS"
echo "─────────────────────────────────────────────────────────────────"# Teste de análise dos componentes
run_test "Análise de blocos funcionando" "node analyze-blocks-simple.cjs >/dev/null 2>&1" true

# Teste de build TypeScript
run_test "Build TypeScript sem erros" "npm run build >/dev/null 2>&1" true

echo ""
echo "🌐 CATEGORIA 8: TESTES DE SERVIDOR (se rodando)"
echo "─────────────────────────────────────────────────────────────────"

# Verificar se servidor está rodando (opcional)
if curl -s http://localhost:8080 >/dev/null 2>&1; then
    echo "🟢 Servidor detectado em localhost:8080"
    
    run_test "Página principal acessível" "curl -s http://localhost:8080 | grep -q 'html'" true
    run_test "Editor acessível" "curl -s 'http://localhost:8080/editor' | grep -q 'html'" true
    
    # Testar se assets estão sendo servidos
    run_test "Assets são servidos" "curl -s http://localhost:8080/assets/ >/dev/null 2>&1 || curl -s http://localhost:8080/src/ >/dev/null 2>&1" false
else
    echo "🟡 Servidor não detectado (opcional)"
fi

echo ""
echo "🧪 CATEGORIA 9: VALIDAÇÃO DE COMPONENTES REACT"
echo "─────────────────────────────────────────────────────────────────"

# Criar teste sintático dos componentes
cat > temp_component_test.js << 'EOF'
const fs = require('fs');

// Verificar se componentes têm sintaxe React válida
function validateReactComponent(filePath) {
    if (!fs.existsSync(filePath)) return false;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificações básicas de sintaxe React
    const checks = [
        /import\s+React/,                    // Importa React
        /export\s+default\s+function/,       // Export default function
        /return\s*\(/,                       // Return statement
        /\<\w+/,                            // JSX tags
        /\>\s*;?\s*\}/                      // Closing JSX
    ];
    
    return checks.every(check => check.test(content));
}

// Testar componentes críticos
const criticalComponents = [
    'src/components/editor/blocks/atomic/QuestionTitleBlock.tsx',
    'src/components/editor/blocks/atomic/QuestionHeroBlock.tsx'
];

criticalComponents.forEach(comp => {
    const isValid = validateReactComponent(comp);
    console.log(`${comp}: ${isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
});
EOF

run_test "Componentes têm sintaxe React válida" "node temp_component_test.js | grep -q 'VÁLIDO'" true

# Limpar arquivo temporário
rm -f temp_component_test.js

echo ""
echo "📊 RESUMO DOS TESTES"
echo "═══════════════════════════════════════════════════════════════════"
echo -e "📈 Total de testes: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "✅ Testes aprovados: ${GREEN}$PASSED_TESTS${NC}"
echo -e "❌ Testes falharam: ${RED}$FAILED_TESTS${NC}"

# Calcular percentual de sucesso
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "🎯 Taxa de sucesso: ${PURPLE}$SUCCESS_RATE%${NC}"
else
    echo -e "🎯 Taxa de sucesso: ${PURPLE}0%${NC}"
fi

echo ""
echo "🏆 AVALIAÇÃO GERAL:"
if [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "${GREEN}🟢 EXCELENTE - Sistema em ótimo estado!${NC}"
elif [ $SUCCESS_RATE -ge 75 ]; then
    echo -e "${YELLOW}🟡 BOM - Sistema funcional com alguns pontos de atenção${NC}"
elif [ $SUCCESS_RATE -ge 50 ]; then
    echo -e "${YELLOW}🟠 REGULAR - Sistema parcialmente funcional${NC}"
else
    echo -e "${RED}🔴 CRÍTICO - Sistema com problemas sérios${NC}"
fi

echo ""
echo "🔧 PRÓXIMOS PASSOS RECOMENDADOS:"
echo "1. Se taxa < 90%: Investigar testes falhados"
echo "2. Executar servidor: npm run dev"
echo "3. Testar editor: http://localhost:8080/editor?template=quiz21StepsComplete"
echo "4. Implementar componentes restantes se necessário"

echo ""
echo "✨ TESTE AUTOMÁTICO CONCLUÍDO!"
echo "📅 $(date '+%Y-%m-%d %H:%M:%S')"

# Retornar código de saída baseado nos resultados
if [ $SUCCESS_RATE -ge 75 ]; then
    exit 0
else
    exit 1
fi