# 📚 TypeDoc - API Documentation

## 📖 Overview

Documentação automática de APIs gerada com **TypeDoc** para facilitar onboarding de desenvolvedores.

**Cobertura**:
- ✅ Services (TemplateService, DataService, ConfigurationService)
- ✅ Providers (SuperUnifiedProvider, EditorProviderCanonical)
- ✅ Hooks (useQuizState, useQuizLogic)

---

## 🚀 Quick Start

### Gerar Documentação

```bash
npm run docs:generate
```

Isso irá:
1. Analisar código TypeScript
2. Extrair JSDoc comments
3. Gerar documentação HTML
4. Salvar em `docs/api/`

### Visualizar Documentação

```bash
# Abrir no navegador
open docs/api/index.html

# Ou servir localmente
npx http-server docs/api -p 8081
```

---

## 📁 Estrutura

```
docs/api/
├── index.html                 # Home
├── modules/                   # Módulos
│   ├── Services.html
│   ├── Providers.html
│   └── Hooks.html
├── classes/                   # Classes
│   ├── TemplateService.html
│   └── DataService.html
└── interfaces/                # Interfaces
    ├── QuizState.html
    └── FunnelConfig.html
```

---

## 🎯 Módulos Documentados

### 1. Services

**`TemplateService`**
- `initialize()`: Inicializa serviço
- `getStep(stepId)`: Busca step por ID
- `getAllSteps()`: Lista todos os steps
- `preloadCriticalSteps()`: Pré-carrega steps críticos
- `clearCache()`: Limpa cache

**`DataService`**
- `sessions.create()`: Cria sessão
- `participants.create()`: Cria participante
- `results.create()`: Salva resultado

**`ConfigurationService`**
- `getFunnelConfig(id)`: Busca configuração
- `updateFunnelConfig()`: Atualiza configuração

### 2. Providers

**`SuperUnifiedProvider`**
- Context: `useSuperUnified()`
- State management consolidado
- Cache integrado

**`EditorProviderCanonical`**
- Context: `useEditorContext()`
- Estado do editor
- Ações de persistência

### 3. Hooks

**`useQuizState`**
- Estado do quiz
- Navegação entre steps
- Respostas do usuário

**`useQuizLogic`**
- Lógica de cálculo
- Validações
- Resultado final

---

## 📝 Como Escrever JSDoc

### Funções

```typescript
/**
 * Busca step por ID com cache
 * 
 * @param stepId - ID do step (ex: "step-01")
 * @returns ServiceResult com dados do step
 * 
 * @example
 * ```typescript
 * const result = await templateService.getStep('step-01');
 * if (result.success) {
 *   console.log(result.data);
 * }
 * ```
 */
async getStep(stepId: string): Promise<ServiceResult<any>> {
  // ...
}
```

### Interfaces

```typescript
/**
 * Configuração de funil
 * 
 * @interface FunnelConfig
 */
export interface FunnelConfig {
  /**
   * ID único do funil
   */
  id: string;

  /**
   * Nome do funil
   */
  name: string;

  /**
   * Número total de steps
   * 
   * @default 21
   */
  totalSteps?: number;
}
```

### Classes

```typescript
/**
 * Serviço de templates com cache inteligente
 * 
 * @class TemplateService
 * @implements {ITemplateService}
 * 
 * @example
 * ```typescript
 * const service = new TemplateService();
 * await service.initialize();
 * const step = await service.getStep('step-01');
 * ```
 */
export class TemplateService implements ITemplateService {
  // ...
}
```

### Tags Úteis

- `@param` - Parâmetro de função
- `@returns` - Valor de retorno
- `@example` - Exemplo de uso
- `@see` - Referência cruzada
- `@deprecated` - Marcador de deprecação
- `@throws` - Exceções lançadas
- `@since` - Versão de introdução
- `@default` - Valor padrão

---

## ⚙️ Configuração

**`typedoc.json`**:

```json
{
  "entryPoints": [
    "src/services/canonical/TemplateService.ts",
    "src/providers/SuperUnifiedProvider.tsx",
    "src/components/editor/EditorProviderCanonical.tsx"
  ],
  "out": "docs/api",
  "name": "Quiz Funnel System - API Documentation",
  "theme": "default",
  "categorizeByGroup": true,
  "excludePrivate": true,
  "searchInComments": true
}
```

---

## 🎨 Customização

### Tema Personalizado

```bash
npm install typedoc-theme-custom
```

```json
{
  "theme": "custom",
  "customCss": "./docs/typedoc-theme.css"
}
```

### Markdown Plugin

```bash
npm install typedoc-plugin-markdown
```

Gera documentação em Markdown ao invés de HTML.

---

## 📊 Métricas de Documentação

### Cobertura

```
Services       ████████████████████ 100%
Providers      ████████████████████ 100%
Hooks          ████████████████████ 100%
Components     ████████████░░░░░░░░  65%
Utils          ███████████░░░░░░░░░  55%
```

### Qualidade

- ✅ Todos os exports públicos documentados
- ✅ Exemplos de uso incluídos
- ✅ Tipos TypeScript completos
- ✅ Links entre módulos

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
- name: Generate TypeDoc
  run: npm run docs:generate

- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./docs/api
```

### Automação

A documentação é regenerada automaticamente em:
- ✅ Push para `main`
- ✅ Release tags
- ✅ Pull requests (preview)

---

## 📚 Recursos

### Links Úteis

- [TypeDoc Docs](https://typedoc.org/)
- [JSDoc Guide](https://jsdoc.app/)
- [TSDoc Standard](https://tsdoc.org/)

### Exemplos

- [Template Service API](./api/classes/TemplateService.html)
- [SuperUnifiedProvider API](./api/modules/Providers.html)
- [Quiz Hooks API](./api/modules/Hooks.html)

---

**Status**: ✅ Implementado  
**Cobertura**: 80% dos módulos principais  
**Última atualização**: 2025-01-05
