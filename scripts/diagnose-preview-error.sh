#!/bin/bash

# Script de Diagnóstico - Erro do Preview no /editor
# Data: 15 de outubro de 2025

echo "🔍 ======================================"
echo "   DIAGNÓSTICO DO PREVIEW DO EDITOR"
echo "========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Teste 1: Verificar Arquivos Críticos do Preview${NC}"
echo "-------------------------------------------"

# Lista de arquivos críticos para o preview
CRITICAL_FILES=(
    "src/components/editor/quiz/QuizModularProductionEditor.tsx"
    "src/components/editor/quiz/components/LivePreviewContainer.tsx"
    "src/components/editor/quiz/components/LiveRuntimePreview.tsx"
    "src/components/quiz/QuizAppConnected.tsx"
    "src/hooks/useComponentConfiguration.ts"
    "src/services/ConfigurationAPI.ts"
    "src/runtime/quiz/QuizRuntimeRegistry.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file existe"
    else
        echo -e "${RED}❌${NC} $file NÃO ENCONTRADO"
    fi
done

echo ""
echo -e "${BLUE}📋 Teste 2: Verificar Erros de Import/Export${NC}"
echo "-------------------------------------------"

# Verificar imports problemáticos
echo "Verificando imports de LiveRuntimePreview..."
if grep -n "import.*LiveRuntimePreview" src/components/editor/quiz/QuizModularProductionEditor.tsx 2>/dev/null; then
    echo -e "${GREEN}✅${NC} Import encontrado"
else
    echo -e "${RED}❌${NC} Import de LiveRuntimePreview não encontrado"
fi

echo ""
echo "Verificando exports de LiveRuntimePreview..."
if grep -n "export.*LiveRuntimePreview" src/components/editor/quiz/components/LiveRuntimePreview.tsx 2>/dev/null; then
    echo -e "${GREEN}✅${NC} Export encontrado"
else
    echo -e "${RED}❌${NC} Export de LiveRuntimePreview não encontrado"
fi

echo ""
echo -e "${BLUE}📋 Teste 3: Verificar QuizRuntimeRegistry${NC}"
echo "-------------------------------------------"

if [ -f "src/runtime/quiz/QuizRuntimeRegistry.tsx" ]; then
    echo "Verificando exports principais..."
    
    if grep -q "export.*QuizRuntimeRegistryProvider" src/runtime/quiz/QuizRuntimeRegistry.tsx; then
        echo -e "${GREEN}✅${NC} QuizRuntimeRegistryProvider exportado"
    else
        echo -e "${RED}❌${NC} QuizRuntimeRegistryProvider NÃO exportado"
    fi
    
    if grep -q "export.*useQuizRuntimeRegistry" src/runtime/quiz/QuizRuntimeRegistry.tsx; then
        echo -e "${GREEN}✅${NC} useQuizRuntimeRegistry exportado"
    else
        echo -e "${YELLOW}⚠️${NC}  useQuizRuntimeRegistry não encontrado"
    fi
else
    echo -e "${RED}❌${NC} QuizRuntimeRegistry.tsx não existe"
fi

echo ""
echo -e "${BLUE}📋 Teste 4: Verificar QuizAppConnected${NC}"
echo "-------------------------------------------"

if [ -f "src/components/quiz/QuizAppConnected.tsx" ]; then
    echo "Verificando estrutura do QuizAppConnected..."
    
    if grep -q "useComponentConfiguration" src/components/quiz/QuizAppConnected.tsx; then
        echo -e "${GREEN}✅${NC} Usa useComponentConfiguration"
    else
        echo -e "${YELLOW}⚠️${NC}  Não usa useComponentConfiguration"
    fi
    
    if grep -q "ConfigurationAPI" src/components/quiz/QuizAppConnected.tsx; then
        echo -e "${GREEN}✅${NC} Usa ConfigurationAPI"
    else
        echo -e "${YELLOW}⚠️${NC}  Não usa ConfigurationAPI"
    fi
else
    echo -e "${RED}❌${NC} QuizAppConnected.tsx não existe"
fi

echo ""
echo -e "${BLUE}📋 Teste 5: Verificar Estrutura do LivePreviewContainer${NC}"
echo "-------------------------------------------"

if [ -f "src/components/editor/quiz/components/LivePreviewContainer.tsx" ]; then
    echo "Verificando componentes renderizados..."
    
    if grep -q "LiveRuntimePreview" src/components/editor/quiz/components/LivePreviewContainer.tsx; then
        echo -e "${GREEN}✅${NC} Renderiza LiveRuntimePreview"
    else
        echo -e "${RED}❌${NC} NÃO renderiza LiveRuntimePreview"
    fi
    
    if grep -q "iframe" src/components/editor/quiz/components/LivePreviewContainer.tsx; then
        echo -e "${YELLOW}⚠️${NC}  Usa iframe (pode causar problemas)"
    fi
else
    echo -e "${RED}❌${NC} LivePreviewContainer.tsx não existe"
fi

echo ""
echo -e "${BLUE}📋 Teste 6: Procurar Erros Comuns no Código${NC}"
echo "-------------------------------------------"

echo "Procurando por console.error no preview..."
ERRORS=$(grep -rn "console.error" src/components/editor/quiz/components/ 2>/dev/null | wc -l)
if [ "$ERRORS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️${NC}  Encontrados $ERRORS console.error - verifique os logs"
    grep -rn "console.error" src/components/editor/quiz/components/ | head -5
else
    echo -e "${GREEN}✅${NC} Nenhum console.error encontrado"
fi

echo ""
echo "Procurando por TODO/FIXME relacionados ao preview..."
TODOS=$(grep -rn "TODO.*preview\|FIXME.*preview" src/components/editor/quiz/ 2>/dev/null | wc -l)
if [ "$TODOS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️${NC}  Encontrados $TODOS TODO/FIXME"
    grep -rn "TODO.*preview\|FIXME.*preview" src/components/editor/quiz/ | head -5
else
    echo -e "${GREEN}✅${NC} Nenhum TODO/FIXME relacionado ao preview"
fi

echo ""
echo -e "${BLUE}📋 Teste 7: Verificar Dependências Circulares${NC}"
echo "-------------------------------------------"

echo "Verificando imports entre componentes do preview..."
madge --circular src/components/editor/quiz/components/ 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅${NC} Nenhuma dependência circular detectada"
else
    echo -e "${YELLOW}⚠️${NC}  madge não instalado ou dependências circulares encontradas"
fi

echo ""
echo -e "${BLUE}📋 Teste 8: Verificar Estado do Servidor${NC}"
echo "-------------------------------------------"

if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅${NC} Servidor acessível em http://localhost:5173"
    
    # Verificar se a rota /editor existe
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/editor)
    if [ "$STATUS" -eq 200 ]; then
        echo -e "${GREEN}✅${NC} Rota /editor retorna 200 OK"
    else
        echo -e "${RED}❌${NC} Rota /editor retorna $STATUS"
    fi
else
    echo -e "${RED}❌${NC} Servidor NÃO acessível"
fi

echo ""
echo -e "${BLUE}📋 Teste 9: Verificar Logs de Build${NC}"
echo "-------------------------------------------"

if [ -f "build-output.txt" ]; then
    echo "Procurando por erros no último build..."
    if grep -i "error\|failed" build-output.txt | tail -5; then
        echo -e "${YELLOW}⚠️${NC}  Erros encontrados no build"
    else
        echo -e "${GREEN}✅${NC} Nenhum erro no build"
    fi
else
    echo -e "${YELLOW}⚠️${NC}  Arquivo build-output.txt não encontrado"
fi

echo ""
echo "======================================"
echo "   PRÓXIMOS PASSOS RECOMENDADOS"
echo "======================================"
echo ""
echo "1. Execute o teste de browser:"
echo -e "   ${BLUE}npm run test:preview-browser${NC}"
echo ""
echo "2. Verifique o console do navegador em:"
echo -e "   ${BLUE}http://localhost:5173/editor${NC}"
echo ""
echo "3. Execute o diagnóstico detalhado:"
echo -e "   ${BLUE}node scripts/diagnose-preview-detailed.js${NC}"
echo ""
