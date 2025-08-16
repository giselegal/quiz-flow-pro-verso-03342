#!/bin/bash

echo "🧪 Testando exclusão de bloco via API diretamente..."

FUNNEL_ID="funnel_1753399767385_kgc4wwjsc"

echo ""
echo "1. Estado atual do funnel:"
CURRENT_STATE=$(curl -s http://localhost:3001/api/schema-driven/funnels/$FUNNEL_ID)
echo "$CURRENT_STATE" | jq '.pages[0].blocks | length'
echo "Blocks atuais:"
echo "$CURRENT_STATE" | jq '.pages[0].blocks[].id'

echo ""
echo "2. Removendo o bloco test-block-1 via PUT..."

# Criar versão sem o bloco test-block-1
UPDATED_FUNNEL=$(echo "$CURRENT_STATE" | jq '
  .pages[0].blocks = (.pages[0].blocks | map(select(.id != "test-block-1")))
')

# Enviar de volta para a API
curl -s -X PUT http://localhost:3001/api/schema-driven/funnels/$FUNNEL_ID \
  -H "Content-Type: application/json" \
  -d "$UPDATED_FUNNEL" > /dev/null

echo ""
echo "3. Verificando se a exclusão funcionou:"
AFTER_DELETE=$(curl -s http://localhost:3001/api/schema-driven/funnels/$FUNNEL_ID)
BLOCKS_COUNT=$(echo "$AFTER_DELETE" | jq '.pages[0].blocks | length')

echo "Quantidade de blocos após exclusão: $BLOCKS_COUNT"

if [ "$BLOCKS_COUNT" = "0" ]; then
    echo "✅ Exclusão via API funcionou!"
    
    echo ""
    echo "4. Recriando bloco de teste..."
    RECREATE_FUNNEL=$(echo "$AFTER_DELETE" | jq '
      .pages[0].blocks = [
        {
          "id": "test-block-1",
          "type": "text",
          "properties": {
            "content": "🎯 Bloco recriado - teste a exclusão no editor",
            "fontSize": "18px",
            "textAlign": "center"
          }
        }
      ]
    ')
    
    curl -s -X PUT http://localhost:3001/api/schema-driven/funnels/$FUNNEL_ID \
      -H "Content-Type: application/json" \
      -d "$RECREATE_FUNNEL" > /dev/null
    
    echo "✅ Bloco de teste recriado para testar no editor"
    
else
    echo "❌ Exclusão via API não funcionou"
fi

echo ""
echo "5. Estado final:"
FINAL_STATE=$(curl -s http://localhost:3001/api/schema-driven/funnels/$FUNNEL_ID)
echo "Blocos finais: $(echo "$FINAL_STATE" | jq '.pages[0].blocks | length')"
