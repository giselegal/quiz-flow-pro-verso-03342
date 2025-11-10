# Solução: Etapas Não Carregando no Canvas

## 📋 Problema Original

As etapas não estavam sendo carregadas no canvas do editor (`/editor?resource=quiz21StepsComplete`) devido a três problemas principais:

1. **Violações de CSP (Content Security Policy)** bloqueando recursos externos
2. **Erros 404** da tabela `template_overrides` do Supabase (não existe)
3. **Falha no fallback** para templates JSON locais

## ✅ Soluções Implementadas

### 1. Correção do CSP (`index.html`)

**Problema**: CSP estava bloqueando:
- Script Lovable: `https://cdn.gpteng.co/lovable.js`
- Manifest: `https://lovable.dev/auth-bridge`
- Imagens Cloudinary: `https://res.cloudinary.com`

**Solução**: Adicionadas as seguintes permissões no CSP:
```html
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://cdn.gpteng.co https://lovable.dev
connect-src 'self' https://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com https://lovable.dev
img-src 'self' data: blob: https://res.cloudinary.com
manifest-src 'self' https://lovable.dev
```

### 2. Configuração de Ambiente (`.env`)

**Problema**: Sistema tentava acessar tabela `template_overrides` que não existe.

**Solução**: Criado `.env` com as seguintes configurações:
```env
# Desabilitar ADMIN_OVERRIDE para evitar 404
VITE_DISABLE_ADMIN_OVERRIDE=true
VITE_DISABLE_TEMPLATE_OVERRIDES=true

# Forçar uso de JSON templates
VITE_TEMPLATE_JSON_ONLY=true

# Habilitar HierarchicalSource para fallback correto
VITE_ENABLE_HIERARCHICAL_SOURCE=true

# Manter Supabase habilitado para persistência de funnels
VITE_DISABLE_SUPABASE=false
VITE_EDITOR_SUPABASE_ENABLED=true
```

### 3. Tratamento de Erros Aprimorado (`HierarchicalTemplateSource.ts`)

**Problema**: Erros 404 poluindo o console e impedindo fallback.

**Solução**: 
- Detecção expandida de códigos de erro PostgreSQL (PGRST116, PGRST301, 42P01)
- Silenciamento de erros esperados ("relation does not exist")
- Fallback correto para templates JSON

### 4. Migração do Banco de Dados

**Problema**: Coluna `config` não existia na tabela `funnels`.

**Solução**: Criada migração `20251110_add_config_column_to_funnels.sql` que:
- Adiciona coluna `config` (JSONB) na tabela `funnels`
- Cria índice GIN para performance
- Suporta estrutura: `{ steps: { "step-01": [...blocks] } }`

## 🔄 Como o Sistema Funciona Agora

### Carregamento de Templates

```
URL: /editor?resource=quiz21StepsComplete
  ↓
detectResourceType() identifica como "template"
  ↓
HierarchicalTemplateSource usa cadeia de prioridade:
  1. USER_EDIT (Supabase funnels.config) - Ignorado (sem funnelId)
  2. ADMIN_OVERRIDE (template_overrides) - Desabilitado via .env
  3. TEMPLATE_DEFAULT (JSON files) - ✅ USADO
  4. FALLBACK (TypeScript) - Desabilitado
```

### Fluxo de Edição de Funil

```
1. Usuário abre template: /editor?resource=quiz21StepsComplete
2. Sistema carrega de: /public/templates/funnels/quiz21StepsComplete/steps/*.json
3. Usuário faz alterações e salva → Cria novo funil com UUID
4. Sistema persiste em: funnels.config.steps["step-01"] = [blocks]
5. URL se torna: /editor?resource=abc-123-def-456
6. Próxima carga usa USER_EDIT (Supabase) como prioridade
```

## 📝 Respondendo à Dúvida

### `/editor?resource=quiz21StepsComplete` precisa existir no Supabase?

**Resposta: NÃO** (mas a terminologia é confusa - veja nota abaixo)

**Motivo**: `quiz21StepsComplete` é um **Funnel Template** (modelo de funil), não uma Funnel Instance.

- **Funnel Templates**: Modelos de workflows completos em `/public/templates/` (read-only)
- **Funnel Instances**: Cópias editáveis no banco de dados (UUID)

**O que acontece**:
1. `quiz21StepsComplete` é carregado dos arquivos JSON (template read-only)
2. Usuário pode visualizar e testar o workflow completo
3. Se salvar alterações → Sistema cria NOVO registro em `funnels` com UUID (instance)
4. Essa nova instance SIM precisa existir no Supabase

**Exemplo**:
- Funnel Template: `/editor?resource=quiz21StepsComplete` (JSON, read-only)
- Funnel Instance: `/editor?resource=f47ac10b-58cc-4372-a567-0e02b2c3d479` (Supabase, editável)

**⚠️ Nota sobre Terminologia**: 
`quiz21StepsComplete` **É tecnicamente um funil** (workflow de 21 etapas), mas o código atual chama de "template" para distinguir de instâncias editáveis. Ver `ARCHITECTURE_CLARIFICATION.md` para proposta de melhoria da nomenclatura.

## 🚀 Próximos Passos

### 1. Aplicar Migração no Supabase

Existem duas opções para aplicar a migração:

#### Opção A: Via Supabase Dashboard (Recomendado)
1. Acesse o dashboard do Supabase
2. Vá em SQL Editor
3. Cole o conteúdo de `supabase/migrations/20251110_add_config_column_to_funnels.sql`
4. Execute a query

#### Opção B: Via CLI do Supabase
```bash
# Se tiver Supabase CLI instalado
supabase db push

# Ou aplicar manualmente via script
npm run db:apply-remote -- --file supabase/migrations/20251110_add_config_column_to_funnels.sql
```

### 2. Verificar Funcionamento

1. **Build**: `npm run build` ✅ (já testado)
2. **Dev**: `npm run dev`
3. **Testar URL**: `http://localhost:8080/editor?resource=quiz21StepsComplete`
4. **Verificar**:
   - [ ] Console sem erros CSP
   - [ ] Console sem erros 404 de template_overrides
   - [ ] Steps carregam no canvas
   - [ ] Blocos aparecem no editor

### 3. Deploy

Após verificar localmente:
```bash
# Commit e push já foram feitos
# Fazer merge do PR
# Deploy automático ou manual conforme processo do projeto
```

## 🔍 Troubleshooting

### Problema: Steps ainda não carregam

**Verificar**:
1. `.env` está no root do projeto? ✅
2. Servidor reiniciado após criar `.env`?
3. Console mostra qual fonte está sendo usada?

**Debug**:
```javascript
// No console do browser
localStorage.setItem('DEBUG', 'true');
// Recarregar página e verificar logs
```

### Problema: Erros 404 ainda aparecem

**Causa**: Navegador pode estar cacheando requests anteriores.

**Solução**:
1. Limpar cache do navegador (Ctrl+Shift+Del)
2. Abrir em aba anônima
3. Hard refresh (Ctrl+Shift+R)

### Problema: Mudanças não aplicam

**Verificar**:
```bash
# .env está sendo lido?
cat .env

# Build está atualizado?
npm run build

# Variáveis corretas?
echo $VITE_TEMPLATE_JSON_ONLY
```

## 📚 Arquivos Modificados

1. ✅ `index.html` - CSP atualizado
2. ✅ `.env` - Configuração de ambiente (não commitado)
3. ✅ `src/services/core/HierarchicalTemplateSource.ts` - Tratamento de erros
4. ✅ `supabase/migrations/20251110_add_config_column_to_funnels.sql` - Nova migração

## 🎯 Resultado Esperado

Após aplicar todas as correções:

✅ Editor carrega sem erros de CSP  
✅ Console sem erros 404 de template_overrides  
✅ Steps carregam corretamente no canvas  
✅ JSON templates funcionam como fonte primária  
✅ Persistência em Supabase pronta para quando criar funnels  

## 💡 Notas Importantes

1. **`.env` não é commitado** - Cada desenvolvedor precisa criar o seu
2. **Migração é obrigatória** - Sem ela, salvar funnels não funcionará
3. **Templates ≠ Funnels** - Templates são estáticos, funnels são editáveis
4. **Supabase permanece ativo** - Apenas ADMIN_OVERRIDE foi desabilitado

---

**Data**: 2025-11-10  
**Versão**: 1.0  
**Autor**: Copilot
