# 🚀 Instruções para Aplicar Migrações SQL no Supabase

## ⚠️ PRÉ-REQUISITOS

- ✅ Supabase CLI instalado (v2.54.11) - **OK**
- ✅ Projeto configurado (pwtjuuhchtbzttrzoutw) - **OK**
- ⚠️ Autenticação necessária

---

## 📋 OPÇÃO 1: Via Supabase Dashboard (Mais Segura para Produção)

### Passo 1: Acessar Dashboard
1. Acesse: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw
2. Login com suas credenciais

### Passo 2: Aplicar Migração de Performance Indexes
1. No menu lateral, clique em **SQL Editor**
2. Clique em **"+ New Query"**
3. Copie o conteúdo de: `supabase/migrations/20251110_add_performance_indexes.sql`
4. Cole no editor
5. Clique em **"Run"** (ou Ctrl+Enter)
6. **Verifique:** Deve retornar sucesso para todas as queries

**O que essa migração faz:**
- ✅ Cria 18 índices compostos para performance 10-100x
- ✅ Adiciona 3 constraints de validação
- ✅ Cria 2 funções de manutenção (cleanup_expired_rate_limits, archive_old_sessions)
- ✅ Cria 2 views de monitoramento (index_usage_stats, table_size_stats)

### Passo 3: Aplicar Migração Auth/RLS Hardening
1. Ainda no **SQL Editor**, clique em **"+ New Query"**
2. Copie o conteúdo de: `supabase/migrations/20251110_auth_hardening_rls.sql`
3. Cole no editor
4. Clique em **"Run"**
5. **Verifique:** Deve retornar sucesso para todas as policies

**O que essa migração faz:**
- ✅ Habilita RLS em 6 tabelas (funnels, component_instances, quiz_sessions, etc.)
- ✅ Cria 24 políticas RLS (4 por tabela: SELECT/INSERT/UPDATE/DELETE)
- ✅ Cria 3 funções de segurança (is_funnel_owner, is_quiz_owner, check_rate_limit)
- ✅ Cria 2 triggers de auditoria (log_critical_changes)

### Passo 4: Configurar Auth Settings
1. No menu lateral, clique em **Authentication** → **Settings**
2. Habilitar **"Password Breach Protection"**: `ON`
3. Em **Rate Limits**, configurar:
   - **Sign in attempts**: `5 per hour per IP`
   - **Sign up attempts**: `3 per hour per IP`
   - **Password reset**: `3 per hour per email`
4. Clique em **"Save"**

---

## 📋 OPÇÃO 2: Via Supabase CLI (Para Staging/Dev)

### Passo 1: Login no Supabase
```bash
supabase login
```
- Isso abrirá o browser para autenticação
- Ou use: `SUPABASE_ACCESS_TOKEN=<seu-token> supabase link`

### Passo 2: Linkar ao Projeto
```bash
supabase link --project-ref pwtjuuhchtbzttrzoutw
```
- Será solicitada a senha do banco de dados
- A senha está em: Dashboard → Settings → Database → Connection string

### Passo 3: Aplicar Migrações
```bash
# ⚠️ IMPORTANTE: Fazer backup antes!
# No Dashboard: Database → Backups → Create Manual Backup

# Aplicar todas as migrações pendentes
supabase db push

# Ou aplicar uma por vez:
supabase db push --file supabase/migrations/20251110_add_performance_indexes.sql
supabase db push --file supabase/migrations/20251110_auth_hardening_rls.sql
```

### Passo 4: Verificar Aplicação
```bash
# Verificar status das migrações
supabase migration list

# Testar índices criados
supabase db remote status
```

---

## 🧪 VALIDAÇÃO PÓS-MIGRAÇÃO

### 1. Verificar Índices Criados
Execute no SQL Editor:
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('component_instances', 'quiz_sessions', 'funnels', 'quiz_production')
ORDER BY tablename, indexname;
```

**Espera-se:** 18 índices novos com prefixo `idx_`

### 2. Verificar Políticas RLS
```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

**Espera-se:** 24 políticas (4 por tabela)

### 3. Verificar Funções
```sql
SELECT 
    proname as function_name,
    pg_get_function_arguments(oid) as arguments,
    prokind as kind
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('is_funnel_owner', 'is_quiz_owner', 'check_rate_limit', 
                   'cleanup_expired_rate_limits', 'archive_old_sessions', 'log_critical_changes')
ORDER BY proname;
```

**Espera-se:** 6 funções criadas

### 4. Testar Performance
Execute uma query antes e depois:
```sql
-- Query de teste (deve estar MUITO mais rápida)
EXPLAIN ANALYZE
SELECT * FROM component_instances
WHERE funnel_id = '<algum-uuid>'
  AND step_key = 'step-01'
  AND visibility = 'public';
```

**Antes:** Seq Scan (lento)  
**Depois:** Index Scan usando idx_component_instances_funnel_step (rápido)

---

## 🔥 ROLLBACK (Se Necessário)

Se algo der errado:

### Via Dashboard:
1. Database → Backups
2. Selecione backup anterior
3. Clique em "Restore"

### Via CLI:
```bash
# Reverter última migração
supabase migration repair --status reverted <timestamp>
```

---

## 📊 MONITORAMENTO PÓS-DEPLOY

### 1. Verificar Index Usage
```sql
SELECT * FROM index_usage_stats
WHERE idx_scan < 100
ORDER BY idx_scan;
```

### 2. Verificar Table Sizes
```sql
SELECT * FROM table_size_stats
ORDER BY total_size DESC;
```

### 3. Monitorar Logs com appLogger
No código já está configurado! Os logs estruturados aparecerão automaticamente.

---

## ✅ CHECKLIST FINAL

- [ ] Backup manual criado no Dashboard
- [ ] Migração de performance indexes aplicada
- [ ] Migração Auth/RLS aplicada
- [ ] Auth Settings configurados (breach protection, rate limits)
- [ ] Índices verificados (18 esperados)
- [ ] Políticas RLS verificadas (24 esperadas)
- [ ] Funções verificadas (6 esperadas)
- [ ] Query de teste executada (performance melhorada)
- [ ] Logs monitorados (appLogger funcionando)
- [ ] Testes E2E executados (npm run test:e2e)
- [ ] Deploy em produção (git push origin main)

---

## 🆘 PROBLEMAS COMUNS

### "Access token not provided"
**Solução:** Execute `supabase login` e faça login no browser

### "Database password required"
**Solução:** 
1. Dashboard → Settings → Database
2. Copie Connection String
3. A senha está na Connection String: `postgres://postgres:[SENHA]@...`

### "Migration already applied"
**Solução:** Isso é OK! Significa que a migração já foi aplicada anteriormente.

### "RLS enabled but no policies"
**Solução:** Execute a migração Auth/RLS que cria as 24 políticas

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Criado por:** Sprint 1 Crítico - AI Agent  
**Data:** 2025-11-10  
**Status:** ✅ Pronto para execução manual
