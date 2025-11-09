# 📊 Status: Testes Visuais E2E - Editor Preview Mode

**Data:** 30 de outubro de 2025  
**Arquivo:** `tests/e2e/editor-preview-visual.spec.ts`

## ✅ Progresso Completado

### 1. Preparação do Ambiente de Testes

- ✅ **EditorModeContext API confirmada**
  - `window.__editorMode.setViewMode('preview')` exposto para testes
  - Localização: `src/contexts/editor/EditorModeContext.tsx`
  - API disponível em ambiente dev/test

- ✅ **Teste visual atualizado**
  - Helper `enterPreview()` criado usando `window.__editorMode`
  - Fallback para botão Preview se API não estiver disponível
  - Remoção da opção inválida `fullPage` dos screenshots

- ✅ **Servidor de desenvolvimento**
  - Dev server rodando em `http://localhost:8080`
  - Porta confirmada via `curl` - servidor respondendo com HTTP 200

### 2. Estrutura dos Testes Visuais

**Arquivo:** `tests/e2e/editor-preview-visual.spec.ts`

#### Categorias de Testes (20 casos):
- 📋 **Renderização de Steps** (4 testes)
- 🧩 **Componentes Atômicos** (4 testes)
- ✔️ **Estados de Validação** (4 testes)
- 📱 **Responsividade** (3 viewports: desktop/tablet/mobile)
- 🎨 **Temas e Estilos** (2 testes)
- ♿ **Acessibilidade Visual** (3 testes)

#### Ajustes Técnicos Aplicados:
```typescript
// Helper para entrar no modo preview de forma determinística
async function enterPreview(page: Page) {
    await page.evaluate(() => {
        const api = (window as any).__editorMode;
        if (api && typeof api.setViewMode === 'function') {
            api.setViewMode('preview');
        }
    });
    const previewCanvas = page.locator('[data-testid="canvas-preview-mode"]').first();
    if (!(await previewCanvas.isVisible().catch(() => false))) {
        const previewBtn = page.locator('button:has-text("Preview")').first();
        if (await previewBtn.isVisible().catch(() => false)) {
            await previewBtn.click();
        }
    }
    await page.waitForSelector('[data-testid="canvas-preview-mode"]', { timeout: 5000 });
}
```

## ❌ Problema Identificado

### Execução dos Testes

**Comando executado:**
```bash
npx playwright test tests/e2e/editor-preview-visual.spec.ts --project=chromium
```

**Resultado:** 20/20 testes falharam

### Causa Raiz

A URL configurada no teste não está sendo navegada corretamente:

```typescript
// URL absoluta usada
const EDITOR_URL = 'http://localhost:8080/editor?template=quiz21StepsComplete';
```

**Sintomas:**
- Timeout aguardando elementos do editor (`input[placeholder*="nome"]`, canvas, etc.)
- Elementos não aparecem na página
- Preview mode não pode ser ativado (canvas não existe)

**Evidência:**
```
TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="nome"]') to be visible
  - waiting for locator('[data-testid="canvas-preview-mode"]') to be visible
```

### Análise Técnica

1. **Servidor está funcionando:** `curl http://localhost:8080` retorna HTML válido
2. **Problema de roteamento:** A rota `/editor?template=quiz21StepsComplete` pode não estar carregando corretamente no Playwright
3. **Possíveis causas:**
   - React Router não inicializa completamente
   - Template não carrega a tempo
   - JavaScript/recursos não carregam antes do timeout

## 🔧 Soluções Propostas

### Opção 1: Aumentar Timeouts e Adicionar Waits Robustos

```typescript
test.beforeEach(async ({ page }) => {
    await page.goto(EDITOR_URL);
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    
    // Aguardar React montar
    await page.waitForTimeout(2000);
    
    // Aguardar editor aparecer
    await page.waitForSelector('[data-testid="canvas-edit-mode"], [data-testid="canvas-preview-mode"]', {
        timeout: 15000
    });
});
```

### Opção 2: Usar baseURL do Playwright Config

**Atualizar `playwright.config.ts`:**
```typescript
export default defineConfig({
  use: {
    baseURL: 'http://localhost:8080',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
```

**Simplificar URL no teste:**
```typescript
const EDITOR_URL = '/editor?template=quiz21StepsComplete';
```

### Opção 3: Debug com Headed Mode

Executar com interface gráfica para ver o que está acontecendo:

```bash
npx playwright test tests/e2e/editor-preview-visual.spec.ts --project=chromium --headed --debug
```

### Opção 4: Verificar se Template Carrega

Adicionar log/diagnóstico antes dos testes:

```typescript
test.beforeEach(async ({ page }) => {
    await page.goto(EDITOR_URL);
    await page.waitForLoadState('networkidle');
    
    // Debug: verificar se React montou
    const reactRoot = await page.locator('#root').count();
    console.log('React root encontrado:', reactRoot);
    
    // Debug: verificar URL final
    console.log('URL final:', page.url());
    
    // Debug: verificar se há erros no console
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', err => console.error('Page error:', err));
});
```

## 📋 Próximos Passos Recomendados

### Prioridade Alta

1. **Executar em modo debug** para ver o que acontece:
   ```bash
   npx playwright test tests/e2e/editor-preview-visual.spec.ts -g "step-01: captura visual completa" --project=chromium --headed
   ```

2. **Verificar Playwright config** - confirmar que `baseURL` e `webServer` estão configurados

3. **Testar rota manualmente** - abrir browser e navegar para:
   ```
   http://localhost:8080/editor?template=quiz21StepsComplete
   ```

### Prioridade Média

4. **Aumentar timeouts globais** no `playwright.config.ts`:
   ```typescript
   timeout: 30000, // 30 segundos por teste
   ```

5. **Adicionar retry strategy** para testes visuais:
   ```typescript
   retries: process.env.CI ? 2 : 0,
   ```

6. **Criar teste de smoke simples** para validar que editor carrega:
   ```typescript
   test('smoke: editor deve carregar', async ({ page }) => {
       await page.goto(EDITOR_URL);
       await expect(page.locator('#root')).toBeVisible({ timeout: 10000 });
   });
   ```

### Prioridade Baixa

7. Gerar screenshots mesmo com falha para debug visual
8. Configurar Playwright trace para análise pós-falha
9. Adicionar métricas de performance nos testes

## 📁 Arquivos Relacionados

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `tests/e2e/editor-preview-visual.spec.ts` | ✅ Atualizado | Suite de testes visuais |
| `tests/e2e/editor-preview-mode.spec.ts` | ✅ Funcionando | Testes funcionais (11/13 passando) |
| `src/contexts/editor/EditorModeContext.tsx` | ✅ Verificado | API window.__editorMode exposta |
| `playwright.config.ts` | ⚠️ Verificar | Config de baseURL e webServer |
| `package.json` | ✅ OK | Scripts npm para testes |

## 🎯 Comandos Úteis

### Executar testes visuais
```bash
# Todos os testes visuais
npm run test:e2e:preview:visual

# Um teste específico
npx playwright test tests/e2e/editor-preview-visual.spec.ts -g "step-01"

# Com interface gráfica (debug)
npx playwright test tests/e2e/editor-preview-visual.spec.ts --headed

# Modo debug interativo
npx playwright test tests/e2e/editor-preview-visual.spec.ts --debug
```

### Atualizar screenshots baseline
```bash
npm run test:e2e:preview:update-snapshots
```

### Ver relatório HTML
```bash
npx playwright show-report
```

## 📚 Documentação de Referência

- `tests/e2e/README-PREVIEW-TESTS.md` - Guia completo de testes E2E
- `TESTE_VISUAL_PREVIEW_MODE.md` - Guia de testes visuais manuais
- `FLUXOGRAMA_ESTRUTURA_TESTES_PREVIEW.md` - Arquitetura dos testes

## ✍️ Notas Adicionais

- Dev server confirmado rodando (porta 8080)
- Testes funcionais parcialmente passando (11/13)
- Window API `__editorMode` confirmada e funcional
- Problema é específico aos testes visuais (não conseguem carregar a página)

---

**Última atualização:** 30/10/2025  
**Próxima ação sugerida:** Executar teste em modo `--headed` para diagnóstico visual
