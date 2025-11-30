# 🚀 PLANO DE IMPLEMENTAÇÃO: EDITOR MODERNO DE QUIZ

**Data:** 30 de Novembro de 2025  
**Objetivo:** Substituir completamente o editor antigo por uma arquitetura moderna e limpa  
**Tempo Estimado:** 3-4 horas  
**Status:** 🟢 EM ANDAMENTO

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Estrutura de Diretórios](#estrutura-de-diretórios)
3. [Fases de Implementação](#fases-de-implementação)
4. [Stack Tecnológica](#stack-tecnológica)
5. [Cronograma](#cronograma)
6. [Checklist de Progress](#checklist-de-progresso)

---

## 🎯 VISÃO GERAL

### Problema Atual
- Editor antigo com 2656 linhas em um único arquivo
- 7+ sistemas concorrentes causando bugs
- 3 fontes de verdade diferentes
- Arquitetura acoplada e difícil de manter
- **Não está funcionando**

### Solução Proposta
- Editor moderno com arquitetura limpa
- Layout de 4 colunas intuitivo
- Estado único com Zustand
- Componentes reutilizáveis
- Lógica de cálculo mantida (testada e validada)

---

## 📁 ESTRUTURA DE DIRETÓRIOS

```
src/components/editor/
├── ModernQuizEditor/              # ← NOVO EDITOR
│   ├── index.tsx                  # Entry point
│   ├── ModernQuizEditor.tsx       # Componente principal
│   │
│   ├── layout/                    # 4 Colunas
│   │   ├── EditorLayout.tsx
│   │   ├── StepPanel.tsx          # Coluna 1: Lista de steps
│   │   ├── BlockLibrary.tsx       # Coluna 2: Biblioteca de blocos
│   │   ├── Canvas.tsx             # Coluna 3: Preview/edição
│   │   └── PropertiesPanel.tsx    # Coluna 4: Propriedades
│   │
│   ├── components/                # Componentes reutilizáveis
│   │   ├── blocks/                # Preview de blocos
│   │   │   ├── IntroBlock.tsx
│   │   │   ├── QuestionBlock.tsx
│   │   │   └── ResultBlock.tsx
│   │   ├── dnd/                   # Drag & Drop
│   │   │   ├── DraggableBlock.tsx
│   │   │   └── DropZone.tsx
│   │   └── ui/                    # UI básica
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Select.tsx
│   │
│   ├── store/                     # Estado Zustand
│   │   ├── quizStore.ts           # Store principal do quiz
│   │   ├── editorStore.ts         # Store do editor
│   │   └── types.ts               # TypeScript types
│   │
│   ├── hooks/                     # Hooks customizados
│   │   ├── useQuizEditor.ts       # Hook principal
│   │   ├── useBlockDnD.ts         # Drag & Drop
│   │   └── useCalculation.ts      # Cálculos de resultado
│   │
│   └── utils/                     # Utilitários
│       ├── validation.ts          # Validação Zod
│       ├── calculation.ts         # Lógica de cálculo
│       └── export.ts              # Exportar JSON
│
└── _deprecated/                   # ← CÓDIGO ANTIGO (arquivado)
    └── QuizModularEditor/         # 2656 linhas movidas aqui
```

---

## 🔧 FASES DE IMPLEMENTAÇÃO

### ✅ **FASE 0: Preparação (5 min)**
- [x] Criar plano de ação (este arquivo)
- [ ] Arquivar código antigo em `_deprecated/`
- [ ] Criar estrutura de diretórios

### 🔄 **FASE 1: Foundation (1h)**
**Objetivo:** Criar base funcional com estado e layout

#### 1.1 Zustand Store (20min)
- [ ] `store/quizStore.ts` - Estado do quiz (JSON v4)
- [ ] `store/editorStore.ts` - Estado do editor (seleções, UI)
- [ ] `store/types.ts` - Types compartilhados

#### 1.2 Layout Base (20min)
- [ ] `layout/EditorLayout.tsx` - Grid de 4 colunas
- [ ] `layout/StepPanel.tsx` - Lista de steps (shell)
- [ ] `layout/BlockLibrary.tsx` - Biblioteca (shell)
- [ ] `layout/Canvas.tsx` - Canvas (shell)
- [ ] `layout/PropertiesPanel.tsx` - Propriedades (shell)

#### 1.3 Entry Point (20min)
- [ ] `ModernQuizEditor.tsx` - Componente principal
- [ ] `index.tsx` - Export público
- [ ] Atualizar `src/pages/editor/EditorPage.tsx`

### 🔄 **FASE 2: UI Components (1.5h)**
**Objetivo:** Implementar funcionalidades de cada coluna

#### 2.1 StepPanel - Coluna 1 (20min)
- [ ] Listar steps do quiz
- [ ] Selecionar step (onClick)
- [ ] Visual de step selecionado
- [ ] Contador de blocos por step

#### 2.2 BlockLibrary - Coluna 2 (20min)
- [ ] Listar tipos de blocos disponíveis
- [ ] Categorizar blocos (Intro, Question, Result, etc)
- [ ] Preview visual de cada tipo
- [ ] Drag source para DnD

#### 2.3 Canvas - Coluna 3 (30min)
- [ ] Renderizar step selecionado
- [ ] Listar blocos do step
- [ ] Preview visual de cada bloco
- [ ] Drop zone para DnD
- [ ] Reordenar blocos

#### 2.4 PropertiesPanel - Coluna 4 (20min)
- [ ] Mostrar propriedades do bloco selecionado
- [ ] Inputs para editar propriedades
- [ ] Validação em tempo real
- [ ] Botão "Salvar alterações"

### 🔄 **FASE 3: Features (1h)**
**Objetivo:** Adicionar funcionalidades principais

#### 3.1 Drag & Drop (20min)
- [ ] `hooks/useBlockDnD.ts` - Hook com dnd-kit
- [ ] Arrastar da biblioteca para canvas
- [ ] Reordenar blocos no canvas
- [ ] Visual feedback durante drag

#### 3.2 Cálculos (15min)
- [ ] `hooks/useCalculation.ts` - Integrar lógica existente
- [ ] Importar `computeResult` de `@/lib/utils/result/computeResult`
- [ ] Preview de resultado em tempo real
- [ ] Validar estrutura JSON

#### 3.3 Persistência (15min)
- [ ] Auto-save com debounce (1 segundo)
- [ ] Botão "Salvar manualmente"
- [ ] Indicador de mudanças não salvas
- [ ] Exportar JSON final

#### 3.4 Undo/Redo (10min)
- [ ] Histórico de mudanças (usar Immer)
- [ ] Atalhos Ctrl+Z / Ctrl+Shift+Z
- [ ] Limite de 50 ações no histórico

### 🔄 **FASE 4: Integração & Polish (30min)**
**Objetivo:** Conectar com sistema existente

#### 4.1 Integração (15min)
- [ ] Carregar quiz via `templateService`
- [ ] Salvar quiz via API
- [ ] Sincronizar com Supabase
- [ ] Tratamento de erros

#### 4.2 Polish (15min)
- [ ] Loading states
- [ ] Error boundaries
- [ ] Mensagens de sucesso/erro
- [ ] Atalhos de teclado (Esc, Enter, etc)

---

## 🛠️ STACK TECNOLÓGICA

### Core
- **React 18+** - Function components + Hooks
- **TypeScript** - Tipagem estrita
- **Vite 7.2.4** - Dev server

### Estado & Dados
- **Zustand** - Estado global (single source of truth)
- **Immer.js** - Atualizações imutáveis
- **Zod** - Validação de schema

### UI & Interação
- **dnd-kit** - Drag & Drop
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones

### Reutilização
- **computeResult** - Lógica de cálculo existente (`@/lib/utils/result/computeResult`)
- **TemplateService** - Carregamento de templates (`@/services/canonical/TemplateService`)
- **Types existentes** - `Quiz21V4Schema`, `QuizResult`, etc (`@/types/quiz`)

---

## ⏱️ CRONOGRAMA

| Fase | Tempo | Status | Início | Fim |
|------|-------|--------|--------|-----|
| **Fase 0** | 5min | 🔄 Em andamento | 10:30 | 10:35 |
| **Fase 1** | 1h | ⏳ Pendente | 10:35 | 11:35 |
| **Fase 2** | 1.5h | ⏳ Pendente | 11:35 | 13:05 |
| **Fase 3** | 1h | ⏳ Pendente | 13:05 | 14:05 |
| **Fase 4** | 30min | ⏳ Pendente | 14:05 | 14:35 |
| **TOTAL** | **3-4h** | - | - | ~14:35 |

---

## ✅ CHECKLIST DE PROGRESSO

### Fase 0: Preparação
- [x] Criar plano de ação
- [ ] Arquivar código antigo
- [ ] Criar estrutura de diretórios

### Fase 1: Foundation (0/8)
- [ ] quizStore.ts
- [ ] editorStore.ts
- [ ] EditorLayout.tsx
- [ ] StepPanel.tsx (shell)
- [ ] BlockLibrary.tsx (shell)
- [ ] Canvas.tsx (shell)
- [ ] PropertiesPanel.tsx (shell)
- [ ] ModernQuizEditor.tsx

### Fase 2: UI Components (0/4)
- [ ] StepPanel completo
- [ ] BlockLibrary completo
- [ ] Canvas completo
- [ ] PropertiesPanel completo

### Fase 3: Features (0/4)
- [ ] Drag & Drop
- [ ] Cálculos integrados
- [ ] Auto-save
- [ ] Undo/Redo

### Fase 4: Integração (0/2)
- [ ] Integração com backend
- [ ] Polish final

---

## 🎯 CRITÉRIOS DE SUCESSO

1. ✅ Editor carrega template `quiz21-v4.json` corretamente
2. ✅ Mostra 21 steps na coluna 1
3. ✅ Permite selecionar step e ver seus blocos
4. ✅ Permite editar propriedades de bloco
5. ✅ Drag & Drop funciona entre biblioteca e canvas
6. ✅ Salva alterações no JSON
7. ✅ Cálculo de resultado funciona corretamente
8. ✅ Auto-save ativo
9. ✅ Undo/Redo funcionando
10. ✅ Zero erros no console

---

## 📝 NOTAS TÉCNICAS

### Reutilização de Código Existente
```typescript
// Importações de código validado
import { computeResult } from '@/lib/utils/result/computeResult'
import { templateService } from '@/services/canonical/TemplateService'
import { UnifiedCalculationEngine } from '@/lib/utils/UnifiedCalculationEngine'
import type { Quiz21V4Schema, QuizResult } from '@/types/quiz'
```

### Estrutura do Estado Zustand
```typescript
interface QuizStore {
  quiz: Quiz21V4Schema | null
  selectedStepId: string | null
  selectedBlockId: string | null
  isDirty: boolean
  history: Quiz21V4Schema[]
  historyIndex: number
  
  // Actions
  loadQuiz: (quiz: Quiz21V4Schema) => void
  selectStep: (stepId: string) => void
  updateBlock: (blockId: string, properties: any) => void
  addBlock: (stepId: string, blockType: string) => void
  deleteBlock: (blockId: string) => void
  undo: () => void
  redo: () => void
  save: () => Promise<void>
}
```

### Layout de 4 Colunas
```tsx
<div className="flex h-screen">
  <StepPanel className="w-52" />        {/* 208px */}
  <BlockLibrary className="w-64" />     {/* 256px */}
  <Canvas className="flex-1" />         {/* Restante */}
  <PropertiesPanel className="w-80" />  {/* 320px */}
</div>
```

---

## 🔗 REFERÊNCIAS

- **JSON Schema:** `/public/templates/quiz21-v4.json`
- **Types:** `/src/types/quiz.ts`
- **Cálculos:** `/src/lib/utils/result/computeResult.ts`
- **Template Service:** `/src/services/canonical/TemplateService.ts`
- **Editor Antigo (ref):** `/src/components/editor/_deprecated/QuizModularEditor/`

---

**Última Atualização:** 2025-11-30 10:30  
**Responsável:** GitHub Copilot AI  
**Aprovado por:** User
