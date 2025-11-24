# 🔄 Fluxo de Dados: Edição → Publicação

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODO: EDIÇÃO AO VIVO (Ctrl+1)                │
│                                                                  │
│  [PropertiesColumn]  ─────►  [WYSIWYG Bridge]  ────►  [Canvas]  │
│    (Edita props)              (Estado local)        (Renderiza)  │
│                                     │                             │
│                                     │ Auto-save (2s debounce)     │
│                                     ▼                             │
│                            [useQueuedAutosave]                    │
│                                     │                             │
│                                     │ saveStepBlocks()            │
│                                     ▼                             │
│                            [useEditorPersistence]                 │
│                                     │                             │
│                                     │ funnelService.saveStepBlocks│
│                                     ▼                             │
│                              [FunnelService]                      │
│                                     │                             │
│                                     │ Persiste no backend         │
│                                     ▼                             │
│                         ┌─────────────────────┐                  │
│                         │  Supabase / Storage │                  │
│                         │  (Dados publicados) │                  │
│                         └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    MODO: PUBLICADO (Ctrl+2)                     │
│                                                                  │
│  [PreviewPanel]  ◄──── [blocks do SuperUnified] ◄──── Backend   │
│  (Somente leitura)     (Dados salvos/publicados)                │
│                                                                  │
│  • Não mostra wysiwyg.state.blocks (edições locais)             │
│  • Mostra blocks do getStepBlocks() (dados persistidos)         │
│  • Sem dirty indicator                                          │
│  • Sem edição                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔍 Análise Detalhada do Fluxo

### 1️⃣ Modo Edição ao Vivo (`previewMode === 'live'`)

**Fonte de Dados:** `wysiwyg.state.blocks` (estado local WYSIWYG)

```tsx
// QuizModularEditor/index.tsx (linha ~1965)
previewMode === 'live' ? (
  <CanvasColumn
    blocks={virtualization.isVirtualized 
      ? virtualization.visibleBlocks 
      : wysiwyg.state.blocks  // ← DADOS LOCAIS (não salvos)
    }
    // ... editável, permite drag-drop, etc
  />
) : (
  <PreviewPanel
    blocks={blocks}  // ← DADOS PERSISTIDOS
    // ... somente leitura
  />
)
```

**Ciclo de Vida:**

```javascript
1. Usuário edita propriedade no PropertiesColumn
   ↓
2. PropertiesColumn chama handleWYSIWYGBlockUpdate()
   ↓
3. handleWYSIWYGBlockUpdate chama wysiwyg.actions.updateBlockProperties()
   ↓
4. useWYSIWYG atualiza blocksRef.current (React 18 mutable ref)
   ↓
5. Canvas re-renderiza INSTANTANEAMENTE (< 16ms) com novo conteúdo
   ↓
6. useWYSIWYG detecta mudança e marca isDirty = true
   ↓
7. Após 2s de inatividade, onAutoSave é disparado
   ↓
8. queueAutosave() chama useEditorPersistence.saveStepBlocks()
   ↓
9. funnelService.saveStepBlocks() persiste no backend
   ↓
10. Após sucesso, isDirty = false, dot laranja desaparece
```

**Indicadores Visuais:**
- ✅ Badge: "📝 Editando" (azul)
- ✅ Dot laranja quando `isDirty === true`
- ✅ Canvas editável (drag-drop, propriedades)
- ✅ Validação ativa

---

### 2️⃣ Modo Publicado (`previewMode === 'production'`)

**Fonte de Dados:** `blocks` do SuperUnified (via `getStepBlocks()`)

```tsx
// QuizModularEditor/index.tsx (linha ~872)
const rawBlocks = getStepBlocks(safeCurrentStep);
const blocks: Block[] = Array.isArray(rawBlocks) ? rawBlocks : [];

// Linha ~2005
<PreviewPanel
  blocks={blocks}  // ← Sempre dados persistidos
  previewMode={previewMode}
/>
```

**Ciclo de Vida:**

```javascript
1. Usuário pressiona Ctrl+2 (ou clica no botão "Publicado")
   ↓
2. previewMode muda para 'production'
   ↓
3. Canvas troca de CanvasColumn para PreviewPanel
   ↓
4. PreviewPanel recebe blocks do getStepBlocks() (dados persistidos)
   ↓
5. Renderiza conteúdo SOMENTE LEITURA
   ↓
6. Não mostra edições locais não salvas (wysiwyg.state.blocks)
```

**Indicadores Visuais:**
- ✅ Badge: "✅ Publicado" (verde)
- ❌ Sem dot laranja (isDirty não aplicável)
- ❌ Canvas não editável (somente visualização)
- ❌ Validação desativada

---

## 🔄 Paridade entre Edição e Publicação

### ⚠️ PROBLEMA ATUAL: Dados Não Sincronizados

**Situação:**
```
Edição Local (wysiwyg.state.blocks)  ≠  Dados Publicados (getStepBlocks())
         ↑                                        ↑
    Estado temporário                      Estado persistido
    Muda instantaneamente                  Só muda após save
    Não visível no modo "Publicado"        Visível em ambos modos
```

### ✅ SOLUÇÃO: Auto-save garante paridade

**Fluxo correto:**

```javascript
// 1. Edição instantânea
wysiwyg.actions.updateBlockProperties(id, { text: 'Novo texto' })
// ➜ Canvas atualiza IMEDIATAMENTE (WYSIWYG)

// 2. Auto-save (após 2s)
await queueAutosave(stepKey, wysiwyg.state.blocks)
// ➜ Persiste no backend via funnelService

// 3. Sincronização com SuperUnified
setStepBlocks(currentStep, blocks)
// ➜ Atualiza estado global (getStepBlocks retorna os mesmos dados)

// 4. Paridade alcançada! 🎉
wysiwyg.state.blocks === getStepBlocks(currentStep)
```

**Cenários:**

| Ação | Edição ao Vivo (Live) | Publicado (Production) |
|------|------------------------|------------------------|
| **Antes do save** | Mostra edições locais (`wysiwyg.state.blocks`) | Mostra versão antiga (`blocks` persistidos) |
| **Após auto-save** | Mostra edições salvas | Mostra MESMA versão (dados sincronizados) |
| **Após Ctrl+2 → Ctrl+1** | Volta para edição com dados salvos | - |

---

## 🚨 Casos de Atenção

### 1. Edições Não Salvas

**Problema:** Usuário edita e imediatamente pressiona Ctrl+2

```javascript
// Edição ao vivo
wysiwyg.state.blocks = [{ id: '1', text: 'Novo texto' }]  // Local

// Pressiona Ctrl+2 ANTES do auto-save (< 2s)
blocks = [{ id: '1', text: 'Texto antigo' }]  // Backend

// ⚠️ Preview mostra texto ANTIGO!
```

**Solução Atual:**
- Dot laranja indica mudanças não salvas
- Usuário deve aguardar 2s ou salvar manualmente antes de visualizar

**Solução Futura:**
- Mostrar banner: "⚠️ Há mudanças não salvas. Aguarde ou salve antes de visualizar."

---

### 2. Snapshot Recovery

**Cenário:** Browser fecha antes do auto-save

```javascript
// 1. Usuário edita
wysiwyg.state.blocks = [blocos editados]

// 2. Snapshot é salvo em localStorage (a cada 5min)
snapshot.saveSnapshot(blocks, viewport, mode, step)

// 3. Browser fecha SEM auto-save

// 4. Reabre editor
const recovered = snapshot.recoverSnapshot()
// ➜ Prompt: "Encontrado draft não salvo de 30s atrás. Deseja recuperar?"

// 5. Se aceitar
wysiwyg.actions.reset(recovered.blocks)
// ➜ Edições são restauradas no estado local
```

**Paridade:** Snapshot restaura edições locais, mas NÃO persiste automaticamente. Usuário precisa aguardar auto-save ou salvar manualmente.

---

### 3. Múltiplas Abas / Colaboração

**⚠️ LIMITAÇÃO ATUAL:** Sistema é single-user, sem sincronização em tempo real.

```javascript
// Aba 1: Edita texto
wysiwyg.actions.updateBlockProperties(id, { text: 'Aba 1' })

// Aba 2: Edita MESMO bloco
wysiwyg.actions.updateBlockProperties(id, { text: 'Aba 2' })

// ⚠️ CONFLITO: Última aba a salvar sobrescreve a primeira!
```

**Solução Futura:** WebSocket/SSE para sincronização em tempo real (próximo passo na roadmap).

---

## 📊 Resumo da Paridade

### ✅ Quando há paridade:

- [ ] ✅ Após auto-save (2s de inatividade)
- [ ] ✅ Após salvamento manual (`Ctrl+S` ou botão Salvar)
- [ ] ✅ Quando não há edições locais (acabou de carregar)

### ⚠️ Quando NÃO há paridade:

- [ ] ❌ Durante edição (antes de 2s de inatividade)
- [ ] ❌ Após snapshot recovery (até próximo save)
- [ ] ❌ Quando há mudanças não salvas (`isDirty === true`)

### 🎯 Como verificar paridade:

```javascript
// Console do browser
const localBlocks = wysiwyg.state.blocks
const persistedBlocks = getStepBlocks(currentStep)

// Comparar
console.log('Paridade:', JSON.stringify(localBlocks) === JSON.stringify(persistedBlocks))

// Verificar dirty state
console.log('Há mudanças não salvas:', wysiwyg.state.isDirty)
```

---

## 🚀 Roadmap: Melhorias de Paridade

### Fase 1: Indicadores Visuais (✅ COMPLETO)
- [x] Dot laranja para mudanças não salvas
- [x] Badge mostrando modo atual
- [x] Snapshot recovery button

### Fase 2: Preview Melhorado (🔄 PRÓXIMO)
- [ ] Banner de aviso quando há mudanças não salvas
- [ ] Opção "Salvar e Visualizar" (força save antes de preview)
- [ ] Diff visual mostrando diferenças entre local e publicado

### Fase 3: Sincronização em Tempo Real (⏳ FUTURO)
- [ ] WebSocket/SSE para múltiplas abas
- [ ] Indicador de conflitos de edição
- [ ] Merge automático de mudanças não conflitantes

---

## 📚 Referências

- **Código:** `/src/components/editor/quiz/QuizModularEditor/index.tsx`
- **Hooks:** `/src/hooks/useWYSIWYG.ts`, `/src/hooks/useWYSIWYGBridge.ts`
- **Persistência:** `/src/components/editor/quiz/QuizModularEditor/hooks/useEditorPersistence.ts`
- **Service:** `/src/services/canonical/FunnelService.ts`
- **Tests:** `/docs/WYSIWYG_TESTING_GUIDE.md`
