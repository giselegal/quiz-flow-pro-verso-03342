# 🧪 Guia de Teste - Sistema WYSIWYG

## ✅ Checklist de Validação

### 1. Edição WYSIWYG Instantânea

**Objetivo:** Verificar se mudanças aparecem instantaneamente no canvas.

**Passos:**
1. Abrir editor: `http://localhost:5173/editor`
2. Adicionar um bloco de texto
3. Clicar no bloco para selecioná-lo
4. No painel de propriedades (direita), alterar o texto
5. **Resultado esperado:** Canvas atualiza INSTANTANEAMENTE (< 16ms, sem delay perceptível)

**Comandos de teste:**
```typescript
// Console do browser
wysiwyg.state.blocks // Ver blocos atuais
wysiwyg.state.isDirty // Ver se há mudanças não salvas
```

---

### 2. Viewport Responsivo

**Objetivo:** Testar alternância entre tamanhos de tela.

**Passos:**
1. Clicar no ViewportSelector (toolbar superior)
2. Testar cada opção:
   - Mobile (375px) - `Ctrl+Alt+1`
   - Tablet (768px) - `Ctrl+Alt+2`
   - Desktop (1280px) - `Ctrl+Alt+3`
   - Full Width - `Ctrl+Alt+0`
3. **Resultado esperado:** Canvas redimensiona com animação suave (300ms)

**Atalhos:**
- `Ctrl+Alt+1` → Mobile
- `Ctrl+Alt+2` → Tablet
- `Ctrl+Alt+3` → Desktop
- `Ctrl+Alt+0` → Full

---

### 3. Modos de Visualização

**Objetivo:** Validar 2 modos (Edição ao vivo e Publicado).

**Passos:**

#### Modo Edição ao vivo (Ctrl+1) - PADRÃO
1. Pressionar `Ctrl+1`
2. **Resultado esperado:**
   - Badge: "📝 Editando" (azul)
   - Canvas editável com WYSIWYG
   - Validação ativa
   - Dot laranja se houver mudanças não salvas
   - Mudanças aparecem instantaneamente no canvas

#### Modo Publicado (Ctrl+2)
1. Pressionar `Ctrl+2`
2. **Resultado esperado:**
   - Badge: "✅ Publicado" (verde)
   - Canvas NÃO editável (modo preview)
   - Mostra apenas dados salvos no backend
   - Sem indicador de mudanças pendentes

---

### 4. Auto-save & Snapshots

**Objetivo:** Verificar salvamento automático e recuperação de drafts.

**Passos:**

#### Auto-save
1. Editar um bloco
2. Aguardar 2 segundos
3. **Resultado esperado:**
   - Console mostra: `✅ [Autosave] Step salvo: step-XX`
   - Dot laranja desaparece (isDirty = false)

#### Snapshot Recovery
1. Editar vários blocos
2. **Fechar o browser SEM salvar** (ou simular crash)
3. Reabrir o editor
4. **Resultado esperado:**
   - Botão "💾 Recuperar draft (Xs)" aparece na toolbar
   - Clicar no botão restaura as mudanças

**Teste manual de snapshot:**
```javascript
// Console do browser
localStorage.getItem('editor-snapshot:template-id') // Ver snapshot salvo
```

---

### 5. Validação Visual

**Objetivo:** Verificar se erros aparecem visualmente nos blocos.

**Passos:**
1. Criar um bloco de texto
2. Limpar o campo de texto (deixar vazio)
3. **Resultado esperado:**
   - Bloco mostra componente `BlockValidationError`
   - Background vermelho
   - Ícone de alerta
   - Lista de erros

**Verificar validação:**
```javascript
// Console do browser
wysiwyg.state.validationErrors // Map com erros por bloco
```

---

### 6. Keyboard Shortcuts

**Objetivo:** Validar todos os atalhos de teclado.

| Atalho | Ação | Como Testar |
|--------|------|-------------|
| `Ctrl+1` | Modo Edit | Pressionar e verificar badge "✏️ Editando" |
| `Ctrl+2` | Preview Live | Pressionar e verificar badge "📝 Editor" |
| `Ctrl+3` | Preview Production | Pressionar e verificar badge "✅ Publicado" |
| `Ctrl+Alt+1` | Viewport Mobile | Canvas anima para 375px |
| `Ctrl+Alt+2` | Viewport Tablet | Canvas anima para 768px |
| `Ctrl+Alt+3` | Viewport Desktop | Canvas anima para 1280px |
| `Ctrl+Alt+0` | Viewport Full | Canvas expande para 100% |
| `Ctrl+Z` | Undo | Desfaz última ação |
| `Ctrl+Y` | Redo | Refaz ação desfeita |

---

## 🐛 Troubleshooting

### Canvas não atualiza instantaneamente
```javascript
// 1. Verificar se WYSIWYG está ativo
console.log(wysiwyg.state.blocks.length)

// 2. Verificar se PropertiesColumn está chamando actions
// Abrir DevTools → Sources → src/components/editor/quiz/QuizModularEditor/index.tsx
// Colocar breakpoint em wysiwyg.actions.updateBlockProperties()
```

### Auto-save não funciona
```javascript
// Verificar se auto-save está habilitado
console.log(enableAutoSave) // deve ser true

// Verificar console por logs de autosave
// Aguardar 2s após editar e procurar por:
// "💾 [Autosave] Salvando step-XX..."
// "✅ [Autosave] Step salvo: step-XX"
```

### Snapshot não aparece
```javascript
// Verificar localStorage
Object.keys(localStorage).filter(k => k.includes('snapshot'))

// Verificar se snapshot foi salvo
const snap = localStorage.getItem('editor-snapshot:YOUR_RESOURCE_ID')
console.log(JSON.parse(snap))
```

---

## 📊 Métricas de Performance

### Benchmarks Esperados

| Operação | Tempo Esperado | Como Medir |
|----------|----------------|------------|
| Update property → canvas | < 16ms (1 frame) | Chrome DevTools Performance |
| Viewport switch | 300ms (animated) | Visual (transition suave) |
| Auto-save (100 blocos) | < 50ms | Console logs |
| Snapshot save | < 10ms | Chrome DevTools Performance |
| Full validation | < 200ms | wysiwyg.state.validationErrors |

### Como Medir Performance

```javascript
// Medir tempo de atualização
console.time('wysiwyg-update');
wysiwyg.actions.updateBlockProperties('block-id', { text: 'Novo texto' });
console.timeEnd('wysiwyg-update'); // Deve ser < 16ms
```

---

## ✅ Critérios de Aceitação

Sistema está funcionando se:

- [ ] ✅ Edição instantânea (mudanças aparecem no canvas sem delay)
- [ ] ✅ 4 viewports funcionam com animação suave
- [ ] ✅ 3 modos mostram badges corretos
- [ ] ✅ Auto-save ocorre após 2s de inatividade
- [ ] ✅ Snapshot salva e recupera corretamente
- [ ] ✅ Validação mostra erros visualmente
- [ ] ✅ Todos os 9 atalhos de teclado funcionam
- [ ] ✅ Dot laranja aparece quando há mudanças não salvas
- [ ] ✅ Botão de recuperar draft aparece quando há snapshot

---

## 🚀 Próximos Passos

Se todos os testes passarem:

1. **Performance Optimization** - React.memo, useMemo, useCallback
2. **Preview Externo** - WebSocket/SSE para live updates
3. **Testes E2E** - Playwright para automação
4. **Documentação de API** - JSDoc completo em todos os hooks

---

**Versão:** 1.0.0  
**Data:** 24 Nov 2025
