-- ============================================================================
-- FASE 1: MIGRAÇÃO DE SCHEMA - component_instances
-- ============================================================================

-- 1.1. Adicionar colunas novas em component_instances
ALTER TABLE component_instances 
  ADD COLUMN IF NOT EXISTS component_type_key TEXT,
  ADD COLUMN IF NOT EXISTS instance_key TEXT,
  ADD COLUMN IF NOT EXISTS step_number INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS properties JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_styling JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS stage_id TEXT,
  ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_component_instances_funnel_step 
  ON component_instances(funnel_id, step_number);
  
CREATE INDEX IF NOT EXISTS idx_component_instances_type_key 
  ON component_instances(component_type_key);

-- 1.2. Migrar dados existentes (se houver)
-- Migrar config → properties
UPDATE component_instances 
SET properties = config 
WHERE properties IS NULL AND config IS NOT NULL;

-- Migrar position → order_index
UPDATE component_instances 
SET order_index = COALESCE(position, 0) 
WHERE order_index = 0;

-- 1.3. Criar RPC Functions para batch operations
CREATE OR REPLACE FUNCTION batch_sync_components_for_step(
  p_funnel_id TEXT,
  p_step_number INTEGER,
  items JSONB[]
) RETURNS JSONB AS $$
DECLARE
  inserted_count INTEGER := 0;
  errors TEXT[] := '{}';
BEGIN
  -- Limpar componentes existentes
  DELETE FROM component_instances 
  WHERE funnel_id = p_funnel_id 
    AND step_number = p_step_number;
  
  -- Inserir novos componentes
  INSERT INTO component_instances (
    funnel_id, step_number, component_type_key,
    instance_key, order_index, properties, custom_styling
  )
  SELECT 
    p_funnel_id,
    p_step_number,
    (item->>'component_type_key')::TEXT,
    (item->>'instance_key')::TEXT,
    (item->>'order_index')::INTEGER,
    (item->'properties')::JSONB,
    COALESCE((item->'custom_styling')::JSONB, '{}'::jsonb)
  FROM unnest(items) AS item;
  
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'inserted_count', inserted_count,
    'errors', errors
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION batch_update_components(
  updates JSONB[]
) RETURNS JSONB AS $$
DECLARE
  updated_count INTEGER := 0;
  errors TEXT[] := '{}';
  item JSONB;
BEGIN
  FOREACH item IN ARRAY updates
  LOOP
    UPDATE component_instances
    SET 
      properties = COALESCE((item->'properties')::JSONB, properties),
      custom_styling = COALESCE((item->'custom_styling')::JSONB, custom_styling),
      order_index = COALESCE((item->>'order_index')::INTEGER, order_index),
      is_active = COALESCE((item->>'is_active')::BOOLEAN, is_active),
      is_locked = COALESCE((item->>'is_locked')::BOOLEAN, is_locked),
      updated_at = NOW()
    WHERE id = (item->>'id')::UUID;
    
    IF FOUND THEN
      updated_count := updated_count + 1;
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'updated_count', updated_count,
    'errors', errors
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1.4. Adicionar RLS Policies completas
CREATE POLICY "Users can insert components"
  ON component_instances
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update components"
  ON component_instances
  FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete components"
  ON component_instances
  FOR DELETE
  USING (true);