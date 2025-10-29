# 🧪 Teste de Auto-Avanço - Passo a Passo

## ✅ Status Atual

```
✅ Preview carregando sem erros fatais
✅ Timeouts tratados como warnings (normal)
✅ Auto-avanço implementado (800ms após completar seleção)
⏳ AGUARDANDO TESTE MANUAL
```

---

## 📋 TESTE 1: Auto-Avanço em Perguntas (steps 02-11)

### Preparação

1. **Certifique-se de que está na rota `/editor`**
2. **Coluna do meio (Preview)** deve estar visível
3. **Console aberto** (F12 → aba Console)

### Passos do Teste

#### Passo 1: Navegar até Step-02

- No preview, **clique no nome** na step-01
- Digite qualquer nome (ex: "Teste")
- **Avance** para step-02 (primeira pergunta)

#### Passo 2: Selecionar Opções

- Na step-02, você verá **8 opções** com imagens
- **Clique em 3 opções diferentes**
- Observe o contador: `(0/3)` → `(1/3)` → `(2/3)` → `(3/3)`

#### Passo 3: Observar Auto-Avanço

**NÃO CLIQUE EM "CONTINUAR"!** Apenas observe:

```
⏱️ Após selecionar a 3ª opção:
   ├─ Botão muda para "Avançando..." com pulse
   ├─ Aguarde ~800ms
   └─ Preview deve avançar SOZINHO para step-03
```

### ✅ Resultado Esperado

```javascript
// No console:
✨ Auto-avanço: step-02 → próxima step

// Na tela:
✅ Step-02 → Step-03 automaticamente
✅ Sem clicar em botão
✅ ~800ms de delay (suave)
```

### ❌ Se Falhar

```
Sintoma: Não avança sozinho, precisa clicar em "Continuar"

Ação: Copie os logs do console e me envie:
- Procure por "✨ Auto-avanço"
- Verifique se há erros em vermelho
- Tire screenshot se possível
```

---

## 📋 TESTE 2: Auto-Avanço em Perguntas Estratégicas (steps 13-18)

### Preparação

1. **Continue o quiz** a partir da step-03
2. **Complete steps 03-11** (pode clicar rápido, não precisa ler)
3. **Passe pela step-12** (transição - avança sozinha)
4. **Chegue na step-13** (primeira pergunta estratégica)

### Diferença das Estratégicas

```
Perguntas Normais (02-11):
  - 8 opções
  - Selecionar 3
  - Auto-avanço após completar 3

Perguntas Estratégicas (13-18):
  - 4-5 opções (sem imagens)
  - Selecionar APENAS 1
  - Auto-avanço IMEDIATO após clicar
```

### Passos do Teste

#### Passo 1: Na Step-13

- Você verá **opções de faixa etária** (18-25, 26-35, etc)
- **Clique em UMA opção**
- **NÃO precisa clicar em continuar**

#### Passo 2: Observar Auto-Avanço Imediato

```
⚡ Assim que clicar:
   ├─ Opção é selecionada
   ├─ Aguarde ~800ms
   └─ Avança IMEDIATAMENTE para step-14
```

### ✅ Resultado Esperado

```javascript
// No console:
✨ Auto-avanço: step-13 → próxima step

// Na tela:
✅ Clique → 800ms → Próxima step
✅ SEM clicar em "Continuar"
✅ Mais rápido que perguntas normais
```

---

## 📋 TESTE 3: Auto-Avanço em Transições (steps 12, 19)

### Step-12 (Transição entre fases)

```
Comportamento:
  - Aparece após completar step-11
  - Mostra mensagem de transição
  - Avança SOZINHA após 2-3 segundos
  - NÃO tem botão de continuar
```

### Step-19 (Transição para resultado)

```
Comportamento:
  - Aparece após completar step-18
  - Mostra "Calculando seu resultado..."
  - Animação de loading
  - Avança SOZINHA após 2-3 segundos
  - Vai para step-20 (resultado)
```

### ✅ Resultado Esperado

```
✅ Step-12: Auto-avança após 2-3s
✅ Step-19: Auto-avança após 2-3s
✅ Sem interação necessária
```

---

## 📊 Resumo dos 3 Tipos de Auto-Avanço

| Tipo | Steps | Gatilho | Delay | Botão? |
|------|-------|---------|-------|--------|
| **Perguntas** | 02-11 | 3 seleções | 800ms | Visual apenas |
| **Estratégicas** | 13-18 | 1 seleção | 800ms | Visual apenas |
| **Transições** | 12, 19 | Automático | 2-3s | Não tem |

---

## 🎯 Teste Completo do Fluxo

### Rota Sugerida

```
01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11
  ↓
 12 (transição auto)
  ↓
13 → 14 → 15 → 16 → 17 → 18
  ↓
 19 (transição auto)
  ↓
 20 (resultado)
  ↓
 21 (oferta)
```

### Checklist Rápido

- [ ] **Step-02**: Selecionar 3 → Auto-avança ✅
- [ ] **Step-03**: Selecionar 3 → Auto-avança ✅
- [ ] **Step-04**: Selecionar 3 → Auto-avança ✅
- [ ] **Step-12**: Transição → Auto-avança ✅
- [ ] **Step-13**: Selecionar 1 → Auto-avança ✅
- [ ] **Step-14**: Selecionar 1 → Auto-avança ✅
- [ ] **Step-19**: Transição → Auto-avança ✅
- [ ] **Step-20**: Resultado aparece ✅

---

## 🐛 Troubleshooting

### Problema: Não avança em nenhuma step

```javascript
// Verifique no console:
1. Procure por "✨ Auto-avanço"
   - Se NÃO aparecer → useEffect não está disparando
   
2. Procure por erros em vermelho
   - Se aparecer → me envie o erro completo
   
3. Verifique se seleções estão sendo salvas
   - Abra Redux DevTools (se tiver)
   - Ou me diga se o contador (X/3) atualiza
```

### Problema: Avança muito rápido

```javascript
// Comportamento esperado:
✅ 800ms = quase 1 segundo (perceptível)
❌ Se instantâneo → problema no delay
```

### Problema: Avança, mas com erro

```javascript
// Copie e me envie:
1. Console completo (todos os logs)
2. Mensagem de erro exata
3. Em qual step aconteceu
```

---

## 📞 Reportar Resultados

### Se TUDO FUNCIONAR

```markdown
✅ Auto-avanço perguntas: FUNCIONANDO
✅ Auto-avanço estratégicas: FUNCIONANDO
✅ Auto-avanço transições: FUNCIONANDO
✅ Console mostra "✨ Auto-avanço" nos logs
✅ Preview fluido, sem travamentos

→ PODE MARCAR TODO COMO COMPLETO!
```

### Se ALGO FALHAR

```markdown
❌ Tipo de step que falhou: [02-11 / 13-18 / 12,19]
❌ Comportamento observado: [descrever]
❌ Logs do console: [copiar todos]
❌ Screenshot: [se possível]

→ ME ENVIE PARA CORREÇÃO IMEDIATA!
```

---

## ✅ Próximo Teste Após Este

Quando confirmar que auto-avanço funciona:

```
TESTE FINAL: Cálculo de Resultado (Step-20)
  - Complete todo o quiz
  - Verifique se step-20 mostra estilo calculado
  - Não deve estar vazio ou com erro
```

---

**COMECE O TESTE!** 🚀

Qualquer problema, me avise com os logs do console.
