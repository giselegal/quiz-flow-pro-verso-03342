# ⚡ VALIDAÇÃO RÁPIDA - WAVE 1 (2 minutos)

**URL Aberta**: http://localhost:8080/editor?resource=quiz21StepsComplete  
**Status Servidor**: ✅ Rodando na porta 8080

---

## 🎯 CHECKLIST VISUAL RÁPIDO

### ✅ PASSO 1: Carregamento Inicial (10 segundos)
Observe o tempo de carregamento:

- [ ] **TTI < 2s**: Página deve ficar interativa rapidamente
- [ ] **PropertiesPanel NÃO vazio**: Deve mostrar propriedades do primeiro bloco automaticamente
- [ ] **Console limpo**: Poucos ou nenhum erro 404 (abra F12 → Console)

**✨ O que você deve ver**:
```
✅ Editor carregado
✅ 4 colunas visíveis (Steps | Biblioteca | Canvas | Properties)
✅ Properties mostra "Bloco Selecionado" com badge de tipo
✅ Primeiro bloco do Canvas tem leve destaque
```

---

### ✅ PASSO 2: Test Selection Chain (30 segundos)

#### Teste A: Click no Canvas
1. **Clicar em qualquer bloco** na coluna Canvas (central)
2. **Observar**:
   - [ ] PropertiesPanel (direita) atualiza instantaneamente
   - [ ] Mostra propriedades editáveis do bloco clicado
   - [ ] Badge no topo muda para tipo do bloco

#### Teste B: Preview Mode
1. **Clicar em "Visualizar (Editor)"** no topo
2. **Clicar em qualquer bloco** no preview
3. **Observar**:
   - [ ] Bloco tem **ring azul grosso** (4px)
   - [ ] Badge **"SELECIONADO"** aparece no canto
   - [ ] **Indicador circular azul pulsante** no canto esquerdo
   - [ ] Bloco auto-scroll para centro da tela

---

### ✅ PASSO 3: Network Performance (20 segundos)

**Abrir DevTools** (F12):
1. **Ir para aba Network**
2. **Filtrar por status**: Digitar `status-code:404` na busca
3. **Recarregar página** (Ctrl+R)
4. **Contar 404s**:
   - [ ] **< 10 requests 404** ✅ BOM
   - [ ] **10-20 requests 404** ⚠️ ACEITÁVEL
   - [ ] **> 20 requests 404** ❌ PROBLEMA

---

### ✅ PASSO 4: Console Logs (20 segundos)

**Abrir DevTools Console** (F12 → Console):

**Logs esperados** (deve ver):
```
✅ [WAVE1] Auto-selecionando primeiro bloco: block-xxx
✅ 📍 [WAVE1] Selecionando bloco: block-xxx
✅ ✅ [jsonStepLoader] Carregado X blocos de /templates/...
```

**Logs NÃO esperados** (não deve ver em excesso):
```
❌ Failed to load resource: 404 (mais de 10×)
❌ Uncaught TypeError: Cannot read properties of null
❌ selectedBlockId is always null
```

---

### ✅ PASSO 5: Edit Properties (30 segundos)

1. **Selecionar qualquer bloco**
2. **No PropertiesPanel**, encontrar campo editável (ex: texto)
3. **Modificar o valor**
4. **Observar**:
   - [ ] Indicador **"Alterações não salvas"** aparece
   - [ ] Ponto laranja pulsante visível
5. **Clicar em "Salvar Alterações"**
6. **Observar**:
   - [ ] Botão muda para **"Salvo"**
   - [ ] Mudança reflete no Canvas/Preview

---

## 🎨 VALIDAÇÃO VISUAL DETALHADA

### Highlight Visual no Preview
**Como testar**:
1. Modo Preview ativo
2. Clicar em 3 blocos diferentes
3. Cada um deve mostrar:

```
✅ Ring azul 4px com offset
✅ Scale 1.02 (zoom sutil)
✅ Shadow elevada (sombra forte)
✅ Background azul claro
✅ Badge "SELECIONADO" canto superior direito
✅ Indicador circular pulsante canto superior esquerdo
✅ Transição suave (300ms)
```

---

## 📊 MÉTRICAS PARA ANOTAR

### Performance Tab (DevTools)
1. **Recarregar página com Performance tab gravando**
2. **Anotar**:

| Métrica | Target | Seu Resultado |
|---------|--------|---------------|
| **TTI** | < 1500ms | _______ ms |
| **FCP** | < 1000ms | _______ ms |
| **LCP** | < 2000ms | _______ ms |

### Network Tab
1. **Recarregar com Network tab aberto**
2. **Anotar**:

| Métrica | Target | Seu Resultado |
|---------|--------|---------------|
| **Total Requests** | < 50 | _______ |
| **404 Errors** | < 10 | _______ |
| **Transfer Size** | < 2MB | _______ MB |

---

## ✅ RESULTADO FINAL

### Se TODOS os itens estão ✅:
```
🎉 WAVE 1 100% FUNCIONAL!
✅ Editor operacional
✅ Performance otimizada
✅ UX perfeita
➡️ PRONTO PARA WAVE 2
```

### Se alguns itens estão ❌:
```
⚠️ Revisar itens falhando
📋 Anotar quais falharam
🔍 Verificar console logs
📞 Reportar com evidências
```

---

## 🚀 PRÓXIMA AÇÃO

### Tudo OK? ✅
**Você pode**:
1. Continuar usando o editor normalmente
2. Testar criação de quiz completo
3. Prosseguir para WAVE 2 (otimizações avançadas)

### Algo falhou? ❌
**Reportar com**:
1. Screenshot do console (F12)
2. Screenshot do Network tab
3. Descrição do problema
4. Steps para reproduzir

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Guia Completo**: `/docs/WAVE1_QUICK_TEST_GUIDE.md`
- **Troubleshooting**: `/docs/WAVE1_QUICK_TEST_GUIDE.md#-o-que-fazer-se-algo-falhar`
- **Métricas**: `/docs/WAVE1_EXECUTIVE_SUMMARY.md#-impacto-mensurável`

---

**Tempo total**: ~2 minutos  
**Dificuldade**: ⭐ Muito Fácil  
**Objetivo**: Validação rápida antes de WAVE 2
