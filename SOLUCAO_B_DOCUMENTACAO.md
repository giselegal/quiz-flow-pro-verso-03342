# 🎯 Solução B: Props → Blocks (Steps Editáveis no /editor)

## Resumo Executivo

A **Solução B** implementa um fluxo completo de edição de etapas (steps) no editor, onde as propriedades editáveis são convertidas em blocos (blocks) de forma determinística e previsível. Isso garante:

- ✅ **Canvas como fonte da verdade**: Blocos gerados a partir de props validadas
- ✅ **Preview sincronizado**: Mesmo resultado que a produção
- ✅ **Steps modulares**: Intro, Question, StrategicQuestion, Transition, Result, Offer
- ✅ **Validação com Zod**: Schemas por tipo de step
- ✅ **Normalização determinística**: IDs e valores com hash estável
- ✅ **Histórico e persistência**: pushHistory integrado, sem perda de dados
- ✅ **Migrations futura-proof**: schemaVersion e migrators por tipo

---

## Arquitetura Implementada

### 1. **Schemas Zod** (`src/schemas/`)

Cada tipo de step possui um schema Zod com validação e defaults:

```
src/schemas/
├── index.ts                           # Exportações centralizadas
├── option.ts                          # Schema reutilizável para opções
├── intro.schema.ts                    # Intro: title, subtitle, logo, cta
├── question.schema.ts                 # Question: pergunta, opções, multiselect
├── strategicQuestion.schema.ts        # StrategicQuestion: pergunta estratégica
├── transition.schema.ts               # Transition: título, texto, botão continuar
├── result.schema.ts                   # Result: template título, estilos, ofertas
├── offer.schema.ts                    # Offer: mapa de ofertas, layout
└── editorSchemas.ts / blockSchemas.ts # (Legacy/helpers)
```

**Exemplo - QuestionStepSchema:**
```typescript
export const QuestionStepSchema = z.object({
  schemaVersion: z.number().int().default(1),
  question: z.string().min(1, 'Question text is required'),
  multiSelect: z.boolean().default(false),
  requiredSelections: z.number().int().nonnegative().default(1),
  maxSelections: z.number().int().positive().default(1),
  options: z.array(OptionSchema).min(1, 'At least one option required')
}).superRefine((data, ctx) => {
  if (data.requiredSelections > data.maxSelections) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'requiredSelections cannot be greater than maxSelections',
      path: ['requiredSelections']
    });
  }
});
```

### 2. **Normalizadores** (`src/utils/normalize.ts`)

Geram IDs determinísticos e normalizam valores:

```typescript
// Exemplo: normalizeOptions
normalizeOptions([
  { label: 'Azul' },
  { label: 'Vermelho', value: 'red' }
], 'step-01')
// →
// [
//   { id: 'step-01-opt-0', value: 'azul', text: 'Azul', ... },
//   { id: 'step-01-opt-1', value: 'red', text: 'Vermelho', ... }
// ]
```

**Funções disponíveis:**
- `genId(prefix)`: Gera IDs únicos com timestamp + random
- `slugify(text)`: Converte texto em slug
- `normalizeOption(opt, stepId, idx)`: Normaliza uma opção
- `normalizeOptions(arr, stepId)`: Batch de opções
- `normalizeOfferEntry(key, entry)`: Normaliza entrada de oferta
- `normalizeOfferMap(map)`: Batch de ofertas

### 3. **Adapter: Props → Blocks** (`src/services/editor/PropsToBlocksAdapter.ts`)

Converte `step.meta.props` em array de blocos ordenados:

```typescript
PropsToBlocksAdapter.applyPropsToBlocks({
  id: 'step-02',
  type: 'question',
  meta: {
    props: {
      question: 'Qual é sua cor favorita?',
      options: [{ label: 'Azul' }, { label: 'Vermelho' }]
    }
  }
})
// →
// {
//   id: 'step-02',
//   type: 'question',
//   blocks: [
//     { id: 'step-02-block-heading-1', type: 'heading', content: { text: 'Qual é sua cor...' } },
//     { id: 'step-02-block-quiz-options-2', type: 'quiz-options', content: { options: [...] } }
//   ]
// }
```

**Tipos de conversão suportados:**
- `intro` → heading + optional(text, image) + button
- `question` → heading + quiz-options
- `strategic-question` → heading + quiz-options (single select)
- `transition` / `transition-result` → heading + text + button
- `result` → result-header-inline + style-card-inline + secondary-styles + offers
- `offer` → quiz-offer-cta-inline (um por oferta)

### 4. **Integração no Editor** (`src/components/editor/quiz/QuizModularProductionEditor.tsx`)

Handler `onStepPropsApply` no PropertiesPanel:

```typescript
onStepPropsApply={async (rawProps: any) => {
  if (!selectedStep) return;
  try {
    // 1. Validar com Zod
    const type = selectedStep.type;
    const schema = SCHEMAS[type];
    const validated = schema.parse(rawProps);
    
    // 2. Migrar schemaVersion
    const migrated = migrateProps(type, validated);
    
    // 3. Normalizar (IDs, slugs, etc)
    const normalized = normalizeByType(type, migrated, selectedStep.id);
    
    // 4. Aplicar ao step e converter para blocks
    const stepWithMeta = { ...selectedStep, meta: { ...selectedStep.meta, props: normalized } };
    const converted = PropsToBlocksAdapter.applyPropsToBlocks(stepWithMeta);
    
    // 5. Atualizar estado + histórico
    setSteps(prev => {
      const next = prev.map(s => s.id === selectedStep.id ? converted : s);
      pushHistory(next);
      return next;
    });
    
    setIsDirty(true);
    toast({ title: 'Props aplicadas', description: 'Canvas atualizado' });
  } catch (e: any) {
    toast({ title: 'Erro', description: e.message, variant: 'destructive' });
  }
}}
```

### 5. **Step Editors (React Hook Form + Zod)**

Editores modulares para cada tipo de step:

#### `QuestionStepEditor.tsx`
```typescript
// Uso: <QuestionStepEditor stepId="step-02" props={props} onApply={onApply} />
// Formulário com:
// - textarea pergunta
// - checkbox multiselect, autoAdvance
// - number fields requiredSelections, maxSelections
// - select layout (auto, grid-2, grid-3, list)
// - array de opções (label, value, image, points)
```

#### `IntroStepEditor.tsx`
```typescript
// Uso: <IntroStepEditor stepId="step-01" props={props} onApply={onApply} />
// Formulário com:
// - input title, subtitle
// - input logoUrl, backgroundImage
// - input cta
// - select layout (centered, split, cover)
// - checkbox showProgress
```

### 6. **Migrations** (`src/schemas/index.ts`)

Suporte para versionamento de schema com migrations futuras:

```typescript
export const LATEST_SCHEMA_VERSION: Record<string, number> = {
  question: 1,
  intro: 1,
  // ... outros tipos
};

const MIGRATIONS: Record<string, Record<number, (p: any) => any>> = {
  question: {
    // Migração de v1 → v2 seria adicionada aqui
    // 2: (p) => ({ ...p, newField: true })
  },
  // ... outros tipos
};

export function migrateProps(type: string, props: any) {
  const current = Number(props?.schemaVersion || 1);
  const latest = LATEST_SCHEMA_VERSION[type] || current;
  let next = { ...props };
  for (let v = current + 1; v <= latest; v++) {
    const fn = MIGRATIONS[type]?.[v];
    if (fn) next = fn(next);
  }
  next.schemaVersion = latest;
  return next;
}
```

---

## Fluxo Completo de Uso

### 1. **Abrir Editor**
```bash
npm run dev
# Abrir http://localhost:5173/editor?template=quiz21StepsComplete
```

### 2. **Selecionar uma Etapa**
- Clicar em uma etapa na coluna esquerda (Steps Panel)
- Etapa aparece no Canvas (coluna 3)

### 3. **Editar Propriedades**
- Ir para aba "Propriedades" no Painel Direito
- Descer até seção "Propriedades da Etapa"
- Editor JSON leve aparece (ou form estruturado quando integrado)
- Exemplo para Question:
```json
{
  "question": "Qual é seu estilo?",
  "multiSelect": true,
  "requiredSelections": 2,
  "maxSelections": 3,
  "options": [
    { "label": "Clássico", "image": "https://..." },
    { "label": "Moderno", "image": "https://..." }
  ]
}
```

### 4. **Aplicar**
- Clicar botão "Aplicar Props → Blocks"
- Validação Zod roda
- Props normalizadas (IDs determinísticos)
- Blocos gerados e Canvas atualizado
- Histórico salvo (Cmd+Z para desfazer)

### 5. **Preview**
- Trocar para aba "Preview"
- Quiz renderiza com blocos gerados
- Comportamento idêntico à produção

### 6. **Salvar**
- Clicar "Salvar"
- Draft persiste no backend
- Pode reabrir depois e continuar editando

---

## Estrutura de Arquivos

```
src/
├── schemas/                              # Zod schemas por tipo
│   ├── index.ts                          # SCHEMAS map + migrateProps
│   ├── option.ts
│   ├── intro.schema.ts
│   ├── question.schema.ts
│   ├── strategicQuestion.schema.ts
│   ├── transition.schema.ts
│   ├── result.schema.ts
│   └── offer.schema.ts
├── utils/
│   ├── normalize.ts                      # genId, slugify, normalize*
│   └── normalizeByType.ts                # normalizeByType dispatch
├── services/editor/
│   ├── PropsToBlocksAdapter.ts           # applyPropsToBlocks
│   ├── UnifiedQuizStepAdapter.ts         # (existente) bidirectional
│   └── DraftPersistence.ts               # (existente)
├── components/editor/
│   ├── step-editors/
│   │   ├── QuestionStepEditor.tsx        # (novo) react-hook-form
│   │   ├── IntroStepEditor.tsx           # (novo) react-hook-form
│   │   └── (outros editores vêm aqui)
│   ├── quiz/components/
│   │   └── PropertiesPanel.tsx           # (atualizado) onStepPropsApply callback
│   └── quiz/
│       └── QuizModularProductionEditor.tsx # (atualizado) handler integrado
└── tests/editor-core/                     # (novo) testes unitários
    ├── normalize.utils.test.ts
    ├── props-to-blocks.adapter.test.ts
    └── question.schema.test.ts
```

---

## Fluxo de Dados

```
┌─────────────────────────────────────────────────┐
│          PropertiesPanel (UI)                    │
│   StepPropsEditor: JSON Textarea + Apply        │
└────────────────┬────────────────────────────────┘
                 │ onStepPropsApply(rawProps)
                 ↓
┌─────────────────────────────────────────────────┐
│      Validação Zod (SCHEMAS[type].parse)        │
│         ↓ erro → Toast destructive               │
│         ↓ sucesso → validated                    │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│      Migration (migrateProps)                    │
│   schemaVersion: old → latest + apply migrators │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│      Normalização (normalizeByType)             │
│   IDs determinísticos, slugs, defaults          │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│    Adapter (PropsToBlocksAdapter)               │
│   props → blocks (heading, content, actions)    │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│      Update State (setSteps)                     │
│   pushHistory(next)  ← Undo/Redo                │
│   setIsDirty(true)   ← Mark unsaved             │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│      Canvas + Preview Updated                   │
│   Blocos renderizados, comportamento = produção │
└─────────────────────────────────────────────────┘
```

---

## Checklist de QA e Testes Manuais

### ✅ Testes Unitários
```bash
npm run -s test -- src/tests/editor-core/normalize.utils.test.ts
npm run -s test -- src/tests/editor-core/props-to-blocks.adapter.test.ts
npm run -s test -- src/tests/editor-core/question.schema.test.ts
```

### ✅ Testes Manuais

1. **Intro Step:**
   - Abrir step-01 no editor
   - Ir a Propriedades da Etapa
   - Editar `{ "title": "Novo título", "cta": "Vamos lá" }`
   - Clicar "Aplicar Props → Blocks"
   - Verificar canvas: novo título e botão CTA atualizados

2. **Question Step:**
   - Abrir step-02
   - Editar:
   ```json
   {
     "question": "Qual estilo?",
     "multiSelect": true,
     "options": [
       { "label": "Clássico" },
       { "label": "Moderno" }
     ]
   }
   ```
   - Aplicar → Canvas mostra heading + quiz-options com 2 opções
   - Preview → renderiza com opções clicáveis

3. **Undo/Redo:**
   - Editar → Aplicar
   - Cmd+Z (Ctrl+Z) → volta ao anterior
   - Cmd+Shift+Z (Ctrl+Y) → refaz

4. **Validação:**
   - Question com `requiredSelections: 3, maxSelections: 1`
   - Aplicar → Erro de validação Zod
   - Toast exibe: "requiredSelections cannot be greater than maxSelections"

5. **Save/Load:**
   - Fazer edições → Salvar
   - Reabrir página
   - Edições persisted e blocos mantidos

---

## Próximos Passos (Futuro)

1. **Adicionar mais editores:**
   - StrategicQuestionStepEditor
   - TransitionStepEditor
   - ResultStepEditor
   - OfferStepEditor

2. **UI melhorada:**
   - Substituir JSON textarea por formas estruturadas (react-hook-form)
   - Validação inline em tempo real
   - Sugestões de auto-complete

3. **Migrations:**
   - Adicionar migrations reais quando schemaVersion mudar
   - Testar backward compatibility

4. **Performance:**
   - Memoizar editores
   - Debounce on change vs on blur

5. **Integração com APIs:**
   - Salvar props em meta.props no backend
   - Sincronizar entre abas do editor

---

## Troubleshooting

### ❓ "Schema não encontrado para tipo: xxx"
- Verificar `src/schemas/index.ts` → adicionar tipo faltante
- Verificar `SCHEMAS` map

### ❓ "Canvas não atualiza após aplicar props"
- Verificar console → erros de validação Zod
- Verificar se `pushHistory` foi chamado
- Verificar se `setSteps` foi chamado com novo array

### ❓ "Blocos têm IDs duplicados"
- Normalizar usa `${stepId}-opt-${idx}` → determinístico
- Se trocar etapa e voltar, IDs serão iguais (esperado)

### ❓ "Preview não sincroniza com canvas"
- Verificar se `PropsToBlocksAdapter` está gerando blocos coretos
- Verificar se `blocks` array está no `state.steps`

---

## Resumo Técnico

| Componente | Responsabilidade | Localização |
|-----------|-----------------|------------|
| **Zod Schemas** | Validação + defaults + constraints | `src/schemas/*.ts` |
| **Normalizadores** | IDs determinísticos + slugs | `src/utils/normalize.ts` |
| **PropsToBlocksAdapter** | Conversão props → blocks | `src/services/editor/PropsToBlocksAdapter.ts` |
| **PropertiesPanel** | UI para editar props | `src/components/editor/quiz/components/PropertiesPanel.tsx` |
| **QuizModularProductionEditor** | Handler onStepPropsApply | `src/components/editor/quiz/QuizModularProductionEditor.tsx` |
| **Step Editors** | Formas react-hook-form (opcional) | `src/components/editor/step-editors/*.tsx` |
| **Migrations** | Versionamento de schema | `src/schemas/index.ts` |

---

## Referências

- [Zod Docs](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Vitest](https://vitest.dev/)

---

**Status:** ✅ Implementação completa da Solução B
**Última atualização:** 2025-10-17
