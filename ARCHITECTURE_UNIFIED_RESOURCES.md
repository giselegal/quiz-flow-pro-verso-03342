# 🎯 Arquitetura Unificada: Template = Funnel = Resource

**Data:** 6 de novembro de 2025  
**Status:** ✅ Implementado

## 📋 Visão Geral

Unificamos a arquitetura eliminando a distinção artificial entre "template" e "funnel". Agora **tudo é um EditorResource** com diferentes características.

## 🔧 O Que Mudou

### Antes (❌ Problemático)

```typescript
// Lógica condicional complexa baseada em query params
?template=xxx     → Modo Template (local)
?funnelId=yyy     → Modo Funnel (Supabase)
(sem params)      → Modo Livre

// Props duplicadas
type Props = {
  templateId?: string;
  funnelId?: string;
  // ... lógica condicional em todo lugar
}
```

### Depois (✅ Unificado)

```typescript
// Uma única abstração
?resource=xxx     → Carrega qualquer recurso (auto-detecta tipo)

// Props simples
type Props = {
  resourceId?: string;
  editorResource?: EditorResource;
  isReadOnly?: boolean;
}
```

---

## 📦 Arquivos Criados

### 1. `src/types/editor-resource.ts`

Define o tipo unificado e funções utilitárias:

```typescript
export type EditorResourceType = 'template' | 'funnel' | 'draft';
export type EditorResourceSource = 'local' | 'supabase' | 'embedded';

export interface EditorResource {
  id: string;
  type: EditorResourceType;
  name: string;
  source: EditorResourceSource;
  isReadOnly?: boolean;
  canClone?: boolean;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    version?: number;
    description?: string;
    tags?: string[];
    clonedFrom?: string; // Para recursos clonados
  };
}
```

**Funções utilitárias:**
- `detectResourceType(resourceId)` - Identifica se é template, funnel ou draft pelo ID
- `detectResourceSource(resourceId, hasSupabase)` - Identifica origem (local, embedded, supabase)

### 2. `src/hooks/useEditorResource.ts`

Hook unificado para carregar qualquer tipo de recurso:

```typescript
export function useEditorResource(options: UseEditorResourceOptions): UseEditorResourceReturn {
  // Carrega templates, funnels ou drafts de forma transparente
  // Retorna metadata unificada
  // Suporta clonagem
}
```

**Retorna:**
- `resource` - Metadata do recurso
- `isLoading` - Estado de carregamento
- `error` - Erros durante carregamento
- `resourceType` - Tipo auto-detectado
- `isReadOnly` - Se é somente leitura
- `canClone` - Se pode clonar
- `clone()` - Função para clonar o recurso

---

## 🔄 Migração de Código

### pages/editor/index.tsx

**Antes:**
```typescript
const funnelId = useFunnelIdFromLocation(); // Lógica complexa
const templateId = params.get('template');

<QuizModularEditor 
  templateId={templateId}
  funnelId={funnelId}
/>
```

**Depois:**
```typescript
const resourceId = useResourceIdFromLocation(); // Simples!
const editorResource = useEditorResource({ resourceId });

<QuizModularEditor 
  resourceId={resourceId}
  editorResource={editorResource.resource}
  isReadOnly={editorResource.isReadOnly}
/>
```

### QuizModularEditor Props

**Antes:**
```typescript
type QuizModularEditorProps = {
  funnelId?: string;
  templateId?: string;
  initialStepKey?: string;
};
```

**Depois:**
```typescript
type QuizModularEditorProps = {
  resourceId?: string;           // ✅ Novo - ID unificado
  editorResource?: EditorResource; // ✅ Novo - Metadata
  isReadOnly?: boolean;           // ✅ Novo - Controle explícito
  
  // @deprecated - Mantidos para backward compatibility
  funnelId?: string;
  templateId?: string;
  initialStepKey?: string;
};
```

---

## 🎯 Detecção Automática de Tipo

O sistema detecta automaticamente o tipo de recurso baseado no ID:

| ID | Tipo Detectado | Fonte |
|----|----------------|-------|
| `quiz21StepsComplete` | `template` | `embedded` |
| `step-01` | `template` | `embedded` |
| `abc-123-uuid` | `funnel` | `supabase` |
| `draft-1730000000` | `draft` | `local` |

```typescript
// Exemplos de detecção automática
detectResourceType('quiz21StepsComplete') → 'template'
detectResourceType('step-01')             → 'template'
detectResourceType('550e8400-e29b-...')   → 'funnel'
detectResourceType('draft-123')           → 'draft'
```

---

## 🔗 URLs Suportadas

### Novo Formato (Recomendado)

```bash
# Carrega qualquer recurso (auto-detecta tipo)
/editor?resource=quiz21StepsComplete   # Template
/editor?resource=abc-123-uuid          # Funnel do Supabase
/editor?resource=draft-123             # Rascunho local

# Modo novo (canvas vazio)
/editor
```

### Formato Legacy (Backward Compatible)

```bash
# Ainda funcionam, mas com warning no console
/editor?template=quiz21StepsComplete
/editor?funnelId=abc-123-uuid

# ⚠️ Console mostrará:
# "DEPRECATED: Use ?resource= em vez de ?template= ou ?funnelId="
```

---

## ✨ Recursos da Arquitetura Unificada

### 1. **Clonagem de Recursos**

Templates e funnels podem ser clonados:

```typescript
const { clone } = useEditorResource({ resourceId: 'quiz21StepsComplete' });

// Clonar template → cria funnel editável
const newFunnel = await clone('Meu Quiz Personalizado');

// newFunnel = {
//   id: 'clone-1730...',
//   type: 'funnel',
//   source: 'supabase' ou 'local',
//   isReadOnly: false,
//   metadata: { clonedFrom: 'quiz21StepsComplete' }
// }
```

### 2. **Read-Only Inteligente**

```typescript
// Templates são read-only por padrão
resource.type === 'template' → isReadOnly: true

// Funnels são editáveis
resource.type === 'funnel' → isReadOnly: false

// Drafts locais são editáveis
resource.type === 'draft' → isReadOnly: false
```

### 3. **Múltiplas Fontes de Dados**

```typescript
// Embedded: Templates built-in (JSON local)
source: 'embedded'

// Supabase: Funnels persistidos no banco
source: 'supabase'

// Local: Drafts em localStorage
source: 'local'
```

---

## 📊 Benefícios da Unificação

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Complexidade** | ❌ Lógica condicional em 5+ lugares | ✅ Única abstração |
| **Props** | ❌ templateId + funnelId duplicados | ✅ resourceId unificado |
| **Detecção** | ❌ Manual (query params) | ✅ Automática (por ID) |
| **Clonagem** | ❌ Código duplicado | ✅ Método unificado |
| **Testabilidade** | ❌ Testa 3 cenários diferentes | ✅ Testa 1 abstração |
| **Manutenção** | ❌ Mudanças em múltiplos locais | ✅ Mudanças centralizadas |

---

## 🧪 Como Testar

### 1. Template

```bash
# Abrir template
http://localhost:8080/editor?resource=quiz21StepsComplete

# Verificar no console:
✅ Tipo: template
✅ Fonte: embedded
✅ Read-only: true
✅ Pode clonar: true
```

### 2. Funnel (simulado)

```bash
# Abrir funnel fictício
http://localhost:8080/editor?resource=550e8400-e29b-41d4-a716-446655440000

# Verificar no console:
✅ Tipo: funnel
✅ Fonte: supabase
✅ Read-only: false
✅ Pode clonar: true
```

### 3. Modo Novo

```bash
# Canvas vazio
http://localhost:8080/editor

# Verificar:
✅ Modal de startup aparece
✅ Pode escolher "Novo" ou "Template"
✅ Cria draft local ao escolher "Novo"
```

---

## 🚀 Próximos Passos

### Fase 1: ✅ Completa
- [x] Criar tipos unificados (`EditorResource`)
- [x] Implementar `useEditorResource` hook
- [x] Atualizar `pages/editor/index.tsx`
- [x] Atualizar props do `QuizModularEditor`
- [x] Backward compatibility com props legadas

### Fase 2: Melhorias (Futuro)
- [ ] Remover props legadas após período de transição
- [ ] Implementar loader visual durante carregamento
- [ ] Adicionar botão "Clonar" na UI
- [ ] Implementar salvamento de clones no Supabase
- [ ] Criar página de listagem de recursos (`/editor/resources`)

### Fase 3: Otimizações (Futuro)
- [ ] Cache de recursos no IndexedDB
- [ ] Pre-fetch de recursos relacionados
- [ ] Lazy loading de metadata
- [ ] Histórico de versões para funnels

---

## 📝 Exemplos de Uso

### Exemplo 1: Componente que lista recursos

```typescript
import { useEditorResource } from '@/hooks/useEditorResource';

function ResourceList() {
  const templates = [
    'quiz21StepsComplete',
    'step-01',
    'intro-simples',
  ];

  return (
    <div>
      {templates.map(id => (
        <ResourceCard key={id} resourceId={id} />
      ))}
    </div>
  );
}

function ResourceCard({ resourceId }: { resourceId: string }) {
  const { resource, isLoading, clone } = useEditorResource({ resourceId });

  if (isLoading) return <Skeleton />;

  return (
    <Card>
      <h3>{resource?.name}</h3>
      <Badge>{resource?.type}</Badge>
      {resource?.canClone && (
        <Button onClick={() => clone()}>
          Clonar
        </Button>
      )}
    </Card>
  );
}
```

### Exemplo 2: Editor com controle de read-only

```typescript
function EditorPage() {
  const resourceId = new URLSearchParams(window.location.search).get('resource');
  const { resource, isReadOnly, clone } = useEditorResource({ resourceId });

  return (
    <div>
      {isReadOnly && (
        <Banner variant="warning">
          Este é um template somente leitura.
          <Button onClick={async () => {
            const newFunnel = await clone('Minha Cópia');
            window.location.href = `/editor?resource=${newFunnel.id}`;
          }}>
            Clonar para Editar
          </Button>
        </Banner>
      )}
      
      <QuizModularEditor 
        resourceId={resourceId}
        editorResource={resource}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
```

---

## 🔧 Troubleshooting

### Problema: "Template não carrega"
**Causa:** ID não reconhecido  
**Solução:** Verificar `detectResourceType()` e adicionar pattern ao regex

### Problema: "Funnel não salva"
**Causa:** `source: 'embedded'` não suporta salvamento  
**Solução:** Clone o recurso antes de editar (converte para `source: 'supabase'`)

### Problema: "Props legadas não funcionam"
**Causa:** Falta backward compatibility no componente  
**Solução:** Componente já suporta `templateId` e `funnelId` - verifique mapeamento

---

**Autor:** GitHub Copilot  
**Status:** ✅ **Pronto para uso**  
**Backward Compatible:** ✅ Sim (props legadas ainda funcionam)
