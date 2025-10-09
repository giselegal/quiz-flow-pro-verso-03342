# Supabase Hardening Checklist (Produção)

Data: 2025-10-09

## 1) Variáveis de ambiente
- [ ] VITE_SUPABASE_URL (client)
- [ ] VITE_SUPABASE_ANON_KEY (client)
- [ ] VITE_SUPABASE_SERVICE_KEY (server only)
- [ ] JWT exp: adequar expiração; rotacionar chaves periodicamente

## 2) Políticas RLS (Row Level Security)
- [ ] RLS habilitado em todas as tabelas sensíveis (funnels, sessions, results, step_responses, conversions)
- [ ] Políticas dev-permissivas removidas
- [ ] Dono (auth.uid()) pode CRUD seus recursos
- [ ] Leitura pública apenas de `funnels.is_published = true`
- [ ] Tabelas de sistema (admin_goals, ai_optimization_recommendations, optimization_results, rate_limits, backup_jobs) restritas ao dono

Arquivo SQL sugerido: `supabase/migrations/20251009120000_rls_hardening.sql`

## 3) Storage Buckets
- [ ] Buckets privados por padrão
- [ ] Políticas do storage por caminho (ex.: `user_id = auth.uid()`)
- [ ] Links públicos somente quando necessário; considerar URLs assinadas

## 4) Auth
- [ ] Revisar e-mails/OAuth e redirecionamentos
- [ ] Bloqueio por IP/Rate limit se necessário (tabela `rate_limits`)
- [ ] Evitar Service Key no cliente (apenas server)

## 5) Observabilidade
- [ ] Logs habilitados e retidos
- [ ] Alertas de quota (DB, Storage, Realtime)
- [ ] Monitorar conexões/latência/erros

## 6) Backups e Recuperação
- [ ] Backups automáticos habilitados
- [ ] PITR (se disponível no plano)
- [ ] Teste de restauração (table-level)

## 7) Deploy e CI/CD
- [ ] Migrações versionadas (Drizzle/Supabase CLI)
- [ ] Scripts de rollback
- [ ] Gate de segurança: não deployar com políticas permissivas

## 8) Plano de saída (reduzir lock-in)
- [ ] Camada de serviço própria (evitar chamadas diretas em todo o app)
- [ ] Documentar schema e RLS
- [ ] Evitar acoplamento forte a Edge Functions quando possível

## Como aplicar
1. Configure envs e garanta que o backend use apenas a Service Key no server.
2. Execute a migração `20251009120000_rls_hardening.sql` no projeto Supabase (CLI ou Dashboard SQL Editor).
3. Valide cenários básicos:
   - Usuário A só vê/edita seus funnels/sessions/resultados
   - Visitantes conseguem iniciar sessão (anon) e inserir respostas/resultados
   - Público lê somente funis publicados
4. Teste fluxos críticos (editor, dashboard, templates, analytics) com um usuário comum.
