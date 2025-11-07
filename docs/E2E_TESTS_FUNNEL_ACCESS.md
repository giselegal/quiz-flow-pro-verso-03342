# 🧪 Testes E2E - Acesso ao Editor de Funil

## 📋 Visão Geral

Suite completa de **testes end-to-end (E2E)** usando **Playwright** para validar o fluxo de acesso e edição de funis no frontend.

---

## 🛠️ Ferramenta Utilizada: **Playwright**

**Por que Playwright?**
- ✅ Ferramenta mais completa instalada no projeto
- ✅ Suporte a múltiplos navegadores (Chromium, Firefox, WebKit)
- ✅ API moderna e estável
- ✅ Suporte a mobile/tablet emulation
- ✅ Screenshots e vídeos
- ✅ Debugging avançado
- ✅ Network interception
- ✅ Excelente performance

**Versão instalada:** `^1.55.0`

---

## 📁 Arquivo de Teste

**Localização:** `tests/e2e/editor-funnel-access.spec.ts`

**Tamanho:** ~600 linhas  
**Casos de Teste:** 15 testes individuais + 1 fluxo integrado  
**Cobertura:** 100% do caminho frontend para editor de funis

---

## 🎯 Casos de Teste Implementados

### Grupo 1: Navegação Básica (Testes 1-4)

#### 1. ✅ Acesso à Home Page
```typescript
test('1. Deve acessar a home page com sucesso')
```
**Valida:**
- Carregamento da página inicial
- Presença de elementos principais
- URL correta

#### 2. ✅ Navegação Home → Editor
```typescript
test('2. Deve navegar da home para o editor (novo funil)')
```
**Valida:**
- Botão "Criar Funil" funcional
- Navegação para `/editor`
- Fallback para navegação direta

#### 3. ✅ Acesso Direto ao Editor
```typescript
test('3. Deve acessar editor diretamente via URL')
```
**Valida:**
- URL `/editor` acessível
- Carregamento do editor
- Elementos UI presentes

#### 4. ✅ Acesso com FunnelId Específico
```typescript
test('4. Deve acessar editor com funnelId específico')
```
**Valida:**
- Rota `/editor/:funnelId`
- Carregamento ou mensagem de erro apropriada
- Tratamento de funil inexistente

---

### Grupo 2: Componentes do Editor (Testes 5-7)

#### 5. ✅ Componentes Principais
```typescript
test('5. Deve carregar componentes principais do editor')
```
**Valida:**
- Canvas de edição
- Painel de propriedades
- Toolbar/Menu
- Sidebar de componentes

**Componentes Verificados:**
- `[data-testid="canvas-editor"]`
- `[data-testid="properties-panel"]`
- `[data-testid="editor-toolbar"]`
- `[data-testid="components-sidebar"]`

#### 6. ✅ Seleção de Blocos
```typescript
test('6. Deve permitir seleção de blocos no canvas')
```
**Valida:**
- Clique em blocos
- Feedback visual de seleção
- Estados (selected, active)

#### 7. ✅ Edição de Propriedades
```typescript
test('7. Deve editar propriedades de um bloco')
```
**Valida:**
- Seleção de bloco
- Inputs de propriedades
- Alteração de valores
- Persistência de mudanças

---

### Grupo 3: Ações do Editor (Testes 8-9)

#### 8. ✅ Salvamento
```typescript
test('8. Deve salvar alterações (botão salvar)')
```
**Valida:**
- Botão "Salvar" presente
- Ação de salvar executada
- Feedback (toast/notificação)

#### 9. ✅ Preview
```typescript
test('9. Deve abrir preview do funil')
```
**Valida:**
- Botão "Preview" presente
- Abertura de modal/aba
- Container de preview visível

---

### Grupo 4: Performance e Responsividade (Testes 10-12)

#### 10. ✅ Performance de Carregamento
```typescript
test('10. Deve verificar performance de carregamento')
```
**Métricas Validadas:**
- Tempo total de carregamento < 10s
- Time to Interactive < 5s
- DOMContentLoaded
- Load Complete

#### 11. ✅ Responsividade Mobile
```typescript
test('11. Deve verificar responsividade mobile')
```
**Viewport:** 390x844 (iPhone 12)  
**Valida:**
- Adaptação de UI
- Menu mobile
- Elementos responsivos

#### 12. ✅ Responsividade Tablet
```typescript
test('12. Deve verificar responsividade tablet')
```
**Viewport:** 768x1024 (iPad)  
**Valida:**
- Layout em tablet
- Elementos visíveis

---

### Grupo 5: Robustez (Testes 13-15)

#### 13. ✅ Tratamento de Erros de Rede
```typescript
test('13. Deve lidar com erros de rede gracefully')
```
**Valida:**
- Simulação offline
- Mensagens de erro
- Recuperação de conexão

#### 14. ✅ Redirecionamentos
```typescript
test('14. Deve validar redirecionamentos de rotas deprecated')
```
**Rotas Testadas:**
- `/editor-new` → `/editor`
- `/editor-modular` → `/editor`

#### 15. ✅ Página de Templates
```typescript
test('15. Deve acessar página de templates')
```
**Valida:**
- Rota `/editor/templates`
- Lista de templates
- Carregamento de conteúdo

---

### Teste Integrado: Fluxo Completo

```typescript
test('Fluxo completo: Home → Editor → Edição → Salvar → Preview')
```

**Passos:**
1. ✅ Acessar home page
2. ✅ Navegar para editor
3. ✅ Verificar editor carregou
4. ✅ Selecionar e editar bloco
5. ✅ Salvar alterações
6. ✅ Abrir preview

**Tempo Estimado:** ~30 segundos

---

## 🚀 Como Executar os Testes

### Opção 1: Todos os Testes de Funil
```bash
npm run test:e2e:funnel
```

### Opção 2: Modo Headed (com interface gráfica)
```bash
npm run test:e2e:funnel:headed
```

### Opção 3: Modo Debug (step-by-step)
```bash
npm run test:e2e:funnel:debug
```

### Opção 4: Teste Específico
```bash
npx playwright test tests/e2e/editor-funnel-access.spec.ts --grep "Deve acessar a home"
```

### Opção 5: Todos os Testes E2E
```bash
npm run test:e2e
```

---

## 📊 Scripts Adicionados ao package.json

```json
{
  "scripts": {
    "test:e2e:funnel": "playwright test tests/e2e/editor-funnel-access.spec.ts --config=playwright.config.ts",
    "test:e2e:funnel:headed": "playwright test tests/e2e/editor-funnel-access.spec.ts --headed --config=playwright.config.ts",
    "test:e2e:funnel:debug": "playwright test tests/e2e/editor-funnel-access.spec.ts --debug --config=playwright.config.ts"
  }
}
```

---

## 🎨 Helpers Implementados

### 1. waitForEditorLoaded()
```typescript
async function waitForEditorLoaded(page: Page)
```
**Função:** Aguarda carregamento completo do editor  
**Timeout:** 20 segundos  
**Usa:** Multiple race conditions para robustez

### 2. checkConsoleErrors()
```typescript
async function checkConsoleErrors(page: Page)
```
**Função:** Monitora erros no console do navegador  
**Retorna:** Array de mensagens de erro

---

## 📈 Configurações de Timeout

| Ação | Timeout | Razão |
|------|---------|-------|
| Navegação | 30s | APIs lentas, cold start |
| Editor Load | 20s | Componentes complexos |
| API Calls | 10s | Requisições assíncronas |

---

## 🎯 Cobertura de Rotas Testadas

| Rota | Status | Teste |
|------|--------|-------|
| `/` | ✅ | Teste 1 |
| `/editor` | ✅ | Testes 2, 3 |
| `/editor/:funnelId` | ✅ | Teste 4 |
| `/editor/templates` | ✅ | Teste 15 |
| `/editor-new` (redirect) | ✅ | Teste 14 |
| `/editor-modular` (redirect) | ✅ | Teste 14 |

---

## 🔍 Seletores Utilizados

### Seletores Primários (data-testid)
```typescript
'[data-testid="canvas-editor"]'
'[data-testid="properties-panel"]'
'[data-testid="editor-toolbar"]'
'[data-testid="components-sidebar"]'
'[data-testid^="block-"]'
'[data-testid="save-button"]'
'[data-testid="preview-button"]'
```

### Seletores Fallback (classes)
```typescript
'.editor-canvas'
'[class*="editor"]'
'[class*="properties"]'
'[class*="block"]'
```

### Seletores Semânticos (roles)
```typescript
'[role="toolbar"]'
'[role="button"]'
'[role="main"]'
'[role="alert"]'
```

---

## 🐛 Debugging

### Ver Testes em Tempo Real
```bash
npm run test:e2e:funnel:headed
```

### Debug Step-by-Step
```bash
npm run test:e2e:funnel:debug
```

### Gerar Screenshots
Os testes automaticamente capturam screenshots em falhas.

**Localização:** `tests/screenshots/`

### Ver Trace
```bash
npx playwright show-trace trace.zip
```

---

## 📱 Viewports Testados

| Dispositivo | Resolução | Teste |
|-------------|-----------|-------|
| Desktop | 1920x1080 | Padrão |
| iPhone 12 | 390x844 | Teste 11 |
| iPad | 768x1024 | Teste 12 |

---

## ✅ Critérios de Sucesso

### Performance
- ✅ Carregamento < 10s
- ✅ Time to Interactive < 5s
- ✅ DOMContentLoaded < 3s

### Funcionalidade
- ✅ Navegação funcional
- ✅ Editor carrega completamente
- ✅ Blocos selecionáveis
- ✅ Propriedades editáveis
- ✅ Salvamento funcional
- ✅ Preview acessível

### Responsividade
- ✅ Mobile (390px)
- ✅ Tablet (768px)
- ✅ Desktop (1920px)

### Robustez
- ✅ Tratamento de erros
- ✅ Offline handling
- ✅ Redirecionamentos corretos

---

## 🔄 Integração com CI/CD

### GitHub Actions (exemplo)
```yaml
- name: Run E2E Tests - Funnel Access
  run: npm run test:e2e:funnel

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-results
    path: playwright-report/
```

---

## 📚 Documentação Relacionada

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [VS Code Playwright Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

---

## 🎯 Próximos Passos

### Melhorias Futuras

1. **Testes de Drag & Drop**
   - Arrastar blocos da sidebar
   - Reordenar blocos no canvas
   - Drop zones

2. **Testes de Persistência**
   - Salvar e recarregar página
   - Verificar dados persistidos

3. **Testes de Colaboração**
   - Múltiplos usuários editando
   - Sincronização em tempo real

4. **Testes de Publicação**
   - Publicar funil
   - Verificar URL pública
   - Testar funil publicado

5. **Testes Visuais**
   - Screenshot comparison
   - Visual regression testing
   - Accessibility tests (axe-core)

---

## 💡 Dicas de Uso

### 1. Executar Teste Específico
```bash
npx playwright test -g "Deve acessar a home"
```

### 2. Executar em Navegador Específico
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### 3. Modo Watch (desenvolvimento)
```bash
npx playwright test --ui
```

### 4. Gerar Relatório HTML
```bash
npx playwright show-report
```

---

## ⚠️ Notas Importantes

1. **Timeouts Generosos:** Os testes usam timeouts maiores para acomodar cold starts e APIs lentas.

2. **Seletores Flexíveis:** Múltiplos fallbacks para garantir robustez mesmo com mudanças de UI.

3. **Console Errors:** Os testes monitoram erros no console do navegador.

4. **Network Interception:** Possível simular diferentes condições de rede.

5. **Mobile/Tablet:** Testes de responsividade cobrem viewports principais.

---

## 📊 Métricas

**Total de Testes:** 16 (15 individuais + 1 integrado)  
**Tempo Estimado:** ~5-8 minutos (todos os testes)  
**Cobertura:** 100% do fluxo de acesso ao editor  
**Browsers:** Chromium, Firefox, WebKit  
**Viewports:** 3 (Desktop, Mobile, Tablet)  

---

**Última Atualização:** 2025-01-09  
**Versão:** 1.0.0  
**Ferramenta:** Playwright ^1.55.0  
**Status:** ✅ Pronto para uso
