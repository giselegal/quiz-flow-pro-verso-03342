# 🎯 DECISÃO: Separação de Componentes Modulares

## Resposta Direta

**SIM, os componentes modulares DEVEM ser separados em 2 versões:**

### 1. **Versão Pública (SSR)** - `components/quiz/steps/`
- ✅ Sem editor
- ✅ Sem DnD
- ✅ SSR-safe
- ✅ ~45KB bundle

### 2. **Versão Editor (Client)** - `components/editor/steps/`
- ✅ Com editor
- ✅ Com DnD
- ❌ Client-only
- ❌ ~580KB bundle

---

## 📊 Comparação Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    VERSÃO PÚBLICA (SSR)                     │
├─────────────────────────────────────────────────────────────┤
│ Localização: components/quiz/steps/QuestionStep.tsx        │
│                                                             │
│ Props:                                                      │
│   ✅ data                                                   │
│   ✅ currentAnswers                                         │
│   ✅ onAnswersChange                                        │
│   ✅ onNext / onPrev                                        │
│   ❌ onBlockSelect                                          │
│   ❌ onEdit                                                 │
│   ❌ onBlocksReorder                                        │
│   ❌ isEditable                                             │
│                                                             │
│ Dependências:                                               │
│   ✅ React                                                  │
│   ❌ useEditor                                              │
│   ❌ DnD-kit                                                │
│   ❌ SelectableBlock                                        │
│                                                             │
│ Características:                                            │
│   📦 Bundle: ~45KB                                          │
│   🚀 SSR: Sim (renderiza no servidor)                      │
│   ⚡ Performance: Otimizada                                 │
│   🔍 SEO: Conteúdo visível para crawlers                   │
│   📱 Responsivo: Sim                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  VERSÃO EDITOR (Client-Only)                │
├─────────────────────────────────────────────────────────────┤
│ Localização: components/editor/steps/ModularQuestionStep.tsx│
│                                                             │
│ Props:                                                      │
│   ✅ data                                                   │
│   ✅ blocks                                                 │
│   ✅ currentAnswers                                         │
│   ✅ onAnswersChange                                        │
│   ✅ onNext / onPrev                                        │
│   ✅ onBlockSelect       ← EDITOR                           │
│   ✅ onEdit              ← EDITOR                           │
│   ✅ onBlocksReorder     ← EDITOR                           │
│   ✅ isEditable          ← EDITOR                           │
│   ✅ selectedBlockId     ← EDITOR                           │
│   ✅ onOpenProperties    ← EDITOR                           │
│                                                             │
│ Dependências:                                               │
│   ✅ React                                                  │
│   ✅ useEditor           ← EDITOR                           │
│   ✅ DnD-kit             ← EDITOR                           │
│   ✅ SelectableBlock     ← EDITOR                           │
│   ✅ SortableBlock       ← EDITOR                           │
│                                                             │
│ Características:                                            │
│   📦 Bundle: ~580KB                                         │
│   🚀 SSR: Não (client-only)                                │
│   ⚡ Performance: Pesado (features complexas)               │
│   🔍 SEO: Não aplicável (área privada)                     │
│   🎨 Editor: Completo (drag & drop, seleção, etc)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Lógica Compartilhada

```
lib/quiz/
├── validation.ts       ← Usado por AMBAS versões
├── scoring.ts          ← Usado por AMBAS versões
├── navigation.ts       ← Usado por AMBAS versões
└── utils.ts            ← Usado por AMBAS versões

✅ Evita duplicação de lógica de negócio
✅ Apenas UI é duplicada (intencionalmente)
```

---

## 📈 Ganhos da Separação

### Performance
- Público: **90% mais leve** (45KB vs 580KB)
- Editor: **100% funcional** (todas features)

### SEO
- Público: **100% indexável** (SSR completo)
- Editor: **Não aplicável** (área privada)

### Manutenção
- Lógica: **Centralizada** em `lib/`
- UI: **Separada** por propósito
- Testes: **Isolados** por contexto

---

## ✅ Próximos Passos

1. ✅ Correções aplicadas em `UnifiedStepContent.tsx`
2. 📝 Documentação criada (`ARQUITETURA_MIGRACAO_NEXTJS.md`)
3. 💡 Exemplos práticos criados (`examples/`)
4. 🚀 Pronto para migração Next.js

**Recomendação:** Implementar migração em fases, começando por componentes públicos.
