-- Fix component_instances table to use funnel_id instead of quiz_id for alignment
-- This migration ensures proper alignment between services and database schema

-- Step 1: Add funnel_id column to component_instances table
ALTER TABLE component_instances ADD COLUMN funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE;

-- Step 2: Create index for the new funnel_id column
CREATE INDEX idx_component_instances_funnel_id ON component_instances(funnel_id);
CREATE INDEX idx_component_instances_funnel_step ON component_instances(funnel_id, step_number);
CREATE INDEX idx_component_instances_funnel_order ON component_instances(funnel_id, step_number, order_index);

-- Step 3: Update the unique constraint to use funnel_id instead of quiz_id
-- First drop the old constraint
ALTER TABLE component_instances DROP CONSTRAINT IF EXISTS component_instances_quiz_id_instance_key_key;

-- Add new unique constraint with funnel_id
ALTER TABLE component_instances ADD CONSTRAINT component_instances_funnel_id_instance_key_key 
UNIQUE(funnel_id, instance_key);

-- Step 4: Update the trigger function to use funnel_id
CREATE OR REPLACE FUNCTION generate_instance_key_funnel(
  p_component_type_key TEXT,
  p_funnel_id UUID,
  p_step_number INTEGER
)
RETURNS TEXT AS $$
DECLARE
  base_key TEXT;
  final_key TEXT;
  counter INTEGER := 1;
BEGIN
  -- Criar chave base baseada no tipo do componente
  base_key := p_component_type_key;
  final_key := base_key;
  
  -- Se já existe, adicionar sufixo numérico
  WHILE EXISTS (
    SELECT 1 FROM component_instances 
    WHERE funnel_id = p_funnel_id 
    AND instance_key = final_key
  ) LOOP
    counter := counter + 1;
    final_key := base_key || '-' || counter;
  END LOOP;
  
  RETURN final_key;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create new trigger for funnel-based instance key generation
CREATE OR REPLACE FUNCTION auto_generate_instance_key_funnel()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.instance_key IS NULL OR NEW.instance_key = '' THEN
    -- Use funnel_id if available, fallback to quiz_id for backward compatibility
    IF NEW.funnel_id IS NOT NULL THEN
      NEW.instance_key := generate_instance_key_funnel(
        NEW.component_type_key,
        NEW.funnel_id,
        NEW.step_number
      );
    ELSIF NEW.quiz_id IS NOT NULL THEN
      NEW.instance_key := generate_instance_key(
        NEW.component_type_key,
        NEW.quiz_id,
        NEW.step_number
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Replace the existing trigger
DROP TRIGGER IF EXISTS trigger_auto_generate_instance_key ON component_instances;
CREATE TRIGGER trigger_auto_generate_instance_key_funnel
  BEFORE INSERT ON component_instances
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_instance_key_funnel();

-- Step 7: Update RLS policies to work with both quiz_id and funnel_id
DROP POLICY IF EXISTS "component_instances_read_policy" ON component_instances;
DROP POLICY IF EXISTS "component_instances_write_policy" ON component_instances;

CREATE POLICY "component_instances_read_policy"
  ON component_instances FOR SELECT
  USING (
    -- Allow access via quiz ownership
    (quiz_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = component_instances.quiz_id 
      AND quizzes.author_id = auth.uid()
    ))
    OR
    -- Allow access via funnel ownership  
    (funnel_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = component_instances.funnel_id 
      AND funnels.user_id = auth.uid()
    ))
  );

CREATE POLICY "component_instances_write_policy"
  ON component_instances FOR ALL
  USING (
    -- Allow modification via quiz ownership
    (quiz_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = component_instances.quiz_id 
      AND quizzes.author_id = auth.uid()
    ))
    OR
    -- Allow modification via funnel ownership
    (funnel_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = component_instances.funnel_id 
      AND funnels.user_id = auth.uid()
    ))
  );

-- Step 8: Update views to work with both systems
CREATE OR REPLACE VIEW step_components AS
SELECT 
  ci.id,
  ci.instance_key,
  COALESCE(ci.funnel_id::text, ci.quiz_id::text) as container_id,
  ci.funnel_id,
  ci.quiz_id,
  ci.step_number,
  ci.order_index,
  ct.type_key as component_type,
  ct.display_name,
  ct.category,
  ci.properties,
  ci.custom_styling,
  ci.is_active,
  ci.created_at,
  ci.updated_at
FROM component_instances ci
JOIN component_types ct ON ci.component_type_key = ct.type_key
ORDER BY ci.step_number, ci.order_index;

-- Add comment explaining the migration
COMMENT ON COLUMN component_instances.funnel_id IS 'References funnels table - used by funnel-based components';
COMMENT ON COLUMN component_instances.quiz_id IS 'References quizzes table - used by quiz-based components (legacy)';