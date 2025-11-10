# 🧪 Testes E2E - Quiz Flow Pro

Documentação completa da suite de testes End-to-End (E2E) do projeto Quiz Flow Pro.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura dos Testes](#estrutura-dos-testes)
- [Como Executar](#como-executar)
- [Testes Disponíveis](#testes-disponíveis)
- [Configuração](#configuração)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

Esta suite de testes E2E valida o comportamento completo da aplicação do ponto de vista do usuário, testando:

- ✅ Navegação entre páginas
- ✅ Fluxo completo do quiz (21 etapas)
- ✅ Editor de funis
- ✅ Dashboard administrativo
- ✅ Integrações com APIs e persistência de dados
- ✅ Responsividade
- ✅ Performance
- ✅ Acessibilidade básica

## 📁 Estrutura dos Testes

```
tests/e2e/
├── 00-main-suite.spec.ts          # 🎯 Suite principal (orquestrador)
├── 01-navigation-flow.spec.ts     # 🧭 Testes de navegação
├── 02-quiz-complete-flow.spec.ts  # 🎯 Fluxo completo do quiz
├── 03-editor-functionality.spec.ts # 📝 Funcionalidades do editor
├── 04-admin-dashboard.spec.ts     # 🏢 Dashboard administrativo
├── 05-integrations-apis.spec.ts   # 🔌 Integrações e APIs
└── README.md                      # 📖 Esta documentação
```

## 🚀 Como Executar

### Pré-requisitos

1. **Instalar dependências** (se ainda não instalou):
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   O servidor deve estar rodando em `http://localhost:8080`

### Executar Todos os Testes

```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar em modo headless (sem interface)
npm run test:e2e -- --headed=false

# Executar com UI do Playwright
npx playwright test --ui
```

### Executar Testes Específicos

```bash
# Suite principal apenas
npm run test:e2e -- tests/e2e/00-main-suite.spec.ts

# Testes de navegação
npm run test:e2e -- tests/e2e/01-navigation-flow.spec.ts

# Fluxo completo do quiz
npm run test:e2e -- tests/e2e/02-quiz-complete-flow.spec.ts

# Editor
npm run test:e2e -- tests/e2e/03-editor-functionality.spec.ts

# Admin Dashboard
npm run test:e2e -- tests/e2e/04-admin-dashboard.spec.ts

# Integrações
npm run test:e2e -- tests/e2e/05-integrations-apis.spec.ts
```

### Executar em Modo Debug

```bash
# Debug com Playwright Inspector
npx playwright test --debug

# Debug de teste específico
npx playwright test tests/e2e/02-quiz-complete-flow.spec.ts --debug
```

### Executar em Diferentes Navegadores

```bash
# Chromium (padrão)
npm run test:e2e -- --project=chromium

# Firefox
npm run test:e2e -- --project=firefox

# WebKit (Safari)
npm run test:e2e -- --project=webkit

# Todos os navegadores
npm run test:e2e -- --project=chromium --project=firefox --project=webkit
```

## 📊 Testes Disponíveis

### 00 - Main Suite (Suite Principal)
**Arquivo:** `00-main-suite.spec.ts`

Testes gerais e validação de infraestrutura:
- ✅ Servidor está rodando
- ✅ Rotas principais acessíveis
- ✅ Estrutura HTML válida
- ✅ Meta tags para SEO
- ✅ Recursos estáticos carregam corretamente
- ✅ Performance aceitável
- ✅ Acessibilidade básica
- ✅ Responsividade
- ✅ Console sem erros críticos
- ✅ Relatório de cobertura

**Executar:** `npm run test:e2e -- tests/e2e/00-main-suite.spec.ts`

---

### 01 - Navigation Flow (Fluxo de Navegação)
**Arquivo:** `01-navigation-flow.spec.ts`

Testes de navegação entre páginas:
- ✅ Carregamento da home
- ✅ Navegação para editor
- ✅ Navegação para quiz
- ✅ Navegação para admin
- ✅ Fluxo completo de navegação
- ✅ Rotas dinâmicas (quiz/:id, editor/:id)
- ✅ Tratamento de 404
- ✅ Links internos funcionais
- ✅ Performance de carregamento

**Executar:** `npm run test:e2e -- tests/e2e/01-navigation-flow.spec.ts`

---

### 02 - Quiz Complete Flow (Fluxo do Quiz)
**Arquivo:** `02-quiz-complete-flow.spec.ts`

Testes do quiz de 21 etapas:
- ✅ Carregamento do quiz
- ✅ Barra de progresso
- ✅ Captura de lead (etapa 1)
- ✅ Navegação pelas questões
- ✅ Voltar para questão anterior
- ✅ Completar quiz e ver resultado
- ✅ Validação de campos obrigatórios
- ✅ Persistência de respostas
- ✅ Percorrer todas as 21 etapas

**Executar:** `npm run test:e2e -- tests/e2e/02-quiz-complete-flow.spec.ts`

---

### 03 - Editor Functionality (Editor de Funis)
**Arquivo:** `03-editor-functionality.spec.ts`

Testes do editor:
- ✅ Carregamento do editor
- ✅ Lista de etapas
- ✅ Seleção de etapa
- ✅ Área de edição de conteúdo
- ✅ Edição de texto
- ✅ Adicionar novo bloco
- ✅ Salvar alterações
- ✅ Preview
- ✅ Criar novo funil
- ✅ Carregar template de 21 etapas
- ✅ Carregar funil por ID
- ✅ Persistência de alterações
- ✅ Responsividade (mobile/tablet)

**Executar:** `npm run test:e2e -- tests/e2e/03-editor-functionality.spec.ts`

---

### 04 - Admin Dashboard (Painel Administrativo)
**Arquivo:** `04-admin-dashboard.spec.ts`

Testes do dashboard:
- ✅ Carregamento do dashboard
- ✅ Título e cabeçalho
- ✅ Menu de navegação lateral
- ✅ Links funcionais
- ✅ Seção de overview/resumo
- ✅ Métricas e estatísticas
- ✅ Gestão de funis
- ✅ Listar funis existentes
- ✅ Botão de criar funil
- ✅ Filtro/busca de funis
- ✅ Seção de analytics
- ✅ Gráficos e visualizações
- ✅ Configurações
- ✅ Responsividade
- ✅ Acesso ao editor
- ✅ Preview de funis

**Executar:** `npm run test:e2e -- tests/e2e/04-admin-dashboard.spec.ts`

---

### 05 - Integrations & APIs (Integrações)
**Arquivo:** `05-integrations-apis.spec.ts`

Testes de integrações:
- ✅ LocalStorage (salvar/carregar/persistir)
- ✅ IndexedDB (disponibilidade/databases)
- ✅ Requisições de rede (APIs)
- ✅ Tratamento de erros de rede
- ✅ Respostas de API
- ✅ Supabase (configuração/requisições)
- ✅ Gestão de estado do quiz
- ✅ Limpar estado ao reiniciar
- ✅ Cookies e sessão
- ✅ Service Workers
- ✅ Analytics e tracking
- ✅ Performance e cache
- ✅ Tempos de resposta

**Executar:** `npm run test:e2e -- tests/e2e/05-integrations-apis.spec.ts`

## ⚙️ Configuração

### Playwright Config

O arquivo `playwright.config.ts` já está configurado com:

```typescript
{
  testDir: './tests/e2e',
  baseURL: 'http://localhost:8080',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
    { name: 'Mobile Chrome' },
    { name: 'Mobile Safari' }
  ]
}
```

### Variáveis de Ambiente

Certifique-se de que o arquivo `.env` está configurado corretamente:

```bash
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

## 🔍 Troubleshooting

### Problema: Servidor não está rodando

**Solução:**
```bash
# Terminal 1 - Iniciar servidor
npm run dev

# Terminal 2 - Executar testes
npm run test:e2e
```

### Problema: Testes falhando com timeout

**Solução:**
```bash
# Aumentar timeout
npx playwright test --timeout=60000

# Ou editar playwright.config.ts
```

### Problema: Modal de startup interferindo

Os testes incluem helper para fechar modais automaticamente. Se necessário, ajustar o helper `closeStartupModal()`.

### Problema: Elementos não encontrados

**Verificar:**
1. Servidor está rodando?
2. Rota correta?
3. Elementos têm os data-testids esperados?

**Debug:**
```bash
# Executar com --headed para ver o navegador
npm run test:e2e -- --headed

# Executar com --debug para pausar
npx playwright test --debug tests/e2e/02-quiz-complete-flow.spec.ts
```

### Problema: Testes lentos

**Otimizações:**
```bash
# Executar apenas no Chromium
npm run test:e2e -- --project=chromium

# Executar testes específicos
npm run test:e2e -- tests/e2e/01-navigation-flow.spec.ts

# Desabilitar headed mode
npm run test:e2e -- --headed=false
```

## 📈 Relatórios

### Gerar Relatório HTML

```bash
# Executar testes e gerar relatório
npm run test:e2e

# Abrir relatório
npx playwright show-report
```

### Screenshots e Vídeos

Por padrão, Playwright captura:
- Screenshots em falhas
- Vídeos (quando configurado)
- Traces (para debug)

Encontre em: `test-results/` e `playwright-report/`

## 🎯 Cobertura Atual

### Por Categoria

| Categoria | Testes | Status |
|-----------|--------|--------|
| Navegação | 10 | ✅ |
| Quiz (21 etapas) | 10 | ✅ |
| Editor | 10 | ✅ |
| Admin Dashboard | 8 | ✅ |
| Integrações/APIs | 12 | ✅ |
| **Total** | **~50** | ✅ |

### Cobertura Estimada

- 🛣️ **Rotas:** ~100%
- 🧩 **Componentes:** ~80%
- 👤 **Fluxos de Usuário:** ~90%

## 🚀 Integração Contínua (CI)

### GitHub Actions

Para configurar no CI, adicione ao `.github/workflows/`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run dev &
      - run: npx wait-on http://localhost:8080
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 Recursos Adicionais

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices for E2E Testing](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)

## 🤝 Contribuindo

Para adicionar novos testes:

1. Criar arquivo na pasta `tests/e2e/`
2. Nomear como `XX-feature-name.spec.ts`
3. Seguir estrutura dos testes existentes
4. Incluir comentários descritivos
5. Adicionar documentação aqui

## 📝 Notas

- Testes são resilientes e buscam elementos de múltiplas formas
- Helpers incluídos para ações comuns (fechar modal, buscar botões, etc)
- Console logs informativos para facilitar debug
- Suporte para diferentes viewports (mobile, tablet, desktop)

---

**Última atualização:** 2025-11-10
**Versão:** 1.0.0
**Mantido por:** Equipe Quiz Flow Pro
