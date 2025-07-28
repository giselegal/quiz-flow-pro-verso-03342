#!/bin/bash

echo "🧪 Testando funcionalidade completa do editor..."

echo ""
echo "1. Verificando se o editor está rodando..."
EDITOR_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/editor)
if [ "$EDITOR_STATUS" = "200" ]; then
    echo "   ✅ Editor respondendo na porta 8080"
else
    echo "   ❌ Editor não está respondendo (Status: $EDITOR_STATUS)"
    exit 1
fi

echo ""
echo "2. Verificando se a API está funcionando..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/schema-driven/funnels)
if [ "$API_STATUS" = "200" ]; then
    echo "   ✅ API respondendo na porta 3001"
else
    echo "   ❌ API não está respondendo (Status: $API_STATUS)"
    exit 1
fi

echo ""
echo "3. Testando criação de funnel via API..."
CREATE_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST http://localhost:3001/api/schema-driven/funnels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Exclusão de Componentes",
    "description": "Funnel para testar exclusão",
    "settings": {"theme": "test"}
  }')

CREATE_STATUS=$(echo $CREATE_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
CREATE_BODY=$(echo $CREATE_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

if [ "$CREATE_STATUS" = "201" ]; then
    echo "   ✅ Funnel criado com sucesso"
    FUNNEL_ID=$(echo $CREATE_BODY | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "   ID do funnel: $FUNNEL_ID"
    
    echo ""
    echo "4. Adicionando uma página de teste..."
    ADD_PAGE_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "http://localhost:3001/api/schema-driven/funnels/$FUNNEL_ID/pages" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Página Teste",
        "slug": "teste",
        "blocks": [
          {
            "id": "test-block-1",
            "type": "text",
            "properties": {
              "content": "Componente de teste para exclusão",
              "fontSize": "16px",
              "textAlign": "left"
            }
          }
        ]
      }')
    
    ADD_PAGE_STATUS=$(echo $ADD_PAGE_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$ADD_PAGE_STATUS" = "201" ]; then
        echo "   ✅ Página com componente criada"
        
        echo ""
        echo "5. Instruções para testar exclusão:"
        echo "   - Abra o editor em: http://localhost:8080/editor"
        echo "   - Carregue o funnel ID: $FUNNEL_ID"
        echo "   - Você deve ver o componente de teste"
        echo "   - Clique no componente para selecioná-lo"
        echo "   - Procure pelo botão de lixeira (🗑️) no toolbar do componente"
        echo "   - Clique para excluir"
        
        echo ""
        echo "6. Debug - Verificando se o componente foi salvo..."
        GET_FUNNEL=$(curl -s "http://localhost:3001/api/schema-driven/funnels/$FUNNEL_ID")
        BLOCKS_COUNT=$(echo $GET_FUNNEL | grep -o '"id":"test-block-1"' | wc -l)
        echo "   Componentes encontrados: $BLOCKS_COUNT"
        
    else
        echo "   ❌ Erro ao criar página (Status: $ADD_PAGE_STATUS)"
    fi
else
    echo "   ❌ Erro ao criar funnel (Status: $CREATE_STATUS)"
fi

echo ""
echo "🎯 Para debug detalhado, execute no console do navegador:"
echo "   node test-deletion.js"
