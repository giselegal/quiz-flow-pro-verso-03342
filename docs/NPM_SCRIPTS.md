# 📦 NPM Scripts - Comandos do Projeto

## 🚀 Scripts Principais

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento (porta 8080)
npm run dev

# Iniciar backend apenas (porta 3001)
npm run dev:backend

# Iniciar stack completa (backend + frontend)
npm run dev:stack
npm run dev:stack:wait  # Aguarda servidores prontos
```

### Build e Deploy

```bash
# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Build com análise de bundle
npm run build:analyze
```

### Testes

```bash
# Testes unitários (Vitest)
npm test
npm run test:watch     # Watch mode
npm run test:ui        # UI interativa
npm run test:coverage  # Cobertura de código

# Testes E2E (Playwright)
npm run test:e2e
npm run test:e2e:headed      # Ver navegador
npm run test:e2e:debug       # Modo debug
npm run test:e2e:ui          # UI interativa
npm run test:e2e:report      # Ver último relatório

# Instalar browsers Playwright
npx playwright install
```

### TypeScript

```bash
# Type checking
npm run typecheck
npm run typecheck:watch  # Watch mode
```

### Lint e Format

```bash
# ESLint
npm run lint
npm run lint:fix  # Auto-fix

# Prettier
npm run format
npm run format:check
```

---

## 📚 Scripts de Documentação

### TypeDoc

```bash
# Gerar documentação de APIs
npm run docs:generate

# Servir documentação localmente
npm run docs:serve

# Limpar docs antigas
npm run docs:clean

# Regenerar do zero
npm run docs:rebuild
```

**Configuração**: Edite `typedoc.json` para customizar.

**Output**: Documentação gerada em `docs/api/`

---

## 🧪 Scripts de Teste Específicos

### E2E por Categoria

```bash
# Teste de criação de funil
npm run test:e2e -- tests/e2e/funnel-creation.spec.ts

# Teste de importação de template
npm run test:e2e -- tests/e2e/template-import.spec.ts

# Teste de persistência Supabase
npm run test:e2e -- tests/e2e/supabase-persistence.spec.ts

# Teste de preview e publicação
npm run test:e2e -- tests/e2e/preview-publish.spec.ts

# Fluxo completo V3
npm run test:e2e:v3
```

### Testes de Integração

```bash
# Testes da Fase 3
npm run test:phase3

# Teste full quiz flow
npm run test:quiz-flow

# Testes canônicos
npm run test:canonical
```

---

## 🔧 Scripts de Manutenção

### Limpeza

```bash
# Limpar node_modules e reinstalar
npm run clean:install

# Limpar builds
npm run clean:dist

# Limpar cache do Vite
npm run clean:cache

# Limpeza completa (tudo acima)
npm run clean:all
```

### Database

```bash
# Seed database
npm run db:seed

# Reset database
npm run db:reset

# Migrations
npm run db:migrate
npm run db:migrate:up
npm run db:migrate:down
```

---

## 🎯 Scripts Customizados

### Adicionar ao package.json

Para adicionar novos scripts, **CRIE UM ARQUIVO** `scripts/package-additions.json`:

```json
{
  "scripts": {
    "docs:generate": "typedoc",
    "docs:serve": "http-server docs/api -p 8081",
    "docs:clean": "rm -rf docs/api",
    "docs:rebuild": "npm run docs:clean && npm run docs:generate",
    "test:e2e:v3": "playwright test --config=playwright.v3.config.ts",
    "test:phase3": "vitest run src/tests/phase-migrations",
    "test:quiz-flow": "vitest run src/tests/quizFlow.e2e.test.ts",
    "test:canonical": "vitest run src/__tests__/canonical-e2e-flow.test.ts",
    "clean:install": "rm -rf node_modules package-lock.json && npm install",
    "clean:dist": "rm -rf dist",
    "clean:cache": "rm -rf .vite node_modules/.vite",
    "clean:all": "npm run clean:dist && npm run clean:cache && npm run clean:install"
  }
}
```

**IMPORTANTE**: Não edite `package.json` diretamente. Use este arquivo como referência e solicite ao AI para adicionar os scripts via `lov-add-dependency`.

---

## 🚀 CI/CD Scripts

### GitHub Actions

Os seguintes scripts são executados automaticamente no CI:

```yaml
# .github/workflows/playwright.yml
- npm ci                           # Instalar deps
- npx playwright install chromium  # Instalar browser
- npm run dev:backend &            # Backend
- npm run dev &                    # Frontend
- npm run test:e2e                 # Rodar E2E
```

### Pre-commit Hooks (Husky)

```bash
# Setup husky
npm run prepare

# Pre-commit hook
npm run lint:fix && npm run typecheck
```

---

## 📊 Scripts de Análise

### Bundle Analysis

```bash
# Gerar visualização de bundle
npm run build:analyze

# Abrir relatório (dist/stats.html)
open dist/stats.html
```

### Performance

```bash
# Lighthouse CI
npm run perf:lighthouse

# Bundle size tracking
npm run perf:bundle-size
```

---

## 🐛 Scripts de Debug

### Diagnóstico

```bash
# Rodar diagnósticos do template
npm run debug:templates

# Verificar integridade do sistema
npm run debug:system

# Verificar performance
npm run debug:performance
```

### Logs

```bash
# Ativar debug logs
VITE_DEBUG_LOGS=true npm run dev

# Ativar logs de rede
VITE_ENABLE_NETWORK_INTERCEPTORS=true npm run dev
```

---

## 🎨 Scripts de Desenvolvimento

### Hot Reload

```bash
# Dev com HMR otimizado
npm run dev:fast

# Dev sem Sentry (mais rápido)
VITE_SENTRY_ENABLE_DEV=false npm run dev
```

### Staging

```bash
# Build staging (com sourcemaps)
npm run build:staging

# Preview staging
npm run preview:staging
```

---

## 📖 Exemplos Práticos

### Workflow Completo de Desenvolvimento

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar dev
npm run dev

# 3. Em outro terminal: rodar testes em watch
npm run test:watch

# 4. Fazer alterações no código

# 5. Verificar tipos
npm run typecheck

# 6. Rodar E2E antes do commit
npm run test:e2e

# 7. Build de produção
npm run build

# 8. Gerar documentação
npm run docs:generate
```

### Workflow de Deploy

```bash
# 1. Garantir que tudo está ok
npm run typecheck
npm run lint
npm test
npm run test:e2e

# 2. Build
npm run build

# 3. Preview local
npm run preview

# 4. Deploy (GitHub Actions automatiza)
git push origin main
```

---

## 🔗 Referências

- [Vite Docs](https://vitejs.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Vitest Docs](https://vitest.dev/)
- [TypeDoc Docs](https://typedoc.org/)

---

**Status**: ✅ Documentado  
**Última atualização**: 2025-01-05
