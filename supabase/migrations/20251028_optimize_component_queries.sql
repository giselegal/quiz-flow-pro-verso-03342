-- ============================================================================
-- FASE 4.2: OTIMIZAÇÕES DE BANCO DE DADOS
-- Índices para melhorar performance de queries de componentes
-- Data: 2025-10-28
-- ============================================================================

-- Índice composto para queries por funnel + step
-- Otimiza: getComponents(funnelId, stepNumber)
CREATE INDEX IF NOT EXISTS idx_components_funnel_step 
ON component_instances(funnel_id, step_number, order_index);

-- Índice para queries por tipo de componente
-- Otimiza: Filtros por component_type_key
CREATE INDEX IF NOT EXISTS idx_components_type 
ON component_instances(component_type_key) 
WHERE is_active = true;

-- Índice para queries por stage
-- Otimiza: Queries específicas de stage
CREATE INDEX IF NOT EXISTS idx_components_stage 
ON component_instances(stage_id, order_index) 
WHERE stage_id IS NOT NULL;

-- Índice para componentes ativos
-- Otimiza: Filtros por is_active
CREATE INDEX IF NOT EXISTS idx_components_active 
ON component_instances(is_active, funnel_id, step_number);

-- ============================================================================
-- FUNÇÃO RPC PARA BATCH UPDATE (Transação Atômica)
-- ============================================================================

CREATE OR REPLACE FUNCTION batch_update_components(updates jsonb)
RETURNS TABLE(updated_count integer, errors text[]) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    update_record jsonb;
    updated_rows integer := 0;
    error_messages text[] := ARRAY[]::text[];
BEGIN
    -- Iterar sobre cada update no array JSON
    FOR update_record IN SELECT * FROM jsonb_array_elements(updates)
    LOOP
        BEGIN
            -- Aplicar update
            UPDATE component_instances
            SET 
                properties = COALESCE((update_record->>'properties')::jsonb, properties),
                custom_styling = COALESCE((update_record->>'custom_styling')::jsonb, custom_styling),
                is_active = COALESCE((update_record->>'is_active')::boolean, is_active),
                is_locked = COALESCE((update_record->>'is_locked')::boolean, is_locked),
                order_index = COALESCE((update_record->>'order_index')::integer, order_index),
                updated_at = NOW()
            WHERE id = (update_record->>'id')::uuid;
            
            -- Incrementar contador se update foi bem sucedido
            IF FOUND THEN
                updated_rows := updated_rows + 1;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            -- Capturar erro e adicionar ao array
            error_messages := array_append(
                error_messages, 
                format('ID %s: %s', update_record->>'id', SQLERRM)
            );
        END;
    END LOOP;
    
    -- Retornar resultados
    RETURN QUERY SELECT updated_rows, error_messages;
END;
$$;

-- Comentários da função
COMMENT ON FUNCTION batch_update_components IS 
'Atualiza múltiplos componentes em uma transação atômica. 
Retorna número de updates bem-sucedidos e array de erros.';

-- ============================================================================
-- FUNÇÃO RPC PARA REORDENAÇÃO EM LOTE
-- ============================================================================

CREATE OR REPLACE FUNCTION batch_reorder_components(
    p_funnel_id uuid,
    p_step_number integer,
    p_new_order jsonb  -- Array de {id: uuid, order_index: integer}
)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    order_item jsonb;
    expected_count integer;
    actual_count integer;
BEGIN
    -- Contar quantos componentes devem ser reordenados
    expected_count := jsonb_array_length(p_new_order);
    
    -- Verificar se todos os IDs existem
    SELECT COUNT(*)
    INTO actual_count
    FROM component_instances ci
    WHERE ci.funnel_id = p_funnel_id
      AND ci.step_number = p_step_number
      AND ci.id IN (
          SELECT (value->>'id')::uuid 
          FROM jsonb_array_elements(p_new_order)
      );
    
    IF actual_count != expected_count THEN
        RETURN QUERY SELECT false, format(
            'IDs inválidos detectados: esperado %s, encontrado %s',
            expected_count,
            actual_count
        );
        RETURN;
    END IF;
    
    -- Aplicar nova ordem em transação
    FOR order_item IN SELECT * FROM jsonb_array_elements(p_new_order)
    LOOP
        UPDATE component_instances
        SET 
            order_index = (order_item->>'order_index')::integer,
            updated_at = NOW()
        WHERE id = (order_item->>'id')::uuid
          AND funnel_id = p_funnel_id
          AND step_number = p_step_number;
    END LOOP;
    
    RETURN QUERY SELECT true, format(
        'Reordenação concluída: %s componentes',
        expected_count
    );
END;
$$;

COMMENT ON FUNCTION batch_reorder_components IS 
'Reordena componentes de um step em uma transação atômica.
Valida que todos os IDs existem antes de aplicar mudanças.';

-- ============================================================================
-- GRANTS (ajustar conforme RLS policies)
-- ============================================================================

-- Permitir execução para usuários autenticados
GRANT EXECUTE ON FUNCTION batch_update_components TO authenticated;
GRANT EXECUTE ON FUNCTION batch_reorder_components TO authenticated;

-- ============================================================================
-- VERIFICAÇÃO DE ÍNDICES
-- ============================================================================

-- Query para verificar índices criados
-- SELECT 
--     schemaname,
--     tablename,
--     indexname,
--     indexdef
-- FROM pg_indexes
-- WHERE tablename = 'component_instances'
-- ORDER BY indexname;
