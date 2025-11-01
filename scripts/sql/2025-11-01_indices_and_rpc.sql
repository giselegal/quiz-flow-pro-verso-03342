-- Índices recomendados para desempenho em component_instances e funnels

-- Index composto para ordenação rápida por funil/etapa
create index if not exists idx_component_instances_funnel_step
on public.component_instances (funnel_id, step_number, order_index);

-- Index para listagem de funis por usuário e recência
-- Se a coluna is_active existir, usamos (user_id, is_active, updated_at DESC)
-- Caso contrário, criamos um índice fallback em (user_id, updated_at DESC)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'funnels' and column_name = 'is_active'
  ) then
    execute 'create index if not exists idx_funnels_user_active on public.funnels (user_id, is_active, updated_at desc)';
  else
    if not exists (
      select 1 from pg_indexes where schemaname = 'public' and indexname = 'idx_funnels_user_updated'
    ) then
      execute 'create index idx_funnels_user_updated on public.funnels (user_id, updated_at desc)';
    end if;
  end if;
end$$;

-- RPC para batch update de componentes (reordenação/atualizações atômicas)
-- Observação: ajuste o schema/colunas conforme seu ambiente (properties/custom_styling/order_index/is_active/is_locked)
create or replace function public.batch_update_components(updates jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  rec jsonb;
  updated_count integer := 0;
  has_properties boolean := false;
  has_custom_styling boolean := false;
  has_order_index boolean := false;
  has_is_active boolean := false;
  has_is_locked boolean := false;
  set_clause text := '';
  sql_text text := '';
begin
  if updates is null or jsonb_typeof(updates) <> 'array' then
    return jsonb_build_object('updated_count', 0, 'errors', jsonb_build_array('INVALID_UPDATES_PAYLOAD'));
  end if;

  -- Descobrir colunas existentes (compatível com variações de schema)
  select exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'component_instances' and column_name = 'properties')
    into has_properties;
  select exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'component_instances' and column_name = 'custom_styling')
    into has_custom_styling;
  select exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'component_instances' and column_name = 'order_index')
    into has_order_index;
  select exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'component_instances' and column_name = 'is_active')
    into has_is_active;
  select exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'component_instances' and column_name = 'is_locked')
    into has_is_locked;

  for rec in select jsonb_array_elements(updates) loop
    set_clause := '';

    if has_properties then
      set_clause := set_clause || case when length(set_clause) > 0 then ', ' else '' end ||
        'properties = COALESCE(($1->''properties'')::jsonb, properties)';
    end if;

    if has_custom_styling then
      set_clause := set_clause || case when length(set_clause) > 0 then ', ' else '' end ||
        'custom_styling = COALESCE(($1->''custom_styling'')::jsonb, custom_styling)';
    end if;

    if has_order_index then
      set_clause := set_clause || case when length(set_clause) > 0 then ', ' else '' end ||
        'order_index = COALESCE(NULLIF(($1->>''order_index''), '''')::int, order_index)';
    end if;

    if has_is_active then
      set_clause := set_clause || case when length(set_clause) > 0 then ', ' else '' end ||
        'is_active = COALESCE(NULLIF(($1->>''is_active''), '''')::boolean, is_active)';
    end if;

    if has_is_locked then
      set_clause := set_clause || case when length(set_clause) > 0 then ', ' else '' end ||
        'is_locked = COALESCE(NULLIF(($1->>''is_locked''), '''')::boolean, is_locked)';
    end if;

    -- Se nenhuma coluna aplicável existir, não faz nada
    if set_clause = '' then
      continue;
    end if;

    sql_text := 'update public.component_instances set ' || set_clause ||
      ' where id = ($1->>''id'')::uuid and exists (' ||
      '  select 1 from public.funnels f where f.id = component_instances.funnel_id and (' ||
      '    coalesce((current_setting(''request.jwt.claims'', true)::jsonb->>''role''), '''') = ''service_role'' or f.user_id = auth.uid()' ||
      '  )' ||
      ')';

    execute sql_text using rec;

    if found then
      updated_count := updated_count + 1;
    end if;
  end loop;

  return jsonb_build_object('updated_count', updated_count);
end;
$$;

-- Permissões de execução para roles padrão do Supabase
grant execute on function public.batch_update_components(jsonb) to anon, authenticated, service_role;
