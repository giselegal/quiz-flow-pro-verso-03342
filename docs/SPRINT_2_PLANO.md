# 📋 SPRINT 2 - Plano Detalhado de Implementação

**Status**: 🔜 Aguardando implementação  
**Pré-requisito**: ✅ SPRINT 1 completo (código morto removido, fonte única estabelecida)  
**Duração estimada**: 2-3 dias  
**Complexidade**: 🔴 Alta (refatoração profunda de componentes críticos)

---

## 🎯 Objetivos Principais

1. **Remover UnifiedBlockRenderer** deprecated e suas dependências
2. **Unificar loading states** em QuizModularEditor (eliminar estados duplicados)
3. **Refatorar BlockTypeRenderer** para usar blockRegistry diretamente
4. **Implementar Suspense boundaries** para lazy loading de blocos
5. **Eliminar código TSX legacy** que ainda usa imports diretos

---

## 📊 Análise de Impacto

### Componentes Afetados (Alto Risco)
| Componente | Linhas | Importância | Risco |
|------------|--------|-------------|-------|
| UnifiedBlockRenderer.tsx | ~200 | 🔴 Crítico | Alto |
| BlockTypeRenderer.tsx | ~150 | 🔴 Crítico | Alto |
| QuizModularEditor | ~500 | 🔴 Crítico | Alto |
| UnifiedStepRenderer.tsx | ~526 | 🔴 Crítico | Médio |
| CanvasArea.tsx | ~300 | 🟡 Importante | Médio |

### Hooks e Utilitários (Médio Risco)
| Arquivo | Linhas | Importância | Risco |
|---------|--------|-------------|-------|
| useJsonTemplate.ts | ~153 | 🟡 Importante | Baixo |
| blockRegistry.ts | ~120 | 🟢 Novo | Baixo |
| useSafeEventListener.ts | ~50 | 🟢 Novo | Baixo |

---

## 📝 Checklist Completo de Implementação

### Fase 1: Preparação e Auditoria (1 hora)

- [ ] **1.1** Ler todos os arquivos afetados para contexto completo
  - [ ] `src/components/editor/unified/UnifiedBlockRenderer.tsx`
  - [ ] `src/components/editor/blocks/BlockTypeRenderer.tsx`
  - [ ] `src/components/editor/quiz/QuizModularEditor/index.tsx`
  - [ ] `src/components/editor/quiz/QuizModularEditor/components/CanvasColumn/index.tsx`
  - [ ] `src/components/editor/unified/UnifiedStepRenderer.tsx`

- [ ] **1.2** Identificar todas as dependências de UnifiedBlockRenderer
  - [ ] Buscar imports em toda codebase: `grep -r "UnifiedBlockRenderer"`
  - [ ] Listar componentes que importam UnifiedBlockRenderer
  - [ ] Verificar se há props específicas sendo passadas

- [ ] **1.3** Mapear loading states duplicados em QuizModularEditor
  - [ ] Identificar todos os useState relacionados a loading
  - [ ] Documentar onde cada estado é usado
  - [ ] Planejar estado unificado

- [ ] **1.4** Criar branch de trabalho
  - [ ] `git checkout -b sprint-2-refactor-block-rendering`

---

### Fase 2: Criar Novo LazyBlockRenderer (2-3 horas)

- [ ] **2.1** Criar componente base LazyBlockRenderer
  ```typescript
  // src/components/editor/blocks/LazyBlockRenderer.tsx
  - Usar blockRegistry para lazy loading
  - Implementar Suspense boundaries
  - Adicionar ErrorBoundary para cada bloco
  - Implementar skeleton loading
  ```

- [ ] **2.2** Implementar loading states unificados
  ```typescript
  interface UnifiedLoadingState {
    isLoading: boolean;
    loadingBlocks: Set<string>; // IDs dos blocos carregando
    errors: Map<string, Error>;  // Erros por bloco
    progress: number;            // 0-100
  }
  ```

- [ ] **2.3** Criar hook useBlockLoading
  ```typescript
  // src/hooks/useBlockLoading.ts
  - Gerenciar estado de loading unificado
  - Tracking de blocos individuais
  - Integração com blockRegistry
  ```

- [ ] **2.4** Implementar testes unitários para LazyBlockRenderer
  ```typescript
  // src/components/editor/blocks/__tests__/LazyBlockRenderer.test.tsx
  - Teste de lazy loading
  - Teste de Suspense fallback
  - Teste de error boundaries
  - Teste de skeleton rendering
  ```

---

### Fase 3: Refatorar BlockTypeRenderer (2-3 horas)

- [ ] **3.1** Substituir imports diretos por blockRegistry
  - [ ] Remover imports estáticos de blocos TSX
  - [ ] Usar `blockRegistry.get(blockType)` para obter componentes
  - [ ] Adicionar Suspense wrapper

- [ ] **3.2** Implementar lazy loading com Suspense
  ```typescript
  const BlockComponent = lazy(() => blockRegistry.get(block.type));
  
  return (
    <Suspense fallback={<BlockSkeleton type={block.type} />}>
      <ErrorBoundary fallback={<BlockError />}>
        <BlockComponent {...props} />
      </ErrorBoundary>
    </Suspense>
  );
  ```

- [ ] **3.3** Adicionar error handling robusto
  - [ ] ErrorBoundary específica para blocos
  - [ ] Fallback UI amigável
  - [ ] Log de erros para debugging

- [ ] **3.4** Otimizar re-renders
  - [ ] Usar React.memo onde apropriado
  - [ ] Implementar shouldComponentUpdate manual se necessário
  - [ ] Integrar com useAutoMetrics do SPRINT 1

---

### Fase 4: Unificar Loading States em QuizModularEditor (3-4 horas)

- [ ] **4.1** Auditar estados de loading existentes
  ```bash
  # Buscar todos useState com 'loading' ou 'isLoading'
  grep -n "useState.*[Ll]oading" src/components/editor/quiz/QuizModularEditor/**/*.tsx
  ```

- [ ] **4.2** Criar contexto unificado de loading
  ```typescript
  // src/contexts/EditorLoadingContext.tsx
  interface EditorLoadingContextType {
    isLoadingTemplate: boolean;
    isLoadingBlocks: boolean;
    loadingBlockIds: Set<string>;
    progress: number;
    setTemplateLoading: (loading: boolean) => void;
    setBlockLoading: (blockId: string, loading: boolean) => void;
  }
  ```

- [ ] **4.3** Migrar todos componentes para contexto unificado
  - [ ] QuizModularEditor index.tsx
  - [ ] CanvasColumn/index.tsx
  - [ ] BlocksList.tsx
  - [ ] PropertyPanel.tsx

- [ ] **4.4** Remover estados duplicados
  - [ ] Deletar useState de loading individuais
  - [ ] Substituir por useContext(EditorLoadingContext)
  - [ ] Verificar que nenhum estado ficou órfão

---

### Fase 5: Remover UnifiedBlockRenderer (2-3 horas)

- [ ] **5.1** Criar componente de migração temporário
  ```typescript
  // src/components/editor/unified/UnifiedBlockRendererMigration.tsx
  // Wrapper que mapeia props antigas para LazyBlockRenderer
  ```

- [ ] **5.2** Substituir imports em componentes dependentes
  - [ ] UnifiedStepContent.tsx
  - [ ] CanvasArea.tsx
  - [ ] Qualquer outro componente identificado na Fase 1

- [ ] **5.3** Testar cada substituição individualmente
  - [ ] Verificar que blocos renderizam corretamente
  - [ ] Verificar que interações funcionam (drag, click, etc.)
  - [ ] Verificar que props são passadas corretamente

- [ ] **5.4** Deletar UnifiedBlockRenderer.tsx
  - [ ] Apenas após todos os componentes migrarem
  - [ ] Verificar que build não tem erros
  - [ ] Fazer commit: `git commit -m "feat: remove deprecated UnifiedBlockRenderer"`

---

### Fase 6: Limpeza e Otimização (1-2 horas)

- [ ] **6.1** Remover código TSX legacy não usado
  - [ ] Buscar imports diretos de componentes de bloco
  - [ ] Substituir por lazy loading via blockRegistry
  - [ ] Deletar arquivos não mais necessários

- [ ] **6.2** Otimizar bundle size
  - [ ] Verificar que lazy loading está funcionando: `npm run build`
  - [ ] Comparar tamanho antes/depois
  - [ ] Meta: redução de pelo menos 50KB

- [ ] **6.3** Atualizar documentação
  - [ ] Atualizar README/templates.md
  - [ ] Atualizar comentários em arquivos modificados
  - [ ] Criar CHANGELOG.md com mudanças

---

### Fase 7: Testes e Validação (2-3 horas)

- [ ] **7.1** Testes unitários
  - [ ] LazyBlockRenderer.test.tsx (já criado na Fase 2)
  - [ ] BlockTypeRenderer.test.tsx
  - [ ] useBlockLoading.test.tsx
  - [ ] EditorLoadingContext.test.tsx

- [ ] **7.2** Testes de integração
  ```typescript
  // src/components/editor/__tests__/BlockRenderingIntegration.test.tsx
  - Teste de renderização de todos tipos de bloco
  - Teste de lazy loading funcionando
  - Teste de error boundaries
  - Teste de estados de loading unificados
  ```

- [ ] **7.3** Testes E2E (playwright)
  ```typescript
  // tests/e2e/block-rendering.spec.ts
  - Teste de abertura do editor
  - Teste de drag and drop de blocos
  - Teste de edição de propriedades
  - Teste de performance (tempo de carregamento)
  ```

- [ ] **7.4** Testes manuais no browser
  - [ ] Abrir editor: `/editor?template=quiz21StepsComplete`
  - [ ] Testar todos os 21 steps
  - [ ] Verificar console (0 erros esperados)
  - [ ] Verificar network tab (lazy loading funcionando)
  - [ ] Verificar re-renders (usar React DevTools Profiler)

---

## 🗂️ Arquivos a Modificar

### Criar Novos (7 arquivos)

1. **`src/components/editor/blocks/LazyBlockRenderer.tsx`** (~150 linhas)
   - Novo renderizador com Suspense boundaries
   - Substitui UnifiedBlockRenderer

2. **`src/hooks/useBlockLoading.ts`** (~80 linhas)
   - Hook para gerenciar loading de blocos individuais
   - Integração com blockRegistry

3. **`src/contexts/EditorLoadingContext.tsx`** (~120 linhas)
   - Contexto unificado de loading states
   - Provider para QuizModularEditor

4. **`src/components/editor/blocks/BlockError.tsx`** (~40 linhas)
   - Componente de erro fallback para ErrorBoundary
   - UI amigável com botão de retry

5. **`src/components/editor/blocks/__tests__/LazyBlockRenderer.test.tsx`** (~200 linhas)
   - Testes unitários completos

6. **`tests/e2e/block-rendering.spec.ts`** (~150 linhas)
   - Testes E2E de renderização

7. **`docs/SPRINT_2_COMPLETO.md`** (~300 linhas)
   - Documentação de conclusão (criar ao final)

### Modificar Existentes (5 arquivos principais)

8. **`src/components/editor/blocks/BlockTypeRenderer.tsx`**
   - Refatorar para usar blockRegistry
   - Adicionar Suspense boundaries
   - Remover imports diretos
   - Estimativa: -50 linhas, +80 linhas (net +30)

9. **`src/components/editor/quiz/QuizModularEditor/index.tsx`**
   - Adicionar EditorLoadingContext.Provider
   - Remover estados de loading duplicados
   - Integrar com novo sistema
   - Estimativa: -30 linhas, +20 linhas (net -10)

10. **`src/components/editor/quiz/QuizModularEditor/components/CanvasColumn/index.tsx`**
    - Usar contexto de loading unificado
    - Remover estado local de loading
    - Estimativa: -20 linhas, +10 linhas (net -10)

11. **`src/components/editor/unified/UnifiedStepRenderer.tsx`**
    - Remover referências a UnifiedBlockRenderer
    - Usar LazyBlockRenderer
    - Estimativa: -30 linhas, +15 linhas (net -15)

12. **`src/config/jsonMigrationConfig.ts`**
    - Atualizar comentários sobre SPRINT 2
    - Remover flag `enableTsxFallback` (não mais necessário)
    - Estimativa: -5 linhas, +10 linhas (net +5)

### Deletar (2 arquivos)

13. **`src/components/editor/unified/UnifiedBlockRenderer.tsx`** (❌ ~200 linhas)
    - Deprecated após migração completa

14. **Possível**: Componentes TSX de bloco não mais necessários
    - Identificar na Fase 6.1
    - Deletar apenas se confirmado não uso

---

## ✅ Critérios de Aceite

### Funcionais

- [ ] **F1**: Todos os 21 steps renderizam corretamente sem erros
- [ ] **F2**: Lazy loading de blocos funcionando (verificar Network tab)
- [ ] **F3**: Loading states unificados em um único contexto
- [ ] **F4**: UnifiedBlockRenderer completamente removido
- [ ] **F5**: Drag and drop de blocos continua funcionando
- [ ] **F6**: Edição de propriedades continua funcionando
- [ ] **F7**: Preview de mudanças continua funcionando em tempo real
- [ ] **F8**: Error boundaries capturam erros de bloco sem quebrar página

### Não-funcionais (Performance)

- [ ] **NF1**: Bundle size reduzido em pelo menos 50KB
- [ ] **NF2**: Initial parse time reduzido em pelo menos 100ms
- [ ] **NF3**: Time to Interactive (TTI) melhorado
- [ ] **NF4**: Menos de 10 re-renders por ação de usuário (medido por useAutoMetrics)
- [ ] **NF5**: Memory leaks eliminados (verificar via Chrome DevTools Memory Profiler)

### Qualidade de Código

- [ ] **QC1**: 0 erros TypeScript
- [ ] **QC2**: 0 warnings ESLint relevantes
- [ ] **QC3**: Cobertura de testes > 80% nos novos componentes
- [ ] **QC4**: Todos os componentes documentados com JSDoc
- [ ] **QC5**: Código segue padrões estabelecidos (React hooks rules, etc.)

### Documentação

- [ ] **DOC1**: README/templates.md atualizado
- [ ] **DOC2**: CHANGELOG.md criado com todas as mudanças
- [ ] **DOC3**: docs/SPRINT_2_COMPLETO.md criado
- [ ] **DOC4**: Comentários inline atualizados em arquivos modificados
- [ ] **DOC5**: Migration guide criado para desenvolvedores

---

## 🧪 Testes Necessários

### Testes Unitários (Jest + React Testing Library)

```typescript
// 1. LazyBlockRenderer.test.tsx
describe('LazyBlockRenderer', () => {
  it('should render block component with Suspense', async () => {
    // Testar que Suspense wrapper está presente
  });
  
  it('should show skeleton while loading', () => {
    // Testar fallback durante lazy load
  });
  
  it('should handle errors with ErrorBoundary', () => {
    // Simular erro e verificar fallback
  });
  
  it('should pass props correctly to block component', () => {
    // Verificar que props chegam corretamente
  });
});

// 2. BlockTypeRenderer.test.tsx
describe('BlockTypeRenderer', () => {
  it('should use blockRegistry to get component', () => {
    // Verificar integração com registry
  });
  
  it('should handle unknown block types gracefully', () => {
    // Testar fallback para tipo desconhecido
  });
});

// 3. useBlockLoading.test.tsx
describe('useBlockLoading', () => {
  it('should track loading state per block', () => {
    // Testar tracking individual
  });
  
  it('should calculate overall progress', () => {
    // Testar cálculo de progresso
  });
});

// 4. EditorLoadingContext.test.tsx
describe('EditorLoadingContext', () => {
  it('should provide unified loading state', () => {
    // Testar que contexto funciona
  });
  
  it('should update state correctly', () => {
    // Testar mutations de estado
  });
});
```

### Testes de Integração

```typescript
// BlockRenderingIntegration.test.tsx
describe('Block Rendering Integration', () => {
  it('should render all block types correctly', async () => {
    // Testar renderização de cada tipo de bloco
    const blockTypes = ['text-inline', 'options-grid', 'lead-form', ...];
    for (const type of blockTypes) {
      // Renderizar e verificar
    }
  });
  
  it('should handle lazy loading of multiple blocks', async () => {
    // Simular carregamento de 10+ blocos
    // Verificar que Suspense boundaries funcionam
  });
  
  it('should recover from block errors', () => {
    // Simular erro em um bloco
    // Verificar que outros blocos continuam funcionando
  });
});
```

### Testes E2E (Playwright)

```typescript
// tests/e2e/block-rendering.spec.ts
test.describe('Block Rendering E2E', () => {
  test('should load editor without errors', async ({ page }) => {
    await page.goto('/editor?template=quiz21StepsComplete');
    
    // Verificar que não há erros de console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });
  
  test('should lazy load blocks on scroll', async ({ page }) => {
    await page.goto('/editor?template=quiz21StepsComplete');
    
    // Verificar network requests para blocos
    const blockRequests = [];
    page.on('request', req => {
      if (req.url().includes('block-')) {
        blockRequests.push(req.url());
      }
    });
    
    // Scroll para trigger lazy loading
    await page.evaluate(() => window.scrollBy(0, 1000));
    
    // Verificar que lazy loading aconteceu
    expect(blockRequests.length).toBeGreaterThan(0);
  });
  
  test('should allow drag and drop', async ({ page }) => {
    await page.goto('/editor?template=quiz21StepsComplete');
    
    // Drag primeiro bloco para segunda posição
    const firstBlock = page.locator('[data-block-id]').first();
    const secondBlock = page.locator('[data-block-id]').nth(1);
    
    await firstBlock.dragTo(secondBlock);
    
    // Verificar que ordem mudou
    const newFirstBlockId = await page.locator('[data-block-id]').first().getAttribute('data-block-id');
    expect(newFirstBlockId).not.toBe(await firstBlock.getAttribute('data-block-id'));
  });
  
  test('should handle all 21 steps', async ({ page }) => {
    for (let step = 1; step <= 21; step++) {
      await page.goto(`/editor?template=quiz21StepsComplete&step=step-${step.toString().padStart(2, '0')}`);
      
      // Verificar que step carregou
      await expect(page.locator('[data-step-id]')).toBeVisible();
      
      // Verificar que blocos renderizaram
      const blockCount = await page.locator('[data-block-type]').count();
      expect(blockCount).toBeGreaterThan(0);
    }
  });
});
```

### Testes de Performance

```typescript
// tests/performance/block-loading.perf.ts
describe('Block Loading Performance', () => {
  it('should load blocks in under 200ms', async () => {
    const startTime = performance.now();
    
    // Renderizar editor com 20 blocos
    render(<QuizModularEditor />);
    
    // Aguardar todos os blocos carregarem
    await waitFor(() => {
      expect(screen.getAllByTestId('block')).toHaveLength(20);
    });
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).toBeLessThan(200);
  });
  
  it('should have acceptable TTI (Time to Interactive)', async () => {
    // Medir Time to Interactive
    const metrics = await measureTTI();
    
    expect(metrics.tti).toBeLessThan(3000); // 3 segundos
  });
});
```

---

## 📈 Métricas Esperadas

### Antes do SPRINT 2
```
Bundle size:           2.48 MB
Initial parse time:    200-250ms
Lazy loading:          ❌ Não implementado
Loading states:        🔴 Duplicados (4 estados)
Re-renders médios:     15-20 por ação
Memory leaks:          ⚠️ Possíveis (event listeners)
Code coverage:         ~60%
```

### Depois do SPRINT 2 (Meta)
```
Bundle size:           <2.40 MB (-80KB)
Initial parse time:    <150ms (-50ms)
Lazy loading:          ✅ Funcionando
Loading states:        🟢 Unificado (1 contexto)
Re-renders médios:     <10 por ação (-50%)
Memory leaks:          ✅ Eliminados
Code coverage:         >80% (+20%)
```

---

## 🚨 Riscos e Mitigações

### Risco 1: Quebrar funcionalidade existente
**Probabilidade**: Alta  
**Impacto**: Crítico  
**Mitigação**:
- Implementar testes E2E antes de começar
- Fazer commits pequenos e frequentes
- Testar cada mudança isoladamente
- Manter branch de fallback

### Risco 2: Performance pior que antes
**Probabilidade**: Média  
**Impacto**: Alto  
**Mitigação**:
- Medir métricas antes de começar (baseline)
- Usar React Profiler durante desenvolvimento
- Benchmarks automatizados em cada commit
- Rollback se performance degradar >10%

### Risco 3: Bugs em production após deploy
**Probabilidade**: Média  
**Impacto**: Crítico  
**Mitigação**:
- Feature flag para novo sistema
- Canary deployment (10% usuários primeiro)
- Monitoramento de erros (Sentry)
- Rollback plan documentado

### Risco 4: Levar mais tempo que estimado
**Probabilidade**: Alta  
**Impacto**: Médio  
**Mitigação**:
- Implementação incremental (pode parar a qualquer momento)
- Cada fase independente (pode shippar parcialmente)
- Buffer time de 50% incluído nas estimativas
- Pair programming em partes complexas

---

## 🔄 Plano de Rollback

Se algo der errado, seguir este plano:

### Rollback Imediato (< 5 minutos)
```bash
# 1. Voltar para commit antes do SPRINT 2
git revert HEAD~N  # N = número de commits do SPRINT 2

# 2. Build e deploy
npm run build
git push origin main

# 3. Verificar que rollback funcionou
curl https://app.com/health
```

### Rollback Parcial (Manter o que funciona)
Se apenas uma fase falhou:
- Comentar código da fase problemática
- Manter melhorias anteriores
- Criar issue para corrigir depois
- Deploy versão parcial

---

## 📚 Recursos e Referências

### Documentação React
- [React.lazy](https://react.dev/reference/react/lazy)
- [Suspense](https://react.dev/reference/react/Suspense)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [useContext](https://react.dev/reference/react/useContext)

### Ferramentas de Debug
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools Memory Profiler](https://developer.chrome.com/docs/devtools/memory-problems/)
- [Lighthouse Performance](https://developer.chrome.com/docs/lighthouse/overview/)

### Artigos Relevantes
- [Code Splitting in React](https://react.dev/learn/code-splitting)
- [Optimizing Performance](https://react.dev/learn/optimizing-performance)
- [Testing React Components](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🎯 Próximos Passos (SPRINT 3)

Após SPRINT 2 estar completo, considerar:

1. **Validação Automática de Sources**
   - Script `validate-sources.ts`
   - CI check antes de build
   - Prevenir regressões

2. **Dashboard de Métricas**
   - Métricas em tempo real
   - Visualização de performance
   - DEV mode only

3. **Preload Inteligente**
   - Antecipar próximos blocos
   - Baseado em padrões de uso
   - Reduzir tempo de espera

---

## ✅ Checklist Final Antes de Começar

Antes de implementar SPRINT 2, verificar:

- [ ] SPRINT 1 100% completo e estável
- [ ] Todas as métricas baseline coletadas
- [ ] Branch de trabalho criada
- [ ] Testes E2E existentes passando
- [ ] Backup do código atual feito
- [ ] Tempo disponível (2-3 dias dedicados)
- [ ] Este documento revisado e entendido
- [ ] Critérios de aceite claros para todos
- [ ] Plano de rollback entendido e testado

---

**Última atualização**: Novembro 2025  
**Mantenedor**: Time de desenvolvimento Lovable  
**Status**: 📋 Pronto para implementação  
**Pré-requisito**: ✅ SPRINT 1 completo
