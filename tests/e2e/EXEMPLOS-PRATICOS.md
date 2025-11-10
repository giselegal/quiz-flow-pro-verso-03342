# 💡 Exemplos Práticos - Testes E2E

## 🎯 Casos de Uso Comuns

### 1. Verificar se a aplicação está saudável

```bash
# Execução rápida (~10s)
npm run test:e2e:suite1
```

**O que faz:**
- ✅ Verifica se o app carrega sem erros
- ✅ Confirma que recursos (JS/CSS) carregam
- ✅ Valida tempo de carregamento
- ✅ Testa elementos interativos

**Quando usar:**
- Antes de começar desenvolvimento
- Após fazer deploy
- Debug de problemas de carregamento

---

### 2. Testar uma nova feature no editor

```bash
# Executar testes do editor
npm run test:e2e:suite3
```

**O que faz:**
- ✅ Verifica que o editor carrega
- ✅ Testa toolbar e controles
- ✅ Valida área de trabalho
- ✅ Testa responsividade

**Quando usar:**
- Após modificar componentes do editor
- Antes de mergear PR do editor
- Debug de problemas de UI

---

### 3. Verificar performance após otimização

```bash
# Executar testes de performance
npm run test:e2e:suite7
```

**O que faz:**
- ⚡ Mede First Contentful Paint
- ⚡ Verifica DOM Content Loaded
- ⚡ Analisa uso de memória
- ⚡ Detecta layout shifts
- ⚡ Identifica memory leaks

**Quando usar:**
- Após otimizações de código
- Quando suspeitar de memory leaks
- Comparar antes/depois de mudanças

---

### 4. Validar responsividade

```bash
# Testes em múltiplos dispositivos
npm run test:e2e:suite6
```

**O que faz:**
- 📱 Testa em mobile (375px, 414px)
- 💻 Testa em desktop (1366px, 1920px)
- 📟 Testa em tablet (768px)
- 🔄 Testa mudança de orientação
- 👆 Valida elementos touch

**Quando usar:**
- Após mudanças de CSS
- Antes de lançar versão mobile
- Debug de problemas de layout

---

### 5. Debug de problema específico

```bash
# Modo debug interativo
npx playwright test suite-01-app-health.spec.ts --debug
```

**Como funciona:**
1. Abre o Playwright Inspector
2. Executa passo a passo
3. Inspeciona elementos
4. Vê estado da página

**Comandos no debugger:**
- `F10` - Próxima linha
- `F8` - Continuar
- `F9` - Pausar em breakpoint
- Hover - Ver valores

---

### 6. Ver o que está acontecendo

```bash
# Executar com browser visível
npx playwright test suite-03-editor.spec.ts --headed
```

**Mostra:**
- 🌐 Browser real abrindo
- 👀 Cada ação acontecendo
- 🖱️ Cliques e navegação
- ⏱️ Timing real

**Quando usar:**
- Entender fluxo do teste
- Ver onde está falhando
- Validar comportamento visual

---

### 7. Testar em browser específico

```bash
# Apenas Chrome
npx playwright test --project=chromium

# Apenas Firefox
npx playwright test --project=firefox

# Apenas Safari (WebKit)
npx playwright test --project=webkit

# Mobile
npx playwright test --project="Mobile Chrome"
```

**Quando usar:**
- Bug específico de browser
- Validar cross-browser
- Teste de compatibilidade

---

### 8. Capturar screenshots

```bash
# Screenshots em falhas
npx playwright test --screenshot=only-on-failure

# Screenshots sempre
npx playwright test --screenshot=on

# Screenshots em pasta específica
npx playwright test --output=./test-results
```

**Screenshots salvos em:**
- `test-results/` por padrão
- Organizados por teste
- Include timestamp

---

### 9. Ver relatório de execução anterior

```bash
# Abrir último relatório
npx playwright show-report

# Relatório em porta específica
npx playwright show-report --port 9999
```

**No relatório você vê:**
- ✅ Testes que passaram
- ❌ Testes que falharam
- ⏱️ Tempo de execução
- 📸 Screenshots
- 📊 Traces

---

### 10. Executar testes em CI/CD

```bash
# GitHub Actions / Netlify
#!/bin/bash

# Iniciar servidor em background
npm run dev &
SERVER_PID=$!

# Aguardar servidor iniciar
sleep 10

# Executar testes
npm run test:e2e:suites

# Salvar código de saída
EXIT_CODE=$?

# Matar servidor
kill $SERVER_PID

# Sair com código apropriado
exit $EXIT_CODE
```

---

## 🔍 Cenários de Troubleshooting

### Cenário 1: "Testes passam local, falham em CI"

**Investigação:**
```bash
# 1. Verificar timeouts
npx playwright test --timeout=60000

# 2. Executar com traces
npx playwright test --trace=on

# 3. Ver screenshots
npx playwright test --screenshot=on
```

**Possíveis causas:**
- CI mais lento
- Recursos não carregam a tempo
- Dados de teste ausentes

---

### Cenário 2: "Editor não carrega nos testes"

**Debug passo a passo:**
```bash
# 1. Ver se servidor responde
curl http://localhost:8080/editor

# 2. Executar com browser visível
npx playwright test suite-03-editor.spec.ts --headed

# 3. Ver console errors
npx playwright test suite-03-editor.spec.ts --debug
```

**Verificar:**
- Rota `/editor` existe
- Componente renderiza
- Não há erros JavaScript

---

### Cenário 3: "Performance ruim nos testes"

**Análise:**
```bash
# 1. Executar testes de performance
npm run test:e2e:suite7

# 2. Ver métricas detalhadas
npx playwright test suite-07-performance.spec.ts --reporter=html

# 3. Comparar antes/depois
# (executar antes de mudanças, salvar relatório)
# (executar depois de mudanças, comparar)
```

**Métricas importantes:**
- FCP < 2s
- Memory < 100MB
- CLS < 0.25

---

### Cenário 4: "Teste flaky (às vezes passa, às vezes falha)"

**Soluções:**
```typescript
// ❌ Evitar: Timeout fixo
await page.waitForTimeout(1000);

// ✅ Melhor: Aguardar condição
await page.waitForLoadState('networkidle');

// ✅ Melhor: Aguardar elemento
await page.waitForSelector('.editor-loaded');

// ✅ Melhor: Com timeout customizado
await expect(element).toBeVisible({ timeout: 15000 });
```

---

## 📊 Análise de Resultados

### Interpretar output do teste

```bash
Running 30 tests using 8 workers
  ✅ [chromium] › suite-01-app-health.spec.ts:20 (2.3s)
  ✅ [firefox] › suite-01-app-health.spec.ts:20 (3.1s)
  ❌ [webkit] › suite-01-app-health.spec.ts:80 (5.2s)
  ⊘ [Mobile Chrome] › suite-01-app-health.spec.ts:94 (skipped)

  1 failed
    [webkit] › suite-01-app-health.spec.ts:80 › deve ter elementos React

  29 passed (1.2m)
```

**O que significa:**
- ✅ = Passou
- ❌ = Falhou
- ⊘ = Pulado (skip)
- Tempo entre parênteses
- Total no final

---

### Ver detalhes de falha

```bash
# No terminal
npx playwright test --reporter=list

# HTML (mais detalhado)
npx playwright show-report

# JSON (para processamento)
npx playwright test --reporter=json > results.json
```

---

## 🎓 Próximos Passos

### Adicionar seu próprio teste

```typescript
// tests/e2e/meu-teste.spec.ts
import { test, expect } from '@playwright/test';

test('minha funcionalidade', async ({ page }) => {
    await page.goto('http://localhost:8080');
    
    // Seu código aqui
    const button = page.locator('button.meu-botao');
    await button.click();
    
    // Verificar resultado
    await expect(page.locator('.resultado')).toContainText('Sucesso');
});
```

### Executar:
```bash
npx playwright test meu-teste.spec.ts
```

---

## 📚 Recursos Úteis

- **Seletores:** https://playwright.dev/docs/selectors
- **Assertions:** https://playwright.dev/docs/test-assertions
- **Best Practices:** https://playwright.dev/docs/best-practices
- **API Reference:** https://playwright.dev/docs/api/class-playwright

---

## 🤝 Dicas Finais

1. **Sempre aguarde elementos carregarem**
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

2. **Use seletores robustos**
   ```typescript
   // ❌ Frágil
   page.locator('div > div > button')
   
   // ✅ Robusto
   page.locator('[data-testid="submit-button"]')
   ```

3. **Teste comportamento, não implementação**
   ```typescript
   // ✅ Bom - testa resultado
   await expect(page.locator('.result')).toContainText('Sucesso');
   
   // ❌ Ruim - testa implementação interna
   // await expect(page.locator('.hidden-state')).toHaveClass('active');
   ```

4. **Mantenha testes independentes**
   ```typescript
   // Cada teste deve poder rodar sozinho
   test.beforeEach(async ({ page }) => {
       await page.goto('http://localhost:8080');
       // Setup necessário
   });
   ```

---

**Happy Testing! 🎉**
