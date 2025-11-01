-- Utilitário idempotente para garantir triggers de updated_at
-- Executar com psql ou via pipeline antes de scripts que possam recriar triggers

-- 1) Garante a existência da função public.update_updated_at_column()
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'update_updated_at_column'
  ) THEN
    CREATE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = timezone('utc'::text, now());
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END
$$;

-- 2) Função helper para garantir trigger de updated_at por tabela
CREATE OR REPLACE FUNCTION public.ensure_updated_at_trigger(p_table regclass, p_trigger_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = p_trigger_name
      AND tgrelid = p_table
  ) THEN
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()',
      p_trigger_name,
      p_table::text
    );
  END IF;
END;
$$;

-- 3) Garante triggers principais sem recriação/erro
SELECT public.ensure_updated_at_trigger('public.admin_goals'::regclass, 'update_admin_goals_updated_at');
SELECT public.ensure_updated_at_trigger('public.funnels'::regclass, 'update_funnels_updated_at');
SELECT public.ensure_updated_at_trigger('public.ai_optimization_recommendations'::regclass, 'update_ai_optimization_recommendations_updated_at');
SELECT public.ensure_updated_at_trigger('public.rate_limits'::regclass, 'update_rate_limits_updated_at');
