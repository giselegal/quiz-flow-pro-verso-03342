# 🗄️ Sprint 2 - Passo 1: Documentação do Schema

**Status:** 🟡 AGUARDANDO EXECUÇÃO MANUAL  
**Responsável:** Usuário (giselegal)  
**Estimativa:** 15-20 minutos

---

## 📋 Instruções

Você precisa executar **5 queries SQL** no Supabase Dashboard para mapear o schema real do banco.

### Acesso ao Supabase SQL Editor

1. Abrir: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw/sql/new
2. Ou: Dashboard → SQL Editor → New Query

---

## 🔍 Query 1/5: Schema Completo (PRINCIPAL)

**Cole e execute:**

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

**Ação após executar:**
1. Click em **"Download CSV"** ou copie todos os resultados
2. Cole em um arquivo `schema_completo.txt` ou planilha
3. Isso será usado para criar a migration RLS correta

**O que procurar:**
- Quantas tabelas existem?
- Quais colunas cada tabela tem?
- Tipos de dados (UUID, TEXT, INTEGER, etc)

---

## 📊 Query 2/5: Lista de Tabelas

**Cole e execute:**

```sql
SELECT 
    table_name,
    COUNT(*) AS total_columns
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;
```

**O que anotar:**
- Nome de todas as tabelas
- Quantas colunas cada uma tem

**Exemplo esperado:**
```
funnels               | 10
component_instances   | 15
quiz_sessions         | 8
...
```

---

## 🔐 Query 3/5: Colunas de Ownership (CRÍTICO!)

**Cole e execute:**

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

**⚠️ ISSO É CRÍTICO!**
- Precisamos saber **exatamente** qual coluna existe em cada tabela
- Se não aparecer nenhuma linha, significa que NENHUMA tabela tem essas colunas
- Nesse caso, vamos precisar identificar como ownership é gerenciado

**Anotar:**
- Quais tabelas TÊM colunas de ownership?
- Nome exato da coluna (user_id? owner_id? created_by?)
- Tipo de dado (UUID? TEXT? INTEGER?)

---

## 🔑 Query 4/5: Chaves Primárias

**Cole e execute:**

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

**O que anotar:**
- PK de cada tabela
- Tipo de dado (UUID é melhor para RLS)

---

## 🔗 Query 5/5: Foreign Keys

**Cole e execute:**

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

**O que anotar:**
- Como tabelas se relacionam
- Relações que envolvem users/auth

---

## 📝 Formato de Resposta

**Após executar todas as queries, me envie:**

### Opção 1: Resumo Rápido

```
TABELAS ENCONTRADAS:
- funnels (10 colunas)
- component_instances (15 colunas)
- ...

COLUNAS DE OWNERSHIP:
- funnels.user_id (UUID)
- component_instances.owner_id (TEXT)
- ...

OU: "Nenhuma coluna de ownership encontrada"
```

### Opção 2: Arquivo Completo

- Salve resultado da Query 1 em arquivo
- Me envie o conteúdo ou anexo

### Opção 3: Screenshot

- Tire prints das queries 2, 3, 4, 5
- Me mostre os resultados

---

## ⏭️ Próximos Passos Automáticos

Assim que você me enviar os resultados, eu vou:

1. ✅ Analisar schema real
2. ✅ Criar migration RLS correta (sem assumir colunas)
3. ✅ Implementar policies baseadas em ownership real
4. ✅ Continuar automaticamente com Sprint 2

---

## ⏱️ Tempo Estimado

- Executar 5 queries: **5 min**
- Copiar resultados: **5 min**
- Analisar e me enviar: **5 min**
- **Total: 15 minutos**

---

## 🚨 Problemas Comuns

**Se der erro "relation does not exist":**
- Significa que não há tabelas no schema `public`
- Verificar se tabelas estão em outro schema
- Executar: `SELECT schemaname FROM pg_tables;`

**Se Query 3 retornar vazio:**
- OK! Significa que ownership é gerenciado de outra forma
- Vamos investigar na Query 1 completa

**Se demorar muito:**
- Queries são rápidas (< 1 segundo cada)
- Se travar, recarregue página e tente novamente

---

## ✅ Checklist

Execute e marque:

- [ ] Query 1 executada e resultado salvo
- [ ] Query 2 executada (lista de tabelas)
- [ ] Query 3 executada (ownership - CRÍTICO)
- [ ] Query 4 executada (PKs)
- [ ] Query 5 executada (FKs)
- [ ] Resultados enviados para o Copilot

---

**Quando estiver pronto, me envie os resultados e eu continuo automaticamente! 🚀**
