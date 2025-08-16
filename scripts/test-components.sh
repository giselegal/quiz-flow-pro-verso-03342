#!/bin/bash

# 🧪 Script de Teste para Componentes - Quiz Quest Challenge Verse
# Utiliza Prettier, ESLint e outras ferramentas para validar componentes

set -e  # Parar em qualquer erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}🧪 TESTE DE COMPONENTES - QUIZ QUEST CHALLENGE VERSE${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Função para imprimir status
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "success" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "warning" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    elif [ "$status" = "error" ]; then
        echo -e "${RED}❌ $message${NC}"
    else
        echo -e "${BLUE}ℹ️  $message${NC}"
    fi
}

# Função para executar comando com status
run_command() {
    local cmd="$1"
    local description="$2"
    
    echo -e "\n${YELLOW}🔄 Executando: $description${NC}"
    echo -e "${BLUE}Comando: $cmd${NC}"
    
    if eval "$cmd"; then
        print_status "success" "$description - SUCESSO"
        return 0
    else
        print_status "error" "$description - FALHA"
        return 1
    fi
}

echo -e "${BLUE}📋 RELATÓRIO DE TESTES${NC}"
echo "Iniciado em: $(date)"
echo "Diretório: $(pwd)"
echo ""

# 1. Verificar se Prettier está instalado
print_status "info" "Verificando Prettier..."
if command -v npx prettier --version &> /dev/null; then
    PRETTIER_VERSION=$(npx prettier --version)
    print_status "success" "Prettier encontrado - v$PRETTIER_VERSION"
else
    print_status "error" "Prettier não encontrado"
    exit 1
fi

# 2. Verificar arquivos de componentes
print_status "info" "Verificando componentes existentes..."

COMPONENT_FILES=(
    "src/components/blocks/inline/ButtonInline.tsx"
    "src/components/blocks/inline/TextInline.tsx" 
    "src/components/blocks/inline/ImageDisplayInline.tsx"
    "src/components/editor/properties/ComponentSpecificPropertiesPanel.tsx"
    "src/components/editor/testing/ComponentTestingPanel.tsx"
    "src/pages/component-testing.tsx"
)

EXISTING_FILES=0
for file in "${COMPONENT_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "success" "Encontrado: $file"
        EXISTING_FILES=$((EXISTING_FILES + 1))
    else
        print_status "error" "Ausente: $file"
    fi
done

echo ""
print_status "info" "Componentes encontrados: $EXISTING_FILES/${#COMPONENT_FILES[@]}"

# 3. Executar Prettier nos componentes
echo ""
print_status "info" "Executando Prettier nos componentes..."

for file in "${COMPONENT_FILES[@]}"; do
    if [ -f "$file" ]; then
        if run_command "npx prettier --check \"$file\"" "Prettier check: $(basename $file)"; then
            print_status "success" "$(basename $file) - Formatação OK"
        else
            print_status "warning" "$(basename $file) - Precisa formatação"
            run_command "npx prettier --write \"$file\"" "Formatando: $(basename $file)"
        fi
    fi
done

# 4. Verificar TypeScript
echo ""
if run_command "npx tsc --noEmit --project tsconfig.json" "Verificação TypeScript"; then
    print_status "success" "TypeScript - Tipos OK"
else
    print_status "error" "TypeScript - Erros de tipo encontrados"
fi

# 5. Executar ESLint se disponível
echo ""
if command -v npx eslint --version &> /dev/null; then
    print_status "info" "ESLint encontrado, executando..."
    for file in "${COMPONENT_FILES[@]}"; do
        if [ -f "$file" ]; then
            if run_command "npx eslint \"$file\" --format=compact" "ESLint: $(basename $file)"; then
                print_status "success" "$(basename $file) - Linting OK"
            else
                print_status "warning" "$(basename $file) - Avisos de linting"
            fi
        fi
    done
else
    print_status "warning" "ESLint não encontrado"
fi

# 6. Análise de linhas de código
echo ""
print_status "info" "Análise de código..."
TOTAL_LINES=0
for file in "${COMPONENT_FILES[@]}"; do
    if [ -f "$file" ]; then
        LINES=$(wc -l < "$file")
        TOTAL_LINES=$((TOTAL_LINES + LINES))
        echo "  📄 $(basename $file): $LINES linhas"
    fi
done
print_status "info" "Total: $TOTAL_LINES linhas de código"

# 7. Verificar estrutura de imports
echo ""
print_status "info" "Verificando imports..."
IMPORT_ISSUES=0

for file in "${COMPONENT_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Verificar imports duplicados
        DUPLICATE_IMPORTS=$(grep -n "^import" "$file" | cut -d: -f2 | sort | uniq -d | wc -l)
        if [ $DUPLICATE_IMPORTS -gt 0 ]; then
            print_status "warning" "$(basename $file) - $DUPLICATE_IMPORTS imports duplicados"
            IMPORT_ISSUES=$((IMPORT_ISSUES + 1))
        fi
        
        # Verificar imports não utilizados (busca por React não usado)
        if grep -q "import React" "$file" && ! grep -q "React\." "$file" && ! grep -q "<.*>" "$file"; then
            print_status "warning" "$(basename $file) - Import React possivelmente não utilizado"
            IMPORT_ISSUES=$((IMPORT_ISSUES + 1))
        fi
    fi
done

if [ $IMPORT_ISSUES -eq 0 ]; then
    print_status "success" "Estrutura de imports OK"
fi

# 8. Teste de build
echo ""
if run_command "npm run build" "Build do projeto"; then
    print_status "success" "Build - OK"
else
    print_status "error" "Build - FALHA"
fi

# 9. Relatório final
echo ""
echo -e "${BLUE}📊 RELATÓRIO FINAL${NC}"
echo "================================="
echo "🏗️  Componentes verificados: $EXISTING_FILES/${#COMPONENT_FILES[@]}"
echo "💻 Total de linhas: $TOTAL_LINES"
echo "⚠️  Problemas de import: $IMPORT_ISSUES"
echo "📅 Finalizado em: $(date)"

# 10. URLs de teste
echo ""
echo -e "${BLUE}🔗 LINKS PARA TESTE${NC}"
echo "================================="
echo "🧪 Teste de Componentes: http://localhost:8086/test/components"
echo "⚡ Editor Principal: http://localhost:8086/editor-fixed-dragdrop"
echo "🔧 Debug Editor: http://localhost:8086/debug-editor"
echo "🏠 Índice de Testes: http://localhost:8086/test-index.html"

echo ""
print_status "success" "Script de teste concluído!"
echo -e "${GREEN}Use os links acima para testar a interface.${NC}"
