# 🧪 Testes E2E - Estrutura Atual

Suíte completa de testes End-to-End para validação da estrutura atual do Quiz Flow Pro.

## 📋 Suítes de Teste

### 🏥 Suite 01: App Health
**Arquivo:** `suite-01-app-health.spec.ts`

Testes fundamentais de saúde da aplicação:
- ✅ Aplicação inicializa sem erros críticos
- ✅ Recursos estáticos carregam corretamente
- ✅ Tempo de carregamento aceitável
- ✅ Elementos React montados
- ✅ Meta tags essenciais presentes
- ✅ Elementos interativos funcionais

**Execução:**
```bash
npm run test:e2e -- suite-01-app-health.spec.ts
```

---

### 🧭 Suite 02: Sistema de Rotas
**Arquivo:** `suite-02-routing.spec.ts`

Validação do sistema de roteamento:
- ✅ Página inicial carrega
- ✅ Rota /editor acessível
- ✅ Rota /quiz funcional
- ✅ Rotas admin protegidas
- ✅ Navegação entre páginas
- ✅ URLs inválidas tratadas
- ✅ Query parameters preservados
- ✅ Botão voltar do browser funciona

**Execução:**
```bash
npm run test:e2e -- suite-02-routing.spec.ts
```

---

### ✏️ Suite 03: Editor de Quiz
**Arquivo:** `suite-03-editor.spec.ts`

Testes do editor de quiz:
- ✅ Editor carrega com interface principal
- ✅ Toolbar/menu de controles visível
- ✅ Botões de ação presentes
- ✅ Interação com elementos
- ✅ Área de trabalho/canvas presente
- ✅ Não trava em loading
- ✅ Responsivo ao redimensionamento
- ✅ Performance aceitável

**Execução:**
```bash
npm run test:e2e -- suite-03-editor.spec.ts
```

---

### 📝 Suite 04: Fluxo do Quiz
**Arquivo:** `suite-04-quiz-flow.spec.ts`

Testes do fluxo completo de quiz:
- ✅ Página de quiz acessível
- ✅ Navegação via home para quiz
- ✅ Interface do quiz renderizada
- ✅ Navegação entre perguntas
- ✅ Seleção de respostas
- ✅ Indicador de progresso
- ✅ Estado mantido entre navegações
- ✅ Quiz não encontrado tratado

**Execução:**
```bash
npm run test:e2e -- suite-04-quiz-flow.spec.ts
```

---

### 💾 Suite 05: Persistência de Dados
**Arquivo:** `suite-05-data-persistence.spec.ts`

Testes de storage e persistência:
- ✅ LocalStorage funcional
- ✅ SessionStorage funcional
- ✅ Dados persistem após refresh
- ✅ Chamadas de rede funcionam
- ✅ Recuperação de falhas de rede
- ✅ Cookies habilitados
- ✅ Limpeza de dados funciona
- ✅ Limite de storage respeitado

**Execução:**
```bash
npm run test:e2e -- suite-05-data-persistence.spec.ts
```

---

### 📱 Suite 06: Responsividade
**Arquivo:** `suite-06-responsive.spec.ts`

Testes em múltiplos dispositivos:
- ✅ Desktop large (1920x1080)
- ✅ Desktop medium (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile small (375x667)
- ✅ Mobile large (414x896)
- ✅ Mudança de orientação
- ✅ Elementos clicáveis em touch
- ✅ Texto legível em mobile
- ✅ Navegação mobile funcional
- ✅ Performance em mobile

**Execução:**
```bash
npm run test:e2e -- suite-06-responsive.spec.ts
```

---

### ⚡ Suite 07: Performance
**Arquivo:** `suite-07-performance.spec.ts`

Testes de performance e otimização:
- ✅ First Contentful Paint < 2s
- ✅ DOM Content Loaded < 1s
- ✅ Load Event < 2s
- ✅ Recursos JavaScript otimizados
- ✅ Recursos CSS otimizados
- ✅ Número razoável de requisições
- ✅ Uso de memória aceitável
- ✅ Cumulative Layout Shift < 0.25
- ✅ Sem memory leaks
- ✅ Performance de scroll suave

**Execução:**
```bash
npm run test:e2e -- suite-07-performance.spec.ts
```

---

## 🚀 Execução dos Testes

### Pré-requisitos

1. **Servidor de desenvolvimento rodando:**
```bash
npm run dev
# ou
npm run dev:stack
```

2. **Verificar que a aplicação está acessível:**
```bash
curl http://localhost:8080
```

### Comandos de Execução

#### Executar TODAS as suítes
```bash
npm run test:e2e:suites
```

#### Executar suíte específica
```bash
# Suite 01 - Health Check
npm run test:e2e:suite1

# Suite 02 - Routing
npm run test:e2e:suite2

# Suite 03 - Editor
npm run test:e2e:suite3

# Suite 04 - Quiz Flow
npm run test:e2e:suite4

# Suite 05 - Data Persistence
npm run test:e2e:suite5

# Suite 06 - Responsive
npm run test:e2e:suite6

# Suite 07 - Performance
npm run test:e2e:suite7
```

#### Executar com UI interativa
```bash
npm run test:e2e:ui
```

#### Executar com modo headed (ver o browser)
```bash
npm run test:e2e -- suite-01-app-health.spec.ts --headed
```

#### Executar em modo debug
```bash
npm run test:e2e -- suite-01-app-health.spec.ts --debug
```

#### Executar em browser específico
```bash
# Chromium
npm run test:e2e -- suite-01-app-health.spec.ts --project=chromium

# Firefox
npm run test:e2e -- suite-01-app-health.spec.ts --project=firefox

# WebKit (Safari)
npm run test:e2e -- suite-01-app-health.spec.ts --project=webkit

# Mobile
npm run test:e2e -- suite-01-app-health.spec.ts --project="Mobile Chrome"
```

---

## 📊 Relatórios

### Ver relatório HTML
```bash
npx playwright show-report
```

### Gerar relatório JSON
```bash
npm run test:e2e -- --reporter=json > test-results.json
```

### Ver traces de testes falhados
```bash
npx playwright show-trace trace.zip
```

---

## 🔧 Configuração

A configuração do Playwright está em `playwright.config.ts`:

- **baseURL:** `http://localhost:8080`
- **timeout:** 30s por teste
- **retries:** 2x em CI, 0 em local
- **browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **trace:** Habilitado em retry
- **screenshots:** Em falhas

---

## 📝 Estrutura dos Testes

Cada suíte segue este padrão:

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
const TIMEOUT = 15000;

test.describe('🔬 Nome da Suíte', () => {

    test('deve fazer X', async ({ page }) => {
        await page.goto(BASE_URL);
        // ... assertions
        console.log('✅ Teste passou');
    });

});
```

---

## 🐛 Troubleshooting

### Erro: "Target page, context or browser has been closed"
**Solução:** Aumentar timeout ou verificar se a aplicação não está crashando
```bash
npm run test:e2e -- suite-01-app-health.spec.ts --timeout=60000
```

### Erro: "Navigation timeout of 30000ms exceeded"
**Solução:** Verificar se o servidor está rodando
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:e2e
```

### Erro: "Timeout waiting for selector"
**Solução:** Aumentar timeout ou verificar seletor
```typescript
await expect(element).toBeVisible({ timeout: 15000 });
```

### Tests flaky (instáveis)
**Solução:** Adicionar waits estratégicos
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);
```

---

## 📈 Métricas de Sucesso

### Critérios de Aprovação

- ✅ **Health Check:** 100% dos testes passando
- ✅ **Routing:** 90% dos testes passando
- ✅ **Editor:** 85% dos testes passando
- ✅ **Quiz Flow:** 80% dos testes passando (depende de dados)
- ✅ **Persistence:** 100% dos testes passando
- ✅ **Responsive:** 90% dos testes passando
- ✅ **Performance:** 80% dos testes passando

### Performance Targets

- **FCP (First Contentful Paint):** < 2s
- **DCL (DOM Content Loaded):** < 1s
- **Load Event:** < 2s
- **CLS (Cumulative Layout Shift):** < 0.25
- **Memória JS:** < 100MB inicial

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
- name: Run E2E Tests
  run: |
    npm run dev &
    sleep 10
    npm run test:e2e:suites
```

### Netlify CI

```toml
[build.environment]
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "0"

[[plugins]]
  package = "@netlify/plugin-playwright"
```

---

## 📚 Recursos

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging](https://playwright.dev/docs/debug)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)

---

## 🤝 Contribuindo

Para adicionar novos testes:

1. Criar arquivo: `suite-XX-nome.spec.ts`
2. Seguir padrão de estrutura
3. Adicionar documentação neste README
4. Adicionar comando no `package.json`
5. Testar localmente antes de commit

---

## 📊 Status dos Testes

| Suíte | Status | Cobertura | Tempo Médio |
|-------|--------|-----------|-------------|
| 01 - App Health | ✅ | 100% | ~10s |
| 02 - Routing | ✅ | 95% | ~15s |
| 03 - Editor | ✅ | 90% | ~20s |
| 04 - Quiz Flow | ⚠️ | 80% | ~15s |
| 05 - Persistence | ✅ | 100% | ~12s |
| 06 - Responsive | ✅ | 95% | ~25s |
| 07 - Performance | ✅ | 85% | ~30s |

**Legenda:**
- ✅ Todos os testes passando
- ⚠️ Alguns testes dependem de dados específicos
- ❌ Testes falhando (requer investigação)

---

## 📞 Suporte

Para problemas com os testes E2E:

1. Verificar logs: `npm run test:e2e -- --reporter=list`
2. Executar em modo debug: `npm run test:e2e -- --debug`
3. Ver traces: `npx playwright show-trace`
4. Consultar documentação do Playwright

---

**Última atualização:** Novembro 2025
**Versão:** 1.0.0
**Mantido por:** Equipe Quiz Flow Pro
