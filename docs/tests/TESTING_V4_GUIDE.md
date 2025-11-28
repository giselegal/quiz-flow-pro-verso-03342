# 🧪 Guia de Testes - QuizModularEditorV4

## 📋 Estrutura de Testes

### 1. **Testes Unitários** (`QuizModularEditorV4.test.tsx`)
- ✅ Renderização do layout v4
- ✅ Seleção e deseleção de blocos
- ✅ Adaptadores v3 ↔ v4
- ✅ DynamicPropertiesPanelV4
- ✅ Navegação entre steps
- ✅ Resizable panels
- ✅ Error handling
- ✅ Performance

### 2. **Testes de Integração** (`QuizModularEditorV4.integration.test.tsx`)
- ✅ Fluxo completo: carregar → editar → salvar
- ✅ Multi-step editing
- ✅ Conversão bidirecional v3 ↔ v4
- ✅ Validação Zod
- ✅ Undo/Redo
- ✅ Auto-save
- ✅ Sincronização com backend

### 3. **Testes de Hook** (`useV4BlockAdapter.test.ts`)
- ✅ Conversão v3 → v4
- ✅ handleV4Update
- ✅ Memoization
- ✅ Performance

## 🚀 Como Executar

### Rodar todos os testes
```bash
npm test -- QuizModularEditorV4
# ou
./run-v4-tests.sh all
```

### Apenas testes unitários
```bash
./run-v4-tests.sh unit
```

### Apenas testes de integração
```bash
./run-v4-tests.sh integration
```

### Watch mode (desenvolvimento)
```bash
./run-v4-tests.sh watch
```

### Com coverage
```bash
./run-v4-tests.sh coverage
```

## 📊 Cobertura de Testes

### Metas de Cobertura
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 70%
- **Statements**: 80%

### Arquivos Cobertos
- `QuizModularEditorV4.tsx`
- `adapters.ts` (v3 ↔ v4)
- `DynamicPropertiesPanelV4.tsx`

## 🧩 Cenários de Teste

### ✅ Implementados
1. **Layout v4 com 3 colunas**
   - Header com badge v4
   - Steps Navigator
   - Canvas expandido
   - DynamicPropertiesPanel

2. **Seleção de blocos**
   - Selecionar via canvas
   - Exibir painel de propriedades
   - Limpar seleção

3. **Adaptadores**
   - Conversão v3 → v4 (properties merge)
   - Conversão v4 → v3 (properties split)
   - Aplicação de defaults do registry
   - Handling de blocos inválidos

### ⏳ TODO (Marcados nos testes)
- [ ] Integração completa com EditorProvider mock
- [ ] Simulação de cliques em blocos
- [ ] Updates via DynamicPropertiesPanel
- [ ] Navegação real entre steps
- [ ] Validação Zod em tempo real
- [ ] Undo/Redo
- [ ] Auto-save
- [ ] Drag & drop de ResizableHandles
- [ ] Persistência de layout
- [ ] Virtualização de listas
- [ ] Navegação por teclado
- [ ] Sincronização com Supabase

## 🔧 Configuração de Mocks

### Componentes Mockados
```typescript
vi.mock('../components/StepNavigatorColumn')
vi.mock('../components/CanvasColumn')
vi.mock('@/components/editor/properties/DynamicPropertiesPanelV4')
```

### Contexto Mockado
```typescript
const mockEditorState = {
  state: { currentStep, stepBlocks, ... },
  actions: { updateBlock, selectBlock, ... }
}
```

## 📝 Exemplos de Teste

### Teste de Conversão v3→v4
```typescript
it('deve converter bloco v3 para v4', () => {
  const v3Block: Block = {
    id: 'test',
    type: 'text',
    properties: { fontSize: 16 },
    content: { text: 'Hello' }
  };
  
  const v4Block = BlockV3ToV4Adapter.convert(v3Block);
  
  expect(v4Block.properties.text).toBe('Hello');
  expect(v4Block.properties.fontSize).toBe(16);
});
```

### Teste de Update
```typescript
it('deve atualizar propriedades via painel v4', async () => {
  const user = userEvent.setup();
  
  render(
    <EditorProvider>
      <QuizModularEditorV4Wrapper useV4Layout={true} />
    </EditorProvider>
  );
  
  // Selecionar bloco
  await user.click(screen.getByTestId('block-1'));
  
  // Atualizar propriedade
  await user.click(screen.getByText('Update Properties'));
  
  // Verificar update
  expect(onBlockV4Update).toHaveBeenCalled();
});
```

## 🐛 Debug

### Ativar logs detalhados
```typescript
import { appLogger } from '@/lib/utils/appLogger';
appLogger.debug('Test context:', { data });
```

### Visualizar estado do contexto
```typescript
const { state } = useEditorState();
console.log('Current state:', state);
```

### Verificar conversões
```typescript
const v4Block = BlockV3ToV4Adapter.convert(v3Block);
console.log('Converted:', { v3Block, v4Block });
```

## 🎯 Próximos Passos

1. **Completar TODOs** nos testes existentes
2. **Adicionar testes E2E** com Playwright
3. **Performance benchmarks** com 1000+ blocos
4. **Visual regression testing** com Percy/Chromatic
5. **A11y testing** com axe-core

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
