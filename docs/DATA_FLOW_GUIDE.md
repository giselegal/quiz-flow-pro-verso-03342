# 🔄 FLUXO DE DADOS: Desenvolvimento vs Público

## 📊 PERGUNTA CHAVE: "Os JSONs de desenvolvimento são os mesmos dos públicos?"

### ✅ RESPOSTA CURTA
**NÃO, mas há sincronização automática via Supabase.**

- **Desenvolvimento**: JSONs editados salvos no **Supabase** (`funnels.config.steps[stepId]`)
- **Público**: JSONs estáticos em `public/templates/*.json` (apenas leitura, fallback offline)
- **Sincronização**: Automática via sistema de cache hierárquico

---

## 🗺️ ARQUITETURA COMPLETA

### 1️⃣ FONTES DE DADOS (Ordem de Prioridade)

```
┌─────────────────────────────────────────────────────────┐
│  HIERARQUIA DE FONTES (HierarchicalTemplateSource)     │
└─────────────────────────────────────────────────────────┘

1. 🔴 USER_EDIT (Prioridade Máxima)
   ├─ Local: Supabase → tabela `funnels.config.steps[stepId]`
   ├─ Quando: Usuário edita no editor e clica "Salvar"
   └─ Acesso: Online (requer conexão com Supabase)

2. 🟡 ADMIN_OVERRIDE (Prioridade Alta)
   ├─ Local: Supabase → tabela `template_overrides`
   ├─ Quando: Admin faz override global de um step
   └─ Acesso: Online (desativado se JSON_ONLY=true)

3. 🟢 TEMPLATE_DEFAULT (Prioridade Média)
   ├─ Local: public/templates/*.json (estáticos)
   ├─ Quando: Primeira carga, modo offline, ou sem edições
   └─ Acesso: Sempre disponível (arquivos estáticos)

4. 🔵 FALLBACK (Prioridade Baixa - DESATIVADO POR PADRÃO)
   ├─ Local: src/templates/quiz21StepsComplete.ts (TypeScript)
   ├─ Quando: Emergência (todas outras fontes falharam)
   └─ Acesso: Requer flag VITE_ENABLE_TS_FALLBACK=true
```

---

## 💾 FLUXO DE SALVAMENTO

### 📝 Quando o usuário clica "Salvar"

```typescript
// 1. SuperUnifiedProvider.saveStepBlocks()
const saveStepBlocks = async (stepIndex: number) => {
    const stepId = `step-${stepIndex.toString().padStart(2, '0')}`;
    const blocks = state.editor.stepBlocks[stepIndex];
    
    // 2. Salva no Supabase (tabela funnels)
    await hierarchicalTemplateSource.setPrimary(stepId, blocks, funnelId);
    
    // 3. Invalida caches (L1 Memory + L2 IndexedDB)
    await hierarchicalTemplateSource.invalidate(stepId, funnelId);
    
    // 4. Notifica outras tabs (BroadcastChannel)
    channel.postMessage({
        type: 'STEP_UPDATED',
        payload: { funnelId, stepId, stepIndex }
    });
};
```

### 🎯 Destino dos Dados

```sql
-- Tabela: funnels
-- Campo: config (JSONB)

{
  "steps": {
    "step-01": [ /* blocos do step 1 */ ],
    "step-02": [ /* blocos do step 2 */ ],
    ...
    "step-21": [ /* blocos do step 21 */ ]
  },
  "settings": { /* configurações globais */ }
}
```

**⚠️ IMPORTANTE**: 
- Dados salvos em `funnels.config` **NÃO** atualizam automaticamente `public/templates/*.json`
- Arquivos em `public/` são **ESTÁTICOS** e servem apenas como fallback

---

## 🚀 FLUXO DE PUBLICAÇÃO

### 📤 Quando o usuário clica "Publicar"

```typescript
// 1. SuperUnifiedProvider.publishFunnel()
const publishFunnel = async () => {
    // 1.1. Salvar todos os steps pendentes
    await ensureAllDirtyStepsSaved();
    
    // 1.2. Salvar configurações do funnel
    if (isDirty) {
        await saveFunnel();
    }
    
    // 1.3. Marcar funnel como publicado
    await supabase
        .from('funnels')
        .update({
            status: 'published',
            is_published: true,
            version: version + 1,
            published_at: new Date().toISOString()
        })
        .eq('id', funnelId);
};
```

### 🎯 O Que Acontece na Publicação

| Campo | Atualização |
|-------|-------------|
| `status` | `draft` → `published` |
| `is_published` | `false` → `true` |
| `version` | Incrementado (`v1` → `v2`) |
| `published_at` | Timestamp atual |
| `updated_at` | Timestamp atual |

**⚠️ ARQUIVOS PÚBLICOS NÃO SÃO ATUALIZADOS**

---

## 📁 ESTRUTURA DE ARQUIVOS

### Desenvolvimento (src/)

```
src/
├── templates/                    # Templates TypeScript (DESATIVADO)
│   └── quiz21StepsComplete.ts   # Fallback emergencial
├── services/
│   └── core/
│       ├── HierarchicalTemplateSource.ts  # SSOT (Single Source of Truth)
│       └── IndexedTemplateCache.ts        # Cache L2 (IndexedDB)
└── contexts/
    └── providers/
        └── SuperUnifiedProvider.tsx       # Gerencia salvamento
```

### Público (public/)

```
public/
├── templates/
│   ├── quiz21-complete.json             # ⚠️ ESTÁTICO - não atualiza automaticamente
│   ├── quiz21-complete.json.backup-sections
│   └── funnels/                         # Templates específicos de funis
│       ├── funnel-001.json
│       └── funnel-002.json
└── (73 arquivos HTML de diagnóstico)
```

---

## 🔄 CACHE E SINCRONIZAÇÃO

### Sistema de Cache Hierárquico

```
┌─────────────────────────────────────────────────────┐
│  CACHE L1 (Memory)                                  │
│  ├─ Armazenamento: Map<string, CacheEntry>         │
│  ├─ TTL: 5 minutos (padrão)                        │
│  └─ Escopo: Apenas na tab atual                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  CACHE L2 (IndexedDB)                               │
│  ├─ Armazenamento: Navegador (persistente)         │
│  ├─ TTL: 5 minutos (padrão)                        │
│  └─ Escopo: Todas as tabs do mesmo domínio         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  SUPABASE (Fonte Primária)                          │
│  ├─ Armazenamento: PostgreSQL (nuvem)              │
│  ├─ Tabela: funnels.config.steps[stepId]           │
│  └─ Escopo: Global (todas as sessões/dispositivos) │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  PUBLIC JSON (Fallback Offline)                     │
│  ├─ Armazenamento: public/templates/*.json         │
│  ├─ Acesso: Sempre disponível                      │
│  └─ Escopo: Apenas leitura (não sincroniza)        │
└─────────────────────────────────────────────────────┘
```

### 🔁 Invalidação de Cache

Quando um step é salvo:

1. ✅ Cache L1 (Memory) invalidado
2. ✅ Cache L2 (IndexedDB) invalidado
3. ✅ BroadcastChannel notifica outras tabs
4. ✅ Outras tabs recarregam automaticamente
5. ❌ Arquivos em `public/` **NÃO** são atualizados

---

## 🎮 MODOS DE OPERAÇÃO

### 🌐 Modo Online (Padrão)

```typescript
VITE_DISABLE_SUPABASE=false  // Padrão

// Fluxo:
1. Carregar: USER_EDIT (Supabase) → Cache L2 → TEMPLATE_DEFAULT
2. Salvar: Supabase funnels.config
3. Publicar: Supabase funnels.status = 'published'
```

### 📴 Modo Offline

```typescript
VITE_DISABLE_SUPABASE=true
// ou
localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');

// Fluxo:
1. Carregar: Cache L2 → TEMPLATE_DEFAULT (public/templates/*.json)
2. Salvar: Apenas Cache L1/L2 (não persiste em Supabase)
3. Publicar: Apenas atualiza estado local
```

### 📄 Modo JSON-Only

```typescript
VITE_TEMPLATE_JSON_ONLY=true  // Ativado em DEV por padrão

// Fluxo:
1. Força uso de JSONs estáticos (public/templates/*.json)
2. Ignora fallback TypeScript (quiz21StepsComplete.ts)
3. Desativa ADMIN_OVERRIDE
```

---

## ❓ PERGUNTAS FREQUENTES

### 1. "Por que os arquivos em public/ não atualizam automaticamente?"

**R:** Por design de segurança e performance:
- Arquivos em `public/` são **estáticos** e versionados com build
- Atualizar dinamicamente requer build/deploy
- Sistema usa **Supabase como fonte primária** (dinâmica)
- `public/templates/` serve apenas como **fallback offline**

### 2. "Como sincronizar public/ com Supabase?"

**R:** Existem duas abordagens:

#### Opção A: Export Manual (Recomendado)
```bash
# Script de export (a ser criado)
npm run export:templates

# Fluxo:
1. Busca dados de funnels.config no Supabase
2. Gera arquivos JSON em public/templates/
3. Commit e deploy
```

#### Opção B: Build Automático (CI/CD)
```yaml
# .github/workflows/deploy.yml
- name: Export templates
  run: npm run export:templates
  
- name: Build
  run: npm run build
  
- name: Deploy
  run: npm run deploy
```

### 3. "Posso usar apenas public/ sem Supabase?"

**R:** Sim, configure:
```typescript
// .env
VITE_DISABLE_SUPABASE=true
VITE_TEMPLATE_JSON_ONLY=true

// Resultado:
- ✅ Funciona 100% offline
- ✅ Usa apenas public/templates/*.json
- ❌ Não salva edições (apenas sessão)
- ❌ Não sincroniza entre dispositivos
```

### 4. "Como os botões Visualizar funcionam?"

```typescript
// QuizModularEditor.tsx

// Editar → dados locais (não salvos)
canvasMode = 'edit'
previewMode = 'live'
Fonte: state.editor.stepBlocks (memória)

// Visualizar (Editor) → dados salvos no Supabase
canvasMode = 'preview'
previewMode = 'live'
Fonte: Supabase funnels.config.steps[stepId]

// Visualizar (Publicado) → dados da versão publicada
canvasMode = 'preview'
previewMode = 'production'
Fonte: Supabase WHERE is_published = true
```

### 5. "Quando usar cada fonte?"

| Cenário | Fonte Recomendada |
|---------|-------------------|
| Desenvolvimento ativo | USER_EDIT (Supabase) |
| Testes offline | TEMPLATE_DEFAULT (public/) |
| Produção | USER_EDIT (published) |
| Demo/showcase | TEMPLATE_DEFAULT (estático) |
| Disaster recovery | FALLBACK (TypeScript) |

---

## 🧪 COMANDOS DE TESTE

### Testar Fluxo Completo

```bash
# 1. Teste de acesso
npm run test:access

# 2. Teste de estrutura e botões
npm run test:buttons

# 3. Verificar fonte ativa
# Abrir console do navegador (F12)
# Verificar logs:
# "[HierarchicalSource] Tentando fonte: USER_EDIT"
# "[HierarchicalSource] Tentando fonte: TEMPLATE_DEFAULT"
```

### Verificar Estado do Cache

```javascript
// Console do navegador (F12)

// Ver cache localStorage
Object.keys(localStorage).filter(k => k.includes('template'));

// Ver IndexedDB
indexedDB.databases().then(console.log);

// Ver cache L1 (Memory)
// Não é acessível diretamente, apenas via logs:
// "[HierarchicalSource] CACHE HIT"
```

---

## 📝 SCRIPT DE EXPORT (A IMPLEMENTAR)

```typescript
// scripts/export-templates-to-public.ts

/**
 * Exporta templates do Supabase para public/templates/
 * Uso: npm run export:templates
 */

import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

async function exportTemplates() {
    // 1. Buscar todos os funnels publicados
    const { data: funnels } = await supabase
        .from('funnels')
        .select('id, name, config')
        .eq('is_published', true);
    
    // 2. Para cada funnel, extrair steps
    for (const funnel of funnels) {
        const steps = funnel.config?.steps || {};
        
        // 3. Gerar JSON para cada step
        for (const [stepId, blocks] of Object.entries(steps)) {
            const outputPath = path.join(
                'public/templates/funnels',
                funnel.id,
                `${stepId}.json`
            );
            
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, JSON.stringify(blocks, null, 2));
        }
        
        console.log(`✅ Exportado: ${funnel.name} (${funnel.id})`);
    }
}

exportTemplates().catch(console.error);
```

---

## ✅ RESUMO EXECUTIVO

### Onde os Dados São Salvos

| Ação | Destino | Persistente | Sincroniza |
|------|---------|-------------|------------|
| **Editar** | Cache L1 (Memory) | ❌ Não | ❌ Não |
| **Salvar** | Supabase `funnels.config` | ✅ Sim | ✅ Sim |
| **Publicar** | Supabase `funnels.is_published` | ✅ Sim | ✅ Sim |
| **Build** | `public/templates/*.json` | ✅ Sim | ❌ Não |

### Fluxo Recomendado de Atualização

```
1. DESENVOLVIMENTO
   ├─ Editar no editor (http://localhost:8080/editor)
   ├─ Clicar "Salvar" → Supabase funnels.config
   └─ Clicar "Publicar" → Supabase is_published = true

2. SINCRONIZAÇÃO (Manual ou CI/CD)
   ├─ Executar: npm run export:templates
   ├─ Commit: git add public/templates/
   └─ Deploy: npm run build && npm run deploy

3. PRODUÇÃO
   ├─ Usuários acessam versão publicada
   ├─ Dados vêm de Supabase (fonte primária)
   └─ Fallback para public/ se offline
```

---

**Última atualização**: 19 de novembro de 2025  
**Versão**: PR #46 - Editor JSON integrado  
**Referências**:
- [SuperUnifiedProvider.tsx](../src/contexts/providers/SuperUnifiedProvider.tsx)
- [HierarchicalTemplateSource.ts](../src/services/core/HierarchicalTemplateSource.ts)
- [ACCESS_GUIDE.md](./ACCESS_GUIDE.md)
- [BUTTON_FIX_REPORT.md](./BUTTON_FIX_REPORT.md)
