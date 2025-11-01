-- RLS Policies Template (seguras por usuário autenticado)
-- Ajuste conforme seu modelo de auth e colunas. Execute no SQL Editor do Supabase.

-- Habilitar RLS (se ainda não estiver habilitado)
alter table public.funnels enable row level security;
alter table public.component_instances enable row level security;

-- Permissões básicas (mantenha restrito; use roles adequadas)
-- grant select, insert, update, delete on public.funnels to authenticated;
-- grant select, insert, update, delete on public.component_instances to authenticated;

-- Funis: permitir que cada usuário gerencie somente seus funis
create policy if not exists "funnels_select_own" on public.funnels
for select to authenticated
using (user_id = auth.uid());

create policy if not exists "funnels_insert_own" on public.funnels
for insert to authenticated
with check (user_id = auth.uid());

create policy if not exists "funnels_update_own" on public.funnels
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy if not exists "funnels_delete_own" on public.funnels
for delete to authenticated
using (user_id = auth.uid());

-- Component Instances: acesso ligado ao funil do usuário
-- SELECT: apenas componentes de funis do próprio usuário
create policy if not exists "ci_select_by_funnel_owner" on public.component_instances
for select to authenticated
using ( exists (
  select 1 from public.funnels f
  where f.id = component_instances.funnel_id
    and f.user_id = auth.uid()
));

-- INSERT: só inserir componentes em funis que o usuário possui
create policy if not exists "ci_insert_by_funnel_owner" on public.component_instances
for insert to authenticated
with check ( exists (
  select 1 from public.funnels f
  where f.id = component_instances.funnel_id
    and f.user_id = auth.uid()
));

-- UPDATE: atualizar somente componentes pertencentes aos seus funis
create policy if not exists "ci_update_by_funnel_owner" on public.component_instances
for update to authenticated
using ( exists (
  select 1 from public.funnels f
  where f.id = component_instances.funnel_id
    and f.user_id = auth.uid()
))
with check ( exists (
  select 1 from public.funnels f
  where f.id = component_instances.funnel_id
    and f.user_id = auth.uid()
));

-- DELETE: deletar somente componentes dos seus funis
create policy if not exists "ci_delete_by_funnel_owner" on public.component_instances
for delete to authenticated
using ( exists (
  select 1 from public.funnels f
  where f.id = component_instances.funnel_id
    and f.user_id = auth.uid()
));
