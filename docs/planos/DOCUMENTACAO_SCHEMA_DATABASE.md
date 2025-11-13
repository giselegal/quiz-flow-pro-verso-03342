# Documentação do Schema do Banco de Dados

## Objetivo

Mapear todas as tabelas e colunas do banco Supabase para:
- Entender estrutura real do database
- Preparar Sprint 2 (Auth & RLS)
- Identificar colunas de ownership (user_id, owner_id, etc)

---

## Query Principal: Mapear Todas as Tabelas e Colunas

Execute no **Supabase SQL Editor**:

```sql
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

**Resultado esperado:**
- Lista completa de todas as tabelas do schema `public`
- Todas as colunas de cada tabela
- Tipos de dados de cada coluna

---

## Query Complementar 1: Listar Apenas Tabelas

```sql
SELECT 
    table_name,
    COUNT(*) AS total_columns
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;
```

**O que verificar:**
- Quais tabelas existem no banco
- Quantas colunas cada tabela tem

---

## Query Complementar 2: Identificar Colunas de Ownership

```sql
SELECT DISTINCT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN (
    'user_id', 
    'owner_id', 
    'created_by', 
    'author_id',
    'updated_by'
  )
ORDER BY table_name, column_name;
```

**O que verificar:**
- Quais tabelas têm colunas de ownership
- Qual o nome correto da coluna (user_id vs owner_id)
- Tipo de dado (TEXT vs UUID)

---

## Query Complementar 3: Verificar Chaves Primárias

```sql
SELECT
    tc.table_name,
    kcu.column_name,
    c.data_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.columns c
    ON c.table_name = tc.table_name
    AND c.column_name = kcu.column_name
    AND c.table_schema = tc.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

**O que verificar:**
- Chaves primárias de cada tabela
- Tipo de dado das PKs (UUID vs INTEGER vs TEXT)

---

## Query Complementar 4: Verificar Foreign Keys

```sql
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;
```

**O que verificar:**
- Relações entre tabelas
- Quais tabelas referenciam outras

---

## Query Complementar 5: Verificar Tabelas com Timestamps

```sql
SELECT DISTINCT
    table_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN ('created_at', 'updated_at', 'deleted_at')
GROUP BY table_name
HAVING COUNT(DISTINCT column_name) >= 2
ORDER BY table_name;
```

**O que verificar:**
- Tabelas com timestamps (created_at, updated_at)
- Tabelas com soft delete (deleted_at)

---

## Template de Documentação

Após executar as queries, preencha:

### Tabela: `funnels`

**Colunas:**
- `id` (UUID) - PK
- `nome_coluna_ownership` (TEXT/UUID) - Ownership
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- ...

**Foreign Keys:**
- Nenhuma / Lista de FKs

**Indexes:**
- Lista de índices existentes

**RLS Status:**
- ✅ Habilitado / ❌ Desabilitado

---

### Tabela: `component_instances`

**Colunas:**
- ...

(Repetir para cada tabela)

---

## Checklist de Documentação

Execute no Supabase e marque:

- [ ] Query principal executada: Schema completo exportado
- [ ] Query 1: Lista de tabelas obtida
- [ ] Query 2: Colunas de ownership identificadas
- [ ] Query 3: Chaves primárias mapeadas
- [ ] Query 4: Foreign keys documentadas
- [ ] Query 5: Tabelas com timestamps listadas
- [ ] Documentação estruturada criada

---

## Próximos Passos

Após documentar o schema:

1. **Criar migration RLS correta**
   - Usar nomes reais de colunas
   - Baseada em estrutura real
   - Sem assumir colunas inexistentes

2. **Identificar tabelas críticas**
   - Quais precisam de RLS
   - Quais são apenas lookup/reference

3. **Mapear fluxo de ownership**
   - Como usuários se relacionam com dados
   - Hierarquia de permissões

---

## Exportar Resultados

Para salvar os resultados:

1. Execute cada query no Supabase SQL Editor
2. Click em "Download CSV" ou copie resultado
3. Cole em planilha ou arquivo markdown
4. Organize por tabela

---

## Relatório de Schema

**Data de Execução:** _______________  
**Total de Tabelas:** _______________  
**Tabelas com Ownership:** _______________  
**Tabelas sem RLS:** _______________

**Observações:**
_______________________________________________
_______________________________________________
_______________________________________________

