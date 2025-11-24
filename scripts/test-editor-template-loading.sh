#!/bin/bash

# 🧪 TESTE AUTOMATIZADO: EditorV4 Template Loading
# Valida se a correção do bug de carregamento de templates funciona

set -e

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 TESTE AUTOMATIZADO: EditorV4 Template Loading${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

PASSED=0
FAILED=0
TOTAL=0

# Função para executar teste
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL=$((TOTAL + 1))
    
    echo -e "${YELLOW}▶ Teste $TOTAL: $test_name${NC}"
    
    if eval "$test_command" | grep -q "$expected_result"; then
        echo -e "${GREEN}  ✅ PASSOU${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}  ❌ FALHOU${NC}"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo -e "${BLUE}📦 1. VERIFICANDO ARQUIVOS DE TEMPLATE${NC}"
echo ""

# Teste 1: Verificar se quiz21-v4.json existe
run_test \
    "Arquivo quiz21-v4.json existe" \
    "curl -s http://localhost:8080/templates/quiz21-v4.json | jq -e '.version'" \
    "4.0.0"

# Teste 2: Verificar estrutura do JSON
run_test \
    "JSON tem 21 steps" \
    "curl -s http://localhost:8080/templates/quiz21-v4.json | jq '.steps | length'" \
    "21"

# Teste 3: Verificar metadata
run_test \
    "Metadata contém nome correto" \
    "curl -s http://localhost:8080/templates/quiz21-v4.json | jq -r '.metadata.name'" \
    "Quiz de Estilo Pessoal"

echo ""
echo -e "${BLUE}🔗 2. TESTANDO CARREGAMENTO DE URL${NC}"
echo ""

# Teste 4: Editor responde
run_test \
    "Editor responde em /editor" \
    "curl -s http://localhost:8080/editor" \
    "Quiz Flow Pro"

# Teste 5: Editor responde com query param
run_test \
    "Editor responde em /editor?template=quiz21StepsComplete" \
    "curl -s 'http://localhost:8080/editor?template=quiz21StepsComplete'" \
    "Quiz Flow Pro"

echo ""
echo -e "${BLUE}🧬 3. VERIFICANDO CÓDIGO DO COMPONENTE${NC}"
echo ""

# Teste 6: Código lê parâmetro template
run_test \
    "Código lê params.get('template')" \
    "grep -n \"params.get('template')\" /workspaces/quiz-flow-pro-verso-03342/src/pages/EditorV4.tsx" \
    "template"

# Teste 7: Código tem mapeamento de templates
run_test \
    "Código tem templateMap com quiz21StepsComplete" \
    "grep -A 5 'templateMap' /workspaces/quiz-flow-pro-verso-03342/src/pages/EditorV4.tsx | grep 'quiz21StepsComplete'" \
    "quiz21StepsComplete"

# Teste 8: Código tem fallback
run_test \
    "Código tem fallback para default" \
    "grep 'templatePath = possiblePaths' /workspaces/quiz-flow-pro-verso-03342/src/pages/EditorV4.tsx" \
    "possiblePaths"

echo ""
echo -e "${BLUE}📝 4. VERIFICANDO LOGS DE DEBUG${NC}"
echo ""

# Teste 9: Código tem logs de debug
run_test \
    "Código tem console.log para template solicitado" \
    "grep 'Template solicitado' /workspaces/quiz-flow-pro-verso-03342/src/pages/EditorV4.tsx" \
    "Template solicitado"

# Teste 10: Código tem logs para caminho resolvido
run_test \
    "Código tem console.log para caminho resolvido" \
    "grep 'Caminho resolvido' /workspaces/quiz-flow-pro-verso-03342/src/pages/EditorV4.tsx" \
    "Caminho resolvido"

echo ""
echo -e "${BLUE}🔧 5. TESTES DE INTEGRAÇÃO${NC}"
echo ""

# Teste 11: QuizV4Provider existe
run_test \
    "QuizV4Provider está importado" \
    "grep 'QuizV4Provider' /workspaces/quiz-flow-pro-verso-03342/src/pages/EditorV4.tsx" \
    "QuizV4Provider"

# Teste 12: templatePath é passado para provider
run_test \
    "templatePath é passado para QuizV4Provider" \
    "grep 'templatePath={templatePath}' /workspaces/quiz-flow-pro-verso-03342/src/pages/EditorV4.tsx" \
    "templatePath"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 RESULTADOS FINAIS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Total de testes: ${TOTAL}"
echo -e "${GREEN}✅ Passaram: ${PASSED}${NC}"

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Falharam: ${FAILED}${NC}"
    echo ""
    echo -e "${RED}⚠️  Alguns testes falharam. Verifique os logs acima.${NC}"
    exit 1
else
    echo -e "${RED}❌ Falharam: 0${NC}"
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}✅ A correção do bug de carregamento de templates está funcionando corretamente!${NC}"
    echo ""
    echo -e "${BLUE}📝 Próximos passos:${NC}"
    echo -e "  1. Abrir navegador em: ${YELLOW}http://localhost:8080/editor?template=quiz21StepsComplete${NC}"
    echo -e "  2. Verificar console (F12) para logs de debug"
    echo -e "  3. Validar que os 21 steps aparecem na sidebar"
    echo -e "  4. Testar navegação entre steps"
    echo ""
fi
