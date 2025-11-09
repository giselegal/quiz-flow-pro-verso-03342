# 🧪 Guia de Teste: Diagnosticar Problema de Dados do Painel

## 🎯 Objetivo
Descobrir por que o Painel de Propriedades NÃO mostra:
- ❌ Imagens (imageUrl)
- ❌ Pontuação (points/score)
- ❌ Categoria (category)

Mas MOSTRA:
- ✅ Título
- ✅ Texto das opções

## 🔧 Ferramentas Implementadas

### 1. Botão DEBUG no Painel ✅
**Localização**: Aparece no topo do Painel de Propriedades quando bloco está selecionado

**O que faz**:
- Mostra JSON completo do bloco
- Separa properties e content
- Lista todas as options com detalhes
- Identifica campos ausentes

### 2. Logs Automáticos ✅
**Onde aparecem**: Console do navegador (F12)

**O que mostram**:
- Carregamento do draft do Supabase
- Primeiro bloco quiz-options encontrado
- Estrutura de options (content vs properties)
- Primeira opção com todos os campos

### 3. Script de Teste Supabase ✅
**Arquivo**: `teste-estrutura-dados.ts`

**Como usar**: Copiar e colar no console

## 📋 Roteiro de Teste

### TESTE 1: Criar Novo Bloco da Biblioteca ⭐ MAIS IMPORTANTE

**Objetivo**: Verificar se biblioteca tem valores padrão corretos

**Passos**:
1. Abrir editor: `http://localhost:5173/quiz-editor/modular`
2. Arrastar "Opções de Quiz" da biblioteca (coluna esquerda)
3. Soltar no canvas
4. Clicar no bloco criado
5. Abrir console (F12)
6. Clicar no botão **"🧪 DEBUG: Mostrar JSON do Bloco"**

**O que verificar**:
```
✅ ESPERADO (SE BIBLIOTECA ESTÁ OK):
content: {
  options: [
    {
      id: "opt1",
      text: "Opção 1",
      imageUrl: "https://res.cloudinary.com/...",  ← TEM URL
      points: 10,                                   ← TEM NÚMERO
      score: 10,                                    ← TEM NÚMERO
      category: "A"                                 ← TEM TEXTO
    },
    // ... mais 2 opções
  ]
}

❌ PROBLEMA (SE BIBLIOTECA ESTÁ ERRADA):
content: {
  options: [
    {
      id: "opt1",
      text: "Opção 1",
      imageUrl: "",        ← VAZIO
      points: 0,           ← ZERO
      category: ""         ← VAZIO
    }
  ]
}
```

**Resultado esperado**:
- ✅ Miniaturas de imagens DEVEM aparecer
- ✅ Campos de pontos DEVEM estar preenchidos (10, 20, 30)
- ✅ Campos de categoria DEVEM estar preenchidos (A, B, C)

**Se NÃO aparecer**: Problema está no COMPONENT_LIBRARY (linha 335-377)

---

### TESTE 2: Carregar Funnel Existente

**Objetivo**: Verificar se dados salvos no Supabase estão corretos

**Passos**:
1. Abrir editor com funnel: `http://localhost:5173/quiz-editor/modular?funnel=SEU_ID`
2. Aguardar carregamento
3. Verificar logs automáticos no console:
   ```
   🔍 QuizEditorBridge - Carregando draft: SEU_ID
   ✅ QuizEditorBridge - Draft carregado do DB
   🎯 Primeiro bloco quiz-options encontrado:
   ```
4. Clicar em bloco de quiz-options existente
5. Clicar no botão **"🧪 DEBUG: Mostrar JSON do Bloco"**

**O que verificar nos logs**:
```
🎯 Primeiro bloco quiz-options encontrado:
  - Tipo: quiz-options
  - Options em content: 4    ← DEVE TER NÚMERO > 0
  - Primeira opção: {
      id: "2a",
      text: "...",
      imageUrl: "https://...",   ← VERIFICAR SE TEM
      points: 1,                 ← VERIFICAR SE TEM
      category: "Natural"        ← VERIFICAR SE TEM
    }
```

**Resultado esperado**:
- ✅ `Options em content` deve ter número > 0
- ✅ Primeira opção deve ter `imageUrl`, `points`, `category`

**Se options em content = 0**: Dados não foram salvos corretamente no banco

**Se primeira opção não tem campos**: Dados foram salvos sem esses campos

---

### TESTE 3: Verificar Banco de Dados Direto

**Objetivo**: Ver dados crus do Supabase

**Passos**:
1. Copiar conteúdo de `teste-estrutura-dados.ts`
2. Abrir editor: `http://localhost:5173/quiz-editor/modular?funnel=SEU_ID`
3. Abrir console (F12)
4. Colar e executar o script
5. Analisar resultados

**O que verificar**:
```
5️⃣ Procurando blocos quiz-options...

🎯 Bloco 1 (Step 2, Block 2):
   Tipo: quiz-options
   
   📦 CONTENT:
   ✅ options encontradas (4 itens)
   📝 Primeira opção: {
     id: "2a",
     text: "Vestidos fluidos e confortáveis",
     imageUrl: "https://...",   ← SE AUSENTE, PROBLEMA NO BANCO
     points: 1,                 ← SE AUSENTE, PROBLEMA NO BANCO
     category: "Natural"        ← SE AUSENTE, PROBLEMA NO BANCO
   }
```

**Se campos AUSENTES no banco**: 
- Dados nunca foram salvos com esses campos
- Ou foram salvos de forma incorreta
- Ou template original não tinha esses campos

---

### TESTE 4: Comparar Template vs Banco

**Objetivo**: Ver se template tem dados que banco não tem

**Passos**:
1. Abrir arquivo: `src/templates/quiz21StepsComplete.ts`
2. Procurar por linha 325: `"options": [`
3. Verificar estrutura das opções no template
4. Comparar com resultado do TESTE 3

**Template tem**:
```typescript
{
  "id": "2a",
  "text": "Vestidos fluidos e confortáveis",
  "imageUrl": "https://res.cloudinary.com/...",
  "value": "2a",
  "category": "Natural",
  "points": 1
}
```

**Se banco NÃO tem**: Funnel foi criado antes da correção

---

## 🎯 Diagnóstico por Sintoma

### Sintoma A: Novo bloco vazio
```
Criar novo bloco → Campos vazios
```
**Causa**: COMPONENT_LIBRARY com valores padrão vazios  
**Solução**: Verificar linha 335-377 de QuizModularProductionEditor.tsx  
**Commit correção**: `6aca87971`

### Sintoma B: Funnel carregado vazio
```
Carregar funnel → Campos vazios
```
**Causa**: Dados não salvos no Supabase  
**Solução**: Criar novo funnel OU migrar dados  

### Sintoma C: Options em properties (não content)
```
Logs mostram: options em properties ✅, content ❌
```
**Causa**: Estrutura antiga (antes da correção)  
**Solução**: Migração de dados ou re-salvar

### Sintoma D: Banco tem dados mas UI não mostra
```
Teste 3 mostra campos ✅, mas painel vazio ❌
```
**Causa**: Problema no DynamicPropertiesForm  
**Solução**: Verificar renderização de campos

---

## 📊 Checklist de Resultados

Após executar os testes, preencha:

### TESTE 1 - Novo Bloco
- [ ] Miniaturas aparecem com imagens
- [ ] Campos de pontos: 10, 20, 30
- [ ] Campos de categoria: A, B, C
- [ ] JSON mostra content.options com todos os campos

### TESTE 2 - Funnel Carregado
- [ ] Logs mostram "Options em content: X" (X > 0)
- [ ] Primeira opção tem imageUrl
- [ ] Primeira opção tem points
- [ ] Primeira opção tem category

### TESTE 3 - Banco Direto
- [ ] Bloco quiz-options encontrado
- [ ] Options em CONTENT (não properties)
- [ ] Primeira opção completa no banco

### TESTE 4 - Template
- [ ] Template tem todos os campos
- [ ] Template e banco têm mesma estrutura

---

## 🚀 Próximos Passos

### Se TESTE 1 FALHAR:
1. Verificar COMPONENT_LIBRARY
2. Verificar commit `6aca87971`
3. Aplicar correção novamente

### Se TESTE 2/3 FALHAREM:
1. Funnel foi criado antes da correção
2. Opções:
   - A) Criar novo funnel (recomendado)
   - B) Migrar dados do funnel antigo
   - C) Re-salvar funnel manualmente

### Se TODOS PASSAREM mas UI vazia:
1. Problema no DynamicPropertiesForm
2. Verificar renderização de campos
3. Adicionar mais logs no form

---

## 📝 Template de Relatório

Copie e preencha após os testes:

```
=== RELATÓRIO DE TESTES ===

TESTE 1 - Novo Bloco:
✅/❌ Miniaturas: 
✅/❌ Pontos: 
✅/❌ Categorias: 
JSON: [colar primeira opção aqui]

TESTE 2 - Funnel Carregado:
✅/❌ Options em content: X itens
✅/❌ Primeira opção completa:
Log: [colar log 🎯 aqui]

TESTE 3 - Banco Direto:
✅/❌ Bloco encontrado:
✅/❌ Options em content:
JSON: [colar primeira opção do banco aqui]

DIAGNÓSTICO:
[Sintoma A/B/C/D]

CAUSA RAIZ:
[Descrever aqui]

SOLUÇÃO:
[O que fazer]
```

---

**Status**: Ferramentas implementadas ✅  
**Commit**: f9f463e4e  
**Aguardando**: Execução dos testes pelo usuário
