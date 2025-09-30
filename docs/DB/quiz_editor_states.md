# Tabela quiz_editor_states

Armazena o estado incremental do editor de quiz (respostas parciais, scores e passo atual) para retomada de sessão e análise futura.

## Objetivos
- Persistir progresso do usuário/autor ao montar quiz estilo.
- Suportar retomada após reload.
- Base para análises de engajamento e evolução do funil durante construção.

## Schema Proposto
```sql
create table if not exists public.quiz_editor_states (
  funnel_id uuid primary key references public.funnels(id) on delete cascade,
  template_id text,
  state_json jsonb not null,
  updated_at timestamptz not null default now()
);

-- Índice opcional para consultas por template
create index if not exists idx_quiz_editor_states_template on public.quiz_editor_states(template_id);
```

## Campos
- funnel_id: Identificador do funil (chave primária e referência).
- template_id: Template base (ex: quiz21StepsComplete) quando aplicável.
- state_json: Estrutura completa do estado (answers, scores, currentStep...).
- updated_at: Timestamp da última atualização (controlado via upsert no hook).

## Exemplo de state_json
```json
{
  "currentStep": "step-3",
  "answers": {
    "step-1": ["opt-a"],
    "step-2": ["opt-b"]
  },
  "scores": { "styleA": 2, "styleB": 1 },
  "userProfile": { "gender": "feminino" }
}
```

## Fluxo de Persistência
1. Hook `useQuizSyncBridge` assina mudanças do `QuizEditorSyncService`.
2. A cada alteração (debounced 600ms) gera hash do JSON para evitar gravações redundantes.
3. Executa `upsert` em `quiz_editor_states` usando `funnel_id` como chave.
4. No mount do hook tenta recuperar `state_json` existente antes de criar estado inicial.

## Boas Práticas
- Evitar guardar dados sensíveis em `state_json` (apenas conteúdo de construção / respostas internas de edição).
- Para auditoria ou versionamento histórico, criar tabela separada `quiz_editor_state_history` (futuro).
- Validar tamanho máximo (JSON <= alguns KB). Caso cresça, considerar fragmentar.

## Próximos Passos (Opcional)
- Adicionar trigger para atualizar uma coluna `last_quiz_activity` em `funnels`.
- Normalizar scores em tabela derivada para relatórios agregados.
- Implementar limpeza automática de estados obsoletos (funis arquivados).
