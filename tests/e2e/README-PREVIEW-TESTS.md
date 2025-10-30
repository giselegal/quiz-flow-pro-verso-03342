# 🧪 Testes Visuais Automatizados - Modo PREVIEW

## Visão Geral

Suite completa de testes end-to-end (E2E) e visuais para validar o modo PREVIEW do editor usando Playwright.

## Estrutura dos Testes

```
tests/e2e/
├── editor-preview-mode.spec.ts      # Testes funcionais (navegação, validações)
└── editor-preview-visual.spec.ts    # Testes visuais (screenshots, regressão)
```

## Pré-requisitos

```bash
# Instalar Playwright (se ainda não instalado)
npm install -D @playwright/test

# Instalar browsers
npx playwright install
```

## Executar Testes

### Todos os testes do modo PREVIEW

```bash
npx playwright test tests/e2e/editor-preview-mode.spec.ts
npx playwright test tests/e2e/editor-preview-visual.spec.ts
```

### Testes específicos

```bash
# Apenas testes de navegação
npx playwright test tests/e2e/editor-preview-mode.spec.ts -g "Navegação"

# Apenas testes de validação
npx playwright test tests/e2e/editor-preview-mode.spec.ts -g "Validação"

# Apenas testes visuais de step-01
npx playwright test tests/e2e/editor-preview-visual.spec.ts -g "step-01"
```

### Modo Debug (com UI)

```bash
# Debug interativo
npx playwright test tests/e2e/editor-preview-mode.spec.ts --debug

# Modo headed (ver browser)
npx playwright test tests/e2e/editor-preview-mode.spec.ts --headed

# Slow motion para visualizar melhor
npx playwright test tests/e2e/editor-preview-mode.spec.ts --headed --slow-mo=1000
```

### Atualizar Screenshots Base

Quando a UI muda intencionalmente e você quer atualizar os screenshots de referência:

```bash
npx playwright test tests/e2e/editor-preview-visual.spec.ts --update-snapshots
```

## Cobertura dos Testes

### 📋 Testes Funcionais (editor-preview-mode.spec.ts)

#### TC1: Validação de Renderização Inicial
- ✅ Renderiza step-01 com logo, título e formulário
- ✅ Não mostra "Virtualização ativa" no step-20

#### TC2: Alternância Edit ↔ Preview
- ✅ Alterna do modo Edit para Preview
- ✅ Alterna de Preview de volta para Edit
- ✅ Mantém estado ao alternar entre modos

#### TC3: Navegação e Validação de Formulário
- ✅ Valida campo de nome obrigatório no step-01
- ✅ Navega para step-02 após preencher nome

#### TC4: Validação de Seleções
- ✅ Exige 3 seleções no step-02 (minSelections=3)
- ✅ Navega para step-03 após selecionar 3 opções
- ✅ Permite voltar para step-01

#### TC5: Renderização Step-20 (Resultado)
- ✅ Renderiza todos os blocos atômicos do resultado
- ✅ Exibe emoji de celebração
- ✅ Mostra estilo predominante e porcentagem
- ✅ Sem virtualização ativa

#### TC6: Performance e Carregamento
- ✅ Não "pisca" ao carregar steps
- ✅ Carrega step-01 em menos de 3 segundos

### 🎨 Testes Visuais (editor-preview-visual.spec.ts)

#### Renderização de Steps
- ✅ Step-01: captura visual completa (edit mode)
- ✅ Step-01: modo preview
- ✅ Step-02: grid de opções com imagens
- ✅ Step-02: opções selecionadas (estado visual)

#### Componentes Atômicos
- ✅ intro-logo: renderização do logo
- ✅ intro-title: título com HTML inline
- ✅ progress-bar: barra de progresso
- ✅ navigation-buttons: botões de navegação

#### Estados de Validação
- ✅ Formulário: campo vazio (estado inicial)
- ✅ Formulário: campo preenchido
- ✅ Botão desabilitado: sem seleções suficientes
- ✅ Botão habilitado: validação satisfeita

#### Responsividade
- ✅ Step-01 em desktop (1920x1080)
- ✅ Step-01 em tablet (768x1024)
- ✅ Step-01 em mobile (375x667)

#### Temas e Estilos
- ✅ Modo claro: renderização padrão
- ✅ Cores de marca: verificação visual

#### Acessibilidade Visual
- ✅ Contraste: botão primário
- ✅ Tamanho de fonte: legibilidade
- ✅ Espaçamento: toque em mobile

## Relatórios

### HTML Report (recomendado)

```bash
# Gerar e abrir relatório HTML
npx playwright test tests/e2e/editor-preview-*.spec.ts
npx playwright show-report
```

### JSON Report

```bash
npx playwright test tests/e2e/editor-preview-*.spec.ts --reporter=json > test-results.json
```

### Trace Viewer (debug avançado)

```bash
# Executar com tracing
npx playwright test tests/e2e/editor-preview-mode.spec.ts --trace on

# Visualizar trace
npx playwright show-trace trace.zip
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests - Preview Mode
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run dev &
      - run: npx playwright test tests/e2e/editor-preview-*.spec.ts
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Boas Práticas

### 1. Aguardar Elementos
```typescript
// ✅ Bom: aguardar elemento específico
await page.locator('button:has-text("Preview")').waitFor({ state: 'visible' });

// ❌ Ruim: timeout arbitrário
await page.waitForTimeout(5000);
```

### 2. Seletores Estáveis
```typescript
// ✅ Bom: data-testid ou role
await page.locator('[data-testid="canvas-preview-mode"]')
await page.getByRole('button', { name: 'Preview' })

// ❌ Ruim: classes CSS que podem mudar
await page.locator('.btn-primary.preview-btn')
```

### 3. Asserções Robustas
```typescript
// ✅ Bom: verificar visibilidade com timeout
await expect(page.locator('text=/Resultado/i')).toBeVisible({ timeout: 5000 });

// ❌ Ruim: verificar existência sem timeout
expect(await page.locator('text=/Resultado/i').count()).toBe(1);
```

### 4. Testes Independentes
```typescript
// ✅ Bom: cada teste configura seu próprio estado
test('teste A', async ({ page }) => {
  await setupPreviewMode(page);
  // test A
});

test('teste B', async ({ page }) => {
  await setupPreviewMode(page);
  // test B
});

// ❌ Ruim: testes dependem de ordem
test('teste A', () => { /* setup */ });
test('teste B', () => { /* usa estado de A */ });
```

## Troubleshooting

### Testes Falhando

1. **Elemento não encontrado**
   ```bash
   # Executar com UI para debug
   npx playwright test --debug
   ```

2. **Screenshots diferentes**
   ```bash
   # Atualizar screenshots base
   npx playwright test --update-snapshots
   ```

3. **Timeout**
   ```typescript
   // Aumentar timeout para operações lentas
   await page.locator('button').click({ timeout: 10000 });
   ```

### Performance

1. **Testes lentos**
   - Usar `page.waitForLoadState('networkidle')` apenas quando necessário
   - Preferir `waitFor({ state: 'visible' })` para elementos específicos
   - Executar testes em paralelo: `npx playwright test --workers=4`

2. **Muitos screenshots**
   - Limitar screenshots apenas para casos críticos
   - Usar `maxDiffPixels` para tolerar pequenas diferenças

## Manutenção

### Adicionar Novo Teste

1. Identificar funcionalidade a testar
2. Escrever teste em `editor-preview-mode.spec.ts` (funcional) ou `editor-preview-visual.spec.ts` (visual)
3. Usar helpers existentes (`completeQuestionStep`, `navigateToStep`)
4. Executar teste: `npx playwright test --grep "nome do teste"`
5. Validar resultado

### Atualizar Teste Existente

1. Localizar teste em `tests/e2e/editor-preview-*.spec.ts`
2. Modificar conforme necessário
3. Executar teste específico para validar
4. Atualizar snapshots se necessário: `--update-snapshots`
5. Commitar mudanças

## Métricas

- **Cobertura**: 6 test suites, ~50 test cases
- **Tempo de Execução**: ~3-5 minutos (modo preview completo)
- **Flakiness**: < 5% (target)
- **Manutenibilidade**: Alta (seletores estáveis, helpers reutilizáveis)

## Recursos Adicionais

- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)

## Suporte

Para questões ou problemas, consulte:
- Documentação do projeto: `/TESTE_VISUAL_PREVIEW_MODE.md`
- Issues do GitHub
- Canal #testes no Slack
