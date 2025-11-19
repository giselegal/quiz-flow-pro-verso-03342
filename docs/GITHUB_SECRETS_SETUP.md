# 🔐 Configurar GitHub Secrets para CI/CD

Guia rápido para adicionar credenciais do Supabase ao GitHub Actions.

## 📋 O que são Secrets?

**Secrets** são variáveis de ambiente criptografadas que o GitHub Actions usa para acessar recursos externos (APIs, databases, etc.) sem expor credenciais no código.

## 🎯 Secrets Necessários

Para o workflow `sync-templates.yml` funcionar, você precisa configurar:

1. **`VITE_SUPABASE_URL`** - URL do seu projeto Supabase
2. **`VITE_SUPABASE_ANON_KEY`** - Chave pública (anon key) do Supabase

## 📍 Como Adicionar Secrets

### Passo 1: Acessar Configurações do Repositório

```
https://github.com/giselegal/quiz-flow-pro-verso-03342/settings/secrets/actions
```

Ou navegue manualmente:
1. Vá para o repositório no GitHub
2. Clique em **Settings** (⚙️)
3. No menu lateral esquerdo: **Secrets and variables** → **Actions**

### Passo 2: Adicionar Primeiro Secret

1. Clique no botão **New repository secret**
2. **Name:** `VITE_SUPABASE_URL`
3. **Secret:** Cole o valor:
   ```
   https://pwtjuuhchtbzttrzoutw.supabase.co
   ```
4. Clique em **Add secret**

### Passo 3: Adicionar Segundo Secret

1. Clique novamente em **New repository secret**
2. **Name:** `VITE_SUPABASE_ANON_KEY`
3. **Secret:** Cole o valor do seu `.env`:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w
   ```
4. Clique em **Add secret**

### Passo 4: Verificar

Após adicionar, você deve ver:

```
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
```

Na lista de secrets do repositório.

## 🚀 Testar o Workflow

### Teste Manual

1. Vá para **Actions** no GitHub
2. Selecione o workflow **Sync Templates from Supabase**
3. Clique em **Run workflow**
4. Escolha as opções:
   - ✅ **Dry run** (para testar sem modificar arquivos)
   - ⬜ **Force**
5. Clique em **Run workflow**

### Verificar Logs

1. Após executar, clique no workflow rodando
2. Clique no job **sync-templates**
3. Expanda os steps para ver logs detalhados

Se os secrets estiverem corretos, você verá:
```
🔄 SYNC: Supabase → Public Templates
🎯 Filtrando: apenas funnels publicados
✅ Sucesso!
```

Se houver erro:
```
❌ Credenciais do Supabase não configuradas!
```

## 🔄 Triggers do Workflow

Após configurar os secrets, o workflow executa automaticamente em:

### 1. **Agendamento** (Schedule)
- **Frequência:** A cada 6 horas
- **Cron:** `0 */6 * * *`
- Sincroniza em modo **dry-run** por segurança

### 2. **Manual** (Workflow Dispatch)
- Vá em **Actions** → **Sync Templates** → **Run workflow**
- Opções:
  - `dry_run`: Simular sem modificar
  - `force`: Ignorar validações

### 3. **Push na Main** (Automático)
- Quando arquivos específicos mudam:
  - `database/**`
  - `src/contexts/providers/SuperUnifiedProvider.tsx`

## 🛡️ Segurança

### ✅ Boas Práticas

- **Nunca** commite secrets no código
- Use `.env.local` para desenvolvimento local
- Adicione `.env.local` ao `.gitignore`
- Secrets são criptografados pelo GitHub
- Apenas repositórios com permissão podem acessar

### ⚠️ Atenção

- **ANON_KEY** é seguro expor (é pública)
- **SERVICE_ROLE_KEY** NUNCA exponha (é privada)
- Rotacione keys periodicamente no Supabase

## 🐛 Troubleshooting

### Erro: "Credenciais não configuradas"

**Causa:** Secrets não foram adicionados ou têm nome errado

**Solução:**
1. Verifique se os nomes são **EXATAMENTE**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Não use espaços ou caracteres especiais no nome
3. Re-adicione os secrets se necessário

### Erro: "column funnels.config does not exist"

**Causa:** Script estava usando schema antigo

**Solução:** Já corrigido! O script agora usa `funnels.pages`

### Warning: "Context access might be invalid"

**Causa:** VS Code não consegue validar secrets em tempo de desenvolvimento

**Solução:** É apenas um aviso! Ignora ou espera os secrets serem adicionados no GitHub.

## 📝 Comandos Úteis

### Testar Localmente (sem GitHub Actions)

```bash
# Dry run (simular)
npm run sync:supabase -- --all --dry-run

# Sincronizar todos (publicados + drafts)
npm run sync:supabase -- --all

# Sincronizar apenas publicados
npm run sync:supabase

# Forçar sync (ignora validações)
npm run sync:supabase:force
```

### Verificar Variáveis de Ambiente

```bash
# Ver se o .env está carregado
node -r dotenv/config -e "console.log(process.env.VITE_SUPABASE_URL)"
```

## 🎓 Próximos Passos

Após configurar os secrets:

1. ✅ Testar workflow manual (dry-run)
2. ✅ Verificar logs no GitHub Actions
3. ✅ Criar primeiro funnel no Supabase
4. ✅ Publicar o funnel (`is_published = true`)
5. ✅ Executar sync real
6. ✅ Verificar commit automático
7. ✅ Deploy atualizado (Netlify/Vercel)

## 📚 Referências

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**✨ Dica:** Após o primeiro sync bem-sucedido, o workflow rodará automaticamente a cada 6 horas mantendo `public/templates/` sempre sincronizado com o Supabase!
