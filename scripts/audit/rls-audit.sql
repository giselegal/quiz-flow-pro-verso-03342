-- ============================================================================
-- RLS Audit: verifica RLS e policies mínimas
-- Requer conexão Postgres (SUPABASE_DB_URL)
-- Data: 2025-11-28 (atualizado)
-- ============================================================================

\echo ''
\echo '============================================================================'
\echo '                    AUDITORIA DE RLS (Row Level Security)                  '
\echo '============================================================================'
\echo ''

-- ============================================================================
-- SEÇÃO 1: Verificar RLS em todas as tabelas públicas
-- ============================================================================
\echo '➡️ [1/6] Verificando RLS em tabelas públicas'
SELECT 
  schemaname,
  tablename,
  CASE WHEN relrowsecurity THEN '✅ ATIVO' ELSE '❌ INATIVO' END AS rls_status
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY relrowsecurity ASC, tablename;

-- ============================================================================
-- SEÇÃO 2: Contagem de tabelas com/sem RLS
-- ============================================================================
\echo ''
\echo '➡️ [2/6] Resumo de RLS por status'
SELECT 
  CASE WHEN relrowsecurity THEN 'RLS Ativo' ELSE 'RLS Inativo' END AS status,
  COUNT(*) AS total_tabelas
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
GROUP BY relrowsecurity
ORDER BY relrowsecurity DESC;

-- ============================================================================
-- SEÇÃO 3: Tabelas SEM RLS que podem conter dados sensíveis
-- ============================================================================
\echo ''
\echo '➡️ [3/6] ⚠️ Tabelas públicas SEM RLS ativado (requer atenção)'
SELECT 
  tablename,
  '⚠️ VERIFICAR' AS acao_recomendada
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' 
  AND c.relkind = 'r' 
  AND NOT relrowsecurity
ORDER BY tablename;

-- ============================================================================
-- SEÇÃO 4: Listagem completa de policies ativas
-- ============================================================================
\echo ''
\echo '➡️ [4/6] Listando todas as policies ativas'
SELECT 
  tablename,
  polname AS policy_name,
  CASE polcmd 
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
    ELSE polcmd
  END AS operation,
  CASE polpermissive WHEN true THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END AS tipo
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, polname;

-- ============================================================================
-- SEÇÃO 5: Verificar cobertura de policies por operação CRUD
-- ============================================================================
\echo ''
\echo '➡️ [5/6] Cobertura de policies por tabela e operação'
WITH tabelas AS (
  SELECT tablename 
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r' AND relrowsecurity = true
),
operations AS (
  SELECT unnest(ARRAY['r', 'a', 'w', 'd']) AS op,
         unnest(ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE']) AS op_name
)
SELECT 
  t.tablename,
  o.op_name AS operation,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_policies p 
    WHERE p.schemaname='public' 
      AND p.tablename=t.tablename 
      AND (p.polcmd = o.op OR p.polcmd = '*')
  ) THEN '✅' ELSE '❌' END AS has_policy
FROM tabelas t
CROSS JOIN operations o
ORDER BY t.tablename, o.op;

-- ============================================================================
-- SEÇÃO 6: Verificar tabelas sensíveis conhecidas
-- ============================================================================
\echo ''
\echo '➡️ [6/6] Status de tabelas sensíveis do domínio'
WITH sensitive AS (
  SELECT unnest(ARRAY[
    'funnels', 
    'quiz_production', 
    'component_instances',
    'templates',
    'users',
    'profiles',
    'results',
    'sessions',
    'quiz_sessions',
    'quiz_results',
    'step_responses',
    'funnel_analytics',
    'drafts'
  ]) AS tablename
),
table_exists AS (
  SELECT tablename, relrowsecurity
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r'
)
SELECT 
  s.tablename,
  CASE WHEN te.tablename IS NULL THEN '❓ NÃO EXISTE' 
       WHEN te.relrowsecurity THEN '✅ RLS ATIVO'
       ELSE '❌ RLS INATIVO'
  END AS status,
  COALESCE((
    SELECT COUNT(*) 
    FROM pg_policies p 
    WHERE p.schemaname='public' AND p.tablename=s.tablename
  ), 0) AS policy_count
FROM sensitive s
LEFT JOIN table_exists te ON te.tablename = s.tablename
ORDER BY 
  CASE WHEN te.tablename IS NULL THEN 2
       WHEN te.relrowsecurity THEN 0
       ELSE 1
  END,
  s.tablename;

\echo ''
\echo '============================================================================'
\echo '                    FIM DA AUDITORIA DE RLS                               '
\echo '============================================================================'
\echo ''
