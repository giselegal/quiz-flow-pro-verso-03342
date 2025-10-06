# 📍 Localização do JSON do Funil no /editor

## 🎯 Resumo Executivo

O JSON do funil usado no `/editor` é carregado através de uma arquitetura em camadas que busca dados de múltiplas fontes com fallbacks automáticos.

---

## 🔄 Fluxo Completo de Carregamento

### 1️⃣ **Rota do Editor**
```typescript
// Arquivo: src/App.tsx (linhas 108-149)

// Rota sem ID (cria novo funil)
<Route path="/editor">
  <UnifiedCRUDProvider autoLoad={true}>
    <QuizFunnelEditorWYSIWYG />
  </UnifiedCRUDProvider>
</Route>

// Rota com ID específico
<Route path="/editor/:funnelId">
  <UnifiedCRUDProvider funnelId={params.funnelId} autoLoad={true}>
    <QuizFunnelEditorWYSIWYG funnelId={params.funnelId} />
  </UnifiedCRUDProvider>
</Route>
```

### 2️⃣ **Provider CRUD Unificado**
```typescript
// Arquivo: src/context/UnifiedCRUDProvider.tsx

// Função loadFunnel (linha 136-185)
const loadFunnel = async (id: string): Promise<void> => {
    // 1. Normaliza o ID do funil
    const normalized = normalizeFunnelId(id);
    
    // 2. Busca via EnhancedFunnelService
    const funnel = await enhancedFunnelService.getFunnelWithFallback(normalized.baseId);
    
    // 3. Se não encontrar, cria fallback
    if (!funnel) {
        const fallbackFunnel = await enhancedFunnelService.createFallbackFunnel(id);
        setCurrentFunnel(fallbackFunnel);
    }
}
```

### 3️⃣ **Enhanced Funnel Service (com Fallback)**
```typescript
// Arquivo: src/services/EnhancedFunnelService.ts

async getFunnelWithFallback(funnelId: string): Promise<UnifiedFunnelData | null> {
    // 1. Verifica cache em memória
    const cached = this.cache.get(funnelId);
    if (cached) return cached;
    
    // 2. Busca no FunnelUnifiedService (Supabase + IndexedDB)
    let funnel = await this.funnelService.getFunnel(funnelId);
    if (funnel) return funnel;
    
    // 3. Se for template, cria automaticamente
    if (this.templateService.shouldCreateFromTemplate(funnelId)) {
        funnel = await this.templateService.createFunnelFromTemplate(funnelId);
        if (funnel) return funnel;
    }
    
    // 4. Cria fallback básico (21 páginas vazias)
    return await this.createFallbackFunnel(funnelId);
}
```

### 4️⃣ **Funnel Unified Service (Persistência)**
```typescript
// Arquivo: src/services/FunnelUnifiedService.ts

async getFunnel(id: string, userId?: string): Promise<UnifiedFunnelData | null> {
    // 1. Verifica cache (FunnelCache com TTL de 5 minutos)
    const cached = this.cache.get<UnifiedFunnelData>(`funnel:${id}`);
    if (cached) return cached;
    
    // 2. Busca no Supabase
    const funnel = await this.loadFromSupabase(id, userId);
    if (funnel) {
        this.cache.set(`funnel:${id}`, funnel);
        return funnel;
    }
    
    // 3. Fallback para IndexedDB local
    return await this.loadFromIndexedDB(id);
}

// Método loadFromSupabase (linhas 870-900)
private async loadFromSupabase(id: string, userId?: string): Promise<UnifiedFunnelData | null> {
    // Busca na tabela 'funnels'
    const { data } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();
    
    if (!data) return null;
    
    // Busca páginas relacionadas na tabela 'funnel_pages'
    const { data: pages } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', id)
        .order('page_order');
    
    const funnel = this.convertFromSupabaseFormat(data);
    funnel.pages = pages || [];
    
    return funnel;
}
```

---

## 📊 Estrutura do JSON do Funil

### Interface TypeScript
```typescript
// Arquivo: src/services/FunnelUnifiedService.ts (linhas 23-47)

export interface UnifiedFunnelData {
    id: string;                    // ID único do funil
    name: string;                  // Nome do funil
    description?: string;          // Descrição opcional
    category?: string;             // Categoria (ex: 'quiz', 'outros')
    context: FunnelContext;        // Contexto (EDITOR, QUIZ, etc)
    userId: string;                // ID do usuário proprietário

    // Dados principais
    settings: any;                 // Configurações do funil
    pages: Array<{                 // Array de páginas/steps
        id: string;
        funnel_id: string;
        page_type: string;         // 'question', 'result', etc
        page_order: number;        // Ordem da página (1-21)
        title: string;
        blocks: any[];             // Blocos de conteúdo
        metadata: any;
        created_at: string;
        updated_at: string;
    }>;

    // Metadados
    isPublished: boolean;          // Status de publicação
    version: number;               // Versão do funil
    createdAt: Date;               // Data de criação
    updatedAt: Date;               // Data de atualização

    // Template info
    templateId?: string;           // ID do template base (se houver)
    isFromTemplate?: boolean;      // Indica se foi criado de template
}
```

### Exemplo Real de JSON
```json
// Arquivo: src/templates/models/funnel-21-steps.json

{
  "id": "default-quiz-funnel-21-steps",
  "name": "Funil Quiz 21 Etapas",
  "version": 1,
  "metadata": {
    "collectUserName": true,
    "seo": {
      "title": "Quiz de Estilo Pessoal",
      "description": "Descubra seu estilo"
    }
  },
  "steps": {
    "step-1": [
      {
        "type": "quiz-intro-header",
        "properties": {
          "title": "Bem-vinda"
        }
      }
    ],
    "step-2": [],
    "step-3": [],
    // ... até step-21
  },
  "variables": [
    {
      "key": "romantico",
      "label": "Romântico",
      "scoringWeight": 1
    }
  ]
}
```

---

## 💾 Locais de Armazenamento

### 1. **Supabase Database** (Principal)

#### Tabela `funnels`
- **Localização**: Banco PostgreSQL no Supabase
- **Colunas principais**:
  - `id`: UUID único
  - `name`: Nome do funil
  - `description`: Descrição
  - `user_id`: ID do proprietário
  - `is_published`: Boolean de publicação
  - `version`: Número da versão
  - `settings`: JSONB com configurações
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

#### Tabela `funnel_pages`
- **Localização**: Banco PostgreSQL no Supabase
- **Colunas principais**:
  - `id`: UUID único da página
  - `funnel_id`: Foreign key para `funnels`
  - `page_type`: Tipo da página
  - `page_order`: Ordem sequencial (1-21)
  - `title`: Título da página
  - `blocks`: JSONB com array de blocos
  - `metadata`: JSONB com metadados

**Query SQL de exemplo:**
```sql
-- Buscar funil completo
SELECT * FROM funnels WHERE id = 'funnel-id-aqui';

-- Buscar páginas do funil
SELECT * FROM funnel_pages 
WHERE funnel_id = 'funnel-id-aqui' 
ORDER BY page_order;
```

### 2. **IndexedDB** (Fallback Local)

- **Banco**: `funnel-quest-db`
- **Store**: `funnels`
- **Arquivo Service**: `src/services/storage/IndexedDBService.ts`
- **Quando é usado**:
  - Usuário não autenticado
  - Supabase indisponível
  - Modo offline
  - userId = 'anonymous' ou começa com 'temp-'

**Acesso via DevTools:**
```javascript
// Abrir Application > IndexedDB > funnel-quest-db > funnels
```

### 3. **Cache em Memória** (Temporário)

- **Classe**: `FunnelCache` dentro de `FunnelUnifiedService`
- **TTL**: 5 minutos (300.000ms)
- **Estrutura**:
```typescript
Map<string, CacheEntry<UnifiedFunnelData>> onde:
- Key: 'funnel:${id}'
- Value: {
    data: UnifiedFunnelData,
    timestamp: number,
    ttl: number,
    context?: FunnelContext,
    userId?: string
  }
```

### 4. **Arquivos de Template** (Read-only)

- **Localização**: `src/templates/models/`
- **Exemplos**:
  - `funnel-21-steps.json`
  - `step21-offer-template.json`
- **Uso**: Base para criação de novos funis

---

## 🔍 Como Inspecionar o JSON em Runtime

### No Editor (/editor)

1. **Via Console do Browser:**
```javascript
// Acessar contexto CRUD
const crudContext = window.__UNIFIED_CRUD_CONTEXT__;
console.log('Funil atual:', crudContext?.currentFunnel);

// Ver cache
window.__FUNNEL_CACHE__ = FunnelUnifiedService.getInstance();
```

2. **Via React DevTools:**
- Abrir React DevTools
- Buscar componente `UnifiedCRUDProvider`
- Ver state `currentFunnel`

3. **Via Redux DevTools (se aplicável):**
```javascript
// Verificar state do editor
store.getState().editor.currentFunnel
```

### No Supabase Dashboard

1. Acessar: https://app.supabase.com
2. Ir em: Table Editor → `funnels`
3. Filtrar por ID ou user_id
4. Ver JSON em `settings` e relacionar com `funnel_pages`

### No IndexedDB (DevTools)

1. Abrir DevTools (F12)
2. Application tab → Storage → IndexedDB
3. Expandir `funnel-quest-db` → `funnels`
4. Clicar no ID do funil para ver o JSON completo

---

## 🛠️ Comandos Úteis para Debug

### Ver JSON do Funil Atual
```javascript
// No console do navegador, dentro do /editor
const facade = window.__FUNNEL_FACADE__;
console.log('Snapshot:', facade?.getSnapshot());
```

### Forçar Reload do Funil
```javascript
// Limpar cache e recarregar
const service = FunnelUnifiedService.getInstance();
service.cache.invalidate();
window.location.reload();
```

### Exportar JSON para Arquivo
```javascript
// No console do navegador
const funnel = window.__UNIFIED_CRUD_CONTEXT__?.currentFunnel;
const json = JSON.stringify(funnel, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `funnel-${funnel.id}.json`;
a.click();
```

---

## 📚 Arquivos-Chave

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/App.tsx` | Define rotas `/editor` e `/editor/:funnelId` |
| `src/context/UnifiedCRUDProvider.tsx` | Provider principal, gerencia `currentFunnel` |
| `src/services/FunnelUnifiedService.ts` | CRUD completo + cache + persistência |
| `src/services/EnhancedFunnelService.ts` | Fallback automático + templates |
| `src/services/storage/IndexedDBService.ts` | Armazenamento local |
| `src/templates/models/funnel-21-steps.json` | Template base de 21 steps |
| `src/editor/facade/FunnelEditingFacade.ts` | Facade de edição (abstração) |
| `src/pages/editor/ModernUnifiedEditor.tsx` | Componente do editor atual |

---

## 🎯 Pontos de Entrada para Modificar o JSON

### 1. Criar Novo Funil
```typescript
// Via UnifiedCRUDProvider
const { createFunnel } = useUnifiedCRUD();
const newFunnel = await createFunnel('Meu Novo Funil', {
    category: 'quiz',
    templateId: 'default-quiz-funnel-21-steps'
});
```

### 2. Atualizar Funil Existente
```typescript
// Via UnifiedCRUDProvider
const { saveFunnel, currentFunnel } = useUnifiedCRUD();
const updated = {
    ...currentFunnel,
    name: 'Nome Atualizado',
    settings: { ...currentFunnel.settings, theme: 'dark' }
};
await saveFunnel(updated);
```

### 3. Via Facade (Recomendado no Editor)
```typescript
// Dentro do ModernUnifiedEditor
const facade = useFunnelFacade();

// Adicionar step
facade.addStep({ title: 'Nova Etapa', blocks: [] });

// Atualizar bloco
facade.updateBlock(stepId, blockId, { properties: { title: 'Novo Título' } });

// Salvar
await facade.save();
```

---

## ⚠️ Observações Importantes

1. **Deep Clone Automático**: Todos os dados passam por `deepClone()` para evitar mutações acidentais
2. **Cache TTL**: Cache expira após 5 minutos para evitar dados desatualizados
3. **Fallback Chain**: Supabase → IndexedDB → Criação automática
4. **Autenticação**: Funis salvos no Supabase requerem usuário autenticado
5. **Normalização de IDs**: IDs são normalizados antes de buscar (remove sufixos como `-step-1`)

---

## 📝 Checklist de Validação

- [x] Identificada rota `/editor` em `src/App.tsx`
- [x] Mapeado fluxo completo de carregamento
- [x] Localizado JSON no Supabase (tabelas `funnels` e `funnel_pages`)
- [x] Identificado fallback IndexedDB
- [x] Documentado formato da interface `UnifiedFunnelData`
- [x] Listados arquivos-chave do sistema
- [x] Fornecidos comandos para debug e inspeção

---

## 🔗 Links Relacionados

- [Análise Arquitetural Completa](./ANALISE_ARQUITETURAL_COMPLETA_EDITOR_SISTEMA.md)
- [Documentação da Facade](./src/editor/facade/FunnelEditingFacade.ts)
- [Guia de Migration do Editor](./src/pages/editor/EDITOR_MIGRATION.md)

---

**Última atualização**: 6 de outubro de 2025
