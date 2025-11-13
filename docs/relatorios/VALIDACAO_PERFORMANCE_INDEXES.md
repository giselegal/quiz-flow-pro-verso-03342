# Validação de Performance Indexes - Sprint 1

## Instruções de Validação

Execute estas queries no **Supabase SQL Editor** para validar os indexes criados.

---

## Query 1: Verificar Uso dos Índices

```sql
-- View criada pela migration: mostra uso de todos os índices
SELECT * FROM index_usage_stats
ORDER BY idx_scan DESC;
```

**O que verificar:**
- ✅ Índices com prefixo `idx_` devem aparecer na lista
- ✅ `idx_scan` > 0 indica que o índice está sendo usado
- ⚠️  `idx_scan` = 0 indica índice não utilizado (normal logo após criação)

---

## Query 2: Verificar Tamanho das Tabelas

```sql
-- View criada pela migration: mostra tamanho das tabelas e índices
SELECT * FROM table_size_stats
ORDER BY pg_total_relation_size DESC;
```

**O que verificar:**
- ✅ `total_size`: tamanho total (tabela + índices)
- ✅ `table_size`: tamanho apenas da tabela
- ✅ `indexes_size`: tamanho apenas dos índices
- 💡 Índices devem ocupar menos que a tabela principal

---

## Query 3: Listar Todos os Índices Criados

```sql
-- Lista todos os índices com prefixo idx_ (criados pela migration)
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

**Índices esperados:**
- `idx_component_instances_*` (4 índices)
- `idx_quiz_sessions_*` (4 índices)
- `idx_quiz_production_*` (3 índices)
- `idx_funnels_*` (3 índices)
- `idx_health_metrics_*` (2 índices)
- `idx_security_logs_*` (1 índice)
- `idx_rate_limits_*` (1 índice)

**Total esperado:** 18+ índices

---

## Query 4: Verificar Funções de Manutenção

```sql
-- Listar funções criadas pela migration
SELECT 
    proname AS function_name,
    pg_get_function_arguments(oid) AS arguments,
    prosrc AS definition
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN (
    'cleanup_expired_rate_limits',
    'archive_old_sessions'
  );
```

**Funções esperadas:**
- ✅ `cleanup_expired_rate_limits()` - Remove rate limits expirados
- ✅ `archive_old_sessions()` - Arquiva sessões antigas

---

## Query 5: Testar Função de Limpeza

```sql
-- Executar limpeza manual de rate limits expirados
SELECT cleanup_expired_rate_limits();
```

**Resultado esperado:**
- Execução sem erro
- Retorno vazio (função é void)

---

## Query 6: Verificar Estatísticas das Tabelas

```sql
-- Verificar se ANALYZE foi executado
SELECT 
    schemaname,
    tablename,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND tablename IN ('component_instances', 'quiz_sessions', 'quiz_production', 'funnels')
ORDER BY tablename;
```

**O que verificar:**
- ✅ `last_analyze` deve ter timestamp recente (data da migration)
- 💡 Estatísticas atualizadas melhoram planos de query

---

## Query 7: Verificar Performance de Query (Exemplo)

```sql
-- Exemplo: buscar componentes por funnel_id
EXPLAIN ANALYZE
SELECT * FROM component_instances
WHERE funnel_id = 'algum-uuid-aqui'
LIMIT 10;
```

**O que verificar:**
- ✅ Query plan deve mostrar "Index Scan using idx_component_instances_funnel"
- ❌ Se mostrar "Seq Scan", o índice não está sendo usado

---

## Checklist de Validação

Execute no Supabase SQL Editor e marque:

- [ ] Query 1 executada: `SELECT * FROM index_usage_stats`
- [ ] Query 2 executada: `SELECT * FROM table_size_stats`
- [ ] Query 3 executada: Lista de índices verificada
- [ ] Query 4 executada: 2 funções encontradas
- [ ] Query 5 executada: cleanup_expired_rate_limits() sem erro
- [ ] Query 6 executada: Estatísticas atualizadas
- [ ] Query 7 testada: Index sendo usado em query

---

## Troubleshooting

### Problema: Views não existem
```sql
-- Recriar views manualmente
-- Copiar de supabase/migrations/20251110_add_performance_indexes_v2.sql
-- Seções: SECTION 7
```

### Problema: Índices não aparecem
```sql
-- Verificar se migration foi aplicada
SELECT COUNT(*) FROM pg_indexes 
WHERE schemaname = 'public' AND indexname LIKE 'idx_%';
```

### Problema: Índice não sendo usado
```sql
-- Forçar atualização de estatísticas
ANALYZE nome_da_tabela;
```

---

## Relatório de Validação

Após executar todas as queries, preencha:

**Data:** _______________  
**Executado por:** _______________

**Resultados:**
- Índices criados: _____ / 18+
- Funções criadas: _____ / 2
- Views criadas: _____ / 2
- Erros encontrados: _______________

**Observações:**
_______________________________________________
_______________________________________________
_______________________________________________

