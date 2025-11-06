# 🎨 Setup de Testes de Regressão Visual

## Scripts NPM a Adicionar

Adicione os seguintes scripts ao `package.json`:

```json
{
  "scripts": {
    "test:e2e:visual": "playwright test quiz21-visual",
    "test:e2e:visual:update": "playwright test quiz21-visual --update-snapshots",
    "test:e2e:visual:components": "playwright test quiz21-visual-components",
    "test:e2e:visual:mobile": "playwright test quiz21-visual --project='Mobile Chrome'",
    "test:e2e:visual:all": "playwright test quiz21-visual quiz21-visual-components"
  }
}
```

## 🚀 Primeiros Passos

### 1. Instalar Playwright (se ainda não instalado)
```bash
npm install -D @playwright/test
npx playwright install
```

### 2. Criar Screenshots Baseline (Primeira Vez)
```bash
# Criar todos os baselines
npm run test:e2e:visual:update

# Ou usar comando direto
npx playwright test quiz21-visual --update-snapshots
```

Isso criará a pasta:
```
tests/e2e/quiz21-visual-regression.spec.ts-snapshots/
├── chromium-linux/
│   ├── step-01-intro-full.png
│   ├── step-01-intro-viewport.png
│   ├── step-02-question-full.png
│   └── ...
└── mobile/
    ├── step-01-mobile.png
    └── ...
```

### 3. Commitar Baselines
```bash
git add tests/e2e/**/*-snapshots/
git commit -m "feat: add visual regression baselines for quiz 21 steps"
```

### 4. Executar Testes (Comparar)
```bash
# Comparar com baseline
npm run test:e2e:visual

# Ou
npx playwright test quiz21-visual
```

## 📊 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npx playwright test quiz21-visual` | Executar testes de regressão visual |
| `npx playwright test quiz21-visual --update-snapshots` | Atualizar screenshots baseline |
| `npx playwright test quiz21-visual --project=chromium` | Apenas Chrome |
| `npx playwright test quiz21-visual --project=firefox` | Apenas Firefox |
| `npx playwright test quiz21-visual --project=webkit` | Apenas Safari |
| `npx playwright test quiz21-visual-components` | Apenas componentes |
| `npx playwright test quiz21-visual --headed` | Ver navegador durante testes |
| `npx playwright test quiz21-visual --debug` | Modo debug |
| `npx playwright show-report` | Ver relatório HTML |

## 🔄 Workflow Diário

### Durante Desenvolvimento
```bash
# 1. Fazer alterações no código
# 2. Executar testes visuais
npm run test:e2e:visual

# 3a. Se falhar por mudança intencional:
npm run test:e2e:visual:update

# 3b. Se falhar por bug:
# - Corrigir o código
# - Executar novamente
```

### Antes de Commit
```bash
# Garantir que nenhuma regressão visual foi introduzida
npm run test:e2e:visual

# Se tudo passar, fazer commit
git add .
git commit -m "feat: nova feature"
```

### Em Pull Requests
```bash
# CI executará automaticamente
npx playwright test quiz21-visual

# Se houver diferenças:
# 1. Revisar no relatório do CI
# 2. Se intencional, atualizar baselines no PR
# 3. Se bug, corrigir e commitar novamente
```

## 📸 Estrutura de Testes

### Testes Principais
**Arquivo**: `tests/e2e/quiz21-visual-regression.spec.ts`

- ✅ Step 01 (Intro) - Full + Viewport
- ✅ Steps 02-11 (Questions) - Full + Viewport cada
- ✅ Step 12 (Transition) - Full + Viewport
- ✅ Steps 13-18 (Strategic) - Full + Viewport cada
- ✅ Step 19 (Transition Result) - Full + Viewport
- ✅ Step 20 (Result) - Full + Viewport
- ✅ Step 21 (Offer) - Full + Viewport
- ✅ Todos os Steps em Sequência
- ✅ Mobile Snapshots

**Total**: ~60 screenshots

### Testes de Componentes
**Arquivo**: `tests/e2e/quiz21-visual-components.spec.ts`

- ✅ Barra de progresso
- ✅ Options grid
- ✅ Opção não selecionada
- ✅ Opção selecionada
- ✅ Botões de navegação
- ✅ Título de pergunta
- ✅ Loading spinner
- ✅ Card de resultado
- ✅ Lista de benefícios
- ✅ CTA button

**Total**: ~10 screenshots

## 🎯 Configuração

### Threshold de Diferença
```typescript
// Em quiz21-visual-regression.spec.ts
const PIXEL_THRESHOLD = 0.2; // 20% de diferença aceitável
```

Ajustar conforme necessidade:
- Mais rigoroso: `0.1` (10%)
- Mais permissivo: `0.3` (30%)

### Viewport
```typescript
const VIEWPORT = { width: 1280, height: 720 }; // Desktop
const MOBILE_VIEWPORT = { width: 375, height: 667 }; // Mobile
```

## 🐛 Troubleshooting

### Teste falhando com diferenças mínimas
```bash
# Aumentar threshold no arquivo de teste
# ou aceitar diferença como baseline
npm run test:e2e:visual:update
```

### Screenshots inconsistentes
```bash
# Garantir que animações estão desabilitadas
# Verificar no código do teste:
animations: 'disabled'
```

### Testes muito lentos
```bash
# Executar apenas alguns steps
npx playwright test quiz21-visual -g "Step 01"

# Ou executar em paralelo
npx playwright test quiz21-visual --workers=4
```

### CI falhando mas local passando
```bash
# Diferenças de OS (Linux vs Mac vs Windows)
# Solução: usar Docker no CI para consistência
# ou aumentar threshold
```

## 📈 Integração CI/CD

### GitHub Actions
Criar arquivo `.github/workflows/visual-tests.yml`:

```yaml
name: Visual Regression Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run visual regression tests
        run: npx playwright test quiz21-visual --project=chromium
      
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
      
      - name: Upload failed screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: failed-screenshots
          path: test-results/
          retention-days: 7
```

## ✅ Checklist de Setup

- [ ] Playwright instalado: `npx playwright install`
- [ ] Scripts adicionados ao `package.json`
- [ ] Baselines criados: `npm run test:e2e:visual:update`
- [ ] Baselines commitados no git
- [ ] Testes executando: `npm run test:e2e:visual`
- [ ] CI configurado (opcional)
- [ ] Documentação lida: `tests/e2e/README-VISUAL-REGRESSION.md`

## 🔗 Links Úteis

- [Playwright Visual Testing](https://playwright.dev/docs/test-snapshots)
- [Testes de Regressão Visual - README](../tests/e2e/README-VISUAL-REGRESSION.md)
- [Quiz 21 Template](../src/templates/quiz21StepsComplete.ts)
