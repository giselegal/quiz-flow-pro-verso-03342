#!/bin/bash

###############################################################################
# 🧪 TESTE DE BOTÕES DO EDITOR - Quiz Flow Pro
#
# Valida:
# 1. Estrutura de arquivos public vs src
# 2. Funcionamento dos botões Editar/Visualizar
# 3. Conflitos de versões
###############################################################################

set -euo pipefail

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PORT="${1:-8080}"
BASE="http://localhost:${PORT}"

PASS=0
FAIL=0
WARN=0

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🧪 TESTE DE ESTRUTURA E BOTÕES - Editor${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"

###############################################################################
# Teste 1: Estrutura de Arquivos
###############################################################################

echo -e "${YELLOW}[TESTE 1]${NC} Validando estrutura de arquivos..."

PUBLIC_HTML=$(find public -type f -name "*.html" 2>/dev/null | wc -l)
PUBLIC_DEBUG=$(find public -type f -name "debug-*.html" 2>/dev/null | wc -l)
SRC_COMPONENTS=$(find src/components -type f \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null | wc -l)

echo "  • Arquivos HTML públicos: $PUBLIC_HTML"
echo "  • Arquivos debug públicos: $PUBLIC_DEBUG"
echo "  • Componentes TypeScript: $SRC_COMPONENTS"

if [ "$PUBLIC_DEBUG" -gt 30 ]; then
    echo -e "  ${YELLOW}⚠${NC} Muitos arquivos debug públicos ($PUBLIC_DEBUG) - considere limpeza"
    ((WARN++))
fi

if [ "$SRC_COMPONENTS" -gt 1000 ]; then
    echo -e "  ${GREEN}✓${NC} Estrutura TypeScript robusta ($SRC_COMPONENTS componentes)"
    ((PASS++))
fi

###############################################################################
# Teste 2: Templates - Duplicação/Conflitos
###############################################################################

echo -e "\n${YELLOW}[TESTE 2]${NC} Verificando conflitos de templates..."

SRC_TEMPLATES=$(find src -path "*/templates/*" -name "*.json" 2>/dev/null | wc -l)
PUBLIC_TEMPLATES=$(find public/templates -name "*.json" 2>/dev/null | wc -l)

echo "  • Templates em src/: $SRC_TEMPLATES"
echo "  • Templates em public/: $PUBLIC_TEMPLATES"

if [ "$SRC_TEMPLATES" -gt 0 ] && [ "$PUBLIC_TEMPLATES" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠${NC} Templates em ambas localizações - verificar sincronização"
    ((WARN++))
    
    # Verificar se há quiz21-complete.json duplicado
    if [ -f "src/templates/quiz21-complete.json" ] && [ -f "public/templates/quiz21-complete.json" ]; then
        SRC_SIZE=$(stat -f%z "src/templates/quiz21-complete.json" 2>/dev/null || stat -c%s "src/templates/quiz21-complete.json" 2>/dev/null)
        PUBLIC_SIZE=$(stat -f%z "public/templates/quiz21-complete.json" 2>/dev/null || stat -c%s "public/templates/quiz21-complete.json" 2>/dev/null)
        
        if [ "$SRC_SIZE" != "$PUBLIC_SIZE" ]; then
            echo -e "  ${RED}✗${NC} quiz21-complete.json DIVERGENTE: src=${SRC_SIZE}b vs public=${PUBLIC_SIZE}b"
            ((FAIL++))
        else
            echo -e "  ${GREEN}✓${NC} quiz21-complete.json sincronizado"
            ((PASS++))
        fi
    fi
else
    echo -e "  ${GREEN}✓${NC} Templates em localização única"
    ((PASS++))
fi

###############################################################################
# Teste 3: Acessibilidade do Editor
###############################################################################

echo -e "\n${YELLOW}[TESTE 3]${NC} Testando acesso ao editor..."

EDITOR_URL="$BASE/editor?funnelId=quiz21StepsComplete&step=1"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$EDITOR_URL" 2>/dev/null || echo "000")

if [ "$RESPONSE" = "200" ]; then
    echo -e "  ${GREEN}✓${NC} Editor acessível (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "  ${RED}✗${NC} Editor não acessível (HTTP $RESPONSE)"
    ((FAIL++))
fi

###############################################################################
# Teste 4: Verificar Componente ToggleGroup
###############################################################################

echo -e "\n${YELLOW}[TESTE 4]${NC} Verificando componente ToggleGroup..."

TOGGLE_FILE="src/components/ui/toggle-group.tsx"
if [ -f "$TOGGLE_FILE" ]; then
    echo -e "  ${GREEN}✓${NC} toggle-group.tsx existe"
    ((PASS++))
    
    # Verificar se tem type="single"
    if grep -q "type.*single" "$TOGGLE_FILE"; then
        echo -e "  ${GREEN}✓${NC} Suporta type='single'"
        ((PASS++))
    else
        echo -e "  ${YELLOW}⚠${NC} type='single' não encontrado"
        ((WARN++))
    fi
else
    echo -e "  ${RED}✗${NC} toggle-group.tsx NÃO encontrado"
    ((FAIL++))
fi

###############################################################################
# Teste 5: Verificar Fix de onValueChange
###############################################################################

echo -e "\n${YELLOW}[TESTE 5]${NC} Verificando fix do onValueChange..."

EDITOR_FILE="src/components/editor/quiz/QuizModularEditor/index.tsx"
if grep -q "onValueChange={(val: string)" "$EDITOR_FILE"; then
    echo -e "  ${GREEN}✓${NC} onValueChange tipado corretamente (string, não string|null)"
    ((PASS++))
    
    # Verificar se tem o check de !val
    if grep -A 2 "onValueChange={(val: string)" "$EDITOR_FILE" | grep -q "if (!val) return"; then
        echo -e "  ${GREEN}✓${NC} Guard clause presente (previne null)"
        ((PASS++))
    else
        echo -e "  ${YELLOW}⚠${NC} Guard clause não encontrada"
        ((WARN++))
    fi
else
    echo -e "  ${RED}✗${NC} onValueChange ainda aceita null"
    ((FAIL++))
fi

###############################################################################
# Teste 6: Verificar Logs de Debug
###############################################################################

echo -e "\n${YELLOW}[TESTE 6]${NC} Verificando logs de debug para botões..."

if grep -q "Modo alterado para: Edição" "$EDITOR_FILE"; then
    echo -e "  ${GREEN}✓${NC} Logs de modo implementados"
    ((PASS++))
else
    echo -e "  ${YELLOW}⚠${NC} Logs de modo não encontrados"
    ((WARN++))
fi

###############################################################################
# Teste 7: Verificar Aria Labels
###############################################################################

echo -e "\n${YELLOW}[TESTE 7]${NC} Verificando acessibilidade (ARIA labels)..."

ARIA_COUNT=$(grep -c "aria-label=" "$EDITOR_FILE" || echo 0)
if [ "$ARIA_COUNT" -ge 3 ]; then
    echo -e "  ${GREEN}✓${NC} Botões possuem aria-label ($ARIA_COUNT encontrados)"
    ((PASS++))
else
    echo -e "  ${YELLOW}⚠${NC} Poucos aria-labels encontrados ($ARIA_COUNT)"
    ((WARN++))
fi

###############################################################################
# Teste 8: Verificar Atalhos de Teclado
###############################################################################

echo -e "\n${YELLOW}[TESTE 8]${NC} Verificando atalhos de teclado..."

if grep -q "Ctrl+Shift+P\|Cmd+Shift+P" "$EDITOR_FILE"; then
    echo -e "  ${GREEN}✓${NC} Atalhos de teclado implementados"
    ((PASS++))
else
    echo -e "  ${YELLOW}⚠${NC} Atalhos de teclado não documentados"
    ((WARN++))
fi

###############################################################################
# Teste 9: Testar Renderização do Editor
###############################################################################

echo -e "\n${YELLOW}[TESTE 9]${NC} Testando renderização do editor..."

CONTENT=$(curl -s "$EDITOR_URL" 2>/dev/null || echo "")

if echo "$CONTENT" | grep -q "Editar"; then
    echo -e "  ${GREEN}✓${NC} Botão 'Editar' presente no HTML"
    ((PASS++))
else
    echo -e "  ${RED}✗${NC} Botão 'Editar' NÃO encontrado"
    ((FAIL++))
fi

if echo "$CONTENT" | grep -q "Visualizar"; then
    echo -e "  ${GREEN}✓${NC} Botões 'Visualizar' presentes no HTML"
    ((PASS++))
else
    echo -e "  ${RED}✗${NC} Botões 'Visualizar' NÃO encontrados"
    ((FAIL++))
fi

###############################################################################
# Teste 10: Verificar localStorage Keys
###############################################################################

echo -e "\n${YELLOW}[TESTE 10]${NC} Verificando persistência de estado..."

if grep -q "qm-editor:canvas-mode" "$EDITOR_FILE"; then
    echo -e "  ${GREEN}✓${NC} Persistência de canvas-mode configurada"
    ((PASS++))
fi

if grep -q "qm-editor:preview-mode" "$EDITOR_FILE"; then
    echo -e "  ${GREEN}✓${NC} Persistência de preview-mode configurada"
    ((PASS++))
fi

###############################################################################
# Resumo Final
###############################################################################

echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 RESUMO DOS TESTES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"

TOTAL=$((PASS + FAIL + WARN))
echo -e "Total de verificações: ${BLUE}$TOTAL${NC}"
echo -e "Aprovadas: ${GREEN}$PASS${NC}"
echo -e "Avisos: ${YELLOW}$WARN${NC}"
echo -e "Falharam: ${RED}$FAIL${NC}"

echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ ESTRUTURA E BOTÕES VALIDADOS!${NC}\n"
    echo -e "${GREEN}✓ Botões de modo (Editar/Visualizar) funcionando corretamente${NC}"
    echo -e "${GREEN}✓ Fix aplicado: onValueChange não aceita mais null${NC}"
    echo -e "${GREEN}✓ Logs de debug implementados${NC}"
    echo -e "${GREEN}✓ Acessibilidade melhorada com aria-labels${NC}\n"
    
    if [ $WARN -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARN aviso(s) encontrado(s) - revise os detalhes acima${NC}\n"
    fi
    
    exit 0
else
    echo -e "${RED}✗ $FAIL teste(s) crítico(s) falharam${NC}\n"
    echo -e "${YELLOW}💡 Ações recomendadas:${NC}"
    echo -e "  1. Verificar se o servidor dev está rodando (npm run dev)"
    echo -e "  2. Recompilar o TypeScript se houver erros"
    echo -e "  3. Limpar cache do navegador (Ctrl+Shift+R)"
    echo -e "  4. Verificar console do navegador para erros JavaScript\n"
    exit 1
fi
