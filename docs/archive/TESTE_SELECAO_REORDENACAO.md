# 🧪 Plano de Testes - Seleção e Reordenação de Blocos

## ✅ Correções Aplicadas

### 1. **Aninhamento Reduzido**
- **Antes:** 7 níveis de profundidade
- **Depois:** 6 níveis (dentro do aceitável)
- **Mudança:** Substituiu `<div>` wrapper desnecessário por `<Fragment>` no preview

### 2. **Race Condition Corrigida**
- **Problema:** `loadedTemplate` nas dependencies causava loop
- **Solução:** Removido das deps, apenas `safeCurrentStep` e `props.templateId`
- **Resultado:** Re-render apenas quando step realmente muda

### 3. **Loading State Gerenciado**
- **Problema:** Interface ficava travada durante mudança de step
- **Solução:** 
  - Adicionado debounce de 50ms
  - Adicionado wrapper `pointer-events-none` durante loading
  - Feedback visual melhorado com mensagem de "Carregando etapa..."

### 4. **CSS Isolation**
- **Problema:** Z-index e pointer-events conflitantes
- **Solução:**
  - Adicionado `isolation: isolate` nos blocos
  - Hierarquia clara: bloco(1) → hover(10) → selected(20) → buttons(30)
  - `pointer-events: auto !important` em botões
  - `pointer-events: none !important` durante loading

---

## 🎯 Testes Manuais (Browser)

### Teste 1: Mudança de Etapa
**Objetivo:** Verificar se a transição entre steps não trava

1. Abrir editor com template carregado
2. Clicar em diferentes etapas no navegador lateral
3. **Resultado Esperado:**
   - ✅ Mensagem "Carregando etapa..." aparece brevemente
   - ✅ Canvas atualiza com novos blocos
   - ✅ Não há travamento ou loop infinito
   - ✅ Console não mostra erros

**Verificar no Console:**
```
🔍 [QuizModularEditor] Preparando template (lazy): quiz21StepsComplete
✅ [QuizModularEditor] Template preparado (lazy): 21 steps
```

---

### Teste 2: Seleção de Blocos
**Objetivo:** Verificar se cliques funcionam em qualquer parte do bloco

#### 2.1 Clique no centro do bloco
1. Clicar no meio de um bloco (área de conteúdo)
2. **Esperado:** Bloco fica com borda azul (selecionado)

#### 2.2 Clique na imagem
1. Clicar diretamente na imagem dentro de um bloco
2. **Esperado:** Bloco fica selecionado (não a imagem)

#### 2.3 Clique no texto
1. Clicar em um título ou parágrafo dentro do bloco
2. **Esperado:** Bloco fica selecionado

#### 2.4 Clique nos botões de ação
1. Hover no bloco (aparecem botões laterais)
2. Clicar em "Deletar" ou "Duplicar"
3. **Esperado:** Ação executada SEM selecionar o bloco

**Verificar CSS no DevTools:**
```css
[data-testid="canvas-block"] {
  z-index: 1;
  isolation: isolate; /* ✅ Deve estar presente */
}

[data-testid="canvas-block"]:hover {
  z-index: 10;
}

[data-testid="canvas-block"] img {
  pointer-events: none; /* ✅ Não deve interceptar clicks */
}
```

---

### Teste 3: Reordenação via UI
**Objetivo:** Verificar se botões ↑/↓ funcionam

1. Hover em um bloco (aparecem controles laterais)
2. Clicar em "↑" (mover para cima)
3. **Esperado:** Bloco sobe 1 posição
4. Clicar em "↓" (mover para baixo)
5. **Esperado:** Bloco desce 1 posição

**Verificar no State:**
- Painel de propriedades atualiza corretamente
- Ordem dos blocos no array reflete a mudança

---

### Teste 4: Drag & Drop (se implementado)
**Objetivo:** Verificar se arrastar funciona

1. Clicar e segurar no handle de grip (☰)
2. Arrastar para nova posição
3. **Esperado:** 
   - Overlay de drag aparece
   - Bloco move para nova posição ao soltar
   - Não há glitches visuais

---

### Teste 5: Performance Visual
**Objetivo:** Verificar se não há flickering ou blur

#### 5.1 Qualidade de Imagem
1. Inspecionar imagens no canvas
2. **Esperado:** Imagens nítidas (não embaçadas)

**Verificar CSS aplicado:**
```css
[data-testid="canvas-block"] img {
  transform: none !important; /* ✅ Sem transforms */
  image-rendering: auto;
  backface-visibility: visible !important;
}
```

#### 5.2 Paint Flashing
1. Abrir DevTools → Rendering → Paint flashing
2. Mudar de etapa
3. **Esperado:** 
   - Apenas canvas pisca (verde)
   - Sidebar e header NÃO piscam

---

## 🐛 Troubleshooting

### Se ainda travar ao mudar de etapa:

1. **Verificar console:**
   ```
   ❌ [QuizModularEditor] lazyLoadStep falhou: ...
   ```
   - Problema no templateService

2. **Verificar network:**
   - Requests travados?
   - Timeouts?

3. **Verificar React DevTools:**
   - `isLoadingStep` fica eternamente `true`?
   - `currentStep` mudando muito rápido?

### Se seleção não funcionar:

1. **Inspecionar elemento:**
   ```html
   <div data-testid="canvas-block" style="pointer-events: none">
   ```
   - Se `pointer-events: none` no bloco → CSS conflito

2. **Verificar z-index:**
   ```
   Botão: z-index: 30 ✅
   Bloco: z-index: 1 ✅
   ```
   - Se invertido → cliques vão para lugar errado

3. **Verificar event listeners:**
   ```js
   onClick={() => !isPreviewMode && onBlockSelect?.(block.id)}
   ```
   - Deve estar presente no elemento correto

---

## 📊 Métricas de Sucesso

### Funcional
- ✅ Mudança de etapa em < 200ms
- ✅ Seleção responsiva (< 50ms)
- ✅ Reordenação sem erros
- ✅ Zero loops infinitos
- ✅ Zero erros no console

### Visual
- ✅ Imagens nítidas (não embaçadas)
- ✅ Feedback visual claro de seleção
- ✅ Animações suaves (sem jank)
- ✅ Paint apenas no canvas necessário

### Código
- ✅ Aninhamento ≤ 6 níveis
- ✅ Z-index hierárquico sem duplicatas
- ✅ Pointer-events consistente
- ✅ Cleanup adequado em useEffect

---

## 🚀 Próximos Passos

Se tudo passar:
1. ✅ Commitar mudanças
2. ✅ Atualizar documentação
3. ✅ Marcar issues como resolvidas

Se houver falhas:
1. 🔍 Identificar qual teste falhou
2. 🐛 Debug específico do problema
3. 🔧 Aplicar correção adicional
4. 🔄 Re-testar
