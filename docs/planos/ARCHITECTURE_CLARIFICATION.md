# 🎯 Clarificação de Arquitetura: Templates vs Funnels

## ❓ Questão Levantada

> "O quiz21StepsComplete não deveria ser um funil??? Pelo fato de ser um workflow com várias etapas?"

**Resposta: SIM!** A nomenclatura atual está confusa e precisa ser esclarecida.

## 📊 Análise da Confusão Atual

### Terminologia Atual (Problemática)

```typescript
// src/types/editor-resource.ts
export type EditorResourceType = 'template' | 'funnel' | 'draft';

// quiz21StepsComplete é classificado como 'template'
const knownTemplates = [
    'quiz21StepsComplete',  // ❌ Confuso!
    'quiz-21-steps',
    'intro-simples',
    'resultado-completo',
];
```

**Problema**: `quiz21StepsComplete` é um **WORKFLOW COMPLETO** (funil) com 21 etapas, mas está sendo tratado como um simples "template".

### O Que Realmente É

| Item | Tipo Correto | Descrição |
|------|--------------|-----------|
| `quiz21StepsComplete` | **Funnel Template** | Workflow completo de 21 etapas (funil de conversão) |
| `step-01` | **Component Template** | Componente individual reutilizável |
| `intro-simples` | **Component Template** | Componente de introdução |
| UUID (abc-123-...) | **Funnel Instance** | Cópia editável de um funnel template |

## 🏗️ Arquitetura Correta

### 1. Funnel Template (Modelo de Funil)

**Definição**: Workflow completo pré-construído com múltiplas etapas organizadas em sequência lógica.

**Características**:
- ✅ Workflow completo (início → meio → fim)
- ✅ Múltiplas etapas conectadas
- ✅ Lógica de navegação entre etapas
- ✅ Read-only (usado como base)
- ✅ Armazenado como JSON no repositório

**Exemplos**:
- `quiz21StepsComplete` - Quiz completo de estilo pessoal (21 etapas)
- `emagrecimento-funnel` - Funil de emagrecimento
- `venda-consultoria` - Funil de venda de consultoria

**Localização**:
```
/public/templates/funnels/
  ├── quiz21StepsComplete/
  │   ├── master.v3.json          (Metadados do funil)
  │   └── steps/
  │       ├── step-01.json        (Etapa 1)
  │       ├── step-02.json        (Etapa 2)
  │       └── ...
  ├── emagrecimento/
  └── venda-consultoria/
```

### 2. Component Template (Modelo de Componente)

**Definição**: Bloco ou seção individual reutilizável.

**Características**:
- ✅ Componente único
- ✅ Sem lógica de workflow
- ✅ Reutilizável em diferentes funnels
- ✅ Read-only

**Exemplos**:
- `intro-simples` - Tela de introdução
- `resultado-completo` - Tela de resultado
- `header-hero` - Header com hero section

**Localização**:
```
/public/templates/components/
  ├── intro-simples.json
  ├── resultado-completo.json
  └── header-hero.json
```

### 3. Funnel Instance (Instância de Funil)

**Definição**: Cópia editável de um funnel template, personalizada pelo usuário.

**Características**:
- ✅ Baseado em um funnel template
- ✅ Editável e personalizável
- ✅ Persistido no Supabase
- ✅ UUID único
- ✅ Propriedade de um usuário

**Exemplo**:
```
ID: f47ac10b-58cc-4372-a567-0e02b2c3d479
Nome: "Meu Quiz de Estilo Personalizado"
Baseado em: quiz21StepsComplete
Owner: user_123
Status: draft / published
```

**Localização**: Banco de dados Supabase

```sql
-- Tabela: funnels
CREATE TABLE funnels (
    id UUID PRIMARY KEY,
    name TEXT,
    template_id TEXT,  -- Ex: 'quiz21StepsComplete'
    user_id TEXT,
    config JSONB,      -- Steps personalizados
    status TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔄 Fluxo Correto de Uso

### Cenário 1: Usar Funnel Template "As Is"

```
1. Usuário acessa: /editor?resource=quiz21StepsComplete
2. Sistema detecta: "Funnel Template"
3. Carrega de: /public/templates/funnels/quiz21StepsComplete/
4. Modo: Read-only (visualização/preview)
5. Usuário pode: Apenas visualizar e testar
```

### Cenário 2: Criar Funnel Instance (Clonar Template)

```
1. Usuário clica: "Usar este funil"
2. Sistema:
   a. Cria novo registro em Supabase (UUID)
   b. Copia todos os steps do template
   c. Salva em funnels.config
3. Redireciona: /editor?resource={uuid}
4. Modo: Editável
5. Usuário pode: Personalizar tudo
```

### Cenário 3: Editar Funnel Instance Existente

```
1. Usuário acessa: /editor?resource=f47ac10b-58cc-...
2. Sistema detecta: "Funnel Instance" (UUID)
3. Carrega de: Supabase funnels.config
4. Modo: Editável
5. Salva mudanças em: Supabase (USER_EDIT priority)
```

## 🔧 Refatoração Proposta

### 1. Atualizar Type Definitions

```typescript
// src/types/editor-resource.ts

export type EditorResourceType = 
  | 'funnel-template'    // ✅ Novo: quiz21StepsComplete
  | 'funnel-instance'    // ✅ Novo: UUID-based funnels
  | 'component-template' // ✅ Novo: step-01, intro-simples
  | 'draft';             // Mantido

export interface EditorResource {
  id: string;
  type: EditorResourceType;
  name: string;
  source: EditorResourceSource;
  isReadOnly?: boolean;
  
  // ✅ Novo: Identificar template base
  baseTemplate?: string; // Para funnel-instance
  
  // ✅ Novo: Workflow metadata
  workflow?: {
    totalSteps: number;
    completedSteps?: number;
    currentStep?: number;
  };
}
```

### 2. Atualizar detectResourceType()

```typescript
// src/types/editor-resource.ts

export function detectResourceType(resourceId: string): EditorResourceType {
  // UUIDs são funnel instances
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(resourceId)) {
    return 'funnel-instance';
  }

  // Drafts
  if (resourceId.startsWith('draft-')) {
    return 'draft';
  }

  // ✅ Funnel templates (workflows completos)
  const funnelTemplates = [
    'quiz21StepsComplete',
    'quiz-21-steps',
    'emagrecimento-funnel',
    'venda-consultoria',
  ];
  
  if (funnelTemplates.includes(resourceId)) {
    return 'funnel-template';
  }

  // ✅ Component templates (componentes individuais)
  const componentTemplates = [
    'intro-simples',
    'resultado-completo',
    'header-hero',
  ];
  
  if (componentTemplates.includes(resourceId)) {
    return 'component-template';
  }

  // Steps individuais são component templates
  if (/^step-\d{2}$/i.test(resourceId)) {
    return 'component-template';
  }

  // Default: assumir funnel instance
  return 'funnel-instance';
}
```

### 3. Atualizar HierarchicalTemplateSource

```typescript
// src/services/core/HierarchicalTemplateSource.ts

async getPrimary(stepId: string, resourceId?: string): Promise<DataSourceResult<Block[]>> {
  // Detectar tipo de recurso
  const resourceType = resourceId ? detectResourceType(resourceId) : null;
  
  // Prioridades baseadas no tipo
  if (resourceType === 'funnel-instance') {
    // Prioridade 1: USER_EDIT (Supabase)
    // Prioridade 2: TEMPLATE_DEFAULT (baseTemplate)
  } else if (resourceType === 'funnel-template') {
    // Prioridade 1: TEMPLATE_DEFAULT (JSON)
    // Sem USER_EDIT (read-only)
  } else if (resourceType === 'component-template') {
    // Prioridade 1: TEMPLATE_DEFAULT (JSON)
  }
  
  // ... implementação
}
```

## 📋 Impacto da Mudança

### Vantagens ✅

1. **Clareza Conceitual**: Nomenclatura reflete a realidade
2. **Melhor UX**: Usuário entende diferença entre "usar template" e "editar meu funil"
3. **Código Mais Legível**: Tipos explícitos facilitam manutenção
4. **Escalabilidade**: Fácil adicionar novos funnel templates
5. **Separação de Responsabilidades**: Templates vs Instâncias claramente separados

### Desvantagens ⚠️

1. **Breaking Change**: Código existente precisa ser atualizado
2. **Migração de Dados**: Funnels existentes precisam ser categorizados
3. **Documentação**: Precisa atualizar toda documentação
4. **Testes**: Testes existentes podem quebrar

## 🎯 Recomendação

### Opção 1: Refatoração Completa (Ideal)

**Prós**: Resolve confusão de uma vez por todas
**Contras**: Maior esforço, risco de quebrar código existente
**Tempo**: 2-3 dias de trabalho

### Opção 2: Manter Status Quo com Documentação (Pragmático)

**Prós**: Sem riscos, menor esforço
**Contras**: Confusão conceitual permanece
**Tempo**: 1-2 horas (atualizar docs)

### Opção 3: Refatoração Gradual (Recomendado)

**Fase 1** (Imediato):
- ✅ Atualizar documentação clarificando terminologia
- ✅ Adicionar comentários no código explicando
- ✅ Criar aliases (`type FunnelTemplate = 'template'`)

**Fase 2** (Próximo Sprint):
- Implementar novos tipos sem quebrar existentes
- Migrar código gradualmente
- Manter backward compatibility

**Fase 3** (Futuro):
- Deprecar tipos antigos
- Remover código legacy
- Consolidar nomenclatura

## 📚 Conclusão

**Resposta à pergunta original**: 

> Sim, `quiz21StepsComplete` **É UM FUNIL** (funnel). Mais especificamente, é um **Funnel Template** (modelo de funil) que serve como base para criar Funnel Instances (instâncias editáveis).

A confusão vem da nomenclatura simplificada atual que não distingue entre:
- Funnel Template (modelo read-only)
- Funnel Instance (cópia editável)
- Component Template (componente individual)

**Recomendação**: Implementar Opção 3 (Refatoração Gradual) para corrigir isso sem quebrar o sistema atual.

---

**Data**: 2025-11-10  
**Versão**: 1.0  
**Status**: Proposta para Discussão
