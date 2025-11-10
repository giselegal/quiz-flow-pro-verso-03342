# 🚀 GUIA RÁPIDO DE EXECUÇÃO - SPRINT 1

**Para equipe técnica: comandos prontos para executar**

---

## 📋 CHECKLIST DE EXECUÇÃO

Execute estes comandos **nesta ordem** para finalizar o Sprint 1:

---

### ✅ **ETAPA 1: Validar Edge Functions**

```bash
# Validar sintaxe e tipos
npm run ci:edge

# Se houver erros, formatar e corrigir
npm run edge:fmt
npm run edge:lint
```

**Resultado esperado:** ✅ Sem erros de compilação

---

### ✅ **ETAPA 2: Limpar Console.Logs (IMPORTANTE: DRY-RUN PRIMEIRO!)**

```bash
# 1. Preview completo (OBRIGATÓRIO!)
npm run clean:logs:dry

# 2. Revisar output cuidadosamente
# Verifique se as substituições fazem sentido

# 3. Aplicar em escopo limitado primeiro (teste)
npm run clean:logs -- --path=src/lib/utils

# 4. Verificar se não quebrou nada
npm run type-check
npm run test:fast

# 5. Se tudo OK, aplicar no resto
npm run clean:logs -- --path=src/services
npm run clean:logs -- --path=src/components
npm run clean:logs -- --path=src/contexts
npm run clean:logs -- --path=src/hooks

# 6. Verificar novamente
npm run type-check
npm run build
```

**Resultado esperado:** 4320 console.* substituídos por appLogger.*

---

### ✅ **ETAPA 3: Commit das Mudanças**

```bash
# Adicionar mudanças ao git
git add .

# Commit com mensagem descritiva
git commit -m "refactor(logging): replace 4320 console.* with appLogger

- Implemented canonical appLogger system
- Replaced all console.log/warn/error calls
- Added structured logging with context
- Maintains backward compatibility

BREAKING CHANGE: none (fully backward compatible)
Sprint: 1-Critical
Refs: SPRINT_1_CRITICO_COMPLETO.md"

# Push para branch
git push origin main
```

---

### ✅ **ETAPA 4: Aplicar Migrações DB (STAGING PRIMEIRO!)**

```bash
# IMPORTANTE: Fazer backup antes!
# Aplicar em staging/dev primeiro, NUNCA direto em produção

# Conectar ao Supabase (staging)
supabase link --project-ref YOUR_STAGING_PROJECT_REF

# Revisar migrações
cat supabase/migrations/20251110_add_performance_indexes.sql
cat supabase/migrations/20251110_auth_hardening_rls.sql

# Aplicar migrações
supabase db push

# Verificar se aplicou corretamente
supabase db diff

# Verificar índices criados
psql postgres://[CONNECTION_STRING] -c "
SELECT 
  schemaname, 
  tablename, 
  indexname, 
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 20;
"

# Verificar RLS ativo
psql postgres://[CONNECTION_STRING] -c "
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
"
```

**Resultado esperado:** 
- ✅ 18 novos índices
- ✅ RLS ativo em todas as tabelas
- ✅ 24 policies criadas

---

### ⚠️ **ETAPA 5: Configurações Manuais (Supabase Dashboard)**

#### 5.1 Password Breach Protection

1. Acesse: https://supabase.com/dashboard/project/YOUR_PROJECT/auth/policies
2. Localize: **Password Breach Protection**
3. Ativar: Toggle para **Enabled** ✅
4. Salvar

#### 5.2 Rate Limiting

1. Acesse: https://supabase.com/dashboard/project/YOUR_PROJECT/auth/rate-limits
2. Configurar:
   ```
   Sign in attempts:     5 per hour per IP
   Sign up attempts:     3 per hour per IP
   Password reset:       3 per hour per email
   ```
3. Salvar

---

### ✅ **ETAPA 6: Validação Final**

```bash
# 1. Verificar TypeScript
npm run type-check

# 2. Rodar testes
npm run test:ci

# 3. Build de produção
npm run build

# 4. Verificar tamanho do bundle
ls -lh dist/

# 5. Preview local
npm run preview

# 6. Testar edge functions localmente (se tiver Deno instalado)
cd supabase/functions
deno task check
```

**Resultado esperado:** 
- ✅ Build sucesso
- ✅ Testes passando
- ✅ Bundle otimizado

---

### 🚀 **ETAPA 7: Deploy em Produção**

```bash
# Se estiver usando Netlify
netlify deploy --prod

# Se estiver usando Vercel
vercel --prod

# Ou seu comando de deploy customizado
npm run deploy:prod
```

---

## 📊 **VERIFICAÇÕES PÓS-DEPLOY**

### Health Check
```bash
# Verificar edge functions
curl https://YOUR_PROJECT.supabase.co/functions/v1/security-monitor/health-check

# Verificar rate limiter
curl https://YOUR_PROJECT.supabase.co/functions/v1/rate-limiter/status

# Verificar CSP headers
curl -I https://YOUR_APP_URL.com
```

### Monitoramento
```bash
# Ver logs recentes (Supabase Dashboard)
# https://supabase.com/dashboard/project/YOUR_PROJECT/logs/edge-functions

# Ver métricas de performance
# https://supabase.com/dashboard/project/YOUR_PROJECT/database/query-performance

# Ver índices mais usados
psql -c "SELECT * FROM index_usage_stats LIMIT 10;"
```

---

## 🆘 **ROLLBACK (Se necessário)**

### Reverter Migrações
```bash
# Criar migração de rollback
cat > supabase/migrations/$(date +%Y%m%d)_rollback_sprint1.sql << 'EOF'
-- Dropar índices
DROP INDEX IF EXISTS idx_component_instances_funnel_step;
DROP INDEX IF EXISTS idx_quiz_sessions_user_created;
-- ... (listar todos os índices)

-- Desabilitar RLS
ALTER TABLE funnels DISABLE ROW LEVEL SECURITY;
-- ... (para todas as tabelas)
EOF

# Aplicar rollback
supabase db push
```

### Reverter Código
```bash
# Voltar para commit anterior
git revert HEAD

# Ou resetar para commit específico
git reset --hard COMMIT_HASH_ANTERIOR

# Push forçado (CUIDADO!)
git push --force origin main
```

---

## 📞 **SUPORTE E TROUBLESHOOTING**

### Problemas Comuns

#### 1. "ts-morph not found"
```bash
npm install
```

#### 2. "Edge functions not compiling"
```bash
cd supabase/functions
deno cache --reload $(find . -name "*.ts")
```

#### 3. "Migrations fail"
```bash
# Verificar conexão
supabase status

# Reconectar
supabase link --project-ref YOUR_PROJECT
```

#### 4. "Too many console.logs breaking"
```bash
# Aplicar em partes menores
npm run clean:logs -- --path=src/components/editor
# Testar
npm run test:fast
# Continuar se OK
npm run clean:logs -- --path=src/components/quiz
```

---

## 📝 **CHECKLIST FINAL**

Antes de marcar como concluído:

- [ ] ✅ Edge functions validadas (`npm run ci:edge`)
- [ ] ✅ Console.logs limpos (`npm run clean:logs`)
- [ ] ✅ Código commitado e pushed
- [ ] ✅ Migrações aplicadas em staging
- [ ] ✅ Password breach protection ativado
- [ ] ✅ Rate limits configurados
- [ ] ✅ Testes passando (`npm run test:ci`)
- [ ] ✅ Build de produção OK (`npm run build`)
- [ ] ✅ Migrações aplicadas em produção
- [ ] ✅ Deploy realizado
- [ ] ✅ Health checks passando
- [ ] ✅ Monitoramento ativo

---

## 🎯 **MÉTRICAS DE SUCESSO**

Após execução completa, você deve ter:

- ✅ **0 console.* em produção** (ou ~0, alguns podem ser exceções)
- ✅ **18 novos índices** no database
- ✅ **24 RLS policies** ativas
- ✅ **6 edge functions** compilando sem erros
- ✅ **Build passando** em <2min
- ✅ **Queries 10-100x mais rápidas** (component_instances, quiz_sessions)

---

**Última atualização:** 2025-11-10  
**Versão:** 1.0  
**Sprint:** 1 - Crítico  
**Status:** ✅ Pronto para execução
