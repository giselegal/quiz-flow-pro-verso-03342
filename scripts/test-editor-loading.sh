#!/bin/bash

# 🧪 Script de Teste Rápido - Carregamento do Editor

echo "🚀 Iniciando testes de carregamento do editor..."
echo ""

# Verificar se o servidor está rodando
if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "❌ Servidor não está rodando na porta 8080"
    echo "   Execute: npm run dev"
    exit 1
fi

echo "✅ Servidor rodando na porta 8080"
echo ""

# URLs para testar
URLS=(
    "http://localhost:8080/editor"
    "http://localhost:8080/editor?funnelId=funnel-quiz21-SKZYE1GX"
    "http://localhost:8080/editor?funnelId=funnel-bVflzgJ0Ka"
)

for url in "${URLS[@]}"; do
    echo "🎯 Testando: $url"
    
    start_time=$(date +%s%3N)
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    end_time=$(date +%s%3N)
    
    load_time=$((end_time - start_time))
    
    if [ "$response" == "200" ]; then
        echo "   ✅ HTTP $response"
        echo "   ⏱️  Tempo: ${load_time}ms"
    else
        echo "   ❌ HTTP $response"
    fi
    echo ""
done

echo "📊 Resumo dos Testes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "URLs testadas: ${#URLS[@]}"
echo ""
echo "✨ Para testes completos E2E, execute:"
echo "   npm run test:editor:quick"
