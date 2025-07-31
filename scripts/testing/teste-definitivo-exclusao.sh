#!/bin/bash

echo "🚨 TESTE DEFINITIVO - RESOLUÇÃO FINAL DA EXCLUSÃO"
echo ""

echo "1. Verificando se o bloco existe no backend..."
BLOCKS_COUNT=$(curl -s http://localhost:3001/api/schema-driven/funnels/funnel_1753399767385_kgc4wwjsc | jq '.pages[0].blocks | length')
echo "   Blocos no funnel: $BLOCKS_COUNT"

if [ "$BLOCKS_COUNT" -eq 0 ]; then
    echo "   Criando bloco de teste..."
    curl -s -X PUT http://localhost:3001/api/schema-driven/funnels/funnel_1753399767385_kgc4wwjsc \
      -H "Content-Type: application/json" \
      -d '{
        "name": "TESTE FINAL EXCLUSÃO",
        "description": "Último teste",
        "settings": {"theme": "test"},
        "pages": [
          {
            "id": "page-1",
            "title": "Página Teste",
            "pageType": "landing",
            "pageOrder": 0,
            "blocks": [
              {
                "id": "BLOCO-PARA-EXCLUIR",
                "type": "text", 
                "properties": {
                  "content": "🚨 CLIQUE NO BOTÃO VERMELHO PARA EXCLUIR ESTE BLOCO",
                  "fontSize": "20px",
                  "textAlign": "center",
                  "backgroundColor": "#ff0000",
                  "color": "#ffffff",
                  "padding": "30px"
                }
              }
            ]
          }
        ]
      }' > /dev/null
    echo "   ✅ Bloco criado"
fi

echo ""
echo "2. INSTRUÇÕES FINAIS:"
echo ""
echo "   🌐 Abrir: http://localhost:8080/editor"
echo ""
echo "   📋 Colar no console e executar:"
echo ""
echo "   localStorage.setItem('currentFunnelId', 'funnel_1753399767385_kgc4wwjsc');"
echo "   location.reload();"
echo ""
echo "   ⏱️  Aguardar 3 segundos e então executar:"
echo ""
cat << 'EOF'
   // TESTE FINAL
   const blocks = document.querySelectorAll('[data-block-id]');
   console.log('Blocos:', blocks.length);
   
   if (blocks.length > 0) {
     const deleteBtn = document.querySelector('button[title="Excluir Componente"]');
     if (deleteBtn) {
       console.log('✅ Botão encontrado! Clicando...');
       deleteBtn.click();
     } else {
       console.log('❌ Botão não encontrado');
       // Listar todos os botões
       document.querySelectorAll('button').forEach((btn, i) => {
         if (btn.innerHTML.includes('Trash2') || btn.title.includes('xcluir')) {
           console.log(`Botão ${i}:`, btn);
           btn.style.border = '3px solid red';
         }
       });
     }
   }
EOF

echo ""
echo "3. RESULTADO ESPERADO:"
echo "   - Bloco vermelho desaparece imediatamente"
echo "   - Console mostra logs de exclusão"
echo "   - Se não funcionar, reportar os logs exatos"
echo ""
echo "🎯 SE AINDA NÃO FUNCIONAR: O problema está na integração React/DOM"
