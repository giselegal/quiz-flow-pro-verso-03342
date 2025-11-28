# 🔒 GUIA DE CONFIGURAÇÃO DE SEGURANÇA - SUPABASE

## 📋 Checklist de Segurança Obrigatória

Este documento contém todas as configurações manuais necessárias no Supabase Dashboard para ativar as proteções de segurança do sistema.

---

## 🎯 PRIORIDADE CRÍTICA - Ações Imediatas

### 1. ✅ Proteção Contra Senha Vazada (Breach Protection)

**Onde**: `Supabase Dashboard > Authentication > Policies`

**Passos**:
1. Acesse o projeto no dashboard do Supabase
2. Vá para `Authentication` no menu lateral
3. Clique na aba `Policies`
4. Localize `Password Breach Protection`
5. **Ative** a opção `Enable password breach protection`
6. Clique em `Save`

**O que faz**:
- Verifica senhas contra banco de dados HaveIBeenPwned (HIBP)
- Previne uso de senhas comprometidas em vazamentos conhecidos
- Força usuário a escolher senha mais segura

**Status Atual**: ⚠️ **DESABILITADO** (conforme auditoria)

---

### 2. ✅ Rate Limiting nas Rotas de Autenticação

**Onde**: `Supabase Dashboard > Authentication > Rate Limits`

**Passos**:
1. Acesse `Authentication > Rate Limits`
2. Configure os seguintes limites:

| Endpoint | Limite | Janela | Recomendação |
|----------|--------|--------|--------------|
| Sign in | **5 tentativas** | **por hora por IP** | Previne brute force |
| Sign up | **3 tentativas** | **por hora por IP** | Previne spam de contas |
| Password reset | **3 tentativas** | **por hora por email** | Previne abuse |
| Token refresh | **10 tentativas** | **por hora por IP** | Previne session hijacking |
| Email verification | **5 tentativas** | **por hora por email** | Previne spam |

3. Clique em `Save changes`

**Status Atual**: ⚠️ **NÃO CONFIGURADO** (conforme auditoria)

---

### 3. ✅ Políticas de Senha Forte

**Onde**: `Supabase Dashboard > Authentication > Policies`

**Configurações Recomendadas**:
```
✓ Minimum password length: 12 characters
✓ Require uppercase letters: Yes
✓ Require lowercase letters: Yes
✓ Require numbers: Yes
✓ Require special characters: Yes
✓ Prevent common passwords: Yes
✓ Prevent breach passwords: Yes (item 1)
```

---

### 4. ✅ Configurar CORS Apropriadamente

**Onde**: `Supabase Dashboard > Settings > API`

**Configuração**:
1. Vá para `Settings > API`
2. Localize `CORS Configuration`
3. **NÃO use** `*` (wildcard) em produção
4. Adicione apenas domínios específicos:

```
https://seu-dominio.com
https://www.seu-dominio.com
http://localhost:5173 (apenas para dev)
```

5. Salve as alterações

---

### 5. ✅ Habilitar Logs de Auditoria

**Onde**: `Supabase Dashboard > Database > Logs`

**Passos**:
1. Acesse `Database > Logs`
2. Ative `Log all queries` (temporariamente para análise)
3. Configure retention: `30 days` (mínimo recomendado)
4. Habilite `Log authentication events`
5. Habilite `Log API requests`

---

## 🛡️ CONFIGURAÇÕES ADICIONAIS RECOMENDADAS

### 6. Email Verification Obrigatória

**Onde**: `Authentication > Policies`

```
✓ Enable email confirmations: Yes
✓ Secure email change: Yes (requer confirmação no email antigo)
✓ Double opt-in: Yes
```

---

### 7. Session Management

**Onde**: `Authentication > Settings`

**Configurações**:
```
Session timeout: 7 days (padrão) ou 1 day (alta segurança)
Refresh token rotation: Enabled
JWT expiry: 1 hour (padrão seguro)
Allow multiple sessions: Configurável por necessidade
```

---

### 8. Configurar Webhooks de Segurança (Opcional)

**Onde**: `Database > Webhooks`

**Eventos Recomendados**:
- `INSERT on security_audit_logs WHERE severity = 'critical'`
- `INSERT on rate_limits WHERE current >= limit`

**Webhook URL**: Seu sistema de monitoramento (Slack, Discord, PagerDuty)

---

## 📊 VALIDAÇÃO DAS CONFIGURAÇÕES

### Executar Migrations de Segurança

```bash
# No diretório do projeto
cd /workspaces/quiz-flow-pro-verso-03342

# Aplicar migration de segurança (RLS policies)
supabase db push

# Ou manualmente no SQL Editor do Dashboard:
# 1. Abra SQL Editor
# 2. Cole o conteúdo de:
#    - supabase/migrations/20251110_auth_hardening_rls.sql
#    - supabase/migrations/20251128_security_enhancements.sql
# 3. Execute (Run)
```

### Testar Rate Limiting

```bash
# Testar limite de login
curl -X POST https://seu-projeto.supabase.co/auth/v1/token \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  # Repetir 6 vezes - a 6ª deve retornar 429
```

### Verificar RLS Policies

```sql
-- No SQL Editor do Dashboard
-- Verificar políticas ativas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 🚨 MONITORAMENTO CONTÍNUO

### Dashboards Recomendados

1. **Security Events Dashboard**
```sql
-- Eventos críticos nas últimas 24h
SELECT * FROM v_critical_security_events
ORDER BY created_at DESC
LIMIT 50;
```

2. **Rate Limit Violations**
```sql
-- Top violadores de rate limit
SELECT * FROM v_rate_limit_violations
WHERE violation_count > 5
ORDER BY violation_count DESC;
```

3. **System Health**
```sql
-- Status geral do sistema
SELECT * FROM v_system_health_summary
WHERE avg_value > 1000 -- métricas acima de 1s
ORDER BY avg_value DESC;
```

---

## 🔄 MANUTENÇÃO PERIÓDICA

### Limpeza Automática (Recomendado: Semanalmente)

```sql
-- Executar no SQL Editor ou via cron job
SELECT cleanup_old_security_data();
```

**O que remove**:
- ✅ Rate limits expirados (>7 dias)
- ✅ Logs de segurança não-críticos (>90 dias)
- ✅ Métricas antigas (>30 dias)
- ❌ **Mantém** eventos críticos indefinidamente

---

## 📋 CHECKLIST FINAL DE VALIDAÇÃO

Marque conforme completar:

### Configurações do Dashboard
- [ ] Proteção contra senha vazada ativada
- [ ] Rate limiting configurado (sign in, sign up, reset)
- [ ] Políticas de senha forte aplicadas
- [ ] CORS configurado com domínios específicos
- [ ] Logs de auditoria habilitados
- [ ] Email verification obrigatória
- [ ] Session management configurado

### Migrations Aplicadas
- [ ] `20251110_auth_hardening_rls.sql` executada
- [ ] `20251128_security_enhancements.sql` executada
- [ ] Todas as tabelas com RLS habilitado
- [ ] Funções de validação criadas
- [ ] Triggers de auditoria ativos

### Edge Functions
- [ ] `rate-limiter` deployada e funcional
- [ ] `security-monitor` deployada e funcional
- [ ] `csp-headers` configurada
- [ ] Todas as functions com CORS apropriado

### Testes
- [ ] Rate limiting testado (deve bloquear após limite)
- [ ] RLS policies testadas (não vazar dados entre users)
- [ ] Breach password testada (rejeitar senhas vazadas)
- [ ] CORS testado (aceitar apenas domínios permitidos)

---

## 🆘 TROUBLESHOOTING

### Problema: Rate limit não está funcionando

**Solução**:
```sql
-- Verificar se tabela existe e tem dados
SELECT * FROM rate_limits LIMIT 10;

-- Testar função manualmente
SELECT check_rate_limit('test-ip', 'test-endpoint', 5, 60);
```

### Problema: RLS bloqueando operações legítimas

**Solução**:
```sql
-- Temporariamente desabilitar RLS para debug (CUIDADO!)
ALTER TABLE funnels DISABLE ROW LEVEL SECURITY;

-- Testar operação

-- SEMPRE reabilitar depois
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
```

### Problema: Logs de segurança não sendo criados

**Solução**:
```sql
-- Verificar permissões da função
SELECT proname, proacl 
FROM pg_proc 
WHERE proname = 'log_security_event';

-- Regravar permissões
GRANT EXECUTE ON FUNCTION log_security_event TO service_role;
```

---

## 📞 CONTATOS E RECURSOS

- **Documentação Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **HaveIBeenPwned API**: https://haveibeenpwned.com/API/v3
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/

---

**Última atualização**: 28 de Novembro de 2025  
**Responsável**: Equipe de Segurança  
**Status**: ⚠️ **PENDENTE APLICAÇÃO NO DASHBOARD**
