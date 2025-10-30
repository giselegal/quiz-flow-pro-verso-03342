#!/bin/bash
# Script para testar navegação nos steps 12, 19 e 20

echo "🔍 Iniciando teste de navegação dos steps 12, 19 e 20..."
echo ""

# Verificar se o servidor está rodando
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ Servidor não está rodando em localhost:8080"
    echo "Execute: npm run dev"
    exit 1
fi

echo "✅ Servidor rodando"
echo ""

# Abrir o editor no navegador padrão
echo "📱 Abrindo editor no navegador..."
"$BROWSER" "http://localhost:8080/editor?template=quiz21StepsComplete" &

echo ""
echo "🧪 Instruções de teste manual:"
echo ""
echo "1️⃣  STEP 12 (Transição no meio do quiz):"
echo "   - Navegue até o step 12"
echo "   - Verifique se o hero de transição renderiza"
echo "   - Verifique se há spinner de loading"
echo "   - Aguarde o auto-advance (3.5s) OU"
echo "   - Clique no botão 'Continuar'"
echo "   - Deve avançar para o step 13"
echo ""
echo "2️⃣  STEP 19 (Transição pré-resultado):"
echo "   - Navegue até o step 19"
echo "   - Verifique se o hero de transição renderiza"
echo "   - Aguarde o auto-advance (3s) OU"
echo "   - Clique no botão de continuar"
echo "   - Deve avançar para o step 20"
echo ""
echo "3️⃣  STEP 20 (Resultado final):"
echo "   - Verifique se TODOS os blocos renderizam:"
echo "   - result-congrats (mensagem de parabéns)"
echo "   - result-main (título principal)"
echo "   - result-progress-bars (barras de progresso)"
echo "   - result-secondary-styles (estilos secundários)"
echo "   - result-cta (botões de ação)"
echo "   - Clique nos CTAs e verifique navegação"
echo ""
echo "✅ SUCESSO = Todos os 3 steps renderizam e navegam corretamente"
echo "❌ FALHA = Algum step não renderiza ou botões não funcionam"
echo ""
echo "📝 Para testar com console do navegador:"
echo "   1. Abra DevTools (F12)"
echo "   2. Console tab"
echo "   3. Digite: window.__editorMode.setViewMode('preview')"
echo "   4. Navegue pelos steps testando a experiência real"
echo ""
