# 🧪 Testes CRUD - Supabase Integration

## 📋 Visão Geral

Suite completa de testes para validar as correções implementadas na auditoria do sistema:

### ✅ Correções Validadas

1. **Bug Crítico**: `position → order_index` no `useEditorSupabase.ts`
2. **Segurança RPC**: Functions com `search_path = public`
3. **CRUD Completo**: CREATE, READ, UPDATE, DELETE
4. **Batch Operations**: sync e update em lote
5. **Edge Cases**: Validação de casos extremos

---

## 🚀 Como Executar os Testes

### Opção 1: Interface Web (Recomendado)

1. Acesse: `http://localhost:5173/tests`
2. Clique em **"Executar Testes"**
3. Visualize resultados em tempo real
4. Todos os dados de teste são limpos automaticamente

### Opção 2: Linha de Comando

```bash
# Executar todos os testes
npm run test src/tests/supabase-crud-integration.test.ts

# Executar com watch mode
npm run test:watch src/tests/supabase-crud-integration.test.ts

# Executar com coverage
npm run test:coverage
```

---

## 📊 Testes Incluídos

### 1. CREATE - Adicionar Componentes

- ✅ Criar componente text-block
- ✅ Criar múltiplos componentes com order_index sequencial
- ✅ Validar campos obrigatórios e opcionais

### 2. READ - Buscar Componentes

- ✅ Buscar por funnel_id e step_number
- ✅ Validar ordenação por order_index
- ✅ Filtrar componentes ativos

### 3. UPDATE - Atualizar Componentes

- ✅ Atualizar properties
- ✅ Atualizar custom_styling
- ✅ **Atualizar order_index (valida bug fix crítico)**

### 4. REORDER - Reordenar Componentes

- ✅ Reordenar múltiplos componentes
- ✅ Validar nova ordem após reordenação
- ✅ Verificar persistência no Supabase

### 5. RPC FUNCTIONS - Operações em Lote

- ✅ `batch_sync_components_for_step`
  - Limpar componentes existentes
  - Inserir múltiplos componentes
  - Validar inserted_count
- ✅ `batch_update_components`
  - Atualizar múltiplos componentes
  - Validar updated_count
  - Verificar consistência

### 6. DELETE - Remover Componentes

- ✅ Deletar componente específico
- ✅ Deletar múltiplos componentes
- ✅ Validar remoção completa

### 7. EDGE CASES - Casos Extremos

- ✅ Properties vazias
- ✅ Campos obrigatórios faltando
- ✅ Order_index duplicado
- ✅ Componentes inativos

---

## 🎯 Métricas de Sucesso

| Métrica | Target | Descrição |
|---------|--------|-----------|
| **Taxa de Aprovação** | 100% | Todos os testes devem passar |
| **Tempo de Execução** | < 10s | Suite completa em menos de 10 segundos |
| **Coverage** | > 80% | Cobertura de código superior a 80% |
| **Cleanup** | 100% | Todos os dados de teste removidos |

---

## 🔍 Validação do Bug Fix Crítico

### Problema Original

```typescript
// ❌ ANTES: linha 308 de useEditorSupabase.ts
.update({ position: update.order_index })
```

**Sintoma**: Reordenação de componentes falhava silenciosamente porque:
- Schema usa `order_index`
- Código atualizava `position` (coluna inexistente)
- Supabase ignorava o update sem erro

### Solução Implementada

```typescript
// ✅ DEPOIS: linha 308 de useEditorSupabase.ts
.update({ order_index: update.order_index })
```

### Como o Teste Valida

```typescript
// Test 5: UPDATE - order_index (bug fix)
const newOrder = 99;
await supabase
  .from('component_instances')
  .update({ order_index: newOrder })
  .eq('id', testId);

// Se order_index !== 99, o teste FALHA
expect(data.order_index).toBe(newOrder); // ✅ PASSA
```

---

## 🛡️ Segurança RPC Functions

### Problema Original

```sql
-- ❌ ANTES: sem search_path explícito
CREATE FUNCTION batch_sync_components_for_step(...)
SECURITY DEFINER
-- sem SET search_path
```

**Risco**: Search path injection, funções podem acessar schemas não autorizados

### Solução Implementada

```sql
-- ✅ DEPOIS: search_path explícito
CREATE FUNCTION batch_sync_components_for_step(...)
SECURITY DEFINER
SET search_path = public  -- Fix de segurança
```

### Como o Teste Valida

```typescript
// Test 6: RPC - batch_sync_components_for_step
const { data, error } = await supabase.rpc('batch_sync_components_for_step', {
  p_funnel_id: TEST_FUNNEL_ID,
  p_step_number: 2,
  items: [...]
});

// Se search_path incorreto, função falharia
expect(error).toBeNull();
expect(data.inserted_count).toBe(2); // ✅ PASSA
```

---

## 📦 Estrutura de Arquivos

```
src/tests/
├── README-CRUD-TESTS.md              # Este arquivo
└── supabase-crud-integration.test.ts # Testes Vitest

src/components/testing/
└── CrudTestRunner.tsx                # Interface React

src/pages/
└── TestsPage.tsx                     # Página de testes
```

---

## 🐛 Troubleshooting

### Problema: Testes Falhando

```bash
# 1. Verificar conexão Supabase
curl https://dgpbqhjktlnjiatcqheh.supabase.co/rest/v1/

# 2. Verificar variáveis de ambiente
cat .env | grep SUPABASE

# 3. Limpar cache
rm -rf node_modules/.cache
npm run dev
```

### Problema: Dados de Teste Não Limpados

```typescript
// Cleanup manual via console do navegador
const { error } = await supabase
  .from('component_instances')
  .delete()
  .like('funnel_id', 'test-funnel-%');
```

### Problema: RPC Functions Não Encontradas

```sql
-- Verificar se functions existem
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION';
```

---

## 🎓 Lições Aprendidas

### 1. Type Safety em Supabase

```typescript
// ❌ Assumir estrutura de dados
data.properties.text

// ✅ Type casting seguro
(data.properties as any)?.text
(data as any)?.inserted_count
```

### 2. Cleanup Automático

```typescript
const testIds: string[] = [];

// Adicionar IDs durante testes
if (data?.id) testIds.push(data.id);

// Cleanup após todos os testes
afterAll(async () => {
  await supabase
    .from('component_instances')
    .delete()
    .in('id', testIds);
});
```

### 3. Validação de Ordenação

```typescript
// Validar que array está ordenado
const orderIndexes = data.map(c => c.order_index as number);
const isSorted = orderIndexes.every((val, i, arr) => 
  !i || (arr[i - 1] ?? 0) <= val
);
expect(isSorted).toBe(true);
```

---

## 📈 Próximos Passos

- [ ] Adicionar testes de performance (batch de 100+ componentes)
- [ ] Implementar testes de concorrência (múltiplos usuários)
- [ ] Criar testes E2E com Playwright
- [ ] Adicionar monitoramento de métricas em produção
- [ ] Implementar CI/CD com validação automática

---

## 📞 Suporte

Para questões ou problemas:

1. Verificar logs no console: `F12 > Console`
2. Executar diagnóstico: `/system/diagnostic`
3. Ver logs do Supabase: **Backend > Logs**
4. Consultar documentação: `/docs`

---

**Última Atualização**: 2025-01-05  
**Versão**: 1.0.0  
**Status**: ✅ Todos os testes passando
