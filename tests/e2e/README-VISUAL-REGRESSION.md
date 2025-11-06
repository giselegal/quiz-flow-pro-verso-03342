# 🎨 Visual Regression Testing - Quiz 21 Steps

Testes de regressão visual automatizados para detectar mudanças não intencionais na UI do quiz.

## 📸 O Que São Testes de Regressão Visual?

Testes de regressão visual capturam **screenshots** de cada parte da aplicação e os comparam com **screenshots de referência** (baseline). Se houver diferenças significativas, o teste falha, indicando uma possível regressão visual.

### Vantagens:
- ✅ Detecta mudanças visuais não intencionais automaticamente
- ✅ Previne quebras de layout e CSS
- ✅ Documenta visualmente o estado da aplicação
- ✅ Valida consistência entre navegadores
- ✅ Garante que alterações de código não afetam outras páginas

## 📁 Arquivos de Teste

### 1. `quiz21-visual-regression.spec.ts`
Testa cada um dos 21 steps do quiz completo:
- Step 01 (Intro)
- Steps 02-11 (Questions)
- Step 12 (Transition)
- Steps 13-18 (Strategic Questions)
- Step 19 (Transition Result)
- Step 20 (Result)
- Step 21 (Offer)

**Screenshots capturados:**
- Full page (página inteira com scroll)
- Viewport (apenas área visível)
- Desktop e Mobile

### 2. `quiz21-visual-components.spec.ts`
Testa componentes individuais isoladamente:
- Barra de progresso
- Options grid
- Opção não selecionada
- Opção selecionada
- Botões de navegação
- Título de pergunta
- Loading spinner
- Card de resultado
- Lista de benefícios
- CTA button

## 🚀 Como Executar

### Primeira Execução (Criar Baseline)
```bash
# Criar screenshots de referência (baseline)
npx playwright test quiz21-visual --update-snapshots
```

Isso criará os screenshots baseline em:
- `tests/e2e/quiz21-visual-regression.spec.ts-snapshots/`

### Execuções Seguintes (Comparar com Baseline)
```bash
# Comparar com baseline existente
npx playwright test quiz21-visual
```

Se houver diferenças, o teste falhará e mostrará:
- Qual screenshot difere
- Percentual de diferença
- Diff visual (lado a lado)

### Atualizar Baseline (Após Mudanças Intencionais)
```bash
# Atualizar screenshots de referência
npx playwright test quiz21-visual --update-snapshots

# Ou usar comando npm
npm run test:e2e:update-snapshots
```

### Executar Apenas Steps Específicos
```bash
# Apenas Step 01
npx playwright test quiz21-visual -g "Step 01"

# Apenas Steps de perguntas
npx playwright test quiz21-visual -g "Questions"

# Apenas componentes
npx playwright test quiz21-visual-components
```

### Executar em Navegador Específico
```bash
npx playwright test quiz21-visual --project=chromium
npx playwright test quiz21-visual --project=firefox
npx playwright test quiz21-visual --project=webkit
```

### Modo Debug
```bash
npx playwright test quiz21-visual --debug
```

## 📊 Configuração de Thresholds

### Threshold de Diferença
```typescript
const PIXEL_THRESHOLD = 0.2; // 20% de diferença é aceitável
```

Ajuste conforme necessário:
- `0.0` = Pixels devem ser idênticos (muito rigoroso)
- `0.1` = 10% de diferença aceitável
- `0.2` = 20% de diferença aceitável (padrão)
- `0.3` = 30% de diferença aceitável (mais permissivo)

### Max Diff Pixels
```typescript
maxDiffPixels: 100 // Até 100 pixels diferentes são OK
```

## 🔍 Analisando Falhas

Quando um teste de regressão visual falha:

### 1. Ver Relatório HTML
```bash
npx playwright show-report
```

### 2. Verificar Diff
O relatório mostrará:
- Screenshot esperado (baseline)
- Screenshot atual (received)
- Diff visual (diferenças destacadas)

### 3. Decidir Ação
**Se a diferença é intencional** (nova feature, design atualizado):
```bash
npx playwright test quiz21-visual --update-snapshots
```

**Se a diferença é um bug** (regressão):
- Corrija o código
- Execute novamente os testes
- Verifique que agora passa

## 📸 Estrutura de Screenshots

```
tests/e2e/
├── quiz21-visual-regression.spec.ts-snapshots/
│   ├── chromium-linux/
│   │   ├── step-01-intro-full.png
│   │   ├── step-01-intro-viewport.png
│   │   ├── step-02-question-full.png
│   │   ├── ...
│   │   ├── step-21-offer-full.png
│   │   └── all-steps/
│   │       ├── step-01-intro.png
│   │       ├── step-02-question.png
│   │       └── ...
│   ├── mobile/
│   │   ├── step-01-mobile.png
│   │   ├── step-02-mobile.png
│   │   └── ...
│   └── components/
│       ├── progress-bar.png
│       ├── options-grid.png
│       ├── option-selected.png
│       └── ...
└── screenshots/ (screenshots de debug)
```

## 🎯 Melhores Práticas

### 1. Desabilitar Animações
```typescript
await expect(page).toHaveScreenshot('test.png', {
  animations: 'disabled', // ✅ Garante consistência
});
```

### 2. Aguardar Carregamento Completo
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000); // Aguardar animações iniciais
```

### 3. Usar Viewport Consistente
```typescript
const VIEWPORT = { width: 1280, height: 720 }; // ✅ Sempre o mesmo
```

### 4. Executar em CI
```bash
# No CI, sempre comparar - nunca atualizar
npx playwright test quiz21-visual
```

### 5. Commitar Screenshots Baseline
```bash
# Adicionar ao git
git add tests/e2e/**/*-snapshots/
git commit -m "chore: update visual regression baselines"
```

## 🐛 Troubleshooting

### Testes Falhando por Diferenças Mínimas
**Problema**: Pequenas diferenças de font rendering entre OS

**Solução**: Aumentar threshold
```typescript
threshold: 0.3 // Mais permissivo
```

### Screenshots Inconsistentes
**Problema**: Animações ou loading states

**Solução**: Desabilitar animações e aguardar loading
```typescript
animations: 'disabled',
await page.waitForLoadState('networkidle');
```

### Testes Muito Lentos
**Problema**: Capturar fullPage de 21 steps demora muito

**Solução**: Usar apenas viewport ou executar em paralelo
```typescript
fullPage: false, // Mais rápido
```

Ou dividir testes:
```bash
# Executar steps em paralelo
npx playwright test quiz21-visual --workers=4
```

### Diff Mostrando Diferenças em Timestamps
**Problema**: Data/hora dinâmica mudando entre execuções

**Solução**: Mockar timestamps ou mascarar área
```typescript
await page.addStyleTag({
  content: '.timestamp { visibility: hidden; }'
});
```

## 📈 Métricas

### Cobertura Visual
- ✅ 21 steps completos (full page + viewport)
- ✅ 10+ componentes individuais
- ✅ Desktop + Mobile
- ✅ Total: ~60 screenshots baseline

### Performance
- Desktop screenshots: ~2-3s cada
- Mobile screenshots: ~2-3s cada
- Teste completo: ~4 minutos

## 🔗 Integração CI/CD

### GitHub Actions
```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run visual regression tests
        run: npx playwright test quiz21-visual
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 🎓 Quando Atualizar Baselines

### ✅ ATUALIZAR quando:
- Nova feature visual foi adicionada intencionalmente
- Design foi atualizado (nova cor, layout, tipografia)
- Componente foi melhorado visualmente
- Bug visual foi corrigido

### ❌ NÃO ATUALIZAR quando:
- Teste falhou e você não sabe porquê
- Há diferenças pequenas mas você não alterou o código
- Você quer "forçar" o teste a passar
- CI está falhando mas local está passando

**Regra de ouro**: Se você não fez mudanças intencionais na UI, NÃO atualize os baselines. Investigue a causa da diferença primeiro.

## 🔗 Links Úteis

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [CI/CD Integration](https://playwright.dev/docs/ci)
- [Quiz 21 Template](../../src/templates/quiz21StepsComplete.ts)
