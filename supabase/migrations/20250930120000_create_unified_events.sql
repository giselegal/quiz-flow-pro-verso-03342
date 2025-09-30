-- Migration: create unified_events table
-- Date: 2025-09-30
-- Purpose: Centralizar eventos de funil/quiz/editor no modelo unificado

create table if not exists public.unified_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  session_id text not null,
  user_id text null,
  funnel_id text not null,
  step_id text null,
  event_type text not null,
  payload jsonb null,
  device jsonb null,
  ctx jsonb null,
  source text not null default 'web',
  version int not null default 1
);

-- Basic indexes
create index if not exists idx_unified_events_funnel_time on public.unified_events (funnel_id, occurred_at desc);
create index if not exists idx_unified_events_session on public.unified_events (session_id);
create index if not exists idx_unified_events_event_type on public.unified_events (event_type);
create index if not exists idx_unified_events_funnel_event_type on public.unified_events (funnel_id, event_type);
create index if not exists idx_unified_events_payload_gin on public.unified_events using gin (payload);

-- Optional future policies (row level security) could be added here
-- alter table public.unified_events enable row level security;

comment on table public.unified_events is 'Eventos unificados de quiz/funil/editor';
comment on column public.unified_events.payload is 'Dados específicos do evento (answer, resultado, etc.)';
comment on column public.unified_events.ctx is 'Contexto agregado (utm, experiment, locale)';
