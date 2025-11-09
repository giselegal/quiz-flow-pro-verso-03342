# 📊 HIERARQUIA DE FONTES DE DADOS - Steps 1-21

## ✅ ORDEM CORRETA (Prioridade)

### 1️⃣ **Funnel Existente** (Highest Priority)
```
Fonte: Banco de dados (via quizEditorBridge)
Uso: Rascunhos salvos pelo usuário
Status: ✅ SEMPRE tem prioridade quando existe
```

### 2️⃣ **Per-Step JSONs Individuais** ⭐ **PRINCIPAL**
```
Localização: public/templates/blocks/step-01.json até step-21.json
Características:
  ✅ Um arquivo por step
  ✅ Mais fácil de manter e editar
  ✅ Lazy loading (carrega sob demanda)
  ✅ Fonte primária para templates novos
  ✅ Gerado via: npm run blocks:from-master

Exemplo:
  public/templates/blocks/
    ├── step-01.json  (5 blocos - intro)
    ├── step-02.json  (4 blocos - pergunta)
    ├── step-03.json  (4 blocos - pergunta)
    └── ... até step-21.json
```

### 3️⃣ **Master JSON Consolidado** (Fallback)
```
Localização: public/templates/quiz21-complete.json
Características:
  ⚠️ Todos os 21 steps em UM único arquivo (~3600 linhas)
  ⚠️ Mais difícil de manter
  ⚠️ Carregamento completo (não lazy)
  ✅ Usado como FALLBACK se per-step falhar
  ✅ Útil para backup e sincronização

Estrutura:
  {
    "steps": {
      "step-01": { blocks: [...] },
      "step-02": { blocks: [...] },
      ...
    }
  }
```

### 4️⃣ **TypeScript Template** (Last Resort)
```
Localização: src/templates/quiz21StepsComplete.ts
Características:
  ❌ Hardcoded no código fonte
  ❌ Requer rebuild para alterar
  ✅ Garantia de fallback sempre disponível
  ✅ Usado apenas se TUDO falhar
```

---

## 🔧 IMPLEMENTAÇÃO

### Arquivo: `src/components/editor/quiz/hooks/useTemplateLoader.ts`

```typescript
// Estratégia 1: Funnel existente
if (funnelId) {
  const result = await loadFromFunnel(funnelId);
  if (result) return result;
}

// Estratégia 2: Per-Step JSONs (PRIORIDADE!)
const result = await loadFromPerStepJSONs();
if (result) return result;

// Estratégia 3: Master JSON (FALLBACK)
const result = await loadFromMasterJSON();
if (result) return result;

// Estratégia 4: TypeScript template (ÚLTIMO RECURSO)
return loadFromTSTemplate();
```

---

## ✅ CORREÇÃO APLICADA

### ❌ **ANTES (ERRADO)**
```
1. Funnel
2. Master JSON ← Carregava TUDO de uma vez
3. TypeScript template
```

### ✅ **DEPOIS (CORRETO)**
```
1. Funnel
2. Per-Step JSONs ← Lazy loading, mais eficiente
3. Master JSON (fallback)
4. TypeScript template
```

---

## 📈 BENEFÍCIOS DA HIERARQUIA CORRETA

1. ✅ **Performance**: Lazy loading dos per-step JSONs (carrega apenas o necessário)
2. ✅ **Manutenção**: Editar um step não afeta os outros
3. ✅ **Versionamento**: Git diff mais limpo (mudanças isoladas por arquivo)
4. ✅ **Debugging**: Mais fácil identificar problemas em steps específicos
5. ✅ **Escalabilidade**: Adicionar novos steps não aumenta um arquivo gigante

---

## 🧪 TESTES

### Verificar no console do navegador:
```javascript
// Abra /editor?template=quiz21StepsComplete
// Observe os logs:

✅ [step-01] Per-step JSON carregado: 5 blocos
✅ [step-02] Per-step JSON carregado: 4 blocos
✅ [step-03] Per-step JSON carregado: 4 blocos
...
✅ Per-step JSONs carregados: 21/21 steps, 103 blocos
```

### Script de diagnóstico:
```bash
# Verifica a estrutura dos arquivos
node scripts/diagnostic-steps-1-21.mjs

# Resultado esperado:
# ✅ Steps com blocos: 21/21
```

---

## 🎯 CONCLUSÃO

A hierarquia agora está **CORRETA**! 

- **Per-Step JSONs** são a fonte primária ✅
- **Master JSON** é apenas fallback ✅
- Todos os 21 steps estão disponíveis ✅

**Status:** 🟢 RESOLVIDO

---

**Última atualização:** 2025-10-29  
**Versão:** 2.0.0
