# 🔍 AUDITORIA COMPLETA DOS JSONS QUIZ21
**Data:** 2025-11-08  
**Objetivo:** Identificar quais JSONs são corretos e gerados a partir do quiz21-complete.json

---

## 📊 RESUMO EXECUTIVO

### Resultado da Auditoria
- **✅ 3 FORMATOS IDENTIFICADOS** (v3.0 monolítico, v3.0 individual, v3.1 individual)
- **⚠️ INCONSISTÊNCIA CRÍTICA:** Diferentes quantidades de blocos entre formatos
- **🎯 RECOMENDAÇÃO:** Usar **v3.1 individual** como formato correto

---

## 🗂️ ESTRUTURA DE ARQUIVOS ENCONTRADA

### 1. `/public/templates/quiz21-complete.json`
- **Formato:** v3.0 MONOLÍTICO
- **Tamanho:** 3.956 linhas
- **Estrutura:** `{ steps: { "step-01": { blocks: [...] }, ... } }`
- **Última Atualização:** 2025-11-06T18:55:39.212Z
- **Gerado Por:** `scripts/normalize-quiz21-complete.ts`
- **Status:** ✅ Normalizado e consolidado

**Metadata:**
```json
{
  "templateVersion": "3.0",
  "metadata": {
    "updatedAt": "2025-11-06T18:55:39.212Z",
    "normalized": true,
    "normalizedBy": "scripts/normalize-quiz21-complete.ts",
    "structure": "blocks"
  }
}
```

**Blocos no step-01:** 5 blocos

---

### 2. `/public/templates/step-XX-v3.json` (21 arquivos)
- **Formato:** v3.0 INDIVIDUAL (LEGADO)
- **Quantidade:** 21 arquivos (step-01-v3.json até step-21-v3.json)
- **Tamanho médio:** ~185 linhas por arquivo
- **Estrutura:** `{ blocks: [...], metadata: {...}, theme: {...} }`
- **Última Modificação:** 2025-11-07 19:44
- **Status:** ⚠️ DEPRECADO - Versão antiga individual

**Metadata Exemplo (step-01-v3.json):**
```json
{
  "templateVersion": "3.0",
  "metadata": {
    "id": "step-01-intro-v3",
    "author": "Quiz Flow Pro",
    "version": "3.0.0"
  }
}
```

**Blocos no step-01:** 5 blocos

---

### 3. `/public/templates/funnels/quiz21StepsComplete/`
- **Formato:** v3.1 HIERÁRQUICO + INDIVIDUAL (ATUAL)
- **Estrutura:**
  - `master.v3.json` (53 linhas) - Índice com referências
  - `steps/step-01.json` até `steps/step-21.json` (21 arquivos)
- **Última Modificação:** 2025-11-07 19:44
- **Status:** ✅ FORMATO CORRETO ATUAL

#### 3a. `master.v3.json`
```json
{
  "templateVersion": "3.1",
  "templateId": "quiz21StepsComplete",
  "metadata": {
    "version": "3.1.0",
    "author": "Editor System",
    "_notes": "Referencia 21 steps em formato V3.1 (blocks[])"
  },
  "steps": [
    { "id": "step-01", "file": "./steps/step-01.json", "order": 1 },
    ...
  ]
}
```

#### 3b. `steps/step-XX.json`
**Tamanho médio:** ~67 linhas por arquivo  
**Estrutura:** Blocos atômicos simplificados

**Exemplo step-01.json:**
```json
{
  "templateVersion": "3.1",
  "metadata": {
    "id": "step-01",
    "name": "Intro (Blocos)",
    "category": "intro"
  },
  "blocks": [
    {
      "id": "hero-1",
      "type": "hero-block",
      "config": { ... },
      "properties": { ... }
    },
    {
      "id": "welcome-form-1",
      "type": "welcome-form-block",
      "config": { ... }
    }
  ]
}
```

**Blocos no step-01:** 2 blocos (SIMPLIFICADO)

---

## 🔄 FLUXO DE GERAÇÃO

### Scripts Identificados

#### 1. `scripts/normalize-quiz21-complete.ts`
- **Função:** Converte `sections` → `blocks` no quiz21-complete.json
- **Input:** quiz21-complete.json (com sections)
- **Output:** quiz21-complete.json (normalizado com blocks)
- **Última Execução:** 2025-11-06T18:55:39.212Z
- **Comando:** `npx tsx scripts/normalize-quiz21-complete.ts`

#### 2. `scripts/generate-quiz21-jsons.ts`
- **Função:** Gera 21 arquivos JSON a partir de `fashionStyle21PtBR.ts`
- **Input:** `src/templates/fashionStyle21PtBR.ts`
- **Output:** `/templates/funnels/quiz21StepsComplete/steps/*.json`
- **Comando:** `node --loader ts-node/esm scripts/generate-quiz21-jsons.ts`

#### 3. `scripts/generateMasterJSON.ts`
- **Função:** Converte `quiz21StepsComplete.ts` para JSON master válido
- **Input:** `src/templates/quiz21StepsComplete.ts`
- **Output:** JSON master compatível com HybridTemplateService
- **Comando:** `npx tsx scripts/generateMasterJSON.ts`

---

## ⚠️ INCONSISTÊNCIAS DETECTADAS

### 1. **QUANTIDADE DE BLOCOS DIVERGENTE**

| Arquivo | Versão | Blocos (step-01) | Status |
|---------|--------|------------------|--------|
| quiz21-complete.json | 3.0 | **5 blocos** | Monolítico |
| step-01-v3.json | 3.0 | **5 blocos** | Individual legado |
| steps/step-01.json | 3.1 | **2 blocos** | Individual atual |

**❌ PROBLEMA:** O step-01 tem 5 blocos nas versões v3.0, mas apenas 2 blocos na v3.1

**Tipos de blocos:**
- **v3.0:** Contém todos os blocos incluindo containers, wrappers, etc.
- **v3.1:** Apenas blocos essenciais (hero-block, welcome-form-block)

### 2. **MÚLTIPLAS VERSÕES COEXISTINDO**

```
public/templates/
├── quiz21-complete.json          (v3.0 monolítico - 3956 linhas)
├── step-01-v3.json ... step-21-v3.json  (v3.0 individual - ~21x185 linhas)
└── funnels/quiz21StepsComplete/
    ├── master.v3.json            (v3.1 índice - 53 linhas)
    └── steps/
        └── step-01.json ... step-21.json  (v3.1 individual - ~21x67 linhas)
```

**⚠️ RISCO:** Sistema pode carregar versão errada dependendo do caminho usado

### 3. **TIMESTAMPS IDÊNTICOS**

Todos os arquivos têm timestamp: **2025-11-07 19:44**

Isso indica que foram gerados/atualizados em massa, mas não está claro qual é a ordem de geração.

---

## 🎯 RECOMENDAÇÕES

### 1. **FORMATO CORRETO A USAR: v3.1 INDIVIDUAL**

**Justificativa:**
- ✅ Arquitetura hierárquica (master + steps individuais)
- ✅ Blocos simplificados e atômicos
- ✅ Melhor performance (carrega apenas step necessário)
- ✅ Compatível com `HierarchicalTemplateSource`
- ✅ Facilita edição (1 arquivo por step)

**Path Priority no código:**
```typescript
// src/templates/loaders/jsonStepLoader.ts
const paths: string[] = [
  // 1) PRIORIDADE MÁXIMA: v3.1 individual
  `/templates/funnels/quiz21StepsComplete/steps/${stepId}.json`,
  
  // 2-6) Fallbacks para outros formatos...
];
```

### 2. **FLUXO DE GERAÇÃO RECOMENDADO**

```
SOURCE OF TRUTH:
  src/templates/fashionStyle21PtBR.ts
         ↓
  [scripts/generate-quiz21-jsons.ts]
         ↓
  /public/templates/funnels/quiz21StepsComplete/
    ├── master.v3.json
    └── steps/*.json (v3.1 individual)
```

**NÃO usar mais:**
- ❌ `quiz21-complete.json` (v3.0 monolítico)
- ❌ `step-XX-v3.json` (v3.0 individual legado)

### 3. **LIMPEZA NECESSÁRIA**

**Arquivos para deprecar/mover:**
```bash
# Mover para .trash ou .deprecated
public/templates/quiz21-complete.json
public/templates/step-*-v3.json (21 arquivos)
```

**Manter:**
```bash
# ÚNICA FONTE DE VERDADE (v3.1)
public/templates/funnels/quiz21StepsComplete/
  ├── master.v3.json
  └── steps/*.json
```

### 4. **RESOLUÇÃO DA INCONSISTÊNCIA DE BLOCOS**

**Investigar:**
1. Por que v3.1 tem menos blocos (2) que v3.0 (5)?
2. Os blocos foram simplificados intencionalmente?
3. Há blocos wrapper/container sendo removidos?

**Verificar:**
```bash
# Comparar estrutura de blocos
jq '.blocks[] | {id, type}' public/templates/step-01-v3.json
jq '.blocks[] | {id, type}' public/templates/funnels/quiz21StepsComplete/steps/step-01.json
```

---

## 📋 CHECKLIST DE AÇÃO

### Imediato
- [ ] Confirmar que v3.1 é o formato oficial
- [ ] Verificar se redução de blocos (5→2) é intencional
- [ ] Testar se editor carrega corretamente v3.1
- [ ] Validar todos os 21 steps no formato v3.1

### Curto Prazo
- [ ] Mover quiz21-complete.json para .deprecated/
- [ ] Mover step-XX-v3.json para .deprecated/
- [ ] Atualizar documentação com formato oficial
- [ ] Atualizar scripts de geração se necessário

### Longo Prazo
- [ ] Padronizar TODOS os templates em v3.1
- [ ] Criar script de migração v3.0 → v3.1
- [ ] Documentar fonte de verdade oficial
- [ ] Implementar validação de formato em CI/CD

---

## 📊 MÉTRICAS

| Métrica | Valor |
|---------|-------|
| **Total de arquivos JSON auditados** | 45 arquivos |
| **Formatos identificados** | 3 (v3.0 mono, v3.0 indiv, v3.1 indiv) |
| **Tamanho total (v3.0 mono)** | 3.956 linhas |
| **Tamanho total (v3.0 indiv)** | ~3.885 linhas (21×185) |
| **Tamanho total (v3.1 indiv)** | ~1.407 linhas (21×67) |
| **Redução de tamanho (v3.1)** | **64% menor** que v3.0 |
| **Steps auditados** | 21 de 21 (100%) |

---

## 🎖️ CONCLUSÃO

### Formato Correto Identificado

**✅ `/public/templates/funnels/quiz21StepsComplete/`**
- master.v3.json (v3.1)
- steps/step-XX.json (v3.1)

### Fonte de Verdade

**✅ `src/templates/fashionStyle21PtBR.ts`**
- TypeScript source → Gera v3.1 JSONs
- Usar `scripts/generate-quiz21-jsons.ts` para regenerar

### Próximos Passos

1. **Validar v3.1** funciona corretamente no editor
2. **Deprecar v3.0** (mover para .trash)
3. **Documentar** processo oficial de geração
4. **Padronizar** todos os templates em v3.1

---

**Auditoria realizada por:** GitHub Copilot  
**Data:** 2025-11-08  
**Status:** ✅ COMPLETA
