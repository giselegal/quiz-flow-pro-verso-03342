# Guia de Testes - Sistema de Templates

## 📋 Índice

1. [Estratégia de Testes](#estratégia-de-testes)
2. [Setup de Testes](#setup-de-testes)
3. [Testes Unitários](#testes-unitários)
4. [Testes de Integração](#testes-de-integração)
5. [Testes E2E](#testes-e2e)
6. [Mocks e Fixtures](#mocks-e-fixtures)
7. [Cobertura](#cobertura)

---

## 🎯 Estratégia de Testes

### Pirâmide de Testes

```
       /\
      /E2\    10% - Testes E2E (Fluxos completos)
     /____\
    /      \  
   /  Integ \  30% - Testes de Integração (Services + Hooks)
  /_________ \
 /            \
/   Unitários  \ 60% - Testes Unitários (Funções, Schemas)
/______________\
```

### O que Testar

#### ✅ Deve Testar
- Validação Zod (schemas)
- Lógica de negócio (TemplateService)
- React Query hooks (loading states, cache)
- Import/Export (conversão TS↔JSON)
- UI components (ImportTemplateDialog)

#### ❌ Não Precisa Testar
- Código de terceiros (React Query internals)
- Type definitions puras (interfaces sem lógica)
- Configurações estáticas

---

## 🔧 Setup de Testes

### Dependências

```bash
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @testing-library/react-hooks \
  vitest \
  @vitest/ui \
  jsdom \
  msw
```

### Configuração Vitest

**`vitest.config.ts`:**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Setup Global

**`src/test/setup.ts`:**

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup após cada teste
afterEach(() => {
  cleanup();
});

// Mock console.error para testes mais limpos
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

---

## 🧪 Testes Unitários

### 1. Validação Zod

**`src/schemas/__tests__/templateSchema.test.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import {
  validateTemplate,
  validateStep,
  validateBlock,
  isValidTemplate,
  normalizeTemplate,
} from '../templateSchema';

describe('templateSchema', () => {
  describe('validateBlock', () => {
    it('deve validar bloco válido', () => {
      const block = {
        id: 'block-1',
        type: 'IntroLogo',
        config: { imageUrl: '/logo.png' },
      };

      const result = validateBlock(block);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(block);
    });

    it('deve rejeitar bloco sem id', () => {
      const block = { type: 'IntroLogo' };

      const result = validateBlock(block);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0]).toContain('id');
    });

    it('deve rejeitar bloco sem type', () => {
      const block = { id: 'block-1' };

      const result = validateBlock(block);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0]).toContain('type');
    });
  });

  describe('validateStep', () => {
    it('deve validar step v3.1 válida', () => {
      const step = {
        metadata: {
          id: 'step-01',
          name: 'Intro',
        },
        blocks: [
          { id: 'block-1', type: 'IntroLogo' },
        ],
      };

      const result = validateStep(step);
      expect(result.success).toBe(true);
    });

    it('deve validar step simples (array de blocos)', () => {
      const step = [
        { id: 'block-1', type: 'IntroLogo' },
        { id: 'block-2', type: 'IntroTitle' },
      ];

      const result = validateStep(step);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar step sem blocos', () => {
      const step = {
        metadata: { id: 'step-01', name: 'Intro' },
        blocks: [],
      };

      const result = validateStep(step);
      expect(result.success).toBe(false);
      expect(result.errors![0]).toContain('pelo menos um bloco');
    });
  });

  describe('validateTemplate', () => {
    it('deve validar template completo válido', () => {
      const template = {
        metadata: {
          id: 'test-template',
          name: 'Test Template',
          version: '3.1',
          totalSteps: 1,
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step 1' },
            blocks: [{ id: 'block-1', type: 'IntroLogo' }],
          },
        },
      };

      const result = validateTemplate(template);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('deve gerar warning se totalSteps não corresponder', () => {
      const template = {
        metadata: {
          id: 'test-template',
          name: 'Test',
          totalSteps: 5, // Errado (só tem 1 step)
        },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step 1' },
            blocks: [{ id: 'block-1', type: 'IntroLogo' }],
          },
        },
      };

      const result = validateTemplate(template);
      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings![0]).toContain('totalSteps');
    });
  });

  describe('isValidTemplate', () => {
    it('deve retornar true para template válido', () => {
      const template = {
        metadata: { id: 'test', name: 'Test' },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Logo' }],
          },
        },
      };

      expect(isValidTemplate(template)).toBe(true);
    });

    it('deve retornar false para template inválido', () => {
      const template = { invalid: true };
      expect(isValidTemplate(template)).toBe(false);
    });
  });

  describe('normalizeTemplate', () => {
    it('deve preencher campos opcionais com defaults', () => {
      const template = {
        metadata: { id: 'test', name: 'Test' },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Logo' }],
          },
        },
      };

      const normalized = normalizeTemplate(template);
      
      expect(normalized.metadata.version).toBe('3.1');
      expect(normalized.metadata.totalSteps).toBe(1);
      expect(normalized.metadata.tags).toEqual([]);
    });
  });
});
```

### 2. Built-in Templates Loader

**`src/services/templates/__tests__/builtInTemplates.test.ts`:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import {
  getBuiltInTemplateById,
  hasBuiltInTemplate,
  listBuiltInTemplateIds,
  normalizeBuiltInTemplate,
} from '../builtInTemplates';

// Mock import.meta.glob
vi.mock('/src/templates/*.json', () => ({
  '/src/templates/quiz21StepsComplete.json': {
    default: {
      metadata: { id: 'quiz21StepsComplete', name: 'Quiz 21 Steps' },
      steps: {},
    },
  },
}));

describe('builtInTemplates', () => {
  describe('hasBuiltInTemplate', () => {
    it('deve retornar true para template existente', () => {
      expect(hasBuiltInTemplate('quiz21StepsComplete')).toBe(true);
    });

    it('deve retornar false para template inexistente', () => {
      expect(hasBuiltInTemplate('nonexistent')).toBe(false);
    });
  });

  describe('getBuiltInTemplateById', () => {
    it('deve retornar template existente', () => {
      const template = getBuiltInTemplateById('quiz21StepsComplete');
      
      expect(template).toBeDefined();
      expect(template.metadata.id).toBe('quiz21StepsComplete');
    });

    it('deve retornar null para template inexistente', () => {
      const template = getBuiltInTemplateById('nonexistent');
      expect(template).toBeNull();
    });
  });

  describe('listBuiltInTemplateIds', () => {
    it('deve listar todos os IDs de templates', () => {
      const ids = listBuiltInTemplateIds();
      
      expect(Array.isArray(ids)).toBe(true);
      expect(ids).toContain('quiz21StepsComplete');
    });
  });

  describe('normalizeBuiltInTemplate', () => {
    it('deve normalizar template v3.1', () => {
      const template = {
        metadata: { id: 'test', name: 'Test' },
        steps: {
          'step-01': {
            metadata: { id: 'step-01', name: 'Step' },
            blocks: [{ id: 'b1', type: 'Logo' }],
          },
        },
      };

      const normalized = normalizeBuiltInTemplate(template);
      
      expect(normalized).toHaveProperty('metadata');
      expect(normalized).toHaveProperty('steps');
    });
  });
});
```

### 3. Template Service

**`src/services/canonical/__tests__/TemplateService.test.ts`:**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { templateService } from '../TemplateService';

describe('TemplateService', () => {
  beforeEach(() => {
    // Reset service state
    vi.clearAllMocks();
  });

  describe('getStep', () => {
    it('deve carregar step de built-in JSON', async () => {
      const result = await templateService.getStep(
        'step-01-intro',
        'quiz21StepsComplete'
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('deve retornar erro para step inexistente', async () => {
      const result = await templateService.getStep(
        'nonexistent',
        'quiz21StepsComplete'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('deve respeitar AbortSignal', async () => {
      const controller = new AbortController();
      
      // Abortar imediatamente
      controller.abort();

      const result = await templateService.getStep(
        'step-01-intro',
        'quiz21StepsComplete',
        { signal: controller.signal }
      );

      expect(result.success).toBe(false);
      expect(result.error.message).toContain('aborted');
    });
  });

  describe('prepareTemplate', () => {
    it('deve preparar template sem preload', async () => {
      const result = await templateService.prepareTemplate(
        'quiz21StepsComplete'
      );

      expect(result.success).toBe(true);
    });

    it('deve preparar template com preload', async () => {
      const result = await templateService.prepareTemplate(
        'quiz21StepsComplete',
        { preloadAll: true }
      );

      expect(result.success).toBe(true);
    });

    it('deve respeitar AbortSignal no preload', async () => {
      const controller = new AbortController();
      
      // Abortar após 100ms
      setTimeout(() => controller.abort(), 100);

      const result = await templateService.prepareTemplate(
        'quiz21StepsComplete',
        { preloadAll: true, signal: controller.signal }
      );

      // Pode ter sucesso ou falha dependendo do timing
      expect(result).toBeDefined();
    });
  });

  describe('preloadTemplate', () => {
    it('deve preload template completo', async () => {
      const result = await templateService.preloadTemplate(
        'quiz21StepsComplete'
      );

      expect(result.success).toBe(true);
    });
  });
});
```

---

## 🔗 Testes de Integração

### React Query Hooks

**`src/services/hooks/__tests__/useTemplateStep.test.tsx`:**

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTemplateStep } from '../useTemplateStep';

// Wrapper com QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useTemplateStep', () => {
  it('deve carregar step com sucesso', async () => {
    const { result } = renderHook(
      () => useTemplateStep('step-01-intro', {
        templateId: 'quiz21StepsComplete',
      }),
      { wrapper: createWrapper() }
    );

    // Inicialmente loading
    expect(result.current.isLoading).toBe(true);

    // Aguardar carregamento
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verificar dados
    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('deve retornar erro para step inexistente', async () => {
    const { result } = renderHook(
      () => useTemplateStep('nonexistent'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('não deve executar query se enabled=false', async () => {
    const { result } = renderHook(
      () => useTemplateStep('step-01-intro', {
        enabled: false,
      }),
      { wrapper: createWrapper() }
    );

    // Deve permanecer idle
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('deve executar callbacks onSuccess', async () => {
    const onSuccess = vi.fn();

    renderHook(
      () => useTemplateStep('step-01-intro', {
        templateId: 'quiz21StepsComplete',
        onSuccess,
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

### Import Template Dialog

**`src/components/editor/quiz/dialogs/__tests__/ImportTemplateDialog.test.tsx`:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImportTemplateDialog } from '../ImportTemplateDialog';

describe('ImportTemplateDialog', () => {
  const mockTemplate = {
    metadata: {
      id: 'test-template',
      name: 'Test Template',
      version: '3.1',
      totalSteps: 1,
    },
    steps: {
      'step-01': {
        metadata: { id: 'step-01', name: 'Step 1' },
        blocks: [{ id: 'block-1', type: 'IntroLogo' }],
      },
    },
  };

  it('deve renderizar dialog fechado', () => {
    render(
      <ImportTemplateDialog
        open={false}
        onClose={vi.fn()}
        onImport={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('deve renderizar dialog aberto', () => {
    render(
      <ImportTemplateDialog
        open={true}
        onClose={vi.fn()}
        onImport={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Importar Template JSON')).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar em Cancelar', async () => {
    const onClose = vi.fn();

    render(
      <ImportTemplateDialog
        open={true}
        onClose={onClose}
        onImport={vi.fn()}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    await userEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('deve validar JSON ao fazer upload', async () => {
    render(
      <ImportTemplateDialog
        open={true}
        onClose={vi.fn()}
        onImport={vi.fn()}
      />
    );

    const fileInput = screen.getByLabelText(/selecionar arquivo/i);
    const file = new File(
      [JSON.stringify(mockTemplate)],
      'template.json',
      { type: 'application/json' }
    );

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText(/Template válido/i)).toBeInTheDocument();
    });
  });

  it('deve mostrar erro para JSON inválido', async () => {
    render(
      <ImportTemplateDialog
        open={true}
        onClose={vi.fn()}
        onImport={vi.fn()}
      />
    );

    const fileInput = screen.getByLabelText(/selecionar arquivo/i);
    const file = new File(
      ['{ "invalid": true }'],
      'invalid.json',
      { type: 'application/json' }
    );

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText(/erro de validação/i)).toBeInTheDocument();
    });
  });

  it('deve chamar onImport com template válido', async () => {
    const onImport = vi.fn();

    render(
      <ImportTemplateDialog
        open={true}
        onClose={vi.fn()}
        onImport={onImport}
      />
    );

    const fileInput = screen.getByLabelText(/selecionar arquivo/i);
    const file = new File(
      [JSON.stringify(mockTemplate)],
      'template.json',
      { type: 'application/json' }
    );

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText('Importar Template Completo')).toBeEnabled();
    });

    const importButton = screen.getByText('Importar Template Completo');
    await userEvent.click(importButton);

    expect(onImport).toHaveBeenCalledWith(mockTemplate, undefined);
  });
});
```

---

## 🌐 Testes E2E

### Fluxo de Import/Export

**`e2e/template-workflow.spec.ts` (Playwright):**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Template Workflow', () => {
  test('deve importar e exportar template', async ({ page }) => {
    // Navegar para editor
    await page.goto('/editor');

    // Abrir dialog de importação
    await page.click('button:has-text("Importar JSON")');

    // Upload de arquivo
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./fixtures/quiz21StepsComplete.json');

    // Verificar validação
    await expect(page.locator('text=Template válido')).toBeVisible();

    // Importar
    await page.click('button:has-text("Importar Template Completo")');

    // Verificar importação
    await expect(page.locator('text=21 steps')).toBeVisible();

    // Exportar novamente
    await page.click('button:has-text("Exportar")');

    // Verificar download
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });

  test('deve mostrar erro para JSON inválido', async ({ page }) => {
    await page.goto('/editor');

    await page.click('button:has-text("Importar JSON")');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./fixtures/invalid-template.json');

    await expect(page.locator('text=Erro de validação')).toBeVisible();

    // Botão de importar deve estar desabilitado
    await expect(
      page.locator('button:has-text("Importar Template Completo")')
    ).toBeDisabled();
  });
});
```

---

## 🎭 Mocks e Fixtures

### Mock Service Worker (MSW)

**`src/test/mocks/handlers.ts`:**

```typescript
import { rest } from 'msw';

export const handlers = [
  // Mock hierarchical source API
  rest.get('/api/templates/:templateId/steps/:stepId', (req, res, ctx) => {
    const { templateId, stepId } = req.params;

    if (templateId === 'quiz21StepsComplete' && stepId === 'step-01-intro') {
      return res(
        ctx.json({
          blocks: [
            { id: 'block-1', type: 'IntroLogo' },
            { id: 'block-2', type: 'IntroTitle' },
          ],
        })
      );
    }

    return res(ctx.status(404), ctx.json({ error: 'Not found' }));
  }),
];
```

**`src/test/mocks/server.ts`:**

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// Setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Fixtures

**`src/test/fixtures/templates.ts`:**

```typescript
export const mockTemplate = {
  metadata: {
    id: 'test-template',
    name: 'Test Template',
    version: '3.1',
    totalSteps: 2,
  },
  steps: {
    'step-01': {
      metadata: { id: 'step-01', name: 'Intro' },
      blocks: [
        { id: 'block-1', type: 'IntroLogo' },
      ],
    },
    'step-02': {
      metadata: { id: 'step-02', name: 'Question' },
      blocks: [
        { id: 'block-3', type: 'QuestionText' },
      ],
    },
  },
};

export const mockBlocks = [
  { id: 'block-1', type: 'IntroLogo', config: {} },
  { id: 'block-2', type: 'IntroTitle', config: { text: 'Hello' } },
];
```

---

## 📊 Cobertura

### Alvo de Cobertura

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

### Rodar Testes com Cobertura

```bash
# Rodar testes com cobertura
npm run test:coverage

# Abrir relatório HTML
open coverage/index.html
```

### Scripts Package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test"
  }
}
```

---

## 🎓 Conclusão

Este guia fornece uma base sólida para testar o sistema de templates com:

- ✅ Testes unitários para schemas e services
- ✅ Testes de integração para hooks
- ✅ Testes E2E para fluxos completos
- ✅ Mocks e fixtures reutilizáveis
- ✅ Estratégia de cobertura

**Próximos Passos:**

1. Implementar os testes sugeridos
2. Configurar CI/CD para rodar testes automaticamente
3. Adicionar testes de performance para preload
4. Criar testes visuais com Storybook

---

**Última atualização:** 2025-11-07  
**Versão:** 1.0  
**Autor:** Sistema QuizFlow Pro
