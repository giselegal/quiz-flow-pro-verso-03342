-- Migration: Normalize step keys to step-<n> format
-- 
-- This migration normalizes step keys in quiz_results and user_results tables
-- to ensure consistent step-<n> format (e.g., step1 -> step-1, 1 -> step-1)
--
-- Safe to run multiple times (idempotent)

BEGIN;

-- Function to normalize step keys in JSONB data
CREATE OR REPLACE FUNCTION normalize_step_keys(data JSONB)
RETURNS JSONB AS $$
DECLARE
    result JSONB := '{}';
    key TEXT;
    value JSONB;
    normalized_key TEXT;
BEGIN
    -- Handle null input
    IF data IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Process each key-value pair
    FOR key, value IN SELECT * FROM jsonb_each(data)
    LOOP
        -- Normalize step keys
        IF key ~ '^step\d+$' THEN
            -- Convert step1, step2, etc. to step-1, step-2, etc.
            normalized_key := regexp_replace(key, '^step(\d+)$', 'step-\1');
        ELSIF key ~ '^\d+$' THEN
            -- Convert 1, 2, etc. to step-1, step-2, etc.
            normalized_key := 'step-' || key;
        ELSE
            -- Keep other keys unchanged
            normalized_key := key;
        END IF;
        
        -- Add to result
        result := result || jsonb_build_object(normalized_key, value);
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Normalize quiz_results table
DO $$
DECLARE
    updated_count INTEGER := 0;
    total_count INTEGER;
BEGIN
    -- Count total records that need updating
    SELECT COUNT(*) INTO total_count
    FROM quiz_results 
    WHERE result_data IS NOT NULL 
      AND jsonb_typeof(result_data) = 'object'
      AND (
        result_data ? 'stepResults' 
        OR result_data ? 'steps'
        OR EXISTS (
          SELECT 1 FROM jsonb_object_keys(result_data) k 
          WHERE k ~ '^(step\d+|\d+)$'
        )
      );
    
    RAISE NOTICE 'Found % quiz_results records that may need step key normalization', total_count;
    
    -- Update stepResults field
    UPDATE quiz_results 
    SET result_data = jsonb_set(
        result_data, 
        '{stepResults}', 
        normalize_step_keys(result_data->'stepResults')
    )
    WHERE result_data IS NOT NULL 
      AND result_data ? 'stepResults'
      AND jsonb_typeof(result_data->'stepResults') = 'object';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated stepResults in % quiz_results records', updated_count;
    
    -- Update steps field  
    UPDATE quiz_results 
    SET result_data = jsonb_set(
        result_data, 
        '{steps}', 
        normalize_step_keys(result_data->'steps')
    )
    WHERE result_data IS NOT NULL 
      AND result_data ? 'steps'
      AND jsonb_typeof(result_data->'steps') = 'object';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated steps in % quiz_results records', updated_count;
    
    -- Update root-level step keys (less common but possible)
    UPDATE quiz_results 
    SET result_data = normalize_step_keys(result_data)
    WHERE result_data IS NOT NULL 
      AND jsonb_typeof(result_data) = 'object'
      AND EXISTS (
        SELECT 1 FROM jsonb_object_keys(result_data) k 
        WHERE k ~ '^(step\d+|\d+)$'
      );
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated root-level step keys in % quiz_results records', updated_count;
END;
$$;

-- Normalize user_results table (if it exists)
DO $$
DECLARE
    updated_count INTEGER := 0;
    table_exists BOOLEAN;
BEGIN
    -- Check if user_results table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_results'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE 'Found user_results table, normalizing step keys...';
        
        -- Update stepResults field
        UPDATE user_results 
        SET result_data = jsonb_set(
            result_data, 
            '{stepResults}', 
            normalize_step_keys(result_data->'stepResults')
        )
        WHERE result_data IS NOT NULL 
          AND result_data ? 'stepResults'
          AND jsonb_typeof(result_data->'stepResults') = 'object';
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        RAISE NOTICE 'Updated stepResults in % user_results records', updated_count;
        
        -- Update steps field
        UPDATE user_results 
        SET result_data = jsonb_set(
            result_data, 
            '{steps}', 
            normalize_step_keys(result_data->'steps')
        )
        WHERE result_data IS NOT NULL 
          AND result_data ? 'steps'
          AND jsonb_typeof(result_data->'steps') = 'object';
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        RAISE NOTICE 'Updated steps in % user_results records', updated_count;
        
        -- Update root-level step keys
        UPDATE user_results 
        SET result_data = normalize_step_keys(result_data)
        WHERE result_data IS NOT NULL 
          AND jsonb_typeof(result_data) = 'object'
          AND EXISTS (
            SELECT 1 FROM jsonb_object_keys(result_data) k 
            WHERE k ~ '^(step\d+|\d+)$'
          );
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        RAISE NOTICE 'Updated root-level step keys in % user_results records', updated_count;
    ELSE
        RAISE NOTICE 'user_results table not found, skipping';
    END IF;
END;
$$;

-- Add index for better performance on step queries (if not exists)
CREATE INDEX IF NOT EXISTS idx_quiz_results_step_keys 
ON quiz_results USING GIN ((result_data->'stepResults'));

CREATE INDEX IF NOT EXISTS idx_quiz_results_steps 
ON quiz_results USING GIN ((result_data->'steps'));

-- Add index on user_results if table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_results') THEN
        CREATE INDEX IF NOT EXISTS idx_user_results_step_keys 
        ON user_results USING GIN ((result_data->'stepResults'));
        
        CREATE INDEX IF NOT EXISTS idx_user_results_steps 
        ON user_results USING GIN ((result_data->'steps'));
        
        RAISE NOTICE 'Created indexes on user_results table';
    END IF;
END;
$$;

-- Verification query to check normalization success
DO $$
DECLARE
    quiz_results_count INTEGER;
    user_results_count INTEGER := 0;
BEGIN
    -- Check quiz_results
    SELECT COUNT(*) INTO quiz_results_count
    FROM quiz_results 
    WHERE result_data IS NOT NULL 
      AND jsonb_typeof(result_data) = 'object'
      AND (
        EXISTS (
          SELECT 1 FROM jsonb_object_keys(result_data->'stepResults') k 
          WHERE k !~ '^step-\d+$' AND k ~ '(step\d+|\d+)'
        )
        OR EXISTS (
          SELECT 1 FROM jsonb_object_keys(result_data->'steps') k 
          WHERE k !~ '^step-\d+$' AND k ~ '(step\d+|\d+)'
        )
      );
    
    -- Check user_results if exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_results') THEN
        SELECT COUNT(*) INTO user_results_count
        FROM user_results 
        WHERE result_data IS NOT NULL 
          AND jsonb_typeof(result_data) = 'object'
          AND (
            EXISTS (
              SELECT 1 FROM jsonb_object_keys(result_data->'stepResults') k 
              WHERE k !~ '^step-\d+$' AND k ~ '(step\d+|\d+)'
            )
            OR EXISTS (
              SELECT 1 FROM jsonb_object_keys(result_data->'steps') k 
              WHERE k !~ '^step-\d+$' AND k ~ '(step\d+|\d+)'
            )
          );
    END IF;
    
    RAISE NOTICE 'Migration verification:';
    RAISE NOTICE '- quiz_results with non-normalized step keys: %', quiz_results_count;
    RAISE NOTICE '- user_results with non-normalized step keys: %', user_results_count;
    
    IF quiz_results_count = 0 AND user_results_count = 0 THEN
        RAISE NOTICE '✅ Step key normalization completed successfully!';
    ELSE
        RAISE WARNING '⚠️ Some step keys may still need normalization';
    END IF;
END;
$$;

-- Clean up the helper function (optional, comment out if you want to keep it)
-- DROP FUNCTION IF EXISTS normalize_step_keys(JSONB);

COMMIT;

-- Migration complete
-- 
-- This migration:
-- 1. Creates a helper function to normalize step keys in JSONB data
-- 2. Updates quiz_results table to normalize step keys in result_data
-- 3. Updates user_results table if it exists 
-- 4. Adds performance indexes for step-based queries
-- 5. Verifies the normalization was successful
--
-- The migration is idempotent and safe to run multiple times.