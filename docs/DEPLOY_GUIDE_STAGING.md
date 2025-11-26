# 🚀 GUIA COMPLETO DE DEPLOY - STAGING

## 📋 Status Atual

✅ **Build concluído:** 7.8M (315 JS + 3 CSS)  
✅ **Variáveis configuradas:** Supabase URL + ANON_KEY  
✅ **Netlify.toml:** Pronto com redirects configurados  
⏳ **Pendente:** Aplicar RLS + Configurar Auth + Deploy

---

## 🔒 PASSO 1: Aplicar Políticas RLS no Supabase

### Opção A: Via Dashboard (Recomendado)

1. Acesse: https://supabase.com/dashboard/project/your-supabase-project-ref/editor

2. No SQL Editor, clique em **"New query"**

3. Copie e cole o conteúdo de `supabase/migrations/20251123_critical_rls_policies.sql`

4. Execute (Ctrl+Enter ou botão Run)

5. Valide:
```sql
-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('quiz_users', 'quiz_analytics', 'component_instances')
ORDER BY tablename, policyname;
```

**Resultado esperado:** 9 políticas (3 por tabela)

### Opção B: Via Script Manual

```bash
chmod +x scripts/apply-rls-manual.sh
./scripts/apply-rls-manual.sh
```

---

## 🔐 PASSO 2: Configurar Supabase Auth

### 2.1 Acessar Configurações
https://supabase.com/dashboard/project/your-supabase-project-ref/auth/url-configuration

### 2.2 Configurar URLs

**Site URL:**
```
https://quiz-flow-pro-staging.netlify.app
```

**Additional Redirect URLs:**
```
https://quiz-flow-pro-staging.netlify.app/auth
https://quiz-flow-pro-staging.netlify.app/auth/callback
http://localhost:5173/auth
http://localhost:5173/auth/callback
```

### 2.3 Configurar Email (Opcional)

Em **Auth > Email Templates**, configure:
- ✅ Enable email confirmations
- Personalize templates se necessário

---

## 🚀 PASSO 3: Deploy no Netlify

### Opção A: Deploy via CLI (Recomendado)

```bash
# Instalar Netlify CLI (se necessário)
npm install -g netlify-cli

# Login
netlify login

# Deploy de produção
netlify deploy --dir=dist --prod
```

Siga as instruções:
1. **Create & configure a new site:** Yes
2. **Team:** Selecione sua equipe
3. **Site name:** quiz-flow-pro-staging (ou outro nome)
4. Confirme o deploy

### Opção B: Deploy via Git (Automático)

1. Faça commit e push para o repositório:
```bash
git add .
git commit -m "feat: staging release - RLS + Auth + Backend integrations"
git push origin main
```

2. Conecte no Netlify Dashboard:
   - https://app.netlify.com/start
   - Conecte ao repositório GitHub
   - Configure build:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`

3. Adicione variáveis de ambiente:
```
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Opção C: Deploy Manual

1. Acesse: https://app.netlify.com/drop

2. Arraste a pasta `dist/` para o navegador

3. Configure variáveis de ambiente no site criado

---

## ✅ PASSO 4: Validação Pós-Deploy

### 4.1 Smoke Tests Básicos

Acesse sua URL de staging e teste:

1. **Homepage:** `https://seu-site.netlify.app/`
   - [ ] Página carrega
   - [ ] Sem erros no console

2. **Auth:** `https://seu-site.netlify.app/auth`
   - [ ] Login/Signup funcionam
   - [ ] Redirecionamento correto após login

3. **Editor:** `https://seu-site.netlify.app/editor`
   - [ ] Carrega o editor
   - [ ] Consegue adicionar blocos
   - [ ] Auto-save funciona (verificar badge)

4. **Quiz:** `https://seu-site.netlify.app/quiz`
   - [ ] Quiz renderiza
   - [ ] Navegação entre steps
   - [ ] Finalização funciona

5. **Dashboard:** `https://seu-site.netlify.app/admin`
   - [ ] Métricas carregam
   - [ ] Não há erros de permissão

### 4.2 Verificar Logs

```bash
# Netlify function logs
netlify logs

# Supabase logs
# Acesse: https://supabase.com/dashboard/project/your-supabase-project-ref/logs/explorer
```

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
**Causa:** RLS policies não aplicadas ou Auth não configurado  
**Solução:** Volte ao PASSO 1 e aplique as políticas RLS

### Erro: "Invalid API key"
**Causa:** Variável VITE_SUPABASE_ANON_KEY incorreta  
**Solução:** Verifique a key no Supabase Dashboard > Settings > API

### Erro: "Redirect mismatch"
**Causa:** URL não configurada no Supabase Auth  
**Solução:** Adicione a URL de staging no PASSO 2.2

### Build grande (7.8M)
**Status:** ⚠️ Normal por enquanto (fase 1+2)  
**Solução futura:** FASE 4 incluirá otimizações de bundle

---

## 📊 Métricas de Sucesso

### Performance (via Lighthouse)
- **Performance:** > 60 (aceitável para staging)
- **Accessibility:** > 90
- **Best Practices:** > 85
- **SEO:** > 80

### Funcionalidade
- ✅ Auth: login/signup
- ✅ Editor: criar + salvar funnel
- ✅ Publicação: funnel → produção
- ✅ Quiz: responder completo
- ✅ Analytics: ver resultados

---

## 🎯 Próximos Passos Após Deploy

### Imediato
1. Executar smoke tests completos
2. Compartilhar URL com stakeholders
3. Coletar feedback inicial

### Curto Prazo (FASE 3)
1. E2E tests com Playwright
2. Performance audit completo
3. Security penetration testing

### Médio Prazo (FASE 4-5)
1. Bundle optimization (target < 2MB)
2. Code splitting otimizado
3. Deploy em produção

---

## 📞 Suporte

**Documentação:**
- Netlify: https://docs.netlify.com/
- Supabase: https://supabase.com/docs

**Logs importantes:**
- Build logs: `docs/STAGING_DEPLOY_REPORT.md`
- RLS migration: `supabase/migrations/20251123_critical_rls_policies.sql`
- Validation: `docs/DEPLOY_VALIDATION_REPORT.md`

---

**Status Final:** 🟢 Pronto para deploy em staging
