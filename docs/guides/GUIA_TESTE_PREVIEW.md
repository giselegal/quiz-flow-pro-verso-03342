# 🧪 Guia de Teste do Preview - Comportamento de Produção

## ✅ Status Técnico Atual

```
✅ Preview renderizando normalmente
✅ Lazy load: 9ms (otimizado)
⚠️  3 timeouts de 404 (ESPERADO - usa fallback)
✅ Componentes carregados com sucesso
```

Os **404s são normais** porque os arquivos não existem no Supabase ainda. O sistema usa valores padrão e continua funcionando perfeitamente!

---

## 🎯 3 Testes Manuais Necessários

### 📋 TESTE 1: Validação de Seleções

**Objetivo:** Confirmar que o preview valida regras como em produção

**Passos:**
1. No preview, navegue até **Step 02** (primeira pergunta)
2. **NÃO selecione nenhuma opção**
3. Clique no botão **"Continuar"**

**✅ Resultado Esperado:**
- Botão deve estar **desabilitado** OU
- Mostrar mensagem de erro: *"Selecione exatamente 3 opções"*
- **NÃO deve avançar** para próxima step

**❌ Se falhar:**
- Preview avança sem validar
- Significa que validação não está ativa

---

### 📋 TESTE 2: Auto-Avanço

**Objetivo:** Confirmar que preview avança automaticamente quando apropriado

#### 2A. Auto-avanço em Perguntas (steps 02-11)

**Passos:**
1. No preview, em qualquer pergunta (steps 02-11)
2. Selecione **exatamente 3 opções** (clique em 3 cards)
3. **NÃO clique em "Continuar"** - aguarde 1-2 segundos

**✅ Resultado Esperado:**
- Preview deve **avançar automaticamente** para próxima step
- Sem precisar clicar em "Continuar"

#### 2B. Auto-avanço em Transições (steps 12 e 19)

**Passos:**
1. Complete steps 01-11 para chegar na **step 12** (transição)
2. **NÃO clique em nada** - apenas observe

**✅ Resultado Esperado:**
- Após **2-3 segundos**, deve avançar sozinha para step 13
- Mesmo comportamento na step 19 (transição resultado)

**❌ Se falhar:**
- Preview não avança sozinho
- Precisa clicar manualmente em "Continuar"

---

### 📋 TESTE 3: Cálculo de Resultado (Step 20)

**Objetivo:** Confirmar que resultado é calculado baseado nas respostas

**Passos:**
1. Complete **todo o quiz** no preview (steps 01-19)
2. Aguarde chegar na **Step 20** (Resultado)
3. Observe o conteúdo exibido

**✅ Resultado Esperado:**
- Deve mostrar **nome de um estilo** (ex: "Natural", "Romântico", "Elegante")
- Texto descritivo do estilo
- Possivelmente estilos secundários
- **NÃO deve estar vazio**
- **NÃO deve mostrar erro**

**❌ Se falhar:**
- Tela em branco
- Erro no console
- Texto genérico sem personalização
- "undefined" ou "null"

---

## 📊 Detalhes Técnicos

### Como o Sistema Funciona

#### Perguntas Principais (02-11)
```typescript
// Cada pergunta:
- 8 opções disponíveis
- Requer EXATAMENTE 3 seleções
- Cada opção pontua para 1 ou mais dos 8 estilos
- Auto-avanço após completar seleção
```

#### Perguntas Estratégicas (13-18)
```typescript
// Cada pergunta:
- Seleção ÚNICA (1 opção apenas)
- Auto-avanço IMEDIATO ao clicar
- Usada para personalizar oferta (step 21)
- NÃO pontua estilos
```

#### Cálculo do Resultado (step 20)
```typescript
// Lógica:
10 perguntas × 3 seleções = 30 pontos distribuídos

Exemplo de resultado:
{
  Natural: 12 pontos      ← ESTILO PRINCIPAL ⭐
  Romântico: 8 pontos     ← Secundário
  Elegante: 6 pontos      ← Secundário
  Outros: 4 pontos total
}
```

---

## 🐛 Como Reportar Problemas

Se algum teste falhar, copie as informações abaixo:

### Template de Reporte

```
❌ TESTE FALHOU: [Nome do teste]

COMPORTAMENTO ESPERADO:
[Descreva o que deveria acontecer]

COMPORTAMENTO OBSERVADO:
[Descreva o que realmente aconteceu]

CONSOLE LOGS:
[Cole os logs do console - especialmente erros em vermelho]

STEP ATUAL:
[Em qual step estava testando]
```

---

## 🚀 Checklist Final

Marque conforme testa:

- [ ] **Teste 1:** Validação bloqueia avanço sem 3 seleções
- [ ] **Teste 2A:** Auto-avanço funciona em perguntas (02-11)
- [ ] **Teste 2B:** Auto-avanço funciona em transições (12, 19)
- [ ] **Teste 3:** Step 20 mostra resultado calculado corretamente

---

## 💡 Dicas

1. **Recarregue a página** antes de começar os testes
2. Aguarde os **3 timeouts de 15s** (total ~45s) antes de interagir
3. Abra o **Console do navegador** (F12) para ver logs
4. Teste com **diferentes combinações** de respostas

---

## 📞 Próximos Passos

✅ **Se todos os testes passarem:**
- Sistema está 100% funcional
- Preview com comportamento de produção confirmado
- Pode começar a usar o editor normalmente

❌ **Se algum teste falhar:**
- Me envie os logs do console
- Informe qual teste falhou
- Descreva o comportamento observado
- Vou corrigir imediatamente
