🧪 **TESTE DE EXCLUSÃO DE COMPONENTES NO EDITOR**

**Situação Atual:**
✅ Editor rodando em: http://localhost:8080/editor
✅ API funcionando em: http://localhost:3001
✅ Funnel de teste criado: `funnel_1753399767385_kgc4wwjsc`
✅ Funnel contém 1 componente de teste para exclusão

**PASSOS PARA TESTAR:**

1. **Abrir o Editor:**
   - Navegue para: http://localhost:8080/editor
   - Aguarde o editor carregar completamente

2. **Carregar o Funnel de Teste:**
   - Procure por opção de "Carregar Funnel" ou "Abrir Projeto"
   - Use o ID: `funnel_1753399767385_kgc4wwjsc`
   - OU use a função JavaScript no console:
     ```javascript
     // No console do navegador
     localStorage.setItem('currentFunnelId', 'funnel_1753399767385_kgc4wwjsc');
     location.reload();
     ```

3. **Localizar o Componente:**
   - Você deve ver um componente de texto com o conteúdo:
     "🎯 Componente de teste para exclusão - clique na lixeira para excluir"

4. **IMPORTANTE - Como Acessar os Botões de Exclusão:**

   **🎯 MÉTODO PRINCIPAL:**
   - **PASSE O MOUSE sobre o componente** (hover)
   - Os botões aparecem no **canto superior direito** com fundo semi-transparente
   - Você verá 4 botões pequenos: Arrastar (⋮⋮), Visibilidade (�), Duplicar (📋), **Excluir (🗑️)**

   **🎯 MÉTODO ALTERNATIVO:**
   - **Clique no componente para selecioná-lo**
   - Os botões ficarão semi-visíveis mesmo sem hover
   - Procure no canto superior direito do componente

5. **Testar Exclusão:**
   - Passe o mouse sobre o componente de teste
   - No toolbar que aparecer, clique no ícone da **lixeira** (último botão)
   - O componente deve desaparecer imediatamente

**DEBUGGING ESPECÍFICO - Execute no Console:**

```javascript
// 1. Forçar hover em todos os componentes para mostrar botões
console.log('Mostrando botões de todos os componentes...');
const blocks = document.querySelectorAll('.group, [data-block-id]');
blocks.forEach(block => {
  block.classList.add('hover:opacity-90');
  // Simular hover
  const event = new MouseEvent('mouseenter', { bubbles: true });
  block.dispatchEvent(event);
});

// 2. Procurar especificamente o botão de exclusão
const deleteButtons = document.querySelectorAll('button');
const trashButtons = [];
deleteButtons.forEach((btn, i) => {
  const hasTrashIcon =
    btn.innerHTML.includes('Trash2') || btn.querySelector('svg[class*="lucide-trash"]');
  if (hasTrashIcon) {
    trashButtons.push(btn);
    console.log(`Botão de exclusão ${i}:`, btn);
    // Destacar visualmente
    btn.style.border = '2px solid red';
    btn.style.opacity = '1';
  }
});

console.log(`Encontrados ${trashButtons.length} botões de exclusão`);

// 3. Se encontrou botões, testar o primeiro
if (trashButtons.length > 0) {
  console.log('Para testar, execute: trashButtons[0].click()');
  window.testDeleteButton = trashButtons[0];
}
```

**TESTE MANUAL VISUAL:**

1. **Verificar CSS dos botões:**

   ```javascript
   // Forçar visibilidade dos controles
   const style = document.createElement('style');
   style.textContent = `
     .group .opacity-0 { opacity: 1 !important; }
     .group-hover\\:opacity-90 { opacity: 1 !important; }
   `;
   document.head.appendChild(style);
   ```

2. **Destacar visualmente os componentes:**
   ```javascript
   document.querySelectorAll('[data-block-id], .sortable-block').forEach(el => {
     el.style.border = '3px solid blue';
     el.style.position = 'relative';
   });
   ```

**PROBLEMAS POSSÍVEIS:**

1. **Botões não aparecem no hover:**
   - CSS pode estar conflitando
   - Componente não tem a classe `group` correta

2. **Botões aparecem mas não funcionam:**
   - Evento `onClick` não está conectado corretamente
   - Função `onDelete` não está sendo passada

3. **Exclusão não salva:**
   - Auto-save está desabilitado, precisa salvar manualmente
   - Problema na comunicação com a API

**TESTE DE FORÇA BRUTA:**

```javascript
// Se nada funcionar, force a exclusão
const blockToDelete = document.querySelector('[data-block-id]');
if (blockToDelete) {
  const blockId = blockToDelete.getAttribute('data-block-id') || 'test-block-1';

  // Tentar disparar evento de exclusão customizado
  window.dispatchEvent(
    new CustomEvent('forceDeleteBlock', {
      detail: { blockId },
    })
  );

  // Ou tentar encontrar a função no React
  console.log('Block ID para exclusão manual:', blockId);
}
```

**RESULTADO ESPERADO:**

- ✅ Hover mostra 4 botões no canto superior direito
- ✅ Clique na lixeira remove o componente instantaneamente
- ✅ Componente desaparece da lista visual
- ✅ Console não mostra erros
