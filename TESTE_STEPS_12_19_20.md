# 🧪 ROTEIRO DE TESTES: Steps 12, 19, 20 com Atomic Blocks

## 📋 Objetivo
Validar que a migração para atomic blocks está funcionando corretamente nos Steps 12, 19 e 20, com fallback automático para componentes legados quando necessário.

---

## ✅ PRÉ-REQUISITOS

- [x] Servidor dev rodando: `npm run dev` (http://localhost:8080)
- [x] Tasks 5-7 implementadas (adapters + hooks + context + deprecation)
- [x] Console do navegador aberto (F12) para ver logs

---

## 🎯 TESTE 1: Step 12 - Primeira Transição

### Contexto
Step 12 é a primeira transição após as 10 perguntas scored. Deve mostrar:
- Título de transição
- Loader animado
- Mensagem de processamento

### Passos
1. Acesse: http://localhost:8080/quiz
2. Preencha o formulário inicial (Step 1)
3. Responda as perguntas 2-11 (scored questions)
4. Aguarde chegar no **Step 12**

### ✅ Validações Step 12

#### Visual
- [ ] Página carrega sem erros
- [ ] Exibe título: "Analisando suas respostas..." (ou similar)
- [ ] Loader animado está presente
- [ ] Transição automática após timer

#### Console (F12)
- [ ] **VERIFICAR**: Aparece warning de deprecation do TransitionStep?
  ```
  ⚠️ COMPONENTE LEGADO DETECTADO: TransitionStep.tsx
  ```
- [ ] **VERIFICAR**: Template step-12.json foi carregado?
  ```
  Carregando template: step-12
  ```
- [ ] **VERIFICAR**: Blocks foram renderizados?
  ```
  Renderizando blocks: [transition-title, transition-loader, ...]
  ```
- [ ] **SEM ERROS**: Nenhum erro de runtime ou componente não encontrado

#### Network (F12 > Network)
- [ ] Requisição para template carregou (se assíncrono)
- [ ] Sem erros 404 ou 500

---

## 🎯 TESTE 2: Step 19 - Segunda Transição

### Contexto
Step 19 é a transição após as perguntas estratégicas (13-18). Deve mostrar:
- Título personalizado
- Loader
- Mensagem de finalização

### Passos
1. Continue do Step 12
2. Responda as perguntas 13-18 (strategic questions)
3. Aguarde chegar no **Step 19**

### ✅ Validações Step 19

#### Visual
- [ ] Página carrega sem erros
- [ ] Exibe título: "Finalizando análise..." (ou similar)
- [ ] Loader animado presente
- [ ] Transição automática para Step 20

#### Console (F12)
- [ ] Warning de deprecation aparece (TransitionStep)
- [ ] Template step-19.json carregado
- [ ] Blocks renderizados corretamente
- [ ] Sem erros de runtime

---

## 🎯 TESTE 3: Step 20 - Resultado

### Contexto
Step 20 é a página de resultado final com estilo calculado. Deve usar:
- **ResultContext** com useResultCalculations
- **Atomic blocks**: result-main, result-style, result-cta-primary, etc.

### Passos
1. Continue do Step 19
2. Aguarde chegar no **Step 20**

### ✅ Validações Step 20

#### Visual - Seção Resultado
- [ ] **Celebração**: Emoji 🎉 animado aparece
- [ ] **Nome do usuário**: "Olá, [nome]!" exibido corretamente
- [ ] **Estilo principal**: Nome do estilo em destaque (ex: "Clássico", "Natural")
- [ ] **Percentual**: Mostra porcentagem do estilo principal (ex: "45.2%")
- [ ] **TOP 3 Estilos**: Barras de progresso dos 3 estilos principais
- [ ] **Confidence**: Percentual de confiança exibido
- [ ] **Imagem do estilo**: Carrega (ou fallback)

#### Visual - CTAs
- [ ] **CTA Primário**: Botão "Quero Descobrir Minhas Peças Ideais" (ou similar)
- [ ] **Hover no CTA**: Animação/efeito hover funciona
- [ ] **Click no CTA**: Abre link Hotmart em nova aba

#### Console (F12)
- [ ] **CRITICAL**: Warning de deprecation do ResultStep aparece?
  ```
  ⚠️ COMPONENTE LEGADO DETECTADO: ResultStep.tsx
  ```
- [ ] **Cálculos executados**: Log de useResultCalculations (se habilitado)
  ```
  [ResultCalculations] Top styles: [...]
  [ResultCalculations] Confidence: X%
  ```
- [ ] **Context criado**: ResultProvider montado
- [ ] **Blocks renderizados**: result-main, result-style, result-cta-primary
- [ ] **Sem erros**: Nenhum erro de undefined, null, ou componente não encontrado

#### Network (F12 > Network)
- [ ] Template step-20.json carregado
- [ ] Sem erros 404

#### Analytics (Console > Network)
Quando clicar no CTA primário:
- [ ] Evento gtag disparado (se analytics configurado)
  ```
  gtag('event', 'checkout_initiated', ...)
  ```

---

## 🎯 TESTE 4: Fallback para Legacy

### Contexto
Se um template **NÃO TEM** blocks[], deve usar componente legado automaticamente.

### Cenário de Teste
1. Temporariamente remover blocks[] de um template (ex: step-12.json)
2. Recarregar página
3. Verificar se TransitionStep legado renderiza

### ✅ Validações Fallback
- [ ] Página carrega (sem crash)
- [ ] Componente legado renderiza
- [ ] Warning de deprecation aparece
- [ ] Funcionalidade preservada

---

## 🎯 TESTE 5: Lógica de Cálculos Preservada

### Contexto
useResultCalculations deve produzir **EXATAMENTE** os mesmos resultados do código original.

### Validação
Compare o Step 20 **ANTES** e **DEPOIS** da migração:

#### Algoritmo de Score
- [ ] **Ordenação correta**: Estilos ordenados por pontuação (decrescente)
- [ ] **Desempate correto**: Em caso de empate, primeira escolha do usuário vence
- [ ] **TOP 3 exibido**: Apenas 3 estilos principais mostrados
- [ ] **Percentuais corretos**: Soma de percentuais = 100%
- [ ] **Estilo principal**: O estilo #1 é o correto

#### Casos de Teste
Teste com diferentes perfis:
1. **Perfil balanceado**: Scores próximos (ex: Natural 12, Clássico 11, Elegante 10)
   - [ ] TOP 3 correto
   - [ ] Desempate respeitado

2. **Perfil dominante**: Um estilo com score muito maior (ex: Dramático 25, outros <5)
   - [ ] Estilo principal correto
   - [ ] Confidence alto

3. **Perfil disperso**: Scores distribuídos (ex: 8 estilos com 3-5 pontos cada)
   - [ ] TOP 3 selecionado corretamente
   - [ ] Confidence baixo

---

## 🐛 PROBLEMAS CONHECIDOS (ESPERADOS)

### Warnings Esperados
✅ **Deprecation warnings** - ESPERADO e CORRETO
```
⚠️ COMPONENTE LEGADO DETECTADO: TransitionStep.tsx
⚠️ COMPONENTE LEGADO DETECTADO: ResultStep.tsx
```

### Comportamento Normal
- Template loading: Pode ter flash breve "Carregando..."
- Fallback: Se template não tem blocks, usa componente legado (correto)

---

## ❌ PROBLEMAS QUE INDICAM BUG

### Erros Críticos
🚨 **NÃO PODE ACONTECER:**
1. ❌ Crash da aplicação
2. ❌ Página em branco
3. ❌ "Component not found" em console
4. ❌ "Cannot read property of undefined"
5. ❌ Cálculos errados (TOP 3 diferente do esperado)
6. ❌ Estilo principal incorreto

### Sinais de Problema
- Blocks não renderizam (página vazia)
- Context não disponível (erro ao consumir useResult)
- CTA não funciona (não abre link)
- Percentuais errados ou NaN
- TOP 3 com mais ou menos de 3 itens

---

## 📊 CRITÉRIOS DE SUCESSO

### ✅ APROVADO SE:
1. ✅ Steps 12, 19, 20 renderizam visualmente corretos
2. ✅ Deprecation warnings aparecem (indicam que código novo está ativo)
3. ✅ Cálculos de resultado **idênticos** ao original
4. ✅ CTA funciona e abre Hotmart
5. ✅ Fallback funciona (se template sem blocks)
6. ✅ **ZERO erros** de runtime no console

### ❌ REPROVADO SE:
1. ❌ Qualquer crash ou erro fatal
2. ❌ Cálculos divergem do original
3. ❌ Blocks não renderizam (sem fallback)
4. ❌ Context não disponível
5. ❌ CTA não funciona

---

## 🔍 LOGS ÚTEIS PARA DEBUG

### Habilitar Logs Detalhados
No `useResultCalculations.ts`, adicionar (temporário):
```typescript
console.log('[ResultCalculations] Raw scores:', scores);
console.log('[ResultCalculations] Top styles:', topStyles);
console.log('[ResultCalculations] Primary:', primaryStyle);
console.log('[ResultCalculations] Confidence:', confidence);
```

No `ResultStepAdapter`, adicionar (temporário):
```typescript
console.log('[ResultAdapter] Template loaded:', template);
console.log('[ResultAdapter] Has blocks:', template?.blocks?.length);
console.log('[ResultAdapter] UserProfile:', userProfile);
```

---

## 📝 CHECKLIST FINAL

Após completar todos os testes:

- [ ] Step 12 renderiza corretamente
- [ ] Step 19 renderiza corretamente
- [ ] Step 20 renderiza corretamente
- [ ] Cálculos preservados (TOP 3 idêntico)
- [ ] CTAs funcionam
- [ ] Analytics dispara
- [ ] Deprecation warnings presentes
- [ ] Zero erros no console
- [ ] Fallback funciona
- [ ] Imagens carregam (ou fallback)

---

## 🎉 PRÓXIMOS PASSOS

Se todos os testes passarem:
1. ✅ Marcar Task 8 como completa
2. ➡️ Prosseguir para Task 9: Verificar efeitos colaterais (Steps 1-11, 13-18)
3. ➡️ Task 10: Atualizar documentação
4. ➡️ Task 11: Validação final e celebração 🎊

---

## 📞 SUPORTE

Em caso de problemas:
1. Capturar screenshot do erro
2. Copiar stack trace do console
3. Anotar qual step/teste falhou
4. Verificar arquivos:
   - `ProductionStepsRegistry.tsx` (adapters)
   - `useResultCalculations.ts` (cálculos)
   - `ResultContext.tsx` (context)
   - Templates: `step-12.json`, `step-19.json`, `step-20.json`

---

**Data do Teste**: ___/___/_____  
**Testador**: _______________  
**Resultado**: ⬜ APROVADO | ⬜ REPROVADO  
**Observações**:
___________________________________________________________________________
___________________________________________________________________________
