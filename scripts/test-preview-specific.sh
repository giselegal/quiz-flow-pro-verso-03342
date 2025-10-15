#!/bin/bash

# Teste Específico do Preview - Verificar Problemas Reais
# Data: 15 de outubro de 2025

echo "🔍 ======================================"
echo "   TESTE ESPECÍFICO DO PREVIEW"
echo "========================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Teste 1: Verificar Componentes Inline${NC}"
echo "-------------------------------------------"

EDITOR_FILE="src/components/editor/quiz/QuizModularProductionEditor.tsx"

if [ -f "$EDITOR_FILE" ]; then
    echo -e "${GREEN}✅${NC} Editor encontrado"
    
    # Verificar LivePreviewContainer
    if grep -q "const LivePreviewContainer" "$EDITOR_FILE"; then
        echo -e "${GREEN}✅${NC} LivePreviewContainer definido inline"
    else
        echo -e "${RED}❌${NC} LivePreviewContainer NÃO encontrado"
    fi
    
    # Verificar LiveRuntimePreview
    if grep -q "const LiveRuntimePreview" "$EDITOR_FILE"; then
        echo -e "${GREEN}✅${NC} LiveRuntimePreview definido inline"
    else
        echo -e "${RED}❌${NC} LiveRuntimePreview NÃO encontrado"
    fi
    
    # Verificar se renderiza LivePreviewContainer
    if grep -q "<LivePreviewContainer" "$EDITOR_FILE"; then
        echo -e "${GREEN}✅${NC} Renderiza <LivePreviewContainer>"
    else
        echo -e "${RED}❌${NC} NÃO renderiza <LivePreviewContainer>"
    fi
else
    echo -e "${RED}❌${NC} Arquivo do editor não encontrado"
fi

echo ""
echo -e "${BLUE}📋 Teste 2: Verificar Imports Necessários${NC}"
echo "-------------------------------------------"

# QuizRuntimeRegistry
if grep -q "import.*QuizRuntimeRegistryProvider.*from.*runtime/quiz" "$EDITOR_FILE"; then
    echo -e "${GREEN}✅${NC} Import QuizRuntimeRegistryProvider correto"
else
    echo -e "${RED}❌${NC} Import QuizRuntimeRegistryProvider ausente ou incorreto"
fi

# useQuizRuntimeRegistry
if grep -q "import.*useQuizRuntimeRegistry.*from.*runtime/quiz" "$EDITOR_FILE" || \
   grep -q "const.*useQuizRuntimeRegistry.*=.*useQuizRuntimeRegistry()" "$EDITOR_FILE"; then
    echo -e "${GREEN}✅${NC} useQuizRuntimeRegistry usado"
else
    echo -e "${YELLOW}⚠️${NC}  useQuizRuntimeRegistry pode não estar sendo usado"
fi

# QuizAppConnected
if grep -q "import.*QuizAppConnected.*from.*components/quiz" "$EDITOR_FILE"; then
    echo -e "${GREEN}✅${NC} Import QuizAppConnected correto"
else
    echo -e "${RED}❌${NC} Import QuizAppConnected ausente ou incorreto"
fi

# editorStepsToRuntimeMap
if grep -q "editorStepsToRuntimeMap" "$EDITOR_FILE"; then
    echo -e "${GREEN}✅${NC} Usa editorStepsToRuntimeMap"
else
    echo -e "${RED}❌${NC} editorStepsToRuntimeMap NÃO usado"
fi

echo ""
echo -e "${BLUE}📋 Teste 3: Verificar Lógica de Proteção contra Loop${NC}"
echo "-------------------------------------------"

# Verificar hash protection
if grep -q "lastUpdateRef\|currentHash\|lastHash" "$EDITOR_FILE"; then
    echo -e "${GREEN}✅${NC} Tem proteção por hash"
else
    echo -e "${RED}❌${NC} SEM proteção por hash"
fi

# Verificar debounce
if grep -q "debounce\|setTimeout.*setDebouncedSteps" "$EDITOR_FILE"; then
    echo -e "${GREEN}✅${NC} Tem debounce de steps"
else
    echo -e "${YELLOW}⚠️${NC}  SEM debounce de steps"
fi

# Verificar limite de updates
if grep -q "updateCountRef.*>.*10\|LOOP DETECTADO" "$EDITOR_FILE"; then
    echo -e "${GREEN}✅${NC} Tem detector de loop (limite de 10 updates)"
else
    echo -e "${YELLOW}⚠️${NC}  SEM detector de loop"
fi

# Verificar useMemo
MEMO_COUNT=$(grep -c "React.useMemo\|useMemo" "$EDITOR_FILE")
if [ "$MEMO_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅${NC} Usa useMemo ($MEMO_COUNT vezes)"
else
    echo -e "${YELLOW}⚠️${NC}  NÃO usa useMemo"
fi

# Verificar React.memo
REACT_MEMO_COUNT=$(grep -c "React.memo" "$EDITOR_FILE")
if [ "$REACT_MEMO_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅${NC} Usa React.memo ($REACT_MEMO_COUNT vezes)"
else
    echo -e "${YELLOW}⚠️${NC}  NÃO usa React.memo"
fi

echo ""
echo -e "${BLUE}📋 Teste 4: Verificar QuizAppConnected${NC}"
echo "-------------------------------------------"

QUIZ_APP_FILE="src/components/quiz/QuizAppConnected.tsx"

if [ -f "$QUIZ_APP_FILE" ]; then
    echo -e "${GREEN}✅${NC} QuizAppConnected encontrado"
    
    # Verificar prop editorMode
    if grep -q "editorMode" "$QUIZ_APP_FILE"; then
        echo -e "${GREEN}✅${NC} Aceita prop editorMode"
    else
        echo -e "${YELLOW}⚠️${NC}  Prop editorMode pode não estar definida"
    fi
    
    # Verificar se usa useComponentConfiguration
    CONFIG_COUNT=$(grep -c "useComponentConfiguration" "$QUIZ_APP_FILE")
    if [ "$CONFIG_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅${NC} Usa useComponentConfiguration ($CONFIG_COUNT vezes)"
        
        if [ "$CONFIG_COUNT" -gt 2 ]; then
            echo -e "${YELLOW}⚠️${NC}  Múltiplos hooks podem causar muitos fetches"
        fi
    else
        echo -e "${RED}❌${NC} NÃO usa useComponentConfiguration"
    fi
else
    echo -e "${RED}❌${NC} QuizAppConnected não encontrado"
fi

echo ""
echo -e "${BLUE}📋 Teste 5: Verificar Renderização Condicional${NC}"
echo "-------------------------------------------"

# Verificar modo production vs live
if grep -q "mode === 'production'" "$EDITOR_FILE"; then
    echo -e "${GREEN}✅${NC} Tem modo production"
    
    if grep -q "QuizProductionPreview" "$EDITOR_FILE"; then
        echo -e "${GREEN}✅${NC} Renderiza QuizProductionPreview no modo production"
    else
        echo -e "${YELLOW}⚠️${NC}  QuizProductionPreview não encontrado"
    fi
fi

if grep -q "mode === 'live'" "$EDITOR_FILE"; then
    echo -e "${GREEN}✅${NC} Tem modo live"
fi

echo ""
echo -e "${BLUE}📋 Teste 6: Verificar Logs de Debug${NC}"
echo "-------------------------------------------"

# Contar logs relacionados ao preview
PREVIEW_LOGS=$(grep -c "console.log.*Recalculando runtimeMap\|Atualizando Live preview\|Update Check" "$EDITOR_FILE" 2>/dev/null || echo "0")

if [ "$PREVIEW_LOGS" -gt 0 ]; then
    echo -e "${GREEN}✅${NC} Tem $PREVIEW_LOGS logs de debug do preview"
else
    echo -e "${YELLOW}⚠️${NC}  Poucos ou nenhum log de debug"
fi

echo ""
echo -e "${BLUE}📋 Teste 7: Verificar editorStepsToRuntimeMap${NC}"
echo "-------------------------------------------"

# Procurar definição da função
if grep -rn "function editorStepsToRuntimeMap\|const editorStepsToRuntimeMap" src/ 2>/dev/null | head -1; then
    echo -e "${GREEN}✅${NC} Função editorStepsToRuntimeMap encontrada"
else
    echo -e "${RED}❌${NC} Função editorStepsToRuntimeMap NÃO encontrada"
fi

echo ""
echo "======================================"
echo "   RESUMO E AÇÕES RECOMENDADAS"
echo "======================================"
echo ""

echo -e "${BLUE}🔧 Para testar o preview manualmente:${NC}"
echo ""
echo "1. Abra o navegador em:"
echo "   http://localhost:5173/editor"
echo ""
echo "2. Abra o Console (F12) e procure por:"
echo "   - 🔄 Recalculando runtimeMap"
echo "   - ✅ Atualizando Live preview registry"
echo "   - ❌ LOOP DETECTADO (se houver problema)"
echo ""
echo "3. Verifique se o preview aparece na coluna direita"
echo ""
echo "4. Se o preview estiver em branco:"
echo "   - Verifique erros no console"
echo "   - Verifique se há loops (logs repetindo)"
echo "   - Verifique se editorStepsToRuntimeMap retorna dados"
echo ""

if command -v xdg-open &> /dev/null; then
    echo -e "${GREEN}💡 Dica:${NC} Execute 'xdg-open http://localhost:5173/editor' para abrir o navegador"
elif command -v open &> /dev/null; then
    echo -e "${GREEN}💡 Dica:${NC} Execute 'open http://localhost:5173/editor' para abrir o navegador"
fi

echo ""
echo "✅ Teste concluído!"
