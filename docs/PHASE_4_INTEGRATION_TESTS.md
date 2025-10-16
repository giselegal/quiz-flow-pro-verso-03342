# 🧪 FASE 4: TESTES DE INTEGRAÇÃO

## 🎯 Objetivo

Validar que todos os 21 steps estão funcionando corretamente após a modularização, com dados normalizados pelo StepDataAdapter.

---

## 🛠️ Ferramentas Criadas

### 1. `stepIntegrationTests.ts`

**Localização:** `src/utils/stepIntegrationTests.ts`

**Funções:**
- ✅ `testSingleStep(stepId)` - Testa um step individual
- ✅ `testAllSteps()` - Testa todos os 21 steps
- ✅ `generateTestReport()` - Gera relatório formatado
- ✅ `runStepTests()` - Executa testes e loga resultado
- ✅ `quickTest(stepId)` - Debug rápido de um step

**Disponível no console:**
```javascript
window.__STEP_TESTS__.runAll()         // Roda todos os testes
window.__STEP_TESTS__.testOne('step-01')  // Testa step específico
```

### 2. `StepTestPanel.tsx`

**Localização:** `src/components/editor/quiz/components/StepTestPanel.tsx`

**Features:**
- ✅ UI visual para resultados de testes
- ✅ Auto-execução ao montar
- ✅ Sumário com contadores (Passou/Falhou/Avisos)
- ✅ Lista expandível com detalhes
- ✅ Re-execução manual
- ✅ Debug individual via console

---

## 📋 Validações Implementadas

### Por Tipo de Step

#### IntroStep
- ✅ `formQuestion` presente
- ✅ `buttonText` presente
- ⚠️ `title` ausente → usa default

#### QuestionStep
- ✅ `questionText` presente
- ✅ `options` não vazio
- ✅ `requiredSelections` >= 1
- ⚠️ `requiredSelections` > `options.length`

#### StrategicQuestionStep
- ✅ `questionText` presente
- ✅ `options` não vazio
- ⚠️ `requiredSelections` deveria ser 1

#### TransitionStep / TransitionResultStep
- ✅ `title` ou `text` presente
- ⚠️ `duration` ausente → usa default

#### ResultStep
- ✅ `title` presente

#### OfferStep
- ✅ `buttonText` presente
- ⚠️ `offerMap` vazio

---

## 🚀 Como Usar

### Via Console

```javascript
// Testar todos os steps
window.__STEP_TESTS__.runAll();

// Testar step específico
window.__STEP_TESTS__.testOne('step-01');
window.__STEP_TESTS__.testOne('step-12'); // Transition
window.__STEP_TESTS__.testOne('step-20'); // Result
```

### Via UI (Modo Editor)

1. Adicionar `<StepTestPanel />` ao editor
2. Ver resultados visuais em tempo real
3. Clicar em step para expandir detalhes
4. "Ver Dados no Console" para debug profundo

---

## 📊 Formato de Relatório

```
🧪 RELATÓRIO DE TESTES - STEPS
============================================================

📊 SUMÁRIO
  ✅ Passou: 21
  ❌ Falhou: 0
  ⚠️  Avisos: 3

📦 INTRO
------------------------------------------------------------
  ✅ step-01

📦 QUESTION
------------------------------------------------------------
  ✅ step-02
  ✅ step-03
  ...

📦 TRANSITION
------------------------------------------------------------
  ✅ step-12
  ✅ step-19

📦 STRATEGIC-QUESTION
------------------------------------------------------------
  ✅ step-13
  ✅ step-14
  ...

📦 RESULT
------------------------------------------------------------
  ✅ step-20

📦 OFFER
------------------------------------------------------------
  ✅ step-21
     ⚠️  OfferStep: offerMap vazio

============================================================
Resultado: ✅ TODOS OS TESTES PASSARAM
```

---

## 🐛 Troubleshooting

### "Step não encontrado em QUIZ_STEPS"
**Solução:** Verificar se `src/data/quizSteps.ts` tem o step definido.

### "options vazio"
**Solução:** Verificar se `metadata.options` ou `productionData.options` está populado.

### "requiredSelections inválido"
**Solução:** Garantir que `requiredSelections >= 1` e `<= options.length`.

### "title e text ausentes"
**Solução:** TransitionStep precisa de pelo menos `title` ou `text`.

---

## ✅ Checklist de Testes Manuais

### IntroStep (step-01)
- [ ] Campo de nome renderizado
- [ ] Placeholder correto
- [ ] Botão com texto correto
- [ ] Imagem de fundo visível
- [ ] Validação de campo vazio

### QuestionStep (steps 02-11)
- [ ] Pergunta exibida
- [ ] Opções renderizadas (8 por step)
- [ ] Imagens nas opções carregam
- [ ] Seleção múltipla funciona (3 opções)
- [ ] Contador "X de 3 selecionadas"
- [ ] Botão desabilitado até atingir mínimo
- [ ] Auto-advance após seleção completa

### TransitionStep (step-12, step-19)
- [ ] Título e texto exibidos
- [ ] Animação de loading
- [ ] Auto-advance após `duration`
- [ ] Botão manual (se `showContinueButton`)

### StrategicQuestionStep (steps 13-18)
- [ ] Pergunta estratégica exibida
- [ ] Seleção única funciona
- [ ] Auto-advance após seleção
- [ ] Resposta armazenada corretamente

### ResultStep (step-20)
- [ ] Estilo predominante calculado
- [ ] Barras de progresso por estilo
- [ ] Estilos secundários listados
- [ ] Descrição do estilo exibida
- [ ] Botão "Ver Oferta" funcional

### OfferStep (step-21)
- [ ] Oferta personalizada exibida
- [ ] Baseada em respostas estratégicas
- [ ] Botão CTA funcional
- [ ] Depoimento/testimonial exibido

---

## 📈 Métricas de Sucesso

| Métrica | Meta | Status |
|---------|------|--------|
| **Steps testados** | 21/21 | ✅ |
| **Testes passando** | 100% | ⏳ Executar |
| **Erros críticos** | 0 | ⏳ Validar |
| **Avisos aceitáveis** | < 5 | ⏳ Validar |
| **Coverage de tipos** | 6/6 | ✅ |

---

## 🎯 Próximos Passos

1. ✅ **Executar testes** via `window.__STEP_TESTS__.runAll()`
2. ✅ **Verificar relatório** no console
3. ✅ **Corrigir erros críticos** se houver
4. ✅ **Validar avisos** se são aceitáveis
5. ✅ **Teste manual** de navegação completa
6. ✅ **Documentar problemas** encontrados

Após testes passarem, prosseguir para **Fase 5: Limpeza de Código** (remover arquivos obsoletos).

---

**Status:** ⏳ Em execução  
**Última atualização:** Sprint 4 - Fase 4
