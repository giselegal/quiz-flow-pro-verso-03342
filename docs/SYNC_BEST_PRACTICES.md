# 🔄 MELHORES PRÁTICAS: Sincronização de Dados

## 📊 Problema Identificado

**Situação Atual:**
- ❌ Dados de desenvolvimento (Supabase) desconectados dos arquivos públicos
- ❌ Arquivos em `public/` nunca atualizam automaticamente
- ❌ Risco de divergência entre produção e fallback offline

## ✅ SOLUÇÃO IMPLEMENTADA

### 1. Single Source of Truth (SSOT)

```
SUPABASE (Fonte Primária)
    ↓
  SCRIPT SYNC
    ↓
PUBLIC/TEMPLATES (Fallback)
```

**Princípio:** Supabase é a única fonte de verdade. Public é gerado automaticamente.

### 2. Versionamento Automático

```json
{
  "metadata": {
    "exportedAt": "2025-11-19T10:30:00Z",
    "source": "supabase",
    "version": 2,
    "isPublished": true,
    "_warning": "Arquivo gerado automaticamente. Não edite."
  }
}
```

### 3. Backup Automático

Antes de sobrescrever qualquer arquivo:
```
.backups/templates/quiz21StepsComplete/
  ├── backup-2025-11-19T10-00-00.json
  ├── backup-2025-11-19T11-00-00.json
  └── backup-2025-11-19T12-00-00.json
```

### 4. Git-Friendly

- ✅ Chaves ordenadas alfabeticamente
- ✅ Formatação consistente (2 espaços)
- ✅ Newline no final do arquivo
- ✅ Diffs mínimos entre versões

### 5. Validação de Integridade

```typescript
Validações automáticas:
✓ ID do funnel presente
✓ Nome do funnel presente
✓ Config.steps existe
✓ Steps é um objeto (não array)
✓ Cada stepId segue padrão step-XX
✓ Cada step tem array de blocos
```

### 6. Rollback Automático

Em caso de erro, restauração automática do backup mais recente.

---

## 🚀 COMANDOS IMPLEMENTADOS

### Sincronização Básica

```bash
# Sincronizar todos os funnels publicados
npm run sync:supabase

# Sincronizar funnel específico
npm run sync:supabase -- --funnel=quiz21StepsComplete

# Dry run (simular sem modificar arquivos)
npm run sync:supabase -- --dry-run

# Forçar sync (ignorar validações)
npm run sync:supabase -- --force

# Verbose (mais detalhes)
npm run sync:supabase -- --verbose
```

### Integração com CI/CD

```yaml
# .github/workflows/sync-templates.yml
name: Sync Templates

on:
  schedule:
    - cron: '0 */6 * * *'  # A cada 6 horas
  workflow_dispatch:        # Manual

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Sync templates
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: npm run sync:supabase
      
      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add public/templates/
          git diff --staged --quiet || git commit -m "chore: sync templates from Supabase"
          git push
```

---

## 📋 MELHORES PRÁTICAS DO MERCADO

### 1. **Jamstack Architecture** (Netlify, Vercel)

```
BUILD TIME
├─ Fetch dados do CMS/API
├─ Gerar arquivos estáticos
└─ Deploy para CDN

RUNTIME
├─ Servir arquivos estáticos (rápido)
└─ Fallback para API apenas se necessário
```

**Implementação:**
- ✅ Supabase = CMS
- ✅ Script sync = Build time data fetch
- ✅ public/ = Arquivos estáticos

### 2. **Progressive Enhancement**

```
NÍVEL 1: Arquivos estáticos (100% disponível)
    ↓
NÍVEL 2: Cache IndexedDB (melhor performance)
    ↓
NÍVEL 3: Supabase live (dados mais recentes)
```

### 3. **Content Versioning** (WordPress, Contentful)

```json
{
  "version": 2,
  "published": true,
  "publishedAt": "2025-11-19T10:00:00Z",
  "previousVersions": [
    {
      "version": 1,
      "publishedAt": "2025-11-18T15:00:00Z",
      "backup": ".backups/v1.json"
    }
  ]
}
```

### 4. **Atomic Deploys** (Vercel, Netlify)

```bash
# Garantir que deploy é atômico (tudo ou nada)
sync && build && test && deploy
```

**Implementação:**
```bash
npm run sync:supabase && \
npm run build && \
npm test && \
npm run deploy
```

### 5. **Cache Invalidation** (CDN Best Practices)

```
Supabase Update → Webhook → CI/CD → Build → Deploy → Purge CDN
```

**Implementação com Netlify:**
```javascript
// netlify/functions/supabase-webhook.js
export async function handler(event) {
  // Validar webhook do Supabase
  const { table, record } = JSON.parse(event.body);
  
  if (table === 'funnels' && record.is_published) {
    // Trigger build no Netlify
    await fetch('https://api.netlify.com/build_hooks/YOUR_HOOK_ID', {
      method: 'POST'
    });
  }
  
  return { statusCode: 200 };
}
```

---

## 🎯 ESTRATÉGIAS DE SINCRONIZAÇÃO

### Estratégia 1: Manual (Desenvolvimento)

```bash
# Quando finalizar edições importantes
npm run sync:supabase
git add public/templates/
git commit -m "sync: update templates from Supabase"
git push
```

**Quando usar:**
- ✅ Desenvolvimento ativo
- ✅ Controle total sobre deploys
- ✅ Revisar mudanças antes de publicar

### Estratégia 2: Scheduled (CI/CD)

```yaml
# A cada 6 horas
on:
  schedule:
    - cron: '0 */6 * * *'
```

**Quando usar:**
- ✅ Produção estável
- ✅ Atualizações automáticas
- ✅ Menos intervenção manual

### Estratégia 3: Webhook (Real-time)

```
Supabase → Webhook → Netlify Build Hook → Auto Deploy
```

**Quando usar:**
- ✅ Conteúdo muda frequentemente
- ✅ Necessidade de updates quase real-time
- ✅ Equipe grande editando conteúdo

### Estratégia 4: Híbrida (Recomendada)

```
DESENVOLVIMENTO
├─ Manual: npm run sync:supabase
└─ Review antes de commit

PRODUÇÃO
├─ Webhook: Updates críticos (publicação)
├─ Scheduled: Sync regular (6h)
└─ Manual: Emergency fixes
```

---

## 🔐 SEGURANÇA E VALIDAÇÃO

### Validações Pré-Sync

```typescript
✓ Credenciais Supabase válidas
✓ Permissões de escrita em public/
✓ Backup criado com sucesso
✓ Integridade dos dados (schema válido)
✓ Git status clean (evitar conflitos)
```

### Validações Pós-Sync

```typescript
✓ Arquivos gerados existem
✓ JSON válido (parse sem erros)
✓ Estrutura correta (metadata + steps)
✓ Número de steps esperado
✓ Build passa sem erros
```

### Rollback Automático

```bash
# Se alguma validação falhar
if ! npm run build; then
  echo "Build falhou! Restaurando backup..."
  npm run restore:templates
  exit 1
fi
```

---

## 📈 MÉTRICAS E MONITORAMENTO

### Logs Estruturados

```json
{
  "timestamp": "2025-11-19T10:30:00Z",
  "event": "template_sync",
  "funnelId": "quiz21StepsComplete",
  "version": 2,
  "steps": 21,
  "success": true,
  "duration": "1.2s"
}
```

### Dashboard de Sincronização

```
┌─────────────────────────────────────────┐
│  TEMPLATE SYNC STATUS                   │
├─────────────────────────────────────────┤
│  Último sync: 2025-11-19 10:30:00       │
│  Funnels sincronizados: 5/5             │
│  Tempo total: 3.5s                      │
│  Erros: 0                               │
│                                         │
│  ✅ quiz21StepsComplete (21 steps)     │
│  ✅ fashionStyle21 (21 steps)          │
│  ✅ personalityQuiz (15 steps)         │
│  ✅ leadCapture (5 steps)              │
│  ✅ productRecommender (12 steps)      │
└─────────────────────────────────────────┘
```

---

## 🎓 COMPARAÇÃO COM OUTRAS PLATAFORMAS

### WordPress + WP Engine

```
Publicar Post → WP REST API → Build → Deploy
```

### Contentful CMS

```
Content Update → Webhook → Gatsby Build → Netlify Deploy
```

### Strapi + Next.js

```
Strapi Update → Incremental Static Regeneration → Vercel
```

### Nossa Implementação

```
Supabase Update → Script Sync → Git Commit → Deploy
```

**Vantagens:**
- ✅ Full control sobre o processo
- ✅ Git como source control
- ✅ Offline-first (arquivos estáticos)
- ✅ Sem vendor lock-in

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Setup Inicial ✅

- [x] Script de sincronização criado
- [x] Validações implementadas
- [x] Sistema de backup
- [x] Documentação completa

### Fase 2: Integração (TODO)

- [ ] Adicionar comando ao package.json
- [ ] Testar em ambiente local
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Configurar webhooks (opcional)

### Fase 3: Monitoramento (TODO)

- [ ] Logs estruturados
- [ ] Dashboard de status
- [ ] Alertas de falha
- [ ] Métricas de performance

### Fase 4: Otimização (TODO)

- [ ] Incremental sync (apenas mudanças)
- [ ] Compressão de arquivos
- [ ] CDN purge automático
- [ ] A/B testing de versões

---

## 🚀 PRÓXIMOS PASSOS

1. **Testar o Script**
   ```bash
   npm run sync:supabase -- --dry-run
   ```

2. **Configurar CI/CD**
   - Copiar `.github/workflows/sync-templates.yml`
   - Adicionar secrets no GitHub

3. **Primeira Sincronização Real**
   ```bash
   npm run sync:supabase
   git status  # Revisar mudanças
   git add public/templates/
   git commit -m "sync: initial template sync from Supabase"
   ```

4. **Monitorar e Ajustar**
   - Verificar logs
   - Ajustar frequência de sync
   - Otimizar conforme necessário

---

**Última atualização:** 19 de novembro de 2025  
**Status:** ✅ Pronto para implementação  
**Documentação relacionada:**
- [DATA_FLOW_GUIDE.md](./DATA_FLOW_GUIDE.md)
- [ACCESS_GUIDE.md](./ACCESS_GUIDE.md)
