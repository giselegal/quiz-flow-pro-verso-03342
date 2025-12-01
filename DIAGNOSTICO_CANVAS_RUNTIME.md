# 🔍 Diagnóstico de Renderização do Canvas - Guia Runtime

**Data:** 01 de Dezembro de 2025  
**Objetivo:** Descobrir por que os blocos não renderizam no Canvas do /editor

---

## ✅ CORREÇÕES APLICADAS

1. ✅ **Ativado DEBUG logs no Canvas.tsx**
   - `const DEBUG = true` (antes estava `false`)
   
2. ✅ **Adicionados logs detalhados em 3 pontos críticos:**
   - `Canvas.tsx`: Log completo do estado (quiz, steps, blocks)
   - `ModernQuizEditor.tsx`: Log detalhado da auto-seleção de step
   - `EditorPage.tsx`: Log do quiz carregado com estrutura completa

3. ✅ **Timeout de verificação pós-seleção**
   - Aguarda 100ms após selectStep() para verificar se funcionou

---

## 🚀 PASSO A PASSO PARA EXECUTAR

### 1. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

### 2. Abrir navegador

Acesse: **http://localhost:8080/editor**

### 3. Abrir DevTools (F12)

Vá para a aba **Console**

---

## 🔍 LOGS ESPERADOS (em ordem)

### Log 1: Quiz carregado no EditorPage
```javascript
📂 Carregando quiz via ModernQuizEditor: { funnelId: "quiz21StepsComplete" }
✅ Quiz carregado no editor moderno: { 
  title: "Quiz de Estilo Pessoal - 21 Etapas",
  steps: 21,
  firstStepId: "step-01",
  firstStepBlocks: 5, // <-- DEVE SER > 0
  sampleBlock: { id: "...", type: "intro-logo-header" }
}
📦 Quiz completo carregado: {
  stepsCount: 21,
  allSteps: [
    { id: "step-01", title: "...", blocksCount: 5 },
    ...
  ]
}
```

**✅ SE ESTE LOG APARECER:** Quiz foi carregado corretamente

**❌ SE firstStepBlocks = 0:** Problema no JSON do template

---

### Log 2: ModernQuizEditor recebe o quiz
```javascript
🎨 ModernQuizEditor rendering { initialQuiz: true, quizId: undefined }
📂 Carregando quiz inicial: {
  steps: 21,
  firstStepId: "step-01",
  firstStepBlocks: 5 // <-- DEVE SER > 0
}
```

**✅ SE ESTE LOG APARECER:** Quiz foi passado como prop

**❌ SE initialQuiz = false:** Problema no EditorPage

---

### Log 3: Auto-seleção de step
```javascript
🔍 useEffect[quiz] executado: {
  hasQuiz: true,
  hasSteps: true,
  stepsLength: 21,
  firstStep: { id: "step-01", ... }
}
🎯 Auto-selecionando primeiro step: {
  stepId: "step-01",
  stepTitle: "Introdução - Bem-vindo ao Quiz de Estilo",
  blocksCount: 5, // <-- DEVE SER > 0
  firstBlockType: "intro-logo-header"
}
✅ Verificação pós-seleção (após timeout): {
  selectedStepId: "step-01",
  match: true, // <-- DEVE SER true
  quizSteps: 21
}
```

**✅ SE match = true:** Step foi selecionado corretamente

**❌ SE match = false:** Problema no editorStore.selectStep()

---

### Log 4: Canvas renderiza (CRÍTICO)
```javascript
🔍 Canvas DIAGNÓSTICO: {
  1_temQuiz: true,
  2_temSteps: true,
  3_quantosSteps: 21,
  4_stepSelecionado: "step-01",
  5_stepEncontrado: true, // <-- DEVE SER true
  6_stepId: "step-01",
  7_temBlocks: true, // <-- DEVE SER true
  8_quantosBlocks: 5, // <-- DEVE SER > 0
  9_primeiroBloco: {
    id: "quiz-intro-header",
    type: "intro-logo-header",
    hasProperties: true
  }
}
```

**✅ SE 8_quantosBlocks > 0:** Blocos devem renderizar!

**❌ SE 5_stepEncontrado = false:** Bug no useMemo do selectedStep

**❌ SE 7_temBlocks = false:** Step sem blocos (verificar JSON)

**❌ SE 8_quantosBlocks = 0:** Step.blocks está vazio

---

## 🎯 DIAGNÓSTICO POR CENÁRIO

### ❌ Cenário 1: Quiz não carrega
```
SINTOMA: Não aparece "📂 Carregando quiz inicial"
CAUSA: EditorPage não está passando initialQuiz
SOLUÇÃO: Verificar se setQuiz(validated) está sendo chamado
```

### ❌ Cenário 2: Step não é auto-selecionado
```
SINTOMA: selectedStepId continua null
CAUSA: useEditorStore.getState().selectStep() não funciona
SOLUÇÃO: Verificar implementação de selectStep no editorStore.ts
```

### ❌ Cenário 3: Canvas não encontra step selecionado
```
SINTOMA: 5_stepEncontrado = false
CAUSA: useMemo não está encontrando o step
SOLUÇÃO: Verificar se quiz.steps[].id === selectedStepId
```

### ❌ Cenário 4: Step não tem blocos
```
SINTOMA: 8_quantosBlocks = 0
CAUSA: JSON do template está sem blocos
SOLUÇÃO: Verificar /public/templates/quiz21-v4.json
```

---

## 🛠️ COMANDOS DE DEBUG NO CONSOLE

Execute estes comandos no DevTools Console para debug adicional:

### Verificar estado do quizStore
```javascript
const quizState = useQuizStore.getState();
console.log('📊 quizStore:', {
  hasQuiz: !!quizState.quiz,
  steps: quizState.quiz?.steps?.length,
  firstStep: quizState.quiz?.steps?.[0]
});
```

### Verificar estado do editorStore
```javascript
const editorState = useEditorStore.getState();
console.log('🎯 editorStore:', {
  selectedStepId: editorState.selectedStepId,
  selectedBlockId: editorState.selectedBlockId
});
```

### Verificar BlockRegistry
```javascript
console.log('🧩 BlockRegistry:', window.__BLOCK_REGISTRY__);
```

### Forçar seleção manual de step
```javascript
useEditorStore.getState().selectStep('step-01');
console.log('✅ Step selecionado manualmente');
```

### Verificar quiz completo
```javascript
const quiz = useQuizStore.getState().quiz;
console.log('📦 Quiz completo:', quiz);
console.log('📝 Todos os steps:', quiz?.steps?.map(s => ({
  id: s.id,
  title: s.title,
  blocks: s.blocks?.length || 0
})));
```

---

## 📊 CHECKLIST DE DIAGNÓSTICO

Use esta checklist enquanto executa os passos:

- [ ] Servidor rodando em http://localhost:8080
- [ ] Navegador aberto em /editor
- [ ] DevTools Console aberto
- [ ] **Log 1 apareceu:** Quiz carregado no EditorPage
- [ ] **Log 2 apareceu:** ModernQuizEditor recebeu initialQuiz
- [ ] **Log 3 apareceu:** Step auto-selecionado
- [ ] **Log 4 apareceu:** Canvas DIAGNÓSTICO mostra blocos
- [ ] `5_stepEncontrado = true`
- [ ] `7_temBlocks = true`
- [ ] `8_quantosBlocks > 0`
- [ ] Blocos renderizados na tela ✅

---

## 🎉 RESULTADO ESPERADO

Se todos os logs acima aparecerem corretamente, você deve ver:

1. ✅ Console mostra `8_quantosBlocks: 5` (ou mais)
2. ✅ Canvas mostra 5 blocos do step-01
3. ✅ Blocos são clicáveis e selecionáveis
4. ✅ Properties panel atualiza ao selecionar bloco

---

## 🚨 SE AINDA NÃO RENDERIZAR

Após executar todos os passos acima, execute este comando final:

```javascript
// Verificação completa de estado
const fullDiagnostic = {
  quizStore: {
    hasQuiz: !!useQuizStore.getState().quiz,
    steps: useQuizStore.getState().quiz?.steps?.length,
    firstStepBlocks: useQuizStore.getState().quiz?.steps?.[0]?.blocks?.length
  },
  editorStore: {
    selectedStepId: useEditorStore.getState().selectedStepId,
    selectedBlockId: useEditorStore.getState().selectedBlockId
  },
  canvasDOM: {
    canvasElement: document.querySelector('[class*="Canvas"]'),
    blockElements: document.querySelectorAll('[class*="BlockPreview"]').length
  }
};

console.log('🔬 DIAGNÓSTICO COMPLETO:', fullDiagnostic);
```

---

## 📞 PRÓXIMOS PASSOS

1. Execute os comandos acima
2. Copie TODOS os logs do console
3. Informe qual cenário foi identificado
4. Aplicarei a correção específica

**Tempo estimado:** 5 minutos

---

## 🎯 ATALHO RÁPIDO

Cole este código no console para diagnóstico instantâneo:

```javascript
// 🔍 DIAGNÓSTICO RÁPIDO
console.log('🔬 === DIAGNÓSTICO CANVAS ===');
console.log('1. Quiz:', !!useQuizStore.getState().quiz ? '✅' : '❌');
console.log('2. Steps:', useQuizStore.getState().quiz?.steps?.length || 0);
console.log('3. Step selecionado:', useEditorStore.getState().selectedStepId || 'NENHUM');
console.log('4. Blocos do step:', 
  useQuizStore.getState().quiz?.steps
    ?.find(s => s.id === useEditorStore.getState().selectedStepId)
    ?.blocks?.length || 0
);
console.log('='.repeat(50));
```

**Se aparecer "4. Blocos do step: 0" → Problema identificado!**

