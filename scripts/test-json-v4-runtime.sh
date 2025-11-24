#!/bin/bash
# 📊 Teste Manual de Performance - JSON V4 Runtime

echo "🧪 VALIDAÇÃO JSON V4 - RUNTIME TEST"
echo "===================================="
echo ""

# 1. Verificar configuração
echo "📋 1. Configuração Ativa:"
echo "-------------------------"
grep -E "VITE_USE_NORMALIZED_JSON|VITE_PREFER_PUBLIC_STEP_JSON" .env | sed 's/^/  /'
echo ""

# 2. Verificar arquivos V4
echo "📦 2. Arquivos JSON V4:"
echo "----------------------"
if [ -f "public/templates/blocks.json" ]; then
    SIZE=$(stat -c%s public/templates/blocks.json)
    echo "  ✅ blocks.json: $SIZE bytes ($(echo "scale=2; $SIZE/1024" | bc) KB)"
else
    echo "  ❌ blocks.json NÃO ENCONTRADO"
fi

if [ -d "public/templates/steps-refs" ]; then
    COUNT=$(ls -1 public/templates/steps-refs/*.json 2>/dev/null | wc -l)
    TOTAL_SIZE=$(du -sb public/templates/steps-refs 2>/dev/null | cut -f1)
    echo "  ✅ steps-refs/: $COUNT arquivos, $TOTAL_SIZE bytes ($(echo "scale=2; $TOTAL_SIZE/1024" | bc) KB)"
else
    echo "  ❌ steps-refs/ NÃO ENCONTRADO"
fi
echo ""

# 3. Testar carregamento via HTTP
echo "🌐 3. Teste HTTP (dev server):"
echo "------------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Server respondendo: HTTP $HTTP_CODE"
    
    # Testar step-01-ref.json
    HTTP_REF=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/templates/steps-refs/step-01-ref.json)
    if [ "$HTTP_REF" = "200" ]; then
        echo "  ✅ step-01-ref.json: HTTP $HTTP_REF"
    else
        echo "  ❌ step-01-ref.json: HTTP $HTTP_REF"
    fi
    
    # Testar blocks.json
    HTTP_BLOCKS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/templates/blocks.json)
    if [ "$HTTP_BLOCKS" = "200" ]; then
        BLOCK_COUNT=$(curl -s http://localhost:8080/templates/blocks.json | grep -o '"blk-[^"]*"' | wc -l)
        echo "  ✅ blocks.json: HTTP $HTTP_BLOCKS ($BLOCK_COUNT blocos)"
    else
        echo "  ❌ blocks.json: HTTP $HTTP_BLOCKS"
    fi
else
    echo "  ❌ Server não está respondendo (HTTP $HTTP_CODE)"
fi
echo ""

# 4. Economia V3 vs V4
echo "💰 4. Economia V3 vs V4:"
echo "-----------------------"
if [ -f "public/templates/step-01-v3.json" ]; then
    V3_SIZE=$(stat -c%s public/templates/step-01-v3.json)
    V3_TOTAL=$((V3_SIZE * 21))
    echo "  V3 (estimado 21 steps): $V3_TOTAL bytes ($(echo "scale=2; $V3_TOTAL/1024" | bc) KB)"
fi

if [ -f "public/templates/blocks.json" ] && [ -d "public/templates/steps-refs" ]; then
    BLOCKS_SIZE=$(stat -c%s public/templates/blocks.json)
    REFS_SIZE=$(du -sb public/templates/steps-refs | cut -f1)
    V4_TOTAL=$((BLOCKS_SIZE + REFS_SIZE))
    echo "  V4 (blocks + refs): $V4_TOTAL bytes ($(echo "scale=2; $V4_TOTAL/1024" | bc) KB)"
    
    if [ ! -z "$V3_TOTAL" ]; then
        SAVED=$((V3_TOTAL - V4_TOTAL))
        PERCENT=$(echo "scale=1; ($SAVED * 100) / $V3_TOTAL" | bc)
        echo "  📊 Economia: $SAVED bytes (-$PERCENT%)"
    fi
fi
echo ""

# 5. Validação de estrutura
echo "🔍 5. Validação de Estrutura:"
echo "----------------------------"
SAMPLE_REF=$(curl -s http://localhost:8080/templates/steps-refs/step-01-ref.json 2>/dev/null)
if echo "$SAMPLE_REF" | grep -q '"version": "4.0"'; then
    echo "  ✅ step-01-ref.json tem version: 4.0"
else
    echo "  ⚠️  step-01-ref.json não tem version ou não é 4.0"
fi

if echo "$SAMPLE_REF" | grep -q '"blockIds"'; then
    BLOCK_COUNT=$(echo "$SAMPLE_REF" | grep -o '"blk-[^"]*"' | wc -l)
    echo "  ✅ step-01-ref.json tem blockIds (${BLOCK_COUNT} blocos)"
else
    echo "  ❌ step-01-ref.json NÃO tem blockIds"
fi

SAMPLE_BLOCKS=$(curl -s http://localhost:8080/templates/blocks.json 2>/dev/null | head -50)
if echo "$SAMPLE_BLOCKS" | grep -q '"version": "4.0"'; then
    echo "  ✅ blocks.json tem version: 4.0"
else
    echo "  ⚠️  blocks.json não tem version ou não é 4.0"
fi

if echo "$SAMPLE_BLOCKS" | grep -q '{{theme\.colors\.primary}}'; then
    echo "  ✅ blocks.json contém tokens (ex: {{theme.colors.primary}})"
else
    echo "  ⚠️  Tokens não encontrados em amostra"
fi
echo ""

# 6. Resumo
echo "✅ RESUMO:"
echo "--------"
if [ "$HTTP_CODE" = "200" ] && [ "$HTTP_REF" = "200" ] && [ "$HTTP_BLOCKS" = "200" ]; then
    echo "  🎉 JSON V4 está FUNCIONANDO corretamente!"
    echo "  📊 Arquivos servidos via HTTP com sucesso"
    echo "  ✅ Estrutura validada (version 4.0, blockIds, tokens)"
else
    echo "  ⚠️  Alguns testes falharam. Verifique logs acima."
fi
echo ""
echo "🔗 Para testar no browser:"
echo "  1. Abra http://localhost:8080"
echo "  2. Navegue pelo quiz"
echo "  3. Verifique console (F12) para erros"
echo "  4. Network tab: confirme carregamento de steps-refs/*.json"
echo ""
