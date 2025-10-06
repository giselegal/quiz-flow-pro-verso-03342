# 🔄 FLUXO: Edição → Produção do /quiz-estilo

**Data:** 06/10/2025  
**Pergunta:** Qual editor atualiza a rota de produção `/quiz-estilo`?

---

## 🎯 RESPOSTA DIRETA:

### ✅ **O `/editor` (QuizFunnelEditorWYSIWYG) atualiza o `/quiz-estilo`**

**Rota do Editor:** `http://localhost:8080/editor`  
**Rota de Produção:** `http://localhost:8080/quiz-estilo`

---

## 📊 FLUXO COMPLETO DE DADOS:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FLUXO DE EDIÇÃO → PRODUÇÃO                       │
└─────────────────────────────────────────────────────────────────────┘

1. USUÁRIO EDITA:
   http://localhost:8080/editor
   ↓
   QuizFunnelEditorWYSIWYG
   (src/components/editor/quiz/QuizFunnelEditorWYSIWYG.tsx)
   ↓
   Usa: EditableIntroStep, EditableQuestionStep, etc.
   ↓
   Edita: crud.currentFunnel.quizSteps

2. USUÁRIO SALVA:
   Botão "Salvar" no editor
   ↓
   crud.saveFunnel()
   ↓
   UnifiedCRUDProvider
   ↓
   📦 SUPABASE DATABASE
   Tabela: funnels
   Campo: quiz_steps (JSON)

3. PRODUÇÃO CARREGA:
   http://localhost:8080/quiz-estilo
   ↓
   QuizEstiloPessoalPage
   (src/pages/QuizEstiloPessoalPage.tsx)
   ↓
   QuizApp
   (src/components/quiz/QuizApp.tsx)
   ↓
   useQuizState hook
   ↓
   📦 SUPABASE DATABASE
   ↓
   Carrega: crud.currentFunnel.quizSteps
   ↓
   UnifiedStepRenderer
   ↓
   Renderiza componentes de produção
```

---

## 🗂️ ESTRUTURA DE ARQUIVOS:

### **1. EDITOR (Edição)**

**Rota:** `/editor` → `QuizFunnelEditorWYSIWYG`

```
src/
├── App.tsx (linha 115-133)
│   └── Route path="/editor"
│       └── QuizFunnelEditorWYSIWYG
│
└── components/
    └── editor/
        └── quiz/
            ├── QuizFunnelEditorWYSIWYG.tsx (800 linhas) ⭐
            │   ├── Usa: EditableIntroStep
            │   ├── Usa: EditableQuestionStep
            │   ├── Usa: EditableStrategicQuestionStep
            │   ├── Usa: EditableTransitionStep
            │   ├── Usa: EditableResultStep
            │   └── Usa: EditableOfferStep
            │
            └── editable-steps/ (componentes de edição)
                ├── EditableIntroStep.tsx
                ├── EditableQuestionStep.tsx
                ├── EditableStrategicQuestionStep.tsx
                ├── EditableTransitionStep.tsx
                ├── EditableResultStep.tsx
                └── EditableOfferStep.tsx
```

### **2. PRODUÇÃO (Visualização)**

**Rota:** `/quiz-estilo` → `QuizEstiloPessoalPage` → `QuizApp`

```
src/
├── App.tsx (linha 228-232)
│   └── Route path="/quiz-estilo"
│       └── QuizEstiloPessoalPage
│
├── pages/
│   └── QuizEstiloPessoalPage.tsx
│       └── Renderiza: <QuizApp funnelId={funnelId} />
│
└── components/
    └── quiz/
        ├── QuizApp.tsx (145 linhas) ⭐
        │   ├── Usa: useQuizState hook
        │   ├── Usa: UnifiedStepRenderer
        │   └── Carrega: crud.currentFunnel.quizSteps
        │
        └── quiz-estilo/ (componentes de produção)
            ├── IntroStep.tsx
            ├── QuestionStep.tsx
            ├── StrategicQuestionStep.tsx
            ├── TransitionStep.tsx
            ├── ResultStep.tsx
            └── OfferStep.tsx
```

---

## 💾 BANCO DE DADOS (Supabase):

### **Tabela:** `funnels`

```sql
CREATE TABLE funnels (
  id UUID PRIMARY KEY,
  name TEXT,
  quiz_steps JSONB,  -- ⭐ DADOS DO QUIZ AQUI
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### **Estrutura do `quiz_steps`:**

```json
[
  {
    "id": "step-1",
    "type": "intro",
    "title": "Bem-vindo ao Quiz!",
    "formQuestion": "Como podemos te chamar?",
    "placeholder": "Digite seu nome...",
    "buttonText": "Começar",
    "nextStep": "step-2"
  },
  {
    "id": "step-2",
    "type": "question",
    "questionNumber": "1 de 10",
    "questionText": "Qual seu objetivo?",
    "requiredSelections": 3,
    "options": [
      { "id": "opt-1", "text": "Opção 1", "image": "url..." },
      { "id": "opt-2", "text": "Opção 2", "image": "url..." }
    ],
    "nextStep": "step-3"
  }
  // ... mais 19 steps
]
```

---

## 🔄 CICLO DE VIDA COMPLETO:

### **Fase 1: Edição**

```tsx
// 1. Usuário abre editor
http://localhost:8080/editor

// 2. QuizFunnelEditorWYSIWYG carrega
<QuizFunnelEditorWYSIWYG />

// 3. UnifiedCRUDProvider carrega dados do Supabase
const { crud } = useUnifiedCRUD();
const steps = crud.currentFunnel.quizSteps; // ⭐

// 4. Usuário seleciona um step
setSelectedId('step-1');

// 5. Renderiza componente editável
<EditableIntroStep
  data={step}
  isEditable={true}
  onUpdate={(updates) => updateStep(step.id, updates)}
/>

// 6. Usuário edita propriedades
onChange={(e) => {
  updateStep(step.id, { title: e.target.value });
}}

// 7. Estado atualizado em memória
steps[0].title = "Novo Título";

// 8. Usuário clica "Salvar"
await crud.saveFunnel();

// 9. Dados persistidos no Supabase ✅
```

### **Fase 2: Produção**

```tsx
// 1. Usuário acessa quiz
http://localhost:8080/quiz-estilo

// 2. QuizEstiloPessoalPage renderiza
<QuizEstiloPessoalPage />

// 3. QuizApp carrega
<QuizApp funnelId={funnelId} />

// 4. useQuizState carrega dados do Supabase
const { currentStepData } = useQuizState(funnelId);
// Internamente: crud.currentFunnel.quizSteps ⭐

// 5. UnifiedStepRenderer escolhe componente
<UnifiedStepRenderer
  stepId={currentStepId}
  stepData={currentStepData}
  quizState={unifiedQuizState}
  onNext={nextStep}
/>

// 6. Renderiza componente de produção
<IntroStep
  step={currentStepData}
  onNext={nextStep}
  onSetUserName={setUserName}
/>

// 7. Usuário visualiza dados editados ✅
```

---

## 🎯 COMPONENTES PRINCIPAIS:

### **1. QuizFunnelEditorWYSIWYG (Editor)**

**Arquivo:** `src/components/editor/quiz/QuizFunnelEditorWYSIWYG.tsx`  
**Linhas:** 800

**Responsabilidades:**
- ✅ Carregar `crud.currentFunnel.quizSteps` do Supabase
- ✅ Renderizar steps como componentes editáveis
- ✅ Permitir edição via painel de propriedades
- ✅ Salvar mudanças de volta ao Supabase

**Componentes usados:**
```tsx
const EditableComponent = {
  'intro': EditableIntroStep,
  'question': EditableQuestionStep,
  'strategic-question': EditableStrategicQuestionStep,
  'transition': EditableTransitionStep,
  'result': EditableResultStep,
  'offer': EditableOfferStep
}[step.type];
```

---

### **2. QuizApp (Produção)**

**Arquivo:** `src/components/quiz/QuizApp.tsx`  
**Linhas:** 145

**Responsabilidades:**
- ✅ Carregar `crud.currentFunnel.quizSteps` do Supabase
- ✅ Gerenciar estado do quiz (respostas, progresso)
- ✅ Renderizar step atual usando UnifiedStepRenderer
- ✅ Coordenar navegação entre steps

**Componentes usados:**
```tsx
<UnifiedStepRenderer
  stepId={currentStepId}
  stepData={currentStepData}
  quizState={unifiedQuizState}
  onNext={nextStep}
  onSetUserName={setUserName}
  onAddAnswer={addAnswer}
  onAddStrategicAnswer={addStrategicAnswer}
/>
```

---

### **3. UnifiedCRUDProvider (Context)**

**Arquivo:** `src/context/UnifiedCRUDProvider.tsx`

**Responsabilidades:**
- ✅ Conectar com Supabase
- ✅ Carregar funil ativo (`currentFunnel`)
- ✅ Expor `crud.currentFunnel.quizSteps`
- ✅ Método `crud.saveFunnel()` para persistir mudanças

**API:**
```tsx
interface UnifiedCRUDContextType {
  currentFunnel: {
    id: string;
    name: string;
    quizSteps: EditableQuizStep[];
  };
  saveFunnel: () => Promise<void>;
  loadFunnel: (id: string) => Promise<void>;
}

const { crud } = useUnifiedCRUD();
```

---

## 🔧 COMO FUNCIONA A SINCRONIZAÇÃO:

### **Fluxo de Dados:**

```
EDITOR                    SUPABASE                  PRODUÇÃO
┌──────────┐             ┌──────────┐             ┌──────────┐
│ /editor  │   SAVE →   │ Database │   LOAD →   │  /quiz-  │
│          │             │          │             │  estilo  │
│ WYSIWYG  │ ← LOAD     │ funnels  │  SAVE →    │          │
│          │             │ table    │             │ QuizApp  │
└──────────┘             └──────────┘             └──────────┘
     ↓                         ↓                        ↓
 EditableXxxStep        quiz_steps JSON         IntroStep, etc
```

### **Sincronização em Tempo Real:**

**Opção 1: Manual**
1. Editar no `/editor`
2. Clicar "Salvar"
3. Recarregar `/quiz-estilo` (F5)
4. Ver mudanças aplicadas ✅

**Opção 2: Automática (se implementada)**
1. Editar no `/editor`
2. Autosave ativa
3. `/quiz-estilo` escuta mudanças no Supabase
4. Atualiza automaticamente ✅

---

## 📋 CHECKLIST DE VERIFICAÇÃO:

### **Para verificar se a edição funciona:**

- [ ] 1. Abrir `http://localhost:8080/editor`
- [ ] 2. Verificar se carrega os 21 steps
- [ ] 3. Selecionar step 1 (intro)
- [ ] 4. Editar o título
- [ ] 5. Clicar "Salvar"
- [ ] 6. Verificar mensagem de sucesso
- [ ] 7. Abrir `http://localhost:8080/quiz-estilo`
- [ ] 8. Verificar se o título mudou ✅

### **Para verificar sincronização:**

- [ ] 1. Abrir console do navegador (F12)
- [ ] 2. No `/editor`, editar um step
- [ ] 3. Clicar "Salvar"
- [ ] 4. Verificar requisição POST ao Supabase
- [ ] 5. Verificar resposta 200 OK
- [ ] 6. No `/quiz-estilo`, recarregar (F5)
- [ ] 7. Verificar requisição GET ao Supabase
- [ ] 8. Verificar dados atualizados ✅

---

## ⚠️ IMPORTANTE:

### **Dois Sistemas de Componentes:**

**EDITOR usa:**
- `EditableIntroStep`
- `EditableQuestionStep`
- etc.

**PRODUÇÃO usa:**
- `IntroStep` (via UnifiedStepRenderer)
- `QuestionStep`
- etc.

**⚠️ SÃO COMPONENTES DIFERENTES!**

**Mas ambos leem do mesmo JSON:**
```tsx
// AMBOS usam:
crud.currentFunnel.quizSteps
```

**Por isso a edição funciona:**
1. Editor salva no Supabase
2. Produção lê do Supabase
3. Ambos usam os mesmos dados ✅

---

## 🎯 RESUMO FINAL:

| Item | Editor | Produção |
|------|--------|----------|
| **Rota** | `/editor` | `/quiz-estilo` |
| **Componente** | QuizFunnelEditorWYSIWYG | QuizApp |
| **Props** | `EditableXxxStep` | `IntroStep` (via UnifiedStepRenderer) |
| **Dados** | `crud.currentFunnel.quizSteps` | `crud.currentFunnel.quizSteps` |
| **Operação** | Salva (WRITE) | Carrega (READ) |
| **Banco** | ✅ Supabase `funnels.quiz_steps` | ✅ Supabase `funnels.quiz_steps` |

---

## ✅ CONCLUSÃO:

### **Resposta Direta:**

✅ **O `/editor` (QuizFunnelEditorWYSIWYG) atualiza o `/quiz-estilo`**

**Como:**
1. Editor salva em `crud.currentFunnel.quizSteps`
2. Persiste no Supabase via `crud.saveFunnel()`
3. Produção carrega de `crud.currentFunnel.quizSteps`
4. Mudanças aparecem no `/quiz-estilo` ✅

**Banco de Dados:**
```
funnels.quiz_steps (JSONB)
↑                    ↓
EDITOR (SAVE)    PRODUÇÃO (LOAD)
```

---

## 🚀 PRÓXIMOS PASSOS:

Se você quer implementar o **canvas vertical com todos os steps**, agora sabe:

✅ A edição já funciona  
✅ A sincronização já está implementada  
✅ Só falta modificar a **visualização do canvas** no editor  

**Implementação:** Ver arquivo `ANALISE_IMPLEMENTACAO_CANVAS_VERTICAL.md`

---

**Ficou claro?** 🎯
