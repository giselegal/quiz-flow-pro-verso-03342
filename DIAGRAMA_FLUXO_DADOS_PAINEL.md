# 🎨 DIAGRAMA VISUAL: FLUXO DE DADOS DO PAINEL

**Sprint 4 - Dia 4**  
**Data:** 11 de outubro de 2025

---

## 📊 FLUXO COMPLETO (READ + WRITE)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    QUIZ MODULAR PRODUCTION EDITOR                   │
│                       (Componente Pai - Root)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐          ┌──────────────────┐                 │
│  │ ESTADO GLOBAL   │          │ HOOKS AUXILIARES │                 │
│  │                 │          │                  │                 │
│  │ steps[]         │◄─────────┤ useSelectionClip │                 │
│  │ selectedStepId  │          │ useHistoryUndo   │                 │
│  │ isDirty         │          │ useAutoSave      │                 │
│  │ headerConfig    │          │ useSnippets      │                 │
│  └─────────┬───────┘          └──────────────────┘                 │
│            │                                                         │
│            │ useMemo (derivação)                                    │
│            ▼                                                         │
│  ┌─────────────────┐          ┌──────────────────┐                 │
│  │ ESTADO DERIVADO │          │ CALLBACKS        │                 │
│  │                 │          │                  │                 │
│  │ selectedStep    │          │ onBlockPatch()   │                 │
│  │ selectedBlock   │          │ onRemoveBlock()  │                 │
│  │ clipboard       │          │ onDuplicate()    │                 │
│  └─────────┬───────┘          └────────┬─────────┘                 │
│            │                            │                           │
│            │ props ↓                    │ callbacks ↑               │
└────────────┼────────────────────────────┼───────────────────────────┘
             │                            │
             ▼                            │
┌────────────────────────────────────────┼───────────────────────────┐
│                PROPERTIES PANEL        │                           │
│              (Painel Lateral)          │                           │
├────────────────────────────────────────┼───────────────────────────┤
│                                        │                           │
│  RECEBE (props):                       │                           │
│  ✅ selectedBlock                      │                           │
│  ✅ selectedStep                       │                           │
│  ✅ headerConfig                       │                           │
│  ✅ clipboard                          │                           │
│  ✅ multiSelectedIds                   │                           │
│                                        │                           │
│  ┌──────────────────────┐             │                           │
│  │ ROTEAMENTO           │             │                           │
│  │                      │             │                           │
│  │ if (isQuestionBlock) │─────────────┤                           │
│  └──────────┬───────────┘             │                           │
│             │                          │                           │
│             ├─ YES ──►                 │                           │
│             │                          │                           │
│   ┌─────────▼──────────────────────┐  │                           │
│   │  QUESTION PROPERTY EDITOR      │  │                           │
│   │  (Editor Especializado)        │  │                           │
│   ├────────────────────────────────┤  │                           │
│   │                                │  │                           │
│   │  ┌──────────────────────────┐ │  │                           │
│   │  │ Tabs:                    │ │  │                           │
│   │  │ • Conteúdo (opções)      │ │  │                           │
│   │  │ • Validação              │ │  │                           │
│   │  │ • Comportamento          │ │  │                           │
│   │  │ • Visual                 │ │  │                           │
│   │  │ • Pontuação              │ │  │                           │
│   │  └──────────┬───────────────┘ │  │                           │
│   │             │                  │  │                           │
│   │  useState: localOptions[]     │  │                           │
│   │             │                  │  │                           │
│   │  onChange → handleOptionUpdate│  │                           │
│   │             ▼                  │  │                           │
│   │  setLocalOptions([...])       │  │                           │
│   │             │                  │  │                           │
│   │  handlePropertyChange('opts') │  │                           │
│   │             ▼                  │  │                           │
│   │  onUpdate({ options: [...] }) │──┼───► CALLBACK ────────────┤
│   │                                │  │                           │
│   └────────────────────────────────┘  │                           │
│             │                          │                           │
│             ├─ NO ───►                 │                           │
│             │                          │                           │
│   ┌─────────▼──────────────────────┐  │                           │
│   │  ENHANCED PROPERTIES PANEL     │  │                           │
│   │  (Sistema Genérico)            │  │                           │
│   ├────────────────────────────────┤  │                           │
│   │                                │  │                           │
│   │  useUnifiedProperties()        │  │                           │
│   │             │                  │  │                           │
│   │  categories.map(cat => {...}) │  │                           │
│   │             ▼                  │  │                           │
│   │  pickPropertyEditor(type)     │  │                           │
│   │             │                  │  │                           │
│   │  onChange → updateProperty()  │  │                           │
│   │             ▼                  │  │                           │
│   │  onUpdate({ key: value })     │──┼───► CALLBACK ────────────┤
│   │                                │  │                           │
│   └────────────────────────────────┘  │                           │
│                                        │                           │
│  EMITE (callbacks):                    │                           │
│  ⬆️ onBlockPatch(updates)             │                           │
│  ⬆️ onRemoveBlock()                   │                           │
│  ⬆️ onDuplicate()                     │                           │
│                                        │                           │
└────────────────────────────────────────┼───────────────────────────┘
                                         │
                                         │ callbacks ↑
                                         │
┌────────────────────────────────────────┼───────────────────────────┐
│                EDITOR PAI              │                           │
│          (processa updates)            │                           │
├────────────────────────────────────────┼───────────────────────────┤
│                                        │                           │
│  onBlockPatch(patch) {                 │                           │
│      // Separar properties vs content │                           │
│      const contentKeys = new Set(...) │                           │
│                                        │                           │
│      if (propPatch) {                  │                           │
│          updateBlockProperties(...)    │                           │
│      }                                 │                           │
│      if (contentPatch) {               │                           │
│          updateBlockContent(...)       │                           │
│      }                                 │                           │
│  }                                     │                           │
│             │                          │                           │
│             ▼                          │                           │
│  ┌────────────────────────┐           │                           │
│  │ updateBlockProperties  │           │                           │
│  └────────────────────────┘           │                           │
│             │                          │                           │
│             ▼                          │                           │
│  setSteps(prev => {                   │                           │
│      const next = prev.map(step => {  │                           │
│          if (step.id !== stepId)      │                           │
│              return step;             │                           │
│                                        │                           │
│          return {                      │                           │
│              ...step,                  │                           │
│              blocks: step.blocks.map(│                           │
│                  block =>              │                           │
│                      block.id === id  │                           │
│                          ? {           │                           │
│                              ...block, │                           │
│                              properties: {                        │
│                                  ...block.properties,             │
│                                  ...patch  ◄─── ATUALIZAÇÃO     │
│                              }         │                           │
│                          }             │                           │
│                          : block       │                           │
│              )                         │                           │
│          };                            │                           │
│      });                               │                           │
│                                        │                           │
│      pushHistory(next);  ◄─── HISTÓRICO                          │
│      return next;                      │                           │
│  });                                   │                           │
│                                        │                           │
│  setIsDirty(true);  ◄─── DIRTY FLAG   │                           │
│                                        │                           │
└────────────────────────────────────────┴───────────────────────────┘
             │
             │ setState triggers re-render
             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         RE-RENDER CYCLE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  steps mudou ──► useMemo recalcula ──► selectedBlock atualizado    │
│                                                                       │
│  selectedBlock mudou ──► PropertiesPanel re-renderiza               │
│                                                                       │
│  QuestionPropertyEditor re-renderiza ──► useEffect atualiza local   │
│                                                                       │
│  Input mostra novo valor ✅                                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 CICLO DE VIDA DE UMA ATUALIZAÇÃO

```
1. USER INPUT
   └─► Input onChange event
       └─► handleOptionUpdate(index, { text: 'novo' })
           └─► setLocalOptions([...])  // Estado local temporário
               └─► handlePropertyChange('options', newOptions)
                   └─► onUpdate({ options: [...] })  // Callback para pai
                       └─► onBlockPatch({ options: [...] })
                           └─► updateBlockProperties(stepId, blockId, patch)
                               └─► setSteps(prev => ...)
                                   ├─► pushHistory(next)  // Undo/Redo
                                   ├─► setIsDirty(true)   // Alteração não salva
                                   └─► return next
                                       └─► RE-RENDER
                                           └─► useMemo(selectedBlock)
                                               └─► PropertiesPanel recebe novo props
                                                   └─► useEffect atualiza localOptions
                                                       └─► Input renderiza novo valor ✅
```

---

## 🎯 PONTOS-CHAVE DA ARQUITETURA

### 1. **Single Source of Truth (SSOT)**

```
❌ ERRADO:                      ✅ CORRETO:

Editor: steps[]                Editor: steps[]
  ↓                              ↓
PropertiesPanel: localSteps[]  PropertiesPanel: props.selectedBlock
  ↓                              ↓
QuestionEditor: localOptions   QuestionEditor: localOptions
                                   ↑ (sincronizado via useEffect)
```

### 2. **Unidirectional Data Flow**

```
READ:  steps → selectedBlock → PropertiesPanel → QuestionEditor → Input
                 ↓               ↓                  ↓               ↓
                useMemo         props              props          value

WRITE: Input → onChange → callback → callback → setState → steps
         ↑        ↑          ↑          ↑          ↑         ↑
       event   handler   onUpdate   onBlockPatch  setSteps  re-render
```

### 3. **Separation of Concerns**

```
┌──────────────────────┬────────────────────────────────────────┐
│ Responsabilidade     │ Componente                             │
├──────────────────────┼────────────────────────────────────────┤
│ Estado Global        │ QuizModularProductionEditor            │
│ Seleção              │ useSelectionClipboard hook             │
│ Histórico            │ useHistoryUndo hook                    │
│ UI de Propriedades   │ PropertiesPanel                        │
│ Edição de Questões   │ QuestionPropertyEditor                 │
│ Edição Genérica      │ EnhancedPropertiesPanel                │
│ Schema Unificado     │ useUnifiedProperties hook              │
│ Editores de Campo    │ pickPropertyEditor + core/*Editor.tsx  │
└──────────────────────┴────────────────────────────────────────┘
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Para criar novo campo editável:

- [x] 1. Adicionar propriedade ao tipo `QuestionProperties` (interface)
- [x] 2. Adicionar campo no `QuestionPropertyEditor` (Input/Select/etc)
- [x] 3. Criar `onChange` handler que chama `handlePropertyChange(key, value)`
- [x] 4. Verificar que `onUpdate` callback existe e funciona
- [x] 5. No Editor pai, `onBlockPatch` processa a atualização
- [x] 6. `updateBlockProperties` aplica ao estado `steps[]`
- [x] 7. `pushHistory` salva no histórico
- [x] 8. `setIsDirty(true)` marca alteração
- [x] 9. Re-render atualiza UI

### Para debugar problemas:

- [ ] 1. Verificar se `selectedBlock` tem a propriedade esperada
- [ ] 2. Adicionar `console.log` no `handlePropertyChange`
- [ ] 3. Verificar se `onUpdate` callback é chamado
- [ ] 4. Verificar se `onBlockPatch` recebe os dados
- [ ] 5. Verificar se `updateBlockProperties` atualiza o estado
- [ ] 6. Verificar se `useMemo` recalcula `selectedBlock`
- [ ] 7. Verificar se `useEffect` sincroniza `localOptions`
- [ ] 8. Inspecionar DOM para ver se Input renderiza corretamente

---

**Diagrama gerado automaticamente**  
**Sprint 4 - Dia 4**  
**Data:** 11/out/2025 05:35  
**Status:** ✅ **VISUALIZAÇÃO COMPLETA**
