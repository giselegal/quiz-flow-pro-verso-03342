# 🔗 CONEXÃO ENTRE `/quiz-estilo` E `quiz21StepsComplete`

## ✅ **RESPOSTA DIRETA:**

**SIM!** O JSON do template `quiz21StepsComplete.ts` **É USADO** pela rota `/quiz-estilo`.

---

## 📊 **COMO FUNCIONA A CONEXÃO:**

### **1️⃣ ROTA `/quiz-estilo`** → QuizEstiloPessoalPage
```tsx
// src/App.tsx (linha 359)
<Route path="/quiz-estilo">
  <QuizErrorBoundary>
    <QuizEstiloPessoalPage />
  </QuizErrorBoundary>
</Route>
```

### **2️⃣ QuizEstiloPessoalPage** → `funnelId: 'quiz-estilo-21-steps'`
```tsx
// src/pages/QuizEstiloPessoalPage.tsx (linha 38)
const effectiveFunnelId = queryDraftId || funnelId || 'quiz-estilo-21-steps';

return (
  <UnifiedCRUDProvider funnelId={effectiveFunnelId} context={FunnelContext.PRODUCTION}>
    <QuizApp funnelId={effectiveFunnelId} />
  </UnifiedCRUDProvider>
);
```

### **3️⃣ FunnelTypesRegistry** → Define o tipo `'quiz-estilo-21-steps'`
```typescript
// src/services/FunnelTypesRegistry.ts (linha 51)
'quiz-estilo-21-steps': {
  id: 'quiz-estilo-21-steps',
  name: 'Quiz de Estilo Pessoal - 21 Etapas',
  description: 'Quiz completo para descoberta do estilo pessoal com 21 etapas interativas',
  category: 'quiz',
  defaultSteps: 21,
  templateService: HybridTemplateService,  // ← AQUI!
  ...
}
```

### **4️⃣ HybridTemplateService** → Carrega `quiz21StepsComplete.ts`
```typescript
// src/services/HybridTemplateService.ts (linha 70-75)
if (templateId === 'quiz21StepsComplete') {
  const { getQuiz21StepsTemplate } = await import('@/templates/imports');
  const QUIZ_STYLE_21_STEPS_TEMPLATE = getQuiz21StepsTemplate();
  return QUIZ_STYLE_21_STEPS_TEMPLATE;
}
```

---

## 🎯 **HIERARQUIA DE PRIORIDADE (HybridTemplateService):**

```
1. Override JSON específico (step-XX-template.json)
   ↓ se não existir
2. Master JSON (quiz21-complete.json)
   ↓ se não existir
3. TypeScript fallback → quiz21StepsComplete.ts ✅ (ESTE ARQUIVO!)
```

---

## 📍 **RESUMO:**

| Elemento | Valor | Descrição |
|----------|-------|-----------|
| **Rota do Quiz** | `/quiz-estilo` | URL pública onde o quiz é exibido |
| **Página React** | `QuizEstiloPessoalPage` | Component que renderiza o quiz |
| **Funnel ID** | `quiz-estilo-21-steps` | ID interno do tipo de funil |
| **Template Service** | `HybridTemplateService` | Serviço que carrega os templates |
| **Template TypeScript** | `quiz21StepsComplete.ts` | **Arquivo fonte com 3,742 linhas** |
| **Template Export** | `QUIZ_STYLE_21_STEPS_TEMPLATE` | Objeto com 20 steps (Record<string, Block[]>) |

---

## 🧪 **COMO OS TESTES ACESSAM:**

```typescript
// tests/e2e/quiz-results.spec.ts
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/quiz-estilo');
  //                                    ↑
  //                    Esta rota carrega quiz21StepsComplete.ts
});
```

---

## 🔍 **DIFERENÇA ENTRE `/quiz-estilo` E `/editor`:**

| Aspecto | `/quiz-estilo` | `/editor?template=quiz21StepsComplete` |
|---------|----------------|----------------------------------------|
| **Propósito** | 🎮 **PRODUÇÃO** (usuários finais) | 🛠️ **EDIÇÃO** (criadores de conteúdo) |
| **Context** | `FunnelContext.PRODUCTION` | `FunnelContext.EDITOR` |
| **Modo** | Renderização final (sem edição) | Editável (arrastar, modificar blocos) |
| **Funnel ID** | `quiz-estilo-21-steps` | `quiz21StepsComplete` |
| **Template usado** | Mesmo arquivo: `quiz21StepsComplete.ts` | Mesmo arquivo: `quiz21StepsComplete.ts` |

---

## ✅ **CONCLUSÃO:**

O JSON do template `quiz21StepsComplete.ts` que você documentou **É SIM** o template usado pela rota `/quiz-estilo`.

**Fluxo completo:**
```
Usuário acessa: http://localhost:5173/quiz-estilo
        ↓
QuizEstiloPessoalPage carrega funnelId='quiz-estilo-21-steps'
        ↓
FunnelTypesRegistry resolve usando HybridTemplateService
        ↓
HybridTemplateService importa quiz21StepsComplete.ts
        ↓
Renderiza os 20 steps definidos em QUIZ_STYLE_21_STEPS_TEMPLATE
```

---

## 📝 **NOTA IMPORTANTE:**

Há uma pequena **inconsistência nos nomes**:

- **FunnelType ID**: `quiz-estilo-21-steps` (com hífen e "21")
- **Template ID**: `quiz21StepsComplete` (camelCase, sem hífen)

Mas **ambos apontam para o mesmo arquivo TypeScript**: `src/templates/quiz21StepsComplete.ts`
