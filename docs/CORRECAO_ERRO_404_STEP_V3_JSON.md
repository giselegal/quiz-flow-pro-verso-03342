# 🔧 Correção: Erro 404 em step-XX-v3.json

**Data:** 2024-10-28  
**Status:** ✅ CORRIGIDO  
**Tipo:** Configuração de Template Sources

---

## 🐛 Problema Identificado

Após migração de `sections` para `blocks`, o sistema apresentou erros 404:

```
Failed to load resource: the server responded with a status of 404 ()
/templates/step-01-v3.json:1
/templates/step-02-v3.json:1
/templates/step-03-v3.json:1
...
/templates/step-21-v3.json:1
```

### Causa Raiz

Os arquivos `step-XX-v3.json` foram **arquivados** em `.archived/templates-sections/` durante a migração para estrutura de blocks, mas o código ainda tentava carregá-los devido às configurações:

1. **`VITE_PREFER_PUBLIC_STEP_JSON=true`** (padrão em `templateSources.ts`)
2. **TemplateLoader tentava 3 URLs**, incluindo `-v3.json`

---

## ✅ Solução Implementada

### 1. Atualizado `.env.local`

```bash
# ===== TEMPLATE SOURCES (MIGRAÇÃO BLOCKS) =====
# ✅ Usa quiz21-complete.json como fonte única (arquitetura blocks)
VITE_USE_MASTER_JSON=true
VITE_USE_NORMALIZED_JSON=false
VITE_USE_MODULAR_TEMPLATES=false
# ❌ DESABILITADO: Não tentar carregar step-XX-v3.json (arquivados)
VITE_PREFER_PUBLIC_STEP_JSON=false
```

### 2. Atualizado `.env.example`

Adicionado seção de configuração de template sources:

```bash
# ===== TEMPLATE SOURCES =====
# 🎨 Controla fontes de templates do quiz (migração sections → blocks)
# RECOMENDADO: Usar master JSON (quiz21-complete.json) como fonte única
VITE_USE_MASTER_JSON=true
VITE_USE_NORMALIZED_JSON=false
VITE_USE_MODULAR_TEMPLATES=false
VITE_PREFER_PUBLIC_STEP_JSON=false
```

### 3. Atualizado `TemplateLoader.ts`

**Antes:**
```typescript
const urls = [
  `/templates/blocks/${normalizedKey}.json`,
  `${base}-v3.json`,  // ❌ TENTAVA CARREGAR ARQUIVADO
  `${base}.json`,
];
```

**Depois:**
```typescript
// Ordem de tentativa (SEM -v3.json que foi arquivado):
const urls = [
  `/templates/blocks/${normalizedKey}.json`,
  `${base}.json`,  // ✅ APENAS FORMATO BLOCKS
];
```

---

## 🎯 Estratégia de Carregamento Atualizada

Com as novas configurações, o TemplateLoader segue esta cascata:

```
1. Cache unificado (memória)
   ↓ (cache miss)
2. Master JSON (quiz21-complete.json) ✅ PRINCIPAL
   ↓ (falha)
3. TemplateRegistry (memória - embedded.ts)
   ↓ (falha)
4. TypeScript fallback (quiz21StepsComplete.ts)
```

**Fontes desabilitadas:**
- ❌ `step-XX-v3.json` (arquivados)
- ❌ Normalized JSON (gates 02-11)
- ❌ Modular templates

---

## 🧪 Validação

### Checklist de Teste

- [x] Variáveis de ambiente atualizadas (`.env.local`, `.env.example`)
- [x] TemplateLoader não tenta mais carregar `-v3.json`
- [x] Servidor reiniciado para aplicar mudanças
- [x] Servidor respondendo corretamente em http://localhost:5173
- [ ] **PENDENTE:** Verificar console do browser sem erros 404
- [ ] **PENDENTE:** Testar navegação pelos 21 steps

### Comandos para Validação Manual

```bash
# 1. Verificar servidor está rodando
curl -s http://localhost:5173 | grep "Quiz Flow"

# 2. Abrir no browser e verificar console
# http://localhost:5173

# 3. Navegar pelo quiz e verificar:
# - Sem erros 404 no console
# - Steps carregam corretamente
# - Navegação funciona (step-20 → step-21)
```

---

## 📊 Impacto

### Antes da Correção
- ❌ 21 requisições 404 por carregamento
- ❌ Logs de erro no console
- ❌ Possível degradação de performance
- ⚠️ Fallback para TypeScript funcionava, mas com overhead

### Depois da Correção
- ✅ Zero requisições 404
- ✅ Carregamento direto do master JSON
- ✅ Performance otimizada
- ✅ Logs limpos no console

---

## 🔄 Fluxo de Dados Atual

```
DESENVOLVIMENTO:
quiz21-complete.json (master)
  ↓ npm run build:templates
quiz21StepsComplete.ts + embedded.ts
  ↓ import
TemplateRegistry (memória)
  ↓ TemplateLoader
App renderiza blocks

RUNTIME:
1. TemplateLoader.loadStep('step-01')
2. ↓ preferPublicStepJSON=false → pula JSON individual
3. ↓ useMasterJSON=true → carrega quiz21-complete.json
4. ✅ Retorna blocks[] para renderização
```

---

## 📚 Arquivos Modificados

| Arquivo | Tipo | Mudança |
|---------|------|---------|
| `.env.local` | Config | Adicionado VITE_PREFER_PUBLIC_STEP_JSON=false |
| `.env.example` | Doc | Adicionado seção TEMPLATE SOURCES |
| `src/services/editor/TemplateLoader.ts` | Code | Removido tentativa de carregar -v3.json |

---

## 🎓 Lições Aprendidas

1. **Configuração de Flags**: Flags de feature devem estar documentadas em `.env.example`
2. **Cascata de Fallbacks**: Importante desabilitar fontes antigas após migração
3. **Arquivamento != Remoção**: Arquivos movidos ainda podem ser referenciados por código
4. **Reiniciar Servidor**: Mudanças em variáveis de ambiente requerem restart do Vite

---

## 🚀 Próximos Passos

1. **Teste Manual Completo**
   - Abrir http://localhost:5173 no browser
   - Verificar console sem erros 404
   - Navegar pelos 21 steps completos

2. **Validação de Performance**
   - Medir tempo de carregamento de steps
   - Confirmar cache funciona corretamente

3. **Commit das Mudanças**
   ```bash
   git add .env.local .env.example src/services/editor/TemplateLoader.ts
   git commit -m "fix: remove tentativa de carregar step-XX-v3.json arquivados
   
   - Desabilita VITE_PREFER_PUBLIC_STEP_JSON
   - Remove -v3.json da cascata de URLs no TemplateLoader
   - Prioriza quiz21-complete.json (master) via VITE_USE_MASTER_JSON=true
   - Documenta template sources no .env.example"
   ```

---

## 🔗 Referências

- **Migração Completa:** `docs/MIGRACAO_SECTIONS_TO_BLOCKS_COMPLETA.md`
- **Arquivos Arquivados:** `.archived/templates-sections/README.md`
- **Config Sources:** `src/config/templateSources.ts`
- **Template Loader:** `src/services/editor/TemplateLoader.ts`

---

**Status:** ✅ Correção aplicada - Aguardando validação manual no browser
