# 🔍 Análise de Erro no Painel de Propriedades - DynamicPropertyControls

**Data**: 24 de novembro de 2025  
**Componente Principal**: `DynamicPropertyControls.tsx`  
**Escopo**: Painel de propriedades do editor modular (PropertiesColumn)

---

## 📋 Resumo Executivo

Foi identificado e corrigido um bug crítico no controle de propriedades booleanas (`toggle`) do painel de propriedades, que afetava a persistência e visualização de valores `false` vindos de modelos JSON/Supabase.

**Status**: ✅ **Resolvido e validado com testes automatizados**

---

## 🐛 Erro Identificado

### Descrição do Problema

O controle `toggle` (switch) no `DynamicPropertyControls` não respeitava valores booleanos `false` vindo do modelo de dados (Supabase/JSON), sempre aplicando o valor `default` do schema mesmo quando o valor salvo era explicitamente `false`.

### Impacto

- **Componentes afetados**: 
  - `DynamicPropertyControls.tsx` (controle base)
  - `PropertiesColumn` (QuizModularEditor)
  - `EditorPropertiesPanel` (editor legado)
  - `EditorModular` (playground de schemas)

- **Sintomas observados**:
  - Switch sempre aparecia "ligado" mesmo quando o valor no banco/JSON era `false`
  - Após salvar uma propriedade como `false` e reabrir o painel, o switch voltava para `true`
  - Inconsistência entre dados persistidos e UI renderizada

### Causa Técnica

```tsx
// ❌ CÓDIGO INCORRETO (linha ~193 do DynamicPropertyControls.tsx)
case 'toggle':
  return (
    <Switch
      checked={value || schema.default || false}  // ⚠️ BUG AQUI
      onCheckedChange={handleChange}
    />
  );
```

**Problema**: O operador `||` trata `false` como valor falsy, fazendo com que:
- `false || true` → `true` (ignora o valor `false` e usa o default)
- Qualquer propriedade booleana com `default: true` nunca conseguia ser desligada visualmente

---

## ✅ Correção Aplicada

### Código Corrigido

```tsx
// ✅ CÓDIGO CORRETO
case 'toggle':
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={propertyKey}
        checked={
          typeof value === 'boolean'
            ? value
            : (typeof schema.default === 'boolean' ? schema.default : false)
        }
        onCheckedChange={handleChange}
      />
      <span className="text-sm text-muted-foreground">
        {value ? 'Ativado' : 'Desativado'}
      </span>
    </div>
  );
```

**Solução**: Verificação explícita de tipo antes de aplicar fallback:
1. Se `value` é boolean (incluindo `false`), usa o valor diretamente
2. Só aplica `schema.default` se `value` for `undefined` ou outro tipo
3. Fallback final para `false` se nem valor nem default forem booleanos

---

## 🧪 Testes Automatizados Criados

### 1. Testes Unitários - DynamicPropertyControls

**Arquivo**: `src/components/editor/__tests__/DynamicPropertyControls.test.tsx`

```typescript
it('deve respeitar valor booleano false mesmo com default true', () => {
  const mockSchema = {
    type: 'boolean-block',
    label: 'Boolean Block',
    category: 'content',
    properties: {
      showDescription: {
        type: 'boolean',
        control: 'toggle',
        label: 'Mostrar Descrição',
        default: true,  // ⚠️ Default é true
      },
    },
  };

  const properties = {
    showDescription: false,  // ✅ Mas valor atual é false
  };

  render(
    <DynamicPropertyControls
      elementType="boolean-block"
      properties={properties}
      onChange={mockOnChange}
    />
  );

  const toggle = screen.getByRole('switch');
  expect(toggle).toHaveAttribute('aria-checked', 'false');  // ✅ Deve mostrar false

  fireEvent.click(toggle);
  expect(mockOnChange).toHaveBeenCalledWith('showDescription', true);
});
```

**Resultado**: ✅ **5/5 testes passando**

---

### 2. Testes de Integração - PropertiesColumn

**Arquivo**: `src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/__tests__/PropertiesColumn.new.test.tsx`

#### Teste 1: Boolean false do modelo JSON/Supabase

```typescript
it('deve respeitar valor booleano false vindo do modelo JSON', () => {
  const mockBlock = {
    id: 'block-boolean-1',
    type: 'quiz:boolean-block',
    order: 0,
    properties: { showDescription: false },  // Simula dado vindo do Supabase
    content: {},
  } as any;

  const mockSchema = {
    type: 'quiz:boolean-block',
    properties: {
      showDescription: {
        type: 'boolean',
        control: 'toggle',
        label: 'Mostrar Descrição',
        default: true,
      },
    },
  };

  (schemaInterpreter.getBlockSchema as any).mockReturnValue(mockSchema);
  (normalizeBlockData as any).mockReturnValue(mockBlock);

  render(
    <PropertiesColumn
      selectedBlock={mockBlock}
      onBlockUpdate={mockOnBlockUpdate}
      onClearSelection={mockOnClearSelection}
    />
  );

  const toggle = screen.getByRole('switch');
  expect(toggle).toHaveAttribute('aria-checked', 'false');

  // Alternar e salvar
  fireEvent.click(toggle);
  const saveButton = screen.getByText(/Salvar Alterações/i);
  fireEvent.click(saveButton);

  expect(mockOnBlockUpdate).toHaveBeenCalledWith(
    'block-boolean-1',
    expect.objectContaining({
      properties: expect.objectContaining({ showDescription: true }),
    })
  );
});
```

#### Teste 2: Lista de opções (options-list) do modelo JSON

```typescript
it('deve renderizar e persistir lista de opções (options-list) do modelo JSON', () => {
  const mockBlock = {
    id: 'block-options-1',
    type: 'quiz:options-grid',
    order: 0,
    properties: {
      options: [
        { id: 'opt-1', text: 'Opção 1', value: 'option-1' },
        { id: 'opt-2', text: 'Opção 2', value: 'option-2' },
      ],
    },
    content: {},
  } as any;

  // ... renderização e validação

  expect(screen.getByDisplayValue('Opção 1')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Opção 2')).toBeInTheDocument();

  // Editar primeira opção
  const firstOptionInput = screen.getByDisplayValue('Opção 1');
  fireEvent.change(firstOptionInput, { target: { value: 'Opção 1 editada' } });

  const saveButton = screen.getByText(/Salvar Alterações/i);
  fireEvent.click(saveButton);

  expect(mockOnBlockUpdate).toHaveBeenCalledWith(
    'block-options-1',
    expect.objectContaining({
      properties: expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({ text: 'Opção 1 editada' }),
        ]),
      }),
    })
  );
});
```

**Resultado**: ✅ **5/5 testes de integração passando**

---

## 🔄 Fluxo de Dados Validado

### JSON/Supabase → Editor → Painel → Persistência

```
┌─────────────────┐
│  Supabase/JSON  │
│  (Backend)      │
└────────┬────────┘
         │
         │ Carrega bloco
         │ { type, properties: { showDescription: false }, ... }
         ▼
┌─────────────────────────┐
│  normalizeBlockData     │
│  (BlockDataNormalizer)  │
└────────┬────────────────┘
         │
         │ Bloco normalizado
         ▼
┌─────────────────────────┐
│  PropertiesColumn       │
│  selectedBlock prop     │
└────────┬────────────────┘
         │
         │ Busca schema
         │ schemaInterpreter.getBlockSchema(type)
         ▼
┌─────────────────────────┐
│  DynamicPropertyControls│
│  elementType, properties│
└────────┬────────────────┘
         │
         │ Renderiza controles baseados em schema
         │ ✅ CORREÇÃO: Respeita boolean false
         ▼
┌─────────────────────────┐
│  PropertyControl        │
│  (toggle/text/etc)      │
└────────┬────────────────┘
         │
         │ onChange → handlePropertyChange
         │ Marca isDirty = true
         ▼
┌─────────────────────────┐
│  Botão "Salvar"         │
│  handleSave()           │
└────────┬────────────────┘
         │
         │ onBlockUpdate(id, updatedBlock)
         │ ✅ Propriedades corretas incluindo false
         ▼
┌─────────────────────────┐
│  Event Bus / Context    │
│  Atualiza store         │
└────────┬────────────────┘
         │
         │ Persiste no backend
         ▼
┌─────────────────┐
│  Supabase       │
│  (Salvo)        │
└─────────────────┘
```

---

## 📊 Análise de Componentes e Camadas

### 1. Tipos de Dados (Objeto vs Array)

**✅ Validado**: 
- `options-list` trata arrays corretamente: `Array.isArray(value) ? value : []`
- `json-editor` aceita tanto objeto quanto string JSON
- Não há risco de quebra por tipo incompatível

### 2. Renderização e Performance

**Análise**:
- `DynamicPropertyControls` é stateless (não usa `useState`)
- Re-renderiza apenas quando `properties` (prop) muda
- Pais (`PropertiesColumn`) controlam o estado local (`editedProperties`)

**Não foram encontradas**:
- Camadas desnecessárias de renderização
- Problemas de memoization incorreta
- Loops de re-render

### 3. Schema e Validação

**Mapeamento de tipos**:
```typescript
function normalizeControlType(control: string | undefined): string {
  const mapping: Record<string, string> = {
    'select': 'dropdown',
    'color': 'color-picker',
    'boolean': 'toggle',
    'json': 'json-editor',
    'range': 'range',
    'options-list': 'options-list',
  };
  return mapping[control] || control;
}
```

**✅ Validado**: O mapeamento está correto e cobre os tipos principais do `blockPropertySchemas.ts`

### 4. Modelo JSON e Supabase

**Estrutura esperada**:
```typescript
interface Block {
  id: string;
  type: BlockType;  // Deve estar registrado no schemaInterpreter
  order: number;
  properties: Record<string, any>;
  content: BlockContent;
}
```

**Possíveis erros de integração** (não encontrados neste caso, mas atenção para):
- ❌ `type` do bloco diferente da chave do schema → fallback "Schema não encontrado"
- ❌ Propriedades com nomes diferentes entre schema e modelo → campos vazios
- ❌ Arrays salvos como string JSON no Supabase → `options-list` mostra vazio

---

## 🎯 Conclusão e Recomendações

### Erros Corrigidos

1. ✅ **Toggle boolean**: Valores `false` agora são respeitados
2. ✅ **Type safety**: Mocks de teste alinhados com tipo `Block`
3. ✅ **Matchers de teste**: `@testing-library/jest-dom/vitest` adicionado

### Cobertura de Testes

- ✅ Testes unitários de `DynamicPropertyControls`: 5/5 passando
- ✅ Testes de integração `PropertiesColumn`: 5/5 passando
- ✅ Cenários cobertos:
  - Boolean `false` com `default: true`
  - Lista de opções (array)
  - Texto simples
  - Fallback de schema não encontrado
  - Fluxo completo de edição → salvamento

### Próximos Passos Sugeridos

1. **Adicionar validação Zod** (opcional):
   - Criar schemas Zod para validar propriedades antes de salvar
   - Exemplo: `z.object({ showDescription: z.boolean() })`

2. **Testes E2E** (se necessário):
   - Playwright testando o fluxo real: abrir editor → editar propriedade → salvar → recarregar
   - Validar que dados persistem corretamente no Supabase

3. **Monitoramento**:
   - Adicionar logs específicos em `handleSave` do `PropertiesColumn`
   - Telemetria para rastrear falhas de persistência

### Comandos para Rodar Testes

```bash
# Testes unitários DynamicPropertyControls
npm test -- DynamicPropertyControls.test.tsx --run

# Testes de integração PropertiesColumn
npm test -- PropertiesColumn.new.test.tsx --run

# Todos os testes do painel de propriedades
npm test -- "Properties" --run
```

---

## 📝 Checklist de Validação

- [x] Identificar erro específico no painel de propriedades
- [x] Analisar componentes e fluxo de dados (DynamicPropertyControls, PropertiesColumn, pais)
- [x] Verificar renderização condicional e mapeamento de controles
- [x] Validar fluxo JSON/Supabase → normalização → schema → UI
- [x] Corrigir bug de boolean false vs default
- [x] Criar testes unitários para DynamicPropertyControls
- [x] Criar testes de integração para PropertiesColumn
- [x] Validar persistência de dados (boolean, array, string)
- [x] Documentar erro, causa, correção e testes
- [x] Executar e validar todos os testes (10/10 passando)

---

**Assinado**: GitHub Copilot  
**Última atualização**: 24/11/2025 22:00 UTC
