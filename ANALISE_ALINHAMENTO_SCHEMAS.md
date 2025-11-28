# 🔍 Análise de Alinhamento - Schemas Core vs Implementação Modular

**Data:** 28 de novembro de 2025  
**Status:** ⚠️ **DESALINHAMENTO CRÍTICO DETECTADO**

---

## ❌ Problemas Identificados

### 1. **Schemas Duplicados e Conflitantes**

#### `/src/core/schemas/stepSchema.ts` (Core)
```typescript
export const StepSchema = z.object({
    id: z.string(),
    type: StepTypeSchema, // enum: 'intro' | 'question' | 'transition' | 'result' | 'offer'
    blocks: BlocksArraySchema,
    metadata: StepMetadataSchema,
});
```

#### `/shared/schemas/funnel.schema.ts` (Shared)
```typescript
export const StepSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  order: z.number().int().positive('Order deve ser positivo'),
  type: z.enum(['question', 'result', 'transition']).optional(),
  blocks: z.array(z.any()).optional(),
  nextStep: z.string().optional(),
});
```

#### `/server/api/controllers/funnel-steps.controller.ts` (Controller - NOVO)
```typescript
const CreateStepSchema = z.object({
  stepId: z.string().regex(/^step-\d+$/).optional(),
  templateVersion: z.string().default('4.0'),
  metadata: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional()
  }),
  blocks: z.array(z.object({
    id: z.string(),
    type: z.string(),
    order: z.number().optional(),
    content: z.any().optional(),
    properties: z.any().optional(),
    style: z.any().optional()
  })),
  navigation: z.any().optional(),
  validation: z.any().optional()
});
```

**🚨 PROBLEMA:** Três schemas diferentes para o mesmo conceito de "Step"!

---

### 2. **Falta de Importação de Schemas Core**

O controller `funnel-steps.controller.ts` **NÃO** está usando os schemas oficiais:

❌ **Não importa:**
- `BlockSchema` de `/src/core/schemas/blockSchema.ts`
- `StepSchema` de `/src/core/schemas/stepSchema.ts`
- Schemas compartilhados de `/shared/schemas/`

✅ **Deveria importar:**
```typescript
import { BlockSchema, BlocksArraySchema } from '@/core/schemas/blockSchema';
import { StepSchema } from '@/core/schemas/stepSchema';
// ou
import { StepSchema } from '@/shared/schemas/funnel.schema';
```

---

### 3. **Estrutura de Dados Inconsistente**

#### Core Schema (src/core)
```typescript
{
  id: string,           // ✅ simples
  type: StepType,       // ✅ enum validado
  blocks: Block[],      // ✅ validado com BlockSchema
  metadata: {...}       // ✅ opcional
}
```

#### Shared Schema (shared/)
```typescript
{
  id: string,           // ✅ com validação mínima
  order: number,        // ⚠️ campo extra
  type: StepType,       // ⚠️ enum limitado (só 3 tipos)
  blocks: any[],        // ❌ sem validação
  nextStep: string      // ⚠️ campo extra
}
```

#### Controller Schema (server/api - NOVO)
```typescript
{
  stepId: string,       // ⚠️ nome diferente
  templateVersion: string, // ⚠️ campo extra
  metadata: {           // ✅ rico mas diferente
    id, name, description, category, tags
  },
  blocks: {             // ❌ validação superficial
    id, type, order, content, properties, style
  }[],
  navigation: any,      // ❌ sem validação
  validation: any       // ❌ sem validação
}
```

---

### 4. **Falta de Validação TypeScript**

O controller usa `z.any()` em vários lugares críticos:
- ❌ `content: z.any()` - deveria usar ContentSchema
- ❌ `properties: z.any()` - deveria usar BlockPropertiesSchema
- ❌ `style: z.any()` - deveria ter schema próprio
- ❌ `navigation: z.any()` - deveria ter NavigationSchema
- ❌ `validation: z.any()` - deveria ter ValidationSchema

---

### 5. **Services Não Usam Schemas Core**

#### FunnelExportService.ts
```typescript
// ❌ NÃO importa schemas
// ❌ Constrói objetos manualmente sem validação
// ❌ Assume estrutura sem type-safety
```

#### FunnelImportService.ts
```typescript
// ❌ NÃO valida contra schemas oficiais
// ❌ Aceita "qualquer" estrutura
// ❌ Pode quebrar com dados inválidos
```

---

## 📊 Mapeamento de Schemas Atuais

### Localização dos Schemas

| Schema | Localização | Usado Por | Status |
|--------|-------------|-----------|--------|
| **BlockSchema** | `/src/core/schemas/blockSchema.ts` | Editor, SchemaInterpreter | ✅ Core oficial |
| **StepSchema (Core)** | `/src/core/schemas/stepSchema.ts` | Editor interno | ✅ Core oficial |
| **StepSchema (Shared)** | `/shared/schemas/funnel.schema.ts` | API, Frontend | ⚠️ Conflita com Core |
| **CreateStepSchema** | `/server/api/controllers/funnel-steps.controller.ts` | API modular | ❌ Desalinhado |
| **UpdateStepSchema** | `/server/api/controllers/funnel-steps.controller.ts` | API modular | ❌ Desalinhado |

---

## 🔧 Correções Necessárias

### CRÍTICO - Prioridade 1

#### 1. Consolidar Schemas de Step
**Problema:** 3 schemas diferentes para Step  
**Solução:** Escolher 1 schema oficial e refatorar todos os usos

**Opção A - Usar Core Schema:**
```typescript
// server/api/controllers/funnel-steps.controller.ts
import { StepSchema } from '@/core/schemas/stepSchema';
import { BlockSchema, BlocksArraySchema } from '@/core/schemas/blockSchema';

// Estender schema core com campos específicos da API
const CreateStepSchema = StepSchema.extend({
  templateVersion: z.string().default('4.0'),
  navigation: NavigationSchema.optional(),
  validation: ValidationSchema.optional()
});
```

**Opção B - Usar Shared Schema (Recomendado):**
```typescript
// server/api/controllers/funnel-steps.controller.ts
import { StepSchema } from '@/shared/schemas/funnel.schema';

// Estender com campos modulares
const ModularStepSchema = StepSchema.extend({
  templateVersion: z.string().default('4.0'),
  metadata: StepMetadataSchema
});
```

#### 2. Adicionar Validação de Blocos
**Problema:** Blocos validados como `z.any()`  
**Solução:** Usar BlockSchema oficial

```typescript
import { BlockSchema, BlocksArraySchema } from '@/core/schemas/blockSchema';

const CreateStepSchema = z.object({
  // ... outros campos
  blocks: BlocksArraySchema, // ✅ validação completa
  // ... resto
});
```

#### 3. Criar Schemas para Campos Faltantes

```typescript
// Adicionar em /src/core/schemas/navigationSchema.ts
export const NavigationSchema = z.object({
  nextStep: z.string().optional(),
  prevStep: z.string().optional(),
  allowBack: z.boolean().default(true),
  autoAdvance: z.boolean().default(false),
  autoAdvanceDelay: z.number().positive().optional()
});

// Adicionar em /src/core/schemas/validationSchema.ts
export const ValidationSchema = z.object({
  required: z.array(z.string()).optional(),
  rules: z.record(z.any()).optional(),
  errorMessages: z.record(z.string()).optional()
});
```

### IMPORTANTE - Prioridade 2

#### 4. Atualizar Services para Usar Schemas

```typescript
// src/services/FunnelExportService.ts
import { StepSchema } from '@/core/schemas/stepSchema';
import { BlockSchema } from '@/core/schemas/blockSchema';

export class FunnelExportService {
  private cleanStepForExport(step: any) {
    // ✅ Validar antes de exportar
    const validated = StepSchema.parse(step);
    
    // ✅ Garantir estrutura correta
    return validated;
  }
}
```

```typescript
// src/services/FunnelImportService.ts
import { StepsArraySchema } from '@/core/schemas/stepSchema';

export class FunnelImportService {
  async import(data: any, mode: ImportMode) {
    // ✅ Validar dados importados
    const validation = StepsArraySchema.safeParse(data.steps);
    
    if (!validation.success) {
      throw new ValidationError(validation.error);
    }
    
    // ✅ Prosseguir com dados validados
    const steps = validation.data;
  }
}
```

#### 5. Atualizar Scripts de Build

```typescript
// scripts/build-modular-template.mjs
import { StepSchema } from '../src/core/schemas/stepSchema.ts';

function buildCompiledTemplate() {
  for (const stepFile of stepFiles) {
    const step = JSON.parse(fs.readFileSync(stepFile, 'utf-8'));
    
    // ✅ Validar cada step
    const validation = StepSchema.safeParse(step);
    if (!validation.success) {
      console.error(`Step ${stepFile} inválido:`, validation.error);
      invalidSteps++;
      continue;
    }
    
    // ✅ Usar step validado
    steps[stepId] = validation.data;
  }
}
```

### RECOMENDADO - Prioridade 3

#### 6. Adicionar Testes de Schema

```typescript
// tests/schemas/step-schema-alignment.test.ts
import { describe, it, expect } from 'vitest';
import { StepSchema as CoreStepSchema } from '@/core/schemas/stepSchema';
import { StepSchema as SharedStepSchema } from '@/shared/schemas/funnel.schema';
import { CreateStepSchema } from '@/server/api/controllers/funnel-steps.controller';

describe('Schema Alignment', () => {
  it('should validate same step data across all schemas', () => {
    const stepData = {
      id: 'step-01',
      type: 'question',
      blocks: [],
      metadata: {}
    };
    
    // ✅ Todos devem validar o mesmo dado
    expect(CoreStepSchema.parse(stepData)).toBeDefined();
    expect(SharedStepSchema.parse(stepData)).toBeDefined();
    expect(CreateStepSchema.parse(stepData)).toBeDefined();
  });
});
```

---

## 🎯 Plano de Ação Recomendado

### Fase 1: Consolidação (1-2 dias)
1. ✅ Definir schema oficial único para Step
2. ✅ Criar NavigationSchema e ValidationSchema
3. ✅ Atualizar funnel-steps.controller.ts para usar schemas core
4. ✅ Remover schemas duplicados

### Fase 2: Validação (1 dia)
5. ✅ Adicionar validação em FunnelExportService
6. ✅ Adicionar validação em FunnelImportService
7. ✅ Adicionar validação nos scripts de build

### Fase 3: Testes (1 dia)
8. ✅ Criar testes de alinhamento de schemas
9. ✅ Executar teste E2E com validação ativada
10. ✅ Validar todos os steps modulares contra schema

### Fase 4: Documentação (meio dia)
11. ✅ Documentar estrutura oficial de schemas
12. ✅ Criar guia de migração para desenvolvedores
13. ✅ Atualizar README com arquitetura de schemas

---

## 📋 Checklist de Validação

### Schemas Core
- [ ] BlockSchema usado em todos os lugares
- [ ] StepSchema consolidado (uma única versão)
- [ ] NavigationSchema criado e usado
- [ ] ValidationSchema criado e usado
- [ ] Todos os schemas exportados em `/src/core/schemas/index.ts`

### Controller API
- [ ] Importa schemas de `/src/core/schemas/`
- [ ] CreateStepSchema usa BlocksArraySchema
- [ ] UpdateStepSchema deriva de CreateStepSchema
- [ ] Validação Zod em todos os endpoints
- [ ] TypeScript strict mode ativado

### Services
- [ ] FunnelExportService valida antes de exportar
- [ ] FunnelImportService valida após importar
- [ ] Ambos usam schemas oficiais
- [ ] Error handling para validação

### Scripts
- [ ] build-modular-template.mjs valida steps
- [ ] split-master-to-modular.mjs valida output
- [ ] validate-modular-architecture.mjs usa schemas
- [ ] test-e2e-modular.mjs testa schemas

### Testes
- [ ] Testes de unidade para cada schema
- [ ] Testes de integração para validação
- [ ] Teste E2E com validação completa
- [ ] Cobertura > 80% em código de schemas

---

## 🚨 Impacto do Desalinhamento

### Riscos Atuais

1. **Inconsistência de Dados**
   - Steps com estruturas diferentes
   - Blocos sem validação adequada
   - Possibilidade de dados corrompidos

2. **Bugs em Produção**
   - Editor pode gerar steps inválidos
   - API pode aceitar dados malformados
   - Export/Import pode falhar silenciosamente

3. **Dificuldade de Manutenção**
   - 3 schemas para manter sincronizados
   - Mudanças precisam ser replicadas
   - Risco de regressões

4. **Perda de Type Safety**
   - TypeScript não pode inferir tipos corretos
   - IntelliSense não funciona adequadamente
   - Erros só aparecem em runtime

### Benefícios da Correção

1. **Dados Confiáveis**
   - ✅ Validação em tempo de compilação
   - ✅ Estrutura garantida
   - ✅ Sem dados corrompidos

2. **Código Mais Seguro**
   - ✅ Type safety completo
   - ✅ Erros detectados cedo
   - ✅ IntelliSense funcional

3. **Manutenção Fácil**
   - ✅ Single source of truth
   - ✅ Mudanças em um lugar só
   - ✅ Menos bugs

4. **Performance**
   - ✅ Validação otimizada com Zod
   - ✅ Cache de schemas
   - ✅ Build time menor

---

## 📚 Referências

### Schemas Core Existentes
- `/src/core/schemas/blockSchema.ts` - Schema de blocos
- `/src/core/schemas/stepSchema.ts` - Schema de steps
- `/src/core/schemas/index.ts` - Barrel export

### Schemas Compartilhados
- `/shared/schemas/funnel.schema.ts` - Schemas de funnel

### Validação
- `/src/core/schema/SchemaInterpreter.ts` - Interpretação de schemas
- `/src/core/schema/propertyValidation.ts` - Validação de propriedades
- `/src/core/schema/zodSchemaBuilder.ts` - Builder de schemas Zod

### Ferramentas
- Zod: https://zod.dev/
- TypeScript: https://www.typescriptlang.org/
- JSON Schema: https://json-schema.org/

---

## ✅ Conclusão

**Status Atual:** ⚠️ **DESALINHAMENTO CRÍTICO**

A implementação modular v4.0 está **funcionalmente completa** mas **estruturalmente desalinhada** com os schemas core do sistema.

**Prioridade:** 🔴 **ALTA** - Deve ser corrigido antes de produção

**Tempo Estimado:** 3-4 dias de trabalho

**Risco se Não Corrigir:** 
- Dados inconsistentes
- Bugs difíceis de rastrear  
- Problemas de integração com editor
- Dificuldade de manutenção

**Recomendação:** Iniciar Fase 1 (Consolidação) imediatamente.
