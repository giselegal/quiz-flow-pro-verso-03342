# ⚡ Guia Rápido - Testes E2E

## 🚀 Start Rápido (3 passos)

### 1️⃣ Iniciar o servidor
```bash
npm run dev
```

### 2️⃣ Executar todos os testes
```bash
npm run test:e2e:suites
```

### 3️⃣ Ver relatório
```bash
npx playwright show-report
```

---

## 📋 Comandos Mais Usados

```bash
# Todas as suítes
npm run test:e2e:suites

# Interface gráfica
npm run test:e2e:ui

# Suíte específica
npm run test:e2e:suite1    # Health Check (mais rápido)
npm run test:e2e:suite7    # Performance (mais demorado)

# Com browser visível
npx playwright test suite-01-app-health.spec.ts --headed

# Modo debug
npx playwright test suite-01-app-health.spec.ts --debug
```

---

## 📊 O que cada suíte testa

| Comando | O que testa | Tempo |
|---------|-------------|-------|
| `test:e2e:suite1` | ✅ App carrega sem erros | ~10s |
| `test:e2e:suite2` | 🧭 Rotas funcionam | ~15s |
| `test:e2e:suite3` | ✏️ Editor funciona | ~20s |
| `test:e2e:suite4` | 📝 Quiz funciona | ~15s |
| `test:e2e:suite5` | 💾 Storage funciona | ~12s |
| `test:e2e:suite6` | 📱 Responsivo funciona | ~25s |
| `test:e2e:suite7` | ⚡ Performance OK | ~30s |

---

## 🐛 Problemas Comuns

### ❌ "Target page has been closed"
**Causa:** Servidor não está rodando  
**Solução:**
```bash
npm run dev
```

### ❌ "Navigation timeout"
**Causa:** Porta 8080 não está respondendo  
**Solução:**
```bash
curl http://localhost:8080  # Verificar
npm run dev:clean-ports     # Limpar portas
npm run dev                 # Reiniciar
```

### ❌ Testes instáveis (flaky)
**Causa:** Carregamento lento  
**Solução:**
```bash
# Executar com timeout maior
npx playwright test --timeout=60000
```

---

## ✅ Checklist Antes de Rodar

- [ ] Servidor rodando (`npm run dev`)
- [ ] Porta 8080 acessível (`curl http://localhost:8080`)
- [ ] Dependencies instaladas (`npm install`)
- [ ] Playwright instalado (`npx playwright install`)

---

## 📈 Resultados Esperados

### ✅ Deve Passar (90%+)
- Suite 01: Health Check
- Suite 02: Routing
- Suite 05: Persistence
- Suite 06: Responsive

### ⚠️ Pode Falhar (dependem de dados)
- Suite 04: Quiz Flow (precisa de quiz válido)

### 🔧 Pode Variar
- Suite 07: Performance (depende de carga do sistema)

---

## 🎯 Para desenvolvedores

### Antes de commit
```bash
npm run test:e2e:suite1  # Quick check
```

### Antes de PR
```bash
npm run test:e2e:suites  # Full check
```

### Debugging
```bash
# Ver o que está acontecendo
npx playwright test --headed --debug

# Ver traces
npx playwright show-trace

# Screenshots
npx playwright test --screenshot=on
```

---

## 📞 Ajuda

- **Documentação completa:** `tests/e2e/README-ESTRUTURA-ATUAL.md`
- **Resumo executivo:** `tests/e2e/RESUMO-EXECUTIVO.md`
- **Playwright docs:** https://playwright.dev

---

**Pronto para começar?**
```bash
npm run test:e2e:suites
```
