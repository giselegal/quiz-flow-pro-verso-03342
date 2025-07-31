#!/bin/bash

echo "🧪 Testando a API Schema-Driven..."
echo ""

echo "1. Testando GET /api/schema-driven/funnels"
echo "Comando: curl -s http://localhost:3001/api/schema-driven/funnels"
FUNNELS_BEFORE=$(curl -s http://localhost:3001/api/schema-driven/funnels)
echo "Resposta: $FUNNELS_BEFORE"
FUNNELS_COUNT_BEFORE=$(echo $FUNNELS_BEFORE | grep -o '"id"' | wc -l)
echo "Quantidade de funnels antes: $FUNNELS_COUNT_BEFORE"

echo ""
echo "2. Testando POST /api/schema-driven/funnels"
echo "Enviando dados de teste..."

POST_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST http://localhost:3001/api/schema-driven/funnels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Funnel Teste via Bash",
    "description": "Teste direto via curl",
    "settings": {"theme": "purple", "primaryColor": "#6600cc"}
  }')

HTTP_STATUS=$(echo $POST_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
RESPONSE_BODY=$(echo $POST_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

echo "Status HTTP: $HTTP_STATUS"
echo "Response body: $RESPONSE_BODY"

echo ""
echo "3. Verificando se foi criado (GET novamente)"
FUNNELS_AFTER=$(curl -s http://localhost:3001/api/schema-driven/funnels)
FUNNELS_COUNT_AFTER=$(echo $FUNNELS_AFTER | grep -o '"id"' | wc -l)
echo "Quantidade de funnels depois: $FUNNELS_COUNT_AFTER"

if [ $FUNNELS_COUNT_AFTER -gt $FUNNELS_COUNT_BEFORE ]; then
    echo "✅ Funnel foi criado com sucesso!"
else
    echo "❌ Funnel não foi criado"
fi

echo ""
echo "Últimos funnels:"
echo $FUNNELS_AFTER | jq '.[0:2] | .[] | {id, name, description}' 2>/dev/null || echo $FUNNELS_AFTER
