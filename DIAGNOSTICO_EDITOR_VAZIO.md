# 🔍 DIAGNÓSTICO: Editor Abre Vazio

**Data:** 12 de outubro de 2025  
**Problema:** Editor em `/editor?template=quiz-estilo-21-steps` abre vazio (sem steps)  
**Status:** 🔴 **EM INVESTIGAÇÃO**

---

## ✅ O QUE ESTÁ FUNCIONANDO

### **1. Steps Registrados com Sucesso**
```
✅ 21 steps de produção registrados com sucesso!
✅ Step registrado: step-01 até step-21
✅ VersioningService inicializado
✅ HistoryManager inicializado
✅ UnifiedCRUDService inicializado
```

### **2. Sistema Carregando Corretamente**
- ✅ StepRegistry mostra 30 entries (21 steps + 9 aliases)
- ✅ Todos os steps têm nome, categoria, validação
- ✅ Navegação configurada (permite próximo/anterior)
- ✅ Performance metrics sendo coletados

---

## ❌ O QUE NÃO ESTÁ FUNCIONANDO

### **1. Editor Vazio**
- ❌ Nenhum step aparece na lista do editor
- ❌ Interface mostra editor vazio
- ❌ Sem erro visível no console

### **2. Erro do Supabase**
```
⚠️ Erro ao conectar com Supabase: ReferenceError: process is not defined
at UnifiedCRUDService.loadFromSupabase (UnifiedCRUDService.ts:177:27)
```
**Análise:** Erro relacionado a `process.env` no browser. Não deveria bloquear carregamento do template.

---

## 🔍 TESTES A REALIZAR

### **Teste 1: Verificar se QuizModularProductionEditor recebe o template**
```typescript
// Em QuizModularProductionEditor.tsx, adicionar log no início do componente
console.log('🎯 EDITOR DEBUG:', {
  searchParams: window.location.search,
  template: new URLSearchParams(window.location.search).get('template'),
  funnelId: new URLSearchParams(window.location.search).get('funnelId'),
  steps: steps?.length || 0
});
```

### **Teste 2: Verificar se useEffect está sendo chamado**
```typescript
// No useEffect que carrega o template
useEffect(() => {
  console.log('🔄 LOADING TEMPLATE:', {
    hasTemplate: !!templateId,
    templateId,
    stepsLength: steps?.length,
    isLoading
  });
  // ... resto do código
}, []);
```

### **Teste 3: Verificar se QuizTemplateAdapter funciona**
```typescript
// Testar diretamente no console
const adapter = await import('@/adapters/QuizTemplateAdapter');
const unified = await adapter.QuizTemplateAdapter.convertLegacyTemplate();
console.log('📋 TEMPLATE UNIFICADO:', unified);
```

### **Teste 4: Verificar se buildFashionStyle21Steps funciona**
```typescript
// No console do navegador
// Verificar se a função existe e retorna steps
const result = buildFashionStyle21Steps();
console.log('🏗️ BUILD STEPS:', result);
```

### **Teste 5: Verificar estado do React**
```typescript
// Adicionar logs no setState
setSteps((prev) => {
  console.log('📝 SET STEPS:', {
    previous: prev?.length,
    new: steps?.length
  });
  return steps;
});
```

---

## 🧪 HIPÓTESES

### **Hipótese 1: Template ID não corresponde**
**Possível causa:** `quiz-estilo-21-steps` não é reconhecido como `quiz21StepsComplete`

**Teste:**
```typescript
// Verificar mapeamento de templates
const templateId = new URLSearchParams(window.location.search).get('template');
console.log('Template ID:', templateId);
// Espera-se: 'quiz-estilo-21-steps'
// Mas código procura: 'quiz21StepsComplete' ou 'fashionStyle21PtBR'
```

**Evidência:**
```typescript
// QuizModularProductionEditor.tsx linha ~423
if (templateId === 'fashionStyle21PtBR') {
  // ...
} else if (templateId === 'quiz21StepsComplete') {
  // ...
}
// ❌ NÃO HÁ CASO PARA 'quiz-estilo-21-steps'
```

**Solução esperada:**
```typescript
else if (templateId === 'quiz-estilo-21-steps' || templateId === 'quiz21StepsComplete') {
  // carregar template
}
```

---

### **Hipótese 2: useEffect não executa**
**Possível causa:** Dependências do useEffect impedem execução

**Teste:**
```typescript
// Verificar se useEffect tem array de dependências vazio
useEffect(() => {
  console.log('🔄 EFFECT CALLED');
}, []); // ← array vazio = executa uma vez no mount
```

---

### **Hipótese 3: Steps são carregados mas setState falha**
**Possível causa:** setState não atualiza devido a condição

**Teste:**
```typescript
if (!steps || steps.length === 0) {
  console.log('⚠️ Condição passou, carregando template');
  // carregar
} else {
  console.log('❌ Condição falhou, steps já existem:', steps);
}
```

---

### **Hipótese 4: Async/await não espera**
**Possível causa:** IIFE assíncrona não aguarda antes de setIsLoading(false)

**Teste:**
```typescript
(async () => {
  console.log('🔄 ASYNC START');
  const unified = await QuizTemplateAdapter.convertLegacyTemplate();
  console.log('✅ ASYNC COMPLETE:', unified);
  setSteps(initialFromDoc);
  console.log('✅ SET STEPS CALLED');
})();
```

---

## 🎯 SOLUÇÃO MAIS PROVÁVEL

### **Problema Identificado:**
O código verifica `templateId === 'quiz21StepsComplete'` mas a URL usa `?template=quiz-estilo-21-steps`.

### **Correção Necessária:**
Adicionar suporte para `quiz-estilo-21-steps` no switch case:

```typescript
// QuizModularProductionEditor.tsx
if (templateId === 'fashionStyle21PtBR') {
  // ...
} else if (
  templateId === 'quiz21StepsComplete' || 
  templateId === 'quiz-estilo-21-steps' // ← ADICIONAR
) {
  // carregar via QuizTemplateAdapter
}
```

---

## 📊 LOGS ESPERADOS vs REAIS

### **Logs Esperados (se funcionasse):**
```
🎯 EDITOR DEBUG: {template: 'quiz-estilo-21-steps', steps: 0}
🔄 LOADING TEMPLATE: {hasTemplate: true, templateId: 'quiz-estilo-21-steps'}
🏗️ Carregando template unificado...
✅ Template carregado: 21 steps
📝 SET STEPS: {previous: 0, new: 21}
```

### **Logs Reais (atual):**
```
✅ 21 steps de produção registrados (StepRegistry)
✅ VersioningService inicializado
✅ HistoryManager inicializado
⚠️ Erro ao conectar com Supabase (não crítico)
✅ UnifiedCRUDService inicializado
(sem logs do editor carregando template)
```

**Conclusão:** O template NÃO está sendo processado pelo editor.

---

## 🔧 PLANO DE AÇÃO

### **Passo 1: Adicionar Logs de Debug**
```typescript
// No início do QuizModularProductionEditor
console.log('🎯 EDITOR MOUNTED:', {
  url: window.location.href,
  template: new URLSearchParams(window.location.search).get('template'),
  steps: steps?.length
});
```

### **Passo 2: Adicionar Case para quiz-estilo-21-steps**
```typescript
else if (
  templateId === 'quiz21StepsComplete' || 
  templateId === 'quiz-estilo-21-steps'
) {
  console.log('🏗️ Carregando quiz-estilo-21-steps...');
  // ... código de carregamento
}
```

### **Passo 3: Verificar se QuizTemplateAdapter funciona**
```bash
# No console do navegador
const { QuizTemplateAdapter } = await import('@/adapters/QuizTemplateAdapter');
const result = await QuizTemplateAdapter.convertLegacyTemplate();
console.log('ADAPTER RESULT:', result);
```

### **Passo 4: Testar Rota Alternativa**
```
# Se quiz-estilo-21-steps não funcionar, testar:
http://localhost:5173/editor?template=quiz21StepsComplete
```

---

## 📝 PRÓXIMOS PASSOS

1. ⏳ Adicionar logs de debug no QuizModularProductionEditor
2. ⏳ Adicionar suporte para `quiz-estilo-21-steps` no template switch
3. ⏳ Testar se QuizTemplateAdapter.convertLegacyTemplate() retorna dados
4. ⏳ Verificar se setSteps() está sendo chamado
5. ⏳ Validar que steps aparecem na UI após setSteps

---

**Status:** 🔴 Aguardando implementação dos testes
