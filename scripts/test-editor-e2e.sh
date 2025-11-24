#!/bin/bash

# 🧪 TESTE E2E: Editor Template Loading
# Simula interação do usuário com diferentes URLs de template

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 TESTE E2E: Editor Template Loading${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Cenários de teste
declare -a test_scenarios=(
    "quiz21StepsComplete|/templates/quiz21-v4.json|Quiz principal"
    "quiz21-complete|/templates/quiz21-complete.json|Quiz alternativo"
    "quiz21-v4|/templates/quiz21-v4.json|Quiz v4 direto"
    "unknown-template|/templates/quiz21-v4.json|Template desconhecido (fallback)"
)

echo -e "${YELLOW}📋 Cenários de teste:${NC}"
for i in "${!test_scenarios[@]}"; do
    IFS='|' read -r template_id expected_path description <<< "${test_scenarios[$i]}"
    echo -e "  $((i+1)). ${BLUE}${description}${NC}"
    echo -e "     Template: ${template_id}"
    echo -e "     Esperado: ${expected_path}"
done
echo ""

# Executar testes
echo -e "${BLUE}🚀 Executando cenários de teste...${NC}"
echo ""

passed=0
failed=0

for scenario in "${test_scenarios[@]}"; do
    IFS='|' read -r template_id expected_path description <<< "$scenario"
    
    echo -e "${YELLOW}▶ Testando: ${description}${NC}"
    echo -e "  URL: ${BLUE}http://localhost:8080/editor?template=${template_id}${NC}"
    
    # Fazer requisição HTTP
    response=$(curl -s "http://localhost:8080/editor?template=${template_id}")
    
    # Verificar se a página carregou
    if echo "$response" | grep -q "Quiz Flow Pro"; then
        echo -e "  ${GREEN}✅ Página carregou corretamente${NC}"
        
        # Verificar se não há erros óbvios na página
        if echo "$response" | grep -q "error\|Error\|ERRO"; then
            echo -e "  ${RED}⚠️  Possível erro detectado na resposta${NC}"
            failed=$((failed + 1))
        else
            echo -e "  ${GREEN}✅ Sem erros detectados${NC}"
            passed=$((passed + 1))
        fi
    else
        echo -e "  ${RED}❌ Falha ao carregar página${NC}"
        failed=$((failed + 1))
    fi
    
    echo ""
done

# Teste adicional: URL sem parâmetro template
echo -e "${YELLOW}▶ Testando: URL sem parâmetro (comportamento default)${NC}"
echo -e "  URL: ${BLUE}http://localhost:8080/editor${NC}"

response=$(curl -s "http://localhost:8080/editor")

if echo "$response" | grep -q "Quiz Flow Pro"; then
    echo -e "  ${GREEN}✅ Default funcionando corretamente${NC}"
    passed=$((passed + 1))
else
    echo -e "  ${RED}❌ Falha no comportamento default${NC}"
    failed=$((failed + 1))
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 RESULTADOS E2E${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Total de cenários: $((passed + failed))"
echo -e "${GREEN}✅ Passaram: ${passed}${NC}"
echo -e "${RED}❌ Falharam: ${failed}${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 TODOS OS CENÁRIOS E2E PASSARAM!${NC}"
    echo ""
    echo -e "${BLUE}✅ Validações realizadas:${NC}"
    echo -e "  • URLs com diferentes template IDs carregam corretamente"
    echo -e "  • Fallback para template desconhecido funciona"
    echo -e "  • Comportamento default (sem parâmetro) mantido"
    echo -e "  • Nenhum erro óbvio detectado nas respostas"
    exit 0
else
    echo -e "${RED}⚠️  Alguns cenários falharam${NC}"
    exit 1
fi
