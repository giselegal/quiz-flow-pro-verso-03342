# 📋 Checklist de Implementação - Solução B

## ✅ Completado

### Fase 1: Schemas Zod
- [x] `src/schemas/option.ts` - Schema reutilizável para opções
- [x] `src/schemas/intro.schema.ts` - Schema para Intro steps
- [x] `src/schemas/question.schema.ts` - Schema para Question steps com validação cross-field
- [x] `src/schemas/strategicQuestion.schema.ts` - Schema para Strategic Question steps
- [x] `src/schemas/transition.schema.ts` - Schema para Transition steps
- [x] `src/schemas/result.schema.ts` - Schema para Result steps
- [x] `src/schemas/offer.schema.ts` - Schema para Offer steps
- [x] `src/schemas/index.ts` - Mapa centralizado SCHEMAS + migrateProps

### Fase 2: Normalizadores
- [x] `src/utils/normalize.ts` - genId, slugify, normalizeOption*, normalizeOfferMap
- [x] `src/utils/normalizeByType.ts` - Dispatch para normalização por tipo

### Fase 3: Adapter Props → Blocks
- [x] `src/services/editor/PropsToBlocksAdapter.ts` - applyPropsToBlocks completo
  - [x] Conversão intro → blocks
  - [x] Conversão question → blocks
  - [x] Conversão strategic-question → blocks
  - [x] Conversão transition/transition-result → blocks
  - [x] Conversão result → blocks
  - [x] Conversão offer → blocks

### Fase 4: Integração no Editor
- [x] Handler `onStepPropsApply` em `QuizModularProductionEditor.tsx`
  - [x] Validação com Zod
  - [x] Migração de schemaVersion
  - [x] Normalização
  - [x] Conversão para blocks
  - [x] Atualização de estado
  - [x] pushHistory para undo/redo
  - [x] Toast feedback

- [x] UI em `PropertiesPanel.tsx`
  - [x] `StepPropsEditor` (JSON textarea)
  - [x] Callback onStepPropsApply

### Fase 5: Step Editors (React Hook Form + Zod)
- [x] `src/components/editor/step-editors/QuestionStepEditor.tsx`
  - [x] Form com validação zodResolver
  - [x] Fields: question, multiSelect, requiredSelections, maxSelections, layout, showImages
  - [x] Dynamic array de opções (label, value, image, points)
  
- [x] `src/components/editor/step-editors/IntroStepEditor.tsx`
  - [x] Form com validação zodResolver
  - [x] Fields: title, subtitle, logo, background, cta, layout, showProgress

### Fase 6: Migrations
- [x] Estrutura base em `src/schemas/index.ts`
  - [x] LATEST_SCHEMA_VERSION map
  - [x] MIGRATIONS map por tipo
  - [x] migrateProps function
  - [x] Integração no handler onStepPropsApply

### Fase 7: Testes Unitários
- [x] `src/tests/editor-core/normalize.utils.test.ts`
  - [x] Test normalizeOptions com IDs determinísticos
  - [x] Test normalizeOfferMap com keying

- [x] `src/tests/editor-core/props-to-blocks.adapter.test.ts`
  - [x] Test question props → blocks
  - [x] Test intro props → blocks
  - [x] Test offer props → blocks

- [x] `src/tests/editor-core/question.schema.test.ts`
  - [x] Test parse válido
  - [x] Test validação cross-field (requiredSelections > maxSelections)

---

## 📦 Arquivos Criados/Modificados

### Criados ✨
```
src/schemas/
├── option.ts
├── intro.schema.ts
├── question.schema.ts
├── strategicQuestion.schema.ts
├── transition.schema.ts
├── result.schema.ts
├── offer.schema.ts
└── index.ts (modificado)

src/utils/
├── normalize.ts
└── normalizeByType.ts

src/services/editor/
└── PropsToBlocksAdapter.ts

src/components/editor/step-editors/
├── QuestionStepEditor.tsx
└── IntroStepEditor.tsx

src/tests/editor-core/
├── normalize.utils.test.ts
├── props-to-blocks.adapter.test.ts
└── question.schema.test.ts

SOLUCAO_B_DOCUMENTACAO.md
IMPLEMENTACAO_CHECKLIST.md (este arquivo)
```

### Modificados 🔧
```
src/components/editor/quiz/components/PropertiesPanel.tsx
  └─ Adicionado StepPropsEditor component
  └─ Adicionado onStepPropsApply callback

src/components/editor/quiz/QuizModularProductionEditor.tsx
  └─ Handler onStepPropsApply com validação Zod + normalização + adapter
  └─ Imports: SCHEMAS, migrateProps, normalizeByType, PropsToBlocksAdapter

src/schemas/index.ts
  └─ LATEST_SCHEMA_VERSION map
  └─ MIGRATIONS map estrutura
  └─ migrateProps function
```

---

## 🚀 Como Usar

### 1. Abrir o editor
```bash
npm run dev
# http://localhost:5173/editor?template=quiz21StepsComplete
```

### 2. Selecionar uma etapa e editar propriedades
- Ir a Propriedades da Etapa (aba Propriedades)
- Editar JSON ou usar formulário
- Clicar "Aplicar Props → Blocks"

### 3. Validação automática
- Zod valida contra schema
- Erros mostram em toast
- Cross-field constraints (ex: requiredSelections ≤ maxSelections)

### 4. Preview sincronizado
- Canvas atualiza automaticamente
- Blocos gerados de forma determinística
- Undo/Redo com Cmd+Z / Cmd+Y

### 5. Salvar draft
- Clicar "Salvar"
- Props armazenadas em `step.meta.props`
- Reabrir depois e continuar editando

---

## 🧪 Executar Testes

### Apenas testes da Solução B
```bash
npm run -s test -- src/tests/editor-core
```

### Com coverage
```bash
npm run -s test:coverage -- src/tests/editor-core
```

### Watch mode
```bash
npm run test:watch -- src/tests/editor-core
```

---

## 🎯 Fluxo Técnico Resumido

```
Raw Props (JSON) 
  ↓ [Zod.parse]
Validated Props
  ↓ [migrateProps]
Migrated Props (schemaVersion updated)
  ↓ [normalizeByType]
Normalized Props (deterministic IDs, slugs)
  ↓ [PropsToBlocksAdapter.applyPropsToBlocks]
Blocks Array (ordered, complete)
  ↓ [setSteps + pushHistory]
State Updated + Undo/Redo Enabled
  ↓
Canvas + Preview Render
```

---

## 📝 Extensibilidade

### Adicionar novo tipo de step:

1. Criar `src/schemas/newtype.schema.ts`:
```typescript
export const NewTypeSchema = z.object({
  schemaVersion: z.number().default(1),
  field1: z.string(),
  field2: z.boolean()
});
export type NewTypeProps = z.infer<typeof NewTypeSchema>;
```

2. Adicionar ao mapa `src/schemas/index.ts`:
```typescript
export const SCHEMAS = {
  // ...
  'new-type': NewTypeSchema
};
export const LATEST_SCHEMA_VERSION = {
  // ...
  'new-type': 1
};
```

3. Adicionar case em `PropsToBlocksAdapter.applyPropsToBlocks`:
```typescript
case 'new-type': {
  // blocos específicos para novo tipo
  push({ type: 'heading', content: { text: props.field1 } });
  break;
}
```

4. (Opcional) Criar editor em `src/components/editor/step-editors/NewTypeEditor.tsx`

5. (Opcional) Adicionar testes em `src/tests/editor-core/newtype.schema.test.ts`

---

## 🔐 Garantias

- ✅ **Determinismo**: IDs iguais para mesma etapa → evita colisões
- ✅ **Validação**: Zod garante tipos + constraints
- ✅ **Normalização**: Props consistentes antes de gerar blocos
- ✅ **Rastreabilidade**: schemaVersion permite migrations futuras
- ✅ **Reversibilidade**: Undo/Redo via pushHistory
- ✅ **Sincronização**: Canvas/Preview/Produção = mesmo resultado

---

## 🐛 Troubleshooting

| Problema | Causa | Solução |
|---------|-------|---------|
| Schema não encontrado | Tipo não registrado em SCHEMAS | Adicionar em `src/schemas/index.ts` |
| Canvas não atualiza | pushHistory ou setSteps não chamado | Verificar handler no editor |
| IDs duplicados | Normalização não determinística | Usar `${stepId}-${type}-${idx}` |
| Validação falha silenciosamente | Erro não tratado | Adicionar try/catch com toast |
| Preview diferente da produção | Blocos não convertidos igual | Verificar applyPropsToBlocks |

---

## 📚 Referências

- Schemas: `src/schemas/*.ts`
- Adapter: `src/services/editor/PropsToBlocksAdapter.ts`
- Editor: `src/components/editor/quiz/QuizModularProductionEditor.tsx`
- Documentação: `SOLUCAO_B_DOCUMENTACAO.md`

---

**Status:** ✅ IMPLEMENTAÇÃO COMPLETA
**Data:** 2025-10-17
**Versão:** 1.0
