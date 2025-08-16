#!/bin/bash

echo "🔧 TESTE ESPECÍFICO: Exclusão de Componentes"
echo ""

# 1. Verificar se o funnel existe
echo "1. Verificando funnel de teste..."
FUNNEL_RESPONSE=$(curl -s "http://localhost:3001/api/schema-driven/funnels/funnel_1753399767385_kgc4wwjsc")
BLOCKS_COUNT=$(echo $FUNNEL_RESPONSE | grep -o '"id":"test-block-1"' | wc -l)

if [ "$BLOCKS_COUNT" -gt 0 ]; then
    echo "   ✅ Funnel existe com bloco test-block-1"
else
    echo "   ❌ Bloco test-block-1 não encontrado, criando novo..."
    
    # Recriar o bloco se não existir
    curl -s -X PUT "http://localhost:3001/api/schema-driven/funnels/funnel_1753399767385_kgc4wwjsc" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Teste Exclusão de Componentes",
        "description": "Funnel para testar exclusão",
        "settings": {"theme": "test"},
        "pages": [
          {
            "id": "page-1",
            "title": "Página Teste",
            "pageType": "landing",
            "pageOrder": 0,
            "blocks": [
              {
                "id": "test-block-1",
                "type": "text",
                "properties": {
                  "content": "🎯 COMPONENTE DE TESTE - Clique na lixeira vermelha para excluir",
                  "fontSize": "20px",
                  "textAlign": "center",
                  "backgroundColor": "#ffffcc"
                }
              }
            ]
          }
        ]
      }' > /dev/null
    
    echo "   ✅ Bloco de teste recriado"
fi

echo ""
echo "2. Instruções específicas:"
echo ""
echo "🌐 ABRIR: http://localhost:8080/editor"
echo ""
echo "📋 EXECUTAR NO CONSOLE DO NAVEGADOR:"
echo ""
cat << 'EOF'
// 1. CARREGAR O FUNNEL DE TESTE
localStorage.setItem('currentFunnelId', 'funnel_1753399767385_kgc4wwjsc');
location.reload();

// 2. AGUARDAR CARREGAMENTO E ENTÃO EXECUTAR:
setTimeout(() => {
  console.log('🔍 Procurando componentes...');
  
  // Verificar quantos blocos existem
  const blocks = document.querySelectorAll('[data-block-id]');
  console.log(`📦 Blocos encontrados: ${blocks.length}`);
  
  // Procurar botões de exclusão
  const deleteButtons = document.querySelectorAll('button[title*="Excluir"], button[title*="excluir"]');
  console.log(`🗑️ Botões de exclusão encontrados: ${deleteButtons.length}`);
  
  if (deleteButtons.length > 0) {
    console.log('✅ Clique no botão vermelho para testar a exclusão');
    deleteButtons.forEach((btn, i) => {
      btn.style.background = 'red';
      btn.style.border = '3px solid darkred';
      btn.style.opacity = '1';
      console.log(`Botão ${i}:`, btn);
    });
  } else {
    console.log('❌ Botões não encontrados, forçando visibilidade...');
    
    // Forçar visibilidade de todos os botões
    const style = document.createElement('style');
    style.textContent = `
      .opacity-0, .opacity-90 { opacity: 1 !important; }
      button[class*="hover:bg-red"] {
        background: red !important;
        opacity: 1 !important;
        border: 3px solid darkred !important;
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      const newButtons = document.querySelectorAll('button[title*="Excluir"]');
      console.log(`🔄 Após forçar CSS: ${newButtons.length} botões`);
    }, 1000);
  }
}, 3000);
EOF

echo ""
echo "3. O que você deve ver:"
echo "   - Um componente amarelo com texto 'COMPONENTE DE TESTE'"
echo "   - Botões vermelhos no canto superior direito do componente"
echo "   - Console mostrando logs quando clicar no botão de exclusão"
echo ""
echo "4. Se a exclusão funcionar:"
echo "   - Componente desaparece da tela"
echo "   - Console mostra logs de sucesso"
echo "   - Toast/mensagem de confirmação aparece"
echo ""
echo "5. Se não funcionar:"
echo "   - Verifique os logs no console"
echo "   - Reporte qualquer erro que aparecer"
