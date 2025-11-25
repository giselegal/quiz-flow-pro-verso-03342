# ✅ CHECKLIST DE TESTES - PAINEL DE PROPRIEDADES

**Data:** 25 de novembro de 2025  
**Versão:** 1.0.0  
**Objetivo:** Validar todas as funcionalidades do Painel de Propriedades após correções da Fase 1

---

## 🎯 PRÉ-REQUISITOS

Antes de começar os testes, certifique-se que:

- [ ] Servidor de desenvolvimento está rodando (`npm run dev`)
- [ ] Navegador aberto em `http://localhost:8080/`
- [ ] Console do navegador aberto (F12) para verificar logs
- [ ] Nenhum erro no console ao carregar a página

---

## 📋 TESTES FUNCIONAIS

### 1. ✅ RENDERIZAÇÃO DO PAINEL

**Objetivo:** Verificar se o painel abre corretamente ao selecionar um bloco

#### 1.1 Abrir Editor
- [ ] Navegar para `/quiz-editor` ou página com `UnifiedEditorLayout`
- [ ] Verificar se 3 abas estão visíveis: "Quiz Editor", "Result Page", "Sales Page"
- [ ] Clicar na aba "Result Page"

#### 1.2 Selecionar Bloco no Canvas
- [ ] Clicar em qualquer bloco visível no canvas central
- [ ] **Verificar:** Bloco deve mostrar **destaque visual** (borda dourada)
- [ ] **Verificar:** Painel direito deve **abrir automaticamente**
- [ ] **Verificar:** Painel deve mostrar:
  - Badge com tipo do bloco (ex: `intro-title`)
  - Abas de categorias (Layout, Palette, Settings, etc)
  - Propriedades editáveis do bloco

**✅ Resultado Esperado:**
```
📦 ModernPropertiesPanel: Bloco carregado
🔍 ModernPropertiesPanel: Discovering properties for block: intro-title
📊 ModernPropertiesPanel: Found properties: 8
```

**❌ Se Falhar:**
- Verificar no console se há erro `useEditorAdapter must be used inside EditorProvider`
- Verificar se `selectedBlock` está `null` mesmo após clicar

---

### 2. ✅ EDIÇÃO DE PROPRIEDADES

**Objetivo:** Verificar se as propriedades são atualizadas corretamente

#### 2.1 Editar Propriedade de Texto
- [ ] Com um bloco selecionado, encontrar campo de texto (ex: "title")
- [ ] Digitar novo texto (ex: "Meu Novo Título")
- [ ] **Verificar:** Texto no canvas **atualiza em tempo real**
- [ ] **Verificar:** Console mostra:
  ```
  📤 ModernPropertiesPanel updating property: content.title with value: Meu Novo Título
  🔄 Final updates to EditorContext: { content: { title: "Meu Novo Título" } }
  ```

#### 2.2 Editar Propriedade Select
- [ ] Encontrar campo dropdown (ex: "textAlign")
- [ ] Selecionar nova opção (ex: "center")
- [ ] **Verificar:** Alinhamento no canvas **muda imediatamente**

#### 2.3 Editar Propriedade Range (Slider)
- [ ] Encontrar slider (ex: "fontSize")
- [ ] Mover slider para novo valor
- [ ] **Verificar:** Tamanho da fonte **muda em tempo real**

#### 2.4 Editar Propriedade Boolean (Switch)
- [ ] Encontrar switch (ex: "visible")
- [ ] Alternar switch
- [ ] **Verificar:** Bloco **aparece/desaparece** conforme valor

**✅ Resultado Esperado:** Todas as mudanças refletem no canvas instantaneamente

**❌ Se Falhar:**
- Verificar se `handlePropertyUpdate` está sendo chamado
- Verificar se updates estão sendo salvos em `properties` ou `content` correto

---

### 3. ✅ EDIÇÃO DE ARRAYS (OPTIONS-GRID)

**Objetivo:** Verificar manipulação de propriedades tipo array

#### 3.1 Adicionar Opção
- [ ] Selecionar bloco `options-grid`
- [ ] **Verificar:** Quick Panel aparece no topo
- [ ] Clicar em botão "Adicionar"
- [ ] **Verificar:** Nova opção é adicionada à lista
- [ ] **Verificar:** Console mostra:
  ```
  🎯 Special case: Saving options to content.options
  🔍 Adding new option: { id: "...", text: "Nova Opção", ... }
  ```

#### 3.2 Editar Opção Existente
- [ ] Alterar texto de uma opção na lista
- [ ] **Verificar:** Canvas atualiza imediatamente
- [ ] **Verificar:** Console mostra:
  ```
  🔍 Updating option text: { id: "...", text: "Texto Alterado", ... }
  ```

#### 3.3 Remover Opção
- [ ] Clicar no botão "X" de uma opção
- [ ] **Verificar:** Opção é removida da lista
- [ ] **Verificar:** Canvas não mostra mais a opção

**✅ Resultado Esperado:** Manipulação de array funciona perfeitamente

**❌ Se Falhar:**
- Verificar se `options` está sendo salvo em `content.options` (não `properties.options`)

---

### 4. ✅ AÇÃO: DUPLICAR BLOCO

**Objetivo:** Verificar se botão "Duplicar" funciona

#### 4.1 Duplicar Bloco Simples
- [ ] Selecionar um bloco qualquer
- [ ] Rolar até seção "Ações" no painel
- [ ] Clicar em "Duplicar Componente"
- [ ] **Verificar:** Novo bloco aparece no canvas (abaixo do original)
- [ ] **Verificar:** Console mostra:
  ```
  🔄 Duplicando bloco: intro-title-1
  ✅ Bloco duplicado com sucesso: { originalId: "intro-title-1", newId: "intro-title-2" }
  ```
- [ ] **Verificar:** Novo bloco tem **conteúdo idêntico** ao original
- [ ] **Verificar:** Novo bloco tem **ID diferente**

#### 4.2 Duplicar Bloco com Dados Complexos
- [ ] Duplicar bloco `options-grid` com várias opções
- [ ] **Verificar:** Novo bloco tem **todas as opções copiadas**
- [ ] **Verificar:** Editar opção no novo bloco **não afeta** o original

**✅ Resultado Esperado:** Duplicação cria cópia independente e funcional

**❌ Se Falhar:**
- Verificar se `actions.duplicateBlock()` existe no adaptador
- Verificar se `generateBlockId()` está gerando IDs únicos

---

### 5. ✅ AÇÃO: REMOVER BLOCO

**Objetivo:** Verificar se botão "Remover" funciona

#### 5.1 Remover Bloco
- [ ] Selecionar um bloco qualquer
- [ ] Clicar em "Remover Componente" (botão vermelho)
- [ ] **Verificar:** Bloco **desaparece do canvas**
- [ ] **Verificar:** Painel fecha automaticamente
- [ ] **Verificar:** Console mostra:
  ```
  🗑️ Removendo bloco: intro-title-1
  ```

#### 5.2 Remover Bloco com Confirmação (se implementado)
- [ ] Se houver modal de confirmação, clicar em "Confirmar"
- [ ] **Verificar:** Bloco só é removido após confirmação

**✅ Resultado Esperado:** Remoção funciona sem erros

**❌ Se Falhar:**
- Verificar se `actions.removeBlock()` existe no adaptador
- Verificar se é alias correto para `actions.deleteBlock()`

---

### 6. ✅ NAVEGAÇÃO ENTRE ETAPAS

**Objetivo:** Verificar se painel persiste ao navegar entre etapas

#### 6.1 Navegar com Bloco Selecionado
- [ ] Selecionar um bloco na etapa atual
- [ ] **Verificar:** Painel está aberto
- [ ] Navegar para outra etapa (se aplicável)
- [ ] **Verificar:** Painel **permanece aberto** se etapa tem bloco com mesmo ID
- [ ] **Verificar:** Painel **fecha** se etapa não tem bloco selecionado

**✅ Resultado Esperado:** Comportamento consistente entre etapas

---

### 7. ✅ INTERAÇÃO COM DND (DRAG AND DROP)

**Objetivo:** Verificar se arrastar bloco não interfere com seleção

#### 7.1 Clicar vs Arrastar
- [ ] Clicar em bloco (sem mover mouse) → **Seleciona**
- [ ] Clicar e mover mouse 2px → **Ainda seleciona** (não inicia drag)
- [ ] Clicar no ícone de "arrastar" (grip) e mover → **Inicia drag** (não seleciona)
- [ ] **Verificar:** Console mostra:
  ```
  🖱️ onPointerDownCapture -> selecionar bloco
  🖱️ onClick -> selecionar bloco (fallback)
  ```

#### 7.2 Arrastar Bloco
- [ ] Segurar no ícone "grip" (6 pontos verticais)
- [ ] Arrastar bloco para nova posição
- [ ] **Verificar:** Bloco **muda de posição**
- [ ] **Verificar:** Bloco **permanece selecionado** após arrastar
- [ ] **Verificar:** Painel **não fecha** durante drag

**✅ Resultado Esperado:** Seleção e DND funcionam sem conflito

**❌ Se Falhar:**
- Verificar distância de ativação do `PointerSensor` (deve ser ~3px)
- Verificar `e.stopPropagation()` nos handlers

---

### 8. ✅ DESTAQUE VISUAL NO CANVAS

**Objetivo:** Verificar feedback visual ao selecionar bloco

#### 8.1 Destaque Aplicado
- [ ] Clicar em bloco não selecionado
- [ ] **Verificar:** Bloco ganha **borda dourada** (`ring-2 ring-[#B89B7A]`)
- [ ] **Verificar:** Borda tem **offset** (espaço entre bloco e borda)

#### 8.2 Hover
- [ ] Passar mouse sobre bloco não selecionado
- [ ] **Verificar:** Bloco ganha **borda semi-transparente** no hover
- [ ] **Verificar:** Controles aparecem (grip, delete)

#### 8.3 Múltiplos Blocos
- [ ] Selecionar bloco A → **A tem borda**
- [ ] Selecionar bloco B → **A perde borda, B ganha borda**

**✅ Resultado Esperado:** Feedback visual claro e consistente

---

### 9. ✅ VALIDAÇÃO DE DADOS (TEMPORÁRIA)

**Objetivo:** Verificar que dados inválidos não quebram o painel

#### 9.1 Dados Válidos
- [ ] Editar propriedades normalmente
- [ ] **Verificar:** Nenhum erro no console

#### 9.2 Dados Inválidos (se validação ativa)
- [ ] Tentar inserir texto em campo numérico
- [ ] **Verificar:** Campo rejeita ou converte valor
- [ ] **Verificar:** Mensagem de erro aparece (se implementado)

**⚠️ Nota:** Validação JSON Schema está temporariamente desabilitada (Fase 5)

---

## 🐛 TESTES DE REGRESSÃO

### 10. ✅ CASOS EXTREMOS

#### 10.1 Nenhum Bloco Selecionado
- [ ] Abrir editor sem selecionar bloco
- [ ] **Verificar:** Painel mostra mensagem:
  ```
  "Nenhum Componente Selecionado
   Selecione um componente no canvas para editar suas propriedades"
  ```

#### 10.2 Bloco Sem Propriedades
- [ ] Selecionar bloco que não tem propriedades editáveis
- [ ] **Verificar:** Painel mostra mensagem:
  ```
  "Sem Propriedades
   Este componente não possui propriedades editáveis"
  ```

#### 10.3 Propriedade com Valor `null`
- [ ] Selecionar bloco com propriedade `null`
- [ ] **Verificar:** Campo mostra valor padrão ou placeholder
- [ ] Editar propriedade
- [ ] **Verificar:** Valor `null` é substituído por novo valor

#### 10.4 Propriedade Aninhada
- [ ] Selecionar bloco com `content.title.text`
- [ ] **Verificar:** `getCurrentValue()` encontra valor aninhado
- [ ] Editar propriedade
- [ ] **Verificar:** Valor é salvo na estrutura aninhada correta

---

## 📊 CHECKLIST DE LOGS

Durante os testes, verificar que os seguintes logs aparecem:

### ✅ Logs Esperados
- [ ] `📝 PropertiesPanel: Block carregado`
- [ ] `🔍 ModernPropertiesPanel: Discovering properties for block: [tipo]`
- [ ] `📊 ModernPropertiesPanel: Found properties: [número]`
- [ ] `📤 ModernPropertiesPanel updating property: [key] with value: [value]`
- [ ] `🔄 Final updates to EditorContext: {...}`
- [ ] `✅ Bloco duplicado com sucesso: {...}`
- [ ] `🔄 Duplicando bloco: [id]`

### ❌ Logs de Erro (NÃO devem aparecer)
- [ ] `useEditorAdapter must be used inside EditorProvider`
- [ ] `Cannot read property 'id' of undefined`
- [ ] `Cannot read property 'properties' of null`
- [ ] `selectedBlock is undefined`
- [ ] `duplicateBlock is not a function`
- [ ] `removeBlock is not a function`

---

## 📈 CRITÉRIOS DE ACEITAÇÃO

### ✅ Teste APROVADO se:
- [ ] **10/10 testes funcionais passam** sem erros
- [ ] **Nenhum erro no console** durante testes
- [ ] **Painel renderiza** em < 500ms após clicar em bloco
- [ ] **Propriedades atualizam** em tempo real (< 300ms debounce)
- [ ] **Ações (duplicar/remover)** funcionam 100% das vezes
- [ ] **Destaque visual** aparece em 100% dos cliques

### ⚠️ Teste COM RESSALVAS se:
- [ ] 8-9/10 testes passam (bugs menores)
- [ ] 1-2 erros não-críticos no console
- [ ] Alguma funcionalidade lenta (> 1s)

### ❌ Teste REPROVADO se:
- [ ] < 8/10 testes passam
- [ ] Erros críticos no console (crashes)
- [ ] Painel não renderiza
- [ ] Propriedades não salvam
- [ ] Ações (duplicar/remover) quebram

---

## 🔍 DEBUGGING

Se algum teste falhar, verificar:

### 1. Contexto do Editor
```typescript
// No console do navegador:
window.__EDITOR_DEBUG__ = true;

// Deve mostrar:
// - state.selectedBlockId
// - state.blocks
// - selectedBlock computado
```

### 2. Adaptador
```typescript
// Verificar se adaptador está funcionando:
import { useEditorAdapter } from '@/hooks/useEditorAdapter';

const editor = useEditorAdapter();
console.log('Adapter:', editor);
// Deve ter: actions.duplicateBlock, actions.removeBlock
```

### 3. Props do Painel
```typescript
// Em ModernPropertiesPanel.tsx, adicionar:
console.log('Props:', { selectedBlock, effectiveSelectedBlock });
// effectiveSelectedBlock nunca deve ser null quando bloco selecionado
```

---

## 📝 RELATÓRIO DE TESTES

Após completar todos os testes, preencher:

**Data:** ___/___/______  
**Testador:** _______________  
**Versão Testada:** 1.0.0  

**Resultado Geral:** [ ] ✅ APROVADO | [ ] ⚠️ COM RESSALVAS | [ ] ❌ REPROVADO

**Testes Passados:** ___/10  
**Erros Encontrados:** ___  

**Principais Problemas:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Comentários Adicionais:**
_____________________________________________________
_____________________________________________________

---

**Próxima Ação:** Se todos os testes passarem, iniciar **FASE 2** (Consolidar Interfaces)
