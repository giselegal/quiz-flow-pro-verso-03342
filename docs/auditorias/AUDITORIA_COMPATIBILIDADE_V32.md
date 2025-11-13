# 🔧 AUDITORIA DE COMPATIBILIDADE V3.2 - AÇÕES NECESSÁRIAS

## 📊 **STATUS ATUAL**

### ✅ **O QUE JÁ FUNCIONA**
1. **ConsolidatedTemplateService** - ✅ Detecta e processa v3.2
2. **TemplateProcessor** - ✅ Substitui variáveis {{theme.*}} e {{assets.*}}
3. **Templates JSON** - ✅ Todos os 63 arquivos migrados para v3.2
4. **blockConfigMerger** - ✅ JÁ tem fallback `config > properties > content`

### ⚠️ **O QUE PRECISA ATUALIZAR**

---

## 🔴 **CRÍTICO - ATUALIZAR IMEDIATAMENTE**

### **1. Schemas Zod** (`src/types/schemas/templateSchema.ts`)

**PROBLEMA:**
```typescript
// ❌ ATUAL: Só aceita '3.1'
export const stepV31Schema = z.object({
  templateVersion: z.literal('3.1').optional(),
  // ...
});
```

**SOLUÇÃO:**
```typescript
// ✅ CORRIGIR: Aceitar '3.1' E '3.2'
export const stepV31Schema = z.object({
  templateVersion: z.union([z.literal('3.1'), z.literal('3.2')]).optional(),
  // ...
});

// OU melhor ainda:
export const stepSchema = z.object({
  templateVersion: z.enum(['3.0', '3.1', '3.2']).optional(),
  // ...
});
```

**IMPACTO:** 
- 🔴 **ALTO** - Validação vai falhar para templates v3.2
- Templates não passarão na validação
- Pode causar erros silenciosos

**ARQUIVOS A ATUALIZAR:**
- ✅ `src/types/schemas/templateSchema.ts` (linha 57)
- ✅ `src/types/template-v3.types.ts` (linha 641)
- ✅ `src/types/normalizedTemplate.ts` (linha 6, 97)
- ✅ `src/types/dynamic-template.ts` (já está correto - '3.1' | '3.2')

---

### **2. Verificações de Versão Hardcoded**

**PROBLEMA:**
Há 15+ lugares no código checando apenas `'3.0'` ou `'3.1'`:

```typescript
// ❌ PROBLEMA: Não reconhece v3.2
if (template.templateVersion === '3.0' || template.templateVersion === '3.1') {
  // ...
}
```

**SOLUÇÃO:**
```typescript
// ✅ OPÇÃO 1: Adicionar '3.2'
if (['3.0', '3.1', '3.2'].includes(template.templateVersion)) {
  // ...
}

// ✅ OPÇÃO 2: Usar regex
if (/^3\.[0-2]$/.test(template.templateVersion)) {
  // ...
}

// ✅ OPÇÃO 3: Helper function
function isV3Template(version: string): boolean {
  return version.startsWith('3.');
}
```

**ARQUIVOS A ATUALIZAR:**
1. ✅ `src/components/editor/unified/UnifiedStepRenderer.tsx` (linha 144)
2. ✅ `src/components/core/QuizRenderer.tsx` (linha 442)
3. ✅ `src/components/editor/ImportTemplateButton.tsx` (linha 43, 141)
4. ✅ `src/pages/TestV3Page.tsx` (linha 46)
5. ✅ `src/types/normalizedTemplate.ts` (linha 97)
6. ✅ `src/components/step-registry/StepDebug.ts` (linha 187, 224)

---

## 🟡 **MÉDIO - ATUALIZAR LOGO**

### **3. Block Schema - Garantir Fallback de `config`**

**SITUAÇÃO ATUAL:**
```typescript
// ✅ blockConfigMerger.ts JÁ FAZ ISSO:
const config = (block.config && typeof block.config === 'object') ? block.config : {};
const properties = (block.properties && typeof block.properties === 'object') ? block.properties : {};

// Prioridade: config > properties > content
return { ...content, ...properties, ...config };
```

**AÇÃO:**
✅ **Verificar se todos os lugares usam `getBlockConfig()`** em vez de acessar diretamente:

```typescript
// ❌ EVITAR:
const title = block.properties.title || block.config.title;

// ✅ USAR:
import { getBlockConfig } from '@/lib/utils/blockConfigMerger';
const cfg = getBlockConfig(block);
const title = cfg.title;
```

**ARQUIVOS QUE PRECISAM AUDITORIA:**
1. ⚠️ `src/services/editor/UnifiedQuizStepAdapter.ts` (linha 101)
   ```typescript
   // ATUAL: properties: block.properties || block.config || {},
   // MELHOR: properties: getBlockConfig(block),
   ```

2. ⚠️ `src/services/canonical/TemplateFormatAdapter.ts` (linha 124-125)
   ```typescript
   // ATUAL: content: block.content || block.config || block.properties || {},
   // MELHOR: content: getBlockConfig(block),
   ```

3. ⚠️ `src/components/quiz/QuizAppConnected.tsx` (linha 607)
   ```typescript
   // ATUAL: config: { ...def.defaultConfig, ...block.config },
   // MELHOR: config: { ...def.defaultConfig, ...getBlockConfig(block) },
   ```

---

### **4. Painel de Propriedades - Garantir Retrocompatibilidade**

**SITUAÇÃO ATUAL:**
```typescript
// src/components/editor/properties/PropertiesPanel.tsx linha 72
setLocalValues({
  ...block.content,
  ...block.properties,
});
```

**AÇÃO:**
✅ **Adicionar fallback para `config`:**

```typescript
// ✅ CORRIGIR:
import { getBlockConfig } from '@/lib/utils/blockConfigMerger';

setLocalValues(getBlockConfig(block));
```

**IMPACTO:**
- Templates v3.1 (com `config` duplicado) continuam funcionando
- Templates v3.2 (apenas `properties`) funcionam
- UI sempre mostra valores corretos

**ARQUIVOS:**
- ✅ `src/components/editor/properties/PropertiesPanel.tsx` (linha 72)
- ✅ `src/editor/components/PropertiesPanel.tsx` (verificar se existe)
- ✅ `src/components/quiz/builder/PropertiesPanel.tsx` (verificar)

---

## 🟢 **BAIXO - MELHORIAS OPCIONAIS**

### **5. blockPropertySchemas.ts - Adicionar Suporte a Variáveis**

**SUGESTÃO:**
Adicionar validação/hint para variáveis `{{theme.*}}` e `{{assets.*}}`:

```typescript
// src/config/blockPropertySchemas.ts
{
  key: 'backgroundColor',
  label: 'Cor de Fundo',
  type: 'color',
  description: 'Use cores diretas (#FFFFFF) ou variáveis {{theme.colors.primary}}',
  // Adicionar helper para autocomplete:
  suggestions: [
    '{{theme.colors.primary}}',
    '{{theme.colors.secondary}}',
    '{{theme.colors.background}}',
  ],
}
```

**BENEFÍCIO:**
- Desenvolvedores veem quais variáveis estão disponíveis
- Autocomplete no painel de propriedades

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **FASE 1: CRÍTICO** (⏱️ 1-2 horas)

```bash
# 1. Atualizar Schemas Zod
- [ ] src/types/schemas/templateSchema.ts
      - Linha 57: z.literal('3.1') → z.enum(['3.0', '3.1', '3.2'])
      
- [ ] src/types/template-v3.types.ts
      - Linha 641: TemplateVersion = ... | '3.2'
      
- [ ] src/types/normalizedTemplate.ts
      - Linha 6: CanonicalTemplateVersion = '3.0' | '3.1' | '3.2'
      - Linha 97: Adicionar check para '3.2'

# 2. Atualizar Verificações de Versão
- [ ] src/components/editor/unified/UnifiedStepRenderer.tsx (linha 144)
- [ ] src/components/core/QuizRenderer.tsx (linha 442)
- [ ] src/components/editor/ImportTemplateButton.tsx (linha 43, 141)
- [ ] src/pages/TestV3Page.tsx (linha 46)
- [ ] src/components/step-registry/StepDebug.ts (linha 187, 224)

# 3. Criar Helper Function
- [ ] src/lib/utils/versionHelpers.ts
      export function isV3Template(version: string): boolean {
        return version?.startsWith('3.');
      }
```

### **FASE 2: MÉDIO** (⏱️ 2-3 horas)

```bash
# 4. Auditar Uso de getBlockConfig
- [ ] src/services/editor/UnifiedQuizStepAdapter.ts
- [ ] src/services/canonical/TemplateFormatAdapter.ts
- [ ] src/components/quiz/QuizAppConnected.tsx

# 5. Atualizar Painel de Propriedades
- [ ] src/components/editor/properties/PropertiesPanel.tsx
- [ ] Verificar outros painéis
```

### **FASE 3: TESTES** (⏱️ 1 hora)

```bash
# 6. Testes de Validação
- [ ] Criar teste para Zod schema v3.2
- [ ] Testar PropertiesPanel com v3.2
- [ ] Testar navegação completa steps 1→21
- [ ] Verificar console (sem erros de validação)
```

---

## 🧪 **TESTES SUGERIDOS**

### **Teste 1: Validação Zod**
```typescript
// src/types/schemas/__tests__/templateSchema.v32.test.ts
import { stepV31Schema } from '../templateSchema';

test('deve aceitar templateVersion 3.2', () => {
  const template = {
    templateVersion: '3.2',
    metadata: { id: 'step-01', name: 'Test' },
    blocks: [{ id: 'b1', type: 'hero-block', properties: {} }],
  };
  
  const result = stepV31Schema.safeParse(template);
  expect(result.success).toBe(true);
});
```

### **Teste 2: Retrocompatibilidade**
```typescript
test('deve aceitar templates v3.1 com config', () => {
  const blockV31 = {
    id: 'b1',
    type: 'hero-block',
    config: { title: 'Título' },
    properties: { title: 'Título' }, // duplicado
  };
  
  const cfg = getBlockConfig(blockV31);
  expect(cfg.title).toBe('Título');
});

test('deve aceitar templates v3.2 apenas com properties', () => {
  const blockV32 = {
    id: 'b1',
    type: 'hero-block',
    properties: { title: 'Título' },
  };
  
  const cfg = getBlockConfig(blockV32);
  expect(cfg.title).toBe('Título');
});
```

---

## 🎯 **PRIORIZAÇÃO**

| Prioridade | Item | Impacto | Esforço | Urgência |
|------------|------|---------|---------|----------|
| 🔴 P0 | Schemas Zod | Alto | 30min | Imediato |
| 🔴 P0 | Verificações de versão | Alto | 1h | Imediato |
| 🟡 P1 | getBlockConfig audit | Médio | 2h | Logo |
| 🟡 P1 | PropertiesPanel | Médio | 1h | Logo |
| 🟢 P2 | Sugestões de variáveis | Baixo | 2h | Opcional |

---

## 📊 **IMPACTO ESTIMADO**

### **Se não atualizar:**
- ❌ Validação Zod falhará para v3.2
- ❌ UI pode não reconhecer templates v3.2
- ❌ Imports/exports podem quebrar
- ❌ Debug tools mostrarão v3.2 como "desconhecido"

### **Após atualização:**
- ✅ 100% compatível com v3.0, v3.1, v3.2
- ✅ Validação type-safe funcionando
- ✅ UI reconhece todas as versões
- ✅ Zero breaking changes para usuários

---

## 🚀 **EXECUÇÃO RECOMENDADA**

```bash
# 1. Criar branch
git checkout -b feat/v32-compatibility

# 2. Executar FASE 1 (crítico)
# Atualizar schemas e verificações

# 3. Rodar testes
npm test

# 4. Validar no browser
npm run dev
# Testar: http://localhost:8081/editor?resource=quiz21StepsComplete

# 5. Se OK, executar FASE 2
# Auditar getBlockConfig

# 6. Commit e PR
git add .
git commit -m "feat: adicionar suporte completo para templates v3.2"
```

---

## 📝 **RESUMO EXECUTIVO**

**Arquivos que DEVEM ser atualizados:** 10  
**Arquivos que PODEM ser melhorados:** 3  
**Tempo estimado:** 4-6 horas  
**Risco se não atualizar:** 🔴 ALTO (validação quebrada)  
**Complexidade:** 🟢 BAIXA (mudanças simples)  

**Ação imediata:** Atualizar schemas Zod para aceitar `'3.2'`
