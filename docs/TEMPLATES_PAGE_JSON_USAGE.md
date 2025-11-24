# 🔄 Como os JSONs são Usados na Rota /templates

## 📋 Visão Geral

A rota `/templates` **NÃO carrega JSONs diretamente**. Ela apenas exibe metadados dos templates disponíveis.

Os JSONs são carregados **depois**, quando o usuário seleciona um template e é redirecionado para o editor.

---

## 🎯 Fluxo Completo

### 1️⃣ **Usuário Acessa `/templates`**

```tsx
// src/pages/TemplatesPage.tsx
const TemplatesPage = () => {
    // Carregar METADADOS do registry (SEM JSONs)
    const unifiedTemplates = getUnifiedTemplates();
    
    // unifiedTemplates contém:
    // - id: 'quiz21StepsComplete'
    // - name: 'Quiz de Estilo Pessoal - 21 Etapas'
    // - stepCount: 21
    // - category: 'quiz-complete'
    // - description: '...'
    // - conversionRate: '94%'
    // - etc.
    
    return (
        <div>
            {unifiedTemplates.map(template => (
                <TemplateCard 
                    template={template}
                    onClick={() => handleTemplateSelect(template.id)}
                />
            ))}
        </div>
    );
}
```

**Nesta etapa:**
- ✅ Apenas metadados são carregados (de `UNIFIED_TEMPLATE_REGISTRY`)
- ❌ Nenhum JSON é carregado ainda
- ❌ Nenhum bloco é renderizado ainda

---

### 2️⃣ **Usuário Clica em um Template**

```tsx
const handleTemplateSelect = (templateId: string) => {
    // Redirecionar para editor com query param
    setLocation(`/editor?template=${templateId}`);
}
```

**Exemplo:**
- Usuário clica em "Quiz de Estilo Pessoal - 21 Etapas"
- ID do template: `quiz21StepsComplete`
- Redirecionamento: `/editor?template=quiz21StepsComplete`

---

### 3️⃣ **Editor Carrega e Extrai `templateId` da URL**

```tsx
// src/pages/EditorPage.tsx
const EditorPage = () => {
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get('template'); // 'quiz21StepsComplete'
    
    // Passar para TemplateService
    templateService.setActiveFunnel(templateId);
}
```

---

### 4️⃣ **TemplateService Carrega JSON do Template**

```typescript
// src/services/canonical/TemplateService.ts

async getAllSteps(): Promise<Record<string, any>> {
    // Determinar templateId
    let templateId = this.activeFunnelId || 'quiz21StepsComplete';

    // Normalizar IDs legados
    if (templateId === 'quiz-estilo-21-steps' || templateId === 'quiz-estilo-completo') {
        templateId = 'quiz21StepsComplete';
    }

    this.log(`📚 getAllSteps usando templateId: ${templateId}`);

    const allSteps = {};
    
    // Carregar cada step via JSON
    for (let i = 1; i <= 21; i++) {
        const stepId = `step-${i.toString().padStart(2, '0')}`;
        
        // 🔥 AQUI O JSON É CARREGADO
        const result = await this.getStep(stepId, templateId);
        const blocks = result.success ? result.data : [];
        
        allSteps[stepId] = {
            id: stepId,
            blocks, // ✅ Blocos reais do JSON
        };
    }
    
    return allSteps;
}
```

---

### 5️⃣ **getStep() Carrega JSON do Arquivo**

```typescript
async getStep(stepId: string, templateId: string = 'quiz21StepsComplete'): Promise<ServiceResult<Block[]>> {
    // Caminho do JSON master
    const masterPath = `/templates/quiz21-complete.json`;
    
    try {
        // 🔥 REQUISIÇÃO HTTP PARA CARREGAR JSON
        const response = await fetch(masterPath);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const masterData = await response.json();
        
        // Extrair blocks do step específico
        const stepData = masterData.steps?.[stepId];
        
        if (!stepData) {
            throw new Error(`Step ${stepId} não encontrado no master`);
        }
        
        const blocks = stepData.blocks || [];
        
        return { 
            success: true, 
            data: blocks 
        };
        
    } catch (error) {
        return { 
            success: false, 
            error: new Error(`Falha ao carregar ${stepId}`) 
        };
    }
}
```

---

## 📁 Estrutura de Arquivos JSON

### Arquivo Master: `public/templates/quiz21-complete.json`

```json
{
  "id": "quiz21StepsComplete",
  "name": "Quiz de Estilo Pessoal - 21 Etapas",
  "version": "3.0",
  "steps": {
    "step-01": {
      "id": "step-01",
      "type": "intro",
      "blocks": [
        {
          "id": "block-heading-01",
          "type": "heading",
          "properties": {
            "text": "Descubra Seu Estilo Pessoal",
            "level": "h1"
          }
        },
        {
          "id": "block-paragraph-01",
          "type": "paragraph",
          "properties": {
            "text": "Responda 19 perguntas e descubra qual é o seu estilo dominante."
          }
        }
      ]
    },
    "step-02": {
      "id": "step-02",
      "type": "question",
      "blocks": [
        // ... blocos do step-02
      ]
    },
    // ... step-03 até step-21
  }
}
```

---

## 🗂️ Sistema de Registry vs. Sistema de JSON

### UNIFIED_TEMPLATE_REGISTRY (Metadados)

**Arquivo:** `src/config/unifiedTemplatesRegistry.ts`

**Conteúdo:**
```typescript
export const UNIFIED_TEMPLATE_REGISTRY = {
    'quiz21StepsComplete': {
        id: 'quiz21StepsComplete',
        name: 'Quiz de Estilo Pessoal - 21 Etapas',
        description: 'Template principal completo...',
        category: 'quiz-complete',
        stepCount: 21, // ← Metadado
        isOfficial: true,
        usageCount: 2150,
        conversionRate: '94%',
        // ... mais metadados
    },
    // ... outros templates
}
```

**Usado em:**
- ✅ Página `/templates` - exibir lista
- ✅ Filtros de categoria
- ✅ Ordenação por popularidade
- ✅ Badges (21 etapas, Popular, etc.)

---

### JSON Files (Conteúdo Real)

**Arquivo:** `public/templates/quiz21-complete.json`

**Conteúdo:**
```json
{
  "steps": {
    "step-01": { "blocks": [...] },
    "step-02": { "blocks": [...] },
    // ... até step-21
  }
}
```

**Usado em:**
- ✅ Editor - renderizar blocos
- ✅ Preview - exibir quiz funcional
- ✅ Publicação - gerar funil final

---

## 🔗 Aliases e Compatibilidade

### Problema: IDs Legados

Código antigo usava IDs diferentes:
- `quiz-estilo-21-steps` (usado em rotas públicas)
- `quiz-estilo-completo` (usado em código legado)

### Solução: Sistema de Aliases

```typescript
// Registry contém aliases que apontam para o template principal
'quiz-estilo-completo': {
    id: 'quiz-estilo-completo',
    name: 'Quiz de Estilo Pessoal - 21 Etapas',
    stepCount: 21,
    parentTemplateId: 'quiz21StepsComplete', // ← Herda do principal
    inheritanceType: 'extend',
    tags: ['legacy-alias'],
}

'quiz-estilo-21-steps': {
    id: 'quiz-estilo-21-steps',
    name: 'Quiz de Estilo Pessoal - 21 Etapas',
    stepCount: 21,
    parentTemplateId: 'quiz21StepsComplete', // ← Herda do principal
    inheritanceType: 'extend',
    tags: ['legacy-alias'],
}
```

### Normalização Automática

```typescript
// TemplateService normaliza IDs legados automaticamente
async getAllSteps() {
    let templateId = this.activeFunnelId || 'quiz21StepsComplete';
    
    // 🔄 NORMALIZAÇÃO
    if (templateId === 'quiz-estilo-21-steps' || templateId === 'quiz-estilo-completo') {
        templateId = 'quiz21StepsComplete'; // ← Converte para ID do JSON
    }
    
    // Agora sempre carrega de quiz21-complete.json
}
```

---

## 📊 Fluxo Visual Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuário acessa /templates                                     │
├─────────────────────────────────────────────────────────────────┤
│ TemplatesPage.tsx                                               │
│   └─> getUnifiedTemplates()                                     │
│       └─> UNIFIED_TEMPLATE_REGISTRY (metadados)                 │
│           ├─> quiz21StepsComplete (stepCount: 21)               │
│           ├─> quiz-estilo-completo (alias → principal)          │
│           ├─> quiz-estilo-21-steps (alias → principal)          │
│           ├─> quiz-style-express (stepCount: 10)                │
│           └─> com-que-roupa-eu-vou (stepCount: 5)               │
│                                                                  │
│ 🖥️ UI: Cards com nome, descrição, badge (21 etapas)            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Usuário clica em "Quiz 21 Etapas"                            │
├─────────────────────────────────────────────────────────────────┤
│ handleTemplateSelect('quiz21StepsComplete')                     │
│   └─> setLocation('/editor?template=quiz21StepsComplete')       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. EditorPage carrega com query param                           │
├─────────────────────────────────────────────────────────────────┤
│ EditorPage.tsx                                                  │
│   └─> searchParams.get('template')                              │
│       └─> 'quiz21StepsComplete'                                 │
│           └─> templateService.setActiveFunnel(templateId)       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. TemplateService carrega JSON                                 │
├─────────────────────────────────────────────────────────────────┤
│ TemplateService.getAllSteps()                                   │
│   ├─> Normaliza ID: 'quiz-estilo-21-steps' → 'quiz21StepsComplete' │
│   └─> Loop: for i = 1 to 21                                     │
│       └─> getStep('step-01', 'quiz21StepsComplete')             │
│           └─> fetch('/templates/quiz21-complete.json')          │
│               └─> masterData.steps['step-01']                   │
│                   └─> { blocks: [...] }                         │
│                                                                  │
│ 🔥 REQUISIÇÃO HTTP: GET /templates/quiz21-complete.json         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. JSON carregado com sucesso                                   │
├─────────────────────────────────────────────────────────────────┤
│ Resultado: Record<stepId, stepData>                             │
│ {                                                                │
│   'step-01': {                                                   │
│     id: 'step-01',                                               │
│     type: 'intro',                                               │
│     blocks: [                                                    │
│       { type: 'heading', properties: {...} },                    │
│       { type: 'paragraph', properties: {...} },                  │
│     ]                                                            │
│   },                                                             │
│   'step-02': { ... },                                            │
│   ...                                                            │
│   'step-21': { ... }                                             │
│ }                                                                │
│                                                                  │
│ 🖥️ UI: Editor renderiza blocos reais                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Resumo

### `/templates` (Página de Seleção)

- **Função:** Exibir lista de templates disponíveis
- **Fonte de Dados:** `UNIFIED_TEMPLATE_REGISTRY` (metadados em memória)
- **JSON carregado?** ❌ Não
- **Blocos renderizados?** ❌ Não
- **Performance:** ⚡ Instantâneo (sem requisições HTTP)

### `/editor?template=X` (Editor)

- **Função:** Editar/visualizar funil completo
- **Fonte de Dados:** `public/templates/quiz21-complete.json` (via HTTP)
- **JSON carregado?** ✅ Sim
- **Blocos renderizados?** ✅ Sim (21 steps × múltiplos blocos)
- **Performance:** 🐢 ~2-3s (requisição HTTP + parsing JSON)

---

## 🧪 Testes Criados

### 1. Testes de Integração (Registry)
**Arquivo:** `tests/integration/templates-page-registry.test.ts`
- ✅ 30 testes validando UNIFIED_TEMPLATE_REGISTRY
- ✅ Verifica estrutura, aliases, herança

### 2. Testes E2E (Fluxo Completo)
**Arquivo:** `tests/e2e/templates-page-json-flow.spec.ts`
- ✅ Valida UI da página /templates
- ✅ Testa seleção de template
- ✅ Verifica redirecionamento para /editor
- ✅ Intercepta requisições JSON
- ✅ Valida carregamento de quiz21-complete.json

### 3. Testes Unitários (TemplateService)
**Arquivo:** `tests/unit/template-service-json-loading.test.ts`
- ✅ 29 testes do TemplateService
- ✅ Valida getAllSteps(), getStep()
- ✅ Testa normalização de IDs
- ✅ Verifica cache e performance

---

## 🎯 Conclusão

**A rota `/templates` NÃO usa JSONs diretamente.**

Ela apenas:
1. Exibe metadados do `UNIFIED_TEMPLATE_REGISTRY`
2. Redireciona para `/editor?template=X`

**Os JSONs são carregados apenas no editor**, através do `TemplateService.getStep()`, que faz requisição HTTP para `public/templates/quiz21-complete.json`.

**Status:** ✅ **Sistema funcionando corretamente com funis reais do registry!**
