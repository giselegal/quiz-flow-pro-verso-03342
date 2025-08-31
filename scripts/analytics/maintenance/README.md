# Manutenção Supabase: análise e limpeza

Este diretório contém SQLs prontos para analisar e limpar as tabelas `quiz_*` na sua instância Supabase.

## Arquivos
- `diagnostics.sql`: consultas de contagem, órfãos e amostras recentes.
- `cleanup.sql`: remove registros órfãos, deduplica `quiz_users` por `session_id` e tem blocos opcionais para limpeza por idade.
- `reset.sql`: TRUNCATE completo em todas as tabelas `quiz_*` (use com cuidado!).

## Como usar
1. Abra o Supabase (projeto referenciado por `VITE_SUPABASE_URL`).
2. Vá ao SQL Editor e cole o conteúdo do arquivo desejado.
3. Execute e revise os resultados/linhas afetadas.

Dica: rode primeiro `diagnostics.sql` para entender o estado. Em seguida, rode `cleanup.sql`. Se quiser um recomeço, rode `reset.sql` (irá apagar tudo).

## Observações de schema
Seu repositório possui variações de schema. Estes scripts estão alinhados à variante que usa:
- `quiz_sessions(funnel_id UUID, quiz_user_id UUID, last_activity TIMESTAMPTZ, ...)`
- `quiz_step_responses(session_id UUID, question_id TEXT, answer_value TEXT, answer_text TEXT, responded_at TIMESTAMPTZ)`
- `quiz_users(session_id TEXT NOT NULL, email, name, ...)`

Se sua instância usar outra variação (ex.: `session_id TEXT` em `quiz_sessions` e colunas `selected_options`, `answered_at` em `quiz_step_responses`), me avise que adapto os scripts.

## Validação rápida (local)
Você pode também rodar `node scripts/analytics/lastUserData.mjs` para inspecionar dados recentes. Ele é tolerante a variações de schema e não altera nada.
