-- Migration: create quiz_editor_states table
-- Timestamp: 2025-09-30 12:00 UTC

create table if not exists public.quiz_editor_states (
  funnel_id uuid primary key references public.funnels(id) on delete cascade,
  template_id text,
  state_json jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_quiz_editor_states_template on public.quiz_editor_states(template_id);
