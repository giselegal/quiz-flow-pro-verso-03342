-- Índices recomendados para desempenho em component_instances e funnels

-- Index composto para ordenação rápida por funil/etapa
create index if not exists idx_component_instances_funnel_step
on public.component_instances (funnel_id, step_number, order_index);

-- Index para listagem de funis por usuário e status/recência
create index if not exists idx_funnels_user_active
on public.funnels (user_id, is_active, updated_at desc);

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
begin
  if updates is null or jsonb_typeof(updates) <> 'array' then
    return jsonb_build_object('updated_count', 0, 'errors', jsonb_build_array('INVALID_UPDATES_PAYLOAD'));
  end if;

  for rec in select jsonb_array_elements(updates) loop
    update public.component_instances
    set
      properties     = coalesce((rec->'properties')::jsonb, properties),
      custom_styling = coalesce((rec->'custom_styling')::jsonb, custom_styling),
      order_index    = coalesce(nullif((rec->>'order_index'),'')::int, order_index),
      is_active      = coalesce(nullif((rec->>'is_active'),'')::boolean, is_active),
      is_locked      = coalesce(nullif((rec->>'is_locked'),'')::boolean, is_locked)
    where id = (rec->>'id')::uuid
      and exists (
        select 1 from public.funnels f
        where f.id = component_instances.funnel_id
          and (
            -- permitir service_role; caso contrário, exigir ownership do usuário
            coalesce((current_setting('request.jwt.claims', true)::jsonb->>'role'),'') = 'service_role'
            or f.user_id = auth.uid()
          )
      );

    if found then
      updated_count := updated_count + 1;
    end if;
  end loop;

  return jsonb_build_object('updated_count', updated_count);
end;
$$;

-- Permissões de execução para roles padrão do Supabase
grant execute on function public.batch_update_components(jsonb) to anon, authenticated, service_role;
