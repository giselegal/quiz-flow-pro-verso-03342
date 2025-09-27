-- Strengthen RLS for core editor tables: funnels, funnel_pages, component_instances
-- Date: 2025-09-06

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.funnel_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.component_instances ENABLE ROW LEVEL SECURITY;

-- Supportive indexes (no-ops if already present)
CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON public.funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_funnel_pages_funnel_id ON public.funnel_pages(funnel_id);
CREATE INDEX IF NOT EXISTS idx_component_instances_funnel_id ON public.component_instances(funnel_id);
CREATE INDEX IF NOT EXISTS idx_component_instances_created_by ON public.component_instances(created_by);

-- =====================================================================
-- Funnels policies: owner-only access
-- =====================================================================
DO $$ BEGIN
  -- SELECT
  BEGIN
    DROP POLICY IF EXISTS funnels_select_own ON public.funnels;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY funnels_select_own ON public.funnels
    FOR SELECT USING (
      auth.uid() IS NOT NULL AND user_id = auth.uid()
    );

  -- INSERT
  BEGIN
    DROP POLICY IF EXISTS funnels_insert_own ON public.funnels;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY funnels_insert_own ON public.funnels
    FOR INSERT WITH CHECK (
      auth.uid() IS NOT NULL AND user_id = auth.uid()
    );

  -- UPDATE
  BEGIN
    DROP POLICY IF EXISTS funnels_update_own ON public.funnels;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY funnels_update_own ON public.funnels
    FOR UPDATE USING (
      user_id = auth.uid()
    );

  -- DELETE
  BEGIN
    DROP POLICY IF EXISTS funnels_delete_own ON public.funnels;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY funnels_delete_own ON public.funnels
    FOR DELETE USING (
      user_id = auth.uid()
    );
END $$;

-- =====================================================================
-- Funnel pages policies: allowed via parent funnel ownership
-- =====================================================================
DO $$ BEGIN
  -- SELECT
  BEGIN
    DROP POLICY IF EXISTS funnel_pages_select_by_owner ON public.funnel_pages;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY funnel_pages_select_by_owner ON public.funnel_pages
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = funnel_pages.funnel_id AND f.user_id = auth.uid()
      )
    );

  -- INSERT
  BEGIN
    DROP POLICY IF EXISTS funnel_pages_insert_by_owner ON public.funnel_pages;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY funnel_pages_insert_by_owner ON public.funnel_pages
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = funnel_pages.funnel_id AND f.user_id = auth.uid()
      )
    );

  -- UPDATE
  BEGIN
    DROP POLICY IF EXISTS funnel_pages_update_by_owner ON public.funnel_pages;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY funnel_pages_update_by_owner ON public.funnel_pages
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = funnel_pages.funnel_id AND f.user_id = auth.uid()
      )
    );

  -- DELETE
  BEGIN
    DROP POLICY IF EXISTS funnel_pages_delete_by_owner ON public.funnel_pages;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY funnel_pages_delete_by_owner ON public.funnel_pages
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = funnel_pages.funnel_id AND f.user_id = auth.uid()
      )
    );
END $$;

-- =====================================================================
-- Component instances policies: owner (created_by) or parent funnel owner
-- =====================================================================
DO $$ BEGIN
  -- SELECT
  BEGIN
    DROP POLICY IF EXISTS component_instances_select_by_owner ON public.component_instances;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY component_instances_select_by_owner ON public.component_instances
    FOR SELECT USING (
      created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = component_instances.funnel_id AND f.user_id = auth.uid()
      )
    );

  -- INSERT
  BEGIN
    DROP POLICY IF EXISTS component_instances_insert_by_owner ON public.component_instances;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY component_instances_insert_by_owner ON public.component_instances
    FOR INSERT WITH CHECK (
      created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = component_instances.funnel_id AND f.user_id = auth.uid()
      )
    );

  -- UPDATE
  BEGIN
    DROP POLICY IF EXISTS component_instances_update_by_owner ON public.component_instances;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY component_instances_update_by_owner ON public.component_instances
    FOR UPDATE USING (
      created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = component_instances.funnel_id AND f.user_id = auth.uid()
      )
    );

  -- DELETE
  BEGIN
    DROP POLICY IF EXISTS component_instances_delete_by_owner ON public.component_instances;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY component_instances_delete_by_owner ON public.component_instances
    FOR DELETE USING (
      created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = component_instances.funnel_id AND f.user_id = auth.uid()
      )
    );
END $$;
