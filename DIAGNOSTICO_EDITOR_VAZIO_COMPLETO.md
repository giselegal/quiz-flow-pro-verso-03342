# 🧪 DIAGNÓSTICO COMPLETO: Editor Carregando Vazio

**Data:** 12 de outubro de 2025  
**Problema:** Editor abre mas fica vazio, sem mostrar os steps  
**Status:** 🔍 **EM INVESTIGAÇÃO PROFUNDA**

---

## 📊 EVIDÊNCIAS COLETADAS

### ✅ **O QUE FUNCIONA:**

1. **Servidor está rodando** ✅
   - URL: `http://localhost:5173`
   - Status: 200 OK
   - Vite v5.4.20

2. **Rota `/admin/funil-atual` funciona** ✅
   - Página carrega corretamente
   - Botão "Editar" presente
   - URL gerada: `/editor?template=quiz-estilo-21-steps`

3. **Steps são registrados no console** ✅
   ```
   ✅ Step registrado: step-1 - Introdução
   ✅ Step registrado: step-2 - Pergunta 1
   ...
   ✅ Step registrado: step-21 - Oferta Personalizada
   ✅ 21 steps de produção registrados com sucesso!
   ```

4. **Serviços inicializam** ✅
   ```
   ✅ VersioningService inicializado com sucesso
   ✅ HistoryManager inicializado com sucesso
   ✅ UnifiedCRUDService inicializado com sucesso
   ```

5. **Template JSON existe** ✅
   - Arquivos: `public/templates/step-01-template.json` até `step-21-template.json`
   - Master: `public/templates/quiz21-complete.json`
   - Estrutura válida

---

## ❌ **O QUE NÃO FUNCIONA:**

1. **Editor renderiza vazio** ❌
   - URL: `/editor?template=quiz-estilo-21-steps`
   - Console: Steps registrados
   - Tela: Vazia (sem steps visíveis)

2. **Erro no Supabase** ⚠️
   ```
   ⚠️ Erro ao conectar com Supabase: ReferenceError: process is not defined
       at UnifiedCRUDService.loadFromSupabase (UnifiedCRUDService.ts:177:27)
   ```

3. **Cor inválida no input** ⚠️
   ```
   The specified value "#ccaa6aff" does not conform to the required format.
   The format is "#rrggbb"
   ```

---

## 🔍 ANÁLISE DO FLUXO

### **Fluxo Esperado:**

```
1. User clica "Editar" em /admin/funil-atual
   ↓
2. Abre /editor?template=quiz-estilo-21-steps
   ↓
3. App.tsx detecta ?template= presente
   ↓
4. Renderiza QuizModularProductionEditor com UnifiedCRUDProvider
   ↓
5. QuizModularProductionEditor lê window.location.search
   ↓
6. Verifica templateId === 'quiz-estilo-21-steps' OU 'quiz21StepsComplete'
   ↓
7. Carrega steps via QuizTemplateAdapter.convertLegacyTemplate()
   ↓
8. Define setSteps(initialFromDoc)
   ↓
9. Editor renderiza os 21 steps
```

### **Fluxo Real (o que acontece):**

```
1. ✅ User clica "Editar"
   ↓
2. ✅ Abre /editor?template=quiz-estilo-21-steps
   ↓
3. ✅ App.tsx detecta ?template= presente
   ↓
4. ✅ Renderiza QuizModularProductionEditor
   ↓
5. ✅ Steps são registrados no StepRegistry (console logs)
   ↓
6. ❓ QuizModularProductionEditor lê template?
   ↓
7. ❓ setSteps() é chamado?
   ↓
8. ❌ Editor fica vazio (steps não renderizam)
```

---

## 🎯 HIPÓTESES

### **Hipótese 1: Template ID não é reconhecido**
```typescript
// No QuizModularProductionEditor.tsx (linha ~390)
const templateId = sp.get('template');

if (templateId === 'fashionStyle21PtBR') {
    // carrega fashion style
} else if (templateId === 'quiz21StepsComplete') {
    // carrega quiz 21 steps
}
```

**Problema:** `templateId` é `'quiz-estilo-21-steps'`, mas o código verifica apenas:
- `'fashionStyle21PtBR'`
- `'quiz21StepsComplete'`

**Solução:** Adicionar case para `'quiz-estilo-21-steps'`:
```typescript
else if (templateId === 'quiz21StepsComplete' || templateId === 'quiz-estilo-21-steps') {
    // carrega quiz
}
```

### **Hipótese 2: Steps registrados mas não exibidos**
Os steps são registrados no `StepRegistry`, mas o componente `QuizModularProductionEditor` não está lendo do registry.

**Teste:**
```typescript
// Adicionar log no QuizModularProductionEditor
console.log('🔍 Steps state:', steps);
console.log('🔍 Steps length:', steps?.length);
console.log('🔍 Selected step:', selectedStepId);
```

### **Hipótese 3: Estado assíncrono não atualiza**
O `useEffect` que carrega os steps pode estar falhando silenciosamente.

**Teste:**
```typescript
// Adicionar logs no useEffect (linha ~390)
console.log('🎯 Template ID:', templateId);
console.log('🎯 Steps before:', steps?.length);
// ... carregar steps ...
console.log('🎯 Steps after:', steps?.length);
```

### **Hipótese 4: UnifiedCRUDProvider sobrescreve steps**
O `UnifiedCRUDProvider` com `autoLoad={true}` pode estar tentando carregar do Supabase e sobrescrevendo os steps do template.

**Teste:**
- Desabilitar `autoLoad` temporariamente
- Ou adicionar condicional: `autoLoad={!hasTemplate}`

---

## 🛠️ PLANO DE AÇÃO

### **Passo 1: Adicionar case para quiz-estilo-21-steps** ⚠️ **CRÍTICO**
```typescript
// Em src/components/editor/quiz/QuizModularProductionEditor.tsx
// Linha ~422 (no useEffect onde verifica templateId)

if (templateId === 'fashionStyle21PtBR') {
    // ...
} else if (templateId === 'quiz21StepsComplete' || templateId === 'quiz-estilo-21-steps') {
    // ADICIONAR: Suporte para ambos os IDs
    (async () => {
        // ... código existente ...
    })();
}
```

### **Passo 2: Adicionar logs de debug** 🔍
```typescript
// Logo após carregar templateId
console.log('🎯 DEBUG: Template ID detectado:', templateId);
console.log('🎯 DEBUG: Funnel param:', funnelParam);
console.log('🎯 DEBUG: Steps current state:', steps?.length || 0);
```

### **Passo 3: Verificar se setSteps é chamado** ✅
```typescript
// Após definir initialFromDoc
console.log('🎯 DEBUG: Setting steps, count:', initialFromDoc.length);
setSteps(initialFromDoc);
console.log('🎯 DEBUG: Steps set completed');
```

### **Passo 4: Verificar renderização** 👁️
```typescript
// No return do componente
console.log('🎯 DEBUG: Rendering editor, steps:', steps?.length || 0);
```

### **Passo 5: Desabilitar autoLoad do UnifiedCRUDProvider** 🔧
```typescript
// Em src/App.tsx (linha ~152)
const hasTemplate = searchParams?.has('template');

<UnifiedCRUDProvider 
    autoLoad={!hasTemplate}  // NÃO carregar do Supabase se tem template
    context={FunnelContext.EDITOR} 
    funnelId={funnelId}
>
```

---

## 📝 ARQUIVO A MODIFICAR

### **src/components/editor/quiz/QuizModularProductionEditor.tsx**

**Localização:** Linha ~422 (dentro do `useEffect`)

**Antes:**
```typescript
} else if (templateId === 'quiz21StepsComplete') {
    (async () => {
        // código...
    })();
}
```

**Depois:**
```typescript
} else if (templateId === 'quiz21StepsComplete' || templateId === 'quiz-estilo-21-steps') {
    console.log('🎯 Carregando template:', templateId);
    (async () => {
        // código...
        console.log('🎯 Steps carregados:', initialFromDoc.length);
        setSteps(initialFromDoc);
        console.log('🎯 Steps definidos no state');
    })();
}
```

---

## 🧪 TESTES DISPONÍVEIS

### **Teste Automatizado:**
```
http://localhost:5173/test-editor-loading.html
```
- Clique em "Executar Testes"
- Verifica 6 aspectos do carregamento
- Mostra iframe com o editor

### **Teste Manual:**
1. Abra DevTools (F12)
2. Vá para Console
3. Acesse: `http://localhost:5173/editor?template=quiz-estilo-21-steps`
4. Procure por:
   - ✅ `21 steps de produção registrados`
   - ✅ `Carregando template: quiz-estilo-21-steps`
   - ✅ `Steps carregados: 21`
   - ✅ `Steps definidos no state`
   - ❌ Qualquer erro em vermelho

### **Teste via Dashboard:**
1. Acesse: `http://localhost:5173/admin/funil-atual`
2. Clique no botão "Editar no Editor Visual"
3. Verifique se o editor carrega com os 21 steps

---

## 📊 CHECKLIST DE VERIFICAÇÃO

- [x] Servidor está rodando
- [x] Rota /admin/funil-atual acessível
- [x] Botão "Editar" gera URL correta
- [x] URL contém `?template=quiz-estilo-21-steps`
- [x] Steps são registrados (console logs)
- [x] Serviços inicializam sem erro fatal
- [x] Arquivos JSON dos templates existem
- [ ] **Template ID é reconhecido no código** ⬅️ **PROBLEMA AQUI**
- [ ] **setSteps() é chamado** ⬅️ **VERIFICAR**
- [ ] **Steps renderizam na tela** ⬅️ **OBJETIVO**

---

## 🎯 PRÓXIMA AÇÃO RECOMENDADA

**MODIFICAR:** `src/components/editor/quiz/QuizModularProductionEditor.tsx`

**Linha ~422:** Adicionar case para `quiz-estilo-21-steps`

```typescript
else if (templateId === 'quiz21StepsComplete' || templateId === 'quiz-estilo-21-steps') {
```

Isso deve fazer o editor reconhecer o template e carregar os 21 steps.

---

## 📚 ARQUIVOS RELEVANTES

- **Editor:** `src/components/editor/quiz/QuizModularProductionEditor.tsx`
- **Roteamento:** `src/App.tsx` (linha ~135)
- **Dashboard:** `src/pages/dashboard/CurrentFunnelPage.tsx` (linha ~62)
- **Template Service:** `src/services/HybridTemplateService.ts`
- **Registry:** `src/services/FunnelTypesRegistry.ts`
- **Templates JSON:** `public/templates/step-*-template.json`

---

**Status Final:** 🔧 **CORREÇÃO IDENTIFICADA - PRONTO PARA IMPLEMENTAR**

A causa raiz é que o template ID `'quiz-estilo-21-steps'` não está no case do if/else, então o código não carrega os steps.
