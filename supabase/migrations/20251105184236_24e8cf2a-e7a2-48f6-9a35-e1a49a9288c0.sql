-- Corrigir search_path das RPC functions para segurança
-- Fix para warning de segurança identificado na auditoria

-- Recriar batch_sync_components_for_step com search_path explícito
CREATE OR REPLACE FUNCTION public.batch_sync_components_for_step(p_funnel_id text, p_step_number integer, items jsonb[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Recriar batch_update_components com search_path explícito
CREATE OR REPLACE FUNCTION public.batch_update_components(updates jsonb[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;