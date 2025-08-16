#!/bin/bash

# 🎨 Script Prettier para Teste de Componentes
# Formata, verifica e testa todos os componentes do sistema

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🎨 PRETTIER - TESTE DE COMPONENTES${NC}"
echo -e "${BLUE}=================================${NC}"

# Lista de arquivos para testar
FILES=(
    "src/components/blocks/inline/ButtonInline.tsx"
    "src/components/blocks/inline/TextInline.tsx"
    "src/components/blocks/inline/ImageDisplayInline.tsx"
    "src/components/editor/properties/ComponentSpecificPropertiesPanel.tsx"
    "src/components/editor/testing/ComponentTestingPanel.tsx"
    "src/pages/component-testing.tsx"
    "src/pages/editor-fixed-dragdrop.tsx"
)

# Configuração do Prettier
PRETTIER_CONFIG='{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}'

# Função para executar Prettier com feedback
run_prettier() {
    local file=$1
    local action=$2
    
    echo -e "\n${YELLOW}📝 $action: $(basename $file)${NC}"
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Arquivo não encontrado: $file${NC}"
        return 1
    fi
    
    case $action in
        "check")
            if npx prettier --check "$file"; then
                echo -e "${GREEN}✅ Formatação OK${NC}"
                return 0
            else
                echo -e "${RED}⚠️  Precisa formatação${NC}"
                return 1
            fi
            ;;
        "format")
            if npx prettier --write "$file"; then
                echo -e "${GREEN}✅ Arquivo formatado${NC}"
                return 0
            else
                echo -e "${RED}❌ Erro na formatação${NC}"
                return 1
            fi
            ;;
        "diff")
            echo -e "${BLUE}📊 Diferenças encontradas:${NC}"
            npx prettier --check "$file" 2>&1 || true
            ;;
    esac
}

# 1. Verificar status atual
echo -e "\n${BLUE}1. 📋 VERIFICANDO STATUS ATUAL${NC}"
NEEDS_FORMATTING=0

for file in "${FILES[@]}"; do
    if run_prettier "$file" "check"; then
        continue
    else
        NEEDS_FORMATTING=$((NEEDS_FORMATTING + 1))
    fi
done

echo -e "\n${BLUE}📊 Arquivos que precisam formatação: $NEEDS_FORMATTING${NC}"

# 2. Mostrar diferenças (se houver)
if [ $NEEDS_FORMATTING -gt 0 ]; then
    echo -e "\n${BLUE}2. 🔍 MOSTRANDO DIFERENÇAS${NC}"
    for file in "${FILES[@]}"; do
        if ! npx prettier --check "$file" &> /dev/null; then
            echo -e "\n${YELLOW}📄 Diferenças em $(basename $file):${NC}"
            # Mostrar diff usando prettier
            npx prettier "$file" | diff "$file" - || true
        fi
    done
fi

# 3. Aplicar formatação
echo -e "\n${BLUE}3. 🎨 APLICANDO PRETTIER${NC}"
FORMATTED_FILES=0

for file in "${FILES[@]}"; do
    if run_prettier "$file" "format"; then
        FORMATTED_FILES=$((FORMATTED_FILES + 1))
    fi
done

# 4. Verificação final
echo -e "\n${BLUE}4. ✅ VERIFICAÇÃO FINAL${NC}"
FINAL_CHECK_OK=0

for file in "${FILES[@]}"; do
    if run_prettier "$file" "check"; then
        FINAL_CHECK_OK=$((FINAL_CHECK_OK + 1))
    fi
done

# 5. Estatísticas do código
echo -e "\n${BLUE}5. 📊 ESTATÍSTICAS DO CÓDIGO${NC}"
TOTAL_LINES=0
TOTAL_CHARS=0

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        LINES=$(wc -l < "$file")
        CHARS=$(wc -c < "$file")
        TOTAL_LINES=$((TOTAL_LINES + LINES))
        TOTAL_CHARS=$((TOTAL_CHARS + CHARS))
        
        echo "  📄 $(basename $file):"
        echo "     └── $LINES linhas, $CHARS caracteres"
    fi
done

echo -e "\n${BLUE}📈 TOTAIS:${NC}"
echo "  📄 Arquivos processados: ${#FILES[@]}"
echo "  📝 Total de linhas: $TOTAL_LINES"
echo "  💾 Total de caracteres: $TOTAL_CHARS"
echo "  🎨 Arquivos formatados: $FORMATTED_FILES"
echo "  ✅ Verificação final OK: $FINAL_CHECK_OK/${#FILES[@]}"

# 6. Teste de sintaxe TypeScript
echo -e "\n${BLUE}6. 🔧 TESTE DE SINTAXE TYPESCRIPT${NC}"
if npx tsc --noEmit --skipLibCheck; then
    echo -e "${GREEN}✅ TypeScript - Sintaxe OK${NC}"
else
    echo -e "${RED}❌ TypeScript - Erros encontrados${NC}"
fi

# 7. Links para teste
echo -e "\n${BLUE}7. 🔗 LINKS PARA TESTE VISUAL${NC}"
echo "================================="
echo "🧪 http://localhost:8086/test/components"
echo "⚡ http://localhost:8086/editor-fixed-dragdrop"
echo "🔧 http://localhost:8086/debug-editor"

echo -e "\n${GREEN}🎉 PRETTIER CONCLUÍDO!${NC}"
if [ $FINAL_CHECK_OK -eq ${#FILES[@]} ]; then
    echo -e "${GREEN}✅ Todos os arquivos estão bem formatados!${NC}"
else
    echo -e "${RED}⚠️  Alguns arquivos ainda têm problemas de formatação.${NC}"
fi
