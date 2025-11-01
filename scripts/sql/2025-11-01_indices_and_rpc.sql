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

-- Índice único para idempotência por etapa (evita duplicações por instance_key)
create unique index if not exists uniq_component_instances_funnel_step_instance
on public.component_instances (funnel_id, step_number, instance_key);

-- RPC para sincronizar uma etapa inteira de forma atômica (delete + insert)
-- Espera payload no formato do schema atual (component_instances):
-- items = [
--   { instance_key, component_type_key, order_index, properties }
-- ]
create or replace function public.batch_sync_components_for_step(p_funnel_id uuid, p_step_number int, items jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  rec jsonb;
  inserted_count integer := 0;
  has_properties boolean := false;
  has_component_type_key boolean := false;
  has_order_index boolean := false;
  has_step_number boolean := false;
begin
  if p_funnel_id is null or p_step_number is null then
    return jsonb_build_object('inserted_count', 0, 'errors', jsonb_build_array('MISSING_FUNNEL_OR_STEP'));
  end if;

  if items is null or jsonb_typeof(items) <> 'array' then
    return jsonb_build_object('inserted_count', 0, 'errors', jsonb_build_array('INVALID_ITEMS_PAYLOAD'));
  end if;

  -- Checar colunas do schema atual
  select exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'component_instances' and column_name = 'properties')
    into has_properties;
  select exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'component_instances' and column_name = 'component_type_key')
    into has_component_type_key;
  select exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'component_instances' and column_name = 'order_index')
    into has_order_index;
  select exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'component_instances' and column_name = 'step_number')
    into has_step_number;

  if not (has_properties and has_component_type_key and has_order_index and has_step_number) then
    -- Schema legado não suportado por esta RPC (use fallback no app)
    return jsonb_build_object('inserted_count', 0, 'errors', jsonb_build_array('SCHEMA_NOT_SUPPORTED'));
  end if;

  -- Autorização: garantir que o usuário tem acesso ao funil
  if not exists (
    select 1 from public.funnels f
    where f.id = p_funnel_id
      and (
        coalesce((current_setting(''request.jwt.claims'', true)::jsonb->>''role''), '''') = 'service_role'
        or f.user_id = auth.uid()
      )
  ) then
    return jsonb_build_object('inserted_count', 0, 'errors', jsonb_build_array('UNAUTHORIZED'));
  end if;

  -- Transação: remover existentes da etapa e inserir novos
  perform 1; -- no-op para manter estrutura
  begin
    -- Limpar etapa
    delete from public.component_instances
    where funnel_id = p_funnel_id and step_number = p_step_number;

    -- Inserir novos itens
    for rec in select jsonb_array_elements(items) loop
      insert into public.component_instances (
        funnel_id, step_number, instance_key, component_type_key, order_index, properties
      ) values (
        p_funnel_id,
        p_step_number,
        (rec->> 'instance_key'),
        (rec->> 'component_type_key'),
        COALESCE(NULLIF((rec->> 'order_index'), '')::int, 1),
        COALESCE((rec-> 'properties')::jsonb, '{}'::jsonb)
      )
      on conflict (funnel_id, step_number, instance_key) do update
        set component_type_key = excluded.component_type_key,
            order_index = excluded.order_index,
            properties = excluded.properties;

      inserted_count := inserted_count + 1;
    end loop;
  exception when others then
    -- Em caso de erro, tentar retornar mensagem amigável
    return jsonb_build_object('inserted_count', inserted_count, 'errors', jsonb_build_array(SQLERRM));
  end;

  return jsonb_build_object('inserted_count', inserted_count);
end;
$$;

grant execute on function public.batch_sync_components_for_step(uuid, int, jsonb) to anon, authenticated, service_role;
