#!/bin/bash

echo "🎯 TESTE FINAL: Novo Botão de Exclusão"
echo ""

echo "✅ STATUS:"
echo "   - DeleteBlockButton criado"
echo "   - SortableBlockItem atualizado"
echo "   - Bloco de teste criado no funnel"
echo "   - Editor rodando em http://localhost:8080/editor"
echo ""

echo "📋 INSTRUÇÕES PARA TESTE:"
echo ""
echo "1. Abrir: http://localhost:8080/editor"
echo ""
echo "2. No console do navegador, executar:"
echo ""
cat << 'EOF'
// Carregar funnel de teste
localStorage.setItem('currentFunnelId', 'funnel_1753399767385_kgc4wwjsc');
location.reload();

// Após carregar, executar:
setTimeout(() => {
  console.log('🔍 Procurando novo botão de exclusão...');
  
  // Procurar especificamente pelo DeleteBlockButton
  const deleteButtons = document.querySelectorAll('button[title="Excluir Componente"]');
  console.log(`🗑️ Botões DeleteBlockButton encontrados: ${deleteButtons.length}`);
  
  if (deleteButtons.length > 0) {
    console.log('✅ SUCESSO! Botões encontrados:');
    deleteButtons.forEach((btn, i) => {
      console.log(`   Botão ${i}:`, btn);
      // Destacar visualmente
      btn.style.boxShadow = '0 0 10px 2px red';
      btn.style.transform = 'scale(1.2)';
    });
    
    console.log('🎯 Para testar: clique em qualquer botão destacado');
  } else {
    console.log('❌ Botões não encontrados');
    
    // Debug: procurar qualquer botão com Trash2
    const allButtons = document.querySelectorAll('button');
    let found = 0;
    allButtons.forEach(btn => {
      if (btn.innerHTML.includes('Trash2') || btn.innerHTML.includes('w-4 h-4')) {
        found++;
        btn.style.border = '3px solid blue';
        console.log('Botão Trash2 encontrado:', btn);
      }
    });
    
    console.log(`Debug: ${found} botões com ícone Trash2 encontrados`);
  }
  
  // Verificar se há blocos na tela
  const blocks = document.querySelectorAll('[data-block-id]');
  console.log(`📦 Blocos na tela: ${blocks.length}`);
  
}, 3000);
EOF

echo ""
echo "3. RESULTADO ESPERADO:"
echo "   ✅ Botão vermelho grande aparece no hover do componente"
echo "   ✅ Clique mostra confirmação 'Tem certeza que deseja excluir?'"
echo "   ✅ Após confirmar, componente desaparece"
echo "   ✅ Console mostra logs '🗑️ Excluindo bloco...' e '✅ Bloco excluído'"
echo ""

echo "🚨 SE NÃO FUNCIONAR:"
echo "   - Verifique se há erros no console"
echo "   - Verifique se o funnel foi carregado (deve ter 1 bloco amarelo)"
echo "   - Reporte os logs exatos que aparecem"
