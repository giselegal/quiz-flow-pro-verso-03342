-- ============================================================================
-- Migration: Consolidated RLS Policies Review
-- Date: 2025-12-03
-- Description: Audit and consolidate RLS policies for all tables
--              Ensures all tables have proper owner-based access control
-- Author: Supabase Audit
-- ============================================================================

-- ============================================================================
-- SECTION 1: VERIFY RLS IS ENABLED ON ALL TABLES
-- ============================================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    RAISE NOTICE '🔒 RLS Policy Audit Starting...';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    
    FOR r IN 
        SELECT 
            tablename,
            rowsecurity
        FROM pg_tables pt
        JOIN pg_class c ON c.relname = pt.tablename
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE pt.schemaname = 'public' 
        AND n.nspname = 'public'
        AND c.relkind = 'r'
        ORDER BY tablename
    LOOP
        IF r.rowsecurity THEN
            RAISE NOTICE '✅ % - RLS ENABLED', r.tablename;
        ELSE
            RAISE NOTICE '❌ % - RLS DISABLED (VULNERABLE!)', r.tablename;
        END IF;
    END LOOP;
    
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;


-- ============================================================================
-- SECTION 2: ENSURE quiz_drafts HAS PROPER RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE IF EXISTS quiz_drafts ENABLE ROW LEVEL SECURITY;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON quiz_drafts;
DROP POLICY IF EXISTS "Enable insert for all users" ON quiz_drafts;
DROP POLICY IF EXISTS "Enable update for all users" ON quiz_drafts;
DROP POLICY IF EXISTS "Enable delete for all users" ON quiz_drafts;

-- Drop any existing owner policies to recreate cleanly
DROP POLICY IF EXISTS "quiz_drafts_owner_select" ON quiz_drafts;
DROP POLICY IF EXISTS "quiz_drafts_owner_insert" ON quiz_drafts;
DROP POLICY IF EXISTS "quiz_drafts_owner_update" ON quiz_drafts;
DROP POLICY IF EXISTS "quiz_drafts_owner_delete" ON quiz_drafts;

-- Create owner-based policies
CREATE POLICY "quiz_drafts_owner_select"
    ON quiz_drafts FOR SELECT
    TO authenticated
    USING (user_id = auth.uid()::text);

CREATE POLICY "quiz_drafts_owner_insert"
    ON quiz_drafts FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "quiz_drafts_owner_update"
    ON quiz_drafts FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid()::text);

CREATE POLICY "quiz_drafts_owner_delete"
    ON quiz_drafts FOR DELETE
    TO authenticated
    USING (user_id = auth.uid()::text);

RAISE NOTICE '✅ quiz_drafts RLS policies configured';


-- ============================================================================
-- SECTION 3: ENSURE quiz_production HAS PROPER RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE IF EXISTS quiz_production ENABLE ROW LEVEL SECURITY;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON quiz_production;
DROP POLICY IF EXISTS "Enable insert for all users" ON quiz_production;
DROP POLICY IF EXISTS "Enable update for all users" ON quiz_production;
DROP POLICY IF EXISTS "Enable delete for all users" ON quiz_production;

-- Drop any existing policies to recreate cleanly
DROP POLICY IF EXISTS "quiz_production_owner_select" ON quiz_production;
DROP POLICY IF EXISTS "quiz_production_owner_insert" ON quiz_production;
DROP POLICY IF EXISTS "quiz_production_owner_update" ON quiz_production;
DROP POLICY IF EXISTS "quiz_production_owner_delete" ON quiz_production;
DROP POLICY IF EXISTS "quiz_production_public_read" ON quiz_production;

-- Owner can manage their production quizzes
CREATE POLICY "quiz_production_owner_select"
    ON quiz_production FOR SELECT
    TO authenticated
    USING (user_id = auth.uid()::text);

CREATE POLICY "quiz_production_owner_insert"
    ON quiz_production FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "quiz_production_owner_update"
    ON quiz_production FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid()::text);

CREATE POLICY "quiz_production_owner_delete"
    ON quiz_production FOR DELETE
    TO authenticated
    USING (user_id = auth.uid()::text);

-- Public can read published production quizzes (for quiz participants)
CREATE POLICY "quiz_production_public_read"
    ON quiz_production FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

RAISE NOTICE '✅ quiz_production RLS policies configured';


-- ============================================================================
-- SECTION 4: ENSURE quiz_events HAS PROPER RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE IF EXISTS quiz_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON quiz_events;
DROP POLICY IF EXISTS "Enable insert for all users" ON quiz_events;
DROP POLICY IF EXISTS "quiz_events_insert_all" ON quiz_events;
DROP POLICY IF EXISTS "quiz_events_select_service" ON quiz_events;

-- Anyone can insert events (for tracking)
CREATE POLICY "quiz_events_insert_all"
    ON quiz_events FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only service_role can read events (for analytics)
CREATE POLICY "quiz_events_select_service"
    ON quiz_events FOR SELECT
    USING (
        auth.role() = 'service_role'
    );

RAISE NOTICE '✅ quiz_events RLS policies configured';


-- ============================================================================
-- SECTION 5: ENSURE quiz_definitions HAS PROPER RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE IF EXISTS quiz_definitions ENABLE ROW LEVEL SECURITY;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON quiz_definitions;
DROP POLICY IF EXISTS "Enable insert for all users" ON quiz_definitions;
DROP POLICY IF EXISTS "Enable update for all users" ON quiz_definitions;
DROP POLICY IF EXISTS "Enable delete for all users" ON quiz_definitions;

-- Drop any existing policies
DROP POLICY IF EXISTS "quiz_definitions_authenticated_all" ON quiz_definitions;

-- Authenticated users can manage quiz definitions
CREATE POLICY "quiz_definitions_authenticated_all"
    ON quiz_definitions FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

RAISE NOTICE '✅ quiz_definitions RLS policies configured';


-- ============================================================================
-- SECTION 6: ENSURE outcomes HAS PROPER RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE IF EXISTS outcomes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON outcomes;
DROP POLICY IF EXISTS "Enable insert for all users" ON outcomes;
DROP POLICY IF EXISTS "Enable update for all users" ON outcomes;
DROP POLICY IF EXISTS "Enable delete for all users" ON outcomes;
DROP POLICY IF EXISTS "outcomes_authenticated_all" ON outcomes;

-- Authenticated users can manage outcomes
CREATE POLICY "outcomes_authenticated_all"
    ON outcomes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Anonymous can read outcomes (for quiz results display)
CREATE POLICY "outcomes_public_read"
    ON outcomes FOR SELECT
    TO anon
    USING (true);

RAISE NOTICE '✅ outcomes RLS policies configured';


-- ============================================================================
-- SECTION 7: ENSURE component_types HAS PROPER RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE IF EXISTS component_types ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON component_types;
DROP POLICY IF EXISTS "Enable insert for all users" ON component_types;
DROP POLICY IF EXISTS "Enable update for all users" ON component_types;
DROP POLICY IF EXISTS "Enable delete for all users" ON component_types;
DROP POLICY IF EXISTS "component_types_read_all" ON component_types;
DROP POLICY IF EXISTS "component_types_write_authenticated" ON component_types;

-- Anyone can read component types (they are like a schema)
CREATE POLICY "component_types_read_all"
    ON component_types FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only authenticated can modify
CREATE POLICY "component_types_write_authenticated"
    ON component_types FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

RAISE NOTICE '✅ component_types RLS policies configured';


-- ============================================================================
-- SECTION 8: ENSURE component_presets HAS PROPER RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE IF EXISTS component_presets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON component_presets;
DROP POLICY IF EXISTS "Enable insert for all users" ON component_presets;
DROP POLICY IF EXISTS "Enable update for all users" ON component_presets;
DROP POLICY IF EXISTS "Enable delete for all users" ON component_presets;
DROP POLICY IF EXISTS "component_presets_read_all" ON component_presets;
DROP POLICY IF EXISTS "component_presets_owner_write" ON component_presets;

-- Anyone can read presets
CREATE POLICY "component_presets_read_all"
    ON component_presets FOR SELECT
    TO anon, authenticated
    USING (true);

-- Owner can write their presets
CREATE POLICY "component_presets_owner_write"
    ON component_presets FOR ALL
    TO authenticated
    USING (created_by = auth.uid()::text OR created_by IS NULL)
    WITH CHECK (created_by = auth.uid()::text OR created_by IS NULL);

RAISE NOTICE '✅ component_presets RLS policies configured';


-- ============================================================================
-- SECTION 9: ENSURE calculation_audit HAS PROPER RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE IF EXISTS calculation_audit ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "calculation_audit_service_only" ON calculation_audit;

-- Only service_role can access audit data
CREATE POLICY "calculation_audit_service_only"
    ON calculation_audit FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

RAISE NOTICE '✅ calculation_audit RLS policies configured';


-- ============================================================================
-- SECTION 10: ENSURE user_results HAS PROPER RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE IF EXISTS user_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON user_results;
DROP POLICY IF EXISTS "Enable insert for all users" ON user_results;
DROP POLICY IF EXISTS "user_results_owner_read" ON user_results;
DROP POLICY IF EXISTS "user_results_insert_all" ON user_results;

-- Owner can read their results
CREATE POLICY "user_results_owner_read"
    ON user_results FOR SELECT
    TO authenticated
    USING (user_id = auth.uid()::text OR user_id IS NULL);

-- Anyone can insert results
CREATE POLICY "user_results_insert_all"
    ON user_results FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

RAISE NOTICE '✅ user_results RLS policies configured';


-- ============================================================================
-- SECTION 11: FINAL VERIFICATION
-- ============================================================================

DO $$
DECLARE
    policy_count INTEGER;
    table_count INTEGER;
BEGIN
    -- Count tables with RLS
    SELECT COUNT(*) INTO table_count
    FROM pg_tables pt
    JOIN pg_class c ON c.relname = pt.tablename
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE pt.schemaname = 'public' 
    AND n.nspname = 'public'
    AND c.relkind = 'r'
    AND c.relrowsecurity = true;
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public';
    
    RAISE NOTICE '';
    RAISE NOTICE '╔══════════════════════════════════════════════════════════════╗';
    RAISE NOTICE '║         🔒 RLS AUDIT MIGRATION COMPLETED                     ║';
    RAISE NOTICE '╠══════════════════════════════════════════════════════════════╣';
    RAISE NOTICE '║  Tables with RLS enabled: %                                  ║', table_count;
    RAISE NOTICE '║  Total policies created:  %                                  ║', policy_count;
    RAISE NOTICE '╚══════════════════════════════════════════════════════════════╝';
    RAISE NOTICE '';
END $$;


-- ============================================================================
-- SECTION 12: COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON POLICY "quiz_drafts_owner_select" ON quiz_drafts IS 
    'Users can only read their own drafts';

COMMENT ON POLICY "quiz_drafts_owner_insert" ON quiz_drafts IS 
    'Users can only create drafts for themselves';

COMMENT ON POLICY "quiz_production_public_read" ON quiz_production IS 
    'Published quizzes are publicly readable for participants';

COMMENT ON POLICY "quiz_events_insert_all" ON quiz_events IS 
    'Anyone can track events for analytics';

COMMENT ON POLICY "component_types_read_all" ON component_types IS 
    'Component types are schema-like and publicly readable';
