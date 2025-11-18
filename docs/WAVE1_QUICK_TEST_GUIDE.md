# 🧪 WAVE 1: GUIA RÁPIDO DE TESTES

**Objetivo**: Validar que todas as correções da WAVE 1 estão funcionando corretamente.  
**Tempo estimado**: 5-10 minutos

---

## 🚀 PASSO 1: Iniciar Servidor Dev

```bash
npm run dev
```

Aguarde até ver:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 📊 PASSO 2: Abrir Editor

Acesse: **http://localhost:5173/editor?resource=quiz21StepsComplete**

### ✅ Checklist Visual Imediato

1. **Loading deve ser rápido** (< 2 segundos)
   - ⏱️ **ANTES**: 2500ms
   - ✅ **AGORA**: ~1300ms

2. **Console DevTools** (F12)
   - ✅ Ver logs `[WAVE1] Auto-selecionando primeiro bloco: block-xxx`
   - ✅ Ver logs `📍 [WAVE1] Selecionando bloco: block-xxx`
   - ❌ **NÃO deve ter** dezenas de erros 404

3. **Network Tab** (DevTools → Network)
   - ✅ Requests 404: Deve ser **< 10**
   - ❌ **ANTES**: 42+ requests 404

---

## 🎯 PASSO 3: Testar Seleção de Blocos

### Teste A: Canvas → Properties
1. **Clicar em qualquer bloco no Canvas (coluna central)**
2. ✅ **Painel Properties (direita) deve atualizar instantaneamente**
3. ✅ Deve mostrar propriedades editáveis
4. ✅ Badge com tipo do bloco no topo

### Teste B: Preview → Canvas
1. **Mudar para modo Preview** (botão "Visualizar (Editor)" no topo)
2. **Clicar em qualquer bloco no Preview**
3. ✅ Bloco deve ter:
   - Ring azul grosso (4px) ao redor
   - Badge "SELECIONADO" no canto superior direito
   - Indicador circular azul pulsante no canto superior esquerdo
   - Auto-scroll suave para centralizar bloco
4. ✅ **Canvas deve destacar o mesmo bloco**

### Teste C: Auto-Select Inicial
1. **Recarregar página** (F5)
2. ✅ Após carregamento, **Properties deve mostrar automaticamente o primeiro bloco**
3. ✅ Não deve ficar vazio com mensagem "Nenhum bloco selecionado"

---

## 🔄 PASSO 4: Testar Edição

### Teste D: Editar Propriedades
1. **Selecionar qualquer bloco**
2. **No painel Properties**, alterar alguma propriedade (ex: texto)
3. ✅ Indicador "Alterações não salvas" deve aparecer
4. **Clicar em "Salvar Alterações"**
5. ✅ Botão deve mudar para "Salvo"
6. ✅ Mudança deve refletir no Canvas/Preview

### Teste E: Navegação Entre Steps
1. **Clicar em "Step 02"** no navegador de steps (coluna esquerda)
2. ✅ Deve carregar rapidamente (< 500ms)
3. ✅ Primeiro bloco do Step 02 deve ser auto-selecionado
4. ✅ **Network Tab**: NÃO deve ter cascata de 404s

---

## 📈 PASSO 5: Métricas de Performance

### DevTools → Performance Tab
1. **Iniciar gravação** (círculo vermelho)
2. **Recarregar página** (F5)
3. **Parar gravação** quando página estiver totalmente carregada
4. **Analisar métricas**:

✅ **TTI (Time to Interactive)**:
- ❌ ANTES: ~2500ms
- ✅ AGORA: ~1300ms (ou menos)

✅ **LCP (Largest Contentful Paint)**:
- ✅ Deve ser < 2000ms

### Network Tab
1. **Recarregar página com Network tab aberto**
2. **Filtrar por status**: `status-code:404`
3. ✅ Deve ter **< 10 requests 404**
4. ❌ **ANTES**: 42+ requests 404

---

## 🎨 PASSO 6: Testes Visuais

### Teste F: Highlight Visual
1. **Modo Preview ativo**
2. **Clicar em diferentes blocos**
3. ✅ Cada bloco selecionado deve ter:
   - **Ring azul de 4px** com offset
   - **Scale 1.02** (leve zoom)
   - **Shadow elevada** (shadow-2xl)
   - **Background azul claro** (bg-blue-50/50)
   - **Badge "SELECIONADO"** no canto
   - **Indicador circular pulsante**

### Teste G: Hover States
1. **Passar mouse sobre blocos não selecionados**
2. ✅ Deve mostrar:
   - Ring cinza de 2px
   - Shadow média
   - Transição suave (300ms)

---

## 🐛 PASSO 7: Verificar Console Logs

### Logs Esperados (Console DevTools)
```
✅ 🔍 [jsonStepLoader] Tentando carregar: /templates/quiz21StepsComplete/master.v3.json
✅ ✅ [jsonStepLoader] Carregado 50 blocos de /templates/...
✅ [WAVE1] Auto-selecionando primeiro bloco: block-uuid-xxx
✅ 📍 [WAVE1] Selecionando bloco: block-uuid-yyy
```

### Logs NÃO Esperados (Erros)
```
❌ Failed to load resource: the server responded with a status of 404
❌ Uncaught TypeError: Cannot read properties of null
❌ selectedBlockId is always null
```

---

## ✅ CHECKLIST FINAL

| Item | Status | Observação |
|------|--------|------------|
| TTI < 1500ms | ⬜ | Medir no Performance tab |
| 404s < 10 | ⬜ | Contar no Network tab |
| Properties auto-select | ⬜ | Primeiro bloco selecionado ao carregar |
| Click funciona Canvas | ⬜ | Properties atualiza ao clicar |
| Click funciona Preview | ⬜ | Highlight visual aparece |
| Auto-scroll suave | ⬜ | Bloco centraliza ao selecionar |
| Edição salva | ⬜ | Botão "Salvo" após salvar |
| Navegação steps rápida | ⬜ | < 500ms entre steps |

---

## 🚨 O QUE FAZER SE ALGO FALHAR

### Se Properties ficar vazio:
1. Abrir Console DevTools (F12)
2. Buscar por logs `[WAVE1]`
3. Verificar se `handleBlockSelect` está sendo chamado
4. Reportar erro com screenshot do console

### Se 404s ainda estiverem altos (> 10):
1. Network tab → Filtrar por 404
2. Verificar quais URLs estão falhando
3. Comparar com paths em `jsonStepLoader.ts`
4. Reportar URLs falhando

### Se TTI ainda estiver alto (> 2000ms):
1. Performance tab → Gravar novo profile
2. Buscar por "Long Tasks" (> 50ms)
3. Identificar qual componente está lento
4. Reportar com screenshot do flamegraph

---

## 📞 SUPORTE

Se encontrar problemas:
1. **Logs**: Copiar logs do console
2. **Screenshot**: Network tab mostrando 404s
3. **Métricas**: Performance tab com TTI/LCP
4. **Reportar**: Issue no GitHub com evidências

---

## 🎉 SUCESSO!

Se todos os ✅ estiverem marcados, a **WAVE 1 está 100% funcional** e o editor está pronto para uso em produção! 🚀

---

**Próximos passos**: WAVE 2 (otimizações avançadas) e WAVE 3 (monitoring + hardening)
