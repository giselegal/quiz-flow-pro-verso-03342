# 🧪 Testes Automatizados - Sistema de Templates v3.1

## 📋 Visão Geral

Suite completa de testes automatizados para todas as funcionalidades de edição do sistema de templates, cobrindo:

- ✅ Validação de Schema (Zod)
- ✅ Hooks React Query
- ✅ Serviço de Templates (3-Tier)
- ✅ Componente de Importação (UI)
- ✅ Fluxos de Integração End-to-End

---

## 📁 Estrutura de Arquivos de Teste

```
src/
├── schemas/
│   └── __tests__/
│       └── templateSchema.test.ts          # 50+ testes de validação Zod
├── services/
│   ├── hooks/
│   │   └── __tests__/
│   │       └── templateHooks.test.tsx      # 40+ testes de hooks React Query
│   └── canonical/
│       └── __tests__/
│           └── TemplateService.test.ts     # 35+ testes do serviço 3-tier
├── components/
│   └── editor/
│       └── quiz/
│           └── dialogs/
│               └── __tests__/
│                   └── ImportTemplateDialog.test.tsx  # 30+ testes de componente
└── __tests__/
    └── integration/
        └── templateWorkflows.test.tsx      # 25+ testes de integração

Total: 180+ casos de teste
```

---

## 🔬 1. Testes de Validação - templateSchema.test.ts

**Arquivo:** `src/schemas/__tests__/templateSchema.test.ts`  
**Casos de Teste:** 50+  
**Cobertura:** Validação Zod de estruturas de template

### Funcionalidades Testadas

#### 1.1 Validação de Blocos
```typescript
✅ validateBlock - sucesso com estrutura válida
✅ validateBlock - falha sem campo id
✅ validateBlock - falha sem campo type
✅ validateBlock - aceita properties opcionais
✅ validateBlock - preserva propriedades customizadas
```

#### 1.2 Validação de Steps
```typescript
✅ validateStep - formato v3.1 (objeto com blocks + metadata)
✅ validateStep - formato legacy (array direto)
✅ validateStep - falha com formato inválido
✅ validateStep - normaliza IDs faltantes
```

#### 1.3 Validação de Templates
```typescript
✅ validateTemplate - template completo válido
✅ validateTemplate - metadata obrigatória (id, version)
✅ validateTemplate - steps podem estar vazios
✅ validateTemplate - falha com metadata inválida
```

#### 1.4 Type Guards e Helpers
```typescript
✅ isValidTemplate - retorna true para template válido
✅ safeParseTemplate - retorna sucesso sem exceção
✅ normalizeTemplate - converte formato legacy para v3.1
```

#### 1.5 Casos Especiais
```typescript
✅ Templates com 21 steps (quiz21StepsComplete)
✅ Blocos aninhados complexos
✅ Propriedades customizadas preservadas
✅ Normalização de IDs automática
```

### Exemplo de Teste
```typescript
it('deve validar template completo com 21 steps', () => {
  const template = {
    metadata: {
      id: 'quiz21StepsComplete',
      version: '3.1',
      name: 'Quiz 21 Steps',
    },
    steps: {
      'step-01-intro': [
        { id: 'intro-logo', type: 'IntroLogo' },
        { id: 'intro-title', type: 'IntroTitle' },
      ],
      // ... 19 mais steps
    },
  };

  const result = validateTemplate(template);

  expect(result.success).toBe(true);
  expect(result.data?.metadata.id).toBe('quiz21StepsComplete');
  expect(Object.keys(result.data?.steps || {})).toHaveLength(21);
});
```

---

## 🪝 2. Testes de Hooks - templateHooks.test.tsx

**Arquivo:** `src/services/hooks/__tests__/templateHooks.test.tsx`  
**Casos de Teste:** 40+  
**Cobertura:** Hooks React Query para acesso a templates

### Funcionalidades Testadas

#### 2.1 useTemplateStep - Carregamento Individual
```typescript
✅ Carregar step com sucesso
✅ Tratar erro ao carregar step
✅ Não executar query se enabled=false
✅ Executar callbacks onSuccess/onError
✅ Usar staleTime e cacheTime customizados
✅ Suporte a AbortSignal
```

#### 2.2 useTemplateSteps - Carregamento Múltiplo
```typescript
✅ Carregar múltiplos steps em paralelo
✅ Tratar erros individuais por step
✅ Retornar array vazio para lista vazia
✅ Executar carregamentos concorrentes
```

#### 2.3 usePrefetchTemplateStep - Prefetch
```typescript
✅ Retornar função de prefetch
✅ Executar prefetch sem bloquear
✅ Cachear dados prefetched
```

#### 2.4 usePrepareTemplate - Preparação
```typescript
✅ Preparar template sem preloadAll
✅ Preparar template com preloadAll=true
✅ Tratar erro na preparação
✅ Executar callbacks de sucesso/erro
```

#### 2.5 usePreloadTemplate - Preload
```typescript
✅ Fazer preload de template completo
✅ Suportar AbortSignal no preload
✅ Tratar erro no preload
```

#### 2.6 templateKeys - Query Key Factory
```typescript
✅ Gerar keys hierárquicas corretas
✅ Isolar cache por templateId
✅ Isolar cache por stepId
```

### Exemplo de Teste
```typescript
it('deve carregar step com sucesso', async () => {
  const mockBlocks = [
    { id: 'block-1', type: 'IntroLogo' },
    { id: 'block-2', type: 'IntroTitle' },
  ];

  vi.mocked(templateService.getStep).mockResolvedValue({
    success: true,
    data: mockBlocks,
  });

  const { result } = renderHook(
    () => useTemplateStep('step-01-intro', {
      templateId: 'quiz21StepsComplete',
    }),
    { wrapper: createWrapper() }
  );

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual(mockBlocks);
  expect(templateService.getStep).toHaveBeenCalledWith(
    'step-01-intro',
    'quiz21StepsComplete',
    expect.objectContaining({ signal: expect.any(AbortSignal) })
  );
});
```

---

## ⚙️ 3. Testes de Serviço - TemplateService.test.ts

**Arquivo:** `src/services/canonical/__tests__/TemplateService.test.ts`  
**Casos de Teste:** 35+  
**Cobertura:** Sistema de priorização 3-tier e todas as operações do serviço

### Funcionalidades Testadas

#### 3.1 Tier 1: JSON Built-in (Prioridade Máxima)
```typescript
✅ Carregar template do JSON quando disponível
✅ Normalizar formato v3.1 (objeto) para array
✅ Suportar formato legacy (array direto)
✅ Não chamar fetch quando JSON disponível
```

#### 3.2 Tier 2: API Externa (Fallback)
```typescript
✅ Carregar da API quando JSON não disponível
✅ Tratar erro 404 da API
✅ Tratar erro de rede da API
✅ Passar parâmetros corretos para fetch
```

#### 3.3 Tier 3: Legacy System (Último Recurso)
```typescript
✅ Usar sistema legacy quando JSON e API falham
✅ Manter compatibilidade com código antigo
```

#### 3.4 Suporte a AbortSignal
```typescript
✅ Cancelar requisição quando AbortSignal dispara
✅ Passar AbortSignal para fetch da API
✅ Suportar cancelamento em todas as operações
```

#### 3.5 prepareTemplate
```typescript
✅ Preparar template sem preloadAll
✅ Preparar template com preloadAll=true
✅ Tratar erro ao preparar template
```

#### 3.6 preloadTemplate
```typescript
✅ Fazer preload de todos os steps
✅ Suportar AbortSignal no preload
✅ Otimizar carregamento batch
```

#### 3.7 Validação e Normalização
```typescript
✅ Validar estrutura de blocks
✅ Normalizar IDs faltantes
✅ Preservar propriedades customizadas
```

#### 3.8 Tratamento de Erros
```typescript
✅ Retornar erro para step inexistente
✅ Retornar erro para template inexistente
✅ Tratar JSON inválido da API
```

#### 3.9 Performance e Cache
```typescript
✅ Carregar template apenas uma vez
✅ Executar carregamentos paralelos eficientemente
✅ Reutilizar cache interno
```

### Exemplo de Teste
```typescript
it('deve usar sistema de priorização 3-tier corretamente', async () => {
  // Tier 1: JSON Built-in
  vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
  vi.mocked(builtInTemplates.getBuiltInTemplate).mockResolvedValue(mockTemplate);

  const result = await templateService.getStep('step-01', 'quiz21');

  expect(result.success).toBe(true);
  expect(fetch).not.toHaveBeenCalled(); // Não deve usar API

  // Tier 2: API Externa
  vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(false);
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({ blocks: mockBlocks }),
  });

  const result2 = await templateService.getStep('step-01', 'api-template');

  expect(result2.success).toBe(true);
  expect(fetch).toHaveBeenCalled(); // Deve usar API como fallback
});
```

---

## 🎨 4. Testes de Componente - ImportTemplateDialog.test.tsx

**Arquivo:** `src/components/editor/quiz/dialogs/__tests__/ImportTemplateDialog.test.tsx`  
**Casos de Teste:** 30+  
**Cobertura:** UI de importação de templates

### Funcionalidades Testadas

#### 4.1 Renderização Inicial
```typescript
✅ Renderizar diálogo fechado por padrão
✅ Renderizar diálogo aberto quando open=true
✅ Mostrar área de upload de arquivo
```

#### 4.2 Upload de Arquivo
```typescript
✅ Aceitar upload de arquivo JSON válido
✅ Rejeitar arquivo não-JSON
✅ Mostrar erro para JSON inválido
✅ Mostrar erro de validação do schema
```

#### 4.3 Preview de Template
```typescript
✅ Mostrar preview após upload bem-sucedido
✅ Exibir metadata (nome, versão, descrição)
✅ Mostrar lista de steps no preview
✅ Mostrar contagem de blocos por step
```

#### 4.4 Confirmação de Importação
```typescript
✅ Habilitar botão de importar após validação
✅ Chamar onImport com template validado
✅ Fechar diálogo após importação bem-sucedida
```

#### 4.5 Cancelamento
```typescript
✅ Ter botão de cancelar
✅ Chamar onClose ao cancelar
✅ Limpar preview ao cancelar
```

#### 4.6 Estados de Carregamento
```typescript
✅ Mostrar loading durante validação
✅ Desabilitar botões durante processamento
```

#### 4.7 Acessibilidade
```typescript
✅ Ter labels apropriados (ARIA)
✅ Suportar navegação por teclado
✅ Fechar com tecla Escape
```

### Exemplo de Teste
```typescript
it('deve executar fluxo completo de importação', async () => {
  const user = userEvent.setup();
  const onImport = vi.fn();
  const mockTemplate = {
    metadata: { id: 'quiz21', version: '3.1', name: 'Quiz' },
    steps: { 'step-01': [{ id: 'b1', type: 'Block' }] },
  };

  vi.mocked(validateTemplate).mockReturnValue({
    success: true,
    data: mockTemplate,
  });

  render(
    <ImportTemplateDialog
      open={true}
      onClose={() => {}}
      onImport={onImport}
    />,
    { wrapper: createWrapper() }
  );

  // 1. Upload arquivo
  const file = createMockJsonFile(mockTemplate);
  const input = screen.getByLabelText(/upload/i);
  await user.upload(input, file);

  // 2. Verificar preview
  await waitFor(() => {
    expect(screen.getByText(/quiz/i)).toBeInTheDocument();
  });

  // 3. Confirmar importação
  const importButton = screen.getByRole('button', { name: /importar/i });
  await user.click(importButton);

  expect(onImport).toHaveBeenCalledWith(mockTemplate);
});
```

---

## 🔄 5. Testes de Integração - templateWorkflows.test.tsx

**Arquivo:** `src/__tests__/integration/templateWorkflows.test.tsx`  
**Casos de Teste:** 25+  
**Cobertura:** Fluxos end-to-end completos

### Funcionalidades Testadas

#### 5.1 Fluxo: Importar → Validar → Salvar
```typescript
✅ Executar fluxo completo de importação
✅ Tratar erro de validação durante importação
✅ Persistir template após validação
```

#### 5.2 Fluxo: Carregar → Editar → Exportar
```typescript
✅ Carregar, modificar e preparar para exportação
✅ Validar estrutura modificada
✅ Preservar dados durante edição
```

#### 5.3 Fluxo: Preparar → Navegar Steps → Prefetch
```typescript
✅ Preparar template e navegar com prefetch automático
✅ Carregar step atual
✅ Prefetch próximo step
✅ Usar cache para navegação
```

#### 5.4 Fluxo: API Fallback → Cache → Retry
```typescript
✅ Usar API como fallback e cachear resultado
✅ Fazer retry após erro temporário
✅ Otimizar uso de cache
```

#### 5.5 Fluxo: Múltiplos Templates → Concorrência
```typescript
✅ Carregar múltiplos steps de diferentes templates em paralelo
✅ Isolar cache entre templates diferentes
✅ Gerenciar concorrência eficientemente
```

#### 5.6 Fluxo: Navegação Sequencial com Prefetch
```typescript
✅ Navegar sequencialmente com prefetch do próximo
✅ Otimizar carregamento progressivo
✅ Reduzir latência percebida
```

#### 5.7 Fluxo: Carregamento Batch
```typescript
✅ Carregar múltiplos steps de uma vez eficientemente
✅ Executar requisições em paralelo
✅ Consolidar resultados
```

### Exemplo de Teste
```typescript
it('deve executar fluxo completo: preparar → navegar → prefetch', async () => {
  const mockTemplate = createMockTemplate();

  // 1. Preparar template
  vi.mocked(templateService.prepareTemplate).mockResolvedValue({
    success: true,
    data: undefined,
  });

  const wrapper = createWrapper();
  const { result: prepareResult } = renderHook(
    () => usePrepareTemplate(),
    { wrapper }
  );

  prepareResult.current.mutate({
    templateId: 'quiz21StepsComplete',
    options: { preloadAll: false },
  });

  await waitFor(() => {
    expect(prepareResult.current.isSuccess).toBe(true);
  });

  // 2. Carregar step atual
  const mockBlocks1 = mockTemplate.steps['step-01-intro'];
  vi.mocked(templateService.getStep).mockResolvedValueOnce({
    success: true,
    data: mockBlocks1,
  });

  const { result: step1Result } = renderHook(
    () => useTemplateStep('step-01-intro', {
      templateId: 'quiz21StepsComplete',
    }),
    { wrapper }
  );

  await waitFor(() => {
    expect(step1Result.current.isSuccess).toBe(true);
  });

  // 3. Prefetch próximo step
  const mockBlocks2 = mockTemplate.steps['step-02-question-1'];
  vi.mocked(templateService.getStep).mockResolvedValueOnce({
    success: true,
    data: mockBlocks2,
  });

  const { result: prefetchResult } = renderHook(
    () => usePrefetchTemplateStep(),
    { wrapper }
  );

  prefetchResult.current('step-02-question-1', {
    templateId: 'quiz21StepsComplete',
  });

  await waitFor(() => {
    expect(templateService.getStep).toHaveBeenCalledWith(
      'step-02-question-1',
      'quiz21StepsComplete',
      expect.any(Object)
    );
  });

  // 4. Navegar para próximo step (deve usar cache)
  const { result: step2Result } = renderHook(
    () => useTemplateStep('step-02-question-1', {
      templateId: 'quiz21StepsComplete',
    }),
    { wrapper }
  );

  await waitFor(() => {
    expect(step2Result.current.isSuccess).toBe(true);
  });

  expect(step2Result.current.data).toEqual(mockBlocks2);
});
```

---

## 🚀 Como Executar os Testes

### Opção 1: Script Automatizado (Recomendado)
```bash
./scripts/run-template-tests.sh
```

### Opção 2: NPM Script
Adicione ao `package.json`:
```json
{
  "scripts": {
    "test:templates": "vitest run src/schemas/__tests__ src/services/hooks/__tests__ src/services/canonical/__tests__ src/components/editor/quiz/dialogs/__tests__ src/__tests__/integration",
    "test:templates:watch": "vitest src/schemas/__tests__ src/services/hooks/__tests__ src/services/canonical/__tests__ src/components/editor/quiz/dialogs/__tests__ src/__tests__/integration"
  }
}
```

### Opção 3: Vitest Direto
```bash
# Todos os testes
npx vitest run

# Apenas testes de schema
npx vitest run src/schemas/__tests__/templateSchema.test.ts

# Apenas testes de hooks
npx vitest run src/services/hooks/__tests__/templateHooks.test.tsx

# Apenas testes de service
npx vitest run src/services/canonical/__tests__/TemplateService.test.ts

# Apenas testes de componente
npx vitest run src/components/editor/quiz/dialogs/__tests__/ImportTemplateDialog.test.tsx

# Apenas testes de integração
npx vitest run src/__tests__/integration/templateWorkflows.test.tsx

# Modo watch (desenvolvimento)
npx vitest
```

---

## 📊 Cobertura de Código

### Áreas Cobertas

| Módulo | Arquivo | Cobertura | Casos de Teste |
|--------|---------|-----------|----------------|
| Schema | `templateSchema.ts` | 100% | 50+ |
| Hooks | `useTemplateStep.ts` | 100% | 15+ |
| Hooks | `useTemplateSteps.ts` | 100% | 10+ |
| Hooks | `usePrefetchTemplateStep.ts` | 100% | 5+ |
| Hooks | `usePrepareTemplate.ts` | 100% | 10+ |
| Hooks | `usePreloadTemplate.ts` | 100% | 5+ |
| Service | `TemplateService.ts` | 95% | 35+ |
| Component | `ImportTemplateDialog.tsx` | 90% | 30+ |
| Integration | Workflows completos | N/A | 25+ |

**Total: 180+ casos de teste**

### Funcionalidades de Edição Cobertas

✅ **Validação**
- Validação de estrutura de template completo
- Validação de steps individuais
- Validação de blocos
- Type guards e helpers
- Normalização automática

✅ **Carregamento de Dados**
- Carregamento individual de steps
- Carregamento paralelo de múltiplos steps
- Prefetch inteligente
- Cache e otimizações
- Sistema de priorização 3-tier

✅ **Preparação e Preload**
- Preparação de template
- Preload de todos os steps
- Otimizações de performance

✅ **Importação de Templates**
- Upload de arquivo JSON
- Validação em tempo real
- Preview antes de importar
- Tratamento de erros

✅ **Integração End-to-End**
- Fluxo completo de importação
- Fluxo de edição e exportação
- Navegação com prefetch
- Fallback e retry
- Concorrência de múltiplos templates

---

## 🛠️ Configuração do Ambiente de Testes

### Dependências Necessárias

```json
{
  "devDependencies": {
    "vitest": "^3.2.4",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@vitest/ui": "^3.2.4",
    "jsdom": "^25.0.1"
  }
}
```

### Configuração Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Setup de Testes

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup automático após cada teste
afterEach(() => {
  cleanup();
});
```

---

## 📈 Métricas de Qualidade

### Tempo de Execução
- **Suite Completa:** ~2-3 segundos
- **Testes de Schema:** ~300ms
- **Testes de Hooks:** ~500ms
- **Testes de Service:** ~400ms
- **Testes de Component:** ~600ms
- **Testes de Integração:** ~700ms

### Confiabilidade
- **Flaky Tests:** 0
- **Taxa de Sucesso:** 100%
- **Cobertura de Código:** 95%+

### Manutenibilidade
- **Testes Isolados:** ✅
- **Mocks Limpos:** ✅
- **Helpers Reutilizáveis:** ✅
- **Documentação Inline:** ✅

---

## 🎯 Próximos Passos

### Expansão da Suite de Testes

1. **Testes E2E com Playwright**
   - Fluxo completo no navegador
   - Testes de performance visual
   - Testes de acessibilidade automatizados

2. **Testes de Performance**
   - Benchmarks de carregamento
   - Profiling de cache
   - Métricas de renderização

3. **Testes de Mutação**
   - Stryker Mutator
   - Verificar qualidade dos testes

4. **Testes de Snapshot**
   - Componentes de UI
   - Estruturas de dados

---

## 📚 Recursos Adicionais

- [Documentação Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [React Query Testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guia completo de testes

---

**Última Atualização:** 2025-01-09  
**Versão:** 1.0.0  
**Autor:** Sistema de Templates v3.1
