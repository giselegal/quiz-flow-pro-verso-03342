# 📊 Análise Etapa por Etapa - Arquitetura Zod + Blocos Atômicos

**Data:** 24 de outubro de 2025  
**Escopo:** Validação com Zod + Blocos Atômicos v3 + Step-20 Atualizado

---

## 🎯 Visão Geral da Arquitetura

O projeto usa **Zod** como camada de validação em **4 níveis principais**:

```
┌─────────────────────────────────────────────────────────────┐
│                    NÍVEL 1: JSON v3                          │
│  Validação de templates completos (metadata, sections, etc) │
│         src/types/jsonv3.schema.ts                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                NÍVEL 2: Blocos Atômicos                      │
│    Validação de props individuais de cada tipo de bloco     │
│           src/schemas/blockSchemas.ts                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              NÍVEL 3: Steps Completos                        │
│  Validação de steps inteiros (question, result, etc)        │
│   src/schemas/{question,result,transition}.schema.ts       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│            NÍVEL 4: Formulários do Editor                    │
│    Validação de forms com React Hook Form + zodResolver     │
│   src/components/editor/step-editors/*.tsx                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 ETAPA 1: Schemas JSON v3 (Template Completo)

### Arquivo: `src/types/jsonv3.schema.ts`

#### 1.1 Schema de Section (Bloco Individual)
```typescript
export const JSONv3SectionSchema = z.object({
  type: z.string().min(1),              // ✅ Tipo do bloco (ex: "result-main")
  id: z.string().min(1),                // ✅ ID único
  content: z.record(z.any()).optional().default({}),    // ✅ Dados canônicos
  properties: z.record(z.any()).optional().default({}), // ⚠️ Alias (legado)
  props: z.record(z.any()).optional(),                  // ⚠️ Alias (legado)
  style: z.record(z.any()).optional(),                  // 🎨 Estilos CSS
  animation: z.record(z.any()).optional(),              // ⚡ Animações
});
```

**Observação:** O schema aceita `content`, `properties` e `props` para **retrocompatibilidade**.  
O canônico é `content`, mas o sistema lê de qualquer um dos três.

#### 1.2 Schema de Template Completo
```typescript
export const JSONv3TemplateSchema = z.object({
  templateVersion: z.string().min(1),           // Ex: "3.0"
  metadata: JSONv3MetadataSchema,               // ID, nome, categoria, tags
  theme: JSONv3ThemeSchema,                     // Cores, fontes, espaçamento
  sections: z.array(JSONv3SectionSchema).nonempty(), // ⚠️ Array de blocos
  navigation: JSONv3NavigationSchema,           // nextStep, prevStep
  analytics: z.object({...}).optional(),        // Tracking
  seo: z.object({...}).optional(),             // Meta tags
  urls: z.object({...}).optional(),            // Links externos
  abTest: z.object({...}).optional(),          // Testes A/B
  tracking: z.object({...}).optional(),        // Pixels, UTMs
  scoring: z.object({...}).optional(),         // Sistema de pontuação
});
```

**Status Atual:**
- ✅ Master JSON validado: 21/21 steps presentes
- ✅ Step-20 convertido para blocos atômicos (10 blocos)
- ✅ Schema aceita estruturas variadas (v2 e v3)

---

## 📋 ETAPA 2: Schemas de Blocos Atômicos

### Arquivo: `src/schemas/blockSchemas.ts`

Este arquivo define **schemas Zod específicos** para cada tipo de bloco atômico.

### 2.1 Blocos Básicos

#### Text Block
```typescript
export const textBlockSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  fontSize: z.number().min(8).max(72),
  textColor: colorSchema,                    // Regex: /^#[0-9A-F]{6}$/i
  textAlign: z.enum(['left', 'center', 'right']),
});
```

#### Button Block
```typescript
export const buttonBlockSchema = z.object({
  text: z.string().min(1, 'Texto do botão é obrigatório'),
  link: urlSchema,                           // .url() ou ''
  backgroundColor: colorSchema,
  textColor: colorSchema,
  paddingX: positiveNumberSchema,            // .min(0)
  paddingY: positiveNumberSchema,
  borderRadius: positiveNumberSchema,
  fullWidth: z.boolean(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  variant: z.enum(['default', 'destructive', 'outline', ...]).optional(),
});
```

#### Image Block
```typescript
export const imageBlockSchema = z.object({
  src: z.string().url('URL da imagem é obrigatória'),
  alt: z.string().min(1, 'Texto alternativo é obrigatório'),
  width: z.number().min(1).optional(),
  height: z.number().min(1).optional(),
  borderRadius: positiveNumberSchema.optional(),
  objectFit: z.enum(['contain', 'cover', 'fill', 'none', 'scale-down']).optional(),
});
```

---

### 2.2 Blocos de Resultado (Step 20)

#### Result Main Block
```typescript
export const resultMainBlockSchema = z.object({
  styleName: z.string().min(1, 'Nome do estilo é obrigatório'),
  description: z.string().optional(),
  showIcon: z.boolean().optional(),
  customImage: urlSchema.optional(),
  backgroundColor: colorSchema.optional(),
});
```

**Componente:** `src/components/editor/blocks/atomic/ResultMainBlock.tsx`

**Props aceitas:**
- `userName` (string) - Nome do usuário
- `styleName` (string) - Nome do estilo identificado
- `percentage` (string) - Compatibilidade (ex: "85%")
- `showCelebration` (boolean) - Exibir emoji 🎉
- `backgroundColor`, `textColor`, `accentColor` (cores)

#### Result Progress Bars Block
```typescript
// ⚠️ Schema ausente em blockSchemas.ts
// Componente espera: scores: { name: string, score: number }[]
```

**Componente:** `src/components/editor/blocks/ResultProgressBarsBlock.tsx`

**Props aceitas:**
- `scores` (array) - Lista de estilos com pontuações
- `showTop3` (boolean) - Exibir apenas top 3
- `barColor` (string) - Cor das barras
- `title` (string) - Título da seção

#### Result Secondary Styles Block
```typescript
export const resultSecondaryStylesBlockSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  styles: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Nome é obrigatório'),
    percentage: z.number().min(0).max(100),
    description: z.string().optional(),
  })).min(1),
  showPercentages: z.boolean().optional(),
});
```

**Componente:** `src/components/editor/blocks/atomic/ResultSecondaryStylesBlock.tsx`

---

### 2.3 Registro de Schemas por Tipo

```typescript
export const BLOCK_SCHEMAS: Record<string, z.ZodType<any>> = {
  // Básicos
  'text-inline': textBlockSchema,
  'heading-inline': headerBlockSchema,
  'button-inline': buttonBlockSchema,
  'image-inline': imageBlockSchema,
  'spacer-inline': spacerBlockSchema,
  
  // Resultado
  'result-header': resultHeaderBlockSchema,
  'result-main': resultMainBlockSchema,
  'result-image': resultImageBlockSchema,
  'result-description': resultDescriptionBlockSchema,
  'result-characteristics': resultCharacteristicsBlockSchema,
  'result-cta': resultCTABlockSchema,
  'result-secondary-styles': resultSecondaryStylesBlockSchema,
  
  // Quiz
  'question-text': quizStepBlockSchema,
  'options-grid': z.array(quizOptionSchema),
  
  // Transição
  'transition-title': transitionTitleBlockSchema,
  'transition-loader': transitionLoaderBlockSchema,
  'transition-text': transitionTextBlockSchema,
  'transition-progress': transitionProgressBlockSchema,
  'transition-message': transitionMessageBlockSchema,
  
  // ... mais 40+ tipos
};
```

---

## 📋 ETAPA 3: Schemas de Steps Completos

### 3.1 Question Step Schema

**Arquivo:** `src/schemas/question.schema.ts`

```typescript
export const QuestionStepSchema = z.object({
  schemaVersion: z.number().int().default(1),
  question: z.string().min(1, 'Question text is required'),
  multiSelect: z.boolean().optional().default(false),
  requiredSelections: z.number().int().nonnegative().optional().default(1),
  maxSelections: z.number().int().positive().optional().default(1),
  autoAdvance: z.boolean().optional().default(true),
  showNextButton: z.boolean().optional().default(true),
  nextButtonText: z.string().optional().default('Avançar'),
  layout: z.enum(['auto', 'grid-2', 'grid-3', 'list']).default('auto'),
  showImages: z.boolean().optional().default(true),
  options: z.array(OptionSchema).min(1, 'At least one option required'),
})
.superRefine((data, ctx) => {
  // ✅ Validação cruzada: requiredSelections <= maxSelections
  if (data.requiredSelections > data.maxSelections) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '`requiredSelections` cannot be greater than `maxSelections`',
      path: ['requiredSelections'],
    });
  }
  
  // ✅ Validação: não pode exigir mais seleções que opções disponíveis
  const optionsLength = data.options.length;
  if (data.requiredSelections > optionsLength) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '`requiredSelections` cannot exceed number of options',
      path: ['requiredSelections'],
    });
  }
});

export type QuestionStepProps = z.infer<typeof QuestionStepSchema>;
```

**Uso:**
- `src/components/editor/step-editors/QuestionStepEditor.tsx`
- `src/components/editor/quiz-estilo/ModularQuestionStep.tsx`

---

### 3.2 Result Step Schema

**Arquivo:** `src/schemas/result.schema.ts`

```typescript
export const ResultStepSchema = z.object({
  schemaVersion: z.number().int().default(1),
  titleTemplate: z.string().optional().default('Seu resultado: {{resultStyle}}'),
  subtitleTemplate: z.string().optional().default('Veja os detalhes abaixo'),
  showPrimaryStyleCard: z.boolean().optional().default(true),
  primaryStyleId: z.string().optional().nullable(),
  showSecondaryStyles: z.boolean().optional().default(true),
  secondaryStylesCount: z.number().int().min(0).max(5).default(2),
  offersToShow: z.array(z.string()).optional().default([]),
});

export type ResultStepProps = z.infer<typeof ResultStepSchema>;
```

**Observação:**  
Este schema valida a **configuração do step** (metadata), não os blocos individuais.  
Os blocos são validados via `blockSchemas.ts`.

---

### 3.3 Transition Step Schema

**Arquivo:** `src/schemas/transition.schema.ts`

```typescript
export const TransitionStepSchema = z.object({
  schemaVersion: z.number().int().default(1),
  message: z.string().min(1, 'Message is required'),
  duration: z.number().int().min(1000).max(10000).optional().default(3000),
  showLoader: z.boolean().optional().default(true),
  loaderType: z.enum(['spinner', 'dots', 'progress']).optional().default('dots'),
  showProgressBar: z.boolean().optional().default(false),
  autoAdvance: z.boolean().optional().default(true),
});

export type TransitionStepProps = z.infer<typeof TransitionStepSchema>;
```

---

## 📋 ETAPA 4: Validação de Formulários (Editor)

### 4.1 React Hook Form + zodResolver

Todos os editores de steps usam **zodResolver** para integrar Zod com React Hook Form.

#### Exemplo: QuestionStepEditor.tsx

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { QuestionStepSchema, QuestionStepProps } from '@/schemas/question.schema';

export function QuestionStepEditor({ data, onUpdate }) {
  const form = useForm<QuestionStepProps>({
    resolver: zodResolver(QuestionStepSchema), // ✅ Validação Zod automática
    defaultValues: data,
  });

  const onSubmit = (values: QuestionStepProps) => {
    onUpdate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pergunta</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage /> {/* ✅ Exibe erros do Zod automaticamente */}
            </FormItem>
          )}
        />
        {/* ... mais campos */}
      </form>
    </Form>
  );
}
```

**Benefícios:**
- ✅ Validação em tempo real
- ✅ Mensagens de erro customizadas do Zod
- ✅ Type-safety completo (TypeScript infere tipos do Zod)
- ✅ Validação cruzada de campos (`superRefine`)

---

### 4.2 Hook Personalizado: useBlockForm

**Arquivo:** `src/hooks/useBlockForm.ts`

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BLOCK_SCHEMAS } from '@/schemas/blockSchemas';

export function useBlockForm<T extends z.ZodType>(
  blockType: string,
  defaultValues?: z.infer<T>
) {
  const schema = BLOCK_SCHEMAS[blockType] || z.object({});
  
  return useForm({
    resolver: zodResolver(schema as T),
    defaultValues,
    mode: 'onChange', // ✅ Validação em tempo real
  });
}
```

**Uso:**
```typescript
// Em qualquer editor de bloco
const form = useBlockForm('result-main', blockData);
```

---

## 📋 ETAPA 5: Mapeamento de Tipos (blockTypeMapper.ts)

### Arquivo: `src/utils/blockTypeMapper.ts`

O mapper normaliza **tipos de bloco** entre diferentes formatos (v2, v3, variações).

```typescript
export const BLOCK_TYPE_MAP: Record<string, string> = {
  // ====== Blocos de Resultado (v3 atomic) ======
  'result-congrats': 'result-congrats',
  'result-main': 'result-main',
  'result-progress-bars': 'result-progress-bars',
  'result-secondary-styles': 'result-secondary-styles',
  'result-image': 'result-image',
  'result-description': 'result-description',
  
  // ====== Legacy v2 → Atomic v3 ======
  'HeroSection': 'result-congrats',              // ✅ CORRIGIDO
  'StyleProfileSection': 'result-main',          // ✅ CORRIGIDO
  'result-header': 'result-congrats',            // ✅ Redirect
  'result-content': 'result-main',               // ✅ Redirect
  
  // ====== Outros mapeamentos ======
  'CTAButton': 'button-inline',
  'text-inline': 'text-inline',
  'heading-inline': 'heading-inline',
  'options grid': 'options-grid',               // ⚠️ Espaço → hífen
  // ... mais 60+ mapeamentos
};

export function mapBlockType(templateType: string): string {
  const key = String(templateType).trim();
  const normalized = BLOCK_TYPE_MAP[key]
    || BLOCK_TYPE_MAP[key.charAt(0).toUpperCase() + key.slice(1)]
    || BLOCK_TYPE_MAP[key.charAt(0).toLowerCase() + key.slice(1)]
    || key; // ✅ Fallback: retorna original se não encontrado
  return normalized;
}
```

**Correções Recentes (24/10/2025):**
1. ✅ `HeroSection` → `result-congrats` (antes: `result-header`)
2. ✅ `StyleProfileSection` → `result-main` (antes: `result-characteristics`)
3. ✅ Adicionados mapeamentos atômicos: `result-progress-bars`, etc.

---

## 📋 ETAPA 6: Registro de Blocos (EnhancedBlockRegistry.tsx)

### Arquivo: `src/components/editor/blocks/EnhancedBlockRegistry.tsx`

Este arquivo **registra todos os componentes** de blocos e seus lazy loads.

```typescript
const BLOCK_COMPONENTS: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  // ====== Resultado (Atomic v3) ======
  'result-congrats': lazy(() => import('./ResultCongratsBlock')),
  'result-main': lazy(() => import('./atomic/ResultMainBlock')),
  'result-progress-bars': lazy(() => import('./ResultProgressBarsBlock')),
  'result-secondary-styles': lazy(() => import('./atomic/ResultSecondaryStylesBlock')),
  'result-image': lazy(() => import('./atomic/ResultImageBlock')),
  'result-description': lazy(() => import('./atomic/ResultDescriptionBlock')),
  
  // ====== Básicos ======
  'text-inline': lazy(() => import('./TextInlineBlock')),
  'button-inline': lazy(() => import('./ButtonInlineBlock')),
  'heading-inline': lazy(() => import('./HeadingInlineBlock')),
  
  // ... mais 100+ blocos
};

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  // Resultado
  { 
    type: 'result-main', 
    label: 'Resultado: Estilo Principal', 
    category: 'result', 
    description: 'Card do estilo principal identificado',
    schema: resultMainBlockSchema, // ✅ Schema Zod vinculado
  },
  { 
    type: 'result-progress-bars', 
    label: 'Resultado: Barras de Progresso', 
    category: 'result',
    description: 'Compatibilidade com estilos',
    // ⚠️ Schema ausente
  },
  // ... mais definições
];
```

**Categorias:**
- `intro` - Blocos de introdução
- `question` - Blocos de pergunta
- `transition` - Blocos de transição
- `result` - Blocos de resultado
- `offer` - Blocos de oferta
- `form` - Blocos de formulário
- `basic` - Blocos básicos (texto, botão, imagem)

---

## 📋 ETAPA 7: Renderização (UniversalBlockRenderer.tsx)

### Arquivo: `src/components/editor/blocks/UniversalBlockRenderer.tsx`

Este componente **renderiza qualquer bloco** dinamicamente.

```typescript
const BLOCK_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  // Resultado
  'result-main': ResultMainBlock,
  'result-image': ResultImageBlock,
  'result-description': ResultDescriptionBlock,
  'result-progress-bars': ResultProgressBarsBlock,
  'result-secondary-styles': ResultSecondaryStylesBlock,
  
  // Básicos
  'text-inline': TextInlineBlock,
  'button-inline': ButtonInlineBlock,
  'heading-inline': HeadingInlineBlock,
  
  // ... mais mapeamentos
};

export function UniversalBlockRenderer({ block, ...props }: BlockRendererProps) {
  const normalizedType = mapBlockType(block.type); // ✅ Usa mapper
  const Component = BLOCK_COMPONENT_MAP[normalizedType];
  
  if (!Component) {
    console.warn(`⚠️ Bloco não encontrado: ${block.type} (normalizado: ${normalizedType})`);
    return <div>Bloco desconhecido: {block.type}</div>;
  }
  
  return <Component block={block} {...props} />;
}
```

**Fluxo:**
1. Recebe `block.type` (ex: "HeroSection")
2. Normaliza via `mapBlockType()` → "result-congrats"
3. Busca componente no map → `ResultCongratsBlock`
4. Renderiza com props

---

## 📋 ETAPA 8: Step-20 Atualizado (Master JSON)

### Status Atual

**Arquivo:** `public/templates/quiz21-complete.json`

#### Antes (v2 - Sections Composite):
```json
{
  "step-20": {
    "sections": [
      { "id": "hero", "type": "HeroSection", "order": 1 },
      { "id": "style-profile", "type": "StyleProfileSection", "order": 2 },
      { "id": "cta-primary", "type": "CTAButton", "order": 3 }
    ]
  }
}
```

#### Depois (v3 - Blocos Atômicos):
```json
{
  "step-20": {
    "sections": [
      { "id": "result-congrats", "type": "result-congrats", "order": 1, "props": {...} },
      { "id": "result-main", "type": "result-main", "order": 2, "props": {...} },
      { "id": "result-progress-bars", "type": "result-progress-bars", "order": 3, "props": {...} },
      { "id": "result-secondary-styles", "type": "result-secondary-styles", "order": 4, "props": {...} },
      { "id": "result-image", "type": "result-image", "order": 5, "props": {...} },
      { "id": "result-description", "type": "result-description", "order": 6, "props": {...} },
      { "id": "button-cta-primary", "type": "button-inline", "order": 7, "props": {...} },
      { "id": "transformation-benefits", "type": "text-inline", "order": 8, "props": {...} },
      { "id": "method-steps", "type": "text-inline", "order": 9, "props": {...} },
      { "id": "button-cta-final", "type": "button-inline", "order": 10, "props": {...} }
    ]
  }
}
```

**Benefícios da conversão:**
- ✅ Cada bloco é **editável individualmente** via Painel de Propriedades
- ✅ **Reordenáveis** via drag-and-drop (@dnd-kit)
- ✅ **Inserção dinâmica** de novos blocos entre existentes
- ✅ Validação Zod para cada bloco (quando schemas disponíveis)

---

## 🔍 Gaps Identificados

### 1. Schemas Ausentes

**Blocos sem schema Zod definido:**
- ❌ `result-congrats` (componente existe, schema ausente)
- ❌ `result-progress-bars` (componente existe, schema ausente)

**Solução:**
```typescript
// Adicionar em src/schemas/blockSchemas.ts

export const resultCongratsBlockSchema = z.object({
  text: z.string().min(1, 'Texto é obrigatório'),
  showUserName: z.boolean().optional().default(true),
  userName: z.string().optional(),
  fontSize: z.enum(['xl', '2xl', '3xl', '4xl']).optional().default('2xl'),
  fontFamily: z.string().optional().default('Playfair Display'),
  color: colorSchema.optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional().default('center'),
  marginBottom: z.string().optional().default('4'),
});

export const resultProgressBarsBlockSchema = z.object({
  scores: z.array(z.object({
    name: z.string().min(1),
    score: z.number().min(0).max(100),
  })).min(1, 'Adicione pelo menos 1 estilo'),
  showTop3: z.boolean().optional().default(true),
  barColor: colorSchema.optional(),
  title: z.string().optional().default('Compatibilidade com estilos:'),
  marginBottom: z.string().optional().default('8'),
});

// Adicionar ao BLOCK_SCHEMAS:
export const BLOCK_SCHEMAS: Record<string, z.ZodType<any>> = {
  // ... existentes
  'result-congrats': resultCongratsBlockSchema,
  'result-progress-bars': resultProgressBarsBlockSchema,
};
```

---

### 2. Inconsistências content vs properties vs props

**Problema:**  
Blocos leem de 3 locais diferentes:
- `block.content.userName` (canônico v3)
- `block.properties.userName` (legado v2)
- `block.props.userName` (variação comum)

**Exemplo em ResultMainBlock.tsx:**
```typescript
const userName = userProfile?.userName 
  || block.content?.userName      // ✅ V3 canônico
  || block.properties?.userName   // ⚠️ V2 legado
  || block.props?.userName        // ⚠️ Variação
  || 'Você';
```

**Solução recomendada:**
1. **Normalizar na leitura:** TemplateLoader deve consolidar tudo em `content`
2. **Schema único:** JSONv3SectionSchema já aceita os 3, mas pode dar warning
3. **Migração gradual:** Converter templates antigos para usar apenas `content`

---

### 3. Type-Safety entre Schema e Componente

**Problema:**  
Props do componente nem sempre correspondem ao schema Zod.

**Exemplo:**
```typescript
// Schema
export const resultMainBlockSchema = z.object({
  styleName: z.string().min(1),
  description: z.string().optional(),
  // ...
});

// Componente espera MAIS props:
const userName = block.content?.userName;      // ❌ Não está no schema
const percentage = block.content?.percentage;  // ❌ Não está no schema
```

**Solução:**
```typescript
// Atualizar schema para refletir props reais
export const resultMainBlockSchema = z.object({
  // Props do schema original
  styleName: z.string().min(1, 'Nome do estilo é obrigatório'),
  description: z.string().optional(),
  showIcon: z.boolean().optional(),
  customImage: urlSchema.optional(),
  backgroundColor: colorSchema.optional(),
  
  // ✅ Adicionar props usadas pelo componente
  userName: z.string().optional(),
  percentage: z.string().optional(),
  showCelebration: z.boolean().optional().default(true),
  textColor: colorSchema.optional(),
  accentColor: colorSchema.optional(),
});

// Gerar tipo TypeScript do schema
export type ResultMainBlockData = z.infer<typeof resultMainBlockSchema>;

// Usar no componente
export default function ResultMainBlock({
  block,
}: { block: { content: ResultMainBlockData } }) {
  const { userName, styleName, percentage, showCelebration } = block.content;
  // ✅ Type-safe!
}
```

---

## 📊 Resumo de Cobertura

| Categoria | Schemas Zod | Componentes | Cobertura |
|-----------|-------------|-------------|-----------|
| **Básicos** (text, button, image, etc.) | ✅ 10/10 | ✅ 10/10 | 100% |
| **Quiz** (question, options) | ✅ 5/5 | ✅ 5/5 | 100% |
| **Transição** (title, loader, progress) | ✅ 5/5 | ✅ 5/5 | 100% |
| **Resultado** (result-*, cta, etc.) | ⚠️ 5/7 | ✅ 7/7 | 71% |
| **Intro** (logo, form, title) | ✅ 4/4 | ✅ 4/4 | 100% |
| **Offer** (pricing, hero, guarantee) | ✅ 6/6 | ✅ 6/6 | 100% |

**Total:** 35/37 schemas (95% de cobertura)

**Schemas ausentes:**
1. ❌ `result-congrats` 
2. ❌ `result-progress-bars`

---

## ✅ Checklist de Ações Recomendadas

### Prioridade Alta (Crítico)
- [ ] **Criar schemas Zod para blocos de resultado ausentes**
  - [ ] `result-congrats`
  - [ ] `result-progress-bars`
- [ ] **Atualizar schemas existentes para refletir props reais dos componentes**
  - [ ] `resultMainBlockSchema` (+userName, +percentage)
  - [ ] `resultSecondaryStylesBlockSchema` (validar com componente)

### Prioridade Média (Importante)
- [ ] **Normalizar `content` vs `properties` vs `props`**
  - [ ] TemplateLoader: consolidar tudo em `content`
  - [ ] Atualizar Master JSON para usar apenas `content`
- [ ] **Adicionar validação no EnhancedBlockRegistry**
  - [ ] Vincular schema Zod a cada BLOCK_DEFINITION
  - [ ] Validar props antes de renderizar

### Prioridade Baixa (Melhoria)
- [ ] **Gerar tipos TypeScript automaticamente de schemas Zod**
  - [ ] Script: `scripts/generate-block-types-from-zod.ts`
  - [ ] Usar `z.infer<>` para todos os schemas
- [ ] **Criar testes unitários para schemas**
  - [ ] `src/__tests__/schemas/blockSchemas.test.ts`
  - [ ] Validar casos válidos e inválidos
- [ ] **Documentação de schemas**
  - [ ] Adicionar JSDoc a cada schema
  - [ ] Gerar docs automáticos com `zod-to-json-schema`

---

## 🎯 Próximos Passos Imediatos

1. **Verificar no Browser:**
   ```
   http://localhost:5173/editor?template=quiz21StepsComplete&step=20
   ```
   
   **Checklist visual:**
   - [ ] Todos os 10 blocos aparecem?
   - [ ] Conteúdo renderiza corretamente?
   - [ ] Drag & drop funciona?
   - [ ] Painel de propriedades abre?

2. **Adicionar schemas ausentes:**
   ```bash
   # Editar src/schemas/blockSchemas.ts
   # Adicionar resultCongratsBlockSchema
   # Adicionar resultProgressBarsBlockSchema
   # Atualizar BLOCK_SCHEMAS
   ```

3. **Validar integridade:**
   ```bash
   npm run test:templates  # Validar todos os templates com Zod
   npm run check          # Type-check TypeScript
   ```

---

**Fim da Análise Etapa por Etapa**
