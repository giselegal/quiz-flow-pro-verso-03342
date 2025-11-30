# 🧪 Suíte de Testes do Editor Quiz

Suíte completa de testes automatizados para validar a correção do hook condicional e funcionalidades do editor.

---

## 📋 Estrutura dos Testes

```
src/components/editor/quiz/
├── components/__tests__/
│   └── CanvasArea.hooks.test.tsx      # 25 testes - Validação de hooks
├── hooks/__tests__/
│   ├── useVirtualBlocks.test.ts       # 35 testes - Lógica de virtualização
│   └── useSelectionClipboard.test.tsx # (existente)
└── __tests__/
    ├── QuizEditor.integration.test.tsx # 17 testes - Testes de integração
    ├── CanvasArea.previewTab.test.tsx  # (existente)
    └── quizLogic.test.ts               # (existente)
```

**Total: 77+ testes automatizados**

---

## 🎯 Categorias de Testes

### 1️⃣ Testes de Hooks (CanvasArea.hooks.test.tsx)
**Objetivo:** Validar conformidade com React Rules of Hooks

| Grupo | Testes | Descrição |
|-------|--------|-----------|
| Hook Rules Compliance | TC-H001 a TC-H005 | Validação de chamadas incondicionais |
| Virtualization Logic | TC-H006 a TC-H011 | Lógica de habilitação/desabilitação |
| Rendering Behavior | TC-H012 a TC-H016 | Renderização de spacers e badges |
| Re-render Scenarios | TC-H017 a TC-H020 | Comportamento em múltiplos renders |
| Edge Cases | TC-H021 a TC-H025 | Casos extremos e validações |

**Testes Críticos:**
- ✅ TC-H001: Hook chamado incondicionalmente
- ✅ TC-H004: Ordem de hooks consistente
- ✅ TC-H005: Sem erros de "Rendered more hooks"

### 2️⃣ Testes de Hook useVirtualBlocks (useVirtualBlocks.test.ts)
**Objetivo:** Validar lógica interna de virtualização

| Grupo | Testes | Descrição |
|-------|--------|-----------|
| Input Validation | TC-V001 a TC-V005 | Validação de entradas |
| Configuration | TC-V006 a TC-V009 | Configurações de virtualização |
| Calculation Logic | TC-V010 a TC-V015 | Cálculos de spacers e visible |
| Window Slicing | TC-V016 a TC-V020 | Lógica de janela deslizante |
| State Updates | TC-V021 a TC-V025 | Atualizações de estado |
| Performance | TC-V026 a TC-V028 | Memoização e performance |
| Edge Cases | TC-V029 a TC-V035 | Casos extremos |

**Testes Críticos:**
- ✅ TC-V002/V003: Proteção contra null/undefined
- ✅ TC-V008/V009: Controle de virtualização
- ✅ TC-V026/V027: Memoização adequada

### 3️⃣ Testes de Integração (QuizEditor.integration.test.tsx)
**Objetivo:** Validar fluxos end-to-end do editor

| Grupo | Testes | Descrição |
|-------|--------|-----------|
| Editor Initialization | TC-INT-001 a TC-INT-003 | Carregamento inicial |
| Step Navigation | TC-INT-004 a TC-INT-006 | Navegação entre steps |
| Canvas Rendering | TC-INT-007 a TC-INT-008 | Renderização de blocos |
| Virtualization | TC-INT-009 a TC-INT-011 | Virtualização em contexto |
| Preview Tab | TC-INT-012 a TC-INT-013 | Funcionalidade de preview |
| Properties Panel | TC-INT-014 a TC-INT-015 | Sincronização de propriedades |
| Undo/Redo | TC-INT-016 | Histórico de ações |
| Error Handling | TC-INT-017 | Tratamento de erros |

**Testes Críticos:**
- ✅ TC-INT-001: Editor carrega sem erros de hooks
- ✅ TC-INT-004: Navegação sem crashes
- ✅ TC-INT-009: Virtualização funcional

---

## 🚀 Como Executar os Testes

### Pré-requisitos
```bash
npm install
```

### Executar Todos os Testes do Editor
```bash
npm run test:run:editor
```

### Executar Testes Específicos

#### 1. Apenas Testes de Hooks
```bash
npx vitest run src/components/editor/quiz/components/__tests__/CanvasArea.hooks.test.tsx
```

#### 2. Apenas Testes do useVirtualBlocks
```bash
npx vitest run src/components/editor/quiz/hooks/__tests__/useVirtualBlocks.test.ts
```

#### 3. Apenas Testes de Integração
```bash
npx vitest run src/components/editor/quiz/__tests__/QuizEditor.integration.test.tsx
```

### Modo Watch (Desenvolvimento)
```bash
# Todos os testes do editor em watch mode
npx vitest src/components/editor/quiz --watch

# Apenas hooks
npx vitest src/components/editor/quiz/hooks/__tests__ --watch

# Apenas componentes
npx vitest src/components/editor/quiz/components/__tests__ --watch
```

### Com UI Interativa
```bash
npm run test:ui
# Depois navegar para os testes do editor
```

### Com Cobertura
```bash
npx vitest run src/components/editor/quiz --coverage
```

---

## 📊 Interpretando Resultados

### ✅ Sucesso Total
```
✓ src/components/editor/quiz/components/__tests__/CanvasArea.hooks.test.tsx (25)
✓ src/components/editor/quiz/hooks/__tests__/useVirtualBlocks.test.ts (35)
✓ src/components/editor/quiz/__tests__/QuizEditor.integration.test.tsx (17)

Test Files  3 passed (3)
     Tests  77 passed (77)
```

### ⚠️ Falhas Esperadas Durante Desenvolvimento
Se você ainda não aplicou a correção do hook condicional:

```
❌ TC-H001: deve chamar useVirtualBlocks incondicionalmente
   Error: Hook called conditionally inside IIFE

❌ TC-H005: deve chamar useVirtualBlocks no nível superior
   Error: Rendered more hooks than during the previous render
```

### 🎯 Meta de Qualidade
- **Cobertura de Código:** > 80%
- **Taxa de Sucesso:** 100% após correção
- **Tempo de Execução:** < 10s para todos os testes

---

## 🔍 Debugging de Falhas

### Teste Falhou: "Rendered more hooks"
**Causa:** Hook ainda está sendo chamado condicionalmente

**Solução:**
1. Verificar que `useVirtualBlocks` está no nível superior
2. Confirmar que não está dentro de IIFE `(() => { ... })()`
3. Verificar arquivo `CanvasArea.tsx` linhas 73-86

### Teste Falhou: "Expected ... but received ..."
**Causa:** Valores de virtualização incorretos

**Solução:**
1. Verificar threshold de 60 blocos
2. Confirmar lógica de `virtualizationEnabled`
3. Verificar cálculos em `useVirtualBlocks.ts`

### Teste Falhou: "Hook mocked but not called"
**Causa:** Mock não está sendo aplicado corretamente

**Solução:**
```bash
# Limpar cache do vitest
npx vitest run --clearCache

# Ou deletar diretório
rm -rf node_modules/.vitest
```

---

## 🛠️ Configuração de Testes

### vitest.config.ts (já configurado)
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/components/editor/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}']
    }
  }
});
```

### Setup File (se necessário)
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocks globais se necessário
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

---

## 📈 Métricas de Sucesso

### Antes da Correção
| Métrica | Valor |
|---------|-------|
| Editor Carrega | ❌ Crash |
| Testes Passando | 0% |
| Erros no Console | 2+ erros críticos |

### Depois da Correção
| Métrica | Valor Esperado |
|---------|----------------|
| Editor Carrega | ✅ < 2s |
| Testes Passando | ✅ 100% |
| Erros no Console | ✅ 0 erros |
| Cobertura de Código | ✅ > 80% |

---

## 🔄 CI/CD Integration

### GitHub Actions (exemplo)
```yaml
name: Editor Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:run:editor
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 📝 Adicionando Novos Testes

### Template de Teste Unitário
```typescript
it('TC-XXX: deve fazer algo específico', () => {
  // Arrange
  const input = createTestData();
  
  // Act
  const result = functionUnderTest(input);
  
  // Assert
  expect(result).toBe(expectedValue);
});
```

### Template de Teste de Integração
```typescript
it('TC-INT-XXX: deve integrar componentes corretamente', async () => {
  const user = userEvent.setup();
  
  render(<Component />);
  
  await user.click(screen.getByRole('button'));
  
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

---

## 🎓 Recursos de Aprendizado

### Documentação
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)

### Comandos Úteis
```bash
# Ver apenas nomes dos testes
npx vitest run --reporter=tap

# Executar testes que contém "hook" no nome
npx vitest run -t hook

# Executar testes de um arquivo específico
npx vitest run CanvasArea.hooks

# Debug mode
npx vitest --inspect-brk
```

---

## ✅ Checklist de Validação

Após executar os testes, verifique:

- [ ] ✅ Todos os 77+ testes passam
- [ ] ✅ Sem warnings no console
- [ ] ✅ Cobertura > 80%
- [ ] ✅ Tempo de execução < 10s
- [ ] ✅ Sem flaky tests (testes inconsistentes)
- [ ] ✅ Editor abre sem erros no browser
- [ ] ✅ Testes manuais do `GUIA_TESTES_MANUAIS_EDITOR.md` passam

---

## 🆘 Suporte

**Problemas com os testes?**

1. **Verificar versões:**
   ```bash
   npm list vitest @testing-library/react @testing-library/user-event
   ```

2. **Limpar e reinstalar:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Executar em modo verbose:**
   ```bash
   npx vitest run --reporter=verbose
   ```

4. **Consultar documentação completa:**
   - `CORRECAO_HOOK_CONDICIONAL_VALIDACAO_FINAL.md`
   - `GUIA_TESTES_MANUAIS_EDITOR.md`

---

## 📅 Histórico

| Data | Versão | Mudanças |
|------|--------|----------|
| 2025-10-13 | 1.0.0 | Suíte inicial criada após correção do hook |

---

**✍️ Criado por:** GitHub Copilot  
**📅 Data:** 13 de Outubro de 2025  
**🎯 Status:** ✅ Pronto para execução
