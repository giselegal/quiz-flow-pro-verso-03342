# RLS Hardening (Supabase)

Este documento consolida as políticas de RLS recomendadas para as tabelas críticas do sistema de quiz.

Status atual (2025-10-09):
- Migrations aplicadas: `supabase/migrations/20251009120000_rls_hardening.sql` (protege funnels, sessions, results, step_responses, conversions, e tabelas administrativas padrão).
- Ponto de atenção: `quiz_users` ainda permite INSERT público (útil para fluxo de visitantes em dev), porém deve ser endurecido/condicionado em produção.

## Objetivos
- Eliminar acessos anônimos desnecessários.
- Garantir que donos de funil (user_id = auth.uid()) tenham exclusividade de leitura/escrita dos seus dados.
- Permitir fluxos públicos somente quando há justificativa (ex.: iniciar quiz), com mitigação anti-abuso (rate limit / published funnel / anti-PII).

## Políticas recomendadas (exemplos)

Observação: Ajuste nomes de colunas e relacionamentos conforme seu schema. Estas políticas são compatíveis com a estrutura utilizada no projeto atual.

### 1) quiz_users (crítico)

Motivação: hoje há `INSERT` público irrestrito. Em produção, recomendamos restringir à menor superfície possível.

Opção A — Restringir por funil publicado + função de rate limit (recomendado):

```sql
-- DROP POLICIES inseguras
DROP POLICY IF EXISTS "quiz_users_public_insert" ON public.quiz_users;

-- Permitir INSERT apenas se o funil referenciado estiver publicado
-- e se o rate limit estiver OK (via função de extensão ou edge function proxy)
CREATE POLICY "quiz_users_insert_limited"
  ON public.quiz_users FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.quiz_user_id = quiz_users.id
        AND f.is_published = true
    )
    AND (SELECT public.rate_limit_ok('quiz_users_insert', auth.uid()::text))
  );
```

Notas:
- `public.rate_limit_ok` é uma função utilitária a ser criada (ou use verificação na edge function `supabase/functions/rate-limiter`).
- Requer que a aplicação crie `quiz_sessions` próximo do evento de criação de usuário (ou adapte para checar `session_id` se existir esta coluna em `quiz_users`).

Opção B — Inserção apenas autenticada:

```sql
DROP POLICY IF EXISTS "quiz_users_public_insert" ON public.quiz_users;

CREATE POLICY "quiz_users_insert_authenticated_only"
  ON public.quiz_users FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

Impacto: visitantes anônimos não conseguem iniciar quiz (ajustar UX para login/anon-token se optar por esta via).

### 2) quiz_sessions

As políticas atuais já exigem existência de funil e restringem leitura/alteração ao dono. Se desejar, adicione rate limit:

```sql
DROP POLICY IF EXISTS "quiz_sessions_public_insert" ON public.quiz_sessions;

CREATE POLICY "quiz_sessions_insert_limited"
  ON public.quiz_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.funnels f WHERE f.id = quiz_sessions.funnel_id AND f.is_published = true)
    AND (SELECT public.rate_limit_ok('quiz_sessions_insert', coalesce(auth.uid()::text, 'anon')))
  );
```

### 3) funnels

Já protegido por RLS por dono + leitura pública somente se publicado. Sem mudanças necessárias.

### 4) component_instances / quiz_step_responses / quiz_results

Políticas já criadas associam leitura ao dono do funil. Considere adicionar checks de existência/consistência e rate limit em INSERT, se aplicável.

## Função de rate limit (exemplo simples)

Crie uma função utilitária para controlar taxa de criação por usuário/anon.

```sql
-- Exemplo simplificado (substitua por uma implementação robusta)
CREATE OR REPLACE FUNCTION public.rate_limit_ok(event text, subject text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  recent_count int;
BEGIN
  -- Exemplo: limita a 30 eventos por 10 minutos por subject
  SELECT count(*) INTO recent_count
  FROM public.security_audit_logs
  WHERE event_type = event
    AND subject = subject
    AND created_at > now() - interval '10 minutes';

  IF recent_count > 30 THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$;
```

Integre com uma tabela de logs de segurança (`security_audit_logs`) ou use o edge function `supabase/functions/rate-limiter` como proxy para validação.

## Como aplicar

1) Copie os trechos desejados para um novo arquivo de migração, por exemplo:
   - `supabase/migrations/20251025_rls_hardening_v2.sql`
2) Ajuste nomes de colunas/relacionamentos conforme seu schema.
3) Aplique migrations com sua ferramenta/CLI padrão.
4) Valide com o linter de segurança.

## Validação

- Verifique que usuários anônimos não conseguem ler dados sensíveis.
- Verifique que apenas o dono (auth.uid()) acessa dados do próprio funil.
- Teste fluxos de criação (quiz_users, quiz_sessions) e confirme que continuam funcionais com restrições.

## Observações

- Em dev, você pode manter policies mais permissivas e alterná-las por `mode` ou por variável de ambiente; em produção, aplique as políticas endurecidas.
- Preferir logs estruturados para auditoria (tabela `security_audit_logs`).
