#!/bin/bash

# 🧪 Script para Teste Automático da V2 no Navegador
# Execute este script para validar a implementação V2

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TESTE AUTOMÁTICO: HierarchicalTemplateSource V2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar se o servidor está rodando
if ! curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo "❌ Servidor não está rodando em http://localhost:8081"
    echo "   Execute: npm run dev"
    exit 1
fi

echo "✅ Servidor rodando: http://localhost:8081"
echo ""

# Abrir navegador
echo "📋 Instruções:"
echo ""
echo "1. Abra o navegador em: http://localhost:8081"
echo ""
echo "2. Abra DevTools (F12) → Console"
echo ""
echo "3. Cole e execute:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << 'CONSOLE_CODE'

// 🎯 Habilitar V2
localStorage.setItem('FEATURE_HIERARCHICAL_V2', 'true');
console.log('✅ V2 habilitada! Recarregando...');
setTimeout(() => location.reload(), 1000);

CONSOLE_CODE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "4. Após reload, verifique o console:"
echo "   ✅ Deve mostrar: 🚀 [HierarchicalTemplateSource] Usando V2"
echo "   ❌ Se mostrar: 📦 Usando V1, a flag não funcionou"
echo ""
echo "5. Teste carregamento de steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << 'CONSOLE_TEST'

// Carregar helper
const script = document.createElement('script');
script.src = '/console-helper-v2.js';
document.body.appendChild(script);

// Aguardar 1 segundo e testar
setTimeout(() => {
  console.log('🧪 Iniciando testes...');
  V2.checkVersion();
  V2.testStep('step-01');
}, 1000);

CONSOLE_TEST
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "6. Testar todos os 21 steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << 'CONSOLE_ALL'

// Testar todos os steps
V2.testAllSteps();

CONSOLE_ALL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "7. Verificar métricas:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << 'CONSOLE_METRICS'

// Ver métricas de performance
V2.getMetrics();

CONSOLE_METRICS
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 O QUE VERIFICAR:"
echo ""
echo "   ✅ Console mostra: 🚀 Usando V2"
echo "   ✅ Network tab: Zero erros 404"
echo "   ✅ Load time: < 500ms por step"
echo "   ✅ Todos os 21 steps carregam"
echo "   ✅ Cache funciona (2ª chamada mais rápida)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔧 TROUBLESHOOTING:"
echo ""
echo "   Problema: V1 ainda ativa"
echo "   Solução:"
echo "   localStorage.setItem('FEATURE_HIERARCHICAL_V2', 'true');"
echo "   location.reload();"
echo ""
echo "   Problema: Erros 404"
echo "   Solução: Verificar se JSONs existem:"
echo "   ls -la public/templates/quiz21Steps/steps/"
echo ""
echo "   Problema: Performance ruim"
echo "   Solução: Limpar cache:"
echo "   V2.clearBrowserCache();"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 PÁGINA DE TESTES INTERATIVA:"
echo ""
echo "   Acesse: http://localhost:8081/test-hierarchical-v2.html"
echo ""
echo "   Essa página tem interface visual para:"
echo "   • Habilitar/desabilitar V2"
echo "   • Executar testes automaticamente"
echo "   • Ver métricas em tempo real"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Tentar abrir no navegador padrão
if command -v xdg-open > /dev/null; then
    echo "🌐 Abrindo navegador..."
    xdg-open "http://localhost:8081" 2>/dev/null &
elif [ -n "$BROWSER" ]; then
    echo "🌐 Abrindo navegador..."
    "$BROWSER" "http://localhost:8081" 2>/dev/null &
else
    echo "💡 Abra manualmente: http://localhost:8081"
fi

echo ""
echo "✅ Servidor pronto para testes!"
echo ""
