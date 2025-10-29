# 🚀 Arquitetura de Migração para Next.js - Quiz Flow Pro

## 📊 Estado Atual da Arquitetura

### Estrutura Existente (React + Vite)

```
src/
├── components/
│   ├── core/
│   │   └── quiz-modular/                    ← Wrappers lazy (produção)
│   │       ├── ModularIntroStep.tsx         → Lazy load via editor-bridge
│   │       ├── ModularQuestionStep.tsx
│   │       ├── ModularTransitionStep.tsx
│   │       ├── ModularResultStep.tsx
│   │       └── ModularOfferStep.tsx
│   │
│   ├── editor-bridge/                       ← Bridge pattern (isolamento)
│   │   └── quiz-modular.ts                  → Re-exports de editor/*
│   │
│   └── editor/
│       └── quiz-estilo/                     ← Implementação real (editor)
│           ├── ModularIntroStep.tsx         → Componente completo
│           ├── ModularQuestionStep.tsx      → 508 linhas + DnD
│           ├── ModularTransitionStep.tsx
│           ├── ModularResultStep.tsx
│           └── ModularOfferStep.tsx
```

### Problema: Dependências de Editor em Produção

```typescript
// ❌ PROBLEMA ATUAL
// components/core/quiz-modular/ModularIntroStep.tsx
const Inner = React.lazy(() => 
    import('@/components/editor-bridge/quiz-modular')  // Bridge
        .then(m => ({ default: m.ModularIntroStep }))   // Re-export
);

// editor-bridge/quiz-modular.ts
export { default as ModularIntroStep } 
    from '@/components/editor/quiz-estilo/ModularIntroStep';  // ← Depende de editor!

// components/editor/quiz-estilo/ModularIntroStep.tsx
import { useEditor } from '@/components/editor/EditorProviderUnified';  // ← Pesado!
import { DndContext, SortableContext } from '@dnd-kit/core';            // ← Desnecessário em produção
```

**Consequência**: Código do editor é carregado mesmo em páginas públicas (produção).

---

## ✅ RESPOSTA: SIM, Devem Ser Separados!

### Razões para Separação

| Aspecto | Editor | Produção (Público) |
|---------|--------|-------------------|
| **Interatividade** | Drag & drop, seleção, propriedades | Apenas navegação e respostas |
| **Dependências** | DnD-kit, EditorProvider, callbacks | React, navegação básica |
| **Bundle Size** | ~500KB+ (editor completo) | ~50KB (quiz runtime) |
| **SSR (Next.js)** | Não necessário | Essencial para SEO |
| **Re-renderização** | Frequente (edição) | Mínima (performance) |

---

## 🏗️ Arquitetura Recomendada para Next.js

### Estrutura de Diretórios Next.js

```
quiz-flow-nextjs/
├── app/                                      ← App Router (Next.js 14+)
│   ├── (public)/                            ← Grupo de rotas públicas
│   │   ├── quiz/
│   │   │   └── [quizId]/
│   │   │       └── page.tsx                 → Página pública do quiz
│   │   └── layout.tsx                       → Layout público (sem editor)
│   │
│   ├── (editor)/                            ← Grupo de rotas de editor
│   │   ├── editor/
│   │   │   └── [funnelId]/
│   │   │       └── page.tsx                 → Editor completo
│   │   └── layout.tsx                       → Layout com EditorProvider
│   │
│   └── api/                                 ← API Routes (Supabase, etc)
│       ├── quiz/[quizId]/route.ts
│       └── funnels/[funnelId]/route.ts
│
├── components/
│   ├── quiz/                                ← Componentes PÚBLICOS (SSR)
│   │   ├── steps/
│   │   │   ├── IntroStep.tsx               → SEM editor, SEM DnD
│   │   │   ├── QuestionStep.tsx            → Apenas lógica de quiz
│   │   │   ├── TransitionStep.tsx
│   │   │   ├── ResultStep.tsx
│   │   │   └── OfferStep.tsx
│   │   │
│   │   ├── blocks/                         ← Blocos atômicos (SSR-safe)
│   │   │   ├── IntroLogo.tsx
│   │   │   ├── IntroTitle.tsx
│   │   │   ├── QuestionHeader.tsx
│   │   │   ├── OptionsGrid.tsx            → Sem drag & drop
│   │   │   └── NavigationButton.tsx
│   │   │
│   │   └── QuizRenderer.tsx                → Renderizador público
│   │
│   └── editor/                             ← Componentes de EDITOR (client-only)
│       ├── steps/
│       │   ├── ModularIntroStep.tsx        → COM editor, COM DnD
│       │   ├── ModularQuestionStep.tsx     → 508 linhas + callbacks
│       │   ├── ModularTransitionStep.tsx
│       │   ├── ModularResultStep.tsx
│       │   └── ModularOfferStep.tsx
│       │
│       ├── blocks/
│       │   ├── SelectableBlock.tsx         → Wrapper de edição
│       │   ├── SortableBlock.tsx           → DnD wrapper
│       │   └── BlockTypeRenderer.tsx
│       │
│       └── EditorCanvas.tsx                → Canvas principal
│
├── lib/
│   ├── quiz/                               ← Lógica compartilhada
│   │   ├── validation.ts
│   │   ├── scoring.ts
│   │   └── navigation.ts
│   │
│   └── supabase/                           ← Client Supabase
│       └── client.ts
│
└── public/
    └── templates/
        └── quiz21-complete.json            → Template JSON
```

---

## 🔀 Estratégia de Separação

### 1. **Componentes Públicos (SSR-Ready)**

```typescript
// components/quiz/steps/QuestionStep.tsx
'use client';  // ← Client component (mas SSR-safe)

import React from 'react';
import { OptionsGrid } from '@/components/quiz/blocks/OptionsGrid';
import { QuestionHeader } from '@/components/quiz/blocks/QuestionHeader';
import { NavigationButton } from '@/components/quiz/blocks/NavigationButton';

interface QuestionStepProps {
  data: {
    questionNumber: string;
    questionText: string;
    options: Array<{ id: string; text: string; image?: string }>;
    requiredSelections: number;
  };
  currentAnswers: string[];
  onAnswersChange: (answers: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function QuestionStep({
  data,
  currentAnswers,
  onAnswersChange,
  onNext,
  onPrev,
}: QuestionStepProps) {
  // ✅ SEM useEditor
  // ✅ SEM DnD
  // ✅ SEM callbacks de edição
  // ✅ SSR-safe

  const handleOptionClick = (optionId: string) => {
    const isSelected = currentAnswers.includes(optionId);
    const maxSelections = data.requiredSelections;

    if (isSelected) {
      onAnswersChange(currentAnswers.filter(id => id !== optionId));
    } else if (currentAnswers.length < maxSelections) {
      onAnswersChange([...currentAnswers, optionId]);
    } else if (maxSelections === 1) {
      onAnswersChange([optionId]);
    }
  };

  const canProceed = currentAnswers.length === data.requiredSelections;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
      <QuestionHeader
        number={data.questionNumber}
        text={data.questionText}
      />

      <OptionsGrid
        options={data.options}
        selectedIds={currentAnswers}
        onOptionClick={handleOptionClick}
        multiSelect={data.requiredSelections > 1}
      />

      <NavigationButton
        label="Continuar"
        onClick={onNext}
        disabled={!canProceed}
      />
    </div>
  );
}
```

### 2. **Componentes de Editor (Client-Only)**

```typescript
// components/editor/steps/ModularQuestionStep.tsx
'use client';  // ← Client-only (não SSR)

import React from 'react';
import { DndContext, SortableContext } from '@dnd-kit/core';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { SelectableBlock } from '@/components/editor/blocks/SelectableBlock';
import { SortableBlock } from '@/components/editor/blocks/SortableBlock';
import { BlockTypeRenderer } from '@/components/editor/blocks/BlockTypeRenderer';

interface ModularQuestionStepProps {
  data: any;
  blocks: any[];
  isEditable: boolean;
  selectedBlockId?: string;
  onBlockSelect?: (blockId: string) => void;
  onEdit?: (field: string, value: any) => void;
  onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
  onOpenProperties?: (blockId: string) => void;
  currentAnswers: string[];
  onAnswersChange: (answers: string[]) => void;
}

export default function ModularQuestionStep({
  data,
  blocks,
  isEditable,
  selectedBlockId,
  onBlockSelect,
  onEdit,
  onBlocksReorder,
  onOpenProperties,
  currentAnswers,
  onAnswersChange,
}: ModularQuestionStepProps) {
  // ✅ COM useEditor
  // ✅ COM DnD
  // ✅ COM callbacks de edição
  // ❌ NÃO SSR-safe (client-only)

  const editor = useEditor({ optional: true });

  const handleDragEnd = (event: any) => {
    // ... lógica de drag & drop
    onBlocksReorder?.(data.id, newOrder);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map(b => b.id)}>
        {blocks.map((block) => (
          <SortableBlock key={block.id} id={block.id}>
            <SelectableBlock
              blockId={block.id}
              isSelected={selectedBlockId === block.id}
              isEditable={isEditable}
              onSelect={() => onBlockSelect?.(block.id)}
              onOpenProperties={() => onOpenProperties?.(block.id)}
            >
              <BlockTypeRenderer
                block={block}
                contextData={{ currentAnswers, onAnswersChange }}
              />
            </SelectableBlock>
          </SortableBlock>
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

---

## 🔄 Padrão de Composição (Renderização Condicional)

```typescript
// app/(public)/quiz/[quizId]/page.tsx
import { QuizRenderer } from '@/components/quiz/QuizRenderer';

export default async function PublicQuizPage({ params }: { params: { quizId: string } }) {
  const quizData = await fetchQuizData(params.quizId);  // ← Server Component

  return <QuizRenderer initialData={quizData} />;  // ← Client Component
}

// app/(editor)/editor/[funnelId]/page.tsx
'use client';

import { EditorProviderUnified } from '@/components/editor/EditorProviderUnified';
import { EditorCanvas } from '@/components/editor/EditorCanvas';

export default function EditorPage({ params }: { params: { funnelId: string } }) {
  return (
    <EditorProviderUnified funnelId={params.funnelId}>
      <EditorCanvas />  {/* ← Usa ModularQuestionStep com DnD */}
    </EditorProviderUnified>
  );
}
```

---

## 📦 Separação de Bundles (Code Splitting)

### Configuração Next.js

```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@dnd-kit/core', '@dnd-kit/sortable'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Separar bundle do editor
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            editor: {
              test: /[\\/]components[\\/]editor[\\/]/,
              name: 'editor',
              chunks: 'all',
              priority: 10,
            },
            quiz: {
              test: /[\\/]components[\\/]quiz[\\/]/,
              name: 'quiz',
              chunks: 'all',
              priority: 5,
            },
          },
        },
      };
    }
    return config;
  },
};
```

### Resultado Esperado

```
Bundle Size Analysis:
┌─────────────────────┬─────────┬─────────────┐
│ Route               │ Size    │ First Load  │
├─────────────────────┼─────────┼─────────────┤
│ /quiz/[quizId]      │ 45 kB   │ 120 kB      │  ← Público (SSR)
│ /editor/[funnelId]  │ 580 kB  │ 750 kB      │  ← Editor (client)
└─────────────────────┴─────────┴─────────────┘
```

---

## 🎯 Plano de Migração (Fases)

### **FASE 1: Extrair Lógica de Negócio**
- [ ] Criar `lib/quiz/validation.ts` (lógica pura)
- [ ] Criar `lib/quiz/scoring.ts` (cálculo de resultados)
- [ ] Criar `lib/quiz/navigation.ts` (lógica de navegação)
- [ ] Testar isoladamente (sem React)

### **FASE 2: Criar Componentes Públicos (SSR)**
- [ ] `components/quiz/steps/IntroStep.tsx` (sem editor)
- [ ] `components/quiz/steps/QuestionStep.tsx` (sem DnD)
- [ ] `components/quiz/steps/TransitionStep.tsx`
- [ ] `components/quiz/steps/ResultStep.tsx`
- [ ] `components/quiz/blocks/` (blocos atômicos SSR-safe)

### **FASE 3: Migrar Componentes de Editor**
- [ ] Mover `components/editor/quiz-estilo/*` → `components/editor/steps/`
- [ ] Garantir dependências de editor explícitas
- [ ] Adicionar dynamic imports onde necessário

### **FASE 4: Setup Next.js**
- [ ] Criar app router structure
- [ ] Configurar grupos de rotas `(public)` e `(editor)`
- [ ] Setup API routes para Supabase
- [ ] Configurar middleware de autenticação

### **FASE 5: Implementar SSR**
- [ ] Server Components para buscar dados
- [ ] Client Components para interatividade
- [ ] Streaming e Suspense para performance
- [ ] Metadata e SEO otimizados

---

## 📊 Comparação: Antes vs Depois

### **Antes (Vite + React)**

```typescript
// ❌ Tudo misturado
import { ModularQuestionStep } from '@/components/core/quiz-modular';
// Carrega editor mesmo em produção via lazy + bridge

// Bundle: ~500KB (editor incluído)
// SSR: Não suportado
// Separação: Fraca (bridge pattern)
```

### **Depois (Next.js)**

```typescript
// ✅ Separação clara

// PÚBLICO (SSR)
import { QuestionStep } from '@/components/quiz/steps/QuestionStep';
// Bundle: ~45KB
// SSR: ✅ Sim
// Dependências: Apenas React

// EDITOR (Client-Only)
import { ModularQuestionStep } from '@/components/editor/steps/ModularQuestionStep';
// Bundle: ~580KB (apenas em /editor)
// SSR: ❌ Não (client-only)
// Dependências: React + DnD + EditorProvider
```

---

## ✅ Checklist de Separação

### Componente é Público (SSR)?
- [ ] Remove `useEditor`
- [ ] Remove `DnD` imports
- [ ] Remove callbacks de edição (`onBlockSelect`, `onOpenProperties`)
- [ ] Remove `SelectableBlock` / `SortableBlock`
- [ ] Mantém apenas lógica de quiz (navegação, respostas)
- [ ] Adiciona `'use client'` se precisar de interatividade
- [ ] Testa com `next build` (deve funcionar SSR)

### Componente é de Editor (Client)?
- [ ] Mantém `useEditor`
- [ ] Mantém `DnD` imports
- [ ] Mantém callbacks de edição
- [ ] Mantém `SelectableBlock` / `SortableBlock`
- [ ] Adiciona `'use client'`
- [ ] Usa `dynamic()` se necessário evitar SSR
- [ ] Bundle separado via code splitting

---

## 🚀 Recomendação Final

**SIM, os modulares devem ser DUPLICADOS (não separados, mas duplicados):**

1. **Versão Pública** (`components/quiz/steps/`) - Limpa, SSR-safe, ~45KB
2. **Versão Editor** (`components/editor/steps/`) - Completa, client-only, ~580KB

**Vantagens:**
- ✅ Zero dependências de editor em produção
- ✅ SSR funciona perfeitamente (SEO, performance)
- ✅ Bundle size otimizado (45KB vs 580KB)
- ✅ Código público é mais simples de manter
- ✅ Editor mantém toda funcionalidade complexa

**Desvantagens:**
- ⚠️ Duplicação de código (mas pequena, apenas estrutura)
- ⚠️ Manutenção paralela (mitigado por lógica compartilhada em `lib/`)

**Conclusão:** A duplicação é **intencional e benéfica** - cada versão serve propósitos diferentes.
