-- RLS Audit: verifica RLS e policies mínimas
-- Requer conexão Postgres (SUPABASE_DB_URL)

\echo '➡️ Verificando RLS em tabelas públicas'
SELECT schemaname, tablename, relrowsecurity
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY 1,2;

\echo '➡️ Listando policies ativas'
SELECT polname, schemaname, tablename, polcmd, polpermissive, polroles
FROM pg_policies
ORDER BY schemaname, tablename, polname;

\echo '➡️ Verificando existência mínima de policies por tabela sensível'
-- Ajuste a lista abaixo conforme seu domínio
WITH sensitive AS (
  SELECT unnest(ARRAY['templates','funnels','users','profiles','results']) AS tablename
)
SELECT s.tablename,
       EXISTS (
         SELECT 1 FROM pg_policies p WHERE p.schemaname='public' AND p.tablename=s.tablename
       ) AS has_policy
FROM sensitive s;
