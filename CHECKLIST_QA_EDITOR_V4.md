# ✅ CHECKLIST DE QA - Editor de Quiz V4

**Data:** 01/12/2025  
**Versão:** 4.0.0

---

## 🎯 VALIDAÇÃO AUTOMÁTICA DE TEMPLATES

### **✅ Implementado: Template Validator**

**Arquivo:** `/src/components/editor/ModernQuizEditor/utils/templateValidator.ts`

**Funções:**
```typescript
// Validação completa com auto-fix
validateTemplateFormat(template) → { valid, errors, warnings, fixed }

// Valida e lança exceção se inválido
assertValidTemplate(template) → asserts template is QuizSchema

// Relatório formatado
formatValidationReport(result) → string

// Validação rápida
quickValidateStepsFormat(template) → boolean
```

---

## 📋 CHECKLIST DE QUALIDADE

### **1️⃣ FORMATO DO TEMPLATE**

**Antes de carregar qualquer template, verificar:**

- [ ] `steps` é array (não objeto)
- [ ] Cada step tem `id`, `type`, `blocks`
- [ ] Cada step tem `navigation`, `validation`, `version`
- [ ] Cada bloco tem `id`, `type`, `metadata`
- [ ] `metadata` tem `editable`, `reorderable`, `reusable`, `deletable`

**Comando de validação:**
```typescript
import { validateTemplateFormat, formatValidationReport } from '@/components/editor/ModernQuizEditor/utils/templateValidator';

const result = validateTemplateFormat(template);
console.log(formatValidationReport(result));

if (result.fixed) {
  // Usar template corrigido
  template = result.fixed;
}
```

---

### **2️⃣ SELEÇÃO AUTOMÁTICA DE STEP**

**Verificar no console do navegador:**

```javascript
// Deve aparecer ao carregar editor:
🎯 Auto-selecionando primeiro step: { stepId: "step-01", blocksCount: 5 }
✅ Verificação pós-seleção: { selectedStepId: "step-01", match: true }
```

**Se NÃO aparecer:**
```javascript
// Verificar manualmente:
const { selectedStepId } = useEditorStore.getState();
console.log('Step selecionado:', selectedStepId); // deve ser "step-01"

// Se for null, forçar seleção:
useEditorStore.getState().selectStep(quiz.steps[0].id);
```

---

### **3️⃣ REGISTRO DE BLOCOS**

**Sempre que criar um novo tipo de bloco, registrar:**

```typescript
// src/core/registry/blockRegistry.ts
import { IntroTitle } from '@/components/editor/blocks/intro/IntroTitle';

blockRegistry.register('intro-title', {
  component: IntroTitle,
  editable: true,
  reorderable: true,
  reusable: true,
  deletable: true,
});
```

**Verificar blocos registrados:**
```javascript
// No console do navegador:
import { blockRegistry } from '@/core/registry/blockRegistry';

// Verificar se bloco existe:
const component = blockRegistry.getComponent('intro-title');
console.log('Componente registrado:', !!component);
```

---

### **4️⃣ PAINEL DE PROPRIEDADES**

**Sempre que criar um novo tipo de bloco, adicionar campos:**

```typescript
// src/components/editor/ModernQuizEditor/utils/propertyEditors.ts
import { IntroTitleFields } from './fields/IntroTitleFields';

export const PROPERTY_EDITORS: Record<string, FC<FieldEditorProps>> = {
  'intro-title': IntroTitleFields,
  // ... outros blocos
};
```

**Verificar campos no painel:**
```javascript
// No console do navegador:
import { getFieldsForType } from '@/components/editor/ModernQuizEditor/utils/propertyEditors';

const fields = getFieldsForType('intro-title');
console.log('Campos disponíveis:', fields); // deve retornar array com campos
```

---

### **5️⃣ RENDERIZAÇÃO NO CANVAS**

**Verificar no console logs diagnóstico:**

```javascript
🔍 Canvas DIAGNÓSTICO: {
  1_temQuiz: true,
  2_temSteps: true,
  3_quantosSteps: 21,
  4_stepSelecionado: "step-01",
  5_stepEncontrado: true,
  6_stepId: "step-01",
  7_temBlocks: true,
  8_quantosBlocks: 5,
  9_primeiroBloco: { id: "block-1", type: "intro-title", hasProperties: true }
}
```

**Se algum campo for `false`:**
- `temQuiz: false` → Quiz não carregou (verificar logs de carregamento)
- `stepSelecionado: null` → Step não foi selecionado (verificar auto-seleção)
- `temBlocks: false` → Step não tem blocos (verificar estrutura do JSON)

---

### **6️⃣ TESTES AUTOMATIZADOS**

**Executar testes diagnóstico:**

```bash
# Todos os testes
npm test -- src/components/editor/ModernQuizEditor/__tests__/*.diagnostic.test.tsx --run

# Apenas renderização
npm test -- block-rendering.diagnostic.test.tsx --run

# Apenas painel de propriedades
npm test -- properties-panel.diagnostic.test.tsx --run

# Apenas integração
npm test -- integration.diagnostic.test.tsx --run
```

**Resultado esperado:**
- ✅ Blocos sem componente registrado → 0 blocos faltando
- ✅ Renderização de blocos → Todos blocos aparecem no DOM
- ✅ LazyBlockRenderer → Carrega componentes dinamicamente
- ⏭️ getAllTypes() → SKIP (método não implementado)
- ⏭️ Quiz carrega → SKIP se timeout

---

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

### **Problema: "Steps é objeto, não array"**

**Sintoma:**
```javascript
quiz.steps.length // undefined
quiz.steps[0] // undefined
```

**Solução:**
```typescript
import { normalizeQuizFormat } from '@/components/editor/ModernQuizEditor/utils/quizAdapter';

const normalizedQuiz = normalizeQuizFormat(quiz);
// Agora steps é array!
```

---

### **Problema: "Bloco não renderiza"**

**Checklist:**
1. ✅ Tipo registrado no `blockRegistry`?
2. ✅ Step selecionado automaticamente?
3. ✅ Bloco tem `id`, `type`, `metadata`?
4. ✅ Componente exportado corretamente?

**Debug:**
```javascript
// 1. Verificar registro:
const component = blockRegistry.getComponent('intro-title');
console.log('Registrado:', !!component);

// 2. Verificar step selecionado:
const { selectedStepId } = useEditorStore.getState();
console.log('Step:', selectedStepId);

// 3. Verificar estrutura do bloco:
const step = quiz.steps[0];
console.log('Blocos:', step.blocks);
```

---

### **Problema: "Painel de propriedades vazio"**

**Checklist:**
1. ✅ Bloco selecionado?
2. ✅ Campos definidos em `propertyEditors.ts`?
3. ✅ `getFieldsForType()` retorna campos?

**Debug:**
```javascript
// 1. Verificar bloco selecionado:
const { selectedBlockId } = useEditorStore.getState();
console.log('Bloco:', selectedBlockId);

// 2. Verificar campos:
import { getFieldsForType } from '@/components/editor/ModernQuizEditor/utils/propertyEditors';
const fields = getFieldsForType('intro-title');
console.log('Campos:', fields);
```

---

### **Problema: "Auto-save não funciona"**

**Checklist:**
1. ✅ `isDirty` vira `true` após edição?
2. ✅ `usePersistence` está ativo?
3. ✅ Autenticação válida?

**Debug:**
```javascript
// 1. Verificar isDirty:
const { isDirty } = useQuizStore.getState();
console.log('Dirty:', isDirty);

// 2. Forçar save manualmente:
const { save } = useQuizStore.getState();
await save();
```

---

## 📊 LOGS DE VALIDAÇÃO

### **Formato Correto (V4):**

```
✅ Template válido!
📂 Quiz normalizado: { steps: 21, firstStepBlocks: 5 }
🎯 Auto-selecionando primeiro step: { stepId: "step-01", blocksCount: 5 }
✅ Verificação pós-seleção: { selectedStepId: "step-01", match: true }
```

### **Formato Legado (objeto):**

```
⚠️ Template com problemas detectados:
📋 RELATÓRIO DE VALIDAÇÃO DE TEMPLATE
==============================================
❌ TEMPLATE INVÁLIDO

🚨 ERROS (1):
  [CRITICAL] STEPS_NOT_ARRAY
  📍 steps
  💬 Steps deve ser um array, mas é object

🔧 AUTO-CORREÇÃO DISPONÍVEL
✅ Usando template auto-corrigido
📂 Quiz normalizado: { steps: 21, firstStepBlocks: 5 }
```

---

## 🎯 CHECKLIST FINAL ANTES DE PRODUÇÃO

### **Template:**
- [ ] ✅ Validado com `validateTemplateFormat()`
- [ ] ✅ `steps` é array
- [ ] ✅ Todos blocos têm `metadata` completo
- [ ] ✅ Todos steps têm `navigation`, `validation`, `version`

### **Blocos:**
- [ ] ✅ Todos tipos registrados em `blockRegistry`
- [ ] ✅ Todos componentes exportados
- [ ] ✅ Todos campos definidos em `propertyEditors`

### **Editor:**
- [ ] ✅ Quiz carrega sem erros
- [ ] ✅ Primeiro step selecionado automaticamente
- [ ] ✅ Blocos renderizam no Canvas
- [ ] ✅ Painel de propriedades mostra campos
- [ ] ✅ Edição atualiza store (isDirty = true)
- [ ] ✅ Auto-save funciona (3s debounce)

### **Testes:**
- [ ] ✅ Testes diagnóstico passam
- [ ] ✅ Sem erros no console
- [ ] ✅ Sem avisos críticos

---

## 🚀 COMANDO RÁPIDO DE VALIDAÇÃO

```bash
# 1. Validar TypeScript
npm run check

# 2. Executar testes
npm test -- *.diagnostic.test.tsx --run

# 3. Verificar no navegador
# Abrir /editor e verificar console para logs de validação
```

---

## 📝 NOTAS FINAIS

### **Sempre que:**

1. **Criar novo template** → Validar com `validateTemplateFormat()`
2. **Adicionar novo bloco** → Registrar em `blockRegistry` + `propertyEditors`
3. **Modificar estrutura** → Executar testes diagnóstico
4. **Deploy** → Verificar checklist completo

### **Lembrete:**

> O caminho de busca dos blocos está correto (`step.blocks`).  
> 99% dos problemas vêm de:
> - Formato do JSON (objeto vs array)
> - Blocos não registrados
> - Step não selecionado
> - Campos não definidos

**Use os validadores e testes para detectar problemas antes de produção!**
