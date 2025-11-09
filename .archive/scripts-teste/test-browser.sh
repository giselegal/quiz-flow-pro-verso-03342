#!/bin/bash

# 🧪 Script de Teste Browser Automatizado
# Verifica se o servidor está respondendo e abre o browser

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           🧪 TESTE BROWSER - Quiz v3.0                       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se o servidor está rodando
echo -e "${BLUE}ℹ️  Verificando servidor Vite...${NC}"
if ps aux | grep -q "[v]ite --host"; then
    echo -e "${GREEN}✅ Servidor Vite está rodando${NC}"
else
    echo -e "${RED}❌ Servidor não encontrado. Iniciando...${NC}"
    npm run dev &
    sleep 5
fi

echo ""
echo -e "${BLUE}ℹ️  Testando endpoints...${NC}"

# Test 1: Health check
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/)
if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Root endpoint OK (200)${NC}"
else
    echo -e "${RED}❌ Root endpoint failed ($STATUS)${NC}"
fi

# Test 2: Quiz estilo route
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/quiz-estilo)
if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ /quiz-estilo OK (200)${NC}"
else
    echo -e "${YELLOW}⚠️  /quiz-estilo returned $STATUS (pode ser redirect)${NC}"
fi

# Test 3: Template files
echo ""
echo -e "${BLUE}ℹ️  Verificando templates...${NC}"

TEMPLATES=(
    "/templates/step-01-v3.json"
    "/templates/step-02-v3.json"
    "/templates/step-12-v3.json"
    "/templates/step-20-v3.json"
    "/templates/step-21-v3.json"
)

TEMPLATES_OK=0
for TEMPLATE in "${TEMPLATES[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173${TEMPLATE}")
    if [ "$STATUS" = "200" ]; then
        echo -e "${GREEN}✅ ${TEMPLATE}${NC}"
        ((TEMPLATES_OK++))
    else
        echo -e "${RED}❌ ${TEMPLATE} ($STATUS)${NC}"
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}📊 Resumo:${NC}"
echo -e "   Templates testados: ${TEMPLATES_OK}/${#TEMPLATES[@]}"
echo ""

# URLs para teste manual
echo "🌐 URLs para Teste Manual:"
echo ""
echo "   📋 Principal:"
echo "      http://localhost:5173/quiz-estilo"
echo ""
echo "   🧪 Testes Automatizados:"
echo "      http://localhost:5173/test-v3-browser-automated.html"
echo ""
echo "   📝 Templates Diretos:"
echo "      http://localhost:5173/templates/step-01-v3.json"
echo ""

# Tentar abrir no browser (se disponível)
if [ -n "$BROWSER" ]; then
    echo -e "${BLUE}🚀 Abrindo browser...${NC}"
    $BROWSER "http://localhost:5173/quiz-estilo" &
elif command -v xdg-open > /dev/null; then
    echo -e "${BLUE}🚀 Abrindo browser...${NC}"
    xdg-open "http://localhost:5173/quiz-estilo" &
else
    echo -e "${YELLOW}⚠️  Browser não detectado. Abra manualmente:${NC}"
    echo "   http://localhost:5173/quiz-estilo"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  ✨ Servidor pronto! Comece os testes no browser           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Checklist interativo
echo "📋 Checklist de Testes Browser:"
echo ""
echo "   [ ] Step 01: Intro + Welcome Form"
echo "       - Logo e título renderizam"
echo "       - Input de nome funciona"
echo "       - Validação (min 2 chars)"
echo "       - Botão CTA responde"
echo "       - Navega para step-02"
echo ""
echo "   [ ] Step 02: Primeira Questão"
echo "       - Pergunta renderiza"
echo "       - 4 opções com imagens"
echo "       - Seleção múltipla (max 3)"
echo "       - Contador 'X de 3 selecionados'"
echo "       - Auto-advance após 1500ms"
echo ""
echo "   [ ] Step 12: Transição"
echo "       - Loading spinner"
echo "       - Mensagem motivacional"
echo "       - Auto-advance 3000ms"
echo ""
echo "   [ ] Step 21: Oferta"
echo "       - Hero section"
echo "       - Pricing card com features"
echo "       - CTA 'Quero Meu Guia Agora'"
echo "       - Link checkout"
echo ""
echo "   [ ] Responsividade"
echo "       - Mobile (320px) - DevTools"
echo "       - Tablet (768px)"
echo "       - Desktop (1024px+)"
echo ""
echo "   [ ] Analytics (Console)"
echo "       - page_view events"
echo "       - section_view events"
echo "       - option_selected events"
echo "       - cta_click events"
echo ""
echo "💡 Dica: Abra DevTools (F12) → Console para ver analytics"
echo ""
